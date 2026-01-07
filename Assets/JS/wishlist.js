window.addEventListener("userChecked", wishlistLoad, false);
let productsInWishlist = [];

/**
 * Wishlist load function.
 * Executes after the user identification event is dispatched (user_login.js)
 */
async function wishlistLoad(){
    try {
        const wishlistBodyDiv = document.getElementById("wishlist-body");
        
        if (wishlistBodyDiv){
            if (!await validateCustomerAccessToken()){
                const loginMessage = `
                    <div class="wishlist-login-message">
                        <div class="wishlist-login-message__icon">
                            <svg viewBox="0 0 23 20" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.12825 3.05745C2.67628 3.50942 2.31775 4.04599 2.07314 4.63652C1.82853 5.22705 1.70264 5.85997 1.70264 6.49916C1.70264 7.13834 1.82853 7.77127 2.07314 8.3618C2.31775 8.95233 2.67628 9.4889 3.12825 9.94087L11.4372 18.2499L19.7462 9.94087C20.659 9.02807 21.1718 7.79005 21.1718 6.49916C21.1718 5.20827 20.659 3.97025 19.7462 3.05745C18.8334 2.14465 17.5954 1.63185 16.3045 1.63185C15.0136 1.63185 13.7756 2.14465 12.8628 3.05745L11.4372 4.48302L10.0117 3.05745C9.5597 2.60548 9.02313 2.24695 8.4326 2.00234C7.84207 1.75773 7.20915 1.63184 6.56996 1.63184C5.93078 1.63184 5.29785 1.75773 4.70732 2.00234C4.11679 2.24695 3.58022 2.60548 3.12825 3.05745Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h3 class="wishlist-login-message__title">Faça login para ver sua lista de desejos</h3>
                        <p class="wishlist-login-message__text">Você precisa estar logado para acessar seus produtos favoritos</p>
                        <a href="/login" class="wishlist-login-message__button">Entrar na minha conta</a>
                    </div>
                `;
                setInnerHtml(loginMessage, wishlistBodyDiv);
                return;
            }

            const variables = {
                customerAccessToken: pageUser.customerAccessToken
            };
    
            const response = await client.snippet.render("wishlist_snippet.html", "SnippetQueries/wishlist.graphql", variables);
            
            // Verifica se a resposta é válida
            let content;
            if (response && typeof response === 'string' && response.trim() !== '') {
                content = response;
            } else if (response && typeof response === 'object' && response.error) {
                console.error('Erro na wishlist:', response.error);
                content = "<h3>Não foi possível buscar a lista de desejos.</h3>";
            } else {
                content = response || "<h3>Não foi possível buscar a lista de desejos.</h3>";
            }
            
            setInnerHtml(content, wishlistBodyDiv);

        }
    } catch(error) {
        console.error('Erro ao carregar wishlist:', error);
        const wishlistBodyDiv = document.getElementById("wishlist-body");
        if (wishlistBodyDiv) {
            setInnerHtml("<h3>Não foi possível buscar a lista de desejos.</h3>", wishlistBodyDiv);
        }
    }
}

/**
 * Gets the IDs of products added in the user's wishlist
 */
async function updateProductsInWishlist() {
    // Garante que pageUser está definido
    if (!pageUser) {
        await setCustomerAccessToken();
    }
    
    if(pageUser?.customerAccessToken) {
        try {
            const query = 
            "query Wishlist($customerAccessToken: String!) {\
                customer(customerAccessToken: $customerAccessToken) {\
                    wishlist {\
                        products {\
                            productId\
                        }\
                    }\
                }\
            }";
            
            const variables = { customerAccessToken: pageUser.customerAccessToken };
            
            let response = await client.query(query, variables);
            let result = response?.customer?.wishlist?.products;
            
            let ids = result ? result.map(a => a.productId) : [];
            productsInWishlist.splice(0, productsInWishlist.length, ...ids);
        } catch(error) {
            console.warn('Erro ao atualizar wishlist:', error);
        }
    }
}


/**
 * Add to wishlist button click.
 * @param {HTMLInputElement} button - Button reference from HTML.
 * @param {string} productId - Product ID to add to wishlist.
 */
async function wishlistAddClick(button, productId) {
    const element = document.getElementById(`wishlist-icon-${productId}`);
    const success = await addOrRemoveWishlist(productId, true);

    if (element && success) {
        element.classList.add("fill-red-300");
        element.classList.add("stroke-red-700");
        button.setAttribute("onclick", `wishlistRemoveClick(this, ${productId})`);
    }
    
    window.dispatchEvent(new CustomEvent("productAddedToWishlist", {
        detail: { 
            products : [{
                productId: Number(productId)
            }]
        }
    }));
}

/**
 * Remove from wishlist button click.
 * @param {HTMLInputElement} button - Button reference from HTML.
 * @param {string} productId - Product ID to remove from wishlist.
 */
async function wishlistRemoveClick(button, productId) {
    const element = document.getElementById(`wishlist-icon-${productId}`);
    const success = await addOrRemoveWishlist(productId, false);
    
    if (element && success) {
        element.classList.remove("fill-red-300");
        element.classList.remove("stroke-red-700");
        button.setAttribute("onclick", `wishlistAddClick(this, ${productId})`);
    }
    
    window.dispatchEvent(new CustomEvent("productRemovedFromWishlist", {
        detail: { 
            products : [{
                productId: Number(productId)
            }]
        }
    }));
}

/**
 * Checks 'user' variable value and sets it if an user is logged in.
 */
async function setCustomerAccessToken(){    
    const customerAccessToken = client.cookie.get('sf_customer_access_token');
    if ( customerAccessToken === null) return;

    const user = await client.customer.get();  
    if (user == null) return;

    pageUser = user;
    pageUser.customerAccessToken = customerAccessToken;
}

/**
 * Validates if customer access token exists.
 */
async function validateCustomerAccessToken(){
    await setCustomerAccessToken();
    return pageUser?.customerAccessToken != null;
}

/**
 * Build wishlist input.
 * @param {string} productId - Product ID to add to wishlist.
 */
function buildWishlistInput(productId){
    return {
        customerAccessToken: pageUser.customerAccessToken,
        productId: Number(productId)
    };
}

/**
 * Add or remove product from wishlist.
 * @param {string} productId - Product ID to add to wishlist.
 * @param {bool} add - True for add and false for remove.
 */
async function addOrRemoveWishlist(productId, add) {
    try {
        if (productId) {
            if (await validateCustomerAccessToken()) {
                const input = buildWishlistInput(productId);
                
                if (add) {
                    await client.wishlist.add(input);
                    showOverlay('Produto adicionado!', 'Produto adicionado à sua lista de desejos');
                    return true;
                }
                else{
                    await client.wishlist.remove(input);
                    // Remove da lista local
                    productsInWishlist = productsInWishlist.filter(id => id !== Number(productId));
                    // Atualiza visualmente removendo as classes
                    const productIdStr = String(productId);
                    let productElements = document.querySelectorAll(`.wishlist-icon-${productIdStr}`);
                    let buttonElements = document.querySelectorAll(`.wishlist-button-${productIdStr}`);
                    
                    // Remove classes de favorito
                    productElements.forEach(function(element) {
                        element.classList.remove("fill-red-300");
                        element.classList.remove("stroke-red-700");
                    });
                    
                    // Atualiza onclick dos botões
                    buttonElements.forEach(function(button) {
                        button.setAttribute('onclick', `wishlistAddClick(this, ${productIdStr})`);
                    });
                    
                    // Se estiver na página de wishlist, recarrega
                    const wishlistBodyDiv = document.getElementById("wishlist-body");
                    if (wishlistBodyDiv) {
                        await wishlistLoad();
                    }
                    
                    showOverlay('Produto removido!', 'Produto removido da sua lista de desejos');
                    return true;
                }
            }
            else {
                showOverlay('Usuário não identificado!', 'Não é possível adicionar produtos à lista de desejos sem login de usuário. Você será redirecionado para a página de login', true);
                redirectToLogin();
                return false;
            }
        }
    } catch(error) {
        console.log(error);
        if (add) {
            showOverlay('Ocorreu um erro!', 'Erro ao adicionar o produto à lista de desejos', true)
            return false;
        }
        else {
            showOverlay('Ocorreu um erro!', 'Erro ao remover o produto da lista de desejos', true)
            return false;
        }
    }
}