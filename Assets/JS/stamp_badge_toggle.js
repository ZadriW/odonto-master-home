/**
 * Toggle do badge de promoção ao clicar no stamp-image no mobile
 * Funciona apenas em resoluções mobile (max-width: 768px)
 */
(function() {
    'use strict';

    function initStampBadgeToggle() {
        // Verificar se está em mobile
        if (window.innerWidth > 768) {
            return; // Não executar em desktop
        }

        // Selecionar todos os stamp-images dentro de product-cards
        const stampImages = document.querySelectorAll('.product-card .stamp-image');
        
        stampImages.forEach(function(stampImage) {
            // Remover event listeners anteriores se existirem
            const newStampImage = stampImage.cloneNode(true);
            stampImage.parentNode.replaceChild(newStampImage, stampImage);
            
            // Adicionar event listener para clique
            newStampImage.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevenir que o clique no card seja acionado
                
                // Encontrar o product-card pai
                const productCard = this.closest('.product-card');
                if (!productCard) return;
                
                // Verificar se o card tem product-badge--promotion
                const badge = productCard.querySelector('.product-badge--promotion');
                if (!badge) return;
                
                // Toggle da classe stamp-badge-active
                if (productCard.classList.contains('stamp-badge-active')) {
                    // Segundo clique: ocultar badge
                    productCard.classList.remove('stamp-badge-active');
                } else {
                    // Primeiro clique: mostrar badge
                    productCard.classList.add('stamp-badge-active');
                }
            });
        });
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStampBadgeToggle);
    } else {
        initStampBadgeToggle();
    }

    // Re-inicializar quando novos cards forem adicionados dinamicamente
    const observer = new MutationObserver(function(mutations) {
        let shouldReinit = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (
                        node.classList.contains('product-card') ||
                        node.querySelector('.product-card') ||
                        node.querySelector('.stamp-image')
                    )) {
                        shouldReinit = true;
                    }
                });
            }
        });
        if (shouldReinit) {
            initStampBadgeToggle();
        }
    });

    // Observar mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Re-inicializar ao redimensionar a janela (caso mude de desktop para mobile)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (window.innerWidth <= 768) {
                initStampBadgeToggle();
            }
        }, 250);
    });
})();



