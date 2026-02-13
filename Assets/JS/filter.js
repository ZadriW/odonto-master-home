window.addEventListener("load", filterSetup, false);
let refreshTimeout = null;

/**
 * Setups the filter functionality
 */
function filterSetup() {
    const filterQueryStringValue = queryStringParams.getAll("filtro");
    if (filterQueryStringValue.length > 0) {
        filterQueryStringValue.forEach((element) => {
            //Double quote in js workaround
            const escapedString = element.replace("\"", "\\\"");

            const container = document.querySelector(
                'input[value="' + escapedString + '"]'
            );
            if (!container) return;

            if (container.type == "radio") {
                const div = document.getElementById(container.id);
                if (div) div.classList.add("ring-2");
            } else container.checked = true;
        });
    }

    const priceFilterQueryStringValue = queryStringParams.getAll("precoPor");
    if (priceFilterQueryStringValue.length <= 0) return;
    priceFilterQueryStringValue.forEach((price) => {
        const minPriceFilter = document.getElementById("minimum-price-filter");
        const maxPriceFilter = document.getElementById("maximum-price-filter");
        const minPriceSlider = document.getElementById("price-slider-min");
        const maxPriceSlider = document.getElementById("price-slider-max");

        const splitedPrice = price.split(";");
        const min = Number(splitedPrice[0]);
        const max = Number(splitedPrice[1])

        if (minPriceFilter != null && maxPriceFilter != null) {
            minPriceFilter.value = min.toFixed(2);
            maxPriceFilter.value = max.toFixed(2);

        } else {
            const elementId = price.replace(";", "-");
            const elementFilter = document.getElementById(elementId);
            if (elementFilter != null) elementFilter.checked = true;
        }
        if (minPriceSlider != null && maxPriceSlider != null && min != max) {
            refreshMin(minPriceSlider, min);
            refreshMax(maxPriceSlider, max);
        }
    });
}

/**
 * Defines the selected filter
 * @param {string} filterId - The filter id
 */
function setFilter(filterId) {
    const filterQueryStringValue = queryStringParams.getAll("filtro");
    if (filterQueryStringValue.includes(filterId)) {
        queryStringParams.delete("filtro");
        if (filterQueryStringValue.length > 1) {
            const index = filterQueryStringValue.indexOf(filterId);
            filterQueryStringValue.splice(index, 1);
            filterQueryStringValue.forEach(x => queryStringParams.append("filtro", x));
        }
    } else {
        queryStringParams.append("filtro", filterId);
    }

    queryStringParams.delete("pagina");
    window.location.search = queryStringParams.toString();
}

/**
 * Clears the selected filter
 */
function clearFilters() {
    queryStringParams.delete("filtro");
    queryStringParams.delete("precoPor");
    window.location.search = queryStringParams.toString();
}

/**
 * Takes the price range informations and pass it to the query
 */
function setFieldPriceFilter() {
    if (refreshTimeout) clearTimeout(refreshTimeout);

    const minPrice = document.getElementById("minimum-price-filter").value;
    const maxPrice = document.getElementById("maximum-price-filter").value;
    const filter = minPrice + ";" + maxPrice;
    applyPriceFilterUrl(filter);
}

/**
 * Checks if the price filter is seletected, and adds it or removes it from the query
 */
function setRangePriceFilter(filterId) {
    const filterIsChecked = document.getElementById(filterId).checked;

    if (filterIsChecked) {
        const splitedPrice = filterId.split("-");
        const minPrice = splitedPrice[0];
        const maxPrice = splitedPrice[1];
        const filter = minPrice + ";" + maxPrice;
        applyPriceFilterUrl(filter);
    } else {
        queryStringParams.delete("precoPor");
        window.location.search = queryStringParams.toString();
    }
}

/**
 * Apply the price filter sending the data to the url query
 */
function applyPriceFilterUrl(filter) {
    const filterQueryStringValue = queryStringParams.getAll("precoPor");
    if (filterQueryStringValue.length == 1) {
        queryStringParams.delete("precoPor");
    }

    queryStringParams.set("precoPor", filter);
    window.location.search = queryStringParams.toString();
}

function openFilter() {
    const filterElement = document.getElementById('category-filters');
    if (!filterElement?.classList.contains('open')) {
        filterElement?.classList.remove('hidden');
        setTimeout(() => {
            filterElement?.classList.remove('opacity-0');
            filterElement?.classList.add('opacity-100');
            filterElement?.classList.add('open');
            // Prevenir scroll do body quando filtro estiver aberto
            document.body.style.overflow = 'hidden';
        }, 100);
    } else {
        closeFilter();
    }
}

function closeFilter() {
    const filterElement = document.getElementById('category-filters');
    if (filterElement?.classList.contains('open')) {
        filterElement?.classList.add('opacity-0');
        filterElement?.classList.remove('opacity-100');
        filterElement?.classList.remove('open');
        // Restaurar scroll do body
        document.body.style.overflow = '';
        setTimeout(() => { 
            filterElement?.classList.add('hidden');
        }, 300);
    }
}

// Fechar filtro ao clicar no overlay de fundo (mobile)
document.addEventListener('DOMContentLoaded', function() {
    const filterElement = document.getElementById('category-filters');
    if (filterElement) {
        // Fechar ao clicar no overlay (background escuro)
        filterElement.addEventListener('click', function(e) {
            // Se clicou no próprio elemento (background) e não no conteúdo filho
            if (e.target === filterElement) {
                closeFilter();
            }
        });
        
        // Prevenir fechamento ao clicar dentro do conteúdo
        const filterContent = filterElement.querySelector('*');
        if (filterContent) {
            filterContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }
});

function refreshMin(elem, inputValue = null) {
    const range = getPriceRange();
    const minValue = Number(document.getElementById('price-range-min-value').value);
    if (inputValue) elem.value = (inputValue - minValue) / range * 100;

    //so it won't go past the max slider
    const maxValueInput = document.getElementById('price-slider-max');
    elem.value = Math.min(elem.value, maxValueInput.value - 1);

    const value = Number(elem.value);
    const priceValue = Math.floor(minValue + (range * elem.value / 100)).toFixed(2);
    document.getElementById('unselected-left').style.width = value + '%';
    document.getElementById('selected-range-slider').style.left = value + '%';
    document.getElementById('slider-thumb-left').style.left = value + '%';
    document.getElementById('price-min-selected').value = priceValue;

    if (inputValue) return;
    
    updateFieldPrice('minimum-price-filter', priceValue);
    waitAndRefresh();
}

function refreshMax(elem, inputValue = null) {
    const range = getPriceRange();
    const minValue = Number(document.getElementById('price-range-min-value').value);
    if (inputValue) elem.value = (inputValue - minValue) / range * 100;

    //so it won't go past the min slider
    const minValueInput = document.getElementById('price-slider-min');
    elem.value = Math.max(elem.value, minValueInput.value - (-1));

    const value = Number(elem.value);
    const priceValue = Math.ceil(minValue + (range * elem.value / 100)).toFixed(2);
    document.getElementById('unselected-right').style.width = (100 - value) + '%';
    document.getElementById('selected-range-slider').style.right = (100 - value) + '%';
    document.getElementById('slider-thumb-right').style.left = value + '%';
    document.getElementById('price-max-selected').value = priceValue;

    if (inputValue) return;

    updateFieldPrice('maximum-price-filter', priceValue);
    waitAndRefresh();
}

function getPriceRange() {
    const minValue = document.getElementById('price-range-min-value').value;
    const maxValue = document.getElementById('price-range-max-value').value;
    return maxValue - minValue;
}

function waitAndRefresh() {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(setSliderPriceFilter, 2000);
}

function setSliderPriceFilter() {
    const min = document.getElementById('price-min-selected').value
    const max = document.getElementById('price-max-selected').value
    const filter = min + ";" + max;
    applyPriceFilterUrl(filter);
}

function updateFieldPrice(inputId, value) {
    const input = document.getElementById(inputId);
    if (input) input.value = value;
}

/**
 * Gets price filter values.
*/
function getPriceFilter(){
    const priceFilter = queryStringParams.get("precoPor");
    let minPrice = null;
    let maxPrice = null;

    if (priceFilter){
        var splitedPrice = priceFilter.replace().split(";");
        
        minPrice = parseFloat(splitedPrice[0]);
        maxPrice = parseFloat(splitedPrice[1]);
    }

    return { minPrice, maxPrice };
}

/**
 * Gets filters values.
*/
function getFilters(){
    const filters = queryStringParams.getAll("filtro");

    if (filters){
        let filtersList = [];

        for (let i = 0; i < filters.length; i++) {
            const item = filters[i];
            let itemSplited = item.split("__");

            if (itemSplited.length < 2){
                itemSplited = item.split(":");
            }

            let obj = new Object();
            obj.field = itemSplited[0];
            let values = [];
            values.push(itemSplited[1]);
            obj.values = values;
            filtersList.push(obj);
        }

        return filtersList;
    }

    return null;
}

/**
 * Toggle filter category visibility (show/hide subcategories with slide animation)
 * @param {string} filterId - The filter category ID
 */
function toggleFilterCategory(filterId) {
    const content = document.getElementById('filter-content-' + filterId);
    const arrow = document.getElementById('filter-arrow-' + filterId);
    
    if (!content || !arrow) return;
    
    const isCollapsed = content.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expandir
        content.style.maxHeight = '0px';
        content.classList.remove('collapsed');
        // Força reflow para iniciar animação
        void content.offsetHeight;
        const targetHeight = content.scrollHeight;
        content.style.maxHeight = targetHeight + 'px';
        arrow.classList.add('rotated');
        
        // Após animação, permitir altura automática
        setTimeout(() => {
            if (!content.classList.contains('collapsed')) {
                content.style.maxHeight = 'none';
            }
        }, 300);
    } else {
        // Colapsar
        const currentHeight = content.scrollHeight;
        content.style.maxHeight = currentHeight + 'px';
        // Força reflow
        void content.offsetHeight;
        content.style.maxHeight = '0px';
        content.classList.add('collapsed');
        arrow.classList.remove('rotated');
    }
}

/**
 * Initialize filter categories - collapsed by default, but expand those with selected filters
 */
function initFilterCategories() {
    // Verificar quais campos de filtro têm itens selecionados
    const selectedFilters = queryStringParams.getAll("filtro");
    const selectedFields = new Set();
    
    selectedFilters.forEach(filter => {
        const parts = filter.split("__");
        if (parts.length >= 2) {
            selectedFields.add(parts[0]);
        }
    });
    
    // Processar cada categoria
    const categoryWrappers = document.querySelectorAll('.filter-category-wrapper');
    categoryWrappers.forEach(wrapper => {
        const title = wrapper.querySelector('.filter-category-title');
        const content = wrapper.querySelector('.filter-category-content');
        const arrow = wrapper.querySelector('.filter-arrow');
        
        if (!title || !content || !arrow) return;
        
        const categoryName = title.querySelector('span')?.textContent?.trim();
        const filterId = content.id.replace('filter-content-', '');
        
        // Verificar se esta categoria tem filtros selecionados
        let hasSelectedFilter = false;
        if (categoryName) {
            selectedFields.forEach(field => {
                if (field === categoryName) {
                    hasSelectedFilter = true;
                }
            });
        }
        
        if (hasSelectedFilter) {
            // Expandir categorias com filtros selecionados
            content.classList.remove('collapsed');
            content.style.maxHeight = 'none';
            arrow.classList.add('rotated');
        } else {
            // Colapsar categorias sem filtros selecionados
            content.classList.add('collapsed');
            content.style.maxHeight = '0px';
            arrow.classList.remove('rotated');
        }
    });
}

// Inicializar categorias após o setup dos filtros
window.addEventListener("load", function() {
    setTimeout(initFilterCategories, 50);
}, false);