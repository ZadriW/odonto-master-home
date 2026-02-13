<style>

/* ===== CONTROLE DOS BANNERS DO TOPO ===== */
/* Banner Mobile Topo e Banner Topo - Controle de tamanho */
section.fbits-section-home.fbits-banner-mobiletopo-home,
section.fbits-section-home.fbits-banner-topo-home {
    margin: 0 auto;f
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
/* Garante que o banner topo seja sempre exibido */
section.fbits-section-home.fbits-banner-topo-home,
section.fbits-section-home.fbits-banner-mobiletopo-home {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

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

/* Garante que após a animação, os banners topo sejam visíveis */
section.fbits-section-home.fbits-banner-mobiletopo-home .fbits-banner-item,
section.fbits-section-home.fbits-banner-topo-home .fbits-banner-item {
    animation-fill-mode: forwards;
}

/* Keyframes para fadeInUp */
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
        margin: 0 auto !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        position: relative;
        left: 0 !important;
        right: 0 !important;
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
        background: transparent !important;
        background-color: transparent !important;
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
section.fbits-vitrine-com-banner.bdesk {
    display: block !important;
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
    background: transparent !important;
    background-color: transparent !important;
}

section.fbits-banner-rodape .slick-track {
    background: transparent !important;
    background-color: transparent !important;
}

section.fbits-banner-rodape .slick-slide {
    padding: 0 10px;
    outline: none;
}

section.fbits-banner-rodape .fbits-banner-item {
    background: transparent !important;
    border: none;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    height: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0 auto;
    max-width: 100%;
}

section.fbits-banner-rodape .fbits-banner-item:hover {
    transform: translateY(-8px);
}

section.fbits-banner-rodape .fbits-banner-item img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    transition: transform 0.3s ease;
}

/* Responsivo - Mobile/Tablet */
@@media (max-width: 1024px) {
    section.fbits-banner-rodape .fbits-banner-item {
        cursor: default;
        transition: none;
    }
    
    section.fbits-banner-rodape .fbits-banner-item:hover {
        transform: none;
    }
    
    section.fbits-banner-rodape .slick-list {
        padding: 10px 0 !important;
    }
}
/* ===== FIM BANNER RODAPÉ - REFINADO ===== */

/* Títulos pretos na home */
h3.title.big {
    color: #000000 !important;
    margin-top: 3em;
    margin-bottom: 1.3em;
    text-transform: uppercase;
    border-bottom: 3px solid #0030DB !important;
}


footer,
.footer,
.footer-container,
.footer-top,
.footer-middle {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
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
    background: transparent !important;
    background-color: transparent !important;
}
section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item img {
    width: 100%;
    height: auto;
    max-width: 100%;
    display: block;
    margin: 0 auto;
}

/* Melhores Ofertas com Banner Lateral - DESKTOP */
section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas {
    float: left !important;
    width: 25% !important;
    padding-right: 15px !important;
}

section.fbits-vitrine-com-banner.bdesk .col-carrossel-ofertas {
    float: left !important;
    width: 75% !important;
    padding-left: 15px !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
    display: none !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item:first-child {
    display: block !important;
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

section.fbits-vitrine-com-banner.bdesk .col-banner-ofertas .fbits-banner-item img {
    width: 100%;
    height: auto;
    display: block;
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
            background: transparent !important;
            background-color: transparent !important;
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
    
/* ===== FUNDO BRANCO NO MAIN-CONTAINER ===== */
/* Main container com fundo branco */
.main-container,
.main-container.col1-layout,
.main-container.col2-left-layout,
.main-container.col2-right-layout {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Containers internos do main-container com fundo branco */
.main-container .main,
.main-container .main.container,
.main-container .col-main {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Seções dentro do main-container com fundo branco */
.main-container section.fbits-section-home,
.main-container .fbits-section-home,
.main-container section[class*="fbits-"],
.main-container .row,
.main-container .row[class*="row-fbits-"],
.main-container .container {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Banner topo - Seção com fundo transparente (exceção) */
.main-container section.fbits-section-home.fbits-banner-topo-home,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home,
section.fbits-section-home.fbits-banner-topo-home,
section.fbits-section-home.fbits-banner-mobiletopo-home {
    background-color: transparent !important;
    background: transparent !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

/* Cards de produtos mantêm fundo branco */
.main-container .spot,
.main-container .item,
.main-container .product-item,
.main-container .fbits-produto {
    background: #fff !important;
    background-color: #fff !important;
    border-radius: 8px !important;
    overflow: hidden;
}

/* Banners dentro do main-container com fundo branco */
.main-container .fbits-banner-item,
.main-container .banner-item {
    background: #fff !important;
}

/* Banner rodapé - Fundo transparente */
.main-container section.fbits-banner-rodape .fbits-banner-item {
    background: transparent !important;
}

/* Banner meio equipamentos - Fundo transparente */
.main-container .fbits-banner-item.banner-meio-equipamentos,
.main-container .banner-item.banner-meio-equipamentos,
.fbits-banner-item.banner-meio-equipamentos,
.banner-item.banner-meio-equipamentos,
section.fbits-banner-meio-home .fbits-banner-item.banner-meio-equipamentos,
section.fbits-section-home.fbits-banner-meio-home .fbits-banner-item.banner-meio-equipamentos {
    background: transparent !important;
    background-color: transparent !important;
}

/* Banner rodapé - Carrossel com fundo transparente */
.main-container section.fbits-banner-rodape .fbits-componente-banner,
.main-container section.fbits-banner-rodape .slick-initialized,
.main-container section.fbits-banner-rodape .slick-slider,
.main-container section.fbits-banner-rodape .slick-track,
.main-container section.fbits-banner-rodape .slick-list {
    background-color: transparent !important;
    background: transparent !important;
}

/* Espaçamento entre banners no rodapé */
.main-container section.fbits-banner-rodape .slick-slide {
    padding: 0 8px !important;
}

/* Remove padding das bordas do banner rodapé */
.main-container section.fbits-banner-rodape .slick-list {
    margin: 0 -8px !important;
}

/* Espaçamento dos carrosséis em branco */
.main-container .slick-track,
.main-container .slick-list,
.main-container .slick-list.draggable,
.main-container .slick-slide,
.main-container .slick-slider {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Ajusta altura do slick-track para igualar cards de produtos disponíveis e indisponíveis */
.main-container section.fbits-vitrine-home .slick-track,
.main-container section.fbits-vitrine-com-banner .slick-track,
.main-container section.fbits-ofertas-departamento .slick-track,
.main-container section.fbits-vitrine-home .slick-track .slick-slide,
.main-container section.fbits-vitrine-com-banner .slick-track .slick-slide,
.main-container section.fbits-ofertas-departamento .slick-track .slick-slide {
    height: auto !important;
    min-height: 0 !important;
}

.main-container section.fbits-vitrine-home .slick-track,
.main-container section.fbits-vitrine-com-banner .slick-track,
.main-container section.fbits-ofertas-departamento .slick-track {
    display: flex !important;
    align-items: stretch !important;
}

.main-container section.fbits-vitrine-home .slick-track .slick-slide,
.main-container section.fbits-vitrine-com-banner .slick-track .slick-slide,
.main-container section.fbits-ofertas-departamento .slick-track .slick-slide {
    display: flex !important;
    align-items: stretch !important;
}

.main-container section.fbits-vitrine-home .slick-track .slick-slide > div,
.main-container section.fbits-vitrine-com-banner .slick-track .slick-slide > div,
.main-container section.fbits-ofertas-departamento .slick-track .slick-slide > div {
    height: 100% !important;
}

/* Banner topo - Fundo transparente (exceção) */
.main-container section.fbits-section-home.fbits-banner-topo-home .slick-track,
.main-container section.fbits-section-home.fbits-banner-topo-home .slick-list,
.main-container section.fbits-section-home.fbits-banner-topo-home .slick-slider,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-track,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slider,
section.fbits-section-home.fbits-banner-topo-home .slick-track,
section.fbits-section-home.fbits-banner-topo-home .slick-list,
section.fbits-section-home.fbits-banner-topo-home .slick-slider,
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-track,
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slider {
    background-color: transparent !important;
    background: transparent !important;
}

/* Espaçamento entre os cards no carrossel */
.main-container .slick-slide {
    padding: 0 8px !important;
}

/* Banner topo - Mantém padding original (exceção) */
.main-container section.fbits-section-home.fbits-banner-topo-home .slick-slide,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide,
section.fbits-section-home.fbits-banner-topo-home .slick-slide,
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slide {
    padding: 0 5px !important;
}

/* Remove padding das bordas para centralizar */
.main-container .slick-list {
    margin: 0 -8px !important;
}

/* Banner topo - Mantém margin original (exceção) */
.main-container section.fbits-section-home.fbits-banner-topo-home .slick-list,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
section.fbits-section-home.fbits-banner-topo-home .slick-list,
section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list {
    margin: 0 auto !important;
    padding: 10px 0 !important;
}

/* Garante que o spot dentro do slide tenha espaçamento */
.main-container .slick-slide .spot,
.main-container .slick-slide .item,
.main-container .slick-slide .product-item {
    margin: 0 !important;
}

/* Container dos produtos em branco */
.main-container .componente-vitrine,
.main-container .componente-ofertas-departamento,
.main-container .fbits-vitrine-home,
.main-container .fbits-ofertas-departamento {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Details area dos produtos em branco */
.main-container .spot .details-area,
.main-container .item .details-area,
.main-container .product-item .details-area,
.main-container .spot .product-name,
.main-container .item .product-name,
.main-container .spot .image,
.main-container .item .image,
.main-container .product-item .image {
    background: #fff !important;
    background-color: #fff !important;
}

/* ===== CARDS DE PRODUTOS INDISPONÍVEIS - MESMO TAMANHO DOS OUTROS ===== */
/* Força os cards indisponíveis a terem a mesma estrutura e altura dos disponíveis */

/* Container principal do card indisponível */
.spot.fbits-spot-indisponivel,
.item.fbits-spot-indisponivel,
.product-item.fbits-spot-indisponivel,
.spot.fbits-spot-indisponivel.last,
.item.fbits-spot-indisponivel.last,
.product-item.fbits-spot-indisponivel.last,
.main-container .spot.fbits-spot-indisponivel,
.main-container .item.fbits-spot-indisponivel,
.main-container .product-item.fbits-spot-indisponivel,
.slick-slide .spot.fbits-spot-indisponivel,
.slick-slide .item.fbits-spot-indisponivel,
.slick-slide .product-item.fbits-spot-indisponivel {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
    height: auto !important;
    min-height: 460px !important;
    max-height: none !important;
    box-sizing: border-box !important;
}

/* Área de imagem - mesmo tamanho */
.spot.fbits-spot-indisponivel .image,
.item.fbits-spot-indisponivel .image,
.product-item.fbits-spot-indisponivel .image,
.main-container .spot.fbits-spot-indisponivel .image,
.main-container .item.fbits-spot-indisponivel .image,
.main-container .product-item.fbits-spot-indisponivel .image {
    flex: 0 0 auto !important;
    width: 100% !important;
    height: auto !important;
    min-height: 250px !important;
}

/* Área de detalhes - preenche o espaço restante */
.spot.fbits-spot-indisponivel .details-area,
.item.fbits-spot-indisponivel .details-area,
.product-item.fbits-spot-indisponivel .details-area,
.main-container .spot.fbits-spot-indisponivel .details-area,
.main-container .item.fbits-spot-indisponivel .details-area,
.main-container .product-item.fbits-spot-indisponivel .details-area {
    flex: 1 1 auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    min-height: 220px !important;
}

/* Nome do produto */
.spot.fbits-spot-indisponivel .product-name,
.item.fbits-spot-indisponivel .product-name,
.product-item.fbits-spot-indisponivel .product-name,
.main-container .spot.fbits-spot-indisponivel .product-name,
.main-container .item.fbits-spot-indisponivel .product-name,
.main-container .product-item.fbits-spot-indisponivel .product-name {
    min-height: 2.9em !important;
    max-height: 2.9em !important;
    overflow: hidden !important;
}

/* Área de preço - altura fixa igual aos disponíveis */
.spot.fbits-spot-indisponivel .spotPreco,
.item.fbits-spot-indisponivel .spotPreco,
.product-item.fbits-spot-indisponivel .spotPreco,
.main-container .spot.fbits-spot-indisponivel .spotPreco,
.main-container .item.fbits-spot-indisponivel .spotPreco,
.main-container .product-item.fbits-spot-indisponivel .spotPreco {
    height: 70px !important;
    min-height: 70px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Botões de ação */
.spot.fbits-spot-indisponivel .details-area .actions,
.item.fbits-spot-indisponivel .details-area .actions,
.product-item.fbits-spot-indisponivel .details-area .actions,
.main-container .spot.fbits-spot-indisponivel .details-area .actions,
.main-container .item.fbits-spot-indisponivel .details-area .actions,
.main-container .product-item.fbits-spot-indisponivel .details-area .actions {
    margin-top: auto !important;
    min-height: 40px !important;
}

/* Garante que todos os elementos internos sejam exibidos */
.spot.fbits-spot-indisponivel *,
.item.fbits-spot-indisponivel *,
.product-item.fbits-spot-indisponivel *,
.main-container .spot.fbits-spot-indisponivel *,
.main-container .item.fbits-spot-indisponivel *,
.main-container .product-item.fbits-spot-indisponivel * {
    visibility: visible !important;
    opacity: 1 !important;
}

/* Mobile - ajustes responsivos */
@@media (max-width: 990px) {
    .spot.fbits-spot-indisponivel .image,
    .item.fbits-spot-indisponivel .image,
    .product-item.fbits-spot-indisponivel .image {
        min-height: 130px !important;
    }
    
    .spot.fbits-spot-indisponivel .details-area,
    .item.fbits-spot-indisponivel .details-area,
    .product-item.fbits-spot-indisponivel .details-area {
        min-height: 130px !important;
    }
}

/* Limita descrição do produto em class="info" a 2 linhas com ellipsis */
.spot .info,
.item .info,
.product-item .info,
.fbits-produto .info,
.main-container .spot .info,
.main-container .item .info,
.main-container .product-item .info,
.main-container .fbits-produto .info {
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    line-height: 1.4em !important;
    height: calc(1.4em * 2) !important;
    max-height: calc(1.4em * 2) !important;
    min-height: calc(1.4em * 2) !important;
    word-wrap: break-word !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Rows das vitrines em branco */
.main-container .row-vitrine-home,
.main-container .row-ofertas-departamento,
.main-container div[class*="row-fbits-"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Banner topo - Row com fundo transparente (exceção) */
.main-container section.fbits-section-home.fbits-banner-topo-home .row-fbits-banner-topo,
.main-container section.fbits-section-home.fbits-banner-topo-home .row,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .row-fbits-banner-topo,
.main-container section.fbits-section-home.fbits-banner-mobiletopo-home .row,
section.fbits-section-home.fbits-banner-topo-home .row-fbits-banner-topo,
section.fbits-section-home.fbits-banner-topo-home .row,
section.fbits-section-home.fbits-banner-mobiletopo-home .row-fbits-banner-topo,
section.fbits-section-home.fbits-banner-mobiletopo-home .row {
    background-color: transparent !important;
    background: transparent !important;
}

/* Colunas das vitrines em branco */
.main-container .col-carrossel-ofertas,
.main-container .col-banner-ofertas,
.main-container div[class*="col-"] {
    background-color: #ffffff !important;
    background: #ffffff !important;
}

/* Remove espaços cinzas em mobile e corrige faixa branca lateral */
@@media (max-width: 990px) {
    /* Main container mobile com fundo branco */
    .main-container,
    .main-container.col1-layout,
    .main-container .main.container,
    .main-container .col-main {
        background-color: #ffffff !important;
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Garante fundo branco nas seções mobile dentro do main-container */
    .main-container section.fbits-section-home,
    .main-container section[class*="fbits-"],
    .main-container .row,
    .main-container .container {
        background-color: #ffffff !important;
        background: #ffffff !important;
    }
    
    /* Banner topo - Fundo transparente e sempre visível (exceção) */
    .main-container section.fbits-section-home.fbits-banner-topo-home,
    .main-container section.fbits-section-home.fbits-banner-mobiletopo-home,
    section.fbits-section-home.fbits-banner-topo-home,
    section.fbits-section-home.fbits-banner-mobiletopo-home {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        background-color: transparent !important;
        background: transparent !important;
    }
    
    /* Banner topo - Elementos internos transparentes */
    .main-container section.fbits-section-home.fbits-banner-topo-home .slick-track,
    .main-container section.fbits-section-home.fbits-banner-topo-home .slick-list,
    .main-container section.fbits-section-home.fbits-banner-topo-home .slick-slider,
    .main-container section.fbits-section-home.fbits-banner-topo-home .row,
    .main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-track,
    .main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-list,
    .main-container section.fbits-section-home.fbits-banner-mobiletopo-home .slick-slider,
    .main-container section.fbits-section-home.fbits-banner-mobiletopo-home .row {
        background-color: transparent !important;
        background: transparent !important;
    }
    
    /* Cards de produtos com border-radius em mobile */
    .main-container .spot,
    .main-container .item,
    .main-container .product-item,
    .main-container .fbits-produto {
        border-radius: 8px !important;
        overflow: hidden;
    }
    
    /* Limita descrição do produto em class="info" a 2 linhas com ellipsis em mobile */
    .spot .info,
    .item .info,
    .product-item .info,
    .fbits-produto .info,
    .main-container .spot .info,
    .main-container .item .info,
    .main-container .product-item .info,
    .main-container .fbits-produto .info {
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        line-height: 1.4em !important;
        height: calc(1.4em * 2) !important;
        max-height: calc(1.4em * 2) !important;
        min-height: calc(1.4em * 2) !important;
        word-wrap: break-word !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Carrosséis com fundo branco em mobile */
    .main-container .slick-list,
    .main-container .slick-list.draggable,
    .main-container .slick-track {
        background-color: #ffffff !important;
        background: #ffffff !important;
    }
    
    /* Espaçamento entre os cards no carrossel mobile */
    .main-container .slick-slide {
        padding: 0 8px !important;
    }
    
    /* Remove padding das bordas para centralizar mobile */
    .main-container .slick-list {
        margin: 0 -8px !important;
    }
    
    /* Banner rodapé com fundo transparente em mobile */
    .main-container section.fbits-banner-rodape .fbits-componente-banner,
    .main-container section.fbits-banner-rodape .slick-initialized,
    .main-container section.fbits-banner-rodape .slick-slider,
    .main-container section.fbits-banner-rodape .slick-track,
    .main-container section.fbits-banner-rodape .slick-list {
        background-color: transparent !important;
        background: transparent !important;
    }
    
    /* Espaçamento entre banners no rodapé mobile */
    .main-container section.fbits-banner-rodape .slick-slide {
        padding: 0 8px !important;
    }
    
    /* Correção do posicionamento do banner centro mobile */
    .main-container section.fbits-banner-centro-home.bmob {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        left: 0 !important;
        right: 0 !important;
    }
    
    .main-container section.fbits-banner-centro-home.bmob .container,
    .main-container section.fbits-banner-centro-home.bmob .row,
    .main-container section.fbits-banner-centro-home.bmob .col-md-12 {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove padding dos containers Bootstrap dentro do main-container */
    .main-container .container,
    .main-container .main.container {
        padding-left: 0 !important;
        padding-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove margens negativas das rows dentro do main-container */
    .main-container .row,
    .main-container .row-fbits-banner-topo,
    .main-container .row-fbits-banner-centro,
    .main-container .row-fbits-banner-meio,
    .main-container .row-fbits-banner-rodape,
    .main-container .row-vitrine-home,
    .main-container .row-ofertas-departamento {
        margin-left: 0 !important;
        margin-right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Remove padding das colunas dentro do main-container */
    .main-container .col-md-12,
    .main-container .col-sm-12,
    .main-container [class*="col-"] {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    /* Width 100% para colunas dentro do main-container */
    .main-container .col-md-12,
    .main-container .col-sm-12 {
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* Seções ocupam 100% dentro do main-container */
    .main-container section.fbits-section-home {
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
    
/* Banner lateral mobile com fundo transparente */
.main-container .banner-ofertas-lateral-mobile,
.main-container .banner-ofertas-lateral-mobile .fbits-banner-item,
.main-container .banner-ofertas-lateral-mobile .fbits-banner-item img,
.banner-ofertas-lateral-mobile,
.banner-ofertas-lateral-mobile .fbits-banner-item,
.banner-ofertas-lateral-mobile .fbits-banner-item img {
    background: transparent !important;
    background-color: transparent !important;
}

.main-container .banner-ofertas-lateral-mobile,
.main-container .banner-ofertas-lateral-mobile .fbits-banner-item,
.main-container .banner-ofertas-lateral-mobile .fbits-banner-item img,
.banner-ofertas-lateral-mobile,
.banner-ofertas-lateral-mobile .fbits-banner-item,
.banner-ofertas-lateral-mobile .fbits-banner-item img,
.main-container .banner-ofertas-lateral-mobile-bluefriday,
.main-container .banner-ofertas-lateral-mobile-bluefriday .fbits-banner-item,
.main-container .banner-ofertas-lateral-mobile-bluefriday .fbits-banner-item img,
.banner-ofertas-lateral-mobile-bluefriday,
.banner-ofertas-lateral-mobile-bluefriday .fbits-banner-item,
.banner-ofertas-lateral-mobile-bluefriday .fbits-banner-item img {
     background: transparent !important;
     background-color: transparent !important;
 }

.banner-ofertas-lateral-mobile-bluefriday .slick-slider,
.banner-ofertas-lateral-mobile-bluefriday .slick-list,
.banner-ofertas-lateral-mobile-bluefriday .slick-track,
.banner-ofertas-lateral-mobile-bluefriday .slick-slide,
.banner-ofertas-lateral-mobile-bluefriday .slick-slide > div,
.banner-ofertas-lateral-mobile-bluefriday .fbits-banner-item {
    width: 100% !important;
}

.banner-ofertas-lateral-mobile-bluefriday .slick-slide {
    padding: 0 !important;
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
    <div class="main-container col1-layout">
        <div class="main container">
            <div class="col-main">
    
    <!--BANNER TOPO-->
    <section class="fbits-section-home fbits-banner-topo-home">
        <div class="row row-fbits-banner-topo">
                            <div class="col-md-12">
                <FBITS:Banner filtroPosicao="topo" idsBanners="" tipo="carrossel"  configuracaoCarrossel="{
                  dots: false,
                  infinite: true,
                  speed: '300',
                  autoplay: true,
                  slidesToShow: 4,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 1920,
                      settings: {
                        slidesToShow: 4,
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
    </section>  
    
    <!--MELHORES OFERTAS COM BANNER LATERAL DESKTOP-->
    <section class="fbits-section-home fbits-vitrine-home fbits-vitrine-com-banner bdesk">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">Verão de ofertas FGM</h3>
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
                <FBITS:ListaSpots idsHotsites="117379" tipo="carrossel" configuracaoCarrossel="{
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
                    <h3 class="title big">Verão de ofertas FGM</h3>
                    <span></span>
    </div>
                        </div>
                </div>
        <div class="row row-vitrine-home">
            <!-- Banner Vertical Mobile -->
            <div class="col-md-3 col-sm-12 col-banner-ofertas">
                <FBITS:Banner filtroPosicao="Lateral Esquerda" idsBanners="" tipo="carrossel" configuracaoCarrossel="{
                  dots: true,
                  infinite: true,
                  autoplay: true,
                  autoplaySpeed: 4000,
                  speed: 400,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  responsive: [
                    {
                      breakpoint: 768,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]
                }" classeItens="banner-ofertas-lateral-mobile-bluefriday" />
            </div>

            <!-- Carrossel de Produtos -->
            <div class="col-md-9 col-sm-12 col-carrossel-ofertas">
                <FBITS:ListaSpots idsHotsites="117379" tipo="carrossel" configuracaoCarrossel="{
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

   <!--CARROSSEL ORTHOMETRIC DESKTOP-->
    <section class="fbits-section-home fbits-vitrine-home">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">Os melhores preços em Orthometric</h3>
                    <span></span>
                          </div>
                <FBITS:ListaSpots idsHotsites="117371" tipo="carrossel" configuracaoCarrossel="{
                    dots: false,
                    infinite: true,
                    speed: '300',
                    autoplay: true,
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
    
    <!--CARROSSEL COM BANNER FILTROS TOPO DESKTOP - RESINAS SOLVENTUM-->
    <section class="fbits-section-home fbits-vitrine-home fbits-vitrine-com-banner bdesk">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">Melhores ofertas em resinas Solventum 3M é aqui!</h3>
                    <span></span>
                          </div>
                        </div>
                </div>
        <div class="row row-vitrine-home">
            <!-- Banner Filtros Topo Desktop -->
            <div class="col-md-3 col-sm-12 col-banner-ofertas">
                <FBITS:Banner filtroPosicao="Filtros Topo" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-ofertas-lateral" />
            </div>

            <!-- Carrossel de Produtos -->
            <div class="col-md-9 col-sm-12 col-carrossel-ofertas">
                <FBITS:ListaCustomizada idsBanners="" idsHotsites="117374" idsConteudos="" tipo="carrossel" configuracaoCarrossel="{
                    dots: false,
                    infinite: true,
                    speed: '300',
                    autoplay: true,
                    adaptiveHeight: true,
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

    <!--CARROSSEL COM BANNER FILTROS TOPO MOBILE - RESINAS SOLVENTUM-->
    <section class="fbits-section-home fbits-vitrine-home fbits-vitrine-com-banner bmob">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">Melhores ofertas em resinas Solventum 3M é aqui!</h3>
                    <span></span>
                          </div>
                        </div>
                </div>
        <div class="row row-vitrine-home">
            <!-- Banner Filtros Topo Mobile -->
            <div class="col-md-3 col-sm-12 col-banner-ofertas">
                <FBITS:Banner filtroPosicao="Filtros Bottom" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-ofertas-lateral-mobile" />
            </div>

            <!-- Carrossel de Produtos -->
            <div class="col-md-9 col-sm-12 col-carrossel-ofertas">
                <FBITS:ListaCustomizada idsBanners="" idsHotsites="117374" idsConteudos="" tipo="carrossel" configuracaoCarrossel="{
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
                    <h3 class="title big">Equipamentos com tecnologia, preço e qualidade</h3>
                    <span></span>
                                    </div>
                <FBITS:OfertasPorDepartamento idHotsite="117373" tipo="carrossel" configuracaoCarrossel="{
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
    
    <!--BANNER MEIO MOBILE - Entre Equipamentos e aulas-->
    <section class="fbits-section-home fbits-banner-meio-home bmob">
        <div class="row row-fbits-banner-meio">
            <div class="col-md-12">
                <FBITS:Banner filtroPosicao="Mobile Centro Lower" idsBanners="" tipo="estatico" configuracaoCarrossel="" classeItens="banner-meio-equipamentos-mobile" />
                </div>
            </div>   
    </section>
    
    <section class="fbits-section-home fbits-vitrine-home">
        <div class="row row-vitrine-home">
            <div class="col-md-12">
                <div class="line">
                    <h3 class="title big">Volta ás aulas Master | Ofertas para acadêmicos</h3>
                    <span></span>
                </div>               
                <FBITS:ListaCustomizada idsBanners="" idsHotsites="117380" idsConteudos="" tipo="carrossel" configuracaoCarrossel="{
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

