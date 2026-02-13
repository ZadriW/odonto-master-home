/**
 * ============================================================================
 * SISTEMA DE WISHLIST (LISTA DE DESEJOS)
 * ============================================================================
 * 
 * Este sistema gerencia a lista de desejos dos usuários de forma robusta,
 * garantindo que os ícones de wishlist nos cards de produtos sejam mantidos
 * sincronizados com o estado real da wishlist do usuário.
 * 
 * FUNCIONALIDADES PRINCIPAIS:
 * ---------------------------
 * 1. Carregamento automático da wishlist ao fazer login
 * 2. Atualização visual de todos os ícones na página
 * 3. Sincronização em tempo real ao adicionar/remover produtos
 * 4. Detecção automática de produtos adicionados dinamicamente (paginação, carrosséis)
 * 5. Diferenciação por usuário usando customerAccessToken
 * 
 * FLUXO DE FUNCIONAMENTO:
 * -----------------------
 * 1. Usuário faz login → evento "userChecked" é disparado
 * 2. initializeWishlist() é chamado automaticamente
 * 3. Sistema busca produtos da wishlist via GraphQL
 * 4. Todos os ícones na página são atualizados (vermelho se na wishlist)
 * 5. MutationObserver monitora novos produtos adicionados ao DOM
 * 6. Ao adicionar/remover produto, todas as instâncias são atualizadas
 * 
 * ESTILOS VISUAIS:
 * ----------------
 * - Produto NA wishlist: fill-red-300 stroke-red-700 (vermelho)
 * - Produto FORA da wishlist: fill-none stroke-black (preto)
 * 
 * INTEGRAÇÃO COM OUTROS SISTEMAS:
 * --------------------------------
 * Para sistemas que carregam produtos dinamicamente (ex: paginação),
 * dispare um dos seguintes eventos após carregar os produtos:
 * 
 *   window.dispatchEvent(new CustomEvent("productsLoaded"));
 *   window.dispatchEvent(new CustomEvent("pageContentUpdated"));
 * 
 * Ou chame manualmente: refreshWishlistIcons()
 * 
 * PERSISTÊNCIA POR USUÁRIO:
 * -------------------------
 * O sistema usa pageUser.customerAccessToken para identificar o usuário.
 * Cada usuário tem sua própria wishlist independente no servidor.
 * Ao trocar de usuário (logout/login), a wishlist é recarregada automaticamente.
 * 
 * ============================================================================
 */

window.addEventListener("userChecked", initializeWishlist, false);

// Evento customizado para atualizar ícones quando produtos são carregados dinamicamente
window.addEventListener("productsLoaded", handleProductsLoaded, false);
window.addEventListener("pageContentUpdated", handleProductsLoaded, false);

let productsInWishlist = [];
let wishlistInitialized = false;

// Observer para detectar novos produtos adicionados dinamicamente à página
let wishlistObserver = null;

/**
 * Handler for custom events that indicate new products were loaded
 * @param {CustomEvent} event - The custom event
 */
async function handleProductsLoaded(event) {
    if (wishlistInitialized && pageUser?.customerAccessToken) {
        console.log('Produtos carregados dinamicamente - atualizando ícones de wishlist');
        setTimeout(() => {
            updateAllWishlistIcons();
        }, 200);
    }
}

/**
 * Initializes MutationObserver to watch for dynamically added products
 * Updates wishlist icons when new product cards are added to the DOM
 */
function initializeWishlistObserver() {
    // Se já existe um observer, desconecta
    if (wishlistObserver) {
        wishlistObserver.disconnect();
    }
    
    // Configuração do observer
    const config = {
        childList: true,
        subtree: true
    };
    
    // Callback quando mutações são detectadas
    const callback = function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Verifica se algum nó adicionado contém botões de wishlist
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const wishlistButtons = node.querySelectorAll 
                            ? node.querySelectorAll('[class*="wishlist-button-"]')
                            : [];
                        
                        if (wishlistButtons.length > 0 || node.classList?.contains('product-card')) {
                            // Aguarda um pouco para garantir que o DOM está estável
                            setTimeout(() => {
                                updateAllWishlistIcons();
                            }, 100);
                        }
                    }
                });
            }
        }
    };
    
    // Cria o observer
    wishlistObserver = new MutationObserver(callback);
    
    // Observa mudanças no body
    wishlistObserver.observe(document.body, config);
    
    console.log('Wishlist Observer inicializado - detectará produtos adicionados dinamicamente');
}

/**
 * Initializes wishlist system after user check
 * Updates product icons and loads wishlist page if needed
 */
async function initializeWishlist() {
    await wishlistLoad();
    await updateProductsInWishlist();
    await updateAllWishlistIcons();
    
    // Inicializa observer para detectar produtos adicionados dinamicamente
    initializeWishlistObserver();
    
    wishlistInitialized = true;
    console.log('Sistema de wishlist inicializado completamente');
}

/**
 * Re-initializes wishlist icons (useful after page navigation or content updates)
 * Can be called manually when needed
 */
async function refreshWishlistIcons() {
    if (pageUser?.customerAccessToken) {
        await updateProductsInWishlist();
        await updateAllWishlistIcons();
        console.log('Ícones de wishlist atualizados manualmente');
    }
}

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
            const content = response ? response : "<h3>Não foi possível buscar a lista de desejos.</h3>";
            
            setInnerHtml(content, wishlistBodyDiv);

        }
    } catch(error) {
        console.log(error);
    }
}

/**
 * Gets the IDs of products added in the user's wishlist
 * Fetches from API and updates local array
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
            
            console.log(`Wishlist carregada para usuário: ${ids.length} produtos`);
            return ids;
        } catch(error) {
            console.warn('Erro ao atualizar wishlist:', error);
            return [];
        }
    }
    return [];
}

/**
 * Updates all wishlist icons on the page based on productsInWishlist array
 * Marks products that are in the wishlist with red styling
 */
async function updateAllWishlistIcons() {
    if (!pageUser?.customerAccessToken) {
        console.log('Usuário não autenticado - ícones não serão atualizados');
        return;
    }

    // Busca todos os botões de wishlist na página
    const allWishlistButtons = document.querySelectorAll('[class*="wishlist-button-"]');
    
    console.log(`Atualizando ${allWishlistButtons.length} botões de wishlist na página`);
    
    allWishlistButtons.forEach(button => {
        // Extrai o product_id do nome da classe
        const classList = Array.from(button.classList);
        const wishlistClass = classList.find(cls => cls.startsWith('wishlist-button-'));
        
        if (wishlistClass) {
            const productId = Number(wishlistClass.replace('wishlist-button-', ''));
            const icon = document.getElementById(`wishlist-icon-${productId}`);
            
            if (icon) {
                const isInWishlist = productsInWishlist.includes(productId);
                
                if (isInWishlist) {
                    // Produto está na wishlist - marca como favorito
                    icon.classList.add('fill-red-300', 'stroke-red-700');
                    button.setAttribute('onclick', `wishlistRemoveClick(this, ${productId})`);
                } else {
                    // Produto não está na wishlist - remove marcação
                    icon.classList.remove('fill-red-300', 'stroke-red-700');
                    button.setAttribute('onclick', `wishlistAddClick(this, ${productId})`);
                }
            }
        }
    });
    
    console.log(`Ícones atualizados. Produtos na wishlist: ${productsInWishlist.length}`);
}

/**
 * Updates a specific product's wishlist icon across all instances on the page
 * @param {number} productId - The product ID to update
 * @param {boolean} isInWishlist - Whether the product is in the wishlist
 */
function updateProductWishlistIcon(productId, isInWishlist) {
    const productIdStr = String(productId);
    const icons = document.querySelectorAll(`.wishlist-icon-${productIdStr}`);
    const buttons = document.querySelectorAll(`.wishlist-button-${productIdStr}`);
    
    icons.forEach(icon => {
        if (isInWishlist) {
            icon.classList.add('fill-red-300', 'stroke-red-700');
        } else {
            icon.classList.remove('fill-red-300', 'stroke-red-700');
        }
    });
    
    buttons.forEach(button => {
        const clickHandler = isInWishlist 
            ? `wishlistRemoveClick(this, ${productIdStr})`
            : `wishlistAddClick(this, ${productIdStr})`;
        button.setAttribute('onclick', clickHandler);
    });
}


/**
 * Add to wishlist button click.
 * @param {HTMLInputElement} button - Button reference from HTML.
 * @param {string} productId - Product ID to add to wishlist.
 */
async function wishlistAddClick(button, productId) {
    const success = await addOrRemoveWishlist(productId, true);

    if (success) {
        // Adiciona à lista local
        const numericProductId = Number(productId);
        if (!productsInWishlist.includes(numericProductId)) {
            productsInWishlist.push(numericProductId);
        }
        
        // Atualiza todos os ícones deste produto na página
        updateProductWishlistIcon(numericProductId, true);
        
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent("productAddedToWishlist", {
            detail: { 
                products : [{
                    productId: numericProductId
                }]
            }
        }));
    }
}

/**
 * Remove from wishlist button click.
 * @param {HTMLInputElement} button - Button reference from HTML.
 * @param {string} productId - Product ID to remove from wishlist.
 */
async function wishlistRemoveClick(button, productId) {
    const success = await addOrRemoveWishlist(productId, false);
    
    if (success) {
        // Remove da lista local
        const numericProductId = Number(productId);
        productsInWishlist = productsInWishlist.filter(id => id !== numericProductId);
        
        // Atualiza todos os ícones deste produto na página
        updateProductWishlistIcon(numericProductId, false);
        
        // Se estiver na página de wishlist, recarrega
        const wishlistBodyDiv = document.getElementById("wishlist-body");
        if (wishlistBodyDiv) {
            await wishlistLoad();
        }
        
        // Dispara evento customizado
        window.dispatchEvent(new CustomEvent("productRemovedFromWishlist", {
            detail: { 
                products : [{
                    productId: numericProductId
                }]
            }
        }));
    }
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