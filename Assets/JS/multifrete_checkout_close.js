window.addEventListener("load", closeSetup, false);

// As duas variavies servem salvar o tipo de tentiva e o dado em caso que o login simples não é aceito 
let returnLoginConcluded = "";
let dataLoginConcluded = "";

// Associa usuario com carrinho
// Caso usuario não exista abre um formulario com email/cpf preenchido para ser criado
async function closeSetup() {
    if (localStorage.getItem('wake_show_payment_rejected_modal') === 'true') {
        const modal = document.getElementById('modal-payment-rejected');
        if (modal) {
            showModal('modal-payment-rejected');
        } else {
            showOverlay(
                "OPS, TEM ALGO ERRADO!",
                "Não foi possível processar o pagamento. Revise os dados do cartão ou tente outra forma de pagamento.",
                true
            );
        }
        localStorage.removeItem('wake_show_payment_rejected_modal');
    }

    const token = client.cookie.get("sf_customer_access_token");
    if (!token) {
        return;
    }

    const response = await client.customer.accessTokenDetails(token);
    const details = response.data;

    if (details.type === "NEW") {
        const identifier = details.identifier;

        if (isValidCpf(identifier)) {
            const cpfInput = document.querySelector('[id="cpf"]');
            cpfInput.value = identifier;
            cpfInput.setAttribute('disabled', 'disabled');
        } else {
            const emailInput = document.querySelector('[id="email"]');
            emailInput.value = identifier;
            emailInput.setAttribute('disabled', 'disabled');
        }
        return;
    }

    const renderShipping = document.querySelector('[data-render-shipping]');
    const renderPayment = document.querySelector('[data-render-payment]');

    if (renderShipping) {
        renderOptionsShipping();
    }
    else if (renderPayment) {
        renderOptionsPayment();
    }
}

/**
 * Formulario para criar novo cliente apartir de carrinho
 * Associa usuario com carrinho,
 * Busca formulario com id 'accountCreateCloseForm'
 *
 * @param {CustomerCreateInput} input
 */
const accountCreateCloseSubmit = async (e) => {
    e.preventDefault();

    document.getElementById('text').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    const cpfInput = document.querySelector('[id="cpf"]');
    const emailInput = document.querySelector('[id="email"]');
    const birthdateElement = document.querySelector('[id="birthDate"]');
    const birthdateValue = birthdateElement?.value;

    const input = convertFormInObject(e.target);
    
    input.fullName = fullName.value;
    input.cpf = cpfInput.value;
    input.email = emailInput.value;
    input.birthDate = birthdateValue ? birthdateValue : null;
    input.isStateRegistrationExempt = document.getElementById('exemptStateRegistrationFree').checked;

    if ((!input.fullName || !input.cpf || !input.primaryPhoneAreaCode || !input.primaryPhoneNumber) && !input.cnpj) {
        if (!input.fullName) {
            document.getElementById('fullName').classList.add('border-red-600');
            document.getElementById('error-fullName').classList.remove('hidden');
        }
        if (!input.cpf) {
            document.getElementById('cpf').classList.add('border-red-600');
            document.getElementById('error-cpf').classList.remove('hidden');
        }
        if (!input.primaryPhoneAreaCode) {
            document.getElementById('primaryPhoneAreaCode').classList.add('border-red-600');
        }
        if (!input.primaryPhoneAreaCode) {
            document.getElementById('primaryPhoneNumber').classList.add('border-red-600');
            document.getElementById('error-primaryPhoneNumber').classList.remove('hidden');
        }
        document.getElementById('text').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
        return false;
    } else {
        document.getElementById('fullName').classList.remove('border-red-600');
        document.getElementById('cpf').classList.remove('border-red-600');
        document.getElementById('primaryPhoneAreaCode').classList.remove('border-red-600');
        document.getElementById('primaryPhoneNumber').classList.remove('border-red-600');
        document.getElementById('error-fullName').classList.add('hidden');
        document.getElementById('error-cpf').classList.add('hidden');
        document.getElementById('error-primaryPhoneNumber').classList.add('hidden');
    }

    const token = client.cookie.get("sf_customer_access_token");
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    const createResponse = await client.customer.completeRegistration(input, token, recaptchaToken);

    if (createResponse.errors) {
        showOverlay("Erro no formulário", createResponse.errors[0].message, true);
    } else {
        await renderUser();
        await renderAddressRegistration();
    }

    document.getElementById('text').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
}

/**
 * Formulario para criar novo endereço apartir de carrinho.
 * Apos endereço ser criado, função selectAddress é assionado.
 * Busca formulario com id 'addressCreateCloseForm'
 *
 * @param {CreateCustomerAddressInput} input
 */
const addressCreateCloseSubmit = async (e) => {
    try {
        e.preventDefault();
        const input = convertFormInObject(e.target);

        document.getElementById('text').classList.add('hidden');
        document.getElementById('loading').classList.remove('hidden');

        input.addressDetails = document.getElementById('addressDetails')?.value;
        input.address = document.getElementById('address')?.value;
        input.addressNumber = document.getElementById('addressNumber')?.value;
        input.state = document.getElementById('state')?.value;
        input.neighborhood = document.getElementById('neighborhood')?.value;
        input.city = document.getElementById('city')?.value;
        input.country = "BR";
        input.referencePoint = input.referencePoint === "" ? null : input.referencePoint;
        delete input.addressComplement;

        if (!input.addressNumber) {
            !input.addressNumber && document.getElementById('error-number')?.classList.remove('hidden');
            !input.addressNumber && document.getElementById('addressNumber')?.classList.add('border-red-600');
            document.getElementById('text')?.classList.remove('hidden');
            document.getElementById('loading')?.classList.add('hidden');
            return false;
        }

        const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
        const createResponse = await client.customer.createAddress(
            input,
            null, // customerAccessToken -> obtido pelo SDK
            recaptchaToken
        );

        if (createResponse.errors) {
            showOverlay("Erro no formulário", createResponse.errors[0].message, true);
        } else {
            var id = createResponse.data.id;
            await selectAddress(id);
        }
    }
    finally
    {
        document.getElementById('text').classList.remove('hidden');
        document.getElementById('loading').classList.add('hidden');
    }
}

/**
 * Formulario para editar endereço apartir de carrinho.
 * Apos endereço editado, função selectAddress é assionado.
 * Busca formulario com id 'addressUpdateCloseForm'
 *
 * @param {UpdateCustomerAddressInput} input
 */
const addressUpdateCloseSubmit = async (e) => {
    e.preventDefault();
    const input = convertFormInObject(e.target);

    if (!input.addressId){
        if(!input.cep) {
            document.getElementById('cep-error-message')?.classList.remove('hidden');
            document.getElementById('zipcode')?.classList.remove('border-secondary-300');
            document.getElementById('zipcode')?.classList.add('border-red-600');
            return;
        }
    
        document.getElementById('text')?.classList.add('hidden');
        document.getElementById('loading')?.classList.remove('hidden');
    }

    var id = input.addressId;
    input.referencePoint = input.referencePoint === "" ? null : input.referencePoint;
    delete input.addressId;

    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    const editResponse = await client.customer.editAddress(
        id,
        input,
        null, // customerAccessToken -> obtido pelo SDK
        recaptchaToken
    );

    if (editResponse.errors) {
        showOverlay("Erro no formulário", editResponse.errors[0].message, true);
    } else {
        var id = editResponse.data.id;
        await selectAddress(id);
    }

    document.getElementById('text')?.classList.remove('hidden');
    document.getElementById('loading')?.classList.add('hidden');
}

/**
 * Criar Endereço.
 * Reendereiza formulario para parar criar endereço.
 *
 */
const createAddress = async () => {
    const token = client.cookie.get("sf_customer_access_token");
    const response = await client.customer.accessTokenDetails(token);
    if (response.data.type === "SIMPLE") {
        returnLoginConcluded = "ADDRESS_CREATE";
        showModalLogin("modal-autenticate");
    }
    else await renderCreateAddress();
}

/**
 * Editar Endereço.
 * Reendereiza formulario para parar editar endereço.
 *
 * @param {String} id - id de endereço
 */
const updateAddress = async (id) => {
    const token = client.cookie.get("sf_customer_access_token");
    const response = await client.customer.accessTokenDetails(token);
    if (response.data.type === "SIMPLE") {
        returnLoginConcluded = "ADDRESS_UPDATE";
        dataLoginConcluded = id;
        showModalLogin("modal-autenticate");
    }
    else await renderUpdateAddress(id);
}

/**
 * Endereço selecionado.
 * Associa endereço com carrinho.
 * Reendereiza opções de entrega.
 *
 * @param {String} id
 */
const selectAddress = async (id) => {
    showLoading('loading-address', true);
    const checkoutId = client.cookie.get("carrinho-id");
    const token = client.cookie.get("sf_customer_access_token");
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    var result = await client.checkout.addressAssociate(id, checkoutId, token, recaptchaToken);

    if (result.errors) {
        showOverlay("Erro no formulário", result.errors[0].message, true);
        return;
    }

    let variables = {
        checkoutId: checkoutId,
        checkoutUuid: checkoutId,
        customerAccessToken: token
    };

    let snippetsHtml = [
        { html: "wake_checkout_close_address_selected_snippet.html", id: "data_address" },
        { html: "wake_payment_methods_list.html", id: "data_payment" }
    ];

    const snippets = await client.snippet.multi(snippetsHtml.map(({ html, _ }) => html),
        "SnippetQueries/wake_checkout_close_address_selected.graphql", variables);

    snippetsHtml.map(({ html, id }) => {
        setInnerHtmlById(snippets.find(s => s.name === html)?.result || "", id);
    });

    renderMultiFreteShipping(checkoutId);

    showLoading('loading-address', false);
}

/**
 * Renderiza os horários disponíveis para o agendamento
 *
 * @param {String} date - data do agendamento
 */
const renderScheduleShippingPeriods = (date) => {
    const periods = document.querySelectorAll('select[id^="schedule-shipping-periods-"]');
    periods.forEach(period => {
        if (period.id === `schedule-shipping-periods-${date}`) {
            period.classList.remove('hidden');
        } else {
            period.classList.add('hidden');
        }
    });
}

/**
 * Envio agendado selecionado.
 * Associa forma de envio com carrinho.
 * Reendereiza opções de pagamento.
 *
 * @param {String} id - id da forma de envio
 */
const selectScheduleShipping = async (id, distributionCenterId = null) => {
    const dateSelection = document.getElementById('schedule-shipping-dates');
    const periodSelection = document.getElementById(`schedule-shipping-periods-${dateSelection?.value}`);
    const checkoutId = client.cookie.get("carrinho-id");

    const input = {
        shippingQuoteId: id,
        checkoutId: checkoutId,
        deliveryScheduleInput: {
            date: dateSelection?.value,
            periodId: Number(periodSelection?.value)
        }
    };

    if (distributionCenterId) {
        input.distributionCenterId = distributionCenterId;
    }

    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    const result = await client.checkout.selectShippingQuoteWithDetails(input, recaptchaToken);

    if (result.errors) {
        showOverlay("Erro ao selecionar agendamento", result.errors[0].message, true);
        return;
    }

    await renderAfterShippingSelected();
}

/**
 * Envio selecionado.
 * Associa forma de envio com carrinho.
 * Reendereiza opções de pagamento.
 *
 * @param {String} id
 */
const selectShipping = async (id, distributionCenterId = null) => {
    renderFormPickUpStoreShipping(false);

    const checkoutId = client.cookie.get("carrinho-id");
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    let result;

    if (distributionCenterId) {
        const input = {
            shippingQuoteId: id,
            checkoutId: checkoutId,
            distributionCenterId: distributionCenterId
        };
        result = await client.checkout.selectShippingQuoteWithDetails(input, recaptchaToken);
    } else {
        result = await client.checkout.selectShippingQuote(id, checkoutId, recaptchaToken);
    }

    if (result.errors) {
        showOverlay("Erro no formulário", result.errors[0].message, true);
        return;
    }

    await renderAfterShippingSelected();
}

/**
 * Renderiza snippets após envio selecionado.
 */
const renderAfterShippingSelected = async () => {
    const checkoutId = client.cookie.get("carrinho-id");
    const token = client.cookie.get("sf_customer_access_token");

    let variables = {
        checkoutId: checkoutId,
        checkoutUuid: checkoutId,
        customerAccessToken: token
    };

    let snippetsHtml = [
        { html: "wake_payment_methods_list.html", id: "data_payment" },
        { html: "wake_checkout_close_summary_snippet.html", id: "data_summary" },
        { html: "wake_checkout_close_checking_account_choice_snippet.html", id: "data_checking_account" },
    ];

    const snippets = await client.snippet.multi(snippetsHtml.map(({ html, _ }) => html),
        "SnippetQueries/wake_checkout_close_shipping_selected.graphql", variables);

    snippetsHtml.map(({ html, id }) => {
        setInnerHtmlById(snippets.find(s => s.name === html)?.result || "", id);
    });

    await renderMultiFreteShippingSelected(checkoutId, token);
}

/**
 * Consulta os grupos de frete selecionados no checkout e renderiza
 * a exibição de frete confirmado (substituindo o antigo snippet
 * wake_checkout_close_shipping_selected_snippet.html que não suporta multi-CD).
 *
 * @param {String} checkoutId
 * @param {String} token
 */
async function renderMultiFreteShippingSelected(checkoutId, token) {
    const query = `
        query GetCheckoutShippingGroups($checkoutId: String!, $customerAccessToken: String!) {
            checkout(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
                shippingFee
                selectedShippingGroups {
                    distributionCenter {
                        id
                        sellerName
                        name
                    }
                    selectedShipping {
                        shippingQuoteId
                        name
                        type
                        value
                        deadline
                        deadlineInHours
                    }
                }
            }
        }
    `;

    const response = await client.query(query, {
        checkoutId: checkoutId,
        customerAccessToken: token
    });

    const shippingGroups = response?.data?.checkout?.selectedShippingGroups;
    const shippingFee = response?.data?.checkout?.shippingFee;

    if (shippingGroups && shippingGroups.length > 0) {
        const fmtCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

        let groupsHTML = shippingGroups.map(group => {
            if (!group.selectedShipping) return '';
            const cdName = group.distributionCenter?.name || 'Centro de Distribuição';
            const sellerName = group.distributionCenter?.sellerName;
            const shipping = group.selectedShipping;

            return `
                <div class="shipping-group-selected-item">
                    <div class="shipping-group-selected-header">
                        <span class="shipping-group-cd-name">${cdName}</span>
                        ${sellerName ? `<span class="shipping-group-seller-name">Vendido por: ${sellerName}</span>` : ''}
                    </div>
                    <div class="shipping-group-selected-details">
                        <span class="shipping-group-method-name">${shipping.name}</span>
                        <span class="shipping-group-method-value">${fmtCurrency(shipping.value)}</span>
                        ${shipping.deadline ? `<span class="shipping-group-method-deadline">${shipping.deadline} ${shipping.deadline === 1 ? ' dia útil' : ' dias úteis'}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="shipping-quote-groups-selected-container">
                <h2 class="wake-checkout-title">Entrega</h2>
                ${groupsHTML}
                <div class="shipping-quote-groups-selected-total">
                    <span>Total do Frete:</span>
                    <span>${fmtCurrency(shippingFee)}</span>
                </div>
                <button type="button" class="shipping-quote-groups-change-btn" onclick="renderOptionsShipping()">Alterar entrega</button>
            </div>
        `;

        setInnerHtmlById(html, "data_shipping");
    }
}

/**
 * Envio como retirada de entrega selecionado.
 * Associa forma de envio com carrinho.
 * Reendereiza opções de pagamento.
 *
 */
const selectPickUpStoreShipping = async (distributionCenterId = null) => {
    const storeSelectElement = document.getElementById('pickup_store_select');
    
    if (!storeSelectElement.value) {
        showOverlay("Erro no formulário", "Selecione uma loja física", true);
        return;
    }

    const input = {
        shippingQuoteId: storeSelectElement.value,
        checkoutId: client.cookie.get("carrinho-id")
    };

    if (distributionCenterId) {
        input.distributionCenterId = distributionCenterId;
    }

    const requirePickupInfo = document.getElementById('require_pickup_info');
    
    if (requirePickupInfo) {
        const nameInputElement = document.getElementById('pickup_name');
        const documentInputElement = document.getElementById('pickup_document');

        if (!nameInputElement.value) {
            showOverlay("Erro no formulário", "Informe o nome completo", true);
            return;
        }
        
        if (!documentInputElement.value) {
            showOverlay("Erro no formulário", "Informe o documento", true);
            return;
        }

        input.additionalInformation = {
            name: nameInputElement.value,
            document: documentInputElement.value
        };
    }

    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    const result = await client.checkout.selectShippingQuoteWithDetails(input, recaptchaToken);

    if (result.errors) {
        showOverlay("Erro ao enviar os dados", result.errors[0].message, true);
        return;
    }

    await renderAfterShippingSelected();
}

/**
 * Oculta um bloco de formulário de pagamento (classe .hidden + display, para vencer CSS do tema).
 * @param {Element} el
 */
function hideWakePaymentPanelElement(el) {
    if (!el) return;
    el.classList.add('hidden');
    el.style.display = 'none';
}

/**
 * Exibe bloco de formulário. .wake-payment-data-options costuma vir com display:none no CSS global.
 * @param {Element} el
 */
function showWakePaymentPanelElement(el) {
    if (!el) return;
    el.classList.remove('hidden');
    el.style.display = '';
    if (el.classList.contains('wake-payment-data-options')) {
        el.style.display = 'block';
    }
}

/**
 * Linha do checkout com Cartão + Pix (multipagamento). Não escondemos wrappers internos individualmente
 * ao alternar outros métodos — só o painel inteiro da linha inativa some.
 * @param {Element} item
 * @returns {boolean}
 */
function rowIsCartaoPixMultipayment(item) {
    return !!(item && item.querySelector('.wake-multipayment-selector'));
}

/**
 * Garante um único método com `.wake-payment-data-options` / `[data-payment-wrapper]` visível.
 * Linhas inativas: tudo oculto. Linha ativa Cartão + Pix: container e todos os wrappers internos visíveis.
 * Demais linhas ativas: tenta o wrapper que bate com paymentId; senão o primeiro da linha.
 *
 * @param {string} paymentId
 */
function syncExclusiveWakePaymentDataOptions(paymentId) {
    const root = document.querySelector('.wake-payment-list');
    if (!root) return;

    const rows = root.querySelectorAll('.wake-payment-method-item, .payment-option');
    rows.forEach((item) => {
        const active = item.classList.contains('active');
        const optionBlocks = item.querySelectorAll('.wake-payment-data-options');
        const wrappers = item.querySelectorAll('[data-payment-wrapper]');

        if (!active) {
            optionBlocks.forEach(hideWakePaymentPanelElement);
            wrappers.forEach(hideWakePaymentPanelElement);
            return;
        }

        optionBlocks.forEach(showWakePaymentPanelElement);

        if (rowIsCartaoPixMultipayment(item)) {
            wrappers.forEach(showWakePaymentPanelElement);
            return;
        }

        wrappers.forEach(hideWakePaymentPanelElement);
        const byId =
            paymentId &&
            (item.querySelector(`[data-payment-wrapper="${paymentId}"]`) ||
                item.querySelector(`[data-payment-wrapper-id="${paymentId}"]`));
        const fallback = item.querySelector('[data-payment-wrapper]');
        const toShow = byId || fallback;
        if (toShow) {
            showWakePaymentPanelElement(toShow);
        }
    });
}

/**
 * Reaplica sincronização após pintura do DOM (SDK / gateway injetam HTML com atraso).
 * @param {string} paymentId
 */
function scheduleExclusiveWakePaymentPanels(paymentId) {
    syncExclusiveWakePaymentDataOptions(paymentId);
    requestAnimationFrame(() => syncExclusiveWakePaymentDataOptions(paymentId));
    setTimeout(() => syncExclusiveWakePaymentDataOptions(paymentId), 0);
    setTimeout(() => syncExclusiveWakePaymentDataOptions(paymentId), 200);
}

/**
 * Pagamento selecionado.
 * Associa forma de pagamento com carrinho.
 *
 * @param {Boolean} cart - Opção para usar formulario de novo cartao de credito
 * @param {String} paymentId
 */
const selectPayment = async (paymentId) => {
    const loading = document.getElementById('payment-loading');
    loading.classList.remove('hidden');
    loading.classList.add('flex');

    try {
        try {
            const allPaymentMethodItems = document.querySelectorAll('.wake-payment-method-item, .payment-option');
            if (allPaymentMethodItems?.length > 0) {
                allPaymentMethodItems.forEach((item) => item.classList.remove('active'));
            }

            const selectedInput = document.getElementById(`paymentOption-${paymentId}`);
            if (selectedInput) {
                const selectedNavItem =
                    selectedInput.closest('.wake-payment-method-item') || selectedInput.closest('.payment-option');
                if (selectedNavItem) {
                    selectedNavItem.classList.add('active');
                } else {
                    console.error('Elemento pai (.wake-payment-method-item / .payment-option) não encontrado para o método selecionado');
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar estado visual dos métodos de pagamento:', error);
        }

        scheduleExclusiveWakePaymentPanels(paymentId);

        const checkoutId = client.cookie.get("carrinho-id");

        let result = null;
        const hasLegacyRenderer = typeof selectPaymentWhenRendering === 'function';

        if (hasLegacyRenderer) {
            result = await selectPaymentWhenRendering(checkoutId, paymentId);
        } else if (typeof client.checkout?.selectPaymentMethod === 'function') {
            // Fallback para manter o fluxo funcional quando o helper legado
            // não estiver disponível no escopo global.
            try {
                result = await client.checkout.selectPaymentMethod(paymentId, checkoutId);
            } catch (_) {
                result = await client.checkout.selectPaymentMethod({
                    paymentMethodId: paymentId,
                    checkoutId: checkoutId
                });
            }
        } else {
            console.warn('selectPaymentWhenRendering não está disponível e não há fallback de SDK para seleção de pagamento.');
            result = {};
        }

        scheduleExclusiveWakePaymentPanels(paymentId);

        await renderSummary();

        scheduleExclusiveWakePaymentPanels(paymentId);

        if(result?.errors) {
            showOverlay("Erro ao selecionar o pagamento", result.errors[0].message, true);
            return;
        }
        
        document.getElementById('btn-sumary-close').disabled = false;
    }
    catch(error) {
        console.error('Erro ao selecionar o pagamento:', error);
    }
    finally {
        loading.classList.add('hidden');
        loading.classList.remove('flex');
    }
}


/**
 * Conta corrente selecionado.
 * Associa/remove saldo de conta corrente com carrinho.
 *
 * @param {Boolean} checkingAccount - Opção para usar/remover saldo de conta corrente
 */
const selectCheckingAccount = async (checkingAccount) => {
    const token = client.cookie.get("sf_customer_access_token");
    const response = await client.customer.accessTokenDetails(token);

    if (response.data.type === "SIMPLE") {
        returnLoginConcluded = "CHECKING_ACCOUNT";
        dataLoginConcluded = checkingAccount;
        showModalLogin("modal-autenticate");
    } else {
        const checkoutId = client.cookie.get("carrinho-id");
        const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
        const response = await client.snippet.render("wake_checkout_close_summary_snippet.html", "SnippetQueries/wake_checkout_close_checking_account_selected.graphql",
            {
                checkoutId: checkoutId,
                useBalance: checkingAccount,
                customerAccessToken: token,
                recaptchaToken: recaptchaToken
            });
        setInnerHtmlById(response, "data_summary");
        await renderOptionsPayment();
    }
}

const addCoupon = async () => {
    const coupon = document.getElementById('coupon').value;
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    let couponResponse = await client.checkout.addCoupon(coupon, null, recaptchaToken);  

    if (couponResponse.errors?.length > 0){
      showOverlay('Erro ao adicionar cupom!', couponResponse.errors[0]?.message, true);  
    }
    else {
        await afterCouponSuccessOperation();
    }
}

const removeCoupon = async () => {
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    let couponResponse = await client.checkout.removeCoupon(null, recaptchaToken);  

    if (couponResponse.errors?.length > 0){
      showOverlay('Erro ao remover cupom!', couponResponse.errors[0]?.message, true);  
    }
    else {
        await afterCouponSuccessOperation();
    }
}

let afterCouponSuccessOperation = async () => {
    const token = client.cookie.get("sf_customer_access_token");
    const checkoutId = client.cookie.get("carrinho-id");

    const variables = {
        checkoutId: checkoutId,
        customerAccessToken: token
    };

    const snippetsHtml = [
        { html: "wake_checkout_coupon_snippet.html", id: "checkout_coupon_snippet" },
        { html: "wake_checkout_close_summary_snippet.html", id: "data_summary" }
    ];

    const snippets = await client.snippet.multi(snippetsHtml.map(({ html, _ }) => html),
        "SnippetQueries/wake_checkout.graphql", variables);

    snippetsHtml.map(({ html, id }) => {
        setInnerHtmlById(snippets.find(s => s.name === html)?.result || "", id);
    });

    const selectedPaymentMethod = document.querySelector('input[name="paymentOption"]:checked');
    if (selectedPaymentMethod) {
        enableCloseButtonIfExists();
    }
}

/**
 * Autenticação padrão
 * Busca formulario com id 'authenticateForm'
 *
 * @param {form} login
 * @param {form} senha
 */
const authenticateCompletSubmit = async (e) => {
    e.preventDefault();

    const input = convertFormInObject(e.target);
    const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
    const response = await client.customer.authenticate(input.email, input.password, recaptchaToken);

    if (response?.data?.token) {
        closeModalLogin('modal-autenticate');
        if (returnLoginConcluded == "ADDRESS_CREATE") {
            await renderCreateAddress();
        }
        else if (returnLoginConcluded == "ADDRESS_UPDATE") {
            await renderUpdateAddress(dataLoginConcluded);
        }
        else if (returnLoginConcluded == "CHECKING_ACCOUNT") {
            await selectCheckingAccount(dataLoginConcluded);
        }
    } else showOverlay("Erro ao autenticar usuário", response.errors[0]?.message, true);
}

// Conclusão pedido
const closeCheckout = async () => {
    if (window.WakeCheckoutInProgress) {
        return;
    }

    const redirectToConfirmationPage = (checkoutId) => {
        window.location = `${checkout_pages.checkout.confirmation}?checkoutId=${checkoutId}`;
    };

    const checkoutSupportMessage = "Não foi possível confirmar a finalização do pedido. Entre em contato com o suporte da loja para validar o status da compra.";

    const verifyCheckoutWasClosed = async (originalCheckoutId) => {
        try {
            const query = `
                query CheckoutLite($checkoutId: Uuid!) {
                    checkout: checkoutLite(checkoutId: $checkoutId) {
                        completed
                    }
                }
            `;

            const checkoutLiteResponse = await client.query(query, { checkoutId: originalCheckoutId });
            if (checkoutLiteResponse?.errors?.length > 0) {
                return false;
            }

            return checkoutLiteResponse?.data?.checkout?.completed === true;
        } catch (_) {
            return false;
        }
    };

    let checkoutCompleteStarted = false;
    let checkoutId = null;

    try {    
        window.WakeCheckoutInProgress = true;
        
        document.getElementById('btn-summary-text').classList.add('hidden');
        document.getElementById('btn-summary-loading').classList.remove('hidden');

        const validateResult = await Fbits.Gateway.ExecuteValidateCallbacks();
        const allValid = validateResult.every(item => item === true);
        if(!allValid) {
            const errorAlreadyNotified = Fbits.Gateway.IsValidationErrorAlreadyNotified();
            if (!errorAlreadyNotified) {
                showOverlay("Erro ao validar pagamento", "Ocorreu um erro ao validar o pagamento, confira os dados de pagamento e tente novamente!", true);
            }
            return;
        }

        await Fbits.Gateway.ExecutePayCallbacks();

        const closeObservationInput = document.getElementById('closeObservation');
        const comments = closeObservationInput.value;

        const token = client.cookie.get("sf_customer_access_token");
        checkoutId = client.cookie.get("carrinho-id");

        const paymentContainers = document.querySelectorAll('[data-payment-transaction-id]');
        const paymentData = wakeGetPaymentDataFromContainers(paymentContainers);
        const recaptchaToken = typeof window.getWakeRecaptchaToken === 'function' ? await getWakeRecaptchaToken() : null;
        checkoutCompleteStarted = true;
        const checkoutData = await client.checkout.complete(checkoutId, comments, token, paymentData, recaptchaToken);

        if (checkoutData.newCheckout) {
            localStorage.setItem('wake_show_payment_rejected_modal', 'true');
            window.location.reload();
            return;
        }

        if (checkoutData?.completeResponse?.errors) {
            const checkoutWasClosed = await verifyCheckoutWasClosed(checkoutId);
            if (checkoutWasClosed) {
                redirectToConfirmationPage(checkoutId);
                return;
            }

            showOverlay("Erro ao finalizar o pedido", checkoutSupportMessage, true);
            return;
        }

        pushDataLayerCheckoutPurchaseEvent(checkoutData);

        redirectToConfirmationPage(checkoutId);
    } catch (err) {
        if (checkoutCompleteStarted && checkoutId) {
            const checkoutWasClosed = await verifyCheckoutWasClosed(checkoutId);
            if (checkoutWasClosed) {
                redirectToConfirmationPage(checkoutId);
                return;
            }

            showOverlay("Erro ao finalizar o pedido", checkoutSupportMessage, true);
        }

        throw err;

    } finally {
        window.WakeCheckoutInProgress = false;

        document.getElementById('btn-summary-text').classList.remove('hidden');
        document.getElementById('btn-summary-loading').classList.add('hidden');
    }
}

function pushDataLayerCheckoutPurchaseEvent(checkoutData){
    if (checkoutData?.completeResponse?.data?.completed && checkoutData.newCheckout == null){
        window.dispatchEvent(
            new CustomEvent('checkoutPurchaseEvent', {
                detail: {
                    checkout: checkoutData.completeResponse.data
                }
            })
        );
    }
}

async function renderUser() {
    const checkoutId = client.cookie.get("carrinho-id");
    const token = client.cookie.get("sf_customer_access_token");

    await client.checkout.customerAssociate(checkoutId, token);

    const response = await client.snippet.render("wake_checkout_close_user_information_snippet.html", "SnippetQueries/wake_checkout_close_user_information.graphql",
        {
            customerAccessToken: token,
            hasCustomerAccessToken: true
        });

    setInnerHtmlById(response, "data_user");
}

async function renderCreateAddress() {
    var registration = document.getElementById('data_address_registration');
    registration.style.display = 'block';

    var information = document.getElementById('data_address_information');
    information.style.display = 'none';
}

async function renderFormWithCepAddress() {
    try {
        const cep = document.getElementById('zipcode').value.trim().replace(/\D/g, '');

        if (cep.length !== 8) {
            return;
        }

        const variables = {
            cep: cep
        }

        const response = await client.snippet.detailed("wake_checkout_address_snippet.html",
            "SnippetQueries/wake_account_address.graphql", variables);

        if (response?.queryResponse?.errors?.length > 0) {
            await showOverlay("Erro ao buscar endereço", response.queryResponse.errors[0]?.message, true);
            return;
        }

        setInnerHtmlById(response.html, "resultGetRenderFormAddress");
        document.getElementById('InputCep')?.classList.add('hidden');
    } catch (error) {
        console.log(error);
    }
}

async function renderOptionsAddress() {
    const token = client.cookie.get("sf_customer_access_token");
    const response = await client.snippet.render("wake_checkout_close_address_information_snippet.html", "SnippetQueries/wake_checkout_close_address_information.graphql",
        {
            customerAccessToken: token,
            hasCustomerAccessToken: true
        });
    setInnerHtmlById(response, "data_address");
}

async function renderUpdateAddress(addressId) {
    const response = await client.snippet.render("wake_checkout_close_address_update_snippet.html", "SnippetQueries/wake_account_edit_address.graphql",
        {
            customerAccessToken: await client.cookie.get('sf_customer_access_token'),
            hasCustomerAccessToken: true,
            addressId: addressId
        }
    );

    setInnerHtmlById(response, "data_address");
}

async function renderFormPickUpStoreShipping(pickUpStore) {
    let pickUpStoreElement = document.getElementById('pickUpStoreCloseForm');
    if (pickUpStoreElement) {
        pickUpStoreElement.style.display = pickUpStore ? 'block' : 'none';
    }
}

async function renderOptionsShipping() {
    const checkoutId = client.cookie.get("carrinho-id");
    renderMultiFreteShipping(checkoutId);
}

/**
 * Renderiza o container de multi-frete e carrega os grupos de cotação.
 * Substitui o antigo snippet wake_checkout_close_shipping_choice_snippet.html
 * pelo sistema de shippingQuoteGroups (multi-CD).
 *
 * @param {String} checkoutId
 */
function renderMultiFreteShipping(checkoutId) {
    const shippingContainer = document.getElementById('data_shipping');
    if (!shippingContainer) return;

    shippingContainer.innerHTML = `
        <div id="shipping-quote-groups-container"
             data-shipping-groups-container="true"
             data-checkout-id="${checkoutId}">
            <div class="shipping-quote-groups-loading">
                <div class="shipping-quote-groups-spinner"></div>
                <span>Carregando opções de entrega...</span>
            </div>
        </div>
    `;

    loadShippingQuoteGroups(checkoutId, true);
}

async function renderOptionsPayment() {
    const checkoutId = client.cookie.get("carrinho-id");
    const token = client.cookie.get("sf_customer_access_token");
    const variables = {
        checkoutId: checkoutId,
        checkoutUuid: checkoutId,
        customerAccessToken: token
    };

    const response = await client.snippet.render("wake_payment_methods_list.html",
        "SnippetQueries/wake_checkout_close_payment_choice_snippet.graphql", variables);

    setInnerHtmlById(response, "data_payment");
}

async function renderSummary() {
    const checkoutId = client.cookie.get("carrinho-id");
    const response = await client.snippet.render("wake_checkout_close_summary_snippet.html", "SnippetQueries/wake_checkout_close_summary.graphql",
        {
            checkoutId: checkoutId
        });

    setInnerHtmlById(response, "data_summary");
}

const showModalLogin = async (component) => {
    showModal(component);
}

const closeModalLogin = (component) => {
    closeModal(component);
}

const showLoading = (element, action) => {
    if(document.getElementById(element)){
        if(action){
            document.getElementById(element).classList.remove('hidden');
            document.getElementById(element).classList.add('flex');
        }else{
            document.getElementById(element).classList.add('hidden');
            document.getElementById(element).classList.remove('flex');
        }
    }
} 

async function renderAddressRegistration() {
    const response = await client.snippet.render("wake_checkout_address_registration_close_snippet.html", "SnippetQueries/wake_checkout_address_registration_close.graphql",
        {
            customerAccessToken: await client.cookie.get('sf_customer_access_token'),
            hasCustomerAccessToken: true
        });

    setInnerHtmlById(response, "data_address");
}

const enableCloseButtonIfExists = () => {
    const btnClose = document.getElementById('btn-sumary-close');
    
    if (btnClose) {
        btnClose.disabled = false;
    }
}