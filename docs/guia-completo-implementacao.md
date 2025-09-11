# Guia Completo de Implementação - Fusão de Componentes

## Visão Geral

Este guia detalha o processo de fusão dos componentes desenvolvidos com os templates da Wake Commerce, criando uma implementação unificada que mantém a compatibilidade com o sistema existente enquanto incorpora melhorias de design e funcionalidade.

## Estrutura de Componentes

### 1. Header Unificado

#### Componentes Integrados:
1. **Top Banner** - Mensagem de restrição de produtos
2. **Logo** - Marca da Odonto Master
3. **Barra de Busca** - Com autocomplete e categorias
4. **Área de Contato** - Informações de televendas
5. **Área de Atendimento** - Dropdown com informações
6. **Área de Conta** - Login e minha conta
7. **Carrinho de Compras** - Dropdown com itens
8. **Menu de Navegação** - Menu responsivo com mega menu
9. **Menu Mobile** - Interface para dispositivos móveis

#### Estrutura HTML:
```html
<header class="main-header">
    <!-- Top Banner -->
    <div class="top-banner">
        <div class="container">
            <div class="top-banner__content">
                <div class="top-banner__warning">
                    <strong>ATENÇÃO!</strong> Os produtos desse site são restritos à Dentistas com CRO...
                </div>
                <div class="top-banner__login">
                    <a href="/login/index.html" class="login-link">Olá Visitante, Identifique-se aqui</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Header Area -->
    <div class="header-area">
        <div class="container">
            <div class="header-area__content">
                <!-- Logo -->
                <div class="header-logo">
                    <a href="/pages/home/index.html" class="logo-link">
                        <img src="https://recursos.odontomaster.com.br/i/logo_odonto.png" alt="Odonto Master" class="logo-image">
                    </a>
                </div>

                <!-- Search Bar -->
                <div class="search-bar">
                    <form class="search-form" id="searchForm" autocomplete="off" method="get" action="/busca/index.html">
                        <div class="search-form__wrapper">
                            <input type="text" class="search-form__input" id="searchInput" name="busca" placeholder="Busque aqui..." autocomplete="on">
                            <button type="submit" class="search-form__button" aria-label="Buscar">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <div class="search-autocomplete" id="searchAutocomplete" style="display: none;"></div>
                    </form>
                </div>

                <!-- Header Actions -->
                <section class="header-actions">
                    <!-- Contact Info -->
                    <div class="contact-info">
                        <div class="contact-info__phone">
                            <span class="contact-info__label">TELEVENDAS</span>
                            <strong class="contact-info__number">0800 672 1105</strong>
                            <strong class="contact-info__number">(71) 3173-7300</strong>
                        </div>
                    </div>

                    <!-- Customer Service -->
                    <div class="customer-service">
                        <button class="customer-service__trigger" aria-label="Informações de atendimento">
                            <i class="fas fa-headset"></i>
                        </button>
                        <div class="customer-service__dropdown">
                            <div class="customer-service__section">
                                <strong>Pelos Telefones:</strong>
                                <p>(71) 3173-7300 - Salvador/BA</p>
                                <p>(75) 3322-8498 - Feira de Santana/BA</p>
                                <p>(79) 3085-0710 - Aracaju/SE</p>
                            </div>
                            <div class="customer-service__section">
                                <strong>Pelo WhatsApp:</strong>
                                <p>(71) 9 9401-9924</p>
                            </div>
                            <div class="customer-service__section">
                                <strong>Horário de Atendimento:</strong>
                                <p>Segunda a Sexta das 08:00 às 18:00</p>
                                <p>Sábados 08:00 às 14:00</p>
                            </div>
                        </div>
                    </div>

                    <!-- My Account -->
                    <div class="my-account">
                        <button class="my-account__trigger" aria-label="Minha conta">
                            <i class="fas fa-user"></i>
                            <a class="my-account__link" href="#"></a>
                        </div>

                    <!-- Shopping Cart -->
                    <div class="shopping-cart">
                        <button class="shopping-cart__trigger" aria-label="Carrinho de compras">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="shopping-cart__text">Carrinho</span>
                            <span class="shopping-cart__count">0</span>
                            <span class="shopping-cart__label">Item(s)</span>
                        </button>
                        <div class="shopping-cart__dropdown">
                            <div class="shopping-cart__content">
                                <div class="shopping-cart__empty">
                                    <p>Sua sacola de compras está vazia</p>
                                    <p>Carrinho Vazio</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" aria-label="Abrir menu" id="mobileMenuToggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Navigation Bar -->
    <nav class="main-navigation" id="main-navigation">
        <div class="container">
            <div class="main-navigation__content">
                <!-- Mobile Menu Close -->
                <button class="mobile-menu-close" aria-label="Fechar menu" id="mobileMenuClose">
                    <i class="fas fa-times"></i>
                </button>

                <!-- Navigation Menu -->
                <div class="navigation-menu">
                    <ul class="menu-list">
                        <li class="menu-item menu-item--has-submenu">
                            <a href="#" class="menu-link" id="mega-menu-trigger" aria-haspopup="true" aria-expanded="false">Todas as Categorias</a>
                        </li>
                        <li class="menu-item"><a href="/pages/cirurgia/cirurgia.html" class="menu-link">Cirurgia e Periodontia</a></li>
                        <li class="menu-item"><a href="/categoria/dentistica/index.html" class="menu-link">Dentística</a></li>
                        <li class="menu-item"><a href="/categoria/endodontia/index.html" class="menu-link">Endodontia</a></li>
                        <li class="menu-item"><a href="/categoria/equipamentos/index.html" class="menu-link">Equipamentos</a></li>
                        <li class="menu-item"><a href="/categoria/instrumental/index.html" class="menu-link">Instrumental</a></li>
                        <li class="menu-item"><a href="/categoria/ortodontia/index.html" class="menu-link">Ortodontia</a></li>
                        <li class="menu-item"><a href="/categoria/pecas-de-mao/index.html" class="menu-link">Peças de Mão</a></li>
                        <li class="menu-item"><a href="/categoria/protese/index.html" class="menu-link">Prótese</a></li>
                        <li class="menu-item menu-item--highlighted">
                            <a href="/pages/odontoverse/odontoverse.html" class="menu-link">Estudantes</a>
                        </li>
                    </ul>
                </div>
                
                <div class="submenu-overlay"></div>
                <div class="submenu submenu--mega" id="mega-menu-content" aria-hidden="true">
                    <div class="submenu__header">
                        <h2>Navegue por todas as categorias</h2>
                        <button class="submenu__close" aria-label="Fechar menu">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="submenu__columns">
                        <div class="submenu__column">
                            <a href="/acessorios-e-vestuarios" class="submenu__title-link">
                                <h3 class="submenu__title">Acessórios e Vestuários</h3>
                            </a>
                        </div>
                        <div class="submenu__column">
                            <a href="/anestesico" class="submenu__title-link">
                                <h3 class="submenu__title">Anestésico</h3>
                            </a>
                        </div>
                        <div class="submenu__column">
                            <a href="/biosseguranca" class="submenu__title-link">
                                <h3 class="submenu__title">Biossegurança</h3>
                            </a>
                        </div>
                        <div class="submenu__column">
                            <a href="/brocas" class="submenu__title-link">
                                <h3 class="submenu__title">Brocas</h3>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</header>
```

### 2. Footer Unificado

#### Componentes Integrados:
1. **Newsletter** - Formulário de assinatura
2. **Links Institucionais** - Quem somos, ajuda, etc.
3. **Informações de Contato** - Telefones, WhatsApp, email
4. **Horário de Funcionamento** - Dias e horários
5. **Formas de Pagamento** - Ícones de cartões
6. **Selos de Segurança** - Certificados SSL
7. **Redes Sociais** - Links para redes
8. **Copyright** - Informações legais

#### Estrutura HTML:
```html
<footer class="main-footer">
    <div class="container">
        <!-- Newsletter -->
        <section class="newsletter-section">
            <h3 class="newsletter-title">ASSINE NOSSA NEWSLETTER</h3>
            <p class="newsletter-description">E FIQUE POR DENTRO DAS NOVIDADES</p>
            <form class="newsletter-form" id="newsletterForm">
                <div class="newsletter-form__wrapper">
                    <input type="email" placeholder="Seu e-mail" class="newsletter-form__input" required>
                    <button type="submit" class="newsletter-form__button">Assinar</button>
                </div>
            </form>
        </section>

        <!-- Footer Links -->
        <div class="footer-links">
            <div class="footer-column">
                <h4 class="footer-column__title">INSTITUCIONAL</h4>
                <ul class="footer-column__list">
                    <li><a href="/institucional/quem-somos/index.html" class="footer-link">Quem Somos</a></li>
                    <li><a href="/institucional/estudantes/index.html" class="footer-link">Estudantes</a></li>
                    <li><a href="/institucional/revenda/index.html" class="footer-link">Revenda</a></li>
                    <li><a href="/login/index.html" class="footer-link">Login/Cadastro</a></li>
                    <li><a href="/institucional/trabalhe-conosco/index.html" class="footer-link">Trabalhe Conosco</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4 class="footer-column__title">AJUDA</h4>
                <ul class="footer-column__list">
                    <li><a href="/ajuda/como-comprar/index.html" class="footer-link">Como Comprar</a></li>
                    <li><a href="/ajuda/trocas-devolucoes/index.html" class="footer-link">Trocas e Devoluções</a></li>
                    <li><a href="/ajuda/politica-privacidade/index.html" class="footer-link">Política de Privacidade</a></li>
                    <li><a href="/ajuda/cashback-frete/index.html" class="footer-link">Cashback de Frete</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4 class="footer-column__title">ATENDIMENTO</h4>
                <ul class="footer-column__list">
                    <li><a href="https://api.whatsapp.com/send?phone=5571988670812" class="footer-link">Chat Online</a></li>
                    <li><a href="tel:7131737300" class="footer-link">(71) 3173-7300</a></li>
                    <li><a href="mailto:atendimento@odontomaster.com.br" class="footer-link">atendimento@odontomaster.com.br</a></li>
                </ul>
            </div>

            <div class="footer-column">
                <h4 class="footer-column__title">HORÁRIO DE FUNCIONAMENTO</h4>
                <ul class="footer-column__list">
                    <li>Segunda a Sexta das 08h às 18h</li>
                    <li>Sábados das 08h às 12h</li>
                </ul>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="footer-bottom__section">
                <h4 class="footer-bottom__title">FORMAS DE PAGAMENTO</h4>
                <div class="payment-methods">
                    <i class="fab fa-cc-visa" aria-label="Visa"></i>
                    <i class="fab fa-cc-mastercard" aria-label="Mastercard"></i>
                    <i class="fab fa-cc-amex" aria-label="American Express"></i>
                    <i class="fab fa-pix" aria-label="PIX"></i>
                </div>
            </div>

            <div class="footer-bottom__section">
                <h4 class="footer-bottom__title">SELOS DE SEGURANÇA</h4>
                <div class="security-seals">
                    <i class="fas fa-shield-alt" aria-label="Segurança"></i>
                    <span>Wildcard SSL Certificates</span>
                </div>
            </div>

            <div class="footer-bottom__section">
                <h4 class="footer-bottom__title">REDES SOCIAIS</h4>
                <div class="social-media">
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
        </div>

        <!-- Copyright -->
        <div class="copyright">
            <p>&copy; Todos os direitos reservados - ODM COMERCIO E SERVICOS DE EQUIPAMENTOS E MATERIAIS ODONTOLOGICOS LTDA - CNPJ: 07.030.958/0001-74</p>
            <p>Alameda das Cajazeiras, 430 - Caminho das Árvores - Salvador/BA - CEP: 41.820-470</p>
            <p>Eventuais promoções, descontos e prazos de pagamento expostos aqui são válidos apenas para compras via internet. As fotos, textos e layout aqui veiculados são de propriedade da Loja. É proibida a utilização total ou parcial sem nossa autorização.</p>
        </div>
    </div>
</footer>
```

## Implementação CSS

### 1. Variáveis CSS

```css
:root {
    /* Cores principais */
    --cor-primaria: #002945;
    --cor-primaria-escura: #134a6b;
    --cor-secundaria: #CA69F5;
    --cor-secundaria-clara: #F4E8FF;
    --cor-destaque: #4CAF50;
    --cor-destaque-escura: #45a049;
    
    /* Cores de texto */
    --cor-texto-primaria: #333;
    --cor-texto-secundaria: #666;
    --cor-texto-clara: #999;
    --cor-texto-branca: #fff;
    
    /* Cores de fundo */
    --cor-fundo-primaria: #e8ece9;
    --cor-fundo-secundaria: #f8f9fa;
    --cor-fundo-escura: #2c3e50;
    --cor-fundo-overlay: rgba(0, 0, 0, 0.5);
    
    /* Cores de borda */
    --cor-borda-clara: #e9ecef;
    --cor-borda-media: #ddd;
    --cor-borda-escura: #34495e;
    
    /* Cores de estado */
    --cor-sucesso: #28a745;
    --cor-aviso: #ffc107;
    --cor-erro: #dc3545;
    --cor-info: #17a2b8;
    
    /* Tipografia */
    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    
    /* Espaçamentos */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 3rem;
    --spacing-3xl: 4rem;
    
    /* Bordas e sombras */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    --border-radius-full: 9999px;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    
    /* Transições */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
    --z-loading: 99999;
    
    /* Breakpoints */
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    --breakpoint-2xl: 1400px;
}
```

### 2. Estilos do Header

```css
/* ===== MAIN HEADER ===== */
.main-header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

/* Top Banner */
.top-banner {
    background: var(--cor-fundo-secundaria);
    border-bottom: 1px solid var(--cor-borda-clara);
    padding: 8px 0;
}

.top-banner__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.top-banner__warning {
    color: #007bff;
}

.top-banner__warning strong {
    color: var(--cor-erro);
}

.top-banner__login .login-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.top-banner__login .login-link:hover {
    text-decoration: underline;
}

/* Header Main */
.header-area {
    padding: 15px 0;
}

.header-area__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.logo-image {
    max-height: 60px;
    width: auto;
    transition: transform var(--transition-normal);
}

.logo-image:hover {
    transform: scale(1.05);
}

/* Header Actions */
.header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
}

/* Contact Info */
.contact-info__phone {
    text-align: center;
    color: #787d7f;
}

.contact-info__label {
    display: block;
    font-size: 12px;
    font-weight: 500;
}

.contact-info__number {
    color: #606669;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    display: block;
}

/* Customer Service */
.customer-service {
    position: relative;
}

.customer-service__trigger {
    background: none;
    border: none;
    color: var(--cor-primaria);
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-normal);
}

.customer-service__trigger:hover {
    background-color: var(--cor-fundo-secundaria);
}

.customer-service__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 5px;
    padding: 20px;
    min-width: 280px;
    background: #fff;
    border: 1px solid var(--cor-borda-media);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-dropdown);
    opacity: 1;
    visibility: hidden;
    transform: translateY(-10px);
    pointer-events: none;
}

.customer-service__dropdown.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}

.customer-service__section {
    margin-bottom: 15px;
}

.customer-service__section:last-child {
    margin-bottom: 0;
}

.customer-service__section strong {
    color: var(--cor-primaria);
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
}

.customer-service__section p {
    margin: 4px 0;
    font-size: 13px;
    color: var(--cor-texto-secundaria);
}

/* Shopping Cart */
.shopping-cart {
    position: relative;
}

.my-account__trigger {
    background: none;
    border: none;
    color: var(--cor-primaria);
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-normal);
}

.my-account__trigger:hover {
    background-color: var(--cor-fundo-secundaria);
}

.shopping-cart__trigger {
    background: none;
    border: 1px solid var(--cor-borda-media);
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all var(--transition-normal);
    color: var(--cor-texto-primaria);
    font-size: 14px;
}

.shopping-cart__trigger:hover {
    border-color: var(--cor-primaria);
    background-color: var(--cor-fundo-secundaria);
}

.shopping-cart__count {
    background: var(--cor-primaria);
    color: #fff;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    min-width: 20px;
}

.shopping-cart__dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    min-width: 380px;
    background: #fff;
    border: 1px solid var(--cor-borda-media);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-dropdown);
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    pointer-events: none;
    transition: opacity 0.2 ease , transform 0.2 ease , visibility 0.2 ease;
    box-shadow: var(--shadow-lg);
}

.shopping-cart__dropdown.is-active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
}

.shopping-cart__content {
    padding: 18px 22px 16px 22px;
}

.shopping-cart__empty {
    text-align: center;
    color: var(--cor-texto-secundaria);
}

.shopping-cart__empty p {
    margin: 5px 0;
    font-size: 14px;
}

/* Search Bar */
.search-bar {
    flex: 1;
    max-width: 400px;
    margin: 0 20px 0 50px;
}

.search-form__wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-form__input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    border: 2px solid var(--cor-borda-clara);
    border-radius: var(--border-radius-md);
    font-size: 14px;
    transition: border-color var(--transition-normal);  
}

.search-form__input:focus {
    outline: none;
    border-color: var(--cor-primaria);
}

.search-form__button {
    position: absolute;
    right: 5px;
    background: var(--cor-primaria);
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color var(--transition-normal);
}

.search-form__button:hover {
    background: var(--cor-primaria-escura);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--cor-texto-primaria);
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-normal);
}

.mobile-menu-toggle:hover {
    background-color: var(--cor-fundo-secundaria);
}

/* ===== NAVEGAÇÃO PRINCIPAL ===== */
.main-navigation {
    background: linear-gradient(135deg, var(--cor-primaria) 0%, var(--cor-primaria-escura) 100%);
    position: relative;
    display: flex;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(28, 87, 135, 0.3);
    min-height: 55px;
}

.main-navigation__content {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.menu-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: stretch;
    gap: 0;
    height: 60px;
    justify-content: center;
}

.menu-item {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
}

.menu-link {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
    color: var(--cor-texto-branca);
    text-decoration: none;
    font-weight: 500;
    font-size: 14px;
    transition: all var(--transition-normal);
    white-space: nowrap;
    position: relative;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1;
}

.menu-link:hover {
    color: var(--cor-texto-branca);
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
    transform: none;
    box-shadow: none;
    transition: var(--transition-slow);
}

.menu-link::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #EFEA5A, #9CFFFA);
    transform: translateX(-50%);
    border-radius: 2px 2px 0 0;
    transition: width 0.3 ease-out;
    z-index: 0;
}

.menu-link:hover::before {
    width: calc(100% - 20px);
}

.menu-link:focus {
    outline: none;
}

/* Destaque para Odontoverse */
.menu-item--highlighted {
    margin-left: 8px;
    border-radius: var(--border-radius-md);
    overflow: hidden;
    height: 44px;
    align-self: center;
}

.menu-item--highlighted .menu-link {
    background: linear-gradient(135deg, var(--cor-secundaria) 0%, #A855E8 50%, #8B4BC8 100%);
    color: #fff;
    font-weight: 600;
    border: none;
    border-radius: var(--border-radius-md);
    padding: 0 18px;
    box-shadow: 0 4px 15px rgba(202, 105, 245, 0.4);
}

.menu-item--highlighted .menu-link:hover {
    background: linear-gradient(135deg, #B85AE6 0%, #9745D6 50%, #7A3BB4 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(202, 105, 245, 0.6);
}

.menu-item--highlighted .menu-link::after {
    content: '✨';
    font-size: 12px;
    margin-left: 6px;
    animation: sparkle 2s infinite;
}

@keyframes sparkle {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
}

/* ===== MEGA MENU ===== */
.submenu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
    z-index: 9998;
}

.submenu-overlay.active {
    opacity: 1;
    visibility: visible;
}

.submenu--mega {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.95);
    width: 90%;
    max-width: 1000px;
    max-height: 85vh;
    background: #fff;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
    overflow: hidden;
}

.submenu--mega.submenu--active {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, -50%) scale(1);
}

.submenu__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: var(--cor-primaria);
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
}

.submenu__header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.submenu__close {
    background: none;
    border: none;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-fast);
}

.submenu__close:hover {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.2);
}

.submenu__columns {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    background-color: #f9f9f9;
}

.submenu__column {
    padding: 0 20px;
    position: relative;
}

.submenu__column:last-child {
    border-right: none;
}

.submenu__title-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.submenu__title {
    margin: 0;
    padding: 12px 16px;
    color: (var(--cor-primaria));
    transition: background-color 0.2s ease;
    font-size: 16px;
}

.submenu__title:hover {
    color: var(--cor-primaria);
}

/* Scrollbar personalizada */
.submenu__columns::-webkit-scrollbar {
    width: 4px;
}

.submenu__columns::-webkit-scrollbar-track {
    background: transparent;
}

.submenu__columns::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--cor-primaria), #3434E3);
    border-radius: 2px;
}

.submenu__columns::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, var(--cor-primaria-escura), #2a2ab8);
}
```

### 3. Estilos do Footer

```css
/* ===== MAIN FOOTER ===== */
.main-footer {
    background: var(--cor-fundo-escura);
    color: #fff;
    padding: 60px 0 30px;
    margin-top: 80px;
}

/* Newsletter Section */
.newsletter-section {
    text-align: center;
    margin-bottom: 50px;
    padding-bottom: 40px;
    border-bottom: 1px solid #34495e;
}

.newsletter-title {
    color: #fff;
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: 700;
}

.newsletter-description {
    color: #bdc3c7;
    margin-bottom: 25px;
    font-size: 16px;
}

.newsletter-form__wrapper {
    display: flex;
    justify-content: center;
    gap: 10px;
    max-width: 450px;
    margin: 0 auto;
}

.newsletter-form__input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #34495e;
    border-radius: var(--border-radius-md);
    background: #34495e;
    color: #fff;
    font-size: 14px;
}

.newsletter-form__input::placeholder {
    color: #bdc3c7;
}

.newsletter-form__input:focus {
    outline: none;
    border-color: var(--cor-primaria);
}

.newsletter-form__button {
    background: var(--cor-primaria);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background-color var(--transition-normal);
}

.newsletter-form__button:hover {
    background: var(--cor-primaria-escura);
}

/* Footer Links */
.footer-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 50px;
}

.footer-column__title {
    color: #fff;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    position: relative;
}

.footer-column__title::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: var(--cor-primaria);
    border-radius: 1px;
}

.footer-column__list {
    list-style: none;
}

.footer-column__list li {
    margin-bottom: 10px;
}

.footer-link {
    color: #bdc3c7;
    text-decoration: none;
    font-size: 14px;
    transition: color var(--transition-normal);
}

.footer-link:hover {
    color: #fff;
}

/* Rodapé Bottom */
.footer-bottom {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
    padding: 40px 0;
    border-top: 1px solid #34495e;
    margin-bottom: 30px;
}

.footer-bottom__title {
    color: #fff;
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 600;
}

.payment-methods, .social-media {
    display: flex;
    gap: 15px;
    align-items: center;
}

.payment-methods i, .social-media i {
    font-size: 24px;
    color: #bdc3c7;
    transition: color var(--transition-normal);
}

.social-media a:hover i {
    color: #fff;
}

.security-seals {
    display: flex;
    align-items: center;
    gap: 10px;
}

.security-seals i {
    color: #27ae60;
    font-size: 20px;
}

.security-seals span {
    color: #bdc3c7;
    font-size: 12px;
}

/* Copyright */
.copyright {
    text-align: center;
    padding-top: 30px;
    border-top: 1px solid #34495e;
    color: #bdc3c7;
    font-size: 12px;
    line-height: 1.6;
}

.copyright p {
    margin-bottom: 8px;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 1024px) {
    .header-area__content {
        gap: 15px;
    }
    
    .search-bar {
        max-width: 350px;
        margin: 0 15px;
    }
    
    .submenu--mega {
        min-width: 600px;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
    }
    
    .submenu--mega.submenu--active {
        transform: translateX(-50%) translateY(0);
    }
    
    .submenu__columns {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 992px) {
    .submenu--mega {
        min-width: 500px;
        max-width: 90vw;
    }
    
    .submenu__columns {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .submenu__column {
        padding: 0 15px;
    }
}

@media (max-width: 768px) {
    .container {
        padding: 0 10px;
    }
    
    .top-banner__content {
        flex-direction: column;
        gap: 5px;
        text-align: center;
    }
    
    .header-area__content {
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .header-actions {
        order: 2;
        gap: 15px;
    }
    
    .search-bar {
        order: 3;
        max-width: 100%;
        margin: 10px 0;
    }
    
    .mobile-menu-toggle {
        order: 1;
        display: block;
    }
    
    .main-navigation {
        display: none;
    }
    
    .submenu--mega {
        position: static;
        min-width: 100%;
        max-width: 100%;
        border: none;
        border-radius: 0;
        box-shadow: none;
        background: #f8f9fa;
    }
    
    .submenu__columns {
        grid-template-columns: 1fr;
        gap: 0;
        padding: 10px 0;
    }
    
    .submenu__column {
        border-right: none;
        border-bottom: 1px solid #e6edf2;
        padding: 15px 20px;
    }
    
    .submenu__column:last-child {
        border-bottom: none;
    }
    
    .footer-links {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .footer-bottom {
        grid-template-columns: 1fr;
        gap: 25px;
    }
    
    .newsletter-form__wrapper {
        flex-direction: column;
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .header-actions {
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .contact-info__number {
        font-size: 14px;
    }
    
    .newsletter-title {
        font-size: 24px;
    }
    
    .submenu--mega {
        max-height: 60vh;
    }
    
    .submenu__columns {
        max-height: 50vh;
    }
}
```

## Implementação JavaScript

### 1. Header Functions

```javascript
// Função para inicializar o header
function initHeader() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mainNavigation = document.getElementById('main-navigation');
    
    if (mobileMenuToggle && mobileMenuClose && mainNavigation) {
        mobileMenuToggle.addEventListener('click', function() {
            document.body.classList.add('nav-open');
            mainNavigation.setAttribute('aria-hidden', 'false');
        });
        
        mobileMenuClose.addEventListener('click', function() {
            document.body.classList.remove('nav-open');
            mainNavigation.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Mega menu
    const megaMenuTrigger = document.getElementById('mega-menu-trigger');
    const megaMenuContent = document.getElementById('mega-menu-content');
    const submenuOverlay = document.querySelector('.submenu-overlay');
    const megaMenuClose = document.querySelector('.submenu__close');
    
    if (megaMenuTrigger && megaMenuContent && submenuOverlay) {
        megaMenuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            megaMenuContent.classList.add('submenu--active');
            submenuOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
        
        megaMenuClose.addEventListener('click', function() {
            megaMenuContent.classList.remove('submenu--active');
            submenuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
        
        submenuOverlay.addEventListener('click', function() {
            megaMenuContent.classList.remove('submenu--active');
            submenuOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Customer service dropdown
    const customerServiceTrigger = document.querySelector('.customer-service__trigger');
    const customerServiceDropdown = document.querySelector('.customer-service__dropdown');
    
    if (customerServiceTrigger && customerServiceDropdown) {
        customerServiceTrigger.addEventListener('click', function() {
            customerServiceDropdown.classList.toggle('is-active');
        });
        
        document.addEventListener('click', function(e) {
            if (!customerServiceTrigger.contains(e.target) && !customerServiceDropdown.contains(e.target)) {
                customerServiceDropdown.classList.remove('is-active');
            }
        });
    }
    
    // Shopping cart dropdown
    const shoppingCartTrigger = document.querySelector('.shopping-cart__trigger');
    const shoppingCartDropdown = document.querySelector('.shopping-cart__dropdown');
    
    if (shoppingCartTrigger && shoppingCartDropdown) {
        shoppingCartTrigger.addEventListener('click', function() {
            shoppingCartDropdown.classList.toggle('is-active');
        });
        
        document.addEventListener('click', function(e) {
            if (!shoppingCartTrigger.contains(e.target) && !shoppingCartDropdown.contains(e.target)) {
                shoppingCartDropdown.classList.remove('is-active');
            }
        });
    }
    
    // Search autocomplete (simplified example)
    const searchInput = document.getElementById('searchInput');
    const searchAutocomplete = document.getElementById('searchAutocomplete');
    
    if (searchInput && searchAutocomplete) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length >= 2) {
                // Simulação de sugestões de busca
                const suggestions = [
                    'Clareador dental',
                    'Brocas odontológicas',
                    'Cimentos dentários',
                    'Anestésico local',
                    'Equipamentos odontológicos'
                ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
                
                if (suggestions.length > 0) {
                    searchAutocomplete.innerHTML = suggestions.map(suggestion => `
                        <div class="search-suggestion" onclick="selectSuggestion('${suggestion}')">
                            <i class="fas fa-search"></i>
                            <span>${suggestion}</span>
                        </div>
                    `).join('');
                    searchAutocomplete.style.display = 'block';
                } else {
                    searchAutocomplete.style.display = 'none';
                }
            } else {
                searchAutocomplete.style.display = 'none';
            }
        });
        
        // Fechar autocomplete ao clicar fora
        document.addEventListener('click', function(e) {
            if (!searchAutocomplete.contains(e.target) && !searchInput.contains(e.target)) {
                searchAutocomplete.style.display = 'none';
            }
        });
    }
}

// Função para selecionar sugestão de busca
function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('searchInput');
    const searchAutocomplete = document.getElementById('searchAutocomplete');
    
    if (searchInput) {
        searchInput.value = suggestion;
        searchAutocomplete.style.display = 'none';
        // Submeter formulário de busca
        document.getElementById('searchForm').submit();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
});
```

### 2. Footer Functions

```javascript
// Função para newsletter
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Aqui você pode adicionar a lógica para enviar o email
                alert('Obrigado por assinar nossa newsletter!');
                this.reset();
            }
        });
    }
});
```

## Considerações de Compatibilidade

### 1. Manter Elementos da Wake

Para manter a compatibilidade com funcionalidades específicas da Wake Commerce, é importante manter certos elementos:

```html
<!-- Manter elementos da Wake para funcionalidades específicas -->
<div class="header-container type4 header-newskin">
    <!-- Elementos da Wake que precisam ser mantidos -->
    @FBITSLogin.Add()
    @FBITSMinhaConta.Add()
    @FBITSCarrinho.Add()
    @FBITSSearch.Add()
</div>

<div class="footer-container">
    <!-- Elementos do footer da Wake -->
    @FBITSRodape.Add()
</div>
```

### 2. IDs e Classes Importantes

Preservar IDs e classes que são referenciados por scripts da Wake:

- `#searchFormHeader`
- `#txtBuscaPrincipal`
- `#cat`
- `.minicart-qtde-itens`
- `.cart-qty`
- `.mybag-link`

## Testes Necessários

### 1. Funcionalidade

- [ ] Verificar funcionamento do menu mobile
- [ ] Testar dropdowns de carrinho e atendimento
- [ ] Validar funcionamento da barra de busca
- [ ] Confirmar navegação do mega menu
- [ ] Testar formulário de newsletter

### 2. Compatibilidade

- [ ] Testar em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Verificar responsividade em dispositivos móveis
- [ ] Validar integração com funcionalidades da Wake
- [ ] Confirmar funcionamento do carrinho de compras

### 3. Performance

- [ ] Medir tempo de carregamento da página
- [ ] Verificar renderização em dispositivos de baixo desempenho
- [ ] Otimizar imagens e recursos

## Próximos Passos

1. **Implementar o header unificado** nos templates da Wake
2. **Implementar o footer unificado** nos templates da Wake
3. **Testar funcionalidades** em ambiente de desenvolvimento
4. **Validar compatibilidade** com funcionalidades existentes
5. **Otimizar performance** e corrigir eventuais problemas
6. **Documentar alterações** para futuras manutenções

## Manutenção

### Atualizações Futuras

1. Monitorar compatibilidade com atualizações da Wake Commerce
2. Manter componentes compartilhados atualizados
3. Documentar alterações e melhorias implementadas
4. Realizar testes regulares de funcionalidade

### Troubleshooting

1. Em caso de problemas com funcionalidades da Wake, verificar se os elementos necessários foram mantidos
2. Para problemas de estilo, verificar conflitos entre CSS da Wake e nosso CSS
3. Para problemas de JavaScript, verificar inicialização correta dos componentes