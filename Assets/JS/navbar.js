autocomplete(document.getElementById("search-bar"));
window.addEventListener("load", loadPartnerLogo());

/**
 * Redirects to the search page with the given term, or searching for 
 * the page's search bar value
 * @param {Event} e - The event
 * @param {string | null} term - The text input for this method, if not provided
 * we get the content of the search bar element.
 */
function search(e, term) {
    if (e) e.preventDefault();

    let query = term;
    if (!term) query = document.getElementById("search-bar").value;

    let searchPage =
        document.location.protocol + "//" +
        document.location.host + "/busca?busca=" +
        query;

    document.location.href = searchPage;
    return false;
}

/**
 * Load and render the autocomplete snippet
 * @param {string} val - The input text to search for autocompletion
 */
async function renderAutocompleteSnippet(val) {
    if (!val) return false;

    const response = await client.snippet.render(
        "autocomplete_snippet.html",
        "SnippetQueries/autocomplete.graphql",
        {
            query: val,
        }
    );
    setInnerHtmlById(response, "autocomplete-list");
}

/**
 * Sets a function to be called after a timeout
 * @param {function} callback - The function to be executed
 * @param {number} delay - The duration of the delay in ms
 */
function delayInput(callback, delay) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(callback.bind(this, ...args), delay || 0);
    };
}

/**
 * Setups the autocomplete feature
 * @param {HTMLInputElement} inp - The search bar input element
 */
function autocomplete(inp) {
    let currentFocus;

    inp.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            search(e, null);
        }
    });

    inp.addEventListener(
        "keyup",
        delayInput(async function (e) {
            if (e.keyCode != 40 && e.keyCode != 38 && e.keyCode != 13) {
                currentFocus = -1;
                await renderAutocompleteSnippet(this.value);
            }
        }, 500)
    );

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById("autocomplete-list");
        if (x) x = x.querySelectorAll("div[suggestion]");

        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus < 0 || !x) return;

            const selectedDiv = x[currentFocus];
            if (!selectedDiv.classList.value.includes("product-suggestion"))
                search(null, selectedDiv.innerHTML.trim());
            else window.location.href = "/" + selectedDiv.id;
        }
    });

    document.addEventListener("click", function (e) {
        setInnerHtmlById("", "autocomplete-list");
    });

    function addActive(items) {
        if (!items) return false;

        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;

        items[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(items) {
        for (let i = 0; i < items.length; i++)
            items[i].classList.remove("autocomplete-active");
    }
}

/**
 * Associates a checkout with a partner access token taken from the cookies
 * @param {string} checkoutId - The id of the checkout to be associated
 */
async function checkoutPartnerAssociate(checkoutId) {
    const partnerAccessToken = await client.cookie.get("sf_partner_access_token");
    if (partnerAccessToken)
        return await client.checkout.partnerAssociate(
            checkoutId,
            partnerAccessToken
        );
}

/**
 * If there is a partner access token registered in the cookies, loads a snippet to get a custom logo in the navbar
 */
async function loadPartnerLogo() {
    const partnerAccessToken = await client.cookie.get("sf_partner_access_token");
    if (!partnerAccessToken) return;

    const partnerLogo = await client.snippet.render(
        "partner_logo_snippet.html",
        "SnippetQueries/partner_logo.graphql",
        { partnerAccessToken: partnerAccessToken }
    );
    if (partnerLogo) setInnerHtmlById(partnerLogo, "navbar-logo");
}

/**
 * Mostra submenu (mobile)
 * @param {number} menuId - ID do menu
 */
function showSubMenu(menuId) {
    const menu = document.getElementById('drop-nav-menu-' + menuId);
    if (menu && window.innerWidth < 1024) {
        menu.classList.add('show-mobile');
        menu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Esconde submenu (mobile)
 * @param {number} menuId - ID do menu
 */
function hideSubMenu(menuId) {
    const menu = document.getElementById('drop-nav-menu-' + menuId);
    if (menu) {
        menu.classList.remove('show-mobile');
        menu.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Fecha dropdowns ao clicar fora (mobile)
 */
document.addEventListener('click', function(event) {
    if (window.innerWidth >= 1024) return; // Apenas mobile
    
    const isNavClick = event.target.closest('.navbar-main');
    const isDropdownClick = event.target.closest('[id^="drop-nav-menu-"]');
    
    if (!isNavClick && !isDropdownClick) {
        const openMenus = document.querySelectorAll('[id^="drop-nav-menu-"].show-mobile');
        openMenus.forEach(menu => {
            menu.classList.remove('show-mobile');
            menu.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
});

/**
 * Fecha menus ao redimensionar para desktop
 */
window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
        const openMenus = document.querySelectorAll('[id^="drop-nav-menu-"].show-mobile');
        openMenus.forEach(menu => {
            menu.classList.remove('show-mobile');
            menu.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
});

const showNavBar = (action) => {
    if (action) {
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('navbar-bg-opacity').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('navbar-bg-opacity').classList.remove('opacity-0');
            document.getElementById('navbar-bg-opacity').classList.add('opacity-100');
            document.getElementById("navbar").classList.remove('-translate-x-full')
            document.getElementById("navbar").classList.add('translate-x-0') 
        }, 100);
    } else {
        document.getElementById('navbar-bg-opacity').classList.remove('opacity-100');
        document.getElementById('navbar-bg-opacity').classList.add('opacity-0');
        document.getElementById("navbar").classList.add('-translate-x-full');
        document.getElementById("navbar").classList.remove('translate-x-0');

        setTimeout(() => { 
            document.getElementById('navbar').classList.add('hidden');
            document.getElementById('navbar-bg-opacity').classList.add('hidden');
        }, 200);
    }

}

const showSearchBar = () => {
    if (document.getElementById('search').classList.contains('hidden')) {
        document.getElementById('search').classList.remove('hidden')
        setTimeout(() => {
            document.getElementById('search').classList.remove('opacity-0')
            document.getElementById('search').classList.add('opacity-100')
            document.getElementById('search').classList.add('flex')
        }, 100)
    } else {
        document.getElementById('search').classList.remove('opacity-100')
        document.getElementById('search').classList.add('opacity-0')
        setTimeout(() => {
            document.getElementById('search').classList.add('hidden')
            document.getElementById('search').classList.remove('flex')
        }, 100)
    }
}

// ========================================
// SISTEMA DE DROPDOWN COM DELAY - DEFINITIVO
// ========================================

/**
 * Sistema robusto de controle de dropdown com delays adequados
 * Usa um gerenciador de estado centralizado para evitar conflitos
 */
class DropdownManager {
    constructor() {
        this.dropdowns = new Map();
        this.delays = {
            open: 100,      // Delay mínimo para abrir
            close: 300,     // Delay para fechar ao sair da categoria
            closeFromDropdown: 200  // Delay para fechar ao sair do dropdown
        };
        this.init();
    }

    init() {
        // Só inicializa em desktop
        if (window.innerWidth < 1024) return;

        // Encontra todos os grupos de menu com dropdown
        const menuGroups = document.querySelectorAll('.group');
        
        menuGroups.forEach(group => {
            const dropdown = group.querySelector('[id^="drop-nav-menu-"]');
            if (!dropdown) return;

            const dropdownId = dropdown.id;
            
            // Inicializa o estado do dropdown
            this.dropdowns.set(dropdownId, {
                element: dropdown,
                group: group,
                timers: {
                    open: null,
                    close: null
                },
                isOpen: false,
                mouseInGroup: false,
                mouseInDropdown: false
            });

            // Eventos do grupo (item de menu)
            group.addEventListener('mouseenter', () => this.handleGroupEnter(dropdownId));
            group.addEventListener('mouseleave', (e) => this.handleGroupLeave(dropdownId, e));

            // Eventos do dropdown
            dropdown.addEventListener('mouseenter', () => this.handleDropdownEnter(dropdownId));
            dropdown.addEventListener('mouseleave', (e) => this.handleDropdownLeave(dropdownId, e));
        });

        // Reinicializa no resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth < 1024) {
                    this.closeAll();
                } else {
                    this.reinit();
                }
            }, 250);
        });
    }

    handleGroupEnter(dropdownId) {
        const state = this.dropdowns.get(dropdownId);
        if (!state) return;

        state.mouseInGroup = true;

        // Cancela qualquer timer de fechamento
        if (state.timers.close) {
            clearTimeout(state.timers.close);
            state.timers.close = null;
        }

        // Abre após um pequeno delay (evita abrir acidentalmente)
        if (!state.isOpen) {
            state.timers.open = setTimeout(() => {
                this.openDropdown(dropdownId);
            }, this.delays.open);
        }
    }

    handleGroupLeave(dropdownId, event) {
        const state = this.dropdowns.get(dropdownId);
        if (!state) return;

        state.mouseInGroup = false;

        // Cancela timer de abertura se existir
        if (state.timers.open) {
            clearTimeout(state.timers.open);
            state.timers.open = null;
        }

        // Se o mouse foi para o dropdown, não fecha
        if (event.relatedTarget && state.element.contains(event.relatedTarget)) {
            return;
        }

        // Fecha após delay
        state.timers.close = setTimeout(() => {
            if (!state.mouseInDropdown && !state.mouseInGroup) {
                this.closeDropdown(dropdownId);
            }
        }, this.delays.close);
    }

    handleDropdownEnter(dropdownId) {
        const state = this.dropdowns.get(dropdownId);
        if (!state) return;

        state.mouseInDropdown = true;

        // Cancela qualquer timer de fechamento
        if (state.timers.close) {
            clearTimeout(state.timers.close);
            state.timers.close = null;
        }
    }

    handleDropdownLeave(dropdownId, event) {
        const state = this.dropdowns.get(dropdownId);
        if (!state) return;

        state.mouseInDropdown = false;

        // Se o mouse voltou para o grupo, não fecha
        if (event.relatedTarget && state.group.contains(event.relatedTarget)) {
            return;
        }

        // Fecha após delay menor
        state.timers.close = setTimeout(() => {
            if (!state.mouseInDropdown && !state.mouseInGroup) {
                this.closeDropdown(dropdownId);
            }
        }, this.delays.closeFromDropdown);
    }

    openDropdown(dropdownId) {
        const state = this.dropdowns.get(dropdownId);
        if (!state || state.isOpen) return;

        // Fecha outros dropdowns primeiro
        this.closeOthers(dropdownId);

        // Adiciona classe de abertura
        state.element.classList.add('dropdown-open');
        state.isOpen = true;
    }

    closeDropdown(dropdownId) {
        const state = this.dropdowns.get(dropdownId);
        if (!state || !state.isOpen) return;

        // Remove classe de abertura
        state.element.classList.remove('dropdown-open');
        state.isOpen = false;

        // Limpa timers
        if (state.timers.close) {
            clearTimeout(state.timers.close);
            state.timers.close = null;
        }
        if (state.timers.open) {
            clearTimeout(state.timers.open);
            state.timers.open = null;
        }
    }

    closeOthers(exceptId) {
        this.dropdowns.forEach((state, id) => {
            if (id !== exceptId && state.isOpen) {
                this.closeDropdown(id);
            }
        });
    }

    closeAll() {
        this.dropdowns.forEach((state, id) => {
            this.closeDropdown(id);
        });
    }

    reinit() {
        this.closeAll();
        this.dropdowns.clear();
        this.init();
    }
}

// Inicializa o gerenciador de dropdown
// DESABILITADO: Dropdowns foram removidos da navbar
// if (typeof window !== 'undefined') {
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', () => {
//             window.dropdownManager = new DropdownManager();
//         });
//     } else {
//         window.dropdownManager = new DropdownManager();
//     }
// }

// ========================================
// DROPDOWN DE CATEGORIAS
// ========================================

// Flag para controlar se as categorias já foram carregadas
let categoriesLoaded = false;
let categoriesDropdownOpen = false;

/**
 * Inicializa o dropdown de categorias ao carregar a página
 */
function initCategoriesDropdown() {
    const dropdown = document.getElementById('categories-dropdown');
    if (dropdown) {
        // Garante que o dropdown esteja oculto por padrão
        dropdown.classList.remove('active');
        categoriesDropdownOpen = false;
    }
}

// Inicializa quando o DOM estiver pronto
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCategoriesDropdown);
    } else {
        initCategoriesDropdown();
    }
}

/**
 * Alterna o estado do dropdown de Categorias
 */
function toggleCategoriesDropdown() {
    const dropdown = document.getElementById('categories-dropdown');
    const arrowIcon = document.getElementById('double-arrow-categories');
    
    if (!dropdown) {
        console.warn('Dropdown de categorias não encontrado');
        return;
    }
    
    categoriesDropdownOpen = !categoriesDropdownOpen;
    
    // Alterna a classe 'active' no dropdown
    if (categoriesDropdownOpen) {
        // Remove a classe hidden se existir e adiciona active
        dropdown.classList.remove('hidden');
        dropdown.classList.add('active');
        
        // Carrega as categorias na primeira abertura
        if (!categoriesLoaded) {
            loadCategories();
        }
    } else {
        // Remove active e depois adiciona hidden após a transição
        dropdown.classList.remove('active');
        setTimeout(() => {
            if (!categoriesDropdownOpen) {
                dropdown.classList.add('hidden');
            }
        }, 250);
    }
    
    // Rotaciona o ícone de seta
    if (arrowIcon) {
        arrowIcon.classList.toggle('rotated', categoriesDropdownOpen);
    }
}

/**
 * Carrega as categorias via API GraphQL
 */
async function loadCategories() {
    const contentEl = document.getElementById('categories-dropdown-content');
    
    if (!contentEl) {
        console.error('Container de conteúdo do dropdown não encontrado');
        return;
    }
    
    try {
        // Exibe loading
        contentEl.innerHTML = `
            <div class="categories-dropdown-loading">
                <div class="categories-dropdown-spinner"></div>
                <span>Carregando categorias...</span>
            </div>
        `;
        
        // Chama o snippet para renderizar as categorias
        const response = await client.snippet.render(
            "categories_dropdown_snippet.html",
            "SnippetQueries/categories.graphql",
            {
                first: 50  // Limite de categorias a buscar
            }
        );
        
        if (response) {
            contentEl.innerHTML = response;
            categoriesLoaded = true;
        } else {
            throw new Error('Resposta vazia da API');
        }
        
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        
        // Exibe mensagem de erro amigável
        contentEl.innerHTML = `
            <div class="categories-dropdown-empty">
                <span>Não foi possível carregar as categorias.</span>
            </div>
        `;
    }
}

/**
 * Fecha o dropdown de categorias ao clicar fora dele
 */
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('categories-dropdown');
    const arrowIcon = document.getElementById('double-arrow-categories');
    const categoriasLink = document.querySelector('.categorias-link-text');
    const categoriasMenu = event.target.closest('.group');
    
    // Verifica se o clique foi em um link de categoria (permite navegação)
    const isCategoryLink = event.target.closest('.categories-dropdown-item');
    
    // Se for um link de categoria, permite a navegação normalmente (não interfere)
    if (isCategoryLink) {
        // Não faz nada - permite o comportamento padrão do link
        return;
    }
    
    // Verifica se o clique foi no dropdown (mas não em um link), no ícone, no link "Categorias" ou no menu pai
    const isClickInside = dropdown && dropdown.contains(event.target) && !isCategoryLink;
    const isClickOnIcon = arrowIcon && (arrowIcon === event.target || arrowIcon.contains(event.target));
    const isClickOnLink = categoriasLink && (categoriasLink === event.target || categoriasLink.contains(event.target));
    const isClickOnMenu = categoriasMenu && categoriasMenu.querySelector('#categories-dropdown');
    
    // Fecha apenas se o clique foi fora de todos esses elementos
    if (categoriesDropdownOpen && !isClickInside && !isClickOnIcon && !isClickOnLink && !isClickOnMenu) {
        toggleCategoriesDropdown();
    }
});

/**
 * Fecha o dropdown com a tecla ESC
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && categoriesDropdownOpen) {
        toggleCategoriesDropdown();
    }
});

// Compatibilidade com a função antiga
function toggleCategoriasDropdown(menuId) {
    toggleCategoriesDropdown();
}