<style>

/* ===== CONTROLE DOS BANNERS DO TOPO ===== */
/* Banner Mobile Topo e Banner Topo - Controle de tamanho */
section.fbits-section-home.fbits-banner-mobiletopo-home,
section.fbits-section-home.fbits-banner-topo-home {
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    max-width: 100%;
    background: transparent;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item {
    padding: 0;
}

section.fbits-section-home.fbits-banner-mobiletopo-home img,
section.fbits-section-home.fbits-banner-topo-home img {
    max-width: 250px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    display: block;
    object-fit: contain;
    border-radius: 12px;
}

@@media (max-width: 1280px) {
    section.fbits-section-home.fbits-banner-mobiletopo-home img,
    section.fbits-section-home.fbits-banner-topo-home img {
        max-width: 200px;
    }
}

@@media (max-width: 768px) {
    section.fbits-section-home.fbits-banner-mobiletopo-home,
    section.fbits-section-home.fbits-banner-topo-home {
        margin: 0;
        padding: 0;
        overflow: hidden !important;
        background: transparent !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .row,
    section.fbits-section-home.fbits-banner-topo-home .row {
        overflow: hidden !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
    section.fbits-section-home.fbits-banner-topo-home .slick-list {
        overflow: hidden !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home img,
    section.fbits-section-home.fbits-banner-topo-home img {
        max-width: 150px;
    }
}

@@media (max-width: 480px) {
    section.fbits-section-home.fbits-banner-mobiletopo-home,
    section.fbits-section-home.fbits-banner-topo-home {
        margin: 0;
        padding: 0;
        overflow: hidden !important;
        background: transparent !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .row,
    section.fbits-section-home.fbits-banner-topo-home .row {
        overflow: hidden !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
    section.fbits-section-home.fbits-banner-topo-home .slick-list {
        overflow: hidden !important;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home img,
    section.fbits-section-home.fbits-banner-topo-home img {
        max-width: 120px;
    }
}

/* ===== EFEITOS HOVER BANNER TOPO - PREMIUM ===== */
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
section.fbits-section-home.fbits-banner-topo-home .slick-list {
    margin: 0 auto;
    padding: 10px 0 !important;
    max-width: 100%;
    overflow: hidden;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .slick-track,
section.fbits-section-home.fbits-banner-topo-home .slick-track {
    display: flex !important;
    justify-content: center;
    align-items: center;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide,
section.fbits-section-home.fbits-banner-topo-home .slick-slide {
    padding: 0 5px;
    outline: none;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .row,
section.fbits-section-home.fbits-banner-topo-home .row {
    max-width: 100%;
    overflow: hidden;
    margin: 0 auto;
    text-align: center;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .row-fbits-banner-topo,
section.fbits-section-home.fbits-banner-topo-home .row-fbits-banner-topo {
    display: flex;
    justify-content: center;
    align-items: center;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item {
    position: relative;
    overflow: hidden;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    cursor: pointer;
    margin: 0 auto;
    max-width: 100%;
    height: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                border-radius 0.3s ease;
    will-change: transform;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item img,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item img {
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    /* Transição refinada para zoom */
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, filter;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item::before,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 1;
    pointer-events: none;
}


section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover {
    transform: translateY(-10px) scale(1.03);
    border-radius: 8px;
    box-shadow: none;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover::before,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover::before {
    opacity: 1;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover img,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover img {
    transform: scale(1.1);
    filter: brightness(1.06) contrast(1.02);
}


section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:active,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:active {
    transform: translateY(-7px) scale(1.015);
    transition-duration: 0.15s;
}

/* Animação de entrada dos banners */
section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item {
    animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
}

section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide:nth-child(1) .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .slick-slide:nth-child(1) .fbits-banner-item { 
    animation-delay: 0.1s; 
}
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide:nth-child(2) .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .slick-slide:nth-child(2) .fbits-banner-item { 
    animation-delay: 0.2s; 
}
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide:nth-child(3) .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .slick-slide:nth-child(3) .fbits-banner-item { 
    animation-delay: 0.3s; 
}
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide:nth-child(4) .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .slick-slide:nth-child(4) .fbits-banner-item { 
    animation-delay: 0.4s; 
}
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide:nth-child(5) .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .slick-slide:nth-child(5) .fbits-banner-item { 
    animation-delay: 0.5s; 
}

/* Responsivo - Mobile/Tablet */
@@media (max-width: 1024px) {
    section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item,
    section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item {
        cursor: default;
        box-shadow: none;
        transition: none;
        will-change: auto;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover,
    section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover {
        transform: none;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover::before,
    section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover::before {
        opacity: 0;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:hover img,
    section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:hover img {
        transform: none;
        filter: none;
    }
    
    section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
    section.fbits-section-home.fbits-banner-topo-home .slick-list {
        padding: 5px 0 !important;
    }
}
/* ===== FIM EFEITOS HOVER BANNER TOPO ===== */

/* ===== BANNER CENTRO RESPONSIVO ===== */
/* Controle de visibilidade Desktop/Mobile via CSS */
section.fbits-banner-centro-home.bdesk {
    display: block;
}

section.fbits-banner-centro-home.bmob {
    display: none;
}

section.fbits-banner-centro-home {
    margin: 0;
    padding: 0;
    width: 100%;
    background: transparent;
}

section.fbits-banner-centro-home .row-fbits-banner-centro {
    margin: 0;
}

section.fbits-banner-centro-home .fbits-banner-item {
    width: 100%;
    max-width: 100%;
}

section.fbits-banner-centro-home .fbits-banner-item img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
}

/* Mobile - Banner Centro Full Width (Ocupa Todo Espaço) */
@@media (max-width: 990px) {
    /* Esconde desktop, mostra mobile */
    section.fbits-banner-centro-home.bdesk {
        display: none !important;
    }
    
    section.fbits-banner-centro-home.bmob {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100vw !important;
    position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw !important;
        margin-right: -50vw !important;
    }
    
    /* Container sem padding lateral */
    section.fbits-banner-centro-home.bmob .container {
        padding-left: 0 !important;
        padding-right: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
    }
    
    section.fbits-banner-centro-home.bmob .row-fbits-banner-centro {
        margin: 0 !important;
        width: 100% !important;
    }
    
    section.fbits-banner-centro-home.bmob .col-md-12 {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
    }
    
    section.fbits-banner-centro-home.bmob .fbits-banner-item {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
    }
    
    /* Imagem responsiva - altura automática para manter proporção */
    section.fbits-banner-centro-home.bmob .fbits-banner-item img {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
        object-fit: contain !important;
    }
    
    /* Slick Carousel - altura automática */
    section.fbits-banner-centro-home.bmob .slick-list {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
    }
    
    section.fbits-banner-centro-home.bmob .slick-track {
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
    }
    
    section.fbits-banner-centro-home.bmob .slick-slide {
        padding: 0 !important;
        margin: 0 !important;
        float: none !important;
        display: flex !important;
    }
    
    section.fbits-banner-centro-home.bmob .slick-slide > div {
        width: 100% !important;
    }
}
/* ===== FIM BANNER CENTRO RESPONSIVO ===== */

/* ===== BANNER MEIO RESPONSIVO (DESKTOP/MOBILE) ===== */
section.fbits-banner-meio-home.bdesk {
    display: block;
}

section.fbits-banner-meio-home.bmob {
    display: none;
}

@@media (max-width: 990px) {
    section.fbits-banner-meio-home.bdesk {
        display: none !important;
    }
    
    section.fbits-banner-meio-home.bmob {
        display: block !important;
        margin: 2em 0 !important;
        padding: 0 !important;
    }
    
    /* Banner Meio Mobile - Dimensões 1100x225 */
    section.fbits-banner-meio-home.bmob .row-fbits-banner-meio {
        margin: 0 !important;
    }
    
    section.fbits-banner-meio-home.bmob .col-md-12 {
        padding: 0 !important;
    }
    
    section.fbits-banner-meio-home.bmob .fbits-banner-item {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    section.fbits-banner-meio-home.bmob .fbits-banner-item img {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1100 / 225 !important; /* Proporção 1100x225 */
        object-fit: cover !important;
        display: block !important;
    }
}

/* Mobile Pequeno - Mantém proporção */
@@media (max-width: 768px) {
    section.fbits-banner-meio-home.bmob .fbits-banner-item img {
        aspect-ratio: 1100 / 225 !important;
        object-fit: cover !important;
    }
}

/* Mobile - Aproxima seções do banner-meio para harmonia visual */
@@media (max-width: 990px) {
    /* Reduz margem inferior do banner-meio mobile */
    section.fbits-banner-meio-home.bmob {
        margin: 2em 0 1em 0 !important;
    }
    
    /* Reduz margem superior das vitrines após o banner-meio */
    section.fbits-banner-meio-home.bmob + section.fbits-vitrine-home h3.title.big,
    section.fbits-banner-meio-home.bmob ~ section.fbits-vitrine-home h3.title.big {
        margin-top: 1.5em !important;
    }
    
    /* Reduz margem superior de ofertas por departamento após banner-meio */
    section.fbits-banner-meio-home.bmob + section.fbits-ofertas-departamento h3.title.big,
    section.fbits-banner-meio-home.bmob ~ section.fbits-ofertas-departamento h3.title.big {
        margin-top: 1.5em !important;
    }
}

@@media (max-width: 768px) {
    /* Margem ainda menor em telas pequenas */
    section.fbits-banner-meio-home.bmob {
        margin: 1.5em 0 0.5em 0 !important;
    }
    
    section.fbits-banner-meio-home.bmob + section.fbits-vitrine-home h3.title.big,
    section.fbits-banner-meio-home.bmob ~ section.fbits-vitrine-home h3.title.big,
    section.fbits-banner-meio-home.bmob + section.fbits-ofertas-departamento h3.title.big,
    section.fbits-banner-meio-home.bmob ~ section.fbits-ofertas-departamento h3.title.big {
        margin-top: 1em !important;
    }
}
/* ===== FIM BANNER MEIO RESPONSIVO ===== */

/* ===== VITRINE COM BANNER RESPONSIVO (DESKTOP/MOBILE) ===== */
/* IMPORTANTE: Banner lateral SEMPRE visível no desktop */
section.fbits-vitrine-com-banner.bdesk {
    display: block !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 25% !important;
    float: left !important;
}

section.fbits-vitrine-com-banner.bmob {
    display: none !important;
}

@@media (max-width: 990px) {
    section.fbits-vitrine-com-banner.bdesk {
        display: none !important;
    }
    
    section.fbits-vitrine-com-banner.bmob {
        display: block !important;
    }
    
    /* Banner Lateral Mobile - Dimensões 1100x225 */
    section.fbits-vitrine-com-banner.bmob .col-banner-ofertas {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        margin-bottom: 2em !important;
        padding: 0 !important;
    }
    
    section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
    }
    
    section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item:first-child {
        display: block !important;
    }
    
    section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item img {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 1100 / 225 !important; /* Proporção 1100x225 */
        object-fit: cover !important;
        display: block !important;
        border-radius: 0 !important;
    }
    
    /* Carrossel abaixo do banner */
    section.fbits-vitrine-com-banner.bmob .col-carrossel-ofertas {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        padding: 0 !important;
    }
}

/* Mobile Pequeno - Mantém proporção */
@@media (max-width: 768px) {
    section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item img {
        aspect-ratio: 1100 / 225 !important;
        object-fit: cover !important;
    }
}
/* ===== FIM VITRINE COM BANNER RESPONSIVO ===== */

/* ===== BANNER RODAPÉ  ===== */


section.fbits-banner-rodape {
    padding: 2em 0;
}

section.fbits-banner-rodape .slick-list {
    margin: 0 -10px;
    padding: 20px 0 !important;
}

section.fbits-banner-rodape .slick-slide {
    padding: 0 10px;
    outline: none;
}

section.fbits-banner-rodape .fbits-banner-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    margin: 0 auto;
    max-width: 100%;
    height: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                border-radius 0.3s ease;
    will-change: transform, box-shadow;
}

section.fbits-banner-rodape .fbits-banner-item img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;
    /* Transição refinada para zoom */
    transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform, filter;
}

section.fbits-banner-rodape .fbits-banner-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
        rgba(29, 101, 186, 0.06) 0%, 
        rgba(29, 101, 186, 0.02) 50%,
        rgba(29, 101, 186, 0.04) 100%);
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 1;
    pointer-events: none;
}

/* Hover - Animação fluida e elástica */
section.fbits-banner-rodape .fbits-banner-item:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16), 
                0 6px 18px rgba(29, 101, 186, 0.15);
    border-radius: 16px;
}

section.fbits-banner-rodape .fbits-banner-item:hover::before {
    opacity: 1;
}

section.fbits-banner-rodape .fbits-banner-item:hover img {
    transform: scale(1.1);
    filter: brightness(1.06) contrast(1.02);
}

/* Feedback ao clicar - bounce suave */
section.fbits-banner-rodape .fbits-banner-item:active {
    transform: translateY(-7px) scale(1.015);
    transition-duration: 0.15s;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14);
}

/* Animação de entrada dos banners */
section.fbits-banner-rodape .fbits-banner-item {
    animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 0;
}

@@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

section.fbits-banner-rodape .slick-slide:nth-child(1) .fbits-banner-item { animation-delay: 0.1s; }
section.fbits-banner-rodape .slick-slide:nth-child(2) .fbits-banner-item { animation-delay: 0.2s; }
section.fbits-banner-rodape .slick-slide:nth-child(3) .fbits-banner-item { animation-delay: 0.3s; }
section.fbits-banner-rodape .slick-slide:nth-child(4) .fbits-banner-item { animation-delay: 0.4s; }

/* Responsivo - Mobile/Tablet */
@@media (max-width: 1024px) {
    section.fbits-banner-rodape .fbits-banner-item {
        cursor: default;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        transition: none;
        will-change: auto;
    }
    
    section.fbits-banner-rodape .fbits-banner-item:hover {
        transform: none;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        border-radius: 12px;
    }
    
    section.fbits-banner-rodape .fbits-banner-item:hover::before {
        opacity: 0;
    }
    
    section.fbits-banner-rodape .fbits-banner-item:hover img {
        transform: none;
        filter: none;
    }
    
    section.fbits-banner-rodape .slick-list {
        padding: 10px 0 !important;
    }
}
/* ===== FIM BANNER RODAPÉ - REFINADO ===== */

h3.title.big {
    color: #000;
    margin-top: 3em;
    margin-bottom: 1.3em;
    text-transform: uppercase;
    border-bottom: 3px solid #1d70ba;
}

ul,li {
    list-style: none;
}

section.fbits-section-home.fbits-vitrine-home {
    padding-bottom: 4em;
}
section.fbits-section-home.fbits-ofertas-departamento {
    margin-bottom: 5em;
}
section.fbits-section-home.fbits-banner-meio-home {
    margin: 4em 0;
    padding: 2em 0;
}
section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item {
    text-align: center;
    width: 100%;
    max-width: 100%;
}
section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item img {
    width: 100%;
    height: auto;
    max-width: 100%;
    display: block;
    margin: 0 auto;
}

/* Melhores Ofertas com Banner Lateral - DESKTOP */
section.fbits-vitrine-com-banner.bdesk {
    display: block !important;
}

section.fbits-vitrine-com-banner.bdesk .row-vitrine-home {
    display: block !important;
    overflow: hidden;
    clear: both;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas {
    float: left !important;
    width: 25% !important;
    padding-right: 15px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    min-height: 1px !important;
    position: relative !important;
}

section.fbits-vitrine-com-banner.bdesk .col-carrossel-ofertas {
    float: left !important;
    width: 75% !important;
    padding-left: 15px !important;
    display: block !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item {
    background: #fff !important;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: 100% !important;
    height: auto !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item:first-child {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item img {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* Clearfix para garantir layout correto */
section.fbits-vitrine-com-banner.bdesk .row-vitrine-home:after {
    content: "";
    display: table;
    clear: both;
}

/* Força display no desktop - sobrescreve qualquer regra Bootstrap */
@@media (min-width: 991px) {
    section.fbits-vitrine-com-banner.bdesk .col-md-3.col-banner-ofertas {
        float: left !important;
        width: 25% !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
    }
    
    section.fbits-vitrine-com-banner.bdesk .col-md-9.col-carrossel-ofertas {
        float: left !important;
        width: 75% !important;
        display: block !important;
    }
    
    /* Garante que elementos dentro do banner lateral sejam visíveis */
    section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas * {
        visibility: visible !important;
    }
    
    section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas > * {
        display: block !important;
    }
}

.product-name {
    margin: 10px 0;
    font-size: 1.1em;
    font-weight: 600;
    letter-spacing: -0.8px;
    color: #000;
    margin: 0 0 3px;
    min-height: 2.9em;
    max-height: 2.9em;
    overflow: hidden;
    text-align: center;
}
.spotPreco {
    height: 70px;
    text-align: center;
}
.item .details-area .actions {
    text-align: center;
}


    @@media (min-width:1300px){
       
        .spot {
            padding-left: 1em;
            padding-right: 1em;
        }
        section.fbits-section-home.fbits-banner-topo-home img {
            max-width: 97%;
            margin: 0 auto;
        }
         section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:first-child img {
            margin: 0;
        }
         section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item:last-child img {
            margin: 0;
            float:right;
        }
        
        section.fbits-section-home.fbits-banner-rodape img {
            max-width: 97%;
            margin: 0 auto;
        }
         section.fbits-section-home.fbits-banner-rodape .fbits-banner-item:first-child img {
            margin: 0;
        }
         section.fbits-section-home.fbits-banner-rodape .fbits-banner-item:last-child img {
            margin: 0;
            float:right;
         }
        section.fbits-section-home.fbits-banner-mobiletopo-home img {
            max-width: 250px;
            height: auto;
            margin: 0 auto;
            display: block;
        }
         section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:first-child img {
            margin: 0;
        }
         section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item:last-child img {
            margin: 0;
            float:right;
        }
        
        section.fbits-section-home.fbits-banner-meio-home {
            margin: 3em 0;
            padding: 1em 0;
        }
        section.fbits-section-home.fbits-banner-meio-home .row-fbits-banner-meio {
            margin: 0;
        }
        section.fbits-section-home.fbits-banner-meio-home img {
            max-width: 100%;
            width: 100%;
            height: auto;
            margin: 0 auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item {
            padding: 0;
            margin: 0;
        }
        section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item img {
            margin: 0 auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
    }
    
    
    @@media (max-width:1023px){
        section.fbits-section-home.fbits-banner-centro-home img {
            margin: 0 auto!important;
        }
        body .fbits-banner-rodape img {
            max-width: 100%;
        }
        section.fbits-section-home.fbits-banner-meio-home img {
            max-width: 100%!important;
            width: 100%!important;
            height: auto!important;
            margin: 0 auto!important;
            border-radius: 6px;
        }
        section.fbits-section-home.fbits-banner-meio-home {
            margin: 2em 0;
            padding: 1em 0;
        }
        
        /* Melhores Ofertas com Banner - Mobile Horizontal (igual banner-meio) */
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas,
        section.fbits-vitrine-com-banner.bmob .col-carrossel-ofertas {
            width: 100%;
            max-width: 100%;
            float: none;
            padding: 0 !important;
        }
        
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas {
            margin-bottom: 2em;
            padding: 0 !important;
        }
        
        /* Banner horizontal em mobile (como banner-meio) */
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item {
            border-radius: 6px !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
        }
        
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            border-radius: 6px !important;
            object-fit: cover !important;
        }
    }
    
    @@media (max-width:1600px){
        .row.row-fbits-banner-topo >div {
            padding: 0;
        }
        .fbits-banner-rodape {
            margin-bottom: 5px;
            display: block;
            float: none;
        }
        section.fbits-section-home.fbits-banner-rodape {
            /* display: none!important; */
            width: 100%;
        }
        section.fbits-section-home.fbits-banner-topo-home img {
            max-width: 250px;
            height: auto;
            margin: 0 auto;
            display: block;
        }
        body .fbits-banner-rodape img {
            float: none;
            display: block!important;
            margin: 0 auto;
        }
        section.fbits-section-home.fbits-banner-meio-home img {
            max-width: 100%;
            width: 100%;
            height: auto;
            float: none;
            display: block!important;
            margin: 0 auto;
            border-radius: 4px;
        }
        section.fbits-section-home.fbits-banner-meio-home {
            margin: 1.5em 0;
            padding: 0.5em 0;
        }
        .row.row-fbits-banner-meio >div {
            padding: 0 10px;
        }
        
        /* Melhores Ofertas com Banner - Ajustes Responsivos Desktop */
        section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas {
            padding-right: 15px !important;
        }
        
        section.fbits-vitrine-com-banner.bdesk .col-carrossel-ofertas {
            padding-left: 15px !important;
        }
    }
    
    /* Mobile Extra - Banner Ofertas Horizontal Otimizado */
    @@media (max-width: 768px) {
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas {
            margin-bottom: 1.5em;
        }
        
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item {
            border-radius: 4px !important;
        }
        
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item img {
            border-radius: 4px !important;
        }
    }
    
    @@media (max-width: 480px) {
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas {
            margin-bottom: 1em;
        }
        
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item,
        section.fbits-vitrine-com-banner.bmob .col-banner-ofertas .fbits-banner-item img {
            border-radius: 0 !important;
        }
    }
    
/* Remove background cinza dos containers */
.main-container.col1-layout {
    background: #fff !important;
    padding: 0 !important;
}

.main-container .main.container {
    background: #fff !important;
    padding: 0 !important;
}

.main-container .col-main {
    background: #fff !important;
    padding: 0 !important;
}

/* Remove espaços cinzas em mobile e corrige faixa branca lateral */
@@media (max-width: 990px) {
    /* Reset completo HTML/Body - Apenas overflow-x no body */
    html {
        width: 100%;
        max-width: 100%;
    }
    
    body {
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden;
        width: 100%;
        max-width: 100%;
        position: relative;
        background: #fff !important;
    }
    
    /* Containers principais - Full Width SEM overflow-x */
    .main-container.col1-layout,
    .main-container .main.container,
    .main-container .col-main {
        background: #fff !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove padding dos containers Bootstrap */
    .container,
    .main.container {
        padding-left: 0 !important;
        padding-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove margens negativas das rows */
    .row,
    .row-fbits-banner-topo,
    .row-fbits-banner-centro,
    .row-fbits-banner-meio,
    .row-fbits-banner-rodape,
    .row-vitrine-home,
    .row-ofertas-departamento {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove padding das colunas */
    .col-md-12,
    .col-sm-12,
    [class*="col-"] {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    /* Width 100% APENAS para colunas que não são do banner lateral desktop */
    .col-md-12,
    .col-sm-12 {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Seções ocupam 100% SEM overflow-x (só no body) */
    section.fbits-section-home {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    /* Corrige margin negativa do slick-list que causa overflow */
    section.fbits-banner-rodape .slick-list {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    
    section.fbits-banner-rodape .slick-slide {
        padding: 0 5px !important;
    }
    
    /* Adiciona padding mínimo apenas nos carrosséis de produtos para respiração */
    section.fbits-vitrine-home .slick-list,
    section.fbits-ofertas-departamento .slick-list {
        padding-left: 5px !important;
        padding-right: 5px !important;
    }
    
    /* Títulos com padding interno para não colar na borda */
    h3.title.big {
        padding-left: 15px !important;
        padding-right: 15px !important;
    }
    
    /* Garante que o line (título com barra) não cause overflow */
    .line {
        padding-left: 15px !important;
        padding-right: 15px !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
}
    
</style>
 <div class="main-container col1-layout">
        <div class="main container">
            <div class="col-main">
    
    <!--BANNER TOPO-->
    <section class="fbits-section-home fbits-banner-topo-home">
        <div class="row row-fbits-banner-topo">
                            <div class="col-md-12">
                <FBITS:Banner filtroPosicao="mobiletopo" idsBanners="" tipo="carrossel"  configuracaoCarrossel="{
                
                  infinite: true,
                  speed: '300',
                  autoplay: true,
                  slidesToShow: 5,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 440,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="" />
                          </div> 
                        </div>
    </section>  
                </div>
            </div>   
            
    <!--BANNER CENTRO DESKTOP-->
    <section class="fbits-section-home fbits-banner-centro-home bdesk">
        <div class="container">
            <div class="row row-fbits-banner-centro">
                            <div class="col-md-12">
                    <FBITS:Banner filtroPosicao="centro" idsBanners="" tipo="carrossel" configuracaoCarrossel="{
                        dots: true,
                        fade: true,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        arrows: true,
                        infinite: true,
                        speed: 500
                    }" classeItens="" />
                            </div>
                          </div> 
                        </div>
    </section>
    
    <!--BANNER CENTRO MOBILE (mesma posição "centro")-->
    <section class="fbits-section-home fbits-banner-centro-home bmob">
        <div class="container">
            <div class="row row-fbits-banner-centro">
                <div class="col-md-12">
                    <FBITS:Banner filtroPosicao="mobile centro" idsBanners="" tipo="carrossel" configuracaoCarrossel="{
                        dots: true,
                        fade: false,
                        autoplay: true,
                        autoplaySpeed: 3000,
                        arrows: false,
                        infinite: true,
                        speed: 500
                    }" classeItens="" />
                </div>
            </div>   
        </div>
    </section>
    
    <!--MELHORES OFERTAS COM BANNER LATERAL DESKTOP-->
    <section class="fbits-section-home fbits-vitrine-home fbits-vitrine-com-banner bdesk">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big"> melhores ofertas</h3>
                    <span></span>
                          </div> 
                        </div>
                </div>
        <div class="row row-vitrine-home">
            <!-- Banner Vertical Desktop -->
            <div class="col-md-3 col-sm-12 col-banner-ofertas">
                <FBITS:Banner filtroPosicao="Lateral Direita" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-ofertas-lateral" />
            </div>   
            
            <!-- Carrossel de Produtos -->
            <div class="col-md-9 col-sm-12 col-carrossel-ofertas">
                <FBITS:ListaSpots idsHotsites="117326" tipo="carrossel" configuracaoCarrossel="{
                    dots: false,
                    infinite: true,
                    speed: '300',
                    autoplay: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    responsive: [
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 990,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1
                            }
                        }
                    ]
                }" classeItens="componente-vitrine" />
            </div>
        </div>
    </section>
    
    <!--MELHORES OFERTAS COM BANNER LATERAL MOBILE-->
    <section class="fbits-section-home fbits-vitrine-home fbits-vitrine-com-banner bmob">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big"> melhores ofertas</h3>
                    <span></span>
                          </div> 
                        </div>
                </div>
        <div class="row row-vitrine-home">
            <!-- Banner Vertical Mobile -->
            <div class="col-md-3 col-sm-12 col-banner-ofertas">
                <FBITS:Banner filtroPosicao="Lateral Esquerda" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-ofertas-lateral-mobile" />
            </div>   
            
            <!-- Carrossel de Produtos -->
            <div class="col-md-9 col-sm-12 col-carrossel-ofertas">
                <FBITS:ListaSpots idsHotsites="117326" tipo="carrossel" configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: 300,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="componente-vitrine" />
                          </div> 
                        </div>
    </section>

    
   <!--VITRINE DOIS-->
    <section class="fbits-section-home fbits-vitrine-home">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big"> novidades! </h3>
                    <span></span>
                            </div>
                <FBITS:ListaCustomizada idsBanners="" idsHotsites="117167" idsConteudos="" tipo="carrossel" configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: 300,
                  adaptiveHeight: true,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="componente-vitrine" />
                          </div> 
                        </div>
    </section>
    

    
   <!--BANNER RODAPE-->
    <section class="fbits-section-home fbits-banner-rodape" style="width: 100%;">
        <div class="row row-fbits-banner-rodape">
                            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big"> </h3>
                    <span></span>
                            </div>
                <FBITS:Banner filtroPosicao="rodape" idsBanners="" tipo="carrossel" configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: 300,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 400,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="componente-banner-rodape" />
                          </div> 
                        </div>
    </section>

        <!--OFERTAS POR DEPARTAMENTO-->
    <section class="fbits-section-home fbits-ofertas-departamento">
        <div class="row row-ofertas-departamento">
                            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">os melhores equipamentos! </h3>
                    <span></span>
                                    </div>
                <FBITS:OfertasPorDepartamento idHotsite="117268" tipo="carrossel" configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: 300,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="componente-vitrine componente-ofertas-departamento" />
                          </div> 
                        </div>
    </section>  
    
    <!-- Futuramente Mobile Centro Lower>
    <!--BANNER MEIO DESKTOP - Entre Equipamentos e Clareador-->
    <section class="fbits-section-home fbits-banner-meio-home bdesk">
        <div class="row row-fbits-banner-meio">
            <div class="col-md-12">
                <FBITS:Banner filtroPosicao="Centro Lower" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-meio-equipamentos" />
                </div>
            </div>   
    </section>
    
    <!--BANNER MEIO MOBILE - Entre Equipamentos e Clareador-->
    <section class="fbits-section-home fbits-banner-meio-home bmob">
        <div class="row row-fbits-banner-meio">
            <div class="col-md-12">
                <FBITS:Banner filtroPosicao="Mobile Centro Lower" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-meio-equipamentos-mobile" />
                </div>
            </div>   
    </section>
    
        <!--LUVAS-->
    <section class="fbits-section-home fbits-vitrine-home">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">os melhores preços em clareador</h3>
                    <span></span>
                </div>               
                <FBITS:ListaCustomizada idsBanners="" idsHotsites="117272" idsConteudos="" tipo="carrossel" configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: 300,
                  adaptiveHeight: true,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 1280,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    },
                    {
                      breakpoint: 767,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="componente-vitrine" />
            </div>
                </div>
    </section>

                        </div>
                    </div>
                    </div>

