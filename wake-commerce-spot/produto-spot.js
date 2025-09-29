// ===== FUSÃO WAKE COMMERCE + PROJETO BASE - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wake Commerce Spot - DOM fully loaded and parsed');

    // Verificar se o app principal está inicializado
    if (!window.app || !window.app.productDB) {
        console.error('App principal não inicializado. Aguardando inicialização...');
        // Aguardar a inicialização do app
        const checkAppReady = setInterval(() => {
            if (window.app && window.app.productDB) {
                clearInterval(checkAppReady);
                initializeSpotPage();
            }
        }, 100);
    } else {
        initializeSpotPage();
    }
});

// ===== INICIALIZAÇÃO PRINCIPAL =====
function initializeSpotPage() {
    console.log('App está pronto, inicializando Wake Commerce Spot...');

    // Inicializar funcionalidades do spot
    initWakeCommerceSpot();

    // Inicializar funcionalidades expandidas
    initExpandedGallery();
    initExpandedVariations();
    initExpandedQuantityControls();
    initExpandedTabs();
    initExpandedReviewForm();
    initExpandedShippingCalculator();

    // Inicializar contador do carrinho
    initializeCartCount();

    // Carregar dados do produto da URL
    loadSpotProductFromUrl();

    console.log('Wake Commerce Spot - Todas as funcionalidades inicializadas');
}

// ===== FUNCIONALIDADES DO WAKE COMMERCE SPOT =====
function initWakeCommerceSpot() {
    console.log('Inicializando funcionalidades do Wake Commerce Spot...');

    // Inicializar botões do spot
    initSpotButtons();

    // Inicializar hover effects
    initSpotHoverEffects();

    // Inicializar etiquetas dinâmicas
    initSpotLabels();
}

// ===== BOTÕES DO SPOT =====
function initSpotButtons() {
    // Botão adicionar ao carrinho do spot
    const spotAddToCart = document.querySelector('.addtocart.spot-add-to-cart');
    if (spotAddToCart) {
        spotAddToCart.addEventListener('click', function(e) {
            e.preventDefault();
            handleSpotAddToCart();
        });
    }

    // Botão comprar agora do spot
    const spotBuyNow = document.getElementById('spotBuyNow');
    if (spotBuyNow) {
        spotBuyNow.addEventListener('click', function(e) {
            e.preventDefault();
            handleSpotBuyNow();
        });
    }

    // Botão lista de desejos
    const wishlistBtn = document.querySelector('.addtowishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleAddToWishlist();
        });
    }

    // Botão comparar
    const compareBtn = document.querySelector('.comparelink');
    if (compareBtn) {
        compareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleCompareProduct();
        });
    }
}

// ===== EFEITOS DE HOVER DO SPOT =====
function initSpotHoverEffects() {
    const spotItem = document.querySelector('.item.spot');
    if (spotItem) {
        // Efeito de hover suave
        spotItem.addEventListener('mouseenter', function() {
            this.classList.add('spot-hover');
        });

        spotItem.addEventListener('mouseleave', function() {
            this.classList.remove('spot-hover');
        });
    }

    // Efeito de zoom na imagem do produto
    const spotImage = document.querySelector('.spot-image');
    if (spotImage) {
        spotImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        spotImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// ===== ETIQUETAS DINÂMICAS =====
function initSpotLabels() {
    // Atualizar etiquetas baseadas no produto
    updateSpotLabels();
}

function updateSpotLabels() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && window.app && window.app.productDB) {
        const product = window.app.productDB.getProduct(productId);
        if (product) {
            // Atualizar etiqueta de desconto
            const discountLabel = document.getElementById('spotDiscount');
            if (discountLabel && product.discount) {
                discountLabel.textContent = `${product.discount}% OFF`;
                discountLabel.style.display = 'block';
            }

            // Atualizar disponibilidade do spot
            updateSpotAvailability(product);
        }
    }
}

// ===== DISPONIBILIDADE DO SPOT =====
function updateSpotAvailability(product) {
    const spotItem = document.querySelector('.item.spot');
    if (!spotItem) return;

    if (product.inStock === false) {
        // Produto indisponível
        spotItem.classList.add('spot-indisponivel');
        spotItem.classList.remove('spot-disponivel');

        // Substituir área de detalhes por mensagem de indisponível
        const detailsArea = document.querySelector('.details-area.fbits-spot-conteudo');
        if (detailsArea) {
            detailsArea.innerHTML = `
                <h2 class="product-name">
                    <a href="#" title="${product.name}">${product.name}</a>
                </h2>
                <div class="actions">
                    <div class="spotIndisponivel">
                        Produto Indisponível
                        <br />
                        <button class="btn-avise-me" onclick="handleAvisarDisponivel('${product.id}')">
                            Avise-me quando estiver disponível
                        </button>
                    </div>
                </div>
            `;
        }
    } else {
        // Produto disponível
        spotItem.classList.add('spot-disponivel');
        spotItem.classList.remove('spot-indisponivel');
    }
}

// ===== HANDLERS DOS BOTÕES DO SPOT =====
function handleSpotAddToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const quantity = parseInt(document.getElementById('quantity')?.value || 1);

    if (productId) {
        const product = getProductForCart(productId, quantity);
        if (product) {
            // Animação do botão
            const button = document.querySelector('.addtocart.spot-add-to-cart');
            const originalText = button.innerHTML;

            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adicionando...';
            button.style.pointerEvents = 'none';

            // Adicionar ao carrinho
            if (addToCart(product)) {
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';

                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.pointerEvents = 'auto';
                    }, 2000);
                }, 1000);

                showSpotNotification('Produto adicionado ao carrinho!', 'success');
            } else {
                button.innerHTML = originalText;
                button.style.pointerEvents = 'auto';
                showSpotNotification('Erro ao adicionar produto ao carrinho', 'error');
            }
        }
    }
}

function handleSpotBuyNow() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const quantity = parseInt(document.getElementById('quantity')?.value || 1);

    if (productId) {
        const product = getProductForCart(productId, quantity);
        if (product) {
            // Animação do botão
            const button = document.getElementById('spotBuyNow');
            const originalText = button.innerHTML;

            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            button.style.pointerEvents = 'none';

            // Adicionar ao carrinho e redirecionar
            if (addToCart(product)) {
                setTimeout(() => {
                    window.location.href = '/pages/checkout/index.html';
                }, 1500);
            } else {
                button.innerHTML = originalText;
                button.style.pointerEvents = 'auto';
                showSpotNotification('Erro ao processar compra', 'error');
            }
        }
    }
}

function handleAddToWishlist() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Simular adição à lista de desejos
        const button = document.querySelector('.addtowishlist');
        button.style.background = 'var(--cor-erro)';
        button.style.color = '#fff';
        button.innerHTML = '<i class="fas fa-heart"></i>';

        showSpotNotification('Produto adicionado à lista de desejos!', 'success');
        console.log('Produto adicionado à wishlist:', productId);
    }
}

function handleCompareProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Simular adição à comparação
        const button = document.querySelector('.comparelink');
        button.style.background = 'var(--cor-aviso)';
        button.style.color = '#fff';

        showSpotNotification('Produto adicionado à comparação!', 'success');
        console.log('Produto adicionado à comparação:', productId);
    }
}

function handleAvisarDisponivel(productId) {
    // Abrir modal ou formulário para avisar quando disponível
    const email = prompt('Digite seu e-mail para ser avisado quando o produto estiver disponível:');
    if (email && validateEmail(email)) {
        showSpotNotification('Você será avisado quando o produto estiver disponível!', 'success');
        console.log('Email cadastrado para aviso:', email, 'Produto:', productId);
    }
}

// ===== CARREGAR DADOS DO PRODUTO NO SPOT =====
function loadSpotProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId && window.app && window.app.productDB) {
        const product = window.app.productDB.getProduct(productId);
        if (product) {
            updateSpotProductInfo(product);
            updateSpotPricing(product);
            updateExpandedProductInfo(product);
        }
    } else {
        // Fallback para dados fictícios se não encontrar o produto
        loadFallbackSpotData();
    }
}

// ===== ATUALIZAR INFORMAÇÕES DO SPOT =====
function updateSpotProductInfo(product) {
    // Atualizar título
    const spotTitle = document.getElementById('spotProductTitle');
    if (spotTitle) {
        spotTitle.textContent = product.name;
        spotTitle.title = product.name;
    }

    // Atualizar informações
    const spotInfo = document.getElementById('spotInfo');
    if (spotInfo) {
        spotInfo.textContent = product.description || 'Produto de qualidade para profissionais da odontologia';
    }

    // Atualizar imagem principal
    const spotImage = document.getElementById('spotMainImage');
    if (spotImage && product.image) {
        spotImage.src = product.image;
        spotImage.alt = product.name;
        spotImage.onerror = function() {
            this.src = 'https://placehold.co/400x400/e8ece9/333?text=Imagem+Indisponível';
        };
    }

    // Atualizar meta tags
    document.title = `${product.name} | Odonto Master`;

    // Atualizar breadcrumb
    updateSpotBreadcrumb(product);
}

// ===== ATUALIZAR PREÇOS DO SPOT =====
function updateSpotPricing(product) {
    let priceCurrent = product.price_current || product.price;
    let priceOriginal = product.price_original;
    let discount = product.discount || 0;

    // Calcular preços se necessário
    if (!priceOriginal && discount > 0) {
        priceOriginal = priceCurrent / (1 - discount / 100);
    } else if (!priceOriginal) {
        priceOriginal = priceCurrent * 1.2;
    }

    // Converter de centavos para reais se necessário
    const priceInReais = (priceCurrent > 1000) ? priceCurrent / 100 : priceCurrent;
    const originalPriceInReais = (priceOriginal > 1000) ? priceOriginal / 100 : priceOriginal;

    // Atualizar elementos de preço
    const spotPriceCurrent = document.getElementById('spotPriceCurrent');
    const spotPriceOriginal = document.getElementById('spotPriceOriginal');
    const spotInstallments = document.getElementById('spotInstallments');
    const spotBoleto = document.getElementById('spotBoleto');

    if (spotPriceCurrent) {
        spotPriceCurrent.textContent = `R$ ${priceInReais.toFixed(2).replace('.', ',')}`;
    }

    if (spotPriceOriginal) {
        spotPriceOriginal.textContent = `R$ ${originalPriceInReais.toFixed(2).replace('.', ',')}`;
    }

    if (spotInstallments) {
        const installmentValue = priceInReais / 10;
        spotInstallments.textContent = `10x sem juros de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
    }

    if (spotBoleto) {
        const boletoPrice = priceInReais * 0.95; // 5% de desconto
        spotBoleto.textContent = `R$ ${boletoPrice.toFixed(2).replace('.', ',')} (Desconto de 5%) Boleto/Pix`;
    }
}

// ===== FUNCIONALIDADES EXPANDIDAS =====
function initExpandedGallery() {
    const mainImage = document.getElementById('mainImageExpanded');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.thumbnail-nav--prev');
    const nextBtn = document.querySelector('.thumbnail-nav--next');
    const thumbnailsTrack = document.querySelector('.thumbnails-track');
    let currentIndex = 0;
    const maxVisible = 4;

    // Event listeners para thumbnails
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            if (mainImage) {
                const largeImage = this.dataset.large;
                mainImage.src = largeImage;
                mainImage.alt = this.alt;
            }

            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navegação de thumbnails
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateThumbnailsPosition();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentIndex < thumbnails.length - maxVisible) {
                currentIndex++;
                updateThumbnailsPosition();
            }
        });
    }

    function updateThumbnailsPosition() {
        if (thumbnailsTrack && thumbnails.length > 0) {
            const translateX = -currentIndex * (thumbnails[0].offsetWidth + 15);
            thumbnailsTrack.style.transform = `translateX(${translateX}px)`;
        }
    }
}

function initExpandedVariations() {
    const variationOptions = document.querySelectorAll('.variation-option');

    variationOptions.forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.variation-group');
            const siblings = group.querySelectorAll('.variation-option');

            siblings.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');

            // Atualizar preços baseado na variação
            updatePriceBasedOnVariation();
        });
    });
}

function initExpandedQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
            }
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

function initExpandedTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            activateTab(tabId);
        });
    });
}

function activateTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));

    const clickedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const targetPane = document.getElementById(tabId);

    if (clickedButton && targetPane) {
        clickedButton.classList.add('active');
        targetPane.classList.add('active');
    }
}

function initExpandedReviewForm() {
    const reviewForm = document.getElementById('reviewForm');

    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const rating = document.querySelector('input[name="reviewRating"]:checked');
            const title = document.getElementById('reviewTitle').value;
            const comment = document.getElementById('reviewComment').value;

            if (!name || !email || !rating || !title || !comment) {
                showSpotNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showSpotNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }

            submitSpotReview(name, email, rating.value, title, comment);
        });
    }
}

function initExpandedShippingCalculator() {
    const cepInput = document.getElementById('cepInput');
    const calculateBtn = document.getElementById('calculateShippingBtn');

    if (cepInput) {
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            this.value = value;
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const cep = cepInput ? cepInput.value : '';

            if (cep && cep.replace(/\D/g, '').length === 8) {
                simulateSpotShippingCalculation();
            } else {
                showSpotNotification('Por favor, informe um CEP válido com 8 dígitos.', 'error');
            }
        });
    }
}

// ===== FUNÇÕES AUXILIARES =====
function getProductForCart(productId, quantity) {
    if (window.app && window.app.productDB) {
        const productFromDB = window.app.productDB.getProduct(productId);
        if (productFromDB) {
            return {
                id: productFromDB.id,
                name: productFromDB.name,
                price: productFromDB.price,
                quantity: quantity,
                image: productFromDB.image,
                category: productFromDB.category,
                brand: productFromDB.brand,
                description: productFromDB.description,
                discount: productFromDB.discount,
                inStock: productFromDB.inStock !== undefined ? productFromDB.inStock : true,
                sku: 'SKU-' + productFromDB.id.substring(0, 8)
            };
        }
    }
    return null;
}

function updateExpandedProductInfo(product) {
    // Atualizar galeria expandida
    const mainImageExpanded = document.getElementById('mainImageExpanded');
    if (mainImageExpanded && product.image) {
        mainImageExpanded.src = product.image;
        mainImageExpanded.alt = product.name;
    }

    // Atualizar thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0 && product.image) {
        thumbnails[0].src = product.image;
        thumbnails[0].alt = product.name;
        thumbnails[0].dataset.large = product.image;
    }

    // Atualizar especificações
    updateExpandedSpecifications(product);
}

function updateExpandedSpecifications(product) {
    const specsTable = document.querySelector('.specifications-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr>
                <td><strong>Marca</strong></td>
                <td>${product.brand || 'Não especificada'}</td>
            </tr>
            <tr>
                <td><strong>Categoria</strong></td>
                <td>${product.category || 'Não especificada'}</td>
            </tr>
            <tr>
                <td><strong>Nome</strong></td>
                <td>${product.name || 'Não especificado'}</td>
            </tr>
            <tr>
                <td><strong>ID</strong></td>
                <td>${product.id || 'Não especificado'}</td>
            </tr>
            <tr>
                <td><strong>Desconto</strong></td>
                <td>${product.discount || 0}% OFF</td>
            </tr>
            <tr>
                <td><strong>Em estoque</strong></td>
                <td>${product.inStock ? 'Sim' : 'Não'}</td>
            </tr>
        `;
    }
}

function updateSpotBreadcrumb(product) {
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const productNameBreadcrumb = document.getElementById('productNameBreadcrumb');

    if (categoryBreadcrumb && product.category) {
        categoryBreadcrumb.textContent = product.category;
        categoryBreadcrumb.href = `/categoria/${product.category.toLowerCase().replace(/\s+/g, '-')}/index.html`;
    }

    if (productNameBreadcrumb && product.name) {
        productNameBreadcrumb.textContent = product.name;
    }
}

function submitSpotReview(name, email, rating, title, comment) {
    showSpotNotification('Avaliação enviada com sucesso! Obrigado pela sua contribuição.', 'success');
    document.getElementById('reviewForm').reset();
}

function simulateSpotShippingCalculation() {
    const shippingResults = document.getElementById('shippingResults');

    if (shippingResults) {
        shippingResults.innerHTML = '<p>Calculando frete...</p>';
        shippingResults.style.display = 'block';

        setTimeout(() => {
            shippingResults.innerHTML = `
                <div class="shipping-option">
                    <div class="shipping-details">
                        <strong>Entrega Standard</strong>
                        <span>3 a 5 dias úteis</span>
                    </div>
                    <div class="shipping-price">
                        <span>R$ 15,90</span>
                    </div>
                </div>
                <div class="shipping-option">
                    <div class="shipping-details">
                        <strong>Entrega Expressa</strong>
                        <span>1 a 2 dias úteis</span>
                    </div>
                    <div class="shipping-price">
                        <span>R$ 29,90</span>
                    </div>
                </div>
                <div class="shipping-option free-shipping">
                    <div class="shipping-details">
                        <strong>Retirar na Loja</strong>
                        <span>Salvador/BA - Caminho das Árvores</span>
                    </div>
                    <div class="shipping-price">
                        <span class="free-text">GRÁTIS</span>
                    </div>
                </div>
            `;
        }, 1500);
    }
}

function updatePriceBasedOnVariation() {
    console.log('Atualizando preço baseado na variação selecionada');
    // Placeholder para lógica de atualização de preço por variação
}

function loadFallbackSpotData() {
    console.log('Carregando dados fictícios para o spot');
    // Usar dados de fallback se produto não for encontrado
}

function showSpotNotification(message, type = 'info') {
    // Criar notificação personalizada para o spot
    const notification = document.createElement('div');
    notification.className = `spot-notification spot-notification--${type}`;
    notification.innerHTML = `
        <div class="spot-notification__content">
            <span class="spot-notification__message">${message}</span>
            <button class="spot-notification__close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Adicionar estilos inline básicos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--cor-destaque)' : type === 'error' ? 'var(--cor-erro)' : 'var(--cor-primaria)'};
        color: white;
        padding: 15px 20px;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-ocultar após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);

    // Botão de fechar
    const closeBtn = notification.querySelector('.spot-notification__close');
    closeBtn.addEventListener('click', function() {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initializeCartCount() {
    try {
        const cartData = localStorage.getItem('odonto_cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
            updateCartCount(totalCount);
        }
    } catch (error) {
        console.error('Error initializing cart count:', error);
    }
}

function updateCartCount(count) {
    const cartCountElement = document.querySelector('.shopping-cart__count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function addToCart(product) {
    try {
        let cart = [];
        const cartData = localStorage.getItem('odonto_cart');
        if (cartData) {
            cart = JSON.parse(cartData);
        }

        const existingItemIndex = cart.findIndex(item => item.id === product.id);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem('odonto_cart', JSON.stringify(cart));
        updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));

        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));

        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}