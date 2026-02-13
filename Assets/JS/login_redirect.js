/**
 * Script para redirecionar o usuário para a página inicial após o login
 * ao invés de redirecioná-lo para a página de conta
 */

(function() {
    let wasLoggedIn = false;
    let redirectHandled = false;
    let loginFormSubmitted = false;

    /**
     * Verifica se o usuário está na página de login
     */
    function isOnLoginPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes('/login/authenticate') || 
               (path.includes('/login') && !path.includes('/login/'));
    }

    /**
     * Verifica se o usuário está logado
     */
    function isUserLoggedIn() {
        if (typeof client === 'undefined' || !client) {
            return false;
        }
        try {
            const customerAccessToken = client.cookie.get('sf_customer_access_token');
            return customerAccessToken != null && customerAccessToken !== '';
        } catch (e) {
            return false;
        }
    }

    /**
     * Verifica o estado inicial do login
     */
    function checkInitialLoginState() {
        wasLoggedIn = isUserLoggedIn();
    }

    /**
     * Verifica se a URL atual é da página de conta
     */
    function isAccountPage() {
        const path = window.location.pathname.toLowerCase();
        return path.includes('/account') || path.includes('/my-data');
    }

    /**
     * Redireciona para a página inicial
     */
    function redirectToHome() {
        if (redirectHandled) {
            return;
        }
        
        redirectHandled = true;
        
        // Verifica se há um returnUrl na query string
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        // Se houver returnUrl válido, redireciona para ele
        // Caso contrário, redireciona para a home
        if (returnUrl && returnUrl !== window.location.href) {
            // Evita redirecionar para a própria página de login ou para account
            if (!returnUrl.includes('/login/authenticate') && 
                !returnUrl.includes('/login') && 
                !returnUrl.includes('/account') &&
                !returnUrl.includes('/my-data')) {
                window.location.href = returnUrl;
                return;
            }
        }
        
        // Redireciona para a home
        window.location.href = '/';
    }

    /**
     * Handler para o evento userChecked (disparado após verificação do usuário)
     */
    async function handleUserChecked() {
        if (!isOnLoginPage() && !isAccountPage()) {
            return;
        }

        // Aguarda um pouco para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 300));

        const isCurrentlyLoggedIn = isUserLoggedIn();

        // Se o usuário não estava logado antes e agora está, significa que acabou de fazer login
        if (!wasLoggedIn && isCurrentlyLoggedIn && loginFormSubmitted) {
            redirectToHome();
        }

        // Se estamos na página de conta e acabamos de fazer login, redireciona
        if (isAccountPage() && isCurrentlyLoggedIn && loginFormSubmitted && !wasLoggedIn) {
            redirectToHome();
        }

        // Atualiza o estado
        wasLoggedIn = isCurrentlyLoggedIn;
    }

    /**
     * Intercepta o submit do formulário de login
     */
    function interceptLoginForm() {
        const loginForm = document.querySelector('.wake-autenticate-wrapper form');
        const loginButton = document.querySelector('.button-login');
        
        // Intercepta cliques no botão de login ANTES do submit
        if (loginButton) {
            loginButton.addEventListener('click', function(e) {
                loginFormSubmitted = true;
                wasLoggedIn = false;
                // Marca que acabamos de fazer login
                sessionStorage.setItem('justLoggedIn', 'true');
                
                // Aguarda o login ser processado e intercepta redirecionamento
                setTimeout(function() {
                    let attempts = 0;
                    const checkLogin = setInterval(function() {
                        attempts++;
                        const isLoggedIn = isUserLoggedIn();
                        
                        // Se o usuário fez login, redireciona imediatamente para home
                        if (isLoggedIn && !wasLoggedIn) {
                            clearInterval(checkLogin);
                            sessionStorage.removeItem('justLoggedIn');
                            redirectToHome();
                        } 
                        // Se foi redirecionado para account, intercepta e redireciona para home
                        else if (isAccountPage() && isLoggedIn) {
                            clearInterval(checkLogin);
                            sessionStorage.removeItem('justLoggedIn');
                            redirectToHome();
                        }
                        // Timeout após 10 segundos
                        else if (attempts > 100) {
                            clearInterval(checkLogin);
                        }
                    }, 100);
                }, 300);
            }, true); // Usa capture phase para interceptar antes
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                loginFormSubmitted = true;
                wasLoggedIn = false; // Reset para detectar novo login
                // Marca que acabamos de fazer login
                sessionStorage.setItem('justLoggedIn', 'true');
                
                // Aguarda o login ser processado
                setTimeout(function() {
                    let attempts = 0;
                    const checkLogin = setInterval(function() {
                        attempts++;
                        const isLoggedIn = isUserLoggedIn();
                        
                        // Se o usuário fez login, redireciona imediatamente para home
                        if (isLoggedIn && !wasLoggedIn) {
                            clearInterval(checkLogin);
                            sessionStorage.removeItem('justLoggedIn');
                            redirectToHome();
                        }
                        // Se foi redirecionado para account, intercepta e redireciona para home
                        else if (isAccountPage() && isLoggedIn) {
                            clearInterval(checkLogin);
                            sessionStorage.removeItem('justLoggedIn');
                            redirectToHome();
                        }
                        // Timeout após 10 segundos
                        else if (attempts > 100) {
                            clearInterval(checkLogin);
                        }
                    }, 100);
                }, 300);
            }, true); // Usa capture phase para interceptar antes
        }
    }

    /**
     * Intercepta redirecionamentos para a página de conta
     */
    function interceptAccountRedirect() {
        // Se estamos na página de conta e acabamos de fazer login, redireciona IMEDIATAMENTE
        if (isAccountPage() && loginFormSubmitted) {
            const isLoggedIn = isUserLoggedIn();
            if (isLoggedIn) {
                redirectToHome();
            }
        }
    }
    
    /**
     * Monitora mudanças na URL para interceptar redirecionamentos
     */
    function monitorUrlChanges() {
        let lastUrl = window.location.href;
        
        // Usa MutationObserver para detectar mudanças no DOM que podem indicar redirecionamento
        const observer = new MutationObserver(function() {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                
                // Se foi redirecionado para account após login, redireciona para home
                if (isAccountPage() && loginFormSubmitted && isUserLoggedIn()) {
                    redirectToHome();
                }
            }
        });
        
        // Observa mudanças no body
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Também monitora mudanças na URL usando popstate e hashchange
        window.addEventListener('popstate', function() {
            if (isAccountPage() && loginFormSubmitted && isUserLoggedIn()) {
                redirectToHome();
            }
        });
        
        // Intercepta navegação antes que aconteça
        const originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(history, arguments);
            if (isAccountPage() && loginFormSubmitted && isUserLoggedIn()) {
                setTimeout(redirectToHome, 0);
            }
        };
        
        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            if (isAccountPage() && loginFormSubmitted && isUserLoggedIn()) {
                setTimeout(redirectToHome, 0);
            }
        };
    }

    /**
     * Verifica se acabamos de fazer login e estamos sendo redirecionados para account
     */
    function checkIfJustLoggedIn() {
        // Se estamos na página de account e o usuário está logado, mas não estava antes
        // ou se há um indicador de que acabamos de fazer login
        if (isAccountPage() && isUserLoggedIn()) {
            // Verifica se há um parâmetro na URL ou cookie que indica login recente
            const urlParams = new URLSearchParams(window.location.search);
            const fromLogin = urlParams.get('fromLogin') || sessionStorage.getItem('justLoggedIn');
            
            if (fromLogin === 'true' || !wasLoggedIn) {
                sessionStorage.removeItem('justLoggedIn');
                redirectToHome();
                return true;
            }
        }
        return false;
    }

    /**
     * Inicializa o script
     */
    function init() {
        // Verifica o estado inicial
        checkInitialLoginState();
        
        // Se acabamos de fazer login e estamos na página de account, redireciona imediatamente
        if (checkIfJustLoggedIn()) {
            return;
        }
        
        if (!isOnLoginPage() && !isAccountPage()) {
            return;
        }

        // Intercepta o formulário de login
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                interceptLoginForm();
                interceptAccountRedirect();
                monitorUrlChanges();
            });
        } else {
            interceptLoginForm();
            interceptAccountRedirect();
            monitorUrlChanges();
        }

        // Listener para o evento userChecked
        window.addEventListener('userChecked', handleUserChecked, false);

        // Fallback: verifica periodicamente se o usuário fez login
        let checkInterval = setInterval(function() {
            const isCurrentlyLoggedIn = isUserLoggedIn();
            
            // Se acabou de fazer login e está na página de conta, redireciona IMEDIATAMENTE
            if (isAccountPage() && isCurrentlyLoggedIn && loginFormSubmitted) {
                redirectToHome();
                clearInterval(checkInterval);
                return;
            }
            // Se acabou de fazer login e está na página de login, redireciona
            else if (isOnLoginPage() && isCurrentlyLoggedIn && loginFormSubmitted && !wasLoggedIn) {
                redirectToHome();
                clearInterval(checkInterval);
                return;
            }
            
            // Se não está mais na página de login nem na de account, para de verificar
            if (!isOnLoginPage() && !isAccountPage()) {
                clearInterval(checkInterval);
                return;
            }
            
            wasLoggedIn = isCurrentlyLoggedIn;
        }, 200); // Verifica mais frequentemente (a cada 200ms)

        // Limpa o intervalo após 30 segundos para evitar execução infinita
        setTimeout(function() {
            clearInterval(checkInterval);
        }, 30000);
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

