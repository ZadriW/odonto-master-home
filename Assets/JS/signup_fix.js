/**
 * Ajustes da página de cadastro (/login/signup)
 * - Permitir acentos no input fullName
 * - Exibir notificações de erro usando o overlay do carrinho (showOverlay)
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

    /**
     * Verifica se um elemento está realmente visível (não oculto)
     * Verifica o elemento e todos os seus ancestrais
     */
    function isElementVisible(element) {
        if (!element) return false;
        
        // Verifica o elemento e todos os seus ancestrais até o body
        let current = element;
        while (current && current !== document.body) {
            // Verifica classes de ocultação
            if (current.classList.contains('hidden')) return false;
            
            // Verifica estilos computados
            const style = window.getComputedStyle(current);
            if (style.display === 'none' || style.visibility === 'hidden') {
                return false;
            }
            
            // Verifica se está dentro de um container oculto
            if (style.opacity === '0' && style.pointerEvents === 'none') {
                // Pode ser um elemento oculto intencionalmente
            }
            
            current = current.parentElement;
        }
        
        // Verifica se o elemento tem conteúdo (para elementos de erro)
        const text = (element.textContent || '').trim();
        if (text.length === 0) return false;
        
        return true;
    }

    /**
     * Verifica se um input está realmente visível e acessível no formulário
     * Considera containers pais com classes flex/hidden
     */
    function isInputFieldVisible(input) {
        if (!input) return false;
        
        // Verifica o input em si
        const inputStyle = window.getComputedStyle(input);
        if (inputStyle.display === 'none' || inputStyle.visibility === 'hidden') {
            return false;
        }
        
        // Verifica se o input tem a classe hidden
        if (input.classList.contains('hidden')) {
            return false;
        }
        
        // Verifica todos os containers pais até .registration
        let current = input.parentElement;
        const registration = input.closest('.registration');
        
        while (current && current !== registration && current !== document.body) {
            // Verifica classes de ocultação no container (prioridade máxima)
            if (current.classList.contains('hidden')) {
                return false;
            }
            
            // Verifica se o container tem atributo hidden (HTML5)
            if (current.hasAttribute('hidden')) {
                return false;
            }
            
            // Verifica estilos do container
            const containerStyle = window.getComputedStyle(current);
            if (containerStyle.display === 'none' || containerStyle.visibility === 'hidden') {
                return false;
            }
            
            // Verifica se está dentro de um container que alterna entre flex e hidden
            // Se o container tem classes relacionadas a cpf/cnpj, verifica se está visível
            const classList = Array.from(current.classList);
            const classString = classList.join(' ').toLowerCase();
            
            // Verifica se tem classes relacionadas a CPF ou CNPJ
            const hasCpfClass = classString.includes('cpf') && !classString.includes('cnpj');
            const hasCnpjClass = classString.includes('cnpj') && !classString.includes('cpf');
            
            if (hasCpfClass || hasCnpjClass) {
                // Se tem classe relacionada, verifica se está realmente visível
                // Verifica display (deve ser flex, block, ou outro valor visível, não none)
                if (containerStyle.display === 'none' || current.classList.contains('hidden')) {
                    return false;
                }
                // Verifica se tem display: flex mas está oculto de outra forma
                if (containerStyle.display === 'flex' && containerStyle.visibility === 'hidden') {
                    return false;
                }
                // Verifica se tem height: 0 ou width: 0 (pode indicar elemento oculto)
                if (containerStyle.height === '0px' && containerStyle.overflow === 'hidden') {
                    return false;
                }
                // Verifica se o container tem opacity: 0 (elemento invisível)
                if (containerStyle.opacity === '0' && containerStyle.pointerEvents === 'none') {
                    return false;
                }
                // Verifica se o container tem max-height: 0 (pode indicar elemento colapsado)
                if (containerStyle.maxHeight === '0px' && containerStyle.overflow === 'hidden') {
                    return false;
                }
            }
            
            // Verifica se o container tem style inline que o oculta
            const inlineStyle = current.getAttribute('style') || '';
            if (inlineStyle.includes('display: none') || inlineStyle.includes('display:none')) {
                return false;
            }
            if (inlineStyle.includes('visibility: hidden') || inlineStyle.includes('visibility:hidden')) {
                return false;
            }
            
            current = current.parentElement;
        }
        
            // Verificação final: se o input está dentro de um container com display: flex visível
            // ou se está em um container que não tem classes de ocultação
            const finalStyle = window.getComputedStyle(input);
            if (finalStyle.display === 'none' || finalStyle.visibility === 'hidden') {
                return false;
            }
        
        // Verificação adicional: verifica se o input está dentro de um container que tem
        // classes relacionadas a cpf/cnpj e se esse container está visível
        const inputContainer = input.closest('[class*="cpf"], [class*="cnpj"]');
        if (inputContainer) {
            const containerStyle = window.getComputedStyle(inputContainer);
            const containerClasses = Array.from(inputContainer.classList);
            const hasHidden = containerClasses.includes('hidden');
            const hasDisplayNone = containerStyle.display === 'none';
            const hasVisibilityHidden = containerStyle.visibility === 'hidden';
            
            if (hasHidden || hasDisplayNone || hasVisibilityHidden) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Obtém mensagem de erro de validação HTML5
     */
    function getHTML5ValidationMessage(input) {
        if (!input || !input.validity) return null;
        
        if (input.validity.valid) return null;
        
        // Mensagens customizadas baseadas no tipo de erro
        if (input.validity.valueMissing) {
            return 'Este campo é obrigatório';
        }
        if (input.validity.typeMismatch) {
            if (input.type === 'email') {
                return 'E-mail inválido';
            }
            return 'Formato inválido';
        }
        if (input.validity.patternMismatch) {
            return 'Formato inválido';
        }
        if (input.validity.tooShort) {
            return 'Texto muito curto';
        }
        if (input.validity.tooLong) {
            return 'Texto muito longo';
        }
        if (input.validity.rangeUnderflow) {
            return 'Valor muito baixo';
        }
        if (input.validity.rangeOverflow) {
            return 'Valor muito alto';
        }
        if (input.validity.stepMismatch) {
            return 'Valor inválido';
        }
        if (input.validity.badInput) {
            return 'Valor inválido';
        }
        if (input.validity.customError) {
            return input.validationMessage || 'Erro de validação';
        }
        
        // Retorna a mensagem padrão do navegador se disponível
        return input.validationMessage || 'Campo inválido';
    }

    /**
     * Valida formato de email com regex mais robusta
     */
    function validateEmailFormat(email) {
        if (!email || email.trim() === '') {
            return { valid: false, message: 'E-mail é obrigatório' };
        }
        
        const trimmedEmail = email.trim().toLowerCase();
        
        // Regex mais robusta para validação de email
        // Verifica: caracteres antes do @, @ obrigatório, domínio válido, extensão válida
        // Usa RegExp constructor para evitar problemas com caracteres especiais no editor
        const emailRegexPattern = '^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$';
        const emailRegex = new RegExp(emailRegexPattern, 'i');
        
        // Verifica formato básico
        if (!emailRegex.test(trimmedEmail)) {
            return { valid: false, message: 'E-mail inválido. Verifique se o formato está correto (exemplo: seuemail@dominio.com)' };
        }
        
        // Verifica se não começa ou termina com ponto ou @
        if (trimmedEmail.startsWith('.') || trimmedEmail.startsWith('@') || 
            trimmedEmail.endsWith('.') || trimmedEmail.endsWith('@')) {
            return { valid: false, message: 'E-mail inválido. Verifique se não há pontos ou @ no início ou fim' };
        }
        
        // Verifica se não tem espaços
        if (trimmedEmail.includes(' ')) {
            return { valid: false, message: 'E-mail inválido. Não pode conter espaços' };
        }
        
        // Verifica se tem pelo menos um ponto após o @
        const parts = trimmedEmail.split('@');
        if (parts.length !== 2) {
            return { valid: false, message: 'E-mail inválido. Deve conter exatamente um @' };
        }
        
        const domain = parts[1];
        if (!domain.includes('.')) {
            return { valid: false, message: 'E-mail inválido. O domínio deve conter pelo menos um ponto (ex: .com, .com.br)' };
        }
        
        // Verifica se o domínio tem extensão válida (pelo menos 2 caracteres)
        const domainParts = domain.split('.');
        if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
            return { valid: false, message: 'E-mail inválido. A extensão do domínio deve ter pelo menos 2 caracteres' };
        }
        
        // Verifica tamanho máximo (RFC 5321)
        if (trimmedEmail.length > 254) {
            return { valid: false, message: 'E-mail inválido. O e-mail é muito longo (máximo 254 caracteres)' };
        }
        
        // Verifica tamanho da parte local (antes do @) - máximo 64 caracteres
        if (parts[0].length > 64) {
            return { valid: false, message: 'E-mail inválido. A parte antes do @ é muito longa (máximo 64 caracteres)' };
        }
        
        return { valid: true, message: null };
    }

    /**
     * Verifica se o email já está cadastrado no sistema
     * Verifica mensagens de erro do Wake que indicam email duplicado
     */
    function checkEmailExists(emailInput, form) {
        if (!emailInput || !form) return null;
        
        const email = (emailInput.value || '').trim();
        if (!email) return null;
        
        // Verifica se há mensagens de erro do Wake indicando email duplicado
        const formContainer = form.closest('.wake-signup-wrapper') || form;
        const registration = form.querySelector('.registration') || form;
        
        // Busca por mensagens de erro relacionadas a email duplicado
        const errorSelectors = [
            '#error-email',
            '#email ~ .error',
            '#email ~ .error-absolute',
            '.error:not(.hidden)',
            '.error-absolute:not(.hidden)'
        ];
        
        for (let selector of errorSelectors) {
            const errorElements = formContainer.querySelectorAll(selector);
            errorElements.forEach(errorEl => {
                if (isElementVisible(errorEl)) {
                    const errorText = (errorEl.textContent || '').toLowerCase().trim();
                    // Verifica se a mensagem indica email duplicado/cadastrado
                    if (errorText.includes('já cadastrado') || 
                        errorText.includes('já existe') || 
                        errorText.includes('already exists') ||
                        errorText.includes('já está cadastrado') ||
                        errorText.includes('email já') ||
                        errorText.includes('duplicado') ||
                        errorText.includes('duplicate')) {
                        return 'Este e-mail já está cadastrado. Use outro e-mail ou faça login';
                    }
                }
            });
        }
        
        // Verifica se o input tem atributo de erro customizado
        if (emailInput.validationMessage) {
            const validationMsg = emailInput.validationMessage.toLowerCase();
            if (validationMsg.includes('já cadastrado') || 
                validationMsg.includes('já existe') || 
                validationMsg.includes('already exists') ||
                validationMsg.includes('duplicado') ||
                validationMsg.includes('duplicate')) {
                return 'Este e-mail já está cadastrado. Use outro e-mail ou faça login';
            }
        }
        
        return null;
    }

    /**
     * Validações customizadas para campos específicos
     */
    function getCustomValidationError(input, fieldId) {
        const value = (input.value || '').trim();
        
        switch (fieldId) {
            case 'email':
                // Valida formato do email
                const emailValidation = validateEmailFormat(value);
                if (!emailValidation.valid) {
                    return emailValidation.message;
                }
                // Verifica se o email já está cadastrado
                const emailExistsError = checkEmailExists(input, input.form || input.closest('form'));
                if (emailExistsError) {
                    return emailExistsError;
                }
                break;
            case 'cpf':
                if (value && value.replace(/\D/g, '').length !== 11) {
                    return 'CPF deve conter 11 dígitos';
                }
                break;
            case 'cnpj':
                if (value && value.replace(/\D/g, '').length !== 14) {
                    return 'CNPJ deve conter 14 dígitos';
                }
                break;
            case 'password':
                if (value && value.length < 6) {
                    return 'Senha deve ter pelo menos 6 caracteres';
                }
                break;
            case 'password_confirmation':
                const passwordInput = input.form.querySelector('#password');
                if (passwordInput && value !== passwordInput.value) {
                    return 'As senhas não coincidem';
                }
                break;
            case 'primaryPhoneNumber':
                if (value && value.replace(/\D/g, '').length < 8) {
                    return 'Telefone inválido';
                }
                break;
            case 'cep':
            case 'cepElement':
            case 'zipcode':
            case 'postalCode':
                // CEP deve ter 8 dígitos (formato: 00000-000 ou 00000000)
                const cepDigits = value.replace(/\D/g, '');
                if (value && cepDigits.length !== 8) {
                    return 'CEP deve conter 8 dígitos';
                }
                // Valida formato básico de CEP brasileiro
                if (value && cepDigits.length === 8) {
                    // CEP não pode ser 00000000, 11111111, etc.
                    if (/^(\d)\1{7}$/.test(cepDigits)) {
                        return 'CEP inválido';
                    }
                }
                break;
        }
        
        return null;
    }

    /**
     * Detecta o tipo de cadastro selecionado (Pessoa Física ou Pessoa Jurídica)
     * @returns {string} 'PF' para Pessoa Física, 'PJ' para Pessoa Jurídica, ou null se não detectado
     */
    function detectRegistrationType(form) {
        if (!form) return null;

        // Estratégia 1: Procura por inputs dentro de .custom-cpf-cnpj (mais comum no Wake)
        const cpfCnpjContainer = form.querySelector('.custom-cpf-cnpj');
        if (cpfCnpjContainer) {
            const radios = cpfCnpjContainer.querySelectorAll('input[type="radio"]');
            for (let i = 0; i < radios.length; i++) {
                const radio = radios[i];
                if (radio.checked) {
                    const value = (radio.value || '').toUpperCase();
                    const label = radio.closest('label');
                    const labelText = label ? (label.textContent || '').toUpperCase() : '';
                    
                    // Verifica pelo valor do radio
                    if (value.includes('PERSON') || value.includes('PF') || value.includes('CPF') || 
                        labelText.includes('FÍSICA') || labelText.includes('FISICA')) {
                        return 'PF';
                    }
                    if (value.includes('COMPANY') || value.includes('PJ') || value.includes('CNPJ') ||
                        labelText.includes('JURÍDICA') || labelText.includes('JURIDICA')) {
                        return 'PJ';
                    }
                }
            }
        }

        // Estratégia 2: Procura por radio buttons de tipo de cadastro
        const customerTypeRadio = form.querySelector('input[type="radio"][name*="customerType"], input[type="radio"][name*="type"], input[type="radio"][value*="PERSON"], input[type="radio"][value*="COMPANY"]');
        if (customerTypeRadio) {
            const checkedRadio = form.querySelector('input[type="radio"][name="' + customerTypeRadio.name + '"]:checked');
            if (checkedRadio) {
                const value = (checkedRadio.value || '').toUpperCase();
                if (value.includes('PERSON') || value.includes('PF') || value.includes('CPF')) {
                    return 'PF';
                }
                if (value.includes('COMPANY') || value.includes('PJ') || value.includes('CNPJ')) {
                    return 'PJ';
                }
            }
        }

        // Estratégia 3: Verifica qual campo está visível/preenchido (CPF ou CNPJ)
        // Usa a função isInputFieldVisible para verificar corretamente
        const cpfInput = form.querySelector('#cpf');
        const cnpjInput = form.querySelector('#cnpj');
        
        if (cpfInput && cnpjInput) {
            const cpfVisible = isInputFieldVisible(cpfInput);
            const cnpjVisible = isInputFieldVisible(cnpjInput);
            const cpfValue = (cpfInput.value || '').trim();
            const cnpjValue = (cnpjInput.value || '').trim();
            
            // Se CPF está visível e CNPJ está oculto
            if (cpfVisible && !cnpjVisible) {
                return 'PF';
            }
            
            // Se CNPJ está visível e CPF está oculto
            if (cnpjVisible && !cpfVisible) {
                return 'PJ';
            }
            
            // Se ambos estão visíveis, verifica qual tem valor
            if (cpfVisible && cnpjVisible) {
                if (cpfValue && !cnpjValue) {
                    return 'PF';
                }
                if (cnpjValue && !cpfValue) {
                    return 'PJ';
                }
            }
            
            // Se apenas um está visível, retorna baseado na visibilidade
            if (cpfVisible) return 'PF';
            if (cnpjVisible) return 'PJ';
        }

        // Estratégia 4: Verifica containers com classes cpf/cnpj e sua visibilidade
        const registration = form.querySelector('.registration');
        if (registration) {
            // Procura por containers com classe .cpf ou .cnpj
            const cpfContainers = registration.querySelectorAll('.cpf, [class*="cpf"]');
            const cnpjContainers = registration.querySelectorAll('.cnpj, [class*="cnpj"]');
            
            let cpfVisible = false;
            let cnpjVisible = false;
            
            // Verifica se containers CPF estão visíveis
            cpfContainers.forEach(container => {
                const style = window.getComputedStyle(container);
                if (style.display !== 'none' && !container.classList.contains('hidden')) {
                    cpfVisible = true;
                }
            });
            
            // Verifica se containers CNPJ estão visíveis
            cnpjContainers.forEach(container => {
                const style = window.getComputedStyle(container);
                if (style.display !== 'none' && !container.classList.contains('hidden')) {
                    cnpjVisible = true;
                }
            });
            
            if (cpfVisible && !cnpjVisible) {
                return 'PF';
            }
            if (cnpjVisible && !cpfVisible) {
                return 'PJ';
            }
            
            // Verifica classes na própria registration
            if (registration.classList.contains('cpf')) {
                return 'PF';
            }
            if (registration.classList.contains('cnpj')) {
                return 'PJ';
            }
        }

        // Padrão: assume Pessoa Física se não conseguir detectar
        return 'PF';
    }

    /**
     * Verifica se um campo deve ser validado baseado no tipo de cadastro
     */
    function shouldValidateField(fieldId, registrationType) {
        // Campos comuns a ambos os tipos
        const commonFields = ['email', 'primaryPhoneAreaCode', 'primaryPhoneNumber', 'password', 'password_confirmation', 'cep', 'cepElement', 'zipcode', 'postalCode'];
        if (commonFields.includes(fieldId)) {
            return true;
        }

        // Campos específicos de Pessoa Física
        const pfFields = ['fullName', 'cpf', 'birthDate'];
        if (registrationType === 'PF' && pfFields.includes(fieldId)) {
            return true;
        }

        // Campos específicos de Pessoa Jurídica
        const pjFields = ['cnpj', 'stateRegistration', 'corporatename'];
        if (registrationType === 'PJ' && pjFields.includes(fieldId)) {
            return true;
        }

        // Se o tipo não foi detectado, valida apenas campos comuns
        if (!registrationType) {
            return commonFields.includes(fieldId);
        }

        return false;
    }

    /**
     * Coleta erros do formulário de cadastro (wake-signup)
     * Retorna uma lista de mensagens de erro legíveis
     */
    function collectSignupErrors(form) {
        if (!form) return [];

        const errors = [];

        // Detecta o tipo de cadastro
        const registrationType = detectRegistrationType(form);

        // Mapeia campos importantes com seus labels amigáveis
        const fieldMap = [
            { id: 'email', label: 'E-mail' },
            { id: 'fullName', label: 'Nome completo' },
            { id: 'cpf', label: 'CPF' },
            { id: 'cnpj', label: 'CNPJ' },
            { id: 'corporatename', label: 'Razão Social' },
            { id: 'primaryPhoneAreaCode', label: 'DDD' },
            { id: 'primaryPhoneNumber', label: 'Telefone' },
            { id: 'birthDate', label: 'Data de nascimento' },
            { id: 'password', label: 'Senha' },
            { id: 'password_confirmation', label: 'Confirmação de senha' },
            { id: 'stateRegistration', label: 'Inscrição Estadual' },
            { id: 'cep', label: 'CEP' },
            { id: 'cepElement', label: 'CEP' },
            { id: 'zipcode', label: 'CEP' },
            { id: 'postalCode', label: 'CEP' }
        ];

        const registration = form.querySelector('.registration') || form;
        const formContainer = form.closest('.wake-signup-wrapper') || form;

        // Verifica erros globais do formulário (ex: senha inválida)
        // Apenas se forem relevantes ao tipo de cadastro selecionado
        const globalErrors = formContainer.querySelectorAll('#invalidPassword, [id$="-error"], .error:not([id]), .error-absolute:not([id])');
        globalErrors.forEach(globalError => {
            if (isElementVisible(globalError)) {
                const errorText = (globalError.textContent || '').trim();
                if (errorText) {
                    // Tenta associar o erro a um campo específico
                    let associatedField = null;
                    const errorId = globalError.id || '';
                    
                    // Verifica se é erro de senha
                    if (errorId === 'invalidPassword' || errorText.toLowerCase().includes('senha')) {
                        associatedField = 'password';
                    }
                    
                    // Verifica se é erro relacionado a CPF/CNPJ e filtra baseado no tipo
                    if (errorId.includes('cpf') || errorText.toLowerCase().includes('cpf')) {
                        if (registrationType === 'PF') {
                            associatedField = 'cpf';
                        } else {
                            return; // Ignora erro de CPF se for PJ
                        }
                    }
                    if (errorId.includes('cnpj') || errorText.toLowerCase().includes('cnpj')) {
                        if (registrationType === 'PJ') {
                            associatedField = 'cnpj';
                        } else {
                            return; // Ignora erro de CNPJ se for PF
                        }
                    }
                    
                    if (associatedField && shouldValidateField(associatedField, registrationType)) {
                        // Verifica se o campo relacionado está realmente visível
                        const relatedInput = registration.querySelector('#' + associatedField);
                        if (relatedInput && isInputFieldVisible(relatedInput)) {
                            const fieldInfo = fieldMap.find(f => f.id === associatedField);
                            if (fieldInfo) {
                                errors.push({
                                    field: associatedField,
                                    label: fieldInfo.label,
                                    message: errorText
                                });
                            }
                        }
                    }
                }
            }
        });

        fieldMap.forEach(field => {
            const input = registration.querySelector('#' + field.id);
            if (!input) return;

            // PRIMEIRA VERIFICAÇÃO: Verifica se o campo está realmente visível
            // Esta é a verificação mais importante - ignora campos ocultos independente do tipo
            if (!isInputFieldVisible(input)) {
                return; // Ignora campos ocultos (não importa o tipo)
            }

            // SEGUNDA VERIFICAÇÃO: Verifica se o campo deve ser validado baseado no tipo de cadastro
            // Apenas após confirmar que está visível
            if (!shouldValidateField(field.id, registrationType)) {
                return; // Ignora campos do tipo não selecionado (mesmo que visíveis)
            }

            let errorMessage = null;
            let errorFound = false;

            // 1) Verifica validação HTML5 nativa (apenas se o campo estiver visível)
            if (isInputFieldVisible(input) && input.validity && !input.validity.valid) {
                const html5Error = getHTML5ValidationMessage(input);
                if (html5Error) {
                    errorMessage = html5Error;
                    errorFound = true;
                }
            }

            // 2) Verifica validações customizadas (apenas se o campo estiver visível)
            if (!errorFound && isInputFieldVisible(input)) {
                const customError = getCustomValidationError(input, field.id);
                if (customError) {
                    errorMessage = customError;
                    errorFound = true;
                }
            }

            // 3) Procura spans de erro associados ao campo (múltiplas estratégias)
            if (!errorFound) {
                let errorEl = null;

            // 3a) Erros com id específico (ex: #error-email, #error-cpf)
            // Apenas se o campo relacionado estiver visível
            const specificError = formContainer.querySelector('#error-' + field.id);
            if (specificError && isElementVisible(specificError) && isInputFieldVisible(input)) {
                errorEl = specificError;
            }

            // 3b) Erros logo após o input (siblings)
            // Apenas se o campo relacionado estiver visível
            if (!errorEl && isInputFieldVisible(input)) {
                let current = input.nextElementSibling;
                let maxSiblings = 5; // Limita busca para evitar loops infinitos
                let count = 0;
                while (current && count < maxSiblings) {
                    if ((current.classList.contains('error') || 
                         current.classList.contains('error-absolute') ||
                         current.id === 'error-' + field.id ||
                         current.id && current.id.startsWith('error-')) &&
                        isElementVisible(current)) {
                        errorEl = current;
                        break;
                    }
                    current = current.nextElementSibling;
                    count++;
                }
            }

            // 3c) Procura no container pai direto (apenas se o campo estiver visível)
            if (!errorEl && isInputFieldVisible(input)) {
                const parent = input.parentElement;
                if (parent) {
                    const parentError = parent.querySelector('.error, .error-absolute, [id^="error-"]');
                    if (parentError && isElementVisible(parentError)) {
                        // Verifica se o erro está relacionado a este campo
                        const errorId = parentError.id || '';
                        if (errorId.includes(field.id) || errorId === 'error-' + field.id) {
                            errorEl = parentError;
                        }
                    }
                }
            }

            // 3d) Procura no container avô (para campos aninhados) (apenas se o campo estiver visível)
            if (!errorEl && isInputFieldVisible(input)) {
                const grandParent = input.parentElement?.parentElement;
                if (grandParent) {
                    const grandParentError = grandParent.querySelector('.error, .error-absolute, [id^="error-"]');
                    if (grandParentError && isElementVisible(grandParentError)) {
                        const errorId = grandParentError.id || '';
                        if (errorId.includes(field.id) || errorId === 'error-' + field.id) {
                            errorEl = grandParentError;
                        }
                    }
                }
            }

            // 3e) Busca global por ID (apenas se o campo estiver visível)
            if (!errorEl && isInputFieldVisible(input)) {
                const errorById = document.getElementById('error-' + field.id);
                if (errorById && isElementVisible(errorById)) {
                    errorEl = errorById;
                }
            }

            // 3f) Busca por elementos com classes de erro próximos (apenas se o campo estiver visível)
            if (!errorEl && isInputFieldVisible(input)) {
                const allErrors = formContainer.querySelectorAll('.error, .error-absolute, [id^="error-"]');
                allErrors.forEach(err => {
                    if (isElementVisible(err)) {
                        // Verifica se está próximo ao input
                        const errId = err.id || '';
                        const errText = (err.textContent || '').toLowerCase();
                        if (errId.includes(field.id) || errText.includes(field.label.toLowerCase())) {
                            errorEl = err;
                        }
                    }
                });
            }

            // 3g) Busca por elementos com id específicos do Wake
            if (!errorEl) {
                const wakeErrorIds = [
                    'invalidPassword',
                    'corporatename-error',
                    field.id + '-error'
                ];
                wakeErrorIds.forEach(errId => {
                    const err = document.getElementById(errId);
                    if (err && isElementVisible(err)) {
                        // Verifica se o campo relacionado está visível antes de considerar o erro
                        const relatedInput = form.querySelector('#' + field.id);
                        if (relatedInput && isInputFieldVisible(relatedInput)) {
                            errorEl = err;
                        }
                    }
                });
            }

            if (errorEl) {
                const msg = (errorEl.textContent || '').trim();
                if (msg && msg.length > 0) {
                    // Verifica novamente se o campo está visível antes de adicionar o erro
                    if (isInputFieldVisible(input)) {
                        errorMessage = msg;
                        errorFound = true;
                    }
                }
            }

            // 4) Verifica se o campo é obrigatório e está vazio
            // Apenas se o campo estiver realmente visível
            if (!errorFound && isInputFieldVisible(input) && input.required && (!input.value || input.value.trim() === '')) {
                errorMessage = 'Este campo é obrigatório';
                errorFound = true;
            }

            // Adiciona o erro à lista se encontrado
            if (errorFound && errorMessage) {
                // Verifica se já existe um erro para este campo (evita duplicatas)
                const existingError = errors.find(e => e.field === field.id);
                if (!existingError) {
                    errors.push({
                        field: field.id,
                        label: field.label,
                        message: errorMessage
                    });
                }
            }
        });
    
        // Verifica CEP separadamente (pode ter IDs diferentes)
        const cepInputs = registration.querySelectorAll('#cep, #cepElement, input[name="cep"], input[id*="cep" i], input[id*="zipcode" i], input[id*="postalCode" i]');
        cepInputs.forEach(cepInput => {
            if (isInputFieldVisible(cepInput)) {
                const cepValue = (cepInput.value || '').trim();
                const cepDigits = cepValue.replace(/\D/g, '');
                
                // Verifica se CEP é obrigatório e está vazio
                if ((cepInput.required || cepInput.hasAttribute('required')) && (!cepValue || cepDigits.length === 0)) {
                    const existingCepError = errors.find(e => e.field === 'cep' || e.field === 'cepElement');
                    if (!existingCepError) {
                        errors.push({
                            field: cepInput.id || 'cep',
                            label: 'CEP',
                            message: 'CEP é obrigatório'
                        });
                    }
                } else if (cepValue && cepDigits.length !== 8) {
                    // CEP preenchido mas inválido
                    const existingCepError = errors.find(e => e.field === 'cep' || e.field === 'cepElement');
                    if (!existingCepError) {
                        errors.push({
                            field: cepInput.id || 'cep',
                            label: 'CEP',
                            message: 'CEP deve conter 8 dígitos'
                        });
                    }
                }
            }
        });

        // Remove duplicatas baseadas no campo
        const uniqueErrors = [];
        const seenFields = new Set();
        errors.forEach(error => {
            if (!seenFields.has(error.field)) {
                seenFields.add(error.field);
                uniqueErrors.push(error);
            }
        });

        return uniqueErrors;
    }

    /**
     * Verifica se a função showOverlay está disponível
     * Se não estiver, cria uma implementação básica
     */
    function ensureShowOverlay() {
        if (typeof window.showOverlay === 'function') {
            return true;
        }

        // Cria uma implementação básica se não existir
        window.showOverlay = function(title, message, isError) {
            const overlay = document.querySelector('.wake-overlay');
            if (!overlay) {
                console.warn('Overlay container não encontrado. Certifique-se de que {{ wake_overlay }} está incluído na página.');
                // Fallback para alert
                alert((isError ? 'Erro: ' : '') + title + '\n\n' + message);
                return;
            }

            // Remove notificações anteriores
            const existingWrappers = overlay.querySelectorAll('.overlay-wrapper');
            existingWrappers.forEach(wrapper => {
                wrapper.remove();
            });

            // Cria o wrapper da notificação
            const wrapper = document.createElement('div');
            wrapper.className = 'overlay-wrapper';
            
            const content = document.createElement('div');
            content.className = 'overlay-content';
            
            // Status (ícone)
            const status = document.createElement('div');
            status.className = 'status';
            const icon = document.createElement('div');
            icon.className = isError ? 'error' : 'success';
            if (isError) {
                icon.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
            } else {
                icon.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
            }
            status.appendChild(icon);
            
            // Mensagem
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            const titleEl = document.createElement('p');
            titleEl.className = 'title';
            titleEl.textContent = title;
            const messageEl = document.createElement('p');
            messageEl.className = 'text';
            // Converte quebras de linha em <br>
            messageEl.innerHTML = message.replace(/\n/g, '<br>');
            messageDiv.appendChild(titleEl);
            messageDiv.appendChild(messageEl);
            
            content.appendChild(status);
            content.appendChild(messageDiv);
            wrapper.appendChild(content);
            
            // Adiciona ao overlay
            const overlayBox = overlay.querySelector('.overlay-box') || overlay;
            overlayBox.appendChild(wrapper);
            
            // Mostra o overlay
            overlay.style.display = 'flex';
            
            // Remove após 5 segundos (ou 8 segundos para erros)
            setTimeout(function() {
                wrapper.style.transition = 'opacity 0.3s ease';
                wrapper.style.opacity = '0';
                setTimeout(function() {
                    wrapper.remove();
                    // Se não houver mais notificações, esconde o overlay
                    if (!overlay.querySelector('.overlay-wrapper')) {
                        overlay.style.display = 'none';
                    }
                }, 300);
            }, isError ? 8000 : 5000);
        };

        return true;
    }

    /**
     * Inicializa o listener de submit do formulário de cadastro para mostrar overlay de erros
     */
    function initSignupErrorOverlay() {
        const wrapper = document.querySelector('.wake-signup-wrapper');
        if (!wrapper) return;

        const form = wrapper.querySelector('form');
        if (!form || form.dataset.signupOverlayBound === 'true') return;

        // Garante que showOverlay existe
        ensureShowOverlay();

        // Usa capture phase para garantir que nosso listener execute antes
        const submitHandler = function (e) {
            // Previne o submit imediatamente para verificar erros
            e.preventDefault();
            e.stopImmediatePropagation(); // Previne que outros listeners executem
            e.stopPropagation();
            
            // Marca que estamos processando para evitar múltiplos submits
            if (form.dataset.submitting === 'true') {
                return; // Já está processando
            }
            form.dataset.submitting = 'true';
            
            // Força validação HTML5 em todos os campos visíveis
            const allInputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
            allInputs.forEach(input => {
                // Apenas valida campos visíveis
                if (isInputFieldVisible(input)) {
                    if (input.checkValidity) {
                        input.checkValidity();
                    }
                    // Dispara eventos de validação para que o Wake possa processar
                    ['blur', 'input', 'change'].forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true, cancelable: true });
                        input.dispatchEvent(event);
                    });
                }
            });
            
            // Função para verificar erros com múltiplas tentativas
            let attempts = 0;
            const maxAttempts = 4; // Aumentado para dar mais tempo ao Wake
            
            const checkErrors = function() {
                attempts++;
                
                // Coleta erros
                const errors = collectSignupErrors(form);
                
                // Se não encontrou erros mas ainda não tentou todas as vezes, tenta novamente
                if (errors.length === 0 && attempts < maxAttempts) {
                    setTimeout(checkErrors, 250);
                    return;
                }
                
                // Remove flag de processamento
                form.dataset.submitting = 'false';
                
                if (errors.length > 0) {
                    const title = 'Erros no cadastro';
                    const message = 'Por favor, corrija os campos abaixo:\n\n' + errors.map(function (error) {
                        return '• ' + error.label + ': ' + error.message;
                    }).join('\n');

                    // Foca no primeiro campo com erro
                    if (errors.length > 0) {
                        const firstError = errors[0];
                        // Tenta encontrar o campo por vários IDs possíveis
                        let firstInput = form.querySelector('#' + firstError.field);
                        if (!firstInput) {
                            // Tenta variações do ID
                            const fieldVariations = [
                                firstError.field,
                                firstError.field.toLowerCase(),
                                firstError.field.toUpperCase(),
                                'cepElement',
                                'cep',
                                'zipcode',
                                'postalCode'
                            ];
                            for (let id of fieldVariations) {
                                firstInput = form.querySelector('#' + id);
                                if (firstInput) break;
                            }
                        }
                        
                        if (firstInput && typeof firstInput.focus === 'function' && isInputFieldVisible(firstInput)) {
                            // Scroll suave até o campo
                            firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setTimeout(function() {
                                firstInput.focus();
                                // Destaca o campo com erro
                                firstInput.style.borderColor = '#ef4444';
                                firstInput.style.borderWidth = '2px';
                                setTimeout(function() {
                                    firstInput.style.borderColor = '';
                                    firstInput.style.borderWidth = '';
                                }, 3000);
                            }, 300);
                        }
                    }

                    if (typeof showOverlay === 'function') {
                        showOverlay(title, message, true);
                    } else {
                        console.error('showOverlay function not available');
                        alert(title + '\n\n' + message);
                    }
                    
                    // NÃO permite o submit - mantém o formulário na página
                    return false;
                } else {
                    // Se não há erros, permite o submit
                    // Remove o listener temporariamente para evitar loop
                    form.removeEventListener('submit', submitHandler, true);
                    // Remove a flag de processamento
                    form.dataset.submitting = 'false';
                    // Submete o formulário
                    form.submit();
                }
            };
            
            // Inicia a verificação após um delay inicial
            setTimeout(checkErrors, 400);
        };
        
        // Adiciona o listener com capture phase e alta prioridade
        form.addEventListener('submit', submitHandler, { capture: true, passive: false });
        
        // Também intercepta cliques no botão de submit
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                // Se o formulário tem erros, previne o clique
                setTimeout(function() {
                    const errors = collectSignupErrors(form);
                    if (errors.length > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                    }
                }, 100);
            }, true);
        }

        form.dataset.signupOverlayBound = 'true';
    }

    /**
     * Adiciona validação em tempo real para o campo de email
     */
    function setupEmailRealTimeValidation() {
        const emailInput = document.getElementById('email');
        if (!emailInput) return;
        
        // Valida quando o usuário sai do campo (blur)
        emailInput.addEventListener('blur', function() {
            const email = (this.value || '').trim();
            if (!email) return;
            
            // Valida formato
            const emailValidation = validateEmailFormat(email);
            if (!emailValidation.valid) {
                // Define mensagem de erro customizada
                this.setCustomValidity(emailValidation.message);
                // Dispara evento invalid para que o Wake possa processar
                this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
            } else {
                // Remove mensagem de erro se o formato estiver correto
                this.setCustomValidity('');
            }
        }, true);
        
        // Valida quando o usuário digita (input) - apenas formato básico
        emailInput.addEventListener('input', function() {
            const email = (this.value || '').trim();
            if (email) {
                const emailValidation = validateEmailFormat(email);
                if (!emailValidation.valid) {
                    this.setCustomValidity(emailValidation.message);
                } else {
                    this.setCustomValidity('');
                }
            } else {
                this.setCustomValidity('');
            }
        }, true);
        
        // Valida após mudanças no DOM (para capturar erros do Wake sobre email duplicado)
        const emailObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // Verifica se há novos elementos de erro relacionados ao email
                    const emailExistsError = checkEmailExists(emailInput, emailInput.form || emailInput.closest('form'));
                    if (emailExistsError) {
                        emailInput.setCustomValidity(emailExistsError);
                        emailInput.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
                    }
                }
            });
        });
        
        // Observa mudanças no container do formulário
        const formContainer = emailInput.closest('.wake-signup-wrapper') || emailInput.closest('form');
        if (formContainer) {
            emailObserver.observe(formContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

    // Executa quando o DOM estiver pronto
    function init() {
        attemptFix();
        initSignupErrorOverlay();
        setupEmailRealTimeValidation();
        // Tenta novamente após delays para garantir que o componente wake_login_signup foi carregado
        setTimeout(function() { isFixed = false; attemptFix(); initSignupErrorOverlay(); setupEmailRealTimeValidation(); }, 500);
        setTimeout(function() { isFixed = false; attemptFix(); initSignupErrorOverlay(); setupEmailRealTimeValidation(); }, 1000);
        setTimeout(function() { isFixed = false; attemptFix(); initSignupErrorOverlay(); setupEmailRealTimeValidation(); }, 2000);
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
        initSignupErrorOverlay();
        setupEmailRealTimeValidation();
    });

    // Usa MutationObserver para detectar quando o input/form é adicionado dinamicamente
    const observer = new MutationObserver(function(mutations) {
        if (!isFixed) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    const fullNameInput = document.getElementById('fullName');
                    if (fullNameInput) {
                        isFixed = false; // Reset flag para tentar corrigir novamente
                        attemptFix();
                    }
                }
            });
        }

        // Sempre que houver mudanças, tenta inicializar o overlay de erros se o formulário estiver disponível
        initSignupErrorOverlay();
        setupEmailRealTimeValidation();
    });

    // Observa mudanças no DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

