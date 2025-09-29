/* ===== WAKE COMMERCE FOOTER - JAVASCRIPT OTIMIZADO E CORRIGIDO ===== */

(function() {
    'use strict';

    // Verificar se jQuery está carregado
    if (typeof jQuery === 'undefined') {
        console.warn('Wake Commerce Footer: jQuery não encontrado. Algumas funcionalidades podem não funcionar.');
        return;
    }

    const $ = jQuery;

    // ===== CARRINHO FBITS - FUNCIONALIDADES WAKE COMMERCE =====

    // Função de validação do pedido FBITS (corrigida e otimizada)
    if (typeof window.Fbits === 'undefined') {
        window.Fbits = {};
    }

    if (typeof window.Fbits.Carrinho === 'undefined') {
        window.Fbits.Carrinho = {};
    }

    if (typeof window.Fbits.Carrinho.Pedido === 'undefined') {
        window.Fbits.Carrinho.Pedido = {};
    }

    // Implementação da validação do pedido Wake Commerce
    window.Fbits.Carrinho.Pedido.Valido = function() {
        var resultado = true;
        var mensagemErro = '';

        try {
            // Limpar mensagens anteriores
            $('.tyc-mensagem').remove();

            // Verificar dados do usuário
            if ($("ul[class='fbits-info-pessoal'] li[class='fbits-info-item']").length === 0) {
                marcarAtivo("USUARIO");
                mensagemErro = 'Por favor, preencha seus dados de usuário';
                resultado = false;
            }
            // Verificar endereço selecionado
            else if ($('#div-endereco-body div[data-selecionado="true"]').length === 0) {
                marcarAtivo("ENDERECO");
                mensagemErro = 'Por favor, selecione um endereço';
                resultado = false;
            }
            // Verificar forma de envio
            else if ($('#fbits-frete-body div[class="item-frete-option selected"]').length === 0) {
                marcarAtivo("ENVIO");
                mensagemErro = 'Por favor, selecione uma forma de envio';
                resultado = false;
            }
            // Verificar forma de pagamento
            else if ($('.formas-pagamento li[class="nav-item active"]').length === 0) {
                marcarAtivo("PAGAMENTO");
                mensagemErro = 'Por favor, selecione uma forma de pagamento';
                resultado = false;
            }

            // Exibir mensagem de erro se necessário
            if (!resultado && mensagemErro) {
                exibirMensagemErro(mensagemErro);
            }

        } catch (error) {
            console.error('Erro na validação do pedido:', error);
            resultado = false;
        }

        return resultado;
    };

    // Função auxiliar para marcar seção ativa
    function marcarAtivo(secao) {
        try {
            $('.checkout-step').removeClass('active');
            $(`[data-step="${secao}"]`).addClass('active');
        } catch (error) {
            console.warn('Erro ao marcar seção ativa:', error);
        }
    }

    // Função auxiliar para exibir mensagem de erro
    function exibirMensagemErro(mensagem) {
        try {
            const $checkoutActive = $('.checkout-active');
            if ($checkoutActive.length > 0) {
                const $mensagem = $(`
                    <div class="tyc-mensagem">
                        <div class="tyc-border-progress"></div>
                        <p class="tyc-mensagem-error">${mensagem}</p>
                        <button class="tyc-close-btn" aria-label="Fechar mensagem">×</button>
                    </div>
                `);

                $checkoutActive.prepend($mensagem);
                $mensagem.slideDown('slow');

                // Auto-ocultar após 5 segundos
                setTimeout(function() {
                    $mensagem.slideUp('slow', function() {
                        $(this).remove();
                    });
                }, 5000);

                // Botão de fechar
                $mensagem.find('.tyc-close-btn').on('click', function() {
                    $mensagem.slideUp('slow', function() {
                        $(this).remove();
                    });
                });
            }
        } catch (error) {
            console.error('Erro ao exibir mensagem:', error);
        }
    }

    // ===== EVENT HANDLERS =====

    // Handler para botão finalizar
    $(document).on('click', '.btfinalizar', function(e) {
        try {
            const $checkoutActive = $('.checkout-active');
            if ($checkoutActive.length > 0) {
                $('html, body').animate({
                    scrollTop: $checkoutActive.offset().top - 20
                }, 1000);
            }
        } catch (error) {
            console.warn('Erro no scroll para checkout:', error);
        }
    });

    // ===== FUNCIONALIDADES DO FOOTER =====

    // Função para atualizar contador do carrinho
    function atualizarContadorCarrinho() {
        try {
            const $contadorCarrinho = $('.cart-qty, .minicart-qtde-itens');
            const $carrinhoVazio = $('.cart-empty');

            if ($contadorCarrinho.length > 0) {
                const quantidade = $contadorCarrinho.first().text() || '0';

                // Atualizar todos os contadores
                $contadorCarrinho.text(quantidade);

                // Mostrar/ocultar mensagem de carrinho vazio
                if (quantidade !== '0' && quantidade !== '') {
                    $carrinhoVazio.hide();
                } else {
                    $carrinhoVazio.show();
                }
            }
        } catch (error) {
            console.warn('Erro ao atualizar contador do carrinho:', error);
        }
    }

    // Função para inicializar footer
    function inicializarFooter() {
        try {
            // Verificar se elementos necessários existem
            if ($('.footer').length === 0) {
                console.warn('Footer Wake Commerce não encontrado no DOM');
                return;
            }

            // Adicionar classes CSS para melhor compatibilidade
            $('.footer').addClass('wake-commerce-footer');

            // Inicializar tooltips se necessário
            if ($.fn.tooltip) {
                $('[data-toggle="tooltip"]').tooltip();
            }

            // Lazy loading para imagens do footer
            const footerImages = $('.footer img[data-src]');
            if (footerImages.length > 0 && 'IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                });

                footerImages.each(function() {
                    imageObserver.observe(this);
                });
            }

            // Atualizar contador do carrinho periodicamente
            atualizarContadorCarrinho();
            setInterval(atualizarContadorCarrinho, 2000);

            console.log('Wake Commerce Footer inicializado com sucesso');

        } catch (error) {
            console.error('Erro ao inicializar footer:', error);
        }
    }

    // ===== FUNCIONALIDADES ESPECÍFICAS WAKE COMMERCE =====

    // Função para tracking de cliques nos links do footer
    function trackFooterClicks() {
        $('.footer a').on('click', function(e) {
            try {
                const href = $(this).attr('href');
                const text = $(this).text().trim();

                // Tracking para Google Analytics se disponível
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'Footer',
                        'event_label': text,
                        'value': href
                    });
                }

                // Tracking para Facebook Pixel se disponível
                if (typeof fbq !== 'undefined') {
                    fbq('trackCustom', 'FooterClick', {
                        link_text: text,
                        link_url: href
                    });
                }
            } catch (error) {
                console.warn('Erro no tracking de cliques:', error);
            }
        });
    }

    // Função para otimizar performance
    function otimizarPerformance() {
        try {
            // Debounce para redimensionamento de janela
            let resizeTimeout;
            $(window).on('resize', function() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function() {
                    // Reajustar layout se necessário
                    $('.footer').trigger('footer:resize');
                }, 250);
            });

            // Preload de recursos críticos
            const recursosImportantes = [
                'https://recursos.odontomaster.com.br/i/bandeiras-cards.png',
                'https://static.fbits.net/i/logo-tray-corp-rodape.svg'
            ];

            recursosImportantes.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                document.head.appendChild(link);
            });

        } catch (error) {
            console.warn('Erro na otimização de performance:', error);
        }
    }

    // ===== INICIALIZAÇÃO =====

    // Aguardar DOM ready
    $(document).ready(function() {
        // Dar um tempo para outros scripts carregarem
        setTimeout(function() {
            inicializarFooter();
            trackFooterClicks();
            otimizarPerformance();
        }, 500);
    });

    // Fallback para carregamento tardio
    $(window).on('load', function() {
        setTimeout(function() {
            if (!$('.footer').hasClass('wake-commerce-footer')) {
                inicializarFooter();
            }
        }, 1000);
    });

    // ===== COMPATIBILIDADE COM SISTEMAS LEGADOS =====

    // Função compatível com sistemas antigos
    window.cart = function() {
        atualizarContadorCarrinho();
    };

    // Função para sistemas que chamam atualizações manuais
    window.updateFooter = function() {
        inicializarFooter();
    };

    // ===== ESTILOS DINÂMICOS PARA COMPATIBILIDADE =====

    // Adicionar estilos CSS via JavaScript se necessário
    const estilosComplementares = `
        <style id="wake-commerce-footer-dynamic">
            .tyc-mensagem {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
                color: #721c24;
                padding: 15px;
                margin: 10px 0;
                position: relative;
                animation: slideInDown 0.5s ease-out;
            }

            .tyc-border-progress {
                position: absolute;
                top: 0;
                left: 0;
                height: 3px;
                background: #dc3545;
                border-radius: 4px 4px 0 0;
                animation: progressBar 5s linear forwards;
            }

            .tyc-mensagem-error {
                margin: 0;
                font-weight: 500;
            }

            .tyc-close-btn {
                position: absolute;
                top: 5px;
                right: 10px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #721c24;
            }

            @keyframes slideInDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes progressBar {
                from { width: 100%; }
                to { width: 0%; }
            }

            .wake-commerce-footer .footer-middle {
                min-height: auto;
            }

            .wake-commerce-footer .social-icons a {
                transition: all 0.3s ease;
            }

            .wake-commerce-footer .social-icons a:hover {
                transform: scale(1.1);
            }
        </style>
    `;

    // Adicionar estilos ao head se não existirem
    if ($('#wake-commerce-footer-dynamic').length === 0) {
        $('head').append(estilosComplementares);
    }

    // ===== DEBUGGING E LOGS =====

    // Função para debug (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        window.debugFooter = function() {
            console.log('=== DEBUG WAKE COMMERCE FOOTER ===');
            console.log('jQuery version:', $.fn.jquery);
            console.log('Footer elements:', $('.footer').length);
            console.log('Cart counter:', $('.cart-qty').text());
            console.log('FBITS object:', typeof window.Fbits);
            console.log('==============================');
        };
    }

})();