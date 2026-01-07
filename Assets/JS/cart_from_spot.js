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
    
    // Usa MutationObserver para garantir que funcione mesmo com conteúdo dinâmico
    const modalElement = document.querySelector('#modal-spot');
    if (modalElement) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    removeTailwindFromModalThumbnails();
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
 * The add to cart button's click event
 * @param {object[]} productVariantId - The product variant id
 */
async function spotAddToCartButtonClick(productVariantId){
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
            productButton.classList.add('added');
            const originalText = productButton.textContent;
            productButton.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            
            // Remover a classe após 2 segundos
            setTimeout(() => {
                productButton.classList.remove('added');
                productButton.textContent = originalText;
            }, 2000);
        }
    } else {
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto ao carrinho.', true);
    }
}