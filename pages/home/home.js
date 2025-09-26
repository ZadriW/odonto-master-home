document.addEventListener('DOMContentLoaded', function() {
    Logger.info('DOM totalmente carregado, inicializando homepage...');
    // Initialize homepage functionality
    initHomepage();
});

// Window load event to ensure all resources are loaded
window.addEventListener('load', function() {
    Logger.info('Janela totalmente carregada, carregando produtos do JSON...');
    // Load products dynamically from JSON after window is fully loaded
    loadProductsFromJSON();
});

function initHomepage() {
    Logger.info('Inicializando homepage...');
    // Initialize product linking for carousel items
    initCarouselProductLinks();
    
    Logger.info('Homepage inicializada');
}

// ===== DYNAMIC PRODUCT LOADING FROM JSON =====
async function loadProductsFromJSON() {
    try {
        Logger.info('Tentando carregar produtos do JSON...');
        // Fetch products from JSON file
        const response = await fetch('/data/products.json');
        Logger.info('Resposta do fetch:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        Logger.info('Produtos carregados:', Object.keys(products).length);
        
        // Update all product sections with dynamic data
        updateFeaturedProducts(products);
        updateNewProducts(products);
        updateBestPrices(products);
        
        Logger.info('Produtos carregados dinamicamente do JSON');
    } catch (error) {
        Logger.error('Erro ao carregar produtos do JSON:', error);
        // Fallback to static content if JSON loading fails
        Logger.warn('Usando conteúdo estático como fallback');
        
        // Usar dados estáticos como fallback
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

// ===== UPDATE FEATURED PRODUCTS =====
function updateFeaturedProducts(products) {
    const productsTrack = document.getElementById('productsTrack');
    if (productsTrack) {
        Logger.info('Atualizando produtos em destaque');
        // Get featured products (first 5 for this example)
        const featuredProductIds = ['prod1', 'prod2', 'prod3', 'prod4', 'prod5'];
        const featuredProducts = featuredProductIds.map(id => products[id]).filter(Boolean);
        
        if (featuredProducts.length > 0) {
            Logger.info('Encontrados', featuredProducts.length, 'produtos em destaque');
            productsTrack.innerHTML = featuredProducts.map(product => {
                // Calculate price in reais
                const priceInReais = (product.price_current || product.price) / 100;
                const originalPriceInReais = product.price_original ? product.price_original / 100 : (priceInReais * 1.15);
                const discount = product.discount || Math.round(((originalPriceInReais - priceInReais) / originalPriceInReais) * 100);
                
                return `
                    <div class="product-slide">
                        <article class="product-card" data-product-id="${product.id}">
                            <a href="/pages/produto/produto.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${product.id}" class="product-card-link">
                                <div class="product-card__image">
                                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300/e8ece9/333?text=Imagem+Indisponível';">
                                    <div class="product-badge product-badge--discount">${discount}% OFF</div>
                                </div>
                                <div class="product-card__content">
                                    <h3 class="product-title">${product.name}</h3>
                                    <div class="product-pricing">
                                        <span class="product-price--current">R$ ${priceInReais.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <button class="product-button">ADICIONAR AO CARRINHO</button>
                                </div>
                            </a>
                        </article>
                    </div>
                `;
            }).join('');
        } else {
            Logger.warn('Nenhum produto em destaque encontrado');
            // Adicionar mensagem de fallback
            productsTrack.innerHTML = '<p class="no-products-message">Nenhum produto em destaque disponível no momento.</p>';
        }
    } else {
        Logger.warn('Elemento productsTrack não encontrado');
    }
}

// ===== UPDATE NEW PRODUCTS =====
function updateNewProducts(products) {
    const productsTrackLancamentos = document.getElementById('productsTrackLancamentos');
    if (productsTrackLancamentos) {
        Logger.info('Atualizando novos produtos');
        // Get new products (next 3 for this example)
        const newProductIds = ['prod6', 'prod7', 'prod8'];
        const newProducts = newProductIds.map(id => products[id]).filter(Boolean);
        
        if (newProducts.length > 0) {
            Logger.info('Encontrados', newProducts.length, 'novos produtos');
            productsTrackLancamentos.innerHTML = newProducts.map(product => {
                // Calculate price in reais
                const priceInReais = (product.price_current || product.price) / 100;
                const originalPriceInReais = product.price_original ? product.price_original / 100 : (priceInReais * 1.15);
                const discount = product.discount || Math.round(((originalPriceInReais - priceInReais) / originalPriceInReais) * 100);
                
                return `
                    <div class="product-slide">
                        <article class="product-card" data-product-id="${product.id}">
                            <a href="/pages/produto/produto.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${product.id}" class="product-card-link">
                                <div class="product-card__image">
                                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300/e8ece9/333?text=Imagem+Indisponível';">
                                    <div class="product-badge product-badge--discount">${discount}% OFF</div>
                                </div>
                                <div class="product-card__content">
                                    <h3 class="product-title">${product.name}</h3>
                                    <div class="product-pricing">
                                        <span class="product-price--current">R$ ${priceInReais.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <button class="product-button">ADICIONAR AO CARRINHO</button>
                                </div>
                            </a>
                        </article>
                    </div>
                `;
            }).join('');
        } else {
            Logger.warn('Nenhum novo produto encontrado');
            // Adicionar mensagem de fallback
            productsTrackLancamentos.innerHTML = '<p class="no-products-message">Nenhum lançamento disponível no momento.</p>';
        }
    } else {
        Logger.warn('Elemento productsTrackLancamentos não encontrado');
    }
}


// ===== UPDATE BEST PRICES PRODUCTS =====
function updateBestPrices(products) {
    const productsTrackEquipamentos = document.getElementById('productsTrackEquipamentos');
    if (productsTrackEquipamentos) {
        Logger.info('Atualizando produtos com melhores preços');
        // Get best price products (last 2 for this example)
        const bestPriceProductIds = ['prod9', 'prod10'];
        const bestPriceProducts = bestPriceProductIds.map(id => products[id]).filter(Boolean);
        
        if (bestPriceProducts.length > 0) {
            Logger.info('Encontrados', bestPriceProducts.length, 'produtos com melhores preços');
            productsTrackEquipamentos.innerHTML = bestPriceProducts.map(product => {
                // Calculate price in reais
                const priceInReais = (product.price_current || product.price) / 100;
                const originalPriceInReais = product.price_original ? product.price_original / 100 : (priceInReais * 1.15);
                const discount = product.discount || Math.round(((originalPriceInReais - priceInReais) / originalPriceInReais) * 100);
                
                return `
                    <div class="product-slide">
                        <article class="product-card" data-product-id="${product.id}">
                            <a href="/pages/produto/produto.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${product.id}" class="product-card-link">
                                <div class="product-card__image">
                                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300/e8ece9/333?text=Imagem+Indisponível';">
                                    <div class="product-badge product-badge--discount">${discount}% OFF</div>
                                </div>
                                <div class="product-card__content">
                                    <h3 class="product-title">${product.name}</h3>
                                    <div class="product-pricing">
                                        <span class="product-price--current">R$ ${priceInReais.toFixed(2).replace('.', ',')}</span>
                                    </div>
                                    <button class="product-button">ADICIONAR AO CARRINHO</button>
                                </div>
                            </a>
                        </article>
                    </div>
                `;
            }).join('');
        } else {
            Logger.warn('Nenhum produto com melhores preços encontrado');
            // Adicionar mensagem de fallback
            productsTrackEquipamentos.innerHTML = '<p class="no-products-message">Nenhum equipamento em oferta disponível no momento.</p>';
        }
    } else {
        Logger.warn('Elemento productsTrackEquipamentos não encontrado');
    }
}
            const originalPriceInReais = product.price_original ? product.price_original / 100 : (priceInReais * 1.15);
            const discount = product.discount || Math.round(((originalPriceInReais - priceInReais) / originalPriceInReais) * 100);
            
            return `
                <div class="product-slide">
                    <article class="product-card" data-product-id="${product.id}">
                        <a href="/pages/produto/produto.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${product.id}" class="product-card-link">
                            <div class="product-card__image">
                                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/300x300/e8ece9/333?text=Imagem+Indisponível';">
                                <div class="product-badge product-badge--discount">${discount}% OFF</div>
                            </div>
                            <div class="product-card__content">
                                <h3 class="product-title">${product.name}</h3>
                                <div class="product-pricing">
                                    <span class="product-price--current">R$ ${priceInReais.toFixed(2).replace('.', ',')}</span>
                                </div>
                                <button class="product-button">ADICIONAR AO CARRINHO</button>
                            </div>
                        </a>
                    </article>
                </div>
            `;
    

// ===== CAROUSEL PRODUCT LINKING FUNCTIONALITY =====
function initCarouselProductLinks() {
    Logger.info('Inicializando links de produtos nos carrosséis...');
    // Add click event listeners to all product cards in carousels
    document.addEventListener('click', function(e) {
        // Check if the clicked element is the product button within a product card in a carousel
        const productButton = e.target.closest('.product-button');
        if (productButton) {
            Logger.info('Botão de produto clicado');
            // Prevent default behavior for links within the product card
            e.preventDefault();
            e.stopPropagation();
            
            // Get product information
            const productCard = productButton.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                const productTitle = productCard.querySelector('.product-title')?.textContent || 'Produto';
                const priceText = productCard.querySelector('.product-price--current')?.textContent || '0';
                const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.')) * 100 || 0;
                
                Logger.info('Adicionando produto ao carrinho:', productId, productTitle, price);
                // Add to cart
                addToCart(productId, productTitle, price, 1);
                
                // Visual feedback
                productButton.classList.add('added');
                productButton.innerHTML = '<i class="fas fa-check"></i> Adicionado';
                
                setTimeout(() => {
                    productButton.classList.remove('added');
                    productButton.innerHTML = 'ADICIONAR AO CARRINHO';
                }, 2000);
            }
        }
        // For product card clicks (not on the button), let the default behavior happen
        // which will follow the link to the product page
    });
    
    Logger.info('Links de produtos nos carrosséis inicializados');
}

function redirectToProductSpot(productId, productTitle) {
    // Extract category and brand from product title (simplified approach)
    // In a real implementation, this would come from actual product data
    const category = extractCategoryFromTitle(productTitle);
    const brand = extractBrandFromTitle(productTitle);
    
    // Create URL parameters
    const params = new URLSearchParams({
        category: category,
        brand: brand,
        id: productId
    });
    
    // Redirect to product spot page
    window.location.href = `/pages/produto/produto.html?${params.toString()}`;
}

function extractCategoryFromTitle(title) {
    // This is a simplified approach - in a real implementation, 
    // this would come from the product data itself
    const categories = [
        'Clareamento Dental', 'Resina Composta', 'Anestésico', 'Broca', 
        'Fotopolimerizador', 'Cimento', 'Kit Endodontia', 'Ácido Fosfórico',
        'Autoclave', 'Cadeira Odontológica', 'Kit', 'Sugador'
    ];
    
    for (const category of categories) {
        if (title.toLowerCase().includes(category.toLowerCase())) {
            return category;
        }
    }
    
    // Default fallback
    return 'Produto';
}

function extractBrandFromTitle(title) {
    // This is a simplified approach - in a real implementation,
    // this would come from the product data itself
    const brands = ['Whiteness', 'Z350', 'Mepivacaína', 'Carbide', 'Radii', 'FGM', 'Ultradent', 'Angelus', 'Dentsply', 'Kavo', 'Vitale'];
    
    for (const brand of brands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            return brand;
        }
    }
    
    // Default fallback
    return 'Marca';
}

// ===== HOMEPAGE SPECIFIC FUNCTIONALITY =====
function initHomepageSpecificFeatures() {
    // Any homepage-specific features can be initialized here
    Logger.info('Recursos específicos da homepage inicializados');
}

// ===== EXPORTS FOR DEVELOPMENT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHomepage,
        initCarouselProductLinks,
        redirectToProductSpot,
        extractCategoryFromTitle,
        extractBrandFromTitle
    };
}