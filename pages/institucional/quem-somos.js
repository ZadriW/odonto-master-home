document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        setTimeout(function() {
            loadingScreen.classList.add('hidden');
        }, 1000);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (mobileMenuToggle && mobileMenuClose && mainNavigation) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.add('nav-open');
            mainNavigation.setAttribute('aria-hidden', 'false');
        });
        
        mobileMenuClose.addEventListener('click', function() {
            document.body.classList.remove('nav-open');
            mainNavigation.setAttribute('aria-hidden', 'true');
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
            megaMenuContent.classList.add('submenu--active');
            submenuOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        megaMenuClose.addEventListener('click', function() {
            megaMenuContent.classList.remove('submenu--active');
            submenuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        submenuOverlay.addEventListener('click', function() {
            megaMenuContent.classList.remove('submenu--active');
            submenuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Customer service dropdown
    const customerServiceTrigger = document.querySelector('.customer-service__trigger');
    const customerServiceDropdown = document.querySelector('.customer-service__dropdown');
    
    if (customerServiceTrigger && customerServiceDropdown) {
        customerServiceTrigger.addEventListener('click', function() {
            customerServiceDropdown.classList.toggle('is-active');
        });
        
        document.addEventListener('click', function(e) {
            if (!customerServiceTrigger.contains(e.target) && !customerServiceDropdown.contains(e.target)) {
                customerServiceDropdown.classList.remove('is-active');
            }
        });
    }
    
    // Shopping cart dropdown
    const shoppingCartTrigger = document.querySelector('.shopping-cart__trigger');
    const shoppingCartDropdown = document.querySelector('.shopping-cart__dropdown');
    
    if (shoppingCartTrigger && shoppingCartDropdown) {
        shoppingCartTrigger.addEventListener('click', function() {
            shoppingCartDropdown.classList.toggle('is-active');
        });
        
        document.addEventListener('click', function(e) {
            if (!shoppingCartTrigger.contains(e.target) && !shoppingCartDropdown.contains(e.target)) {
                shoppingCartDropdown.classList.remove('is-active');
            }
        });
    }
    
    // My account dropdown
    const myAccountTrigger = document.querySelector('.my-account__trigger');
    
    if (myAccountTrigger) {
        myAccountTrigger.addEventListener('click', function() {
            // Nesta versão estática, apenas mostra um alerta
            alert('Área de login/cadastro não implementada nesta versão estática.');
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Obrigado por assinar nossa newsletter!');
                this.reset();
            }
        });
    }
    
    // Search form
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput.value.trim()) {
                alert('Busca por: ' + searchInput.value);
                searchInput.value = '';
            }
        });
    }
});