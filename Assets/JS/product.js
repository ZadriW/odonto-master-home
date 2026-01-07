window.addEventListener("load", productLoad, false);
let alertDiv = "";

/**
 * Page load function.
 */
async function productLoad(){
    alertDiv = document.getElementById("add-cart-alert");
    preventUnavailableSectionRedirect();
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
        
        // Find all inputs and forms within the section
        const inputs = section.querySelectorAll('input, textarea, select, button, form');
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
    
    const inputs = section.querySelectorAll('input, textarea, select, button, form');
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
            productButton.classList.add('added');
            productButton.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            
            // Remover a classe após 2 segundos
            setTimeout(() => {
                productButton.classList.remove('added');
                productButton.textContent = 'Adicionar ao Carrinho';
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

    const name = document.getElementById("bis-name-" + productVariantId);
    const email = document.getElementById("bis-email-" + productVariantId);

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
        }        
    }

    showOverlay(title, message, error);
}

/**
 * Swap the main product image for the selected thumbnail
 * @param {string} imgUrl - Product image full url.
 */
const changeFirstImage = (imgUrl) => {
    document.getElementById('firstImage').src=`${imgUrl}`
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
        
        // Add scroll event listener to update button states
        const updateButtonStates = () => {
            const scrollLeft = slider.scrollLeft;
            const scrollWidth = slider.scrollWidth;
            const clientWidth = slider.clientWidth;
            const isAtStart = scrollLeft <= 1;
            const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
            
            newPrevBtn.disabled = isAtStart;
            newNextBtn.disabled = isAtEnd;
        };
        
        slider.addEventListener('scroll', updateButtonStates);
        
        // Add click event listeners for navigation
        newPrevBtn.addEventListener('click', () => {
            scrollThumbnails(container, false);
        });
        
        newNextBtn.addEventListener('click', () => {
            scrollThumbnails(container, true);
        });
        
        // Initial button state update
        updateButtonStates();
        
        // Update button states on resize
        window.addEventListener('resize', updateButtonStates);
    });
}

/**
 * Scroll thumbnails slider
 * @param {HTMLElement} container - Thumbnails container element
 * @param {boolean} next - true to scroll forward, false to scroll backward
 */
function scrollThumbnails(container, next) {
    const slider = container.querySelector('.product-thumbnails-slider');
    if (!slider) return;
    
    const thumbnails = slider.querySelectorAll('.product-thumbnail');
    if (thumbnails.length === 0) return;
    
    // Calculate scroll amount (4 thumbnails at a time)
    const firstThumbnail = thumbnails[0];
    const thumbnailWidth = firstThumbnail.offsetWidth;
    const gapStyle = window.getComputedStyle(slider).gap;
    const gap = gapStyle ? parseFloat(gapStyle) : 8; // Default to 8px if gap is not set
    const scrollAmount = (thumbnailWidth + gap) * 4; // Scroll 4 thumbnails
    
    const currentScroll = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    
    let newScroll;
    if (next) {
        newScroll = Math.min(currentScroll + scrollAmount, maxScroll);
    } else {
        newScroll = Math.max(currentScroll - scrollAmount, 0);
    }
    
    slider.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });
}

// Initialize thumbnail navigation on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThumbnailNavigation);
} else {
    initThumbnailNavigation();
}