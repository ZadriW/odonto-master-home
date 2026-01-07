window.addEventListener("load", loadMiniCart, false);

/**
 * Loads the minicart component via snippet call, replacing the placeholder's div content with the snippet response.
 */
async function loadMiniCart() {
    try {
        const checkoutId = client.cookie.get("carrinho-id");

        let variables = {
            checkoutId: "",
            hasCheckout: false,
        };

        if (checkoutId && checkoutId != "") {
            variables.checkoutId = checkoutId;
            variables.hasCheckout = true;
        }

       const response = await client.snippet.detailed(
            "mini_cart_snippet.html",
            "SnippetQueries/mini_cart.graphql",
            variables
        );
        if (response == null)
            return;

        const elementId = 'min-cart-items';
        setInnerHtmlById(response.html, elementId);
        updateCartQtyLabel();

        if (response.queryResponse?.data?.checkout != null) {
            await addUtmMetadata(response.queryResponse.data.checkout);
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Shows or hides the cart when the mouse moves over or out
 */
function setCartDivVisibility() {
    const cartOverlay = document.getElementById("side-card-over-list");
    const cartBar = document.getElementById("side-bar-cart");
    const overlayBg = cartOverlay?.querySelector('.fixed.inset-0.bg-secondary-500');
    const overlayClick = cartOverlay?.querySelector('.absolute.inset-0');
    
    if(!cartOverlay.classList.contains('open')){
        cartOverlay.classList.remove('hidden');
        cartOverlay.classList.remove('pointer-events-none');
        if(overlayBg) overlayBg.classList.remove('pointer-events-none');
        if(overlayClick) overlayClick.classList.remove('pointer-events-none');
        
        setTimeout(() => {
            cartOverlay.classList.remove('opacity-0');        
            cartOverlay.classList.add('opacity-100');
            cartOverlay.classList.add('open');
            if(overlayBg) overlayBg.classList.add('pointer-events-auto');
            if(overlayClick) overlayClick.classList.add('pointer-events-auto');
            cartBar.classList.remove('translate-x-full');
            cartBar.classList.add('translate-x-0'); 
        }, 100);               
        window.dispatchEvent(new Event("cartViewed"));
    }else{
        cartOverlay.classList.add('opacity-0');
        cartOverlay.classList.remove('opacity-100');
        cartOverlay.classList.remove('open');
        if(overlayBg) overlayBg.classList.remove('pointer-events-auto');
        if(overlayClick) overlayClick.classList.remove('pointer-events-auto');
        cartBar.classList.add('translate-x-full');
        cartBar.classList.remove('translate-x-0');
        
        setTimeout(() => {
            cartOverlay.classList.add('hidden');
            cartOverlay.classList.add('pointer-events-none');
            if(overlayBg) overlayBg.classList.add('pointer-events-none');
            if(overlayClick) overlayClick.classList.add('pointer-events-none');
        }, 200);        
    }
}

/**
 * Associates the current checkout with a partner
 */
async function miniCartPartnerAssociate() {
    let checkoutId = client.cookie.get('carrinho-id');
    if (checkoutId) await checkoutPartnerAssociate(checkoutId);
}

async function removeProductFromCart(id, qty, customizationId) {
    try {
        let checkoutId = client.cookie.get('carrinho-id');
        const input = getMiniCartAddOrSubtractInput(id, Number(qty), customizationId);        
        const checkoutData = await client.checkout.remove(input, checkoutId);
        await loadMiniCart();
        showOverlay('Produto removido!', 'Produto removido do carrinho');

        window.dispatchEvent(new CustomEvent("productRemovedFromCart", {
            detail: { 
                cart: checkoutData.data,
                products : [{
                    productVariantId: Number(id),
                    quantity: Number(qty)
                }]
            }
        }));
    } catch (error) {
        console.log(error);
        showOverlay('Ocorreu um erro!', 'Erro ao remover o produto do carrinho', true);
    }
}

function updateCartQtyLabel(){
    const qtyInput = document.getElementById("cart-products-qty");
    const qtyLabel = document.getElementById("cart-qty-label");
    
    if (qtyInput && qtyLabel){
        qtyLabel.innerHTML = qtyInput.value;
        const qty = parseInt(qtyInput.value);
        if (qty >= 1){
            qtyLabel.classList.add("bg-primary-600");
            qtyLabel.classList.remove("bg-secondary-600");
        }
        if (qty === 0){
            qtyLabel.classList.add("bg-secondary-600");
            qtyLabel.classList.remove("bg-primary-600");
        }
    }
}

function getMiniCartAddOrSubtractInput(productVariantId, quantity, customizationId){
    const input = [
        {
            productVariantId: Number(productVariantId),
            quantity
        }
    ];

    if (customizationId){
        input[0].customizationId = customizationId;
    }

    return input;
}

async function miniCartAddQuantity(productVariantId, customizationId){
    const input = getMiniCartAddOrSubtractInput(productVariantId, 1, customizationId);
    await client.checkout.add(input);
    await loadMiniCart();
}

async function miniCartSubtractQuantity(productVariantId, customizationId){
    const input = getMiniCartAddOrSubtractInput(productVariantId, 1, customizationId);
    await client.checkout.remove(input);
    await loadMiniCart();
}

async function addUtmMetadata(checkout) {
    const utmSource = "utm_source";
    const utmMedium = "utm_medium";
    const utmCampaign = "utm_campaign";
    const utmTerm = "utm_term";
    const utmContent = "utm_content";

    if (checkout.products?.length > 0){
        const metadataValues = [];

        const utmSourceFromCookie = client.cookie.get(utmSource);
        const utmMediumFromCookie = client.cookie.get(utmMedium);
        const utmCampaignFromCookie = client.cookie.get(utmCampaign);
        const utmTermFromCookie = client.cookie.get(utmTerm);
        const utmContentFromCookie = client.cookie.get(utmContent);

        if (utmSourceFromCookie) {
            metadataValues.push({key: "utmSource", value: utmSourceFromCookie})
            client.cookie.remove(utmSource);
        }

        if (utmMediumFromCookie) {
            metadataValues.push({key: "utmMedium", value: utmMediumFromCookie})
            client.cookie.remove(utmMedium);
        }

        if (utmCampaignFromCookie) {
            metadataValues.push({key: "utmCampaign", value: utmCampaignFromCookie})
            client.cookie.remove(utmCampaign);
        }

        if (utmTermFromCookie) {
            metadataValues.push({key: "utmTerm", value: utmTermFromCookie})
            client.cookie.remove(utmTerm);
        }

        if (utmContentFromCookie) {
            metadataValues.push({key: "utmContent", value: utmContentFromCookie})
            client.cookie.remove(utmContent);
        }

        if (metadataValues.length > 0) {
            await client.checkout.addMetadata(metadataValues, checkout.checkoutId);
        }

        return;
    }
    
    const utmSourceFromQueryString = queryStringParams.get(utmSource);
    const utmMediumFromQueryString = queryStringParams.get(utmMedium);
    const utmCampaignFromQueryString = queryStringParams.get(utmCampaign);
    const utmTermFromQueryString = queryStringParams.get(utmTerm);
    const utmContentFromQueryString = queryStringParams.get(utmContent);

    if (utmSourceFromQueryString) {
        client.cookie.set(utmSource, utmSourceFromQueryString);
    }

    if (utmMediumFromQueryString) {
        client.cookie.set(utmMedium, utmMediumFromQueryString);
    }

    if (utmCampaignFromQueryString) {
        client.cookie.set(utmCampaign, utmCampaignFromQueryString);
    }

    if (utmTermFromQueryString) {
        client.cookie.set(utmTerm, utmTermFromQueryString);
    }

    if (utmContentFromQueryString) {
        client.cookie.set(utmContent, utmContentFromQueryString);
    }
}

async function addUtmMetadataIfExists(){
    const checkout = await client.checkout.get();
    if (checkout?.data != null) await addUtmMetadata(checkout.data);
}

/**
* The kit add to cart's click event function
*/
async function miniCartAddKitQuantity(kitId, kitGroupId) {
    const input = await miniCartGetKitInput(kitId, kitGroupId, 1);
    const response = await client.checkout.addKit(input);
    if (kitOperationIsSuccess(response)) await loadMiniCart();
}

async function miniCartSubtractKitQuantity(kitId, kitGroupId){
    const input = await miniCartGetKitInput(kitId, kitGroupId, 1);
    const response = await client.checkout.removeKit(input);
    if (kitOperationIsSuccess(response)) await loadMiniCart();
}

async function miniCartRemoveKit(kitId, kitGroupId, quantity){
    const input = await miniCartGetKitInput(kitId, kitGroupId, Number(quantity));
    const response = await client.checkout.removeKit(input);
    if (kitOperationIsSuccess(response)) await loadMiniCart();
}

async function miniCartGetKitInput(kitId, kitGroupId, quantity){
    const checkoutId = client.cookie.get("carrinho-id");

    const input = {
        quantity,
        kitId: Number(kitId),
        kitGroupId,
        id: checkoutId,
    };

    return input;
}

function kitOperationIsSuccess(response){
    if (response?.errors !== "undefined" && response?.errors?.length > 0){
        showOverlay('Ocorreu um erro', response.errors[0].message, true)
        return false;
    }

    return true;
}

/**
 * Compartilha o carrinho via WhatsApp
 * Obtém o checkoutId do cookie e constrói a URL completa no formato: https://{urlDaLoja}/checkout/{checkoutId}
 */
function shareCartViaWhatsApp() {
    try {
        // Obter o checkoutId do cookie
        const checkoutId = client.cookie.get("carrinho-id");
        
        // Verificar se existe um checkoutId válido
        if (!checkoutId || checkoutId === "") {
            showOverlay('Carrinho vazio!', 'Adicione produtos ao carrinho antes de compartilhar', true);
            return;
        }
        
        // Obter a URL base da loja
        const baseUrl = window.location.origin;
        
        // Construir a URL completa no formato: https://{urlDaLoja}/checkout/{checkoutId}
        const checkoutUrl = `${baseUrl}/checkout/${checkoutId}`;
        
        // Construir a mensagem para compartilhar
        const message = encodeURIComponent(`Olá! Compartilho meu carrinho de compras com você:\n\n${checkoutUrl}`);
        
        // URL da API do WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
        
        // Abrir WhatsApp em nova aba
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        console.error('Erro ao compartilhar carrinho via WhatsApp:', error);
        showOverlay('Ocorreu um erro!', 'Erro ao compartilhar o carrinho via WhatsApp', true);
    }
}
