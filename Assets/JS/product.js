window.addEventListener("load", function() {
    productLoad();
    // Inicializa loop dos carrosséis com banner lateral (também funciona na home)
    initCarouselWithSideBannerLoop();
}, false);
let alertDiv = "";

/**
 * Page load function.
 */
async function productLoad(){
    alertDiv = document.getElementById("add-cart-alert");
    preventUnavailableSectionRedirect();
    initUnavailableModalButtons();
    initProductInformationCascade();
    // Inicializa loop dos carrosséis com banner lateral
    initCarouselWithSideBannerLoop();
}

/**
 * Garante que carrosséis com banner lateral tenham loop funcionando corretamente
 */
function initCarouselWithSideBannerLoop() {
    const setupCarouselLoop = function(slider) {
        // Verifica se já foi configurado
        if (slider.dataset.loopConfigured === 'true') return;
        
        const container = slider.querySelector('.slider-container');
        if (!container) return;
        
        const nextButton = slider.querySelector('.slider-nav-next');
        const prevButton = slider.querySelector('.slider-nav:not(.slider-nav-next)');
        
        if (!nextButton && !prevButton) return;
        
        // Função para verificar se está no final
        const isAtEnd = function() {
            const maxScroll = container.scrollWidth - container.offsetWidth;
            const currentScroll = container.scrollLeft;
            // Tolerância de 10px para compensar arredondamentos
            return currentScroll >= (maxScroll - 10);
        };
        
        // Função para verificar se está no início
        const isAtStart = function() {
            return container.scrollLeft <= 10; // Tolerância de 10px
        };
        
        // Função para calcular o passo de scroll
        const getScrollStep = function() {
            const slides = container.children;
            if (slides.length === 0) return 0;
            const gapWidth = parseInt(window.getComputedStyle(container).columnGap) || 12;
            return slides[0].offsetWidth + gapWidth;
        };
        
        // Intercepta o botão próximo
        if (nextButton) {
            // Remove listeners antigos clonando o botão
            const newNextButton = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(newNextButton, nextButton);
            
            newNextButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                if (isAtEnd()) {
                    // Volta para o início
                    container.scroll({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Avança normalmente usando a função do Swiffy
                    const scrollStep = getScrollStep();
                    const newScroll = container.scrollLeft + scrollStep;
                    container.scroll({
                        left: newScroll,
                        behavior: 'smooth'
                    });
                }
            }, { capture: true, passive: false });
        }
        
        // Intercepta o botão anterior
        if (prevButton) {
            const newPrevButton = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(newPrevButton, prevButton);
            
            newPrevButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                if (isAtStart()) {
                    // Vai para o final
                    const maxScroll = container.scrollWidth - container.offsetWidth;
                    container.scroll({
                        left: maxScroll,
                        behavior: 'smooth'
                    });
                } else {
                    // Volta normalmente usando a função do Swiffy
                    const scrollStep = getScrollStep();
                    const newScroll = container.scrollLeft - scrollStep;
                    container.scroll({
                        left: newScroll,
                        behavior: 'smooth'
                    });
                }
            }, { capture: true, passive: false });
        }
        
        // Marca como configurado
        slider.dataset.loopConfigured = 'true';
    };
    
    // Configura carrosséis existentes
    const carouselsWithBanner = document.querySelectorAll('.carousel-with-side-banner .swiffy-slider');
    carouselsWithBanner.forEach(setupCarouselLoop);
    
    // Observa mudanças no DOM para carrosséis adicionados dinamicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Verifica se é um carrossel com banner ou contém um
                    if (node.classList && node.classList.contains('swiffy-slider')) {
                        const parent = node.closest('.carousel-with-side-banner');
                        if (parent) {
                            setupCarouselLoop(node);
                        }
                    } else if (node.querySelector) {
                        const carousels = node.querySelectorAll('.carousel-with-side-banner .swiffy-slider');
                        carousels.forEach(setupCarouselLoop);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Inicializa o sistema de cascata para as informações do produto
 */
function initProductInformationCascade() {
    // Função para inicializar itens
    const initializeItems = function() {
        const informationItems = document.querySelectorAll('.product-information-item');
        informationItems.forEach(item => {
            const content = item.querySelector('.product-information-content-collapsible');
            if (content) {
                // Garante que está fechado inicialmente
                item.classList.remove('active');
            }
        });
    };
    
    // Inicializa itens existentes
    initializeItems();
    
    // Observa mudanças no DOM para elementos adicionados dinamicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Verifica se é um item de informação ou contém um
                        if (node.classList && node.classList.contains('product-information-item')) {
                            const content = node.querySelector('.product-information-content-collapsible');
                            if (content) {
                                node.classList.remove('active');
                            }
                        } else if (node.querySelector && node.querySelector('.product-information-item')) {
                            // Se contém itens de informação, inicializa
                            initializeItems();
                        }
                    }
                });
            }
        });
    });
    
    // Observa o body para capturar elementos adicionados dinamicamente
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Alterna a exibição do conteúdo de informação do produto
 * @param {HTMLElement} titleElement - O elemento h2 com classe product-information-title
 */
function toggleProductInformation(titleElement) {
    if (!titleElement) return;
    
    const item = titleElement.closest('.product-information-item');
    if (!item) return;
    
    const content = item.querySelector('.product-information-content-collapsible');
    if (!content) return;
    
    const isActive = item.classList.contains('active');
    
    if (isActive) {
        // Fecha o conteúdo
        item.classList.remove('active');
    } else {
        // Abre o conteúdo
        item.classList.add('active');
    }
}

/**
 * Prevents product card redirect when interacting with unavailable product section
 */
function preventUnavailableSectionRedirect() {
    // Find all unavailable product sections
    const unavailableSections = document.querySelectorAll('.product-card-unavailable-section');
    
    unavailableSections.forEach(section => {
        // Prevent click events from propagating to parent card
        section.addEventListener('click', function(e) {
            e.stopPropagation();
        }, true); // Use capture phase to catch event early
        
        // Prevent all mouse events
        section.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        }, true);
        
        section.addEventListener('mouseup', function(e) {
            e.stopPropagation();
        }, true);
        
        // Prevent touch events for mobile
        section.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        }, true);
        
        section.addEventListener('touchend', function(e) {
            e.stopPropagation();
        }, true);
        
        // Find all inputs and forms within the section (exceto botão mobile)
        const inputs = section.querySelectorAll('input, textarea, select, button:not(.product-card-unavailable-button-mobile), form');
        inputs.forEach(input => {
            input.addEventListener('click', function(e) {
                e.stopPropagation();
            }, true);
            
            input.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            }, true);
            
            input.addEventListener('focus', function(e) {
                e.stopPropagation();
            }, true);
            
            input.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, true);
        });
    });
    
    // Also handle dynamically added sections (e.g., via pagination)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    const sections = node.querySelectorAll ? node.querySelectorAll('.product-card-unavailable-section') : [];
                    sections.forEach(section => {
                        preventSectionRedirect(section);
                    });
                    // Check if the node itself is a section
                    if (node.classList && node.classList.contains('product-card-unavailable-section')) {
                        preventSectionRedirect(node);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Helper function to prevent redirect for a specific section
 */
function preventSectionRedirect(section) {
    const preventEvent = function(e) {
        e.stopPropagation();
    };
    
    ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach(eventType => {
        section.addEventListener(eventType, preventEvent, true);
    });
    
    const inputs = section.querySelectorAll('input, textarea, select, button:not(.product-card-unavailable-button-mobile), form');
    inputs.forEach(input => {
        ['click', 'mousedown', 'focus', 'touchstart'].forEach(eventType => {
            input.addEventListener(eventType, preventEvent, true);
        });
    });
}

/**
 * Product attribute selection function.
 * @param {HTMLElement} element - Attribute element from HTML.
 */
async function selectAttribute(element){
    const attrId = element.getAttribute("attribute-id");
    const productId = element.getAttribute("product-id");
	const attributeDiv = element.closest('[attribute-selections]');
    let attributeList = getSelectedAttributes(attributeDiv, attrId, element.value.trim());
    await renderAttributes(attributeList, productId);
}

/**
 * Returns a list of the selected attributes of the page.
 * @param {HTMLElement} attributeDiv - The attribute div from HTML.
 * @param {string} selectedAttributeId - Selected attribute ID.
 * @param {string} selectedAttributeValue - Selected attribute value.
 */
function getSelectedAttributes(attributeDiv, selectedAttributeId, selectedAttributeValue){
	let attributeList = [];
    if (selectedAttributeId && selectedAttributeValue)
    attributeList.push({
        attributeId :  Number(selectedAttributeId),
        value : selectedAttributeValue
    });
	const selectedAttributes = attributeDiv.querySelectorAll(`[id^="hidden-selected-attribute-"]`);
	if (selectedAttributes)
		selectedAttributes.forEach(element => {
			const attributeId = element.id.split("-").at(-1);
			if (attributeId != selectedAttributeId && 
                !(attributeList.some(x => x.attributeId == Number(attributeId))))
                
                attributeList.push({
                    attributeId : Number(attributeId),
                    value : element.value
                });
			}
		);

	return attributeList;
}

/**
 * Renders the attributes according to the product and the selected attributes.
 * @param {string} attributeList - List of product selected attributes .
 * @param {string} productId - Product ID.
 */
async function renderAttributes(attributeList, productId){
    const variables = {
        productId: Number(productId),
        selections: attributeList
    };
    const elementId = `product-view-div-${productId}`;
    const response = await client.snippet.render("product_view_snippet.html", "product.graphql", variables);
    setInnerHtmlById(response, elementId);
    
    // Garantir que a âncora "Ver Mais" seja sempre exibida no modal após atualização
    const ensureViewMoreLinkVisible = () => {
        const productViewDiv = document.getElementById(elementId);
        if (!productViewDiv) return;
        
        // Verificar se estamos dentro de um modal
        const isInModal = productViewDiv.closest('.wake-modal, .modal, [product-view-row]');
        if (!isInModal) return;
        
        // Procurar pela âncora existente e garantir que seja visível
        const viewMoreLinks = productViewDiv.querySelectorAll('.product-view-more-link');
        viewMoreLinks.forEach(link => {
            link.style.display = 'block';
            link.style.visibility = 'visible';
            link.style.opacity = '1';
        });
    };
    
    // Executar após o DOM ser atualizado
    setTimeout(ensureViewMoreLinkVisible, 50);
    setTimeout(ensureViewMoreLinkVisible, 200);
    
    // Inicializar navegação de thumbnails após atualização do modal
    setTimeout(initThumbnailNavigation, 100);
    
    // Inicializar zoom da imagem após atualização do modal
    setTimeout(() => {
        const productViewDiv = document.getElementById(elementId);
        if (productViewDiv) {
            const zoomContainer = productViewDiv.querySelector('.zoom');
            if (zoomContainer) {
                initProductImageZoom(zoomContainer);
            }
        }
    }, 200);
    
    handleDataLayerAttributeSelection();
}

/**
 * Updates the data layer with the selected product variant SKU 
 * and dispatches a custom event to signal that the product page has been viewed.
*/
function handleDataLayerAttributeSelection(){
    try{
        let productInfoInput = document.querySelector('input[id^=product-variant-data-layer]');
        let variant = productInfoInput.value
        data_layer_product_details.items[0].item_variant = variant;
      
        window.dispatchEvent(
          new CustomEvent('productPageViewed', { detail: { adjusted : true } }));
    }
    catch (error) { console.log(error); }
}

/**
 * Hides the alert content.
*/
function hideAlert(){
    alertDiv.innerHTML = "";
    alertDiv.style.visibility = "hidden";
}

/**
 * Add to cart button click.
 * @param {string} productVariantId - Product variant ID.
 */
async function addToCartClick(productVariantId){
    if (!productVariantId){
        showOverlay('Não foi possível adicionar o produto ao carrinho', 'Selecione a variação', true)
        return;
    }

    const input = getAttributeProductAndQuantity(productVariantId);

    if (input[0].customization.length < document.querySelectorAll('[id^="required-"]').length){
        showOverlay('Customização obrigatória', 'Existem uma ou mais customizações obrigatórias', true)
        return;
    }

    const success = await addOrCreateCheckout(input);
    if (success){
        showOverlay('Produto adicionado!', 'Produto adicionado ao carrinho')
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
    }
}

/**
 * Buy button click.
 * @param {string} productVariantId - Product variant ID.
 */
async function buyClick(productVariantId){
    if (!productVariantId){
        showOverlay('Não foi possível adicionar o produto ao carrinho', 'Selecione a variação', true)
        return;
    }
    
    const input = getAttributeProductAndQuantity(productVariantId);

    if (input[0].customization.length < document.querySelectorAll('[id^="required-"]').length){
        showOverlay('Customização obrigatória', 'Existem uma ou mais customizações obrigatórias', true)
        return;
    }

    const success = await addOrCreateCheckout(input);
    if(!success) {
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto ao carrinho.', true)
    }

    if (success){
        await addUtmMetadataIfExists(); // mini_cart.js
        window.location = checkout_pages.checkout.home;
    }
}

/**
 * Subscription button click.
 * @param {string} productVariantId - Product variant ID.
 */
async function subscriptionClick(productVariantId){
    if (productVariantId != ""){        
        const subscriptionRecurringType = document.getElementById("subscription-recurring-type");
        const subscriptionGroupId = subscriptionRecurringType.options[subscriptionRecurringType.selectedIndex].getAttribute("subscription-group-id");
        
        const input = getAttributeProductAndQuantity(productVariantId);
        input[0].subscription = {
            subscriptionGroupId: Number(subscriptionGroupId),
            recurringTypeId: Number(subscriptionRecurringType.value)
        };

        const success = await addOrCreateCheckout(input);
        if (success){
            window.location = checkout_pages.checkout.home;
        }
    }
}

/**
 * Calls the getQuantity and getCustomizations functions and return the input object to add to checkout.
 * @param {string} variantId - Product variant ID.
 */
function getAttributeProductAndQuantity(variantId){
    let input = null;
    const quantity = getQuantity();
    const customization = getCustomizations();

    let products = [];
    products.push({
        productVariantId: Number(variantId),
        quantity: quantity,
        customization: customization
    });
    input = products;

    return input;
}

/**
 * Gets the product quantity from page.
 */
function getQuantity(){
    const selectedQuantity = document.getElementById("selected-quantity");

    if (!selectedQuantity) return 1;
    
    const quantityValue = selectedQuantity.value;
    const maxValue = selectedQuantity.getAttribute("max");
    const quantity = Number(quantityValue);
    const max = Number(maxValue);

    if (quantity < 1) return 1;
    if (quantity > max) return max;
    return quantity;
}

/**
 * Increase quantity for product modal/page
 */
function increaseProductQuantity() {
    const quantityInput = document.getElementById('selected-quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const maxValue = parseInt(quantityInput.getAttribute('max')) || 999;
        const newValue = Math.min(currentValue + 1, maxValue);
        quantityInput.value = newValue;
        
        // Atualiza o atributo max se necessário (para produtos com variantes)
        const productViewDiv = quantityInput.closest('[product-view-div]');
        if (productViewDiv) {
            const variantIdInput = productViewDiv.querySelector('#product-variant-id');
            if (variantIdInput && variantIdInput.value) {
                // Pode atualizar o max baseado no estoque da variante selecionada
                const stockInput = productViewDiv.querySelector('[product-stock]');
                if (stockInput) {
                    quantityInput.setAttribute('max', stockInput.value || 999);
                }
            }
        }
    }
}

/**
 * Decrease quantity for product modal/page
 */
function decreaseProductQuantity() {
    const quantityInput = document.getElementById('selected-quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
}

/**
 * Validates if need to create a checkout and add products.
 * @param {object[]} input - Product and quantities input to add to checkout.
 */
async function addOrCreateCheckout(input){
    try{        
        let checkoutId = client.cookie.get("carrinho-id");
        let checkoutResponse = null;

        if (checkoutId && checkoutId != "") {
            checkoutResponse = await client.checkout.add(input);

            checkoutId = checkoutResponse.data.checkoutId;
        }
        else{
            checkoutResponse = await client.checkout.create(input);
            checkoutId = checkoutResponse.data.checkoutId;           
        }

        await checkoutPartnerAssociate(checkoutId);

        window.dispatchEvent(new CustomEvent("productAddedToCart", {
            detail: {
                cart: checkoutResponse.data,
                products : input
            }
        }));


        return true;
    } catch (error){
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto ao carrinho.', true)
        console.log(error)
        return false;
    }
}

/**
 * Matrix add to cart button click.
 */
async function addToCartMatrixClick(element){
    const success = await checkoutOperations(element, 'product-view-div');
    if (success){
        showOverlay('Produto(s) Adicionado(s)!', 'Produto(s) adicionado(s) ao carrinho!')
        await loadMiniCart();
    } else {
        showOverlay('Não foi possível adicionar o produto ao carrinho!', 'Preencha os campos corretamente e tente novamente', true)
    }
}
/**
 * Matrix buy button click.
 */
async function buyMatrixClick(element){
    const success = await checkoutOperations(element, 'product-view-div');
    if (success){
        window.location = checkout_pages.checkout.home;
    } else {
        showOverlay('Não foi possível adicionar o produto ao carrinho!', 'Preencha os campos corretamente e tente novamente', true)
    }
}

/**
 * Applies the wholesale price to the product.
 * @param {string} quantity - Wholesale quantity.
 */
async function applyWholesalePrice(quantity){
    if (!quantity) { return false; }

    const selectedQuantity = document.getElementById("selected-quantity");
    selectedQuantity.value = quantity;

    let prodVar = Number(document.getElementById('product-variant-id').value)
    quantity = Number(quantity);

    let response = await client.snippet.render("wholesale_price_snippet.html", "SnippetQueries/wholesale.graphql", { prodVar, quantity });
    response = processWholesaleResponse(response, quantity);

    setInnerHtmlById(response, "wholesale-div");
}

/**
 * Process the wholesale HTML content.
 * @param {string} html - String HTML content.
 * @param {string} quantity - Wholesale quantity.
 */
function processWholesaleResponse(html, quantity){
    const calculatedDiscount = calculateWholesaleDiscount(html, quantity);
    return html
    .replace("{price}", calculatedDiscount.price.toLocaleString('pt-BR'))
    .replace("{percent}", calculatedDiscount.percent.toLocaleString('pt-BR', {style: "percent"}));
}

/**
 * Calculates the wholesale discount.
 * @param {string} html - String HTML content.
 * @param {string} quantity - Wholesale quantity.
 */
function calculateWholesaleDiscount(html, quantity){
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const originalPriceMultiplied = Number(doc.getElementById('original-price-value').innerHTML) * quantity;
    const wholesalePrice = Number(doc.getElementById('wholesale-price-value').innerHTML);
    return { 
        price : originalPriceMultiplied - wholesalePrice, 
        percent : 1 - (wholesalePrice / originalPriceMultiplied)
    };
}

/**
 * Gets the product customizations.
 */
function getCustomizations(divToSelect = null){
    let customizations = [];
    let inputs = [];

    if (divToSelect){
        inputs = divToSelect.querySelectorAll("[id^=customization-]");
    }
    else {
        const productViewRowDiv = document.querySelector('[product-view-row]');
        inputs = productViewRowDiv ? productViewRowDiv.querySelectorAll("[id^=customization-]") : document.querySelectorAll("[id^=customization-]");
    }

    for (const input of inputs){
        if (input.value)
        customizations.push({
            customizationId: Number(input.getAttribute("customization-id")),
            value: input.value
        })

    }
    return customizations;
}

/**
 * Builds the object for adding the product to the cart.
 * @param {HTMLElement} rowDiv - HTML row div element.
 * @param {object[]} input - Object to add the product to the cart.
 */
function pushProductInput(rowDiv, input){
    let hasProduct = false;

    const elements = rowDiv.querySelectorAll('input[product-variant-id][type=number]');
    if ( elements ){
        for(const element of elements){
            const variantId = element.getAttribute("product-variant-id");
            const quantity = element.value;
            if( quantity > 0 && variantId > 0 )
            {
                input.push({
                    productVariantId: Number(variantId),
                    quantity: Number(quantity)
                })

                hasProduct = true;
            }
        }
    }
    
    return hasProduct;
}

/**
 * Builds the object for adding the product to the cart with customizations.
 * @param {HTMLElement} rowDiv - HTML row div element.
 * @param {object[]} input - Object to add the product to the cart.
 */
function pushProductInputWithCustomizations(rowDiv, input){
    let hasProduct = false;

    const elements = rowDiv.querySelectorAll('input[product-variant-id][type=number]');
    if ( elements ){
        for(const element of elements){
            const variantId = element.getAttribute("product-variant-id");
            const quantity = element.value;
            if( quantity > 0 && variantId > 0 )
            {
                const productViewDiv = element.closest('[product-view-div]');
                const customization = getCustomizations(productViewDiv);

                input.push({
                    productVariantId: Number(variantId),
                    quantity: Number(quantity),
                    customization
                })

                hasProduct = true;
            }
        }
    }
    
    return hasProduct;
}

/**
 * Calls the quantity validation function and and calls the function that enables or disables the buy and add to cart buttons.
 * @param {HTMLElement} rowDiv - HTML row div element.
 */
function setButtonsEnabledByAvailability(rowDiv){
    const available = validateAvailability(rowDiv);
    setDisabledBuyButtons(rowDiv, !available);
}

/**
 * Validates that the selected quantity of the product is sufficient to enable the buy and add to cart buttons.
 * @param {HTMLElement} rowDiv - HTML row div element.
 */
function validateAvailability(rowDiv){
    const productDivs = rowDiv.querySelectorAll('[product-view-div]');
    return Array.from(productDivs).every(div => {
        const elements = div.querySelectorAll('[product-available]');
        if (elements.length > 0)
            return Array.from(elements).every(x => x.value == 'true');
        const quantityInputs = rowDiv.querySelectorAll('[matrix-input-quantity]');
        const nonEmpty = Array.from(quantityInputs).filter(x => x.value != "");
        return Array.from(nonEmpty).some(x => Number(x.value) > 0);
    });
}

/**
 * Enable or disable buy and add to cart buttons.
 * @param {HTMLElement} rowDiv - HTML row div element.
 * @param {bool} disabled - True to disable and false to enable.
 */
function setDisabledBuyButtons(rowDiv, disabled){
    rowDiv.querySelector('[add-to-cart-button]').disabled = disabled;
    rowDiv.querySelector('[buy-button]').disabled = disabled;
}

/**
 * Function for when quantity is changed in matrix attributes.
 * @param {HTMLElement} element - Input type number from matrix.
 */
function productMatrixOnChange(element){
    const row = element.closest('[product-view-row]');
    setButtonsEnabledByAvailability(row);
}

/**
 * Gets the current buy together row and adds it to a checkout.
 * the operation uses scope context to search only in the contained div
 * for data attributes, since there could be repetition of ids in the page,
 * we avoid using getElementById.
 * @param {HTMLInputElement} element - The button originating the operation, for context.
 * @param {string} attrName - Name of the attribute to search and fetch the div.
 */
 async function checkoutOperations(element, attrName){
    const input = [];
    const div = element.closest('[' + attrName + ']');
    const pushedProducts = pushProductInputWithCustomizations(div, input);
    
    if(pushedProducts) {
        const success = await addOrCreateCheckout(input);
        return success;
    }

    return false;

}

/**
 * Event for the 'back in stock' component, when the product is out of stock
 * and the user wants to sign up for an email notification
 * @param {Event} e - The form event, so we can cancel the POST, avoiding a page reload
 */
async function backInStockOnClick(productVariantId, e){
    if (e) e.preventDefault();

    let title = "Erro ao criar o alerta";
    let message = "";
    let error = true;

    // Tentar primeiro os inputs do modal (mobile), depois os inputs desktop
    let name = document.getElementById("bis-name-modal-" + productVariantId);
    let email = document.getElementById("bis-email-modal-" + productVariantId);
    
    // Se não encontrar no modal, buscar nos inputs desktop
    if (!name || !email) {
        name = document.getElementById("bis-name-" + productVariantId);
        email = document.getElementById("bis-email-" + productVariantId);
    }

    if (name && email){
        const bisInput = {
            email: email.value,
            name: name.value,
            partnerAccessToken: null,
            productVariantId: Number(productVariantId),
        }
        
        const success = await client.product.createRestockAlert(bisInput);

        if (success) {
            title = "Aviso criado!";
            message = "Você será avisado quando o produto voltar ao estoque."
            error = false;
            
            // Fechar o modal se estiver aberto
            closeUnavailableModal(productVariantId);
        }        
    }

    showOverlay(title, message, error);
}

/**
 * Inicializa os modais de produtos indisponíveis para mobile
 */
function initUnavailableModalButtons() {
    // Mover todos os modais para o body
    const modals = document.querySelectorAll('.product-card-unavailable-modal');
    modals.forEach(modal => {
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
    });
    
    // Event delegation para botões de abrir modal
    document.addEventListener('click', function(e) {
        const button = e.target.closest('.product-card-unavailable-button-mobile');
        if (button) {
            e.stopPropagation();
            e.preventDefault();
            
            const variantId = button.getAttribute('data-variant-id');
            if (variantId) {
                openUnavailableModal(variantId);
            }
        }
    }, true); // Capture phase
    
    // Event delegation para botões de fechar modal
    document.addEventListener('click', function(e) {
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
            e.stopPropagation();
            e.preventDefault();
            
            const variantId = closeBtn.getAttribute('data-close-modal');
            if (variantId) {
                closeUnavailableModal(variantId);
            }
        }
    }, true); // Capture phase
    
    // Observar mudanças dinâmicas (para produtos carregados via AJAX)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Mover novos modais para o body
                    const newModals = node.querySelectorAll ? node.querySelectorAll('.product-card-unavailable-modal') : [];
                    newModals.forEach(modal => {
                        if (modal.parentElement !== document.body) {
                            document.body.appendChild(modal);
                        }
                    });
                    
                    // Verificar se o próprio node é um modal
                    if (node.classList && node.classList.contains('product-card-unavailable-modal')) {
                        if (node.parentElement !== document.body) {
                            document.body.appendChild(node);
                        }
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Abre o modal de "Avise-me" no mobile
 * @param {string} productVariantId - ID da variante do produto
 */
function openUnavailableModal(productVariantId) {
    const modal = document.getElementById("unavailable-modal-" + productVariantId);
    
    if (!modal) {
        console.error("Modal não encontrado:", "unavailable-modal-" + productVariantId);
        return;
    }
    
    // Garantir que o modal está no body
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
    
    // Mostrar modal
    modal.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';
    document.body.style.overflow = "hidden";
    
    console.log("Modal aberto para produto:", productVariantId);
}

/**
 * Fecha o modal de "Avise-me" no mobile
 * @param {string} productVariantId - ID da variante do produto
 */
function closeUnavailableModal(productVariantId) {
    const modal = document.getElementById("unavailable-modal-" + productVariantId);
    
    if (!modal) {
        return;
    }
    
    // Esconder modal
    modal.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
    document.body.style.overflow = "";
    
    // Limpar os campos do formulário do modal
    const nameInput = document.getElementById("bis-name-modal-" + productVariantId);
    const emailInput = document.getElementById("bis-email-modal-" + productVariantId);
    if (nameInput) nameInput.value = "";
    if (emailInput) emailInput.value = "";
    
    console.log("Modal fechado para produto:", productVariantId);
}

/**
 * Swap the main product image for the selected thumbnail
 * @param {string} imgUrl - Product image full url.
 */
const changeFirstImage = (imgUrl) => {
    if (!imgUrl) return;
    
    // Busca todas as imagens firstImage (pode haver múltiplas em modais)
    const firstImages = document.querySelectorAll('#firstImage');
    
    firstImages.forEach(firstImage => {
        if (firstImage) {
            firstImage.src = imgUrl;
        }
    });
    
    // Atualizar overlay se estiver aberto
    const overlay = document.getElementById('product-image-zoom-overlay');
    const zoomImg = document.getElementById('product-image-zoom-img');
    if (overlay && overlay.classList.contains('active') && zoomImg) {
        zoomImg.src = imgUrl;
    }
}


/**
 * Expand product installments
 */
const showInstallments = (e) => {
    let value = e.value;
    let element = document.querySelector("#installments-tab[value='"+value+"']");
    let others = document.querySelectorAll("#installments-tab:not([value='"+value+"'])");
    if(element.classList.contains('hidden')){
        others.forEach(e => e.classList.add('hidden'));        
        element.classList.remove('hidden');
        element.classList.add('ease-out');
        element.classList.add('opacity-100');
        element.classList.remove('opacity-0');
        
    } else {
        element.classList.add('hidden');
        element.classList.remove('ease-out');
        element.classList.add('ease-in');
        element.classList.remove('opacity-100');
        element.classList.add('opacity-0');
    }
}

/**
 * Product parallel option attribute selection function.
 * @param {HTMLElement} element - Attribute element from HTML.
 */
async function selectParallelAttribute(element){
    const attrId = element.getAttribute("attribute-id");
    const productId = element.getAttribute("product-id");
	const attributeDiv = element.closest('[attribute-selections]');
    let attributeList = getSelectedAttributes(attributeDiv, attrId, element.value.trim());
    await renderParallelAttributes(attributeList, productId, attributeDiv);
}

/**
 * Renders the parallel option attributes according to the product and the selected attributes.
 * @param {string} attributeList - List of product selected attributes .
 * @param {string} productId - Product ID.
 * @param {string} attributeDiv - Parallel option attribute DIV.
 */
async function renderParallelAttributes(attributeList, productId, attributeDiv){
    const variables = {
        productId: Number(productId),
        selections: attributeList
    };
    const response = await client.snippet.render("parallel_options_product_attribute_snippet.html", "product.graphql", variables);
    attributeDiv.innerHTML = response;
}

/**
 * Click of the buy parallel options button
 */
async function parallelOptionsBuyClick(){
    const input = parallelOptionsGetCheckoutInput();

    if (input.length == 0){
        showOverlay('Selecione ao menos uma variação para comprar!', '', true);
        return;
    }

    const success = await addOrCreateCheckout(input);
    if(!success) {
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto ao carrinho.', true)
    }

    if (success){
        window.location = checkout_pages.checkout.home;
    }
}

/**
 * Click of the add to cart parallel options button
 */
async function parallelOptionsAddToCartClick(){
    const input = parallelOptionsGetCheckoutInput();

    if (input.length == 0){
        showOverlay('Selecione ao menos uma variação para adicionar ao carrinho!', '', true);
        return;
    }

    const success = await addOrCreateCheckout(input);
    if (success){
        showOverlay('Produto adicionado!', 'Produto adicionado ao carrinho')
        await loadMiniCart();
    }
}

/**
 * Gets the parallel option product variant ID and quantity and return the input object to add to checkout.
 */
function parallelOptionsGetCheckoutInput(){
    const quantities = document.querySelectorAll('[id^="parallel-option-selected-quantity-"]');
    const input = [];
    
    quantities.forEach(quantity => {        
        const variantId = quantity.getAttribute("variant-id");

        if (variantId){
            let qty = 1;
            const quantityValue = quantity.value;
            if (quantityValue) qty = Number(quantityValue);

            input.push({
                productVariantId: Number(variantId),
                quantity: qty,
                customization: []
            });
        }
    });

    const customizations = getCustomizations();

    if (customizations?.length > 0){
        const valuesByCustomizationId = customizations.reduce((accumulator, currentItem) => {
            const id = currentItem.customizationId;
            let existingItem = accumulator.find(item => item.customizationId === id);
        
            if (!existingItem) {
                existingItem = { customizationId: id, values: [] };
                accumulator.push(existingItem);
            }
            
            existingItem.values.push(currentItem.value);
            
            return accumulator;
        }, []);

        valuesByCustomizationId.forEach(customizationItem => {
            let indexValue = 0;
            input.forEach(inputItem => {
                inputItem.customization.push({
                    customizationId: customizationItem.customizationId,
                    value: customizationItem.values[indexValue++]
                })
            });
        });
    }

    return input;
}

/**
 * Initialize thumbnail slider navigation
 * Os botões prev/next agora mudam a imagem principal ao invés de fazer scroll no slider
 */
function initThumbnailNavigation() {
    const containers = document.querySelectorAll('.product-thumbnails-container');
    
    containers.forEach(container => {
        const slider = container.querySelector('.product-thumbnails-slider');
        const prevBtn = container.querySelector('.product-thumbnails-nav-prev');
        const nextBtn = container.querySelector('.product-thumbnails-nav-next');
        
        if (!slider || !prevBtn || !nextBtn) return;
        
        // Remove existing event listeners by cloning
        const newPrevBtn = prevBtn.cloneNode(true);
        const newNextBtn = nextBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        // Função para obter todas as thumbnails e suas URLs
        const getThumbnails = () => {
            const thumbnails = slider.querySelectorAll('.product-thumbnail');
            return Array.from(thumbnails).map(thumb => {
                // Tenta obter a URL do src primeiro
                let url = thumb.src || '';
                
                // Se não tiver src ou for uma URL inválida, tenta extrair do onclick
                if (!url || url.includes('data:') || url === window.location.href) {
                    const onclickAttr = thumb.getAttribute('onclick');
                    if (onclickAttr) {
                        // Extrai a URL do onclick="changeFirstImage('URL')"
                        const urlMatch = onclickAttr.match(/changeFirstImage\(['"]([^'"]+)['"]\)/);
                        if (urlMatch && urlMatch[1]) {
                            url = urlMatch[1];
                        }
                    }
                }
                
                return {
                    element: thumb,
                    url: url
                };
            }).filter(thumb => thumb.url && thumb.url.trim() !== '');
        };
        
        // Função para obter a imagem principal atual relativa ao container
        const getCurrentImage = () => {
            // Encontra o primeiroImage relativo ao container de thumbnails
            // Procura dentro do mesmo contexto (product-view-div, modal, etc.)
            let context = container.closest('[product-view-div]') || 
                         container.closest('.wake-modal') || 
                         container.closest('.modal') || 
                         container.closest('[product-view-row]') ||
                         document;
            
            // Procura o firstImage dentro do contexto
            const firstImage = context.querySelector('#firstImage');
            return firstImage ? firstImage.src : null;
        };
        
        // Função para normalizar URLs para comparação
        const normalizeUrl = (url) => {
            if (!url) return '';
            // Remove query strings, hash, e normaliza
            return url.split('?')[0].split('#')[0].trim();
        };
        
        // Função para encontrar o índice da imagem atual
        const getCurrentImageIndex = () => {
            const currentUrl = getCurrentImage();
            if (!currentUrl) return -1;
            
            const thumbnails = getThumbnails();
            const normalizedCurrentUrl = normalizeUrl(currentUrl);
            
            return thumbnails.findIndex(thumb => {
                const normalizedThumbUrl = normalizeUrl(thumb.url);
                // Compara URLs normalizadas
                return normalizedThumbUrl === normalizedCurrentUrl;
            });
        };
        
        // Função para atualizar o estado dos botões
        const updateButtonStates = () => {
            const thumbnails = getThumbnails();
            const currentIndex = getCurrentImageIndex();
            
            // Desabilita prev se estiver na primeira imagem
            newPrevBtn.disabled = currentIndex <= 0;
            
            // Desabilita next se estiver na última imagem
            newNextBtn.disabled = currentIndex >= thumbnails.length - 1;
        };
        
        // Função para mudar para a imagem anterior
        const goToPreviousImage = () => {
            const thumbnails = getThumbnails();
            const currentIndex = getCurrentImageIndex();
            
            if (currentIndex > 0) {
                const previousThumbnail = thumbnails[currentIndex - 1];
                if (previousThumbnail && previousThumbnail.url) {
                    changeFirstImage(previousThumbnail.url);
                    updateButtonStates();
                    
                    // Scroll suave para a thumbnail anterior no slider
                    if (previousThumbnail.element) {
                        previousThumbnail.element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            }
        };
        
        // Função para mudar para a próxima imagem
        const goToNextImage = () => {
            const thumbnails = getThumbnails();
            const currentIndex = getCurrentImageIndex();
            
            if (currentIndex < thumbnails.length - 1) {
                const nextThumbnail = thumbnails[currentIndex + 1];
                if (nextThumbnail && nextThumbnail.url) {
                    changeFirstImage(nextThumbnail.url);
                    updateButtonStates();
                    
                    // Scroll suave para a próxima thumbnail no slider
                    if (nextThumbnail.element) {
                        nextThumbnail.element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            }
        };
        
        // Add click event listeners para mudar a imagem principal
        newPrevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToPreviousImage();
        });
        
        newNextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToNextImage();
        });
        
        // Observa mudanças na imagem principal para atualizar o estado dos botões
        // Encontra o firstImage relativo ao container
        let context = container.closest('[product-view-div]') || 
                     container.closest('.wake-modal') || 
                     container.closest('.modal') || 
                     container.closest('[product-view-row]') ||
                     document;
        
        const firstImage = context.querySelector('#firstImage');
        if (firstImage) {
            // Usa MutationObserver para detectar mudanças no src da imagem
            const imageObserver = new MutationObserver(() => {
                updateButtonStates();
            });
            
            imageObserver.observe(firstImage, {
                attributes: true,
                attributeFilter: ['src']
            });
        }
        
        // Adiciona listeners nas thumbnails para atualizar estado quando clicadas diretamente
        const thumbnails = slider.querySelectorAll('.product-thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Pequeno delay para garantir que changeFirstImage já foi executado
                setTimeout(updateButtonStates, 50);
            });
        });
        
        // Atualiza estado inicial dos botões
        updateButtonStates();
        
        // Atualiza estado após um pequeno delay para garantir que tudo está carregado
        setTimeout(updateButtonStates, 200);
        
        // Atualiza estado quando a janela é redimensionada
        window.addEventListener('resize', updateButtonStates);
    });
}

// Initialize thumbnail navigation on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThumbnailNavigation);
} else {
    initThumbnailNavigation();
}

/**
 * Abre o overlay de zoom da imagem do produto
 * @param {string} imageUrl - URL da imagem a ser exibida no zoom
 */
function openProductImageZoom(imageUrl) {
    if (!imageUrl) return;
    
    const overlay = document.getElementById('product-image-zoom-overlay');
    const zoomImg = document.getElementById('product-image-zoom-img');
    
    if (!overlay || !zoomImg) return;
    
    // Definir a URL da imagem
    zoomImg.src = imageUrl;
    
    // Forçar remoção de qualquer classe que possa estar ativa
    overlay.classList.remove('active');
    
    // Pequeno delay para garantir que o display: none seja aplicado primeiro
    setTimeout(() => {
        // Mostrar overlay com animação
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

/**
 * Fecha o overlay de zoom da imagem do produto
 */
function closeProductImageZoom() {
    const overlay = document.getElementById('product-image-zoom-overlay');
    
    if (!overlay) return;
    
    // Remover classe active para animar o fechamento
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Limpar src da imagem após a animação
    setTimeout(() => {
        const zoomImg = document.getElementById('product-image-zoom-img');
        if (zoomImg) {
            zoomImg.src = '';
        }
    }, 300);
}

// Fechar overlay ao pressionar ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        closeProductImageZoom();
    }
});

// Garantir que o overlay esteja fechado ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        const overlay = document.getElementById('product-image-zoom-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        // Inicializar zoom tipo lupa
        initProductImageZoom();
    });
} else {
    const overlay = document.getElementById('product-image-zoom-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    // Inicializar zoom tipo lupa
    initProductImageZoom();
}

/**
 * Inicializa o zoom com lente circular na imagem principal do produto (somente desktop)
 * A lente segue o cursor e aplica o zoom apenas dentro de um círculo.
 * @param {HTMLElement} specificContainer - Container específico para inicializar (opcional)
 */
function initProductImageZoom(specificContainer = null) {
    // Apenas para desktop
    if (window.innerWidth < 769) {
        return;
    }

    // Se um container específico foi passado, inicializa apenas ele
    if (specificContainer) {
        initializeZoomForContainer(specificContainer);
        return;
    }

    // Caso contrário, procura todos os containers .zoom que ainda não foram inicializados
    const allZoomContainers = document.querySelectorAll('.zoom');
    
    allZoomContainers.forEach(container => {
        // Verifica se já foi inicializado
        if (container._zoomInitialized) {
            return;
        }
        
        // Verifica se tem uma imagem dentro
        const productImage = container.querySelector('#firstImage, img.product-image-zoom, img.img-fluid');
        if (!productImage) {
            return;
        }
        
        // Inicializa o zoom para este container
        initializeZoomForContainer(container, productImage);
    });
}

/**
 * Inicializa o zoom para um container específico
 * @param {HTMLElement} zoomContainer - Container .zoom
 * @param {HTMLElement} productImage - Imagem do produto (opcional, será buscada se não fornecida)
 */
function initializeZoomForContainer(zoomContainer, productImage = null) {
    // Apenas para desktop
    if (window.innerWidth < 769) {
        return;
    }

    if (!zoomContainer) {
        return;
    }

    // Evita inicializar mais de uma vez no mesmo container
    if (zoomContainer._zoomInitialized) {
        return;
    }

    // Busca a imagem se não foi fornecida
    if (!productImage) {
        productImage = zoomContainer.querySelector('#firstImage, img.product-image-zoom, img.img-fluid');
    }

    if (!productImage) {
        // Se ainda não carregou, tenta novamente depois
        setTimeout(() => initializeZoomForContainer(zoomContainer), 100);
        return;
    }

    // Marca como inicializado
    zoomContainer._zoomInitialized = true;

    // Fator de zoom (levemente reduzido para uma aproximação mais suave)
    const zoomFactor = 1.5;

    // Marca a imagem principal (apenas como referência)
    if (!productImage.classList.contains('product-image-zoom')) {
        productImage.classList.add('product-image-zoom');
    }

    const containerRef = zoomContainer;
    let imageRef = productImage;

    // Cria ou reutiliza a lente circular
    let lens = containerRef.querySelector('.product-image-zoom-lens');
    if (!lens) {
        lens = document.createElement('div');
        lens.className = 'product-image-zoom-lens';
        containerRef.appendChild(lens);
    }

    const lensSize = 200; // mesmo valor definido no CSS

    // Atualiza o fundo da lente com a imagem atual e o fator de zoom
    const updateLensBackground = function () {
        if (!imageRef || !lens) return;

        // Obtém as dimensões de exibição da imagem (tamanho renderizado)
        const imgRect = imageRef.getBoundingClientRect();
        const imgDisplayWidth = imgRect.width;
        const imgDisplayHeight = imgRect.height;
        
        if (!imgDisplayWidth || !imgDisplayHeight) return;

        // Obtém as dimensões naturais da imagem (alta resolução)
        const imgNaturalWidth = imageRef.naturalWidth || imgDisplayWidth;
        const imgNaturalHeight = imageRef.naturalHeight || imgDisplayHeight;
        
        // Calcula a proporção entre tamanho de exibição e tamanho natural
        const scaleX = imgDisplayWidth / imgNaturalWidth;
        const scaleY = imgDisplayHeight / imgNaturalHeight;
        
        // O background-size deve usar as dimensões naturais ampliadas
        // Isso mantém a qualidade da imagem original de alta resolução
        const bgWidth = imgNaturalWidth * zoomFactor;
        const bgHeight = imgNaturalHeight * zoomFactor;

        lens.style.setProperty('background-image', `url('${imageRef.src}')`, 'important');
        lens.style.setProperty('background-size', `${bgWidth}px ${bgHeight}px`, 'important');
    };

    updateLensBackground();
    // Pequeno delay extra para garantir que a imagem já foi renderizada
    setTimeout(updateLensBackground, 150);

    const handleMouseMove = function (e) {
        if (window.innerWidth < 769) return;
        if (!containerRef || !imageRef || !lens) return;

        const rect = containerRef.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;

        const containerWidth = rect.width;
        const containerHeight = rect.height;

        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;

        // Se o cursor sair da área visível, esconde a lente
        if (mouseX < 0 || mouseX > containerWidth || mouseY < 0 || mouseY > containerHeight) {
            handleMouseLeave();
            return;
        }

        // Ativa a classe que mostra a lente
        containerRef.classList.add('zoom--lens-active');

        // Garante que o background da lente está correto
        updateLensBackground();

        // Centraliza a lente no cursor, mas sem sair do container
        let lensX = mouseX - lensSize / 2;
        let lensY = mouseY - lensSize / 2;

        if (lensX < 0) lensX = 0;
        if (lensY < 0) lensY = 0;
        if (lensX > containerWidth - lensSize) lensX = containerWidth - lensSize;
        if (lensY > containerHeight - lensSize) lensY = containerHeight - lensSize;

        lens.style.left = `${lensX}px`;
        lens.style.top = `${lensY}px`;

        // Obtém as dimensões de exibição da imagem (tamanho renderizado na tela)
        const imgRect = imageRef.getBoundingClientRect();
        const imgDisplayWidth = imgRect.width;
        const imgDisplayHeight = imgRect.height;
        
        if (!imgDisplayWidth || !imgDisplayHeight) return;
        
        // Obtém as dimensões naturais da imagem (alta resolução)
        const imgNaturalWidth = imageRef.naturalWidth || imgDisplayWidth;
        const imgNaturalHeight = imageRef.naturalHeight || imgDisplayHeight;
        
        // Calcula a proporção entre tamanho de exibição e tamanho natural
        const scaleX = imgDisplayWidth / imgNaturalWidth;
        const scaleY = imgDisplayHeight / imgNaturalHeight;
        
        // Calcula a posição do cursor em relação à imagem renderizada
        const imgMouseX = e.clientX - imgRect.left;
        const imgMouseY = e.clientY - imgRect.top;
        
        // Garante que o mouse está dentro dos limites da imagem
        if (imgMouseX < 0 || imgMouseX > imgDisplayWidth || imgMouseY < 0 || imgMouseY > imgDisplayHeight) {
            return;
        }
        
        // Calcula o percentual da posição do cursor na imagem renderizada (0 a 1)
        const relX = imgMouseX / imgDisplayWidth;
        const relY = imgMouseY / imgDisplayHeight;
        
        // Dimensões da imagem ampliada (background-size) - usa dimensões naturais para manter qualidade
        const bgWidth = imgNaturalWidth * zoomFactor;
        const bgHeight = imgNaturalHeight * zoomFactor;
        
        // Calcula a posição do background para centralizar a área ampliada no cursor
        // O background-position negativo move a imagem ampliada para mostrar a área correta
        // Multiplica pela dimensão natural ampliada e subtrai metade da lente para centralizar
        const bgPosX = (relX * bgWidth) - (lensSize / 2);
        const bgPosY = (relY * bgHeight) - (lensSize / 2);
        
        // Aplica o background-position usando setProperty com !important para sobrescrever CSS
        lens.style.setProperty('background-position', `${-bgPosX}px ${-bgPosY}px`, 'important');
    };

    const handleMouseLeave = function () {
        if (!containerRef) return;
        containerRef.classList.remove('zoom--lens-active');
    };

    containerRef.addEventListener('mousemove', handleMouseMove, { passive: true });
    containerRef.addEventListener('mouseleave', handleMouseLeave);

    // Atualizar zoom quando a imagem mudar (ao clicar em thumbnails)
    // Usa um listener específico para este container
    const handleImageChange = function() {
        // Busca a nova imagem dentro deste container específico
        const newImage = containerRef.querySelector('#firstImage, img.product-image-zoom, img.img-fluid');
        if (newImage && newImage !== imageRef) {
            imageRef = newImage;
            // Adiciona a classe se não tiver
            if (!imageRef.classList.contains('product-image-zoom')) {
                imageRef.classList.add('product-image-zoom');
            }
            updateLensBackground();
        }
    };

    // Observa mudanças no src da imagem dentro deste container
    const imageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                handleImageChange();
            }
        });
    });

    imageObserver.observe(productImage, {
        attributes: true,
        attributeFilter: ['src']
    });

    // Também observa quando uma nova imagem é adicionada ao container
    const containerObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    const newImage = containerRef.querySelector('#firstImage, img.product-image-zoom, img.img-fluid');
                    if (newImage && newImage !== imageRef) {
                        imageRef = newImage;
                        if (!imageRef.classList.contains('product-image-zoom')) {
                            imageRef.classList.add('product-image-zoom');
                        }
                        updateLensBackground();
                        // Observa a nova imagem
                        imageObserver.observe(imageRef, {
                            attributes: true,
                            attributeFilter: ['src']
                        });
                    }
                }
            });
        });
    });

    containerObserver.observe(containerRef, {
        childList: true,
        subtree: true
    });
}

/**
 * Verifica o nome do produto e oculta o badge de frete grátis se contiver palavras proibidas
 */
function checkFreeShippingBadge() {
    const badge = document.getElementById('product-free-shipping-badge');
    if (!badge) return;
    
    // Busca o nome do produto
    const productNameElement = document.querySelector('[product-view-div] .product-name, [product-view-div] h1.product-name, .product-name');
    if (!productNameElement) return;
    
    const productName = productNameElement.textContent || productNameElement.innerText || '';
    const productNameLower = productName.toLowerCase().trim();
    
    // Lista de palavras proibidas
    const forbiddenWords = ['luva', 'gesso', 'alginato', 'liquido'];
    
    // Verifica se o nome do produto contém alguma das palavras proibidas
    const hasForbiddenWord = forbiddenWords.some(word => productNameLower.includes(word));
    
    // Se contiver alguma palavra proibida, oculta o badge
    if (hasForbiddenWord) {
        badge.style.display = 'none';
        badge.style.visibility = 'hidden';
        badge.style.opacity = '0';
    } else {
        // Caso contrário, mostra o badge
        badge.style.display = 'inline-block';
        badge.style.visibility = 'visible';
        badge.style.opacity = '1';
    }
}

// Executa a verificação quando a página carregar
window.addEventListener('load', function() {
    checkFreeShippingBadge();
    
    // Observa mudanças no DOM caso o nome do produto seja carregado dinamicamente
    const observer = new MutationObserver(function(mutations) {
        checkFreeShippingBadge();
    });
    
    const productViewDiv = document.querySelector('[product-view-div]');
    if (productViewDiv) {
        observer.observe(productViewDiv, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
});

// Também executa após o productLoad
if (typeof productLoad === 'function') {
    const originalProductLoad = productLoad;
    productLoad = async function() {
        await originalProductLoad();
        setTimeout(checkFreeShippingBadge, 100);
    };
}