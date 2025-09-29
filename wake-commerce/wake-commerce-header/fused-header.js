// Wake Commerce Fused Header JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Wake Commerce Fused Header initialized');
    
    // Initialize search functionality for Wake Commerce header
    initializeWakeCommerceSearch();
    
    // Initialize cart functionality
    initializeWakeCommerceCart();
    
    // Initialize customer service dropdown
    initializeWakeCommerceCustomerService();
    
    // Initialize mobile menu
    initializeWakeCommerceMobileMenu();
    
    // Initialize login functionality
    initializeWakeCommerceLogin();
    
    // Hide loading screen after initialization
    setTimeout(hideLoadingScreen, 1000);
});

function initializeWakeCommerceSearch() {
    const searchInput = document.getElementById('txtBuscaPrincipal');
    const searchForm = document.getElementById('searchFormHeader');
    const searchAutocomplete = document.getElementById('search_autocomplete');
    
    if (searchInput) {
        // Add search input event listener
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value;
            if (query.length > 2) {
                // Would integrate with Wake Commerce search functionality
                console.log('Search query:', query);
            }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = searchInput ? searchInput.value : '';
            if (!query.trim()) {
                e.preventDefault();
                if (searchInput) searchInput.focus();
            }
        });
    }
}

function initializeWakeCommerceCart() {
    const cartLink = document.querySelector('.mybag-link');
    const cartDropdown = document.querySelector('.topCartContent');
    
    // Update cart count when cart changes
    if (window.app && window.app.modules && window.app.modules.cart) {
        const cart = window.app.modules.cart;
        
        // Update cart count in Wake Commerce header
        function updateWakeCartCount() {
            const cartCountElements = document.querySelectorAll('.cart-qty, .minicart-qtde-itens');
            const totalItems = cart.getTotalItems();
            
            cartCountElements.forEach(el => {
                if (el) {
                    el.textContent = totalItems;
                    
                    // Update the cart-empty message visibility
                    const cartEmpty = document.querySelector('.cart-empty');
                    if (cartEmpty) {
                        if (totalItems > 0) {
                            cartEmpty.style.display = 'none';
                        } else {
                            cartEmpty.style.display = 'block';
                        }
                    }
                }
            });
        }
        
        // Initialize the cart count
        updateWakeCartCount();
        
        // Subscribe to cart updates
        window.EventBus.on('cart:updated', updateWakeCartCount);
    }
}

function initializeWakeCommerceCustomerService() {
    const serviceIcon = document.querySelector('.icoatendimento');
    const serviceDropdown = document.querySelector('.dropatend');
    
    if (serviceIcon && serviceDropdown) {
        // Add hover functionality
        serviceIcon.addEventListener('mouseenter', () => {
            serviceDropdown.style.display = 'block';
        });
        
        serviceIcon.addEventListener('mouseleave', () => {
            serviceDropdown.style.display = 'none';
        });
        
        // Also keep it visible when hovering on the dropdown
        serviceDropdown.addEventListener('mouseenter', () => {
            serviceDropdown.style.display = 'block';
        });
        
        serviceDropdown.addEventListener('mouseleave', () => {
            serviceDropdown.style.display = 'none';
        });
    }
}

function initializeWakeCommerceMobileMenu() {
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.main-nav');
    const closeMenuBtn = document.querySelector('.fechamenu');
    const menuLinks = document.querySelectorAll('.menu a');
    
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMobileMenu);
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking on menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (menu && menu.classList.contains('active')) {
            const isClickInsideMenu = menu.contains(e.target) || menuIcon.contains(e.target);
            if (!isClickInsideMenu) {
                closeMobileMenu();
            }
        }
    });
}

function toggleMobileMenu() {
    const menu = document.querySelector('.main-nav');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (menu) {
        menu.classList.toggle('active');
        menu.style.display = menu.classList.contains('active') ? 'block' : 'none';
    }
}

function closeMobileMenu() {
    const menu = document.querySelector('.main-nav');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (menu) {
        menu.classList.remove('active');
        menu.style.display = 'none';
    }
}

function initializeWakeCommerceLogin() {
    // Update login greeting based on localStorage
    const updateLoginGreeting = () => {
        const userFirstName = localStorage.getItem('userFirstName');
        const loginElements = document.querySelectorAll('.textright');
        
        loginElements.forEach(el => {
            if (el && el.textContent.includes('@FBITSLogin.Add()')) {
                if (userFirstName) {
                    // Replace with user greeting
                    el.innerHTML = `Olá ${userFirstName} | <a href="/pages/minha-conta/index.html">Minha Conta</a> | <a href="#" onclick="logout()">Sair</a>`;
                } else {
                    // Keep the Wake Commerce login component
                    el.innerHTML = '@FBITSLogin.Add()';
                }
            }
        });
    };
    
    // Run immediately and subscribe to login events
    updateLoginGreeting();
    
    // If login/logout events are available, subscribe to them
    if (window.EventBus) {
        window.EventBus.on('user:login', updateLoginGreeting);
        window.EventBus.on('user:logout', updateLoginGreeting);
    }
}

function hideLoadingScreen() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Global functions for Wake Commerce compatibility
function updateCartCount() {
    // Wrapper function for Wake Commerce cart updates
    if (window.app && window.app.modules && window.app.modules.cart) {
        const cart = window.app.modules.cart;
        const cartCountElements = document.querySelectorAll('.cart-qty, .minicart-qtde-itens');
        const totalItems = cart.getTotalItems();
        
        cartCountElements.forEach(el => {
            if (el) {
                el.textContent = totalItems;
            }
        });
    }
}

// Add hover effect for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect to cart area
    const cartArea = document.querySelector('.mini-cart');
    if (cartArea) {
        cartArea.addEventListener('mouseenter', function() {
            const cartContent = this.querySelector('.topCartContent');
            if (cartContent) {
                cartContent.style.display = 'block';
            }
        });
        
        cartArea.addEventListener('mouseleave', function() {
            const cartContent = this.querySelector('.topCartContent');
            if (cartContent) {
                setTimeout(() => {
                    cartContent.style.display = 'none';
                }, 300); // Small delay to allow clicking on cart items
            }
        });
    }
});

// Export functions for potential reuse
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeWakeCommerceSearch,
        initializeWakeCommerceCart,
        initializeWakeCommerceCustomerService,
        initializeWakeCommerceMobileMenu,
        initializeWakeCommerceLogin,
        hideLoadingScreen,
        updateCartCount
    };
}