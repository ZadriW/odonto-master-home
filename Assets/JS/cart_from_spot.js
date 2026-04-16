/**
 * Remove classes Tailwind das thumbnails dentro do modal
 */
function removeTailwindFromModalThumbnails() {
    const modal = document.querySelector('#modal-spot, .wake-modal, .modal, [product-view-row]');
    if (!modal) return;
    
    // Encontra todas as thumbnails dentro do modal
    const thumbnails = modal.querySelectorAll('.product-thumbnail, img.product-thumbnail');
    
    thumbnails.forEach(thumbnail => {
        // Remove classes Tailwind de tamanho e espaçamento
        thumbnail.classList.remove('w-12', 'h-12', 'lg:w-14', 'lg:h-14', 'm-1', 'object-cover', 'object-center', 'border', 'bg-secondary-300', 'flex-shrink-0');
        
        // Mantém apenas as classes essenciais
        if (!thumbnail.classList.contains('product-thumbnail')) {
            thumbnail.classList.add('product-thumbnail');
        }
    });
}

/**
 * Loads the modal window based on the productId passed to a snippet call
 * @param {string | number} id - The product id
 */
async function showModalSpot(id){    
    const input = { 
        productId: Number(id),
        partnerAccessToken: null,
        selections: null
    };

    const response = await client.snippet.render("modal_spot.html", "SnippetQueries/cart_from_spot.graphql", input);
    setInnerHtmlById(response, "modal-content");

    showModal('modal-spot');
    
    // Remove classes Tailwind das thumbnails após o modal ser exibido
    setTimeout(() => {
        removeTailwindFromModalThumbnails();
    }, 100);
    
    // Inicializar zoom da imagem após o modal ser exibido
    setTimeout(() => {
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
            const zoomContainer = modalContent.querySelector('.zoom');
            if (zoomContainer && typeof initProductImageZoom === 'function') {
                initProductImageZoom(zoomContainer);
            }
            
            // Inicializar navegação de thumbnails no modal
            if (typeof initThumbnailNavigation === 'function') {
                initThumbnailNavigation();
            }
        }
    }, 200);
    
    // Usa MutationObserver para garantir que funcione mesmo com conteúdo dinâmico
    const modalElement = document.querySelector('#modal-spot');
    if (modalElement) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    removeTailwindFromModalThumbnails();
                    
                    // Verifica se um novo container .zoom foi adicionado
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const zoomContainer = node.querySelector ? node.querySelector('.zoom') : null;
                            if (zoomContainer && typeof initProductImageZoom === 'function') {
                                setTimeout(() => {
                                    initProductImageZoom(zoomContainer);
                                }, 100);
                            }
                            
                            // Verifica se um novo container de thumbnails foi adicionado
                            const thumbnailContainer = node.querySelector ? node.querySelector('.product-thumbnails-container') : null;
                            if (thumbnailContainer && typeof initThumbnailNavigation === 'function') {
                                setTimeout(() => {
                                    initThumbnailNavigation();
                                }, 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(modalElement, {
            childList: true,
            subtree: true
        });
        
        // Para o observer após 5 segundos para evitar vazamento de memória
        setTimeout(() => {
            observer.disconnect();
        }, 5000);
    }
}

const closeSpotModal = () => {
    closeModal('modal-spot');
}

/**
 * The buy button's click event
 * @param {object[]} productVariantId - The product variant id
 */
async function spotBuyButtonClick(productVariantId){
    await buyClick(productVariantId);
}

/**
 * Increase quantity for spot product
 * @param {string} productVariantId - The product variant id
 */
function increaseSpotQuantity(productVariantId) {
    const quantityInput = document.getElementById('spot-quantity-' + productVariantId);
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
    }
}

/**
 * Decrease quantity for spot product
 * @param {string} productVariantId - The product variant id
 */
function decreaseSpotQuantity(productVariantId) {
    const quantityInput = document.getElementById('spot-quantity-' + productVariantId);
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
}

/**
 * Get quantity from spot quantity input
 * @param {string} productVariantId - The product variant id
 * @returns {number} - The quantity value
 */
function getSpotQuantity(productVariantId) {
    const quantityInput = document.getElementById('spot-quantity-' + productVariantId);
    if (quantityInput) {
        const quantity = parseInt(quantityInput.value) || 1;
        return quantity > 0 ? quantity : 1;
    }
    return 1;
}

/**
 * Valida o input de quantidade do spot durante a digitação (input).
 * Permite campo em branco para o usuário apagar e digitar (ex.: "2"); só limita se o número exceder max.
 * @param {HTMLInputElement} inputEl - O input de quantidade
 */
function syncSpotQuantityInputOnInput(inputEl) {
    if (!inputEl || !inputEl.id || inputEl.id.indexOf('spot-quantity-') !== 0) return;
    const raw = inputEl.value.trim();
    if (raw === '') return;
    const max = parseInt(inputEl.getAttribute('max')) || 999;
    const value = parseInt(inputEl.value, 10);
    if (!isNaN(value) && value > max) inputEl.value = max;
}

/**
 * Valida e corrige o valor ao sair do campo (change/blur): vazio ou inválido vira min, valor > max vira max.
 * @param {HTMLInputElement} inputEl - O input de quantidade
 */
function syncSpotQuantityInputOnChange(inputEl) {
    if (!inputEl || !inputEl.id || inputEl.id.indexOf('spot-quantity-') !== 0) return;
    const min = parseInt(inputEl.getAttribute('min')) || 1;
    const max = parseInt(inputEl.getAttribute('max')) || 999;
    let value = parseInt(inputEl.value, 10);
    if (isNaN(value) || value < min) value = min;
    if (value > max) value = max;
    inputEl.value = value;
}

/** Listeners para permitir digitar a quantidade nos inputs de spot */
function initSpotQuantityInputListeners() {
    document.addEventListener('input', function(e) {
        if (e.target && e.target.id && e.target.id.indexOf('spot-quantity-') === 0) {
            syncSpotQuantityInputOnInput(e.target);
        }
    });
    document.addEventListener('change', function(e) {
        if (e.target && e.target.id && e.target.id.indexOf('spot-quantity-') === 0) {
            syncSpotQuantityInputOnChange(e.target);
        }
    });
}

initSpotQuantityInputListeners();

/**
 * The add to cart button's click event
 * @param {object[]} productVariantId - The product variant id
 */
async function spotAddToCartButtonClick(productVariantId){
    const clickedButton = document.activeElement;
    if (typeof shouldBlockRestrictedSaleForContext === 'function' && await shouldBlockRestrictedSaleForContext(clickedButton)) {
        if (typeof showRestrictedSaleWarningModal === 'function') {
            showRestrictedSaleWarningModal();
        }
        return;
    }

    if (!productVariantId){
        showOverlay('Não foi possível adicionar o produto ao carrinho', 'Produto inválido', true);
        return;
    }

    const quantity = getSpotQuantity(productVariantId);
    const customization = typeof getCustomizations === 'function' ? getCustomizations() : [];

    let products = [];
    products.push({
        productVariantId: Number(productVariantId),
        quantity: quantity,
        customization: customization
    });

    const success = await addOrCreateCheckout(products);
    if (success){
        showOverlay('Produto adicionado!', 'Produto adicionado ao carrinho');
        await loadMiniCart();
        
        // Adicionar classe "added" ao botão do produto
        const productButton = document.querySelector(`button[onclick*="spotAddToCartButtonClick(${productVariantId})"]`);
        if (productButton && productButton.classList.contains('product-button')) {
            // Adicionar classe added (visual verde)
            productButton.classList.add('added');
            
            // Remover a classe após 2 segundos (mantém o ícone original)
            setTimeout(() => {
                productButton.classList.remove('added');
            }, 2000);
        }
    } else {
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto ao carrinho.', true);
    }
}