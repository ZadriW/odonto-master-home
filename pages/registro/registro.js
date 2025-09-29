document.addEventListener('DOMContentLoaded', function() {
    console.log('Registration page loaded - DOMContentLoaded event fired');
    
    // Helper function to check if an element is visible
    function isElementVisible(element) {
        return element && element.offsetParent !== null;
    }
    
    // Completely disable autocomplete for all form fields
    function disableAllAutocomplete() {
        // Get all input, select, and textarea elements in the form
        const allFields = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
        
        allFields.forEach(field => {
            // Set multiple attributes to prevent autocomplete
            field.setAttribute('autocomplete', 'off');
            field.setAttribute('autocorrect', 'off');
            field.setAttribute('autocapitalize', 'off');
            field.setAttribute('spellcheck', 'false');
            
            // For additional protection, we can also:
            // 1. Clear any values that might have been auto-filled
            // 2. Add event listeners to prevent auto-fill
            field.addEventListener('focus', function() {
                // Clear any auto-filled values when field is focused
                if (this.hasAttribute('value') && this.value !== this.getAttribute('value')) {
                    this.value = this.getAttribute('value') || '';
                }
            });
            
            // Prevent paste events that might trigger autocomplete
            field.addEventListener('paste', function(e) {
                e.preventDefault();
                return false;
            });
        });
        
        // Also set these attributes on the form itself
        const form = document.getElementById('registrationForm');
        if (form) {
            form.setAttribute('autocomplete', 'off');
            form.setAttribute('autocorrect', 'off');
            form.setAttribute('autocapitalize', 'off');
            form.setAttribute('spellcheck', 'false');
        }
    }
    
    // Call the function to disable autocomplete
    disableAllAutocomplete();
    
    // Person type tabs
    
    // Helper function to show notifications
    function showNotification(message, type = 'info') {
        // Try to use the global notification system first
        if (typeof window.app !== 'undefined' && window.app.modules && window.app.modules.notifications) {
            switch(type) {
                case 'success':
                    window.app.modules.notifications.success(message);
                    break;
                case 'error':
                    window.app.modules.notifications.error(message);
                    break;
                case 'warning':
                    window.app.modules.notifications.warning(message);
                    break;
                default:
                    window.app.modules.notifications.info(message);
            }
            return;
        }
        
        // Fallback to custom notification if global system is not available
        createCustomNotification(message, type);
    }
    
    // Function to create a custom notification if the global system is not available
    function createCustomNotification(message, type) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification custom-notification--${type}`;
        notification.innerHTML = `
            <div class="custom-notification__content">
                <span class="custom-notification__message">${message}</span>
                <button class="custom-notification__close" aria-label="Fechar notificação">&times;</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                min-width: 300px;
                max-width: 500px;
                padding: 15px;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease-out;
                font-family: 'Inter', sans-serif;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .custom-notification--success {
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            
            .custom-notification--error {
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            
            .custom-notification--warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
            }
            
            .custom-notification--info {
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                color: #0c5460;
            }
            
            .custom-notification__content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .custom-notification__message {
                flex: 1;
                margin-right: 10px;
            }
            
            .custom-notification__close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        
        // Add the style to the document
        document.head.appendChild(style);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.custom-notification__close');
        closeBtn.addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
    
    // Person type tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const individualFields = document.getElementById('individualFields');
    const companyFields = document.getElementById('companyFields');
    const individualProfessionalFields = document.getElementById('individualProfessionalFields');
    const companyProfessionalFields = document.getElementById('companyProfessionalFields');
    const professionalInfoSection = document.getElementById('professionalInfoSection');
    const errorNotification = document.getElementById('errorNotification');
    const errorList = document.getElementById('errorList');
    
    console.log('Elements found:', {
        tabButtons: tabButtons.length,
        individualFields: !!individualFields,
        companyFields: !!companyFields,
        individualProfessionalFields: !!individualProfessionalFields,
        companyProfessionalFields: !!companyProfessionalFields,
        professionalInfoSection: !!professionalInfoSection,
        errorNotification: !!errorNotification,
        errorList: !!errorList
    });
    
    // Check if all required elements are found
    if (!individualFields || !companyFields || !individualProfessionalFields || !companyProfessionalFields || !professionalInfoSection) {
        console.error('Some required elements were not found on the page');
        return;
    }
    
    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Tab clicked:', this.dataset.type);
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide fields based on selected tab
            if (this.dataset.type === 'individual') {
                individualFields.style.display = 'block';
                companyFields.style.display = 'none';
                individualProfessionalFields.style.display = 'block';
                companyProfessionalFields.style.display = 'none';
                professionalInfoSection.querySelector('.section-title').textContent = 'Informações - Pessoa Física';
                console.log('Switched to individual person form');
            } else {
                individualFields.style.display = 'none';
                companyFields.style.display = 'block';
                individualProfessionalFields.style.display = 'none';
                companyProfessionalFields.style.display = 'block';
                professionalInfoSection.querySelector('.section-title').textContent = 'Informações - Pessoa Jurídica';
                console.log('Switched to company form');
            }
            
            // Clear common fields when switching between forms to prevent data leakage
            clearCommonFields();
            
            // Re-apply autocomplete disabling after tab switch
            disableAllAutocomplete();
        });
    });
    
    // Function to clear common fields when switching between forms
    function clearCommonFields() {
        // Common fields that should be cleared when switching forms
        const commonFieldIds = [
            'password', 
            'confirmPassword', 
            'phone', 
            'recipientName', 
            'cep', 
            'street', 
            'number', 
            'complement', 
            'neighborhood', 
            'city', 
            'state'
        ];
        
        commonFieldIds.forEach(id => {
            const field = document.getElementById(id);
            if (field && field.type !== 'select-one' && field.type !== 'select-multiple') {
                // Clear the field value
                field.value = '';
                
                // For select elements, reset to the first option
                if (field.tagName === 'SELECT') {
                    field.selectedIndex = 0;
                }
            }
        });
        
        // Also clear password strength indicator if it exists
        const passwordStrength = document.getElementById('passwordStrength');
        if (passwordStrength) {
            passwordStrength.innerHTML = '';
        }
    }

    // Clear common fields on page load to ensure clean state
    clearCommonFields();

    // NEW FORM SUBMISSION FUNCTIONALITY
    // Handle form submission
    function handleFormSubmission() {
        console.log('Form submission initiated');
        console.log('handleFormSubmission function called successfully');
        
        // Get the registration form
        const registrationForm = document.getElementById('registrationForm');
        if (!registrationForm) {
            console.error('Registration form not found!');
            return;
        }
        
        // Get form data
        const formData = new FormData(registrationForm);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Form data collected:', data);
        
        // Validate form
        const validationErrors = validateForm(data);
        console.log('Validation errors:', validationErrors);
        
        // Additional validation for passwords
        if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
            validationErrors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
        }
        
        // Show validation errors if any
        if (validationErrors.length > 0) {
            console.log('Validation failed with errors:', validationErrors);
            showErrorNotification(validationErrors);
            highlightErrorFields(validationErrors);
            return;
        }
        
        // If validation passes, proceed with submission
        console.log('Form is valid, proceeding with submission');
        processFormSubmission(data);
    }
    
    // Process the form submission
    function processFormSubmission(data) {
        // Get the submit button
        const registrationForm = document.getElementById('registrationForm');
        const submitButton = registrationForm.querySelector('.registration-button');
        
        if (!submitButton) {
            console.error('Submit button not found!');
            return;
        }
        
        // Show loading state
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
        submitButton.disabled = true;
        
        // Simulate registration process
        setTimeout(() => {
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            // Save user's first name to localStorage along with login status
            const fullName = data.fullName || data.companyName || 'Cliente';
            const firstName = fullName.split(' ')[0];
            localStorage.setItem('userFirstName', firstName);
            localStorage.setItem('isLoggedIn', 'true'); // Set login status to true after registration
            
            // Show success notification
            showNotification('Conta criada com sucesso! Você será redirecionado para a página inicial.', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/pages/home/index.html';
            }, 2000);
        }, 2000);
    }
    
    // Add event listener to the form
    const registrationForm = document.getElementById('registrationForm');
    console.log('Attempting to attach event listener to form:', registrationForm);
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            console.log('Form submit event triggered!');
            e.preventDefault();
            handleFormSubmission();
        });
        console.log('Event listener successfully attached to form');
    } else {
        console.error('Registration form not found when trying to attach event listener');
    }
    
    // Temporary test function to check form validation
    window.testFormValidation = function() {
        console.log('Testing form validation...');
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Current form data:', data);
            const validationErrors = validateForm(data);
            console.log('Validation errors:', validationErrors);
        }
    };
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Create password requirements notification element
    const passwordRequirements = document.createElement('div');
    passwordRequirements.id = 'password-requirements';
    passwordRequirements.className = 'password-requirements';
    passwordRequirements.style.display = 'none';
    
    if (passwordInput && passwordStrength) {
        // Insert password requirements after password strength indicator
        passwordStrength.parentNode.insertBefore(passwordRequirements, passwordStrength.nextSibling);
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            updatePasswordStrength(password);
            checkPasswordRequirements(password);
        });
    }
    
    // Confirm password validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordsMatch();
        });
    }
    
    // CEP search functionality
    const cepInput = document.getElementById('cep');
    const searchCepBtn = document.getElementById('searchCepBtn');
    
    if (cepInput && searchCepBtn) {
        searchCepBtn.addEventListener('click', function() {
            const cep = cepInput.value.replace(/\D/g, '');
            
            if (cep.length !== 8) {
                alert('Por favor, insira um CEP válido com 8 dígitos.');
                return;
            }
            
            console.log('Searching for CEP:', cep);
            
            // Show loading state
            const originalBtnText = searchCepBtn.innerHTML;
            searchCepBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            searchCepBtn.disabled = true;
            
            // Make API call to ViaCEP
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => {
                    console.log('CEP API response status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('CEP API response data:', data);
                    
                    // Reset button state
                    searchCepBtn.innerHTML = originalBtnText;
                    searchCepBtn.disabled = false;
                    
                    // Check if CEP was found
                    if (data.erro) {
                        console.log('CEP not found');
                        alert('CEP não encontrado. Por favor, verifique o CEP informado.');
                        return;
                    }
                    
                    // Fill address fields
                    const streetField = document.getElementById('street');
                    const neighborhoodField = document.getElementById('neighborhood');
                    const cityField = document.getElementById('city');
                    const stateField = document.getElementById('state');
                    const numberField = document.getElementById('number');
                    
                    if (streetField) streetField.value = data.logradouro || '';
                    if (neighborhoodField) neighborhoodField.value = data.bairro || '';
                    if (cityField) cityField.value = data.localidade || '';
                    if (stateField) stateField.value = data.uf || '';
                    
                    // Focus on number field
                    if (numberField) numberField.focus();
                    
                    alert('CEP encontrado! Os campos de endereço foram preenchidos automaticamente.');
                })
                .catch(error => {
                    console.error('Error fetching CEP:', error);
                    
                    // Reset button state
                    searchCepBtn.innerHTML = originalBtnText;
                    searchCepBtn.disabled = false;
                    
                    alert('Erro ao buscar CEP. Por favor, tente novamente.');
                });
        });
    } else {
        console.log('CEP input or search button not found');
    }
    
    // CPF formatting
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            
            this.value = value;
        });
    }
    
    // Phone formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{1,2})/, '($1');
            }
            
            this.value = value;
        });
    }
    
    // CEP formatting
    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            
            this.value = value;
        });
    }
    
    // CNPJ formatting
    const cnpjField = document.getElementById('cnpj');
    if (cnpjField) {
        cnpjField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 14) value = value.substring(0, 14);
            
            if (value.length > 12) {
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
            } else if (value.length > 8) {
                value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
            } else if (value.length > 5) {
                value = value.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{1,3})/, '$1.$2');
            }
            
            this.value = value;
        });
    }
    
    // Company phone formatting
    const companyPhoneField = document.getElementById('companyPhone');
    if (companyPhoneField) {
        companyPhoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/(\d{1,2})/, '($1');
            }
            
            this.value = value;
        });
    }
    
    // Form validation function
    function validateForm(data) {
        console.log('validateForm function called with data:', data);
        const errors = [];
        
        console.log('Starting form validation with data:', data);
        
        // Determine if we're validating individual or company
        const activeTab = document.querySelector('.tab-button.active');
        const isIndividual = activeTab ? activeTab.dataset.type === 'individual' : true;
        
        console.log('Validating form for type:', isIndividual ? 'individual' : 'company');
        console.log('Active tab element:', activeTab);
        console.log('Is individual:', isIndividual);
        
        if (isIndividual) {
            // Email validation - check if field is visible
            const emailField = document.getElementById('email');
            if (isElementVisible(emailField)) {
                if (!data.email) {
                    errors.push({ field: 'email', message: 'Por favor, insira seu e-mail.' });
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(data.email)) {
                        errors.push({ field: 'email', message: 'Por favor, insira um e-mail válido.' });
                    }
                }
            }
            
            // CPF validation - check if field is visible
            const cpfField = document.getElementById('cpf');
            if (isElementVisible(cpfField)) {
                if (!data.cpf) {
                    errors.push({ field: 'cpf', message: 'Por favor, insira seu CPF.' });
                } else {
                    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                    if (!cpfRegex.test(data.cpf)) {
                        errors.push({ field: 'cpf', message: 'Por favor, insira um CPF válido.' });
                    }
                }
            }
            
            // Full name validation - check if field is visible
            const fullNameField = document.getElementById('fullName');
            if (isElementVisible(fullNameField)) {
                if (!data.fullName) {
                    errors.push({ field: 'fullName', message: 'Por favor, insira seu nome completo.' });
                } else if (data.fullName.trim().length < 3) {
                    errors.push({ field: 'fullName', message: 'Por favor, insira seu nome completo.' });
                }
            }
            
            // Birth date validation - check if field is visible
            const birthDateField = document.getElementById('birthDate');
            if (isElementVisible(birthDateField)) {
                if (!data.birthDate) {
                    errors.push({ field: 'birthDate', message: 'Por favor, selecione sua data de nascimento.' });
                }
            }
            
            // Gender validation - check if field is visible
            const genderField = document.getElementById('gender');
            if (isElementVisible(genderField)) {
                if (!data.gender) {
                    errors.push({ field: 'gender', message: 'Por favor, selecione seu gênero.' });
                }
            }
            
            // RG validation - check if field is visible
            const rgField = document.getElementById('rg');
            if (isElementVisible(rgField)) {
                if (!data.rg) {
                    errors.push({ field: 'rg', message: 'Por favor, insira seu RG.' });
                } else if (data.rg.trim().length < 3) {
                    errors.push({ field: 'rg', message: 'Por favor, insira seu RG.' });
                }
            }
            
            // Profession validation - check if field is visible
            const professionField = document.getElementById('profession');
            if (isElementVisible(professionField)) {
                if (!data.profession) {
                    errors.push({ field: 'profession', message: 'Por favor, selecione sua profissão.' });
                }
            }
            
            // Specialization validation - check if field is visible
            const specializationField = document.getElementById('specialization');
            if (isElementVisible(specializationField)) {
                if (!data.specialization) {
                    errors.push({ field: 'specialization', message: 'Por favor, insira sua especialização ou semestre.' });
                } else if (data.specialization.trim().length < 2) {
                    errors.push({ field: 'specialization', message: 'Por favor, insira sua especialização ou semestre.' });
                }
            }
            
            // Institution validation - check if field is visible
            const institutionField = document.getElementById('institution');
            if (isElementVisible(institutionField)) {
                if (!data.institution) {
                    errors.push({ field: 'institution', message: 'Por favor, insira o nome da instituição.' });
                } else if (data.institution.trim().length < 3) {
                    errors.push({ field: 'institution', message: 'Por favor, insira o nome da instituição.' });
                }
            }
            
            // Registration number validation - check if field is visible
            const registrationNumberField = document.getElementById('registrationNumber');
            if (isElementVisible(registrationNumberField)) {
                if (!data.registrationNumber) {
                    errors.push({ field: 'registrationNumber', message: 'Por favor, insira sua matrícula ou CRO.' });
                } else if (data.registrationNumber.trim().length < 3) {
                    errors.push({ field: 'registrationNumber', message: 'Por favor, insira sua matrícula ou CRO.' });
                }
            }
        } else {
            // Company email validation - check if field is visible
            const companyEmailField = document.getElementById('companyEmail');
            if (isElementVisible(companyEmailField)) {
                if (!data.companyEmail) {
                    errors.push({ field: 'companyEmail', message: 'Por favor, insira o e-mail da empresa.' });
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(data.companyEmail)) {
                        errors.push({ field: 'companyEmail', message: 'Por favor, insira um e-mail válido para a empresa.' });
                    }
                }
            }
            
            // CNPJ validation - check if field is visible
            const cnpjField = document.getElementById('cnpj');
            if (isElementVisible(cnpjField)) {
                if (!data.cnpj) {
                    errors.push({ field: 'cnpj', message: 'Por favor, insira o CNPJ da empresa.' });
                } else {
                    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
                    if (!cnpjRegex.test(data.cnpj)) {
                        errors.push({ field: 'cnpj', message: 'Por favor, insira um CNPJ válido.' });
                    }
                }
            }
            
            // Company name validation - check if field is visible
            const companyNameField = document.getElementById('companyName');
            if (isElementVisible(companyNameField)) {
                if (!data.companyName) {
                    errors.push({ field: 'companyName', message: 'Por favor, insira a razão social da empresa.' });
                } else if (data.companyName.trim().length < 3) {
                    errors.push({ field: 'companyName', message: 'Por favor, insira a razão social da empresa.' });
                }
            }
            
            // Company phone validation - check if field is visible
            const companyPhoneField = document.getElementById('companyPhone');
            if (isElementVisible(companyPhoneField)) {
                if (!data.companyPhone) {
                    errors.push({ field: 'companyPhone', message: 'Por favor, insira o telefone comercial da empresa.' });
                } else {
                    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                    if (!phoneRegex.test(data.companyPhone)) {
                        errors.push({ field: 'companyPhone', message: 'Por favor, insira um telefone comercial válido.' });
                    }
                }
            }
            
            // Responsible name validation - check if field is visible
            const responsibleNameField = document.getElementById('responsibleName');
            if (isElementVisible(responsibleNameField)) {
                if (!data.responsibleName) {
                    errors.push({ field: 'responsibleName', message: 'Por favor, insira o nome do responsável.' });
                } else if (data.responsibleName.trim().length < 3) {
                    errors.push({ field: 'responsibleName', message: 'Por favor, insira o nome do responsável.' });
                }
            }
            
            // Trade name validation (Inscrição Estadual) - check if field is visible
            const tradeNameField = document.getElementById('tradeName');
            if (isElementVisible(tradeNameField)) {
                if (!data.tradeName || data.tradeName.trim().length < 3) {
                    errors.push({ field: 'tradeName', message: 'Por favor, insira a Inscrição Estadual da empresa.' });
                }
            }
            
            // Company registration number validation - check if field is visible
            const companyRegistrationNumberField = document.getElementById('companyRegistrationNumber');
            if (isElementVisible(companyRegistrationNumberField)) {
                // This field is optional, so only validate if it has a value
                if (data.companyRegistrationNumber && data.companyRegistrationNumber.trim().length < 3) {
                    errors.push({ field: 'companyRegistrationNumber', message: 'Por favor, insira o CRO do responsável.' });
                }
            }
        }
        
        // Password validation (common to both)
        const passwordField = document.getElementById('password');
        if (isElementVisible(passwordField)) {
            if (!data.password) {
                errors.push({ field: 'password', message: 'Por favor, insira uma senha.' });
            } else if (data.password.length < 8) {
                errors.push({ field: 'password', message: 'A senha deve ter pelo menos 8 caracteres.' });
            }
        }
        
        // Password confirmation validation
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (isElementVisible(confirmPasswordField)) {
            if (!data.confirmPassword) {
                errors.push({ field: 'confirmPassword', message: 'Por favor, confirme sua senha.' });
            } else if (data.password && data.password !== data.confirmPassword) {
                errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
            }
        }
        
        // Phone validation (common to both)
        const phoneField = document.getElementById('phone');
        if (isElementVisible(phoneField)) {
            if (!data.phone) {
                errors.push({ field: 'phone', message: 'Por favor, insira seu telefone.' });
            } else {
                const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!phoneRegex.test(data.phone)) {
                    errors.push({ field: 'phone', message: 'Por favor, insira um telefone válido.' });
                }
            }
        }
        
        // Recipient name validation
        const recipientNameField = document.getElementById('recipientName');
        if (isElementVisible(recipientNameField)) {
            if (!data.recipientName) {
                errors.push({ field: 'recipientName', message: 'Por favor, insira o nome do destinatário.' });
            } else if (data.recipientName.trim().length < 3) {
                errors.push({ field: 'recipientName', message: 'Por favor, insira o nome do destinatário.' });
            }
        }
        
        // CEP validation
        const cepField = document.getElementById('cep');
        if (isElementVisible(cepField)) {
            if (!data.cep) {
                errors.push({ field: 'cep', message: 'Por favor, insira o CEP.' });
            } else {
                const cepRegex = /^\d{5}-\d{3}$/;
                if (!cepRegex.test(data.cep)) {
                    errors.push({ field: 'cep', message: 'Por favor, insira um CEP válido.' });
                }
            }
        }
        
        // Address number validation
        const numberField = document.getElementById('number');
        if (isElementVisible(numberField)) {
            if (!data.number) {
                errors.push({ field: 'number', message: 'Por favor, insira o número do endereço.' });
            }
        }
        
        // Terms validation
        const termsCheckbox = document.getElementById('terms');
        if (isElementVisible(termsCheckbox)) {
            if (!termsCheckbox || !termsCheckbox.checked) {
                errors.push({ field: 'terms', message: 'Você deve concordar com os termos de uso e política de privacidade.' });
            }
        }
        
        return errors;
    }
    
    // Clear error states
    function clearErrorStates() {
        console.log('Clearing error states');
        
        // Remove error class from all inputs
        const errorInputs = document.querySelectorAll('.form-input.error, select.error, input[type="checkbox"].error, .form-checkbox-label.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
        
        // Hide error notification
        if (errorNotification) {
            errorNotification.classList.remove('show');
        }
    }
    
    // Show error notification
    function showErrorNotification(errors) {
        console.log('Showing error notification with errors:', errors);
        
        if (!errorNotification || !errorList) {
            console.error('Error notification elements not found');
            return;
        }
        
        if (errors.length > 0) {
            // Create error list
            const errorItems = errors.map(error => `<li>${error.message}</li>`).join('');
            errorList.innerHTML = errorItems;
            
            // Show notification
            errorNotification.classList.add('show');
            
            // Scroll to notification
            errorNotification.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Highlight error fields
    function highlightErrorFields(errors) {
        console.log('Highlighting error fields:', errors);
        
        errors.forEach(error => {
            const field = document.getElementById(error.field);
            // Check if field exists and is visible before trying to highlight it
            if (field && field.offsetParent !== null) {
                field.classList.add('error');
                console.log('Highlighted field:', error.field);
            } else {
                // Handle select elements and other special cases
                if (error.field === 'gender' || error.field === 'profession') {
                    const selectField = document.getElementById(error.field);
                    if (selectField && selectField.offsetParent !== null) {
                        selectField.classList.add('error');
                        console.log('Highlighted select field:', error.field);
                    }
                }
                
                // Handle terms checkbox
                if (error.field === 'terms') {
                    const termsCheckbox = document.getElementById('terms');
                    const termsLabel = document.querySelector('label[for="terms"]');
                    // Check if checkbox exists and is visible
                    if (termsCheckbox && termsCheckbox.offsetParent !== null) {
                        termsCheckbox.classList.add('error');
                        console.log('Highlighted terms checkbox');
                    }
                    // Check if label exists and is visible
                    if (termsLabel && termsLabel.offsetParent !== null) {
                        termsLabel.classList.add('error');
                        console.log('Highlighted terms label');
                    }
                }
            }
        });
    }
    
    // Password strength indicator function
    function updatePasswordStrength(password) {
        if (!passwordStrength) return 0;
        
        if (password.length === 0) {
            passwordStrength.innerHTML = '';
            return 0;
        }
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 1;
        
        // Number check
        if (/\d/.test(password)) strength += 1;
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        // Create strength bar
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        // Update strength bar
        passwordStrength.innerHTML = '';
        passwordStrength.appendChild(strengthBar);
        
        if (strength <= 2) {
            strengthBar.className = 'password-strength-bar password-strength-weak';
        } else if (strength <= 4) {
            strengthBar.className = 'password-strength-bar password-strength-medium';
        } else {
            strengthBar.className = 'password-strength-bar password-strength-strong';
        }
        
        return strength;
    }
    
    // Check password requirements
    function checkPasswordRequirements(password) {
        const requirements = [
            { regex: /.{8,}/, message: 'Pelo menos 8 caracteres' },
            { regex: /[A-Z]/, message: 'Pelo menos 1 letra maiúscula' },
            { regex: /[a-z]/, message: 'Pelo menos 1 letra minúscula' },
            { regex: /\d/, message: 'Pelo menos 1 número' },
            { regex: /[^A-Za-z0-9]/, message: 'Pelo menos 1 caractere especial' }
        ];
        
        const failedRequirements = requirements.filter(req => !req.regex.test(password));
        
        if (password.length === 0) {
            passwordRequirements.style.display = 'none';
            return true;
        }
        
        if (failedRequirements.length > 0) {
            passwordRequirements.style.display = 'block';
            passwordRequirements.innerHTML = `
                <p class="requirements-title">A senha deve conter:</p>
                <ul class="requirements-list">
                    ${requirements.map(req => {
                        const isMet = req.regex.test(password);
                        return `<li class="${isMet ? 'met' : 'unmet'}">${req.message}</li>`;
                    }).join('')}
                </ul>
            `;
            return false;
        } else {
            passwordRequirements.style.display = 'none';
            return true;
        }
    }
    
    // Check if passwords match
    function validatePasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) return true;
        
        if (password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('As senhas não coincidem');
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            return true;
        }
    }
});