document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Verificar se o app principal está inicializado
    if (!window.app || !window.app.productDB) {
        console.error('App principal não inicializado. Aguardando inicialização...');
        // Aguardar a inicialização do app
        const checkAppReady = setInterval(() => {
            if (window.app && window.app.productDB) {
                clearInterval(checkAppReady);
                initializePage();
            }
        }, 100);
    } else {
        initializePage();
    }
    
    // Add a simple test function to window for debugging
    window.testTabSwitch = function(tabId) {
        console.log('Testing tab switch to:', tabId);
        switchTab(tabId);
    };
});

// Função que inicializa a página após garantir que o app está pronto
function initializePage() {
    console.log('App está pronto, inicializando página de produto...');
    // Initialize product spot functionality
    console.log('Initializing product gallery...');
    initProductGallery();
    console.log('Initializing variations...');
    initVariations();
    console.log('Initializing quantity controls...');
    initQuantityControls();
    console.log('Initializing tabs...');
    initTabs();
    console.log('Initializing review form...');
    initReviewForm();
    console.log('Initializing shipping calculator...');
    initShippingCalculator();
    console.log('Initializing add to cart...');
    initAddToCart();
    console.log('Initializing buy now...');
    initBuyNow();
    
    // Initialize cart count
    initializeCartCount();

    // Load product data from URL parameters
    console.log('Loading product from URL...');
    loadProductFromUrl();
    console.log('All initialization functions called');
}

// ===== ROBUST ERROR HANDLING =====
// Melhorar a função getProductInfo para lidar com erros
function getProductInfoSafely(productId) {
    try {
        if (window.app && window.app.productDB) {
            return window.app.productDB.getProduct(productId);
        } else {
            console.warn('App ou banco de dados não disponível');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter informações do produto:', error);
        return null;
    }
}

// ===== PRODUCT DATA LOADING FROM URL =====
function loadProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const brand = urlParams.get('brand');
    const id = urlParams.get('id');
    
    if (id) {
        // Tentar obter produto do banco de dados primeiro
        const productFromDB = window.app ? window.app.productDB.getProduct(id) : null;
        
        if (productFromDB) {
            // Usar dados do banco de dados para atualizar a página
            updateProductInfoFromDB(productFromDB);
            updatePageTitleFromProduct(productFromDB);
        } else if (category && brand) {
            // Fallback para lógica antiga se produto não estiver no banco de dados
            updateProductInfo(category, brand, id);
            updateBreadcrumb(category, brand);
            updatePageTitle(category, brand);
        } else {
            // Se não houver informações suficientes, mostrar mensagem de erro
            showProductNotFound();
        }
    } else {
        // Se não houver ID, mostrar mensagem de erro
        showProductNotFound();
    }
}

// ===== PRODUCT NOT FOUND FUNCTIONALITY =====
function showProductNotFound() {
    const productContainer = document.querySelector('.product-spot-container');
    if (productContainer) {
        productContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Produto não encontrado</h2>
                <p>O produto que você está procurando não foi encontrado em nosso sistema.</p>
                <a href="/pages/home/index.html" class="btn btn--primary">Voltar à Home</a>
            </div>
        `;
    }
}

function updateProductInfoFromDB(product) {
    // Update product title
    const productTitle = document.getElementById('productDetailTitle');
    if (productTitle) {
        productTitle.textContent = product.name;
    }
    
    // Update meta title
    document.title = `${product.name} | Odonto Master`;
    
    // Update product images with real images from database
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        if (product.image) {
            // Criar um objeto de imagem para verificar se a imagem existe antes de atribuir
            const img = new Image();
            img.onload = function() {
                // Imagem carregou com sucesso
                mainImage.src = product.image;
                mainImage.alt = product.name;
            };
            img.onerror = function() {
                // Imagem falhou ao carregar, usar placeholder
                mainImage.src = 'https://placehold.co/600x600/e8ece9/333?text=Imagem+Indisponível';
                mainImage.alt = 'Imagem indisponível - ' + product.name;
            };
            img.src = product.image;
        } else {
            // Imagem padrão se não estiver disponível
            mainImage.src = 'https://placehold.co/600x600/e8ece9/333?text=Imagem+Indisponível';
            mainImage.alt = 'Imagem indisponível - ' + product.name;
        }
    }
    
    // Update thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    if (thumbnails.length > 0) {
        // Use the product's actual image for first thumbnail
        if (product.image) {
            thumbnails[0].src = product.image;
            thumbnails[0].alt = `Imagem principal - ${product.name}`;
            thumbnails[0].dataset.large = product.image;
            thumbnails[0].classList.add('active'); // Marcar primeira thumbnail como ativa
            
            // Adicionar manipulador de erro para thumbnail
            thumbnails[0].onerror = function() {
                this.src = 'https://placehold.co/100x100/e8ece9/333?text=IMG';
                this.alt = 'Thumbnail indisponível - ' + product.name;
                this.dataset.large = this.src;
            };
        }
        
        // Adicionar mais thumbnails se necessário
        for (let i = 1; i < thumbnails.length; i++) {
            if (product.image) {
                // Usar imagem adicional ou placeholder
                const additionalImage = getAdditionalProductImage(product, i);
                if (additionalImage) {
                    thumbnails[i].src = additionalImage;
                    thumbnails[i].alt = `Imagem ${i + 1} - ${product.name}`;
                    thumbnails[i].dataset.large = additionalImage;
                } else {
                    // Use placeholder for additional thumbnails
                    thumbnails[i].src = `https://placehold.co/100x100/e8ece9/333?text=${i + 1}`;
                    thumbnails[i].alt = `Imagem ${i + 1} - ${product.name}`;
                    thumbnails[i].dataset.large = `https://placehold.co/600x600/e8ece9/333?text=${product.name.replace(/\s+/g, '+')}+${i + 1}`;
                }
            } else {
                // Use placeholder se não houver imagem principal
                thumbnails[i].src = `https://placehold.co/100x100/e8ece9/333?text=${i + 1}`;
                thumbnails[i].alt = `Thumbnail ${i + 1}`;
                thumbnails[i].dataset.large = `https://placehold.co/600x600/e8ece9/333?text=Thumbnail+${i + 1}`;
            }
            
            // Adicionar manipulador de erro para todas as thumbnails
            thumbnails[i].onerror = function() {
                this.src = 'https://placehold.co/100x100/e8ece9/333?text=THUMB';
                this.alt = 'Thumbnail indisponível';
                this.dataset.large = this.src;
            };
        }
    }
    
    // Update pricing based on actual product data
    updatePricingFromDB(product);
    
    // Update product brand and category in specifications
    updateSpecifications(product);
    
    // Update product description if available
    updateDescription(product);
    
    // Update product variations
    updateVariations(product.category, product.brand);
    
    // Update breadcrumb with product information
    updateBreadcrumbFromProduct(product);
}

// ===== HELPER FUNCTIONS =====
function getAdditionalProductImage(product, index) {
    // Se precisar de mais imagens para o produto, poderia retornar variantes
    // Por enquanto, retornando null para usar placeholder
    // Em versões futuras, poderia retornar imagens adicionais baseadas no produto
    if (product.additionalImages && product.additionalImages[index - 1]) {
        return product.additionalImages[index - 1];
    }
    return null;
}

function updateSpecifications(product) {
    // Atualizar informações técnicas do produto
    const specsTable = document.querySelector('.specifications-table');
    if (specsTable) {
        specsTable.innerHTML = `
            <tr>
                <td><strong>Marca</strong></td>
                <td>${product.brand || 'Não especificada'}</td>
            </tr>
            <tr>
                <td><strong>Categoria</strong></td>
                <td>${product.category || 'Não especificada'}</td>
            </tr>
            <tr>
                <td><strong>Nome</strong></td>
                <td>${product.name || 'Não especificado'}</td>
            </tr>
            <tr>
                <td><strong>ID</strong></td>
                <td>${product.id || 'Não especificado'}</td>
            </tr>
            <tr>
                <td><strong>Desconto</strong></td>
                <td>${product.discount || 0}% OFF</td>
            </tr>
            <tr>
                <td><strong>Em estoque</strong></td>
                <td>${product.inStock ? 'Sim' : 'Não'}</td>
            </tr>
        `;
    }
}

function updateDescription(product) {
    // Atualizar descrição do produto
    const descriptionPane = document.getElementById('description');
    if (descriptionPane) {
        const description = product.description || 'Descrição não disponível.';
        descriptionPane.innerHTML = `
            <h3>Descrição do Produto</h3>
            <p>${description}</p>
            <h4>Características:</h4>
            <ul>
                <li>Produto de alta qualidade</li>
                <li>Indicado para profissionais da odontologia</li>
                <li>Atende às normas de segurança</li>
                <li>Design ergonômico</li>
            </ul>
        `;
    }
}

function updateProductInfo(category, brand, id) {
    // Update product title
    const productTitle = document.getElementById('productDetailTitle');
    if (productTitle) {
        productTitle.textContent = `${category} Exemplo - ${brand}`;
    }
    
    // Update product images (using placeholder images for now)
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = `https://via.placeholder.com/600x600/1c5787/ffffff?text=${category.replace(/\s+/g, '+')}`;
        mainImage.alt = `${category} - ${brand}`;
    }
    
    // Update thumbnail images
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.src = `https://via.placeholder.com/100x100/${getColorForIndex(index)}/ffffff?text=Thumb+${index + 1}`;
        thumb.alt = `Imagem ${index + 1} - ${category}`;
        thumb.dataset.large = `https://via.placeholder.com/600x600/${getColorForIndex(index)}/ffffff?text=${category.replace(/\s+/g, '+')}+${index + 1}`;
    });
    
    // Update pricing based on category and brand
    updatePricing(category, brand);
    
    // Update product variations
    updateVariations(category, brand);
}

function getColorForIndex(index) {
    const colors = ['1c5787', '134a6b', '4CAF50', 'CA69F5', 'dc3545', 'ffc107', '17a2b8', '28a745'];
    return colors[index % colors.length];
}

function updatePricingFromDB(product) {
    // Usar os dados reais do produto do banco de dados
    // Verificar se temos price_current e price_original, senão calcular
    let priceCurrent = product.price_current;
    let priceOriginal = product.price_original;
    let discount = product.discount;
    
    // Se não tivermos price_current, usar o campo price principal
    if (!priceCurrent) {
        priceCurrent = product.price;
    }
    
    // Se não tivermos price_original, calcular com base no desconto
    if (!priceOriginal) {
        if (discount && discount > 0) {
            priceOriginal = priceCurrent / (1 - discount / 100);
        } else {
            priceOriginal = priceCurrent * 1.15; // Preço original com 15% a mais
        }
    }
    
    // Se não tivermos desconto, calcular com base nos preços
    if (!discount) {
        discount = Math.round(((priceOriginal - priceCurrent) / priceOriginal) * 100);
    }
    
    // Converter de centavos para reais se necessário
    const priceInReais = (priceCurrent > 1000) ? priceCurrent / 100 : priceCurrent;
    const originalPriceInReais = (priceOriginal > 1000) ? priceOriginal / 100 : priceOriginal;
    
    // Obter informações de parcelamento se disponíveis
    let installmentCount = 10;
    let installmentValue = priceInReais / 10;
    
    if (product.installments) {
        installmentCount = product.installments.count || installmentCount;
        installmentValue = product.installments.value || installmentValue;
        
        // Se o valor do parcelamento não estiver definido, calcular
        if (!product.installments.value) {
            installmentValue = priceInReais / installmentCount;
        }
    }
    
    // Update price elements in the DOM
    const priceCurrentElement = document.querySelector('.price-current .price-value');
    const priceOriginalElement = document.querySelector('.price-original .price-value');
    const installmentElement = document.querySelector('.installment-text');
    const discountBadge = document.querySelector('.discount-badge');
    
    if (priceCurrentElement) priceCurrentElement.textContent = `R$ ${priceInReais.toFixed(2).replace('.', ',')}`;
    if (priceOriginalElement) priceOriginalElement.textContent = `R$ ${originalPriceInReais.toFixed(2).replace('.', ',')}`;
    if (installmentElement) installmentElement.textContent = `${installmentCount}x sem juros de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
    if (discountBadge) discountBadge.textContent = `${discount}% OFF`;
    
    // Atualizar o preço também no botão de adicionar ao carrinho para referência futura
    const priceElements = document.querySelectorAll('[data-price]');
    priceElements.forEach(el => {
        el.dataset.price = Math.round(priceInReais * 100); // Armazenar em centavos
    });
}

function updatePricing(category, brand) {
    // Generate different prices based on category
    let price = 199.90;
    let originalPrice = 299.90;
    let discount = 33;
    
    // Category-based pricing
    if (category === "Fio de Sutura") price = 149.90;
    if (category === "Bolsa Termica") price = 89.90;
    if (category === "Curativo Alveolar") price = 79.90;
    if (category === "Hemostasia") price = 129.90;
    if (category === "Lâmina de Bisturi") price = 45.50;
    if (category === "Produtos em Oferta") price = 79.90;
    if (category === "Regeneração Óssea") price = 189.90;
    if (category === "Sugador Cirúrgico") price = 25.00;
    if (category === "Sugador Descartável") price = 15.90;
    
    // Brand-based pricing adjustments
    if (brand === "Dentsply") price *= 1.2;
    if (brand === "FGM") price *= 1.1;
    if (brand === "Ultradent") price *= 0.9;
    if (brand === "Angelus") price *= 0.8;
    if (brand === "Technew") price *= 1.05;
    
    // Calculate discount and original price
    originalPrice = price * 1.5;
    discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    
    // Update price elements in the DOM
    const priceCurrentElement = document.querySelector('.price-current .price-value');
    const priceOriginalElement = document.querySelector('.price-original .price-value');
    const installmentElement = document.querySelector('.installment-text');
    const discountBadge = document.querySelector('.discount-badge');
    
    if (priceCurrentElement) priceCurrentElement.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
    if (priceOriginalElement) priceOriginalElement.textContent = `R$ ${originalPrice.toFixed(2).replace('.', ',')}`;
    if (installmentElement) installmentElement.textContent = `10x sem juros de R$ ${(price/10).toFixed(2).replace('.', ',')}`;
    if (discountBadge) discountBadge.textContent = `${discount}% OFF`;
}

function updateVariations(category, brand) {
    // This function would update product variations based on the selected product
    // For now, we'll just update the variation labels
    const variationLabels = document.querySelectorAll('.variation-label');
    if (variationLabels.length >= 2) {
        variationLabels[0].textContent = "Cor:";
        variationLabels[1].textContent = "Tamanho:";
    }
    
    // Add event listeners to variation options to update price dynamically if needed
    const variationOptions = document.querySelectorAll('.variation-option');
    variationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // This could be extended to update price based on selected variation
            updatePriceBasedOnVariation();
        });
    });
}

// ===== DYNAMIC PRICE UPDATE FUNCTION =====
function updatePriceBasedOnVariation() {
    // Placeholder function to update price based on selected variations
    // This would be expanded based on specific business rules
    console.log('Updating price based on selected variations');
}

function updateBreadcrumb(category, brand) {
    // Update breadcrumb navigation to show category and product name
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const productNameBreadcrumb = document.getElementById('productNameBreadcrumb');
    
    if (categoryBreadcrumb) {
        categoryBreadcrumb.textContent = category;
        categoryBreadcrumb.href = `/categoria/${category.toLowerCase().replace(/\s+/g, '-')}/index.html`;
    }
    
    if (productNameBreadcrumb) {
        // Show just the product name in the breadcrumb
        productNameBreadcrumb.textContent = brand;
    }
}

// ===== IMPROVED BREADCRUMB FUNCTION =====
function updateBreadcrumbFromProduct(product) {
    // Update breadcrumb navigation using product information
    const categoryBreadcrumb = document.getElementById('categoryBreadcrumb');
    const productNameBreadcrumb = document.getElementById('productNameBreadcrumb');
    
    if (categoryBreadcrumb && product.category) {
        categoryBreadcrumb.textContent = product.category;
        categoryBreadcrumb.href = `/categoria/${product.category.toLowerCase().replace(/\s+/g, '-')}/index.html`;
    }
    
    if (productNameBreadcrumb && product.name) {
        // Show the full product name in the breadcrumb
        productNameBreadcrumb.textContent = product.name;
    }
}

function updatePageTitle(category, brand) {
    // Update page title with fallback values
    const title = `${category} - ${brand} | Odonto Master`;
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = `Compre ${category} da marca ${brand} com desconto na Odonto Master. Produto de qualidade para profissionais da odontologia.`;
    }
}

// ===== IMPROVED PAGE TITLE FUNCTION =====
function updatePageTitleFromProduct(product) {
    // Update page title using product information
    const title = `${product.name} | Odonto Master`;
    document.title = title;
    
    // Update meta description with product-specific information
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = `${product.description || `Compre ${product.name} na Odonto Master. Produto de qualidade para profissionais da odontologia.`} | Melhor preço e entrega rápida.`;
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.content = `${product.name}, ${product.category}, ${product.brand}, odontologia, dental, produtos odontológicos`;
    }
}

// ===== PRODUCT GALLERY FUNCTIONALITY =====
function initProductGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.thumbnail-nav--prev');
    const nextBtn = document.querySelector('.thumbnail-nav--next');
    const thumbnailsTrack = document.querySelector('.thumbnails-track');
    let currentIndex = 0;
    const maxVisible = 4;

    // Thumbnail click event
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            const largeImage = this.dataset.large;
            mainImage.src = largeImage;
            mainImage.alt = this.alt;

            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navigation buttons for thumbnails
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateThumbnailsPosition();
            }
        });
    }

    if (nextBtn) {

// ===== PRODUCT GALLERY FUNCTIONALITY =====
function initProductGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.thumbnail-nav--prev');
    const nextBtn = document.querySelector('.thumbnail-nav--next');
    const thumbnailsTrack = document.querySelector('.thumbnails-track');
    let currentIndex = 0;
    const maxVisible = 4;

    // Thumbnail click event
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            const largeImage = this.dataset.large;
            mainImage.src = largeImage;
            mainImage.alt = this.alt;

            // Update active state
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navigation buttons for thumbnails
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateThumbnailsPosition();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentIndex < thumbnails.length - maxVisible) {
                currentIndex++;
                updateThumbnailsPosition();
            }
        });
    }

    function updateThumbnailsPosition() {
        const translateX = -currentIndex * (thumbnails[0].offsetWidth + 15);
        thumbnailsTrack.style.transform = `translateX(${translateX}px)`;
    }
}

// ===== PRODUCT VARIATIONS FUNCTIONALITY =====
function initVariations() {
    const variationOptions = document.querySelectorAll('.variation-option');

    variationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Get parent group
            const group = this.closest('.variation-group');
            
            // Remove active class from siblings in the same group
            const siblings = group.querySelectorAll('.variation-option');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update product information based on selection
            updateProductInfo();
        });
    });
}

function updateProductInfo() {
    // This function would update the product information based on selected variations
    // In a real implementation, this would fetch updated pricing, availability, etc.
    console.log('Product variations updated');
}

// ===== QUANTITY CONTROLS =====
function initQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
            }
        });

        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) { // Max quantity of 10
                quantityInput.value = value + 1;
            }
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
        });
    }
}

// ===== PRODUCT TABS FUNCTIONALITY =====
function initTabs() {
    console.log('Initializing tabs...');
    
    // Get individual tab buttons
    const descriptionTab = document.querySelector('.tab-button[data-tab="description"]');
    const specificationsTab = document.querySelector('.tab-button[data-tab="specifications"]');
    const reviewsTab = document.querySelector('.tab-button[data-tab="reviews"]');
    
    // Get tab panes
    const descriptionPane = document.getElementById('description');
    const specificationsPane = document.getElementById('specifications');
    const reviewsPane = document.getElementById('reviews');
    
    console.log('Found tab buttons:', {descriptionTab, specificationsTab, reviewsTab});
    console.log('Found tab panes:', {descriptionPane, specificationsPane, reviewsPane});
    
    // Attach event listeners to each tab button
    if (descriptionTab && descriptionPane) {
        descriptionTab.addEventListener('click', function(e) {
            console.log('Description tab clicked');
            e.preventDefault();
            activateTab('description');
        });
    }
    
    if (specificationsTab && specificationsPane) {
        specificationsTab.addEventListener('click', function(e) {
            console.log('Specifications tab clicked');
            e.preventDefault();
            activateTab('specifications');
        });
    }
    
    if (reviewsTab && reviewsPane) {
        reviewsTab.addEventListener('click', function(e) {
            console.log('Reviews tab clicked');
            e.preventDefault();
            activateTab('reviews');
        });
    }
    
    console.log('Tabs initialized');
}

function activateTab(tabId) {
    console.log('Activating tab:', tabId);
    
    // Get all tab buttons and panes
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all buttons and panes
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    const clickedButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    const targetPane = document.getElementById(tabId);
    
    if (clickedButton && targetPane) {
        clickedButton.classList.add('active');
        targetPane.classList.add('active');
        console.log('Activated tab:', tabId);
    } else {
        console.error('Could not activate tab:', tabId);
    }
}

// ===== REVIEW FORM FUNCTIONALITY =====
function initReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const rating = document.querySelector('input[name="reviewRating"]:checked');
            const title = document.getElementById('reviewTitle').value;
            const comment = document.getElementById('reviewComment').value;
            
            // Validate form
            if (!name || !email || !rating || !title || !comment) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Simulate review submission
            submitReview(name, email, rating.value, title, comment);
        });
    }
}

function submitReview(name, email, rating, title, comment) {
    // In a real implementation, this would send the review to a server
    // For now, we'll just show a success message
    
    // Show success message
    alert('Avaliação enviada com sucesso! Obrigado pela sua contribuição.');
    
    // Reset form
    document.getElementById('reviewForm').reset();
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star rated"></i>';
        } else {
            stars += '<i class="fas fa-star"></i>';
        }
    }
    return stars;
}

function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

// ===== SHIPPING CALCULATOR =====
function initShippingCalculator() {
    const cepInput = document.getElementById('cepInput');
    const calculateBtn = document.getElementById('calculateShippingBtn');
    const shippingResults = document.getElementById('shippingResults');

    if (cepInput) {
        // Format CEP input
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            this.value = value;
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const cep = cepInput ? cepInput.value : '';
            
            if (cep && cep.replace(/\D/g, '').length === 8) {
                // Simulate shipping calculation
                simulateShippingCalculation();
            } else {
                alert('Por favor, informe um CEP válido com 8 dígitos.');
            }
        });
    }
}

function simulateShippingCalculation() {
    const shippingResults = document.getElementById('shippingResults');
    
    if (shippingResults) {
        // Show loading state
        shippingResults.innerHTML = '<p>Calculando frete...</p>';
        shippingResults.style.display = 'block';
        
        // Simulate API delay
        setTimeout(() => {
            shippingResults.innerHTML = `
                <div class="shipping-option">
                    <div class="shipping-details">
                        <strong>Entrega Standard</strong>
                        <span>3 a 5 dias úteis</span>
                    </div>
                    <div class="shipping-price">
                        <span>R$ 15,90</span>
                    </div>
                </div>
                <div class="shipping-option">
                    <div class="shipping-details">
                        <strong>Entrega Expressa</strong>
                        <span>1 a 2 dias úteis</span>
                    </div>
                    <div class="shipping-price">
                        <span>R$ 29,90</span>
                    </div>
                </div>
                <div class="shipping-option free-shipping">
                    <div class="shipping-details">
                        <strong>Retirar na Loja</strong>
                        <span>Salvador/BA - Caminho das Árvores</span>
                    </div>
                    <div class="shipping-price">
                        <span class="free-text">GRÁTIS</span>
                    </div>
                </div>
            `;
        }, 1500);
    }
}

// ===== ADD TO CART FUNCTIONALITY =====
function initAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            if (productId) {
                // Obter informações do produto do banco de dados
                const productFromDB = window.app ? window.app.productDB.getProduct(productId) : null;
                
                let product;
                
                if (productFromDB) {
                    // Usar informações do banco de dados para garantir consistência
                    product = {
                        id: productFromDB.id,
                        name: productFromDB.name,
                        price: productFromDB.price, // preço já está em centavos
                        quantity: quantity,
                        image: productFromDB.image,
                        category: productFromDB.category,
                        brand: productFromDB.brand,
                        description: productFromDB.description,
                        discount: productFromDB.discount,
                        inStock: productFromDB.inStock !== undefined ? productFromDB.inStock : true,
                        sku: 'SKU-' + productFromDB.id.substring(0, 8)
                    };
                } else {
                    // Fallback para lógica antiga se produto não estiver no banco de dados
                    const productName = document.getElementById('productDetailTitle')?.textContent || 'Produto não identificado';
                    const priceElement = document.querySelector('.price-current .price-value');
                    const priceText = priceElement ? priceElement.textContent : '0,00';
                    const priceMatch = priceText.match(/[\d,]+/);
                    let price = 0;
                    
                    if (priceMatch) {
                        price = parseFloat(priceMatch[0].replace(',', '.')) * 100; // Convert to cents
                    } else {
                        // Se não encontrar o preço no formato esperado, tentar obter de outro lugar
                        price = 0; // preço padrão caso não encontre
                    }
                    
                    // Get product image
                    const mainImage = document.getElementById('mainImage');
                    const imageUrl = mainImage ? mainImage.src : 'https://placehold.co/100x100';
                    
                    // Create product object
                    product = {
                        id: productId,
                        name: productName,
                        price: price,
                        quantity: quantity,
                        image: imageUrl,
                        sku: 'SKU-' + productId.substring(0, 8)
                    };
                }
                
                // Add loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adicionando...';
                this.disabled = true;
                
                // Add to cart
                addToCart(product);
                
                // Restore button after a short delay
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Show success feedback
                    showNotification('Produto adicionado ao carrinho!', 'success');
                }, 1000);
            } else {
                alert('ID do produto não encontrado na URL');
            }
        });
    }
}

// ===== BUY NOW FUNCTIONALITY =====
function initBuyNow() {
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value);
            
            // Get product ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            
            if (productId) {
                // Obter informações do produto do banco de dados
                const productFromDB = window.app ? window.app.productDB.getProduct(productId) : null;
                
                let product;
                
                if (productFromDB) {
                    // Usar informações do banco de dados para garantir consistência
                    product = {
                        id: productFromDB.id,
                        name: productFromDB.name,
                        price: productFromDB.price, // preço já está em centavos
                        quantity: quantity,
                        image: productFromDB.image,
                        category: productFromDB.category,
                        brand: productFromDB.brand,
                        description: productFromDB.description,
                        discount: productFromDB.discount,
                        inStock: productFromDB.inStock !== undefined ? productFromDB.inStock : true,
                        sku: 'SKU-' + productFromDB.id.substring(0, 8)
                    };
                } else {
                    // Fallback para lógica antiga se produto não estiver no banco de dados
                    const productName = document.getElementById('productDetailTitle')?.textContent || 'Produto não identificado';
                    const priceElement = document.querySelector('.price-current .price-value');
                    const priceText = priceElement ? priceElement.textContent : '0,00';
                    const priceMatch = priceText.match(/[\d,]+/);
                    let price = 0;
                    
                    if (priceMatch) {
                        price = parseFloat(priceMatch[0].replace(',', '.')) * 100; // Convert to cents
                    } else {
                        // Se não encontrar o preço no formato esperado, tentar obter de outro lugar
                        price = 0; // preço padrão caso não encontre
                    }
                    
                    // Get product image
                    const mainImage = document.getElementById('mainImage');
                    const imageUrl = mainImage ? mainImage.src : 'https://placehold.co/100x100';
                    
                    // Create product object
                    product = {
                        id: productId,
                        name: productName,
                        price: price,
                        quantity: quantity,
                        image: imageUrl,
                        sku: 'SKU-' + productId.substring(0, 8)
                    };
                }
                
                // Add loading state
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                this.disabled = true;
                
                // Add to cart first
                addToCart(product);
                
                // Simulate checkout process
                setTimeout(() => {
                    // Restore button
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // Redirect to checkout
                    window.location.href = '/pages/checkout/index.html';
                }, 1500);
            } else {
                alert('ID do produto não encontrado na URL');
            }
        });
    }
}

// ===== RELATED PRODUCTS =====
function getItemsPerView() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1200) return 3;
    return 4;
}

// Helper functions for extracting category and brand
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

// ===== UTILITY FUNCTIONS =====
function formatPrice(priceInCents) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(priceInCents / 100);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('notification--visible');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('notification--visible');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button event
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', function() {
        notification.classList.remove('notification--visible');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

function initializeCartCount() {
    try {
        const cartData = localStorage.getItem('odonto_cart');
        if (cartData) {
            const cart = JSON.parse(cartData);
            const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
            updateCartCount(totalCount);
        }
    } catch (error) {
        console.error('Error initializing cart count:', error);
    }
}

function updateCartCount(count) {
    const cartCountElement = document.querySelector('.shopping-cart__count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
    
    // Also update the cart dropdown if it exists
    const cartDropdown = document.querySelector('.shopping-cart__dropdown');
    if (cartDropdown) {
        // This would typically update the dropdown content
        // For now, we'll just log the update
        console.log('Cart updated with', count, 'items');
    }
}

function addToCart(product) {
    try {
        // Get existing cart from localStorage
        let cart = [];
        const cartData = localStorage.getItem('odonto_cart');
        if (cartData) {
            cart = JSON.parse(cartData);
        }
        
        // Check if product already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            // If item doesn't exist, add it to cart
            cart.push(product);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('odonto_cart', JSON.stringify(cart));
        
        // Update cart count in UI
        updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Dispatch event to notify other parts of the app
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return false;
    }
}
    }
}