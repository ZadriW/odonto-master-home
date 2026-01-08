/**
 * Fix para permitir acentos no input fullName na página de cadastro
 */
(function() {
    'use strict';

    let isFixed = false;

    /**
     * Remove restrições de caracteres do input fullName
     */
    function fixFullNameInput() {
        // Procura pelo input fullName na página de signup
        const fullNameInput = document.getElementById('fullName');
        
        if (!fullNameInput || isFixed) {
            return;
        }

        // Remove qualquer atributo pattern que possa estar restringindo caracteres
        if (fullNameInput.hasAttribute('pattern')) {
            fullNameInput.removeAttribute('pattern');
        }

        // Remove qualquer atributo onkeypress que possa estar bloqueando acentos
        if (fullNameInput.hasAttribute('onkeypress')) {
            fullNameInput.removeAttribute('onkeypress');
        }

        // Remove qualquer atributo onkeydown que possa estar bloqueando acentos
        if (fullNameInput.hasAttribute('onkeydown')) {
            fullNameInput.removeAttribute('onkeydown');
        }

        // Remove qualquer atributo oninput que possa estar filtrando caracteres
        const originalOnInput = fullNameInput.getAttribute('oninput');
        if (originalOnInput && (originalOnInput.includes('prevent') || originalOnInput.includes('filter'))) {
            fullNameInput.removeAttribute('oninput');
        }

        // Remove event listeners que possam estar bloqueando acentos
        // Cria um novo input sem os event listeners antigos
        const parent = fullNameInput.parentNode;
        const nextSibling = fullNameInput.nextSibling;
        const value = fullNameInput.value;
        const name = fullNameInput.name;
        const id = fullNameInput.id;
        const className = fullNameInput.className;
        const placeholder = fullNameInput.placeholder;
        const required = fullNameInput.required;
        const type = fullNameInput.type;
        
        // Cria um novo input do zero
        const newInput = document.createElement('input');
        newInput.type = type || 'text';
        newInput.name = name;
        newInput.id = id;
        newInput.className = className;
        if (placeholder) newInput.placeholder = placeholder;
        if (value) newInput.value = value;
        if (required) newInput.required = required;
        
        // Preserva outros atributos importantes, exceto os que bloqueiam acentos
        Array.from(fullNameInput.attributes).forEach(attr => {
            if (attr.name !== 'onkeypress' && 
                attr.name !== 'onkeydown' && 
                attr.name !== 'pattern' &&
                attr.name !== 'type' &&
                attr.name !== 'name' &&
                attr.name !== 'id' &&
                attr.name !== 'class' &&
                attr.name !== 'placeholder' &&
                attr.name !== 'value' &&
                attr.name !== 'required' &&
                !(attr.name === 'oninput' && (attr.value.includes('prevent') || attr.value.includes('filter')))) {
                newInput.setAttribute(attr.name, attr.value);
            }
        });

        // Substitui o input antigo pelo novo
        if (nextSibling) {
            parent.insertBefore(newInput, nextSibling);
        } else {
            parent.appendChild(newInput);
        }
        parent.removeChild(fullNameInput);

        // Garante que o input aceite todos os caracteres Unicode
        newInput.type = 'text';
        
        // Adiciona event listeners que garantem que acentos sejam permitidos
        // Usa capture phase para executar antes de outros listeners
        newInput.addEventListener('keydown', function(e) {
            // Não bloqueia nenhuma tecla - permite tudo, incluindo acentos
            // Acentos são geralmente inseridos via composition events ou keydown
        }, true);

        newInput.addEventListener('keypress', function(e) {
            // Não bloqueia nenhuma tecla - permite tudo, incluindo acentos
        }, true);

        newInput.addEventListener('compositionstart', function(e) {
            // Permite eventos de composição (usados para inserir acentos)
        }, true);

        newInput.addEventListener('compositionupdate', function(e) {
            // Permite atualizações durante a composição (acentos sendo digitados)
        }, true);

        newInput.addEventListener('compositionend', function(e) {
            // Permite finalização da composição (acento inserido)
        }, true);

        newInput.addEventListener('input', function(e) {
            // Permite todos os caracteres, incluindo acentos
            // Não filtra nada
        }, true);

        // Remove qualquer validação HTML5 que possa estar restringindo
        newInput.removeAttribute('pattern');
        
        isFixed = true;
        console.log('Input fullName corrigido para aceitar acentos');
    }

    /**
     * Tenta corrigir o input várias vezes para garantir que funcione
     */
    function attemptFix(maxAttempts) {
        maxAttempts = maxAttempts || 0;
        fixFullNameInput();
        
        // Se ainda não foi corrigido e não excedeu o limite de tentativas, tenta novamente
        if (!isFixed && maxAttempts < 30) {
            setTimeout(function() {
                attemptFix(maxAttempts + 1);
            }, 100);
        }
    }

    // Executa quando o DOM estiver pronto
    function init() {
        attemptFix();
        // Tenta novamente após delays para garantir que o componente wake_login_signup foi carregado
        setTimeout(function() { isFixed = false; attemptFix(); }, 500);
        setTimeout(function() { isFixed = false; attemptFix(); }, 1000);
        setTimeout(function() { isFixed = false; attemptFix(); }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Também executa quando a página estiver totalmente carregada
    window.addEventListener('load', function() {
        isFixed = false;
        attemptFix();
    });

    // Usa MutationObserver para detectar quando o input é adicionado dinamicamente
    const observer = new MutationObserver(function(mutations) {
        if (isFixed) return;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                const fullNameInput = document.getElementById('fullName');
                if (fullNameInput) {
                    isFixed = false; // Reset flag para tentar corrigir novamente
                    attemptFix();
                }
            }
        });
    });

    // Observa mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

