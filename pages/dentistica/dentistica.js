document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos relevantes
    const filtersSidebar = document.getElementById('filters-sidebar');
    const productsGrid = document.getElementById('products-grid');
    const noResultsMessage = document.getElementById('no-results-message');

    // Verifica se estamos na página correta
    if (!filtersSidebar || !productsGrid) {
        return; // Sai da função se os elementos não existirem
    }

    // Implementa a funcionalidade do botão "Ver Mais" para categorias
    const categoryToggleBtn = document.getElementById('category-toggle-btn');
    const categoryHiddenFilters = document.getElementById('category-filters-hidden');
    
    if (categoryToggleBtn && categoryHiddenFilters) {
        categoryToggleBtn.addEventListener('click', () => {
            const isExpanded = categoryToggleBtn.getAttribute('aria-expanded') === 'true';
            categoryHiddenFilters.classList.toggle('expanded', !isExpanded);
            categoryToggleBtn.setAttribute('aria-expanded', !isExpanded);
            categoryToggleBtn.querySelector('.toggle-text').textContent = isExpanded ? 'Ver mais' : 'Ver menos';
        });
    }

    // Implementa a funcionalidade do botão "Ver Mais" para marcas
    const brandToggleBtn = document.getElementById('brand-toggle-btn');
    const brandHiddenFilters = document.getElementById('brand-filters-hidden');
    
    if (brandToggleBtn && brandHiddenFilters) {
        brandToggleBtn.addEventListener('click', () => {
            const isExpanded = brandToggleBtn.getAttribute('aria-expanded') === 'true';
            brandHiddenFilters.classList.toggle('expanded', !isExpanded);
            brandToggleBtn.setAttribute('aria-expanded', !isExpanded);
            brandToggleBtn.querySelector('.toggle-text').textContent = isExpanded ? 'Ver mais' : 'Ver menos';
        });
    }

    // Implementa a funcionalidade do slider de preço
    const priceSliderMin = document.getElementById('price-slider-min');
    const priceSliderMax = document.getElementById('price-slider-max');
    const priceMinDisplay = document.getElementById('price-min-display');
    const priceMaxDisplay = document.getElementById('price-max-display');
    
    if (priceSliderMin && priceSliderMax) {
        // Atualiza os displays de preço quando os sliders mudam
        priceSliderMin.addEventListener('input', () => {
            const minVal = parseInt(priceSliderMin.value);
            const maxVal = parseInt(priceSliderMax.value);
            
            // Garante que o valor mínimo não ultrapasse o valor máximo
            if (minVal > maxVal) {
                priceSliderMin.value = maxVal;
            }
            
            priceMinDisplay.textContent = `R$ ${priceSliderMin.value}`;
            filterProducts();
        });
        
        priceSliderMax.addEventListener('input', () => {
            const minVal = parseInt(priceSliderMin.value);
            const maxVal = parseInt(priceSliderMax.value);
            
            // Garante que o valor máximo não fique abaixo do valor mínimo
            if (maxVal < minVal) {
                priceSliderMax.value = minVal;
            }
            
            priceMaxDisplay.textContent = `R$ ${priceSliderMax.value}`;
            filterProducts();
        });
    }

    // Implementa a funcionalidade do botão "Limpar Filtros"
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }

    // Função para inicializar os filtros após o carregamento completo da página
    function initializeFilters() {
        const checkboxes = filtersSidebar.querySelectorAll('input[type="checkbox"]');
        const productCards = Array.from(productsGrid.getElementsByClassName('product-card'));

        // Adiciona um listener de evento para cada checkbox
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', filterProducts);
        });
        
        // Chama filterProducts uma vez para garantir que o estado inicial esteja correto
        filterProducts();
    }

    // Inicializa os filtros após um pequeno atraso para garantir que tudo esteja carregado
    setTimeout(initializeFilters, 100);

    function filterProducts() {
        const selectedFilters = getSelectedFilters();
        const priceRange = getPriceRange();
        let visibleProductsCount = 0;

        const productCards = Array.from(productsGrid.getElementsByClassName('product-card'));
        
        // Se nenhum filtro estiver selecionado e o range de preço estiver no padrão, mostrar todos os produtos
        const showAll = selectedFilters.categories.length === 0 && 
                       selectedFilters.brands.length === 0 && 
                       priceRange.min === 0 && 
                       priceRange.max === 500;
        
        if (showAll) {
            // Mostrar todos os produtos
            productCards.forEach(card => {
                card.classList.remove('hidden');
            });
            visibleProductsCount = productCards.length;
        } else {
            // Filtrar produtos com base nos critérios selecionados
            productCards.forEach((card, index) => {
                const cardCategory = card.dataset.category || '';
                const cardBrand = card.dataset.brand || '';
                const priceText = card.querySelector('.product-price--current')?.textContent || '';
                const price = priceText ? parseFloat(priceText.replace('R$ ', '').replace(',', '.')) : 0;
                
                // Verificar se o produto corresponde aos filtros selecionados
                // Um produto é mostrado se:
                // 1. Nenhuma categoria está selecionada OU a categoria do produto está selecionada
                // 2. Nenhuma marca está selecionada OU a marca do produto está selecionada
                // 3. O preço do produto está dentro do range selecionado
                const categoryMatch = selectedFilters.categories.length === 0 || selectedFilters.categories.includes(cardCategory);
                const brandMatch = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(cardBrand);
                const priceMatch = price >= priceRange.min && price <= priceRange.max;

                if (categoryMatch && brandMatch && priceMatch) {
                    card.classList.remove('hidden');
                    visibleProductsCount++;
                } else {
                    card.classList.add('hidden');
                }
            });
        }
        
        // Exibe ou oculta a mensagem de "nenhum resultado"
        if (visibleProductsCount === 0 && !showAll) {
            noResultsMessage.style.display = 'block';
            productsGrid.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            productsGrid.style.display = 'grid';
        }
        
        return visibleProductsCount;
    }

    function getSelectedFilters() {
        const selectedCategories = [];
        const selectedBrands = [];

        // Itera sobre os checkboxes de categoria
        document.querySelectorAll('#category-filters input:checked').forEach(input => {
            selectedCategories.push(input.value);
        });

        // Itera sobre os checkboxes de marca
        document.querySelectorAll('#brand-filters input:checked').forEach(input => {
            selectedBrands.push(input.value);
        });

        return {
            categories: selectedCategories,
            brands: selectedBrands
        };
    }
    
    function getPriceRange() {
        const priceSliderMin = document.getElementById('price-slider-min');
        const priceSliderMax = document.getElementById('price-slider-max');
        
        if (priceSliderMin && priceSliderMax) {
            return {
                min: parseInt(priceSliderMin.value),
                max: parseInt(priceSliderMax.value)
            };
        }
        
        return { min: 0, max: 500 };
    }
    
    // Adiciona funcionalidade de clique ao botão "ADICIONAR AO CARRINHO"
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('product-button')) {
            // Previne que o botão seja clicado várias vezes rapidamente
            if (e.target.classList.contains('added')) {
                return;
            }

            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productId = `${productCard.dataset.category}-${productCard.dataset.brand}-${Date.now()}`;
                const productName = productCard.querySelector('.product-title').textContent;
                const priceText = productCard.querySelector('.product-price--current').textContent;
                const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.')) * 100; // Convert to cents
                
                // Adiciona o item ao carrinho global
                if (typeof window.app !== 'undefined' && window.app.modules && window.app.modules.cart) {
                    window.app.modules.cart.addItem(productId, productName, price, 1);
                } else {
                    // Fallback para caso o sistema de carrinho global não esteja disponível
                    console.log(`Produto adicionado ao carrinho: ${productName}, Preço: ${price}`);
                }
                
                // Feedback visual no botão
                e.target.classList.add('added');
                e.target.innerHTML = '<i class="fas fa-check"></i> ADICIONADO';

                setTimeout(() => {
                    e.target.classList.remove('added');
                    e.target.innerHTML = 'ADICIONAR AO CARRINHO';
                }, 2000);
            }
        }
    });
    
    // Simulação: Preenche os cards de produto com conteúdo de exemplo
    // Este bloco pode ser removido quando a integração com a Wake estiver ativa
    const productCards = Array.from(productsGrid.getElementsByClassName('product-card'));
    productCards.forEach((card, index) => {
    const category = card.dataset.category;
    const brand = card.dataset.brand;

    // Garante que o card só será preenchido se tiver uma categoria válida
    if (category && brand) {
        // Generate different prices based on category
        let price = "99,90";
        if (category === "Resina Composta") price = "149,90";
        if (category === "Sistema Adesivo") price = "89,90";
        if (category === "Ácido Fosfórico") price = "25,00";
        if (category === "Matriz Metálica") price = "35,50";
        if (category === "Matriz Circunferencial") price = "45,00";
        if (category === "Instrumental Dentística") price = "129,90";
        if (category === "Produtos em Oferta") price = "79,90";
        if (category === "Cunhas de Espessamento") price = "15,90";
        if (category === "Diques de Matriz") price = "22,50";
        
        // Generate discount based on category
        let discount = "10% OFF";
        if (category === "Produtos em Oferta") discount = "25% OFF";
        if (category === "Resina Composta") discount = "15% OFF";
        
        // Generate different prices based on brand
        if (brand === "3M ESPE") price = "189,90";
        if (brand === "Ultradent") price = "159,90";
        if (brand === "FGM") price = "99,90";
        if (brand === "Angelus") price = "79,90";
        if (brand === "Dentsply") price = "139,90";
        
        card.innerHTML = `
            <div class="product-card__image">
                <img src="https://via.placeholder.com/300x300/e8ece9/333?text=${category.replace(/\s+/g, '+')}" alt="Produto ${index + 1}">
                <div class="product-badge product-badge--discount">${discount}</div>
            </div>
            <div class="product-card__content">
                <h3 class="product-title">${category} Exemplo ${index + 1} - ${brand}</h3>
                <div class="product-pricing">
                    <span class="product-price--current">R$ ${price}</span>
                </div>
                <button class="product-button">ADICIONAR AO CARRINHO</button>
            </div>
        `;
    }
    });
    
    // Inicializa os filtros após preencher os product cards
    setTimeout(initializeFilters, 100);
});

function clearFilters() {
    // Limpa todos os checkboxes de categoria
    document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Limpa todos os checkboxes de marca
    document.querySelectorAll('#brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reseta os sliders de preço para os valores padrão
    const priceSliderMin = document.getElementById('price-slider-min');
    const priceSliderMax = document.getElementById('price-slider-max');
    const priceMinDisplay = document.getElementById('price-min-display');
    const priceMaxDisplay = document.getElementById('price-max-display');
    
    if (priceSliderMin && priceSliderMax) {
        priceSliderMin.value = 0;
        priceSliderMax.value = 500;
        
        if (priceMinDisplay && priceMaxDisplay) {
            priceMinDisplay.textContent = 'R$ 0';
            priceMaxDisplay.textContent = 'R$ 500';
        }
    }
    
    // Força uma pequena pausa para garantir que o DOM seja atualizado antes de filtrar
    setTimeout(() => {
        // Aplica os filtros (mostrar todos os produtos)
        filterProducts();
    }, 10);
}