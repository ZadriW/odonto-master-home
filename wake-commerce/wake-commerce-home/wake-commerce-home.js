// Wake Commerce Home Page JavaScript Integration

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wake Commerce Home Page initialized');
    
    // Initialize Wake Commerce components and carousels
    initWakeCommerceComponents();
    
    // Initialize any existing functionality that needs to be preserved
    initializeCommonFeatures();
});

function initWakeCommerceComponents() {
    console.log('Initializing Wake Commerce components...');
    
    // Initialize banner carousels using Slick or similar carousel library
    initBannerCarousels();
    
    // Initialize vitrine carousels
    initVitrineCarousels();
    
    // Initialize special department offers
    initDepartmentOffers();
    
    // Handle responsive behavior for desktop/mobile banners
    handleResponsiveBanners();
}

function initBannerCarousels() {
    // Initialize mobile top banner carousel (for smaller screens)
    if (document.querySelector('.row-fbits-banner-topo')) {
        // Implementation would depend on the carousel library used by Wake Commerce
        console.log('Mobile top banner carousel ready');
    }
    
    // Initialize main top banner carousel (for desktop screens)
    if (document.querySelector('.row-fbits-banner-topo') && window.innerWidth > 990) {
        console.log('Main top banner carousel ready');
    }
    
    // Initialize center lower banner carousel
    if (document.querySelector('.row-fbits-banner-centroLower')) {
        console.log('Center lower banner carousel ready');
    }
    
    // Initialize footer banner carousel
    if (document.querySelector('.row-fbits-banner-rodape')) {
        console.log('Footer banner carousel ready');
    }
}

function initVitrineCarousels() {
    // Initialize "Melhores Ofertas" carousel
    if (document.querySelector('.row-vitrine-home')) {
        console.log('Melhores Ofertas carousel ready');
    }
    
    // Initialize "Novidades" carousel
    if (document.querySelector('.row-vitrine-home') && document.querySelectorAll('.row-vitrine-home').length > 1) {
        console.log('Novidades carousel ready');
    }
    
    // Initialize "Clareador" carousel
    if (document.querySelector('.row-vitrine-home') && document.querySelectorAll('.row-vitrine-home').length > 2) {
        console.log('Clareador carousel ready');
    }
}

function initDepartmentOffers() {
    // Initialize "Ofertas por Departamento" carousel
    if (document.querySelector('.row-ofertas-departamento')) {
        console.log('Department offers carousel ready');
    }
}

function handleResponsiveBanners() {
    // Handle responsive behavior for banners based on screen size
    function updateBannerDisplay() {
        if (window.innerWidth > 990) {
            // Desktop view: show desktop banners, remove mobile
            const desktopBanners = document.querySelectorAll('.bdesk');
            const mobileBanners = document.querySelectorAll('.bmob');
            
            desktopBanners.forEach(banner => {
                banner.style.display = 'block';
            });
            
            mobileBanners.forEach(banner => {
                banner.style.display = 'none';
            });
            
            // Initialize desktop carousel
            if (typeof jQuery !== 'undefined' && jQuery('.bcentro').length) {
                jQuery('.bcentro').slick({
                    dots: true,
                    fade: true,
                    autoplay: true,
                    arrows: true
                });
            }
        } else {
            // Mobile view: show mobile banners, remove desktop
            const mobileBanners = document.querySelectorAll('.bmob');
            const desktopBanners = document.querySelectorAll('.bdesk');
            
            mobileBanners.forEach(banner => {
                banner.style.display = 'block';
            });
            
            desktopBanners.forEach(banner => {
                banner.style.display = 'none';
            });
            
            // Initialize mobile carousel
            if (typeof jQuery !== 'undefined' && jQuery('.bcentro2').length) {
                jQuery('.bcentro2').slick({
                    dots: true,
                    fade: true,
                    autoplay: true,
                    arrows: true
                });
            }
        }
    }
    
    // Initial call
    updateBannerDisplay();
    
    // Update on window resize
    window.addEventListener('resize', function() {
        updateBannerDisplay();
    });
}

function initializeCommonFeatures() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize shopping cart functionality
    initializeCart();
    
    // Initialize Mega Menu
    initializeMegaMenu();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Load product data
    loadProductsFromJSON();
}

function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchAutocomplete = document.getElementById('searchAutocomplete');
    
    if (searchInput && searchAutocomplete) {
        // Add event listeners for search functionality
        searchInput.addEventListener('input', function(e) {
            // Would integrate with Wake Commerce search if available
            console.log('Search input changed:', e.target.value);
        });
        
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Would integrate with Wake Commerce search
            console.log('Search submitted:', searchInput.value);
        });
    }
}

function initializeCart() {
    // Preserve cart functionality from original site
    if (window.app && window.app.modules && window.app.modules.cart) {
        console.log('Cart system already initialized');
    } else {
        // Initialize cart if not already done
        console.log('Initializing cart functionality');
    }
}

function initializeMegaMenu() {
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    
    if (megaMenuTrigger && megaMenuContent && submenuOverlay) {
        megaMenuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMegaMenu();
        });
        
        // Close menu on overlay click
        submenuOverlay.addEventListener('click', function() {
            closeMegaMenu();
        });
        
        // Close menu on close button click
        const closeBtn = document.querySelector('.submenu__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeMegaMenu();
            });
        }
    }
}

function toggleMegaMenu() {
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    
    if (megaMenuContent.classList.contains('submenu--active')) {
        closeMegaMenu();
    } else {
        openMegaMenu();
    }
}

function openMegaMenu() {
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    
    megaMenuContent.classList.add('submenu--active');
    submenuOverlay.classList.add('active');
    megaMenuTrigger.setAttribute('aria-expanded', 'true');
    
    document.body.classList.add('no-scroll');
}

function closeMegaMenu() {
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    
    megaMenuContent.classList.remove('submenu--active');
    submenuOverlay.classList.remove('active');
    megaMenuTrigger.setAttribute('aria-expanded', 'false');
    
    document.body.classList.remove('no-scroll');
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (mobileMenuToggle && mainNavigation) {
        mobileMenuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

function toggleMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (document.body.classList.contains('nav-open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    document.body.classList.add('nav-open');
    document.getElementById('mobileMenuToggle').setAttribute('aria-expanded', 'true');
    document.getElementById('main-navigation').setAttribute('aria-hidden', 'false');
    
    // Update icon
    const icon = document.getElementById('mobileMenuToggle').querySelector('i');
    if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
}

function closeMobileMenu() {
    document.body.classList.remove('nav-open');
    document.getElementById('mobileMenuToggle').setAttribute('aria-expanded', 'false');
    document.getElementById('main-navigation').setAttribute('aria-hidden', 'true');
    
    // Update icon
    const icon = document.getElementById('mobileMenuToggle').querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// ===== DYNAMIC PRODUCT LOADING FROM JSON (Preserved from original) =====
async function loadProductsFromJSON() {
    try {
        console.log('Attempting to load products from JSON...');
        // Fetch products from JSON file
        const response = await fetch('/data/products.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        console.log('Products loaded:', Object.keys(products).length);
        
        // Update all product sections with dynamic data
        updateFeaturedProducts(products);
        updateNewProducts(products);
        updateBestPrices(products);
        
        console.log('Products loaded dynamically from JSON');
    } catch (error) {
        console.error('Error loading products from JSON:', error);
        // Fallback to static content if JSON loading fails
        console.warn('Using static content as fallback');
        
        // Use static data as fallback
        const staticProducts = {
            'prod1': { id: 'prod1', name: 'Kit Clareamento Dental Whiteness HP', price: 18990, discount: 27, price_original: 26000, price_current: 18990, installments: { count: 10, value: 18.99 }, image: '/images/clareador-whiteness.png', category: 'Clareamento Dental', brand: 'Whiteness' },
            'prod2': { id: 'prod2', name: 'Resina Composta Z350 XT', price: 24590, discount: 15, price_original: 29000, price_current: 24590, installments: { count: 10, value: 24.59 }, image: '/images/resina-composta.png', category: 'Resina Composta', brand: 'Z350' },
            'prod3': { id: 'prod3', name: 'Anestésico Mepivacaína 3%', price: 8990, discount: 30, price_original: 12900, price_current: 8990, installments: { count: 6, value: 14.98 }, image: '/images/anestesico.png', category: 'Anestésico', brand: 'Mepivacaína' },
            'prod4': { id: 'prod4', name: 'Broca Carbide FG 245', price: 3490, discount: 10, price_original: 3900, price_current: 3490, installments: { count: 3, value: 11.63 }, image: '/images/broca.png', category: 'Broca', brand: 'Carbide' },
            'prod5': { id: 'prod5', name: 'Fotopolimerizador LED Radii Plus', price: 89900, discount: 20, price_original: 112500, price_current: 89900, installments: { count: 12, value: 7491.67 }, image: '/images/fotopolimerizador.png', category: 'Fotopolimerizador', brand: 'Radii' },
            'prod6': { id: 'prod6', name: 'Cimento de Ionômero de Vidro', price: 5690, discount: 18, price_original: 7000, price_current: 5690, installments: { count: 5, value: 11.38 }, image: '/images/ionomero.png', category: 'Cimento', brand: 'Vitro' },
            'prod7': { id: 'prod7', name: 'Kit Endodontia Rotatória Avançado', price: 145000, discount: 25, price_original: 195000, price_current: 145000, installments: { count: 12, value: 12083.33 }, image: '/images/kit-endodontia.png', category: 'Kit', brand: 'Kerr' },
            'prod8': { id: 'prod8', name: 'Ácido Fosfórico 37% Gel', price: 2290, discount: 12, price_original: 2600, price_current: 2290, installments: { count: 3, value: 7.63 }, image: '/images/acido.png', category: 'Ácido Fosfórico', brand: 'SDI' },
            'prod9': { id: 'prod9', name: 'Autoclave Vitale Class CD 21 Litros', price: 450000, discount: 10, price_original: 500000, price_current: 450000, installments: { count: 12, value: 37500.00 }, image: '/images/autoclave.png', category: 'Autoclave', brand: 'Vitale' },
            'prod10': { id: 'prod10', name: 'Cadeira Odontológica Kavo Unik', price: 2500000, discount: 15, price_original: 2950000, price_current: 2500000, installments: { count: 12, value: 208333.33 }, image: '/images/cadeira.png', category: 'Cadeira Odontológica', brand: 'Kavo' }
        };
        
        updateFeaturedProducts(staticProducts);
        updateNewProducts(staticProducts);
        updateBestPrices(staticProducts);
    }
}

// Functions for updating product sections (with Wake Commerce integration)
function updateFeaturedProducts(products) {
    // This function would integrate with Wake Commerce's Fbits:ListaSpots component
    console.log('Updating featured products for Wake Commerce integration');
    
    // In a real implementation, this would update the Fbits:ListaSpots component
    // with IDs corresponding to "melhores ofertas" (117326)
    const productElement = document.querySelector('.fbits-vitrine-home .row-vitrine-home:first-of-type');
    if (productElement) {
        console.log('Featured products section found for Wake Commerce integration');
    }
}

function updateNewProducts(products) {
    // This function would integrate with Wake Commerce's Fbits:ListaCustomizada component
    console.log('Updating new products for Wake Commerce integration');
    
    // In a real implementation, this would update the Fbits:ListaCustomizada component
    // with IDs corresponding to "novidades" (117167)
    const productElement = document.querySelector('.fbits-vitrine-home .row-vitrine-home:nth-of-type(2)');
    if (productElement) {
        console.log('New products section found for Wake Commerce integration');
    }
}

function updateBestPrices(products) {
    // This function would integrate with Wake Commerce's Fbits:ListaCustomizada component
    console.log('Updating best prices products for Wake Commerce integration');
    
    // In a real implementation, this would update the Fbits:ListaCustomizada component
    // with IDs corresponding to "clareador" (117272)
    const productElement = document.querySelector('.fbits-vitrine-home .row-vitrine-home:last-of-type');
    if (productElement) {
        console.log('Best prices products section found for Wake Commerce integration');
    }
}

// Initialize customer service dropdown
function initCustomerService() {
    const serviceTrigger = document.querySelector('.customer-service__trigger');
    const serviceDropdown = document.querySelector('.customer-service__dropdown');
    
    if (serviceTrigger && serviceDropdown) {
        serviceTrigger.addEventListener('mouseenter', () => {
            serviceDropdown.classList.add('is-active');
        });
        
        serviceTrigger.addEventListener('mouseleave', () => {
            serviceDropdown.classList.remove('is-active');
        });
        
        serviceDropdown.addEventListener('mouseenter', () => {
            serviceDropdown.classList.add('is-active');
        });
        
        serviceDropdown.addEventListener('mouseleave', () => {
            serviceDropdown.classList.remove('is-active');
        });
    }
}

// Initialize user greeting update
function initUserGreeting() {
    const userFirstName = localStorage.getItem('userFirstName');
    
    if (userFirstName) {
        const greetingElement = document.getElementById('userGreeting');
        
        if (greetingElement) {
            greetingElement.innerHTML = `Olá ${userFirstName}, identifique-se <a href="/pages/login/login.html" alt="Tela de Login">aqui</a> ou <a href="/pages/registro/index.html" alt="Tela de Registro">registre-se</a>`;
        }
    }
}

// Run initialization functions
document.addEventListener('DOMContentLoaded', function() {
    initCustomerService();
    initUserGreeting();
});

// Export functions for development
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWakeCommerceComponents,
        initializeCommonFeatures,
        loadProductsFromJSON
    };
}