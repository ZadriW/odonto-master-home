/**
 * Botão "Refazer carrinho" na página Meus Pedidos (/account/orders).
 *
 * PÁGINA DE DETALHE: O botão é injetado dentro de .wake-account-full-order-details,
 * logo abaixo de .order-payment-details, para manter formato e posicionamento.
 *
 * PÁGINA DE LISTA: O script injeta o botão em cada .wake-account-order-details-button.
 */
(function () {
    'use strict';

    var CHECKOUT_CLONE_MUTATION_UUID = [
        'mutation CheckoutClone($checkoutId: Uuid!, $copyUser: Boolean) {',
        '  checkoutClone(checkoutId: $checkoutId, copyUser: $copyUser) {',
        '    checkoutId',
        '  }',
        '}'
    ].join(' ');
    var CHECKOUT_CLONE_MUTATION_STRING = [
        'mutation CheckoutClone($checkoutId: String!, $copyUser: Boolean) {',
        '  checkoutClone(checkoutId: $checkoutId, copyUser: $copyUser) {',
        '    checkoutId',
        '  }',
        '}'
    ].join(' ');

    function buildCheckoutCloneMutationInline(checkoutId) {
        var escaped = String(checkoutId).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        return [
            'mutation {',
            '  checkoutClone(checkoutId: "' + escaped + '", copyUser: false) {',
            '    checkoutId',
            '  }',
            '}'
        ].join(' ');
    }

    var ORDER_CHECKOUT_QUERY = [
        'query AccountOrderCheckout($customerAccessToken: String!, $orderId: Long!) {',
        '  customer(customerAccessToken: $customerAccessToken) {',
        '    order(orderId: $orderId) {',
        '      checkoutId',
        '    }',
        '  }',
        '}'
    ].join(' ');

    function getCheckoutUrl() {
        if (window.store && window.store.urls && window.store.urls.checkout_pages && window.store.urls.checkout_pages.checkout) {
            return window.store.urls.checkout_pages.checkout.home || (window.location.origin + '/checkout');
        }
        return window.location.origin + '/checkout';
    }

    function getStaticImgBase() {
        return (window.store && window.store.urls && window.store.urls.static_img)
            ? window.store.urls.static_img
            : (window.location.origin + '/static/img/');
    }

    function extractOrderIdFromHref(href) {
        if (!href || typeof href !== 'string') return null;
        try {
            var url = new URL(href, window.location.origin);
            if (url.searchParams && url.searchParams.has('orderId')) {
                return parseInt(url.searchParams.get('orderId'), 10) || null;
            }
            var match = url.pathname && url.pathname.match(/\/orders\/(\d+)/);
            if (match && match[1]) {
                return parseInt(match[1], 10) || null;
            }
            match = href.match(/orderId=(\d+)/);
            if (match && match[1]) {
                return parseInt(match[1], 10) || null;
            }
        } catch (e) {
            console.warn('Refill cart: não foi possível extrair orderId do href:', href, e);
        }
        return null;
    }

    function getOrderFromPage() {
        return typeof window.__ACCOUNT_ORDER__ !== 'undefined' ? window.__ACCOUNT_ORDER__ : null;
    }

    function getClient() {
        return (typeof client !== 'undefined' && client) ? client : window.client;
    }

    function parseCloneResponse(resp) {
        if (!resp) return null;
        var clone = null;
        var id = null;
        if (resp.checkoutClone && resp.checkoutClone.checkoutId != null) {
            return resp.checkoutClone.checkoutId;
        }
        if (resp.data && resp.data.checkoutClone && resp.data.checkoutClone.checkoutId != null) {
            return resp.data.checkoutClone.checkoutId;
        }
        if (resp.data && resp.data.data && resp.data.data.checkoutClone) {
            clone = resp.data.data.checkoutClone;
        } else if (resp.data && resp.data.checkoutClone) {
            clone = resp.data.checkoutClone;
        } else if (resp.checkoutClone) {
            clone = resp.checkoutClone;
        }
        if (clone && (clone.checkoutId != null)) return clone.checkoutId;
        return null;
    }

    function parseCloneFromError(err) {
        if (!err) return null;
        var payload = (err.response && err.response.data) || err.data || err.result || err;
        return parseCloneResponse(payload);
    }

    async function cloneCheckoutAndRedirect(checkoutId, btn) {
        var newCheckoutId = null;
        var rawCheckoutId = checkoutId != null ? String(checkoutId).trim() : '';

        if (!rawCheckoutId) {
            throw new Error('ID do carrinho do pedido não encontrado.');
        }

        var c = getClient();
        if (!c) {
            throw new Error('Cliente da loja não disponível. Recarregue a página e tente novamente.');
        }

        if (c.checkout && typeof c.checkout.clone === 'function') {
            try {
                var cloneResponse = await c.checkout.clone(rawCheckoutId);
                newCheckoutId = (cloneResponse && cloneResponse.checkoutId) ||
                    (cloneResponse && cloneResponse.data && cloneResponse.data.checkoutId) ||
                    parseCloneResponse(cloneResponse);
            } catch (e) {
                newCheckoutId = parseCloneFromError(e);
                if (!newCheckoutId) console.warn('Refill cart: client.checkout.clone falhou', e);
            }
        }

        if (!newCheckoutId && typeof c.query === 'function') {
            var mutations = [
                { query: CHECKOUT_CLONE_MUTATION_UUID, vars: { checkoutId: rawCheckoutId, copyUser: false } },
                { query: CHECKOUT_CLONE_MUTATION_STRING, vars: { checkoutId: rawCheckoutId, copyUser: false } },
                { query: buildCheckoutCloneMutationInline(rawCheckoutId), vars: {} }
            ];
            for (var i = 0; i < mutations.length && !newCheckoutId; i++) {
                try {
                    var resp = await c.query(mutations[i].query, mutations[i].vars);
                    if (resp && resp.errors && resp.errors.length > 0) {
                        console.warn('Refill cart: GraphQL errors', resp.errors);
                        continue;
                    }
                    newCheckoutId = parseCloneResponse(resp);
                } catch (e) {
                    newCheckoutId = parseCloneFromError(e);
                    if (!newCheckoutId) console.warn('Refill cart: client.query clone tentativa ' + (i + 1), e);
                }
            }
        }

        if (!newCheckoutId) {
            throw new Error('Não foi possível clonar o carrinho.');
        }

        if (c.cookie && typeof c.cookie.set === 'function') {
            c.cookie.set('carrinho-id', String(newCheckoutId));
        }
        window.location.href = getCheckoutUrl();
    }

    async function fetchOrderCheckoutId(orderId) {
        var c = getClient();
        if (!c || typeof c.query !== 'function') {
            throw new Error('Cliente GraphQL indisponível.');
        }
        if (!window.pageUser || !window.pageUser.customerAccessToken) {
            throw new Error('Usuário não autenticado.');
        }
        var variables = {
            customerAccessToken: window.pageUser.customerAccessToken,
            orderId: Number(orderId)
        };
        var response = await c.query(ORDER_CHECKOUT_QUERY, variables);
        var customer = (response && response.customer) || (response && response.data && response.data.customer);
        var order = customer && customer.order;
        return order && (order.checkoutId || order.checkout_id) ? (order.checkoutId || order.checkout_id) : null;
    }

    function showError(msg) {
        if (typeof showOverlay === 'function') {
            showOverlay('Refazer carrinho', msg || 'Não foi possível preparar o carrinho. Tente novamente.', true);
        }
    }

    async function onRefillClickFromDetail(ev) {
        ev.preventDefault();
        var btn = document.getElementById('account-refill-cart-btn');
        var order = getOrderFromPage();
        if (!order) {
            showError('Dados do pedido não encontrados.');
            return;
        }
        var checkoutId = order.checkoutId || order.checkout_id;
        if (!checkoutId && order.orderId && typeof fetchOrderCheckoutId === 'function') {
            try {
                checkoutId = await fetchOrderCheckoutId(order.orderId);
            } catch (e) {
                console.warn('Refill cart: não foi possível buscar checkoutId do pedido', e);
            }
        }
        if (!checkoutId) {
            showError('Este pedido não permite refazer o carrinho.');
            return;
        }
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Preparando carrinho...';
        }
        try {
            await cloneCheckoutAndRedirect(checkoutId, btn);
        } catch (err) {
            console.error('Refill cart (detalhe):', err);
            showError(err.message);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-shopping-cart mr-2" style="color: #fff;"></i> Refazer carrinho';
            }
        }
    }

    async function onRefillClickFromList(ev) {
        ev.preventDefault();
        var btn = ev.currentTarget;
        var orderId = parseInt(btn.dataset.orderId, 10);
        if (!orderId) {
            showError('Não foi possível identificar o pedido.');
            return;
        }
        btn.disabled = true;
        btn.textContent = 'Preparando carrinho...';
        try {
            var checkoutId = await fetchOrderCheckoutId(orderId);
            if (!checkoutId) {
                throw new Error('Este pedido não possui um carrinho associado.');
            }
            await cloneCheckoutAndRedirect(checkoutId, btn);
        } catch (err) {
            console.error('Refill cart (lista):', err);
            showError(err.message);
            btn.disabled = false;
            btn.textContent = 'Refazer carrinho';
        }
    }

    function createRefillButton(orderId) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'account-refill-cart-btn flex justify-start items-center shadow-md p-4 uppercase hover:shadow-none w-full md:w-auto';
        btn.setAttribute('aria-label', 'Refazer carrinho com os itens deste pedido');
        btn.dataset.orderId = String(orderId);

        var icon = document.createElement('i');
        icon.className = 'fas fa-shopping-cart mr-2';
        icon.style.color = '#fff';
        icon.setAttribute('aria-hidden', 'true');

        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Refazer carrinho'));

        btn.addEventListener('click', onRefillClickFromList);
        return btn;
    }

    function injectInListContainers() {
        var containers = document.querySelectorAll('.wake-account-order-details-button');
        if (!containers.length) return;
        containers.forEach(function (container) {
            if (container.querySelector('.account-refill-cart-btn')) return;
            if (container.id === 'account-refill-cart-wrapper') return;

            var link = container.querySelector('a[href*="orderId"], a[href*="/orders/"]');
            var href = link ? (link.href || link.getAttribute('href')) : null;
            var orderId = extractOrderIdFromHref(href);
            if (!orderId) return;

            container.appendChild(createRefillButton(orderId));
        });
    }

    function createDetailRefillButton() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'account-refill-cart-btn';
        btn.className = 'account-refill-cart-btn flex justify-start items-center shadow-md p-4 uppercase hover:shadow-none w-full md:w-auto';
        btn.setAttribute('aria-label', 'Refazer carrinho com os itens deste pedido');

        var icon = document.createElement('i');
        icon.className = 'fas fa-shopping-cart mr-2';
        icon.style.color = '#fff';
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(' Refazer carrinho'));

        btn.addEventListener('click', onRefillClickFromDetail);
        return btn;
    }

    function injectDetailRefillButton() {
        if (document.getElementById('account-refill-cart-btn')) return true;

        var wrapper = document.createElement('div');
        wrapper.id = 'account-refill-cart-wrapper';
        wrapper.className = 'wake-account-order-details-button';
        wrapper.appendChild(createDetailRefillButton());

        var inserted = false;

        var fullDetails = document.querySelector('.wake-account-full-order-details');
        var orderPaymentDetails = fullDetails ? fullDetails.querySelector('.order-payment-details') : null;
        if (fullDetails && orderPaymentDetails) {
            orderPaymentDetails.insertAdjacentElement('afterend', wrapper);
            inserted = true;
        }
        if (!inserted && fullDetails) {
            fullDetails.appendChild(wrapper);
            inserted = true;
        }
        if (!inserted) {
            var orderDetails = document.querySelector('.wake-account-order-details');
            if (orderDetails) {
                orderDetails.appendChild(wrapper);
                inserted = true;
            }
        }
        if (!inserted && document.querySelector('.wake-account-wrapper')) {
            var main = document.querySelector('.wake-account-wrapper');
            var sidebar = main.querySelector('[class*="sidebar"]');
            var content = main.querySelector('.wake-account') || main.querySelector('[class*="account"]');
            if (content) {
                content.appendChild(wrapper);
                inserted = true;
            }
        }

        return inserted;
    }

    function initDetailPage() {
        function tryInject(attempt) {
            if (document.getElementById('account-refill-cart-btn')) return;
            var done = injectDetailRefillButton();
            if (!done && attempt < 50) {
                setTimeout(function () { tryInject(attempt + 1); }, 250);
            }
        }

        tryInject(0);
        setTimeout(function () { tryInject(0); }, 400);
        setTimeout(function () { tryInject(0); }, 1000);
        window.addEventListener('load', function () {
            setTimeout(function () { tryInject(0); }, 300);
        });

        var observer = new MutationObserver(function () {
            if (!document.getElementById('account-refill-cart-btn')) {
                injectDetailRefillButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initListPage() {
        injectInListContainers();

        var observer = new MutationObserver(function () {
            injectInListContainers();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        var attempts = 0;
        var interval = setInterval(function () {
            injectInListContainers();
            attempts++;
            if (attempts >= 25) clearInterval(interval);
        }, 300);
    }

    function init() {
        if (getOrderFromPage()) {
            initDetailPage();
        } else {
            initListPage();
        }
    }

    function runWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
        window.addEventListener('load', init);
    }

    runWhenReady();
})();
