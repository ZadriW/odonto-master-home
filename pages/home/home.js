document.addEventListener('DOMContentLoaded', function() {
    // Initialize homepage functionality
    initHomepage();
});

function initHomepage() {
    // Initialize product linking for carousel items
    initCarouselProductLinks();
    
    Logger.info('Homepage inicializada');
}

// ===== CAROUSEL PRODUCT LINKING FUNCTIONALITY =====
function initCarouselProductLinks() {
    // Add click event listeners to all product cards in carousels
    document.addEventListener('click', function(e) {
        // Check if the clicked element is the product button within a product card in a carousel
        const productButton = e.target.closest('.product-button');
        if (productButton) {
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