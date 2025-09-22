document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos relevantes
    const filtersSidebar = document.getElementById('filters-sidebar');
    const productsGrid = document.getElementById('products-grid');
    const noResultsMessage = document.getElementById('no-results-message');
    const searchResultsCount = document.getElementById('results-count');
    const searchTermDisplay = document.getElementById('search-term-display');
    const searchInput = document.getElementById('searchInput');

    // Verifica se estamos na página correta
    if (!filtersSidebar || !productsGrid) {
        return; // Sai da função se os elementos não existirem
    }

    // Obter termo de busca da URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('busca') || '';
    
    // Exibir termo de busca
    if (searchTermDisplay) {
        searchTermDisplay.textContent = searchTerm;
    }
    
    // Preencher o campo de busca com o termo de pesquisa
    if (searchInput) {
        searchInput.value = searchTerm;
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

    // Função para filtrar produtos com base nos critérios selecionados
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
                
                // Prevent the click from propagating to the link
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    
    // Função para carregar produtos com base no termo de busca
    function loadSearchResults() {
        // Produtos reais de ambas as categorias
        const allProducts = [
            // Produtos de Dentística
            { id: 'dent1', name: 'Resina Composta Z350 XT', category: 'Resina Composta', brand: '3M ESPE', price: '189,90', discount: '15% OFF' },
            { id: 'dent2', name: 'Sistema Adesivo Single Bond Universal', category: 'Sistema Adesivo', brand: '3M ESPE', price: '99,90', discount: '10% OFF' },
            { id: 'dent3', name: 'Ácido Fosfórico 37% Gel', category: 'Ácido Fosfórico', brand: 'FGM', price: '25,00', discount: '5% OFF' },
            { id: 'dent4', name: 'Matriz Metálica Automatriz', category: 'Matriz Metálica', brand: 'Ultradent', price: '35,50', discount: '12% OFF' },
            { id: 'dent5', name: 'Matriz Circunferencial Tofflemire', category: 'Matriz Circunferencial', brand: 'Angelus', price: '45,00', discount: '8% OFF' },
            { id: 'dent6', name: 'Instrumental Dentística Kit Básico', category: 'Instrumental Dentística', brand: 'Hu-Friedy', price: '129,90', discount: '20% OFF' },
            { id: 'dent7', name: 'Produtos em Oferta Combo Dentística', category: 'Produtos em Oferta', brand: 'Dentsply', price: '79,90', discount: '25% OFF' },
            { id: 'dent8', name: 'Cunhas de Espessamento Composit', category: 'Cunhas de Espessamento', brand: 'Microdont', price: '15,90', discount: '10% OFF' },
            { id: 'dent9', name: 'Diques de Matriz Teflon', category: 'Diques de Matriz', brand: 'Joinville', price: '22,50', discount: '7% OFF' },
            { id: 'dent10', name: 'Resina Composta Filtek Supreme', category: 'Resina Composta', brand: '3M ESPE', price: '249,90', discount: '18% OFF' },
            { id: 'dent11', name: 'Sistema Adesivo Scotchbond', category: 'Sistema Adesivo', brand: '3M ESPE', price: '119,90', discount: '12% OFF' },
            { id: 'dent12', name: 'Ácido Fosfórico 37% Líquido', category: 'Ácido Fosfórico', brand: 'Biodinâmica', price: '18,00', discount: '5% OFF' },
            { id: 'dent13', name: 'Matriz Metálica Palma', category: 'Matriz Metálica', brand: 'FGM', price: '32,00', discount: '6% OFF' },
            { id: 'dent14', name: 'Matriz Circunferencial Luxo', category: 'Matriz Circunferencial', brand: 'Millenium', price: '42,50', discount: '9% OFF' },
            { id: 'dent15', name: 'Instrumental Dentística Premium', category: 'Instrumental Dentística', brand: 'Tecno Empire', price: '139,90', discount: '15% OFF' },
            { id: 'dent16', name: 'Cunhas de Espessamento Deluxe', category: 'Cunhas de Espessamento', brand: 'Primera Dental', price: '17,50', discount: '8% OFF' },
            { id: 'dent17', name: 'Diques de Matriz Flexíveis', category: 'Diques de Matriz', brand: 'Shofu', price: '24,90', discount: '10% OFF' },
            { id: 'dent18', name: 'Resina Composta Bulk Fill', category: 'Resina Composta', brand: 'Ultradent', price: '199,90', discount: '20% OFF' },
            { id: 'dent19', name: 'Sistema Adesivo All-in-One', category: 'Sistema Adesivo', brand: 'FGM', price: '85,00', discount: '12% OFF' },
            { id: 'dent20', name: 'Ácido Fosfórico 37% em Gel', category: 'Ácido Fosfórico', brand: 'Angelus', price: '22,50', discount: '7% OFF' },
            
            // Produtos de Cirurgia e Periodontia
            { id: 'cir1', name: 'Fio de Sutura Cirúrgica', category: 'Fio de Sutura', brand: 'Angelus', price: '45,00', discount: '10% OFF' },
            { id: 'cir2', name: 'Bolsa Térmica para Cirurgia', category: 'Bolsa Termica', brand: 'BC Suture', price: '32,50', discount: '8% OFF' },
            { id: 'cir3', name: 'Curativo Alveolar', category: 'Curativo Alveolar', brand: 'Bestcare', price: '28,90', discount: '6% OFF' },
            { id: 'cir4', name: 'Hemostasia Cirúrgica', category: 'Hemostasia', brand: 'Biodinâmica', price: '65,00', discount: '12% OFF' },
            { id: 'cir5', name: 'Lâmina de Bisturi N° 15', category: 'Lâmina de Bisturi', brand: 'Swann Morton', price: '12,50', discount: '5% OFF' },
            { id: 'cir6', name: 'Produtos em Oferta Cirurgia', category: 'Produtos em Oferta', brand: 'FGM', price: '89,90', discount: '15% OFF' },
            { id: 'cir7', name: 'Regeneração Óssea Bio-Oss', category: 'Regeneração Óssea', brand: 'Geistlich', price: '320,00', discount: '15% OFF' },
            { id: 'cir8', name: 'Sugador Cirúrgico Descartável', category: 'Sugador Cirúrgico', brand: 'Maquira', price: '8,90', discount: '7% OFF' },
            { id: 'cir9', name: 'Sugador Descartável Kit', category: 'Sugador Descartável', brand: 'Maxicor', price: '15,00', discount: '10% OFF' },
            { id: 'cir10', name: 'Fio de Sutura Premium', category: 'Fio de Sutura', brand: 'Ethicon', price: '52,00', discount: '12% OFF' },
            { id: 'cir11', name: 'Bolsa Térmica Profissional', category: 'Bolsa Termica', brand: 'Dentsply', price: '35,00', discount: '9% OFF' },
            { id: 'cir12', name: 'Curativo Alveolar Avançado', category: 'Curativo Alveolar', brand: 'Indusbello', price: '31,50', discount: '8% OFF' },
            { id: 'cir13', name: 'Lâmina de Bisturi N° 11', category: 'Lâmina de Bisturi', brand: 'Procare', price: '11,90', discount: '6% OFF' },
            { id: 'cir14', name: 'Regeneração Óssea Sintética', category: 'Regeneração Óssea', brand: 'Quinelato', price: '280,00', discount: '18% OFF' },
            { id: 'cir15', name: 'Sugador Cirúrgico Premium', category: 'Sugador Cirúrgico', brand: 'Se Comercial', price: '9,50', discount: '8% OFF' },
            { id: 'cir16', name: 'Sugador Descartável Econômico', category: 'Sugador Descartável', brand: 'Shalon', price: '13,50', discount: '10% OFF' },
            { id: 'cir17', name: 'Fio de Sutura Antibacteriano', category: 'Fio de Sutura', brand: 'Technew', price: '48,00', discount: '11% OFF' },
            { id: 'cir18', name: 'Bolsa Térmica para Emergências', category: 'Bolsa Termica', brand: 'SP Protection', price: '29,90', discount: '7% OFF' },
            { id: 'cir19', name: 'Curativo Alveolar Premium', category: 'Curativo Alveolar', brand: 'Technofio', price: '33,90', discount: '9% OFF' },
            { id: 'cir20', name: 'Hemostasia Avançada', category: 'Hemostasia', brand: 'Ultradent', price: '68,50', discount: '13% OFF' }
        ];
        
        // Função de busca avançada com tratamento de caracteres acentuados
        function advancedSearch(products, term) {
            // Se não houver termo de busca, mostrar todos os produtos
            if (!term || term.trim() === '') {
                return products;
            }
            
            // Função para normalizar texto (remover acentos e converter para minúsculas)
            function normalizeText(text) {
                if (!text) return '';
                // Remove acentos e caracteres especiais
                return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            }
            
            // Normalizar o termo de busca e dividir em palavras-chave
            const normalizedSearchTerm = normalizeText(term.trim());
            const searchKeywords = normalizedSearchTerm.split(/\s+/).filter(keyword => keyword.length > 0);
            
            // Filtrar produtos com base no termo de busca
            return products.filter(product => {
                // Normalizar os campos do produto
                const normalizedName = normalizeText(product.name);
                const normalizedCategory = normalizeText(product.category);
                const normalizedBrand = normalizeText(product.brand);
                
                // Combinar todos os campos para busca mais abrangente
                const combinedFields = `${normalizedName} ${normalizedCategory} ${normalizedBrand}`;
                
                // Verificar se todos os termos de busca estão presentes em algum lugar
                return searchKeywords.every(keyword => 
                    combinedFields.includes(keyword)
                );
            });
        }
        
        // Filtrar produtos com base no termo de busca
        const filteredProducts = advancedSearch(allProducts, searchTerm);
        
        // Atualizar contador de resultados
        if (searchResultsCount) {
            searchResultsCount.textContent = filteredProducts.length;
        }
        
        // Preencher os cards de produto
        if (filteredProducts.length > 0) {
            productsGrid.innerHTML = filteredProducts.map(product => `
                <article class="product-card" data-category="${product.category}" data-brand="${product.brand}">
                    <a href="/pages/produto/produto.html?category=${encodeURIComponent(product.category)}&brand=${encodeURIComponent(product.brand)}&id=${product.id}" class="product-card-link">
                        <div class="product-card__image">
                            <img src="https://via.placeholder.com/300x300/e8ece9/333?text=${encodeURIComponent(product.name)}" alt="${product.name}">
                            <div class="product-badge product-badge--discount">${product.discount}</div>
                        </div>
                        <div class="product-card__content">
                            <h3 class="product-title">${product.name}</h3>
                            <div class="product-pricing">
                                <span class="product-price--current">R$ ${product.price}</span>
                            </div>
                            <button class="product-button">ADICIONAR AO CARRINHO</button>
                        </div>
                    </a>
                </article>
            `).join('');
        } else {
            productsGrid.innerHTML = '';
        }
        
        // Se não houver resultados, mostrar mensagem
        if (filteredProducts.length === 0) {
            noResultsMessage.style.display = 'block';
            productsGrid.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            productsGrid.style.display = 'grid';
        }
        
        // Re-inicializar os filtros após carregar os produtos
        setTimeout(initializeFilters, 100);
    }
    
    // Carregar resultados da pesquisa
    loadSearchResults();
});

function clearFilters() {
    // Limpa todos os checkboxes de categoria
    document.querySelectorAll('#category-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        // Trigger the change event manually to ensure filterProducts is called
        checkbox.dispatchEvent(new Event('change'));
    });
    
    // Limpa todos os checkboxes de marca
    document.querySelectorAll('#brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        // Trigger the change event manually to ensure filterProducts is called
        checkbox.dispatchEvent(new Event('change'));
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
        
        // Trigger the input event manually to ensure filterProducts is called
        priceSliderMin.dispatchEvent(new Event('input'));
        priceSliderMax.dispatchEvent(new Event('input'));
    }
    
    // Força uma pequena pausa para garantir que o DOM seja atualizado antes de filtrar
    setTimeout(() => {
        // Aplica os filtros (mostrar todos os produtos)
        filterProducts();
    }, 10);
}