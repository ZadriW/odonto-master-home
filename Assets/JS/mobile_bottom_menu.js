/**
 * Mobile Bottom Menu JavaScript
 * Implementação simples e direta
 */

/**
 * Atualiza o badge de quantidade do carrinho no menu mobile
 */
function updateMobileCartQtyLabel() {
    const qtyLabel = document.getElementById("cart-qty-label");
    const mobileQtyLabel = document.getElementById("mobile-cart-qty-label");
    
    if (!mobileQtyLabel) return;
    
    if (qtyLabel) {
        const qty = qtyLabel.textContent.trim();
        mobileQtyLabel.textContent = qty;
        
        if (qty && qty !== "0" && qty !== "") {
            mobileQtyLabel.style.display = "flex";
        } else {
            mobileQtyLabel.style.display = "none";
        }
    } else {
        mobileQtyLabel.textContent = "0";
        mobileQtyLabel.style.display = "none";
    }
}

/**
 * Alterna a exibição da navbar (abre/fecha)
 * Similar ao comportamento do carrinho lateral
 */
function toggleNavBar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) {
        console.warn('Navbar element not found');
        return;
    }
    
    // Verifica se o menu está aberto de forma simples e confiável
    // O menu está aberto se NÃO tem 'hidden' E tem 'translate-x-0'
    const isHidden = navbar.classList.contains('hidden');
    const hasTranslateX0 = navbar.classList.contains('translate-x-0');
    
    // Se não está hidden E tem translate-x-0, está aberto
    // Caso contrário, está fechado
    const isOpen = !isHidden && hasTranslateX0;
    
    // Verifica se a função showNavBar existe (pode não estar carregada ainda)
    if (typeof showNavBar === 'function') {
        // Alterna o estado
        showNavBar(!isOpen);
    } else {
        // Se showNavBar não está disponível, tenta abrir manualmente
        // Isso garante que o menu funcione mesmo se o script navbar.js não carregou
        console.warn('showNavBar function not found, using fallback');
        if (!isOpen) {
            // Abre o menu manualmente
            navbar.classList.remove('hidden');
            const navbarBg = document.getElementById('navbar-bg-opacity');
            if (navbarBg) {
                navbarBg.classList.remove('hidden');
                setTimeout(() => {
                    navbarBg.classList.remove('opacity-0');
                    navbarBg.classList.add('opacity-100');
                    navbar.classList.remove('-translate-x-full');
                    navbar.classList.add('translate-x-0');
                }, 100);
            }
        } else {
            // Fecha o menu manualmente
            const navbarBg = document.getElementById('navbar-bg-opacity');
            if (navbarBg) {
                navbarBg.classList.remove('opacity-100');
                navbarBg.classList.add('opacity-0');
                navbar.classList.add('-translate-x-full');
                navbar.classList.remove('translate-x-0');
                setTimeout(() => {
                    navbar.classList.add('hidden');
                    navbarBg.classList.add('hidden');
                }, 200);
            }
        }
    }
}

/**
 * Atualiza o link de conta quando o usuário estiver logado
 */
function updateMobileUserAccountLink() {
    const userAccountLink = document.getElementById("mobile-user-account-link");
    if (!userAccountLink) return;
    
    const loggedUser = document.getElementById("logged-user");
    const login = document.getElementById("login");
    
    if (loggedUser && !loggedUser.classList.contains("hidden")) {
        const accountDataUrl = userAccountLink.getAttribute("data-account-url");
        if (accountDataUrl) {
            userAccountLink.href = accountDataUrl;
        }
    } else if (login && !login.classList.contains("hidden")) {
        const loginUrl = document.getElementById("login-url");
        if (loginUrl) {
            userAccountLink.href = loginUrl.value;
        }
    }
}

/**
 * Mostra ou oculta o menu baseado na largura da tela
 */
function toggleMobileMenu() {
    const menu = document.getElementById("mobileBottomMenu");
    if (!menu) return;
    
    if (window.innerWidth <= 768) {
        menu.style.cssText = "display: flex !important; position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; background: #fff !important; border-top: 1px solid #e5e7eb !important; box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1) !important; z-index: 9990 !important; padding: 0 !important; margin: 0 !important;";
        // Aplicar padding-bottom no body apenas no mobile
        if (window.innerWidth <= 480) {
            document.body.style.paddingBottom = "65px";
        } else {
            document.body.style.paddingBottom = "70px";
        }
    } else {
        menu.style.cssText = "display: none !important;";
        document.body.style.paddingBottom = "";
    }
}

/**
 * Ajusta o menu mobile para páginas de checkout
 * Altera o ícone do carrinho e remove o badge
 */
function adjustMobileMenuForCheckout() {
    // Verifica se estamos em uma página de checkout
    const isCheckoutPage = document.body.classList.contains('page-checkout');
    
    if (!isCheckoutPage) return;
    
    // Encontra o botão do carrinho
    const cartButton = document.querySelector('.mobile-bottom-menu__item--cart');
    if (!cartButton) return;
    
    // Encontra o ícone do carrinho
    const cartIcon = cartButton.querySelector('.fa-shopping-cart');
    if (cartIcon) {
        // Altera o ícone para cart-arrow-down
        cartIcon.classList.remove('fa-shopping-cart');
        cartIcon.classList.add('fa-cart-arrow-down');
    }
    
    // Encontra e remove/oculta o badge
    const cartBadge = cartButton.querySelector('.mobile-bottom-menu__badge');
    if (cartBadge) {
        cartBadge.style.display = 'none';
        cartBadge.style.visibility = 'hidden';
        cartBadge.style.opacity = '0';
        cartBadge.style.width = '0';
        cartBadge.style.height = '0';
        cartBadge.style.overflow = 'hidden';
    }
    
    // Desabilita a funcionalidade do botão do carrinho
    cartButton.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };
    
    // Adiciona estilo visual para indicar que está desabilitado
    cartButton.style.opacity = '0.6';
    cartButton.style.cursor = 'not-allowed';
    cartButton.setAttribute('aria-label', 'Carrinho não disponível nesta página');
}

/**
 * Inicializa o menu mobile
 */
function initMobileBottomMenu() {
    // Mostrar/ocultar menu baseado na largura
    toggleMobileMenu();
    
    // Ajustar menu para páginas de checkout
    adjustMobileMenuForCheckout();
    
    // Atualizar badge do carrinho (apenas se não for checkout)
    if (!document.body.classList.contains('page-checkout')) {
        updateMobileCartQtyLabel();
    }
    
    // Atualizar link de conta
    updateMobileUserAccountLink();
    
    // Observar mudanças no carrinho (apenas se não for checkout)
    if (!document.body.classList.contains('page-checkout')) {
        const cartQtyLabel = document.getElementById("cart-qty-label");
        if (cartQtyLabel) {
            const observer = new MutationObserver(function() {
                updateMobileCartQtyLabel();
            });
            observer.observe(cartQtyLabel, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }
    }
    
    // Observar mudanças no estado de login
    const loggedUser = document.getElementById("logged-user");
    const login = document.getElementById("login");
    
    if (loggedUser) {
        const userObserver = new MutationObserver(function() {
            updateMobileUserAccountLink();
        });
        userObserver.observe(loggedUser, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
    
    if (login) {
        const loginObserver = new MutationObserver(function() {
            updateMobileUserAccountLink();
        });
        loginObserver.observe(login, {
            attributes: true,
            attributeFilter: ["class"]
        });
    }
}

// Inicializar quando a página carregar
function startMobileMenu() {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(function() {
        initMobileBottomMenu();
        toggleMobileMenu();
        // Ajustar novamente para checkout caso o menu seja carregado dinamicamente
        adjustMobileMenuForCheckout();
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMobileMenu);
} else {
    startMobileMenu();
}

// Atualizar ao redimensionar a janela
window.addEventListener('resize', function() {
    toggleMobileMenu();
});

// Atualizar quando o carrinho for atualizado
window.addEventListener('load', function() {
    setTimeout(function() {
        if (!document.body.classList.contains('page-checkout')) {
            updateMobileCartQtyLabel();
        }
        toggleMobileMenu();
        // Ajustar novamente para checkout
        adjustMobileMenuForCheckout();
    }, 500);
});

// Atualizar quando o usuário for verificado
window.addEventListener('userChecked', function() {
    setTimeout(updateMobileUserAccountLink, 100);
});

// Interceptar atualizações do carrinho
if (typeof loadMiniCart === 'function') {
    const originalLoadMiniCart = loadMiniCart;
    window.loadMiniCart = async function() {
        const result = await originalLoadMiniCart();
        setTimeout(updateMobileCartQtyLabel, 100);
        return result;
    };
}
