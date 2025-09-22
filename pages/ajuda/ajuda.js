// Reutilizando o mesmo JavaScript da página Quem Somos
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavigation = document.getElementById('main-navigation');
    if (mobileMenuToggle && mainNavigation) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavigation.classList.toggle('active');
        });
    }

    // Customer service dropdown
    const customerServiceTrigger = document.querySelector('.customer-service__trigger');
    const customerServiceDropdown = document.querySelector('.customer-service__dropdown');
    if (customerServiceTrigger && customerServiceDropdown) {
        customerServiceTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            customerServiceDropdown.classList.toggle('is-active');
        });

        document.addEventListener('click', function(e) {
            if (!customerServiceTrigger.contains(e.target)) {
                customerServiceDropdown.classList.remove('is-active');
            }
        });
    }

    // Shopping cart dropdown
    const shoppingCartTrigger = document.querySelector('.shopping-cart__trigger');
    const shoppingCartDropdown = document.querySelector('.shopping-cart__dropdown');
    if (shoppingCartTrigger && shoppingCartDropdown) {
        shoppingCartTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            shoppingCartDropdown.classList.toggle('is-active');
        });

        document.addEventListener('click', function(e) {
            if (!shoppingCartTrigger.contains(e.target)) {
                shoppingCartDropdown.classList.remove('is-active');
            }
        });
    }

    // Mega menu
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const megaMenuClose = document.querySelector('.submenu__close');

    if (megaMenuTrigger && megaMenuContent && submenuOverlay) {
        megaMenuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            megaMenuContent.classList.toggle('submenu--active');
            submenuOverlay.classList.toggle('active');
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
        });

        if (megaMenuClose) {
            megaMenuClose.addEventListener('click', function() {
                megaMenuContent.classList.remove('submenu--active');
                submenuOverlay.classList.remove('active');
                megaMenuTrigger.setAttribute('aria-expanded', 'false');
            });
        }

        submenuOverlay.addEventListener('click', function() {
            megaMenuContent.classList.remove('submenu--active');
            submenuOverlay.classList.remove('active');
            megaMenuTrigger.setAttribute('aria-expanded', 'false');
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('Obrigado por assinar nossa newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput && searchInput.value.trim()) {
                alert('Buscando por: ' + searchInput.value.trim());
                // Aqui você adicionaria a lógica real de busca
            }
        });
    }
});