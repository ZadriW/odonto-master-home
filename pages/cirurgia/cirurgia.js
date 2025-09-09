document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos relevantes
    const filtersSidebar = document.getElementById('filters-sidebar');
    const productsGrid = document.getElementById('products-grid');
    const noResultsMessage = document.getElementById('no-results-message');

    // Verifica se estamos na página correta
    if (!filtersSidebar || !productsGrid) {
        return; // Sai da função se os elementos não existirem
    }

    const checkboxes = filtersSidebar.querySelectorAll('input[type="checkbox"]');
    const productCards = Array.from(productsGrid.getElementsByClassName('product-card'));

    // Adiciona um listener de evento para cada checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    function filterProducts() {
        const selectedFilters = getSelectedFilters();
        let visibleProductsCount = 0;

        productCards.forEach(card => {
            const cardCategory = card.dataset.category || '';
            const cardBrand = card.dataset.brand || '';
            
            // Verifica se o card corresponde a todos os filtros selecionados
            const categoryMatch = selectedFilters.categories.length === 0 || selectedFilters.categories.includes(cardCategory);
            const brandMatch = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(cardBrand);

            if (categoryMatch && brandMatch) {
                card.classList.remove('hidden');
                visibleProductsCount++;
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Exibe ou oculta a mensagem de "nenhum resultado"
        if (visibleProductsCount === 0) {
            noResultsMessage.style.display = 'block';
            productsGrid.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            productsGrid.style.display = 'grid';
        }
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
    
    // Simulação: Preenche os cards de produto com conteúdo de exemplo
    // Este bloco pode ser removido quando a integração com a Wake estiver ativa
    productCards.forEach((card, index) => {
    const category = card.dataset.category;
    const brand = card.dataset.brand;

    // Garante que o card só será preenchido se tiver uma categoria válida
    if (category && brand) {
        card.innerHTML = `
            <div class="product-card__image">
                <img src="https://via.placeholder.com/300x300/e8ece9/333?text=${category.replace(' ', '+')}" alt="Produto ${index + 1}">
                <div class="product-badge product-badge--discount">10% OFF</div>
            </div>
            <div class="product-card__content">
                <h3 class="product-title">${category} Exemplo ${index + 1} - ${brand}</h3>
                <div class="product-pricing">
                    <span class="product-price--current">R$ 99,90</span>
                </div>
                <button class="product-button">ADICIONAR AO CARRINHO</button>
            </div>
        `;
    }
    });
});