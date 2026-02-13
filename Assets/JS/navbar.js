autocomplete(document.getElementById("search-bar"));
window.addEventListener("load", loadPartnerLogo());

// ===== DETECÇÃO DE SCROLL/SWIPE NA NAVBAR MOBILE =====
// Variáveis para detectar scroll na navbar mobile
let navbarTouchStartY = 0;
let navbarTouchStartX = 0;
let navbarIsScrolling = false;
let navbarScrollTimeout = null;

/**
 * Configura detecção de scroll/swipe na navbar mobile para desabilitar hover
 */
function setupNavbarMobileScrollDetection() {
    // Apenas no mobile
    if (window.innerWidth > 1023) return;
    
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Detecta início do toque
    navbar.addEventListener('touchstart', handleNavbarTouchStart, { passive: true });
    navbar.addEventListener('touchmove', handleNavbarTouchMove, { passive: true });
    navbar.addEventListener('touchend', handleNavbarTouchEnd, { passive: true });
    
    // Também para scroll com mouse
    navbar.addEventListener('mousedown', handleNavbarMouseDown, { passive: true });
    navbar.addEventListener('mousemove', handleNavbarMouseMove, { passive: true });
    navbar.addEventListener('mouseup', handleNavbarMouseUp, { passive: true });
    navbar.addEventListener('scroll', handleNavbarScroll, { passive: true });
    
    // Detecta scroll na cascade também (já existe, mas vamos garantir)
    const cascade = document.getElementById('categories-mobile-cascade');
    if (cascade) {
        cascade.addEventListener('scroll', handleNavbarScroll, { passive: true });
    }
}

/**
 * Remove listeners de detecção de scroll da navbar mobile
 */
function removeNavbarMobileScrollDetection() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    navbar.removeEventListener('touchstart', handleNavbarTouchStart);
    navbar.removeEventListener('touchmove', handleNavbarTouchMove);
    navbar.removeEventListener('touchend', handleNavbarTouchEnd);
    navbar.removeEventListener('mousedown', handleNavbarMouseDown);
    navbar.removeEventListener('mousemove', handleNavbarMouseMove);
    navbar.removeEventListener('mouseup', handleNavbarMouseUp);
    navbar.removeEventListener('scroll', handleNavbarScroll);
    
    const cascade = document.getElementById('categories-mobile-cascade');
    if (cascade) {
        cascade.removeEventListener('scroll', handleNavbarScroll);
    }
}

function handleNavbarTouchStart(e) {
    navbarTouchStartY = e.touches[0].clientY;
    navbarTouchStartX = e.touches[0].clientX;
    navbarIsScrolling = false;
    
    // Limpa timeout anterior
    if (navbarScrollTimeout) {
        clearTimeout(navbarScrollTimeout);
    }
}

function handleNavbarTouchMove(e) {
    if (!navbarTouchStartY && !navbarTouchStartX) return;
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = Math.abs(touchY - navbarTouchStartY);
    const deltaX = Math.abs(touchX - navbarTouchStartX);
    
    // Se moveu mais de 10px, considera como scroll
    if (deltaY > 10 || deltaX > 10) {
        navbarIsScrolling = true;
        document.body.classList.add('is-scrolling-navbar-mobile');
    }
}

function handleNavbarTouchEnd(e) {
    // Aguarda um pouco para verificar se foi scroll
    navbarScrollTimeout = setTimeout(() => {
        navbarIsScrolling = false;
        document.body.classList.remove('is-scrolling-navbar-mobile');
    }, 150);
}

function handleNavbarMouseDown(e) {
    navbarTouchStartY = e.clientY;
    navbarTouchStartX = e.clientX;
    navbarIsScrolling = false;
}

function handleNavbarMouseMove(e) {
    if (!navbarTouchStartY && !navbarTouchStartX) return;
    
    const deltaY = Math.abs(e.clientY - navbarTouchStartY);
    const deltaX = Math.abs(e.clientX - navbarTouchStartX);
    
    if (deltaY > 5 || deltaX > 5) {
        navbarIsScrolling = true;
        document.body.classList.add('is-scrolling-navbar-mobile');
    }
}

function handleNavbarMouseUp(e) {
    navbarScrollTimeout = setTimeout(() => {
        navbarIsScrolling = false;
        document.body.classList.remove('is-scrolling-navbar-mobile');
    }, 150);
}

function handleNavbarScroll(e) {
    navbarIsScrolling = true;
    document.body.classList.add('is-scrolling-navbar-mobile');
    
    // Limpa timeout anterior
    if (navbarScrollTimeout) {
        clearTimeout(navbarScrollTimeout);
    }
    
    // Remove a classe após parar de scrollar
    navbarScrollTimeout = setTimeout(() => {
        navbarIsScrolling = false;
        document.body.classList.remove('is-scrolling-navbar-mobile');
    }, 200);
}

// Inicializa detecção de scroll na navbar mobile quando a página carregar
window.addEventListener('load', function() {
    if (window.innerWidth <= 1023) {
        setupNavbarMobileScrollDetection();
    }
});

// Reconfigura ao redimensionar
window.addEventListener('resize', function() {
    if (window.innerWidth <= 1023) {
        setupNavbarMobileScrollDetection();
    } else {
        removeNavbarMobileScrollDetection();
    }
});

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
            
            // Mobile: Abre e carrega a cascata automaticamente quando a navbar abrir
            if (window.innerWidth <= 1023) {
                const cascade = document.getElementById('categories-mobile-cascade');
                if (cascade) {
                    cascade.classList.add('active');
                    categoriesMobileCascadeOpen = true;
                    
                    // Carrega as categorias se ainda não foram carregadas
                    if (!categoriesMobileLoaded) {
                        loadCategoriesMobile();
                    }
                    
                    // Configura detecção de scroll
                    setupScrollDetection();
                }
            }
        }, 100);
    } else {
        document.getElementById('navbar-bg-opacity').classList.remove('opacity-100');
        document.getElementById('navbar-bg-opacity').classList.add('opacity-0');
        document.getElementById("navbar").classList.add('-translate-x-full');
        document.getElementById("navbar").classList.remove('translate-x-0');

        setTimeout(() => { 
            document.getElementById('navbar').classList.add('hidden');
            document.getElementById('navbar-bg-opacity').classList.add('hidden');
            
            // Mobile: Remove listeners de scroll quando fechar
            if (window.innerWidth <= 1023) {
                removeScrollDetection();
            }
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
function toggleCategoriesDropdown(event) {
    // Previne ação se estiver scrollando (mobile)
    if (window.innerWidth <= 1023 && (isScrolling || document.body.classList.contains('is-scrolling-mobile-cascade'))) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        return;
    }
    
    // Verifica se é mobile
    const isMobile = window.innerWidth <= 1023;
    
    if (isMobile) {
        // Mobile: usa cascata de categorias
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        toggleCategoriesMobileCascade();
        return;
    } else {
        // Desktop: usa dropdown
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
}

/**
 * Carrega os itens da navbar no dropdown de categorias
 */
function loadCategories() {
    const contentEl = document.getElementById('categories-dropdown-content');
    
    if (!contentEl) {
        console.error('Container de conteúdo do dropdown não encontrado');
        return;
    }
    
    try {
        // Busca o container da navbar com os itens (ul com as classes específicas)
        const navbarList = document.querySelector('nav#navbar ul.flex.flex-col.lg\\:flex-row.relative.lg\\:w-full.lg\\:justify-start.lg\\:items-center.lg\\:gap-0');
        
        if (!navbarList) {
            // Tenta buscar sem todas as classes específicas
            const navbarListAlt = document.querySelector('nav#navbar ul');
            if (!navbarListAlt) {
                throw new Error('Lista da navbar não encontrada');
            }
            renderNavbarItemsFromList(navbarListAlt, contentEl);
            categoriesLoaded = true;
            return;
        }
        
        // Renderiza os itens da lista
        renderNavbarItemsFromList(navbarList, contentEl);
        categoriesLoaded = true;
        
    } catch (error) {
        console.error('Erro ao carregar itens da navbar:', error);
        
        // Exibe mensagem de erro amigável
        contentEl.innerHTML = `
            <div class="categories-dropdown-empty">
                <span>Não foi possível carregar os itens.</span>
            </div>
        `;
    }
}

/**
 * Renderiza os itens da navbar a partir da lista com sistema de cascata
 */
function renderNavbarItemsFromList(navbarList, container) {
    // Coleta todos os itens <li> de primeiro nível
    const navItems = navbarList.querySelectorAll(':scope > li.group, :scope > li:not(.group)');
    
    if (!navItems || navItems.length === 0) {
        container.innerHTML = `
            <div class="categories-dropdown-empty">
                <span>Nenhum item encontrado</span>
            </div>
        `;
        return;
    }
    
    // Cria a lista de itens
    let itemsHTML = '<div class="categories-dropdown-list">';
    const processedItems = new Set(); // Para evitar duplicatas
    let categoryIndex = 0;
    
    navItems.forEach(item => {
        // Busca o link principal dentro do item
        const mainLink = item.querySelector(':scope > div > div > a[href], :scope > a[href]');
        
        if (!mainLink) {
            return; // Ignora itens sem link
        }
        
        // Pega o texto do link (pode estar em um span ou diretamente no link)
        let linkText = '';
        const span = mainLink.querySelector('span');
        if (span) {
            linkText = span.textContent?.trim() || '';
        } else {
            linkText = mainLink.textContent?.trim() || '';
        }
        
        const linkHref = mainLink.getAttribute('href') || '#';
        
        // Lista de itens a serem ocultados
        const hiddenItems = ['acadêmicos', 'academicos', 'mais ofertas'];
        const linkTextLower = linkText.toLowerCase().trim();
        
        // Verifica se o texto corresponde exatamente ou contém algum item oculto
        const shouldHide = hiddenItems.some(hidden => 
            linkTextLower === hidden.toLowerCase() || 
            linkTextLower.includes(hidden.toLowerCase())
        );
        
        // Ignora itens vazios, o link "Categorias" (que abre o dropdown), itens ocultos, ou links com onclick para categorias
        if (!linkText || 
            linkText === '' || 
            linkTextLower === 'categorias' || 
            shouldHide ||
            processedItems.has(linkText)) {
            return;
        }
        
        processedItems.add(linkText);
        
        // Verifica se este item tem submenus (é um li.group com dropdown)
        const hasSubmenu = item.classList.contains('group');
        const dropdownMenu = item.querySelector('div[id^="drop-nav-menu-"]');
        
        if (hasSubmenu && dropdownMenu) {
            // Coleta os subitens do dropdown (mesmo que esteja oculto)
            const subItems = collectSubItems(dropdownMenu);
            
            // Sempre cria a estrutura de cascata se tem dropdown
            // Gera um ID único para a categoria
            const categoryId = `category-${categoryIndex++}`;
            
            // Sempre cria a estrutura de cascata com arrow, mesmo que não haja subitens
            itemsHTML += `
                <div class="categories-dropdown-category">
                    <div class="categories-dropdown-item categories-dropdown-category-toggle" 
                         data-category-id="${categoryId}">
                        <a href="${linkHref}" class="categories-dropdown-item-name-link">
                            <span class="categories-dropdown-item-name">${linkText}</span>
                        </a>
                        <button type="button" 
                                class="categories-dropdown-arrow-button"
                                onclick="window.toggleCategorySubmenu('${categoryId}', event)" 
                                aria-expanded="false"
                                aria-label="Expandir subcategorias">
                            <svg class="categories-dropdown-arrow" width="16" height="16" viewBox="0 0 256 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
                                <path d="M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="categories-dropdown-subcategories" id="${categoryId}-subcategories">
                        ${subItems.length > 0 ? subItems.map(sub => `
                            <a href="${sub.href}" class="categories-dropdown-subitem">
                                <span class="categories-dropdown-item-name">${sub.name}</span>
                            </a>
                        `).join('') : ''}
                    </div>
                </div>
            `;
        } else {
            // Item simples sem submenu
            if (linkHref && linkHref !== '#') {
                itemsHTML += `
                    <a href="${linkHref}" class="categories-dropdown-item">
                        <span class="categories-dropdown-item-name">${linkText}</span>
                    </a>
                `;
            }
        }
    });
    
    itemsHTML += '</div>';
    
    if (processedItems.size === 0) {
        container.innerHTML = `
            <div class="categories-dropdown-empty">
                <span>Nenhum item encontrado</span>
            </div>
        `;
    } else {
        container.innerHTML = itemsHTML;
    }
}

/**
 * Coleta os subitens de um menu dropdown
 */
function collectSubItems(dropdownMenu) {
    const subItems = [];
    const processedSubItems = new Set();
    
    if (!dropdownMenu) {
        return subItems;
    }
    
    // Força a visibilidade temporariamente para garantir que os elementos sejam encontrados
    const originalStyle = dropdownMenu.style.cssText;
    dropdownMenu.style.cssText = 'position: absolute !important; visibility: visible !important; opacity: 1 !important; display: block !important;';
    
    try {
        // Busca o ul dentro do dropdown
        const dropdownUl = dropdownMenu.querySelector('ul');
        
        if (!dropdownUl) {
            return subItems;
        }
        
        // Busca todas as seções (li) dentro do ul
        const sections = dropdownUl.querySelectorAll(':scope > li');
        
        sections.forEach(section => {
            // Ignora o botão "Voltar" (mobile)
            const sectionText = section.textContent?.trim().toLowerCase() || '';
            const isBackButton = sectionText === 'voltar' || 
                                section.querySelector('img[alt*="arrow-back"]') ||
                                section.classList.contains('flex') && sectionText.includes('voltar');
            if (isBackButton) {
                return;
            }
            
            // Verifica se é uma seção com título e lista (estrutura de submenu)
            const sectionTitle = section.querySelector('.dropdown-section-title');
            const sectionList = section.querySelector('.dropdown-section-list');
            
            if (sectionTitle && sectionList) {
                // Coleta o título da seção como subcategoria principal
                const titleText = sectionTitle.textContent?.trim() || '';
                const titleHref = sectionTitle.getAttribute('href') || '#';
                
                if (titleText && !processedSubItems.has(titleText) && titleHref !== '#') {
                    processedSubItems.add(titleText);
                    subItems.push({
                        name: titleText,
                        href: titleHref
                    });
                }
                
                // Coleta os itens da lista de subcategorias
                const listItems = sectionList.querySelectorAll('li > a');
                listItems.forEach(listItem => {
                    const itemText = listItem.textContent?.trim() || '';
                    const itemHref = listItem.getAttribute('href') || '#';
                    
                    // Limpa o texto (remove espaços extras)
                    const cleanText = itemText.replace(/\s+/g, ' ').trim();
                    
                    if (cleanText && 
                        !processedSubItems.has(cleanText) && 
                        itemHref !== '#') {
                        processedSubItems.add(cleanText);
                        subItems.push({
                            name: cleanText,
                            href: itemHref
                        });
                    }
                });
            } else {
                // Item simples (não é uma seção com subcategorias)
                const simpleLink = section.querySelector('a');
                if (simpleLink) {
                    const itemText = simpleLink.textContent?.trim() || '';
                    const itemHref = simpleLink.getAttribute('href') || '#';
                    
                    // Limpa o texto
                    const cleanText = itemText.replace(/\s+/g, ' ').trim();
                    
                    // Ignora "Voltar" e itens já processados
                    if (cleanText && 
                        cleanText.toLowerCase() !== 'voltar' && 
                        !processedSubItems.has(cleanText) && 
                        itemHref !== '#') {
                        processedSubItems.add(cleanText);
                        subItems.push({
                            name: cleanText,
                            href: itemHref
                        });
                    }
                }
            }
        });
    } finally {
        // Restaura o estilo original
        dropdownMenu.style.cssText = originalStyle;
    }
    
    return subItems;
}

/**
 * Fecha todas as categorias desktop expandidas, exceto a especificada
 * @param {string} exceptCategoryId - ID da categoria que não deve ser fechada (opcional)
 */
function closeAllDesktopCategories(exceptCategoryId = null) {
    // Encontra todas as subcategorias expandidas
    const allExpandedSubcategories = document.querySelectorAll('.categories-dropdown-subcategories-expanded');
    
    allExpandedSubcategories.forEach(subcategory => {
        // Pega o ID da categoria a partir do ID do elemento de subcategorias
        const subcategoryId = subcategory.id;
        if (!subcategoryId) return;
        
        // Extrai o categoryId do ID (formato: "category-X-subcategories")
        const categoryIdMatch = subcategoryId.match(/^(category-\d+)-subcategories$/);
        if (!categoryIdMatch) return;
        
        const categoryId = categoryIdMatch[1];
        
        // Pula se for a categoria que não deve ser fechada
        if (exceptCategoryId && categoryId === exceptCategoryId) {
            return;
        }
        
        // Encontra o botão e container relacionados
        let button = document.querySelector(`button.categories-dropdown-arrow-button[onclick*="toggleCategorySubmenu('${categoryId}')"]`);
        if (!button) {
            button = document.querySelector(`button.categories-dropdown-arrow-button[onclick*='toggleCategorySubmenu("${categoryId}")']`);
        }
        if (!button) {
            const container = document.querySelector(`div[data-category-id="${categoryId}"]`);
            if (container) {
                const foundButton = container.querySelector('button.categories-dropdown-arrow-button');
                if (foundButton) {
                    closeDesktopCategory(categoryId, foundButton, subcategory, container);
                }
            }
            return;
        }
        
        const container = button.closest('.categories-dropdown-category-toggle');
        closeDesktopCategory(categoryId, button, subcategory, container);
    });
}

/**
 * Fecha uma categoria desktop específica
 * @param {string} categoryId - ID da categoria
 * @param {HTMLElement} button - Botão da categoria
 * @param {HTMLElement} subcategories - Elemento de subcategorias
 * @param {HTMLElement} container - Container da categoria
 */
function closeDesktopCategory(categoryId, button, subcategories, container) {
    // Fecha usando estilos inline
    subcategories.style.setProperty('max-height', '0', 'important');
    subcategories.style.setProperty('opacity', '0', 'important');
    subcategories.style.setProperty('overflow', 'hidden', 'important');
    subcategories.style.setProperty('padding', '0', 'important');
    subcategories.classList.remove('categories-dropdown-subcategories-expanded');
    button.setAttribute('aria-expanded', 'false');
    
    // Atualiza o ícone para angle-right (fechado)
    const arrow = button.querySelector('.categories-dropdown-arrow');
    if (arrow) {
        try {
            arrow.setAttribute('viewBox', '0 0 256 512');
            const existingPaths = arrow.querySelectorAll('path');
            existingPaths.forEach(path => path.remove());
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z');
            arrow.appendChild(path);
        } catch (error) {
            console.error('Erro ao alterar arrow para angle-right:', error);
        }
    }
    
    // Remove classe ativa do container
    if (container) {
        container.classList.remove('categories-dropdown-category-active');
    }
}

/**
 * Alterna a exibição das subcategorias de uma categoria
 * Função global para ser acessível via onclick
 * Garante que apenas uma categoria esteja expandida por vez
 */
window.toggleCategorySubmenu = function(categoryId, event) {
    // Previne a propagação do evento para não fechar o dropdown principal
    if (event) {
        event.stopPropagation();
    }
    
    // Tenta encontrar o botão de várias formas
    let button = document.querySelector(`button.categories-dropdown-arrow-button[onclick*="toggleCategorySubmenu('${categoryId}')"]`);
    if (!button) {
        button = document.querySelector(`button.categories-dropdown-arrow-button[onclick*='toggleCategorySubmenu("${categoryId}")']`);
    }
    if (!button) {
        // Fallback para encontrar pelo container
        const container = document.querySelector(`div[data-category-id="${categoryId}"]`);
        button = container?.querySelector('button.categories-dropdown-arrow-button');
    }
    
    const subcategories = document.getElementById(`${categoryId}-subcategories`);
    const arrow = button?.querySelector('.categories-dropdown-arrow');
    
    if (!subcategories) {
        console.warn('Subcategorias não encontrado para:', categoryId);
        return;
    }
    
    if (!button) {
        console.warn('Botão não encontrado para:', categoryId);
        return;
    }
    
    if (!arrow) {
        console.warn('Arrow não encontrado para:', categoryId, 'Button:', button);
        return;
    }
    
    // Verifica se há subitens
    const hasSubItems = subcategories.children.length > 0;
    if (!hasSubItems) {
        console.warn('Nenhum subitem encontrado para:', categoryId, 'Container HTML:', subcategories.innerHTML);
        // Mesmo sem subitens, permite o toggle para feedback visual
    }
    
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        // Fecha
        closeDesktopCategory(categoryId, button, subcategories, button.closest('.categories-dropdown-category-toggle'));
    } else {
        // Antes de abrir, fecha todas as outras categorias expandidas
        closeAllDesktopCategories(categoryId);
        
        // Abre
        // Remove todas as restrições temporariamente para calcular a altura real
        const originalMaxHeight = subcategories.style.maxHeight;
        const originalOpacity = subcategories.style.opacity;
        const originalOverflow = subcategories.style.overflow;
        const originalPadding = subcategories.style.padding;
        
        subcategories.style.maxHeight = 'none';
        subcategories.style.opacity = '1';
        subcategories.style.overflow = 'visible';
        subcategories.style.padding = '0.5px 0';
        subcategories.style.display = 'block';
        
        // Calcula a altura real
        const height = subcategories.scrollHeight || subcategories.offsetHeight;
        
        // Restaura os estilos originais
        subcategories.style.maxHeight = originalMaxHeight;
        subcategories.style.opacity = originalOpacity;
        subcategories.style.overflow = originalOverflow;
        subcategories.style.padding = originalPadding;
        
        // Se a altura for 0, tenta calcular de outra forma
        let finalHeight = height;
        if (height === 0) {
            // Tenta calcular somando a altura dos filhos
            let totalHeight = 0;
            Array.from(subcategories.children).forEach(child => {
                totalHeight += child.offsetHeight || child.scrollHeight || 0;
            });
            finalHeight = totalHeight + 16; // Adiciona padding
        }
        
        // Reseta para o estado fechado
        subcategories.style.setProperty('max-height', '0', 'important');
        subcategories.style.setProperty('opacity', '0', 'important');
        subcategories.style.setProperty('padding', '0', 'important');
        subcategories.style.setProperty('overflow', 'hidden', 'important');
        
        // Adiciona classe para indicar que está expandido
        subcategories.classList.add('categories-dropdown-subcategories-expanded');
        
        // Usa requestAnimationFrame para garantir que a transição funcione
        requestAnimationFrame(() => {
            subcategories.style.setProperty('max-height', finalHeight + 'px', 'important');
            subcategories.style.setProperty('opacity', '1', 'important');
            subcategories.style.setProperty('overflow', 'visible', 'important');
            subcategories.style.setProperty('padding', '0.5px 0', 'important');
        });
        
        button.setAttribute('aria-expanded', 'true');
        const container = button.closest('.categories-dropdown-category-toggle');
        if (arrow) {
            // Troca para angle-down (aberto)
            try {
                arrow.setAttribute('viewBox', '0 0 384 512');
                // Remove todos os paths existentes
                const existingPaths = arrow.querySelectorAll('path');
                existingPaths.forEach(path => path.remove());
                // Cria novo path
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 'M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z');
                arrow.appendChild(path);
            } catch (error) {
                console.error('Erro ao alterar arrow para angle-down:', error);
            }
        }
        if (container) {
            container.classList.add('categories-dropdown-category-active');
        }
    }
};


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
    
    // Verifica se o clique foi no botão de categoria com submenu (toggle)
    const isCategoryToggle = event.target.closest('.categories-dropdown-category-toggle');
    
    // Verifica se o clique foi no arrow de categoria
    const isCategoryArrow = event.target.closest('.categories-dropdown-arrow') || 
                           event.target.classList.contains('categories-dropdown-arrow');
    
    // Se for um link de categoria, toggle ou arrow, permite o comportamento normalmente (não interfere)
    if (isCategoryLink || isCategoryToggle || isCategoryArrow) {
        // Não faz nada - permite o comportamento padrão
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

/**
 * Alterna a exibição da cascata mobile de categorias
 */
let categoriesMobileCascadeOpen = false;
let categoriesMobileLoaded = false;

// Variáveis para detectar scroll vs clique
let touchStartY = 0;
let touchStartX = 0;
let isScrolling = false;
let scrollTimeout = null;

function toggleCategoriesMobileCascade() {
    const cascade = document.getElementById('categories-mobile-cascade');
    const arrowIcon = document.getElementById('double-arrow-categories');
    
    if (!cascade) {
        console.warn('Cascata mobile de categorias não encontrada');
        return;
    }
    
    categoriesMobileCascadeOpen = !categoriesMobileCascadeOpen;
    
    // Alterna a classe 'active' na cascata
    if (categoriesMobileCascadeOpen) {
        cascade.classList.add('active');
        
        // Carrega as categorias na primeira abertura
        if (!categoriesMobileLoaded) {
            loadCategoriesMobile();
        }
        
        // Adiciona listeners para detectar scroll
        setupScrollDetection();
    } else {
        cascade.classList.remove('active');
        // Remove listeners quando fecha
        removeScrollDetection();
    }
    
    // Rotaciona o ícone double-arrow (desktop)
    if (arrowIcon) {
        arrowIcon.classList.toggle('rotated', categoriesMobileCascadeOpen);
    }
}

/**
 * Configura detecção de scroll para diferenciar de cliques
 */
function setupScrollDetection() {
    const cascade = document.getElementById('categories-mobile-cascade');
    if (!cascade) return;
    
    // Detecta início do toque
    cascade.addEventListener('touchstart', handleTouchStart, { passive: true });
    cascade.addEventListener('touchmove', handleTouchMove, { passive: true });
    cascade.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Também para scroll com mouse
    cascade.addEventListener('mousedown', handleMouseDown, { passive: true });
    cascade.addEventListener('mousemove', handleMouseMove, { passive: true });
    cascade.addEventListener('mouseup', handleMouseUp, { passive: true });
    cascade.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Remove listeners de detecção de scroll
 */
function removeScrollDetection() {
    const cascade = document.getElementById('categories-mobile-cascade');
    if (!cascade) return;
    
    cascade.removeEventListener('touchstart', handleTouchStart);
    cascade.removeEventListener('touchmove', handleTouchMove);
    cascade.removeEventListener('touchend', handleTouchEnd);
    cascade.removeEventListener('mousedown', handleMouseDown);
    cascade.removeEventListener('mousemove', handleMouseMove);
    cascade.removeEventListener('mouseup', handleMouseUp);
    cascade.removeEventListener('scroll', handleScroll);
}

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
    isScrolling = false;
    
    // Limpa timeout anterior
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
}

function handleTouchMove(e) {
    if (!touchStartY && !touchStartX) return;
    
    const touchY = e.touches[0].clientY;
    const touchX = e.touches[0].clientX;
    const deltaY = Math.abs(touchY - touchStartY);
    const deltaX = Math.abs(touchX - touchStartX);
    
    // Se moveu mais de 10px, considera como scroll
    if (deltaY > 10 || deltaX > 10) {
        isScrolling = true;
        document.body.classList.add('is-scrolling-mobile-cascade');
    }
}

function handleTouchEnd(e) {
    // Aguarda um pouco para verificar se foi scroll
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling-mobile-cascade');
    }, 150);
}

function handleMouseDown(e) {
    touchStartY = e.clientY;
    touchStartX = e.clientX;
    isScrolling = false;
}

function handleMouseMove(e) {
    if (!touchStartY && !touchStartX) return;
    
    const deltaY = Math.abs(e.clientY - touchStartY);
    const deltaX = Math.abs(e.clientX - touchStartX);
    
    if (deltaY > 5 || deltaX > 5) {
        isScrolling = true;
        document.body.classList.add('is-scrolling-mobile-cascade');
    }
}

function handleMouseUp(e) {
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling-mobile-cascade');
    }, 150);
}

function handleScroll(e) {
    isScrolling = true;
    document.body.classList.add('is-scrolling-mobile-cascade');
    
    // Limpa timeout anterior
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Remove a classe após parar de scrollar
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling-mobile-cascade');
    }, 200);
}

/**
 * Carrega os itens da navbar na cascata mobile de categorias
 */
function loadCategoriesMobile() {
    const cascadeEl = document.getElementById('categories-mobile-cascade');
    
    if (!cascadeEl) {
        console.error('Container de cascata mobile não encontrado');
        return;
    }
    
    try {
        // Busca o container da navbar com os itens
        const navbarList = document.querySelector('nav#navbar ul');
        
        if (!navbarList) {
            throw new Error('Lista da navbar não encontrada');
        }
        
        // Renderiza os itens da lista em formato mobile
        renderNavbarItemsFromListMobile(navbarList, cascadeEl);
        categoriesMobileLoaded = true;
        
    } catch (error) {
        console.error('Erro ao carregar itens da navbar mobile:', error);
        
        // Exibe mensagem de erro amigável
        cascadeEl.innerHTML = `
            <div class="categories-mobile-empty">
                <span>Não foi possível carregar os itens.</span>
            </div>
        `;
    }
}

/**
 * Renderiza os itens da navbar em formato de cascata para mobile
 */
function renderNavbarItemsFromListMobile(navbarList, container) {
    // Coleta todos os itens <li> de primeiro nível
    const navItems = navbarList.querySelectorAll(':scope > li.group, :scope > li:not(.group)');
    
    if (!navItems || navItems.length === 0) {
        container.innerHTML = `
            <div class="categories-mobile-empty">
                <span>Nenhum item encontrado</span>
            </div>
        `;
        return;
    }
    
    // Cria a lista de itens
    let itemsHTML = '<div class="categories-mobile-list">';
    const processedItems = new Set();
    let categoryIndex = 0;
    
    navItems.forEach(item => {
        // Busca o link principal dentro do item
        const mainLink = item.querySelector(':scope > div > div > a[href], :scope > a[href]');
        
        if (!mainLink) {
            return;
        }
        
        // Pega o texto do link
        let linkText = '';
        const span = mainLink.querySelector('span');
        if (span) {
            linkText = span.textContent?.trim() || '';
        } else {
            linkText = mainLink.textContent?.trim() || '';
        }
        
        const linkHref = mainLink.getAttribute('href') || '#';
        
        // Lista de itens a serem ocultados
        const hiddenItems = ['acadêmicos', 'academicos', 'mais ofertas'];
        const linkTextLower = linkText.toLowerCase().trim();
        const shouldHide = hiddenItems.some(hidden => 
            linkTextLower === hidden.toLowerCase() || 
            linkTextLower.includes(hidden.toLowerCase())
        );
        
        // Ignora itens vazios, o link "Categorias", itens ocultos, ou duplicatas
        if (!linkText || 
            linkText === '' || 
            linkTextLower === 'categorias' || 
            shouldHide ||
            processedItems.has(linkText)) {
            return;
        }
        
        processedItems.add(linkText);
        
        // Verifica se este item tem submenus
        const hasSubmenu = item.classList.contains('group');
        const dropdownMenu = item.querySelector('div[id^="drop-nav-menu-"]');
        
        if (hasSubmenu && dropdownMenu) {
            // Coleta os subitens do dropdown
            const subItems = collectSubItems(dropdownMenu);
            
            // Gera um ID único para a categoria
            const categoryId = `mobile-category-${categoryIndex++}`;
            
            // Cria a estrutura de cascata mobile
            itemsHTML += `
                <div class="categories-mobile-category">
                    <div class="categories-mobile-category-toggle" data-category-id="${categoryId}">
                        <a href="${linkHref}" class="categories-mobile-item-name-link">
                            <span class="categories-mobile-item-name">${linkText}</span>
                        </a>
                        ${subItems.length > 0 ? `
                            <button type="button" 
                                    class="categories-mobile-arrow-button"
                                    onclick="window.toggleCategorySubmenuMobile('${categoryId}', event)" 
                                    aria-expanded="false"
                                    aria-label="Expandir subcategorias"
                                    data-category-id="${categoryId}">
                                <svg class="categories-mobile-arrow" width="16" height="16" viewBox="0 0 256 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
                                    <path d="M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                                </svg>
                            </button>
                        ` : ''}
                    </div>
                    ${subItems.length > 0 ? `
                        <div class="categories-mobile-subcategories" id="${categoryId}-subcategories">
                            ${subItems.map(sub => `
                                <a href="${sub.href}" class="categories-mobile-subitem">
                                    <span class="categories-mobile-item-name">${sub.name}</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            // Item simples sem submenu
            if (linkHref && linkHref !== '#') {
                itemsHTML += `
                    <a href="${linkHref}" class="categories-mobile-item">
                        <span class="categories-mobile-item-name">${linkText}</span>
                    </a>
                `;
            }
        }
    });
    
    itemsHTML += '</div>';
    
    if (processedItems.size === 0) {
        container.innerHTML = `
            <div class="categories-mobile-empty">
                <span>Nenhum item encontrado</span>
            </div>
        `;
    } else {
        container.innerHTML = itemsHTML;
    }
}

/**
 * Fecha todas as categorias mobile expandidas, exceto a especificada
 * @param {string} exceptCategoryId - ID da categoria que não deve ser fechada (opcional)
 */
function closeAllMobileCategories(exceptCategoryId = null) {
    // Encontra todas as subcategorias expandidas
    const allExpandedSubcategories = document.querySelectorAll('.categories-mobile-subcategories-expanded');
    
    allExpandedSubcategories.forEach(subcategory => {
        // Pega o ID da categoria a partir do ID do elemento de subcategorias
        const subcategoryId = subcategory.id;
        if (!subcategoryId) return;
        
        // Extrai o categoryId do ID (formato: "mobile-category-X-subcategories")
        const categoryIdMatch = subcategoryId.match(/^(mobile-category-\d+)-subcategories$/);
        if (!categoryIdMatch) return;
        
        const categoryId = categoryIdMatch[1];
        
        // Pula se for a categoria que não deve ser fechada
        if (exceptCategoryId && categoryId === exceptCategoryId) {
            return;
        }
        
        // Encontra o botão e container relacionados
        const button = document.querySelector(`button.categories-mobile-arrow-button[data-category-id="${categoryId}"]`);
        if (!button) {
            // Tenta encontrar de outras formas
            const container = document.querySelector(`div[data-category-id="${categoryId}"]`);
            if (container) {
                const foundButton = container.querySelector('button.categories-mobile-arrow-button');
                if (foundButton) {
                    closeMobileCategory(categoryId, foundButton, subcategory, container);
                }
            }
            return;
        }
        
        const container = button.closest('.categories-mobile-category-toggle');
        closeMobileCategory(categoryId, button, subcategory, container);
    });
}

/**
 * Fecha uma categoria mobile específica
 * @param {string} categoryId - ID da categoria
 * @param {HTMLElement} button - Botão da categoria
 * @param {HTMLElement} subcategories - Elemento de subcategorias
 * @param {HTMLElement} container - Container da categoria
 */
function closeMobileCategory(categoryId, button, subcategories, container) {
    // Remove classe expandida
    subcategories.classList.remove('categories-mobile-subcategories-expanded');
    button.setAttribute('aria-expanded', 'false');
    
    // Atualiza o ícone para angle-right (fechado)
    const arrow = button.querySelector('.categories-mobile-arrow');
    if (arrow) {
        arrow.setAttribute('viewBox', '0 0 256 512');
        const existingPaths = arrow.querySelectorAll('path');
        existingPaths.forEach(path => path.remove());
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M247.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L179.2 256 41.9 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z');
        arrow.appendChild(path);
    }
    
    // Remove classe ativa do container
    if (container) {
        container.classList.remove('categories-mobile-category-active');
    }
}

/**
 * Alterna a exibição das subcategorias de uma categoria no mobile
 * Garante que apenas uma categoria esteja expandida por vez
 */
window.toggleCategorySubmenuMobile = function(categoryId, event) {
    // Previne ação se estiver scrollando
    if (isScrolling || document.body.classList.contains('is-scrolling-mobile-cascade')) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        return;
    }
    
    if (event) {
        event.stopPropagation();
    }
    
    // Tenta encontrar o botão de várias formas
    let button = document.querySelector(`button.categories-mobile-arrow-button[data-category-id="${categoryId}"]`);
    if (!button) {
        button = document.querySelector(`button.categories-mobile-arrow-button[onclick*="toggleCategorySubmenuMobile('${categoryId}')"]`);
    }
    if (!button) {
        button = document.querySelector(`button.categories-mobile-arrow-button[onclick*='toggleCategorySubmenuMobile("${categoryId}")']`);
    }
    if (!button) {
        const container = document.querySelector(`div[data-category-id="${categoryId}"]`);
        button = container?.querySelector('button.categories-mobile-arrow-button');
    }
    
    const subcategories = document.getElementById(`${categoryId}-subcategories`);
    const arrow = button?.querySelector('.categories-mobile-arrow');
    const container = button?.closest('.categories-mobile-category-toggle');
    
    if (!subcategories) {
        console.warn('Subcategorias mobile não encontrado para:', categoryId);
        return;
    }
    
    if (!button) {
        console.warn('Botão mobile não encontrado para:', categoryId);
        return;
    }
    
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        // Fecha - usa apenas CSS, sem estilos inline
        closeMobileCategory(categoryId, button, subcategories, container);
    } else {
        // Antes de abrir, fecha todas as outras categorias expandidas
        closeAllMobileCategories(categoryId);
        
        // Abre - usa apenas CSS, sem cálculos dinâmicos
        subcategories.classList.add('categories-mobile-subcategories-expanded');
        
        button.setAttribute('aria-expanded', 'true');
        if (arrow) {
            arrow.setAttribute('viewBox', '0 0 384 512');
            const existingPaths = arrow.querySelectorAll('path');
            existingPaths.forEach(path => path.remove());
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z');
            arrow.appendChild(path);
        }
        if (container) {
            container.classList.add('categories-mobile-category-active');
        }
    }
};