document.addEventListener('DOMContentLoaded', function() {
<<<<<<< HEAD
=======
    console.log('Registration page loaded');
    
>>>>>>> 00d02e1a4a82ef7b0c1f7221ec18dd04dfbaa85f
    // Person type tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const individualFields = document.getElementById('individualFields');
    const companyFields = document.getElementById('companyFields');
    const individualProfessionalFields = document.getElementById('individualProfessionalFields');
    const companyProfessionalFields = document.getElementById('companyProfessionalFields');
    const professionalInfoSection = document.getElementById('professionalInfoSection');
    const errorNotification = document.getElementById('errorNotification');
    const errorList = document.getElementById('errorList');
    
<<<<<<< HEAD
=======
    console.log('Elements found:', {
        tabButtons: tabButtons.length,
        individualFields: !!individualFields,
        companyFields: !!companyFields,
        errorNotification: !!errorNotification,
        errorList: !!errorList
    });
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
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
            } else {
                individualFields.style.display = 'none';
                companyFields.style.display = 'block';
                individualProfessionalFields.style.display = 'none';
                companyProfessionalFields.style.display = 'block';
                professionalInfoSection.querySelector('.section-title').textContent = 'Informações - Pessoa Jurídica';
            }
        });
    });
});
    
>>>>>>> 00d02e1a4a82ef7b0c1f7221ec18dd04dfbaa85f
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
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
            } else {
                individualFields.style.display = 'none';
                companyFields.style.display = 'block';
                individualProfessionalFields.style.display = 'none';
                companyProfessionalFields.style.display = 'block';
                professionalInfoSection.querySelector('.section-title').textContent = 'Informações - Pessoa Jurídica';
            }
        });
    });

    // Registration form submission
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous error states
            clearErrorStates();
            
            // Get form values
            const formData = new FormData(registrationForm);
            const data = Object.fromEntries(formData.entries());
            
<<<<<<< HEAD

=======
            console.log('Form data collected:', data);
            
            // Simple validation
            const validationErrors = validateForm(data);
            
            console.log('Validation errors:', validationErrors);
            
            // Check if passwords match
            if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
                validationErrors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
            }
            
            // Additional password validation
            if (data.password && data.password.length > 0) {
                const passwordStrength = updatePasswordStrength(data.password);
                if (passwordStrength < 3) {
                    validationErrors.push({ field: 'password', message: 'Por favor, escolha uma senha mais forte. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.' });
                }
            }
            
            console.log('Final validation errors:', validationErrors);
            
            if (validationErrors.length > 0) {
                console.log('Showing errors to user');
                // Show error notification
                showErrorNotification(validationErrors);
                
                // Highlight error fields
                highlightErrorFields(validationErrors);
                
                return;
            }
>>>>>>> 00d02e1a4a82ef7b0c1f7221ec18dd04dfbaa85f
            
            console.log('Form is valid, proceeding with submission');
            
            // Show loading state
            const registrationButton = registrationForm.querySelector('.registration-button');
            const originalButtonText = registrationButton.innerHTML;
            registrationButton.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Criando conta...';
            registrationButton.disabled = true;
            
            // Simulate registration process (in a real app, this would be an API call)
            setTimeout(() => {
                // Reset button state
                registrationButton.innerHTML = originalButtonText;
                registrationButton.disabled = false;
                
                // Show success message
                alert('Conta criada com sucesso! Você será redirecionado para a página de login.');
                
                // Redirect to login page (simulated)
                window.location.href = '/pages/login/login.html';
            }, 2000);
        });
    }
    
    // Test validation function
    window.testValidation = function() {
        console.log('Testing validation with empty data');
        const emptyData = {};
        const errors = validateForm(emptyData);
        console.log('Errors found:', errors);
        showErrorNotification(errors);
        highlightErrorFields(errors);
    };
    
    // Form validation function
    function validateForm(data) {
        const errors = [];
        
        // Determine if we're validating individual or company
        const activeTab = document.querySelector('.tab-button.active');
        const isIndividual = activeTab ? activeTab.dataset.type === 'individual' : true;
        
        console.log('Validating form for type:', isIndividual ? 'individual' : 'company');
        
        if (isIndividual) {
            // Email validation
            if (!data.email) {
                errors.push({ field: 'email', message: 'Por favor, insira seu e-mail.' });
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    errors.push({ field: 'email', message: 'Por favor, insira um e-mail válido.' });
                }
            }
            
            // CPF validation
            if (!data.cpf) {
                errors.push({ field: 'cpf', message: 'Por favor, insira seu CPF.' });
            } else {
                const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
                if (!cpfRegex.test(data.cpf)) {
                    errors.push({ field: 'cpf', message: 'Por favor, insira um CPF válido.' });
                }
            }
            
            // Full name validation
            if (!data.fullName) {
                errors.push({ field: 'fullName', message: 'Por favor, insira seu nome completo.' });
            } else if (data.fullName.trim().length < 3) {
                errors.push({ field: 'fullName', message: 'Por favor, insira seu nome completo.' });
            }
            
            // Birth date validation
            if (!data.birthDate) {
                errors.push({ field: 'birthDate', message: 'Por favor, selecione sua data de nascimento.' });
            }
            
            // Gender validation
            if (!data.gender) {
                errors.push({ field: 'gender', message: 'Por favor, selecione seu gênero.' });
            }
            
            // RG validation
            if (!data.rg) {
                errors.push({ field: 'rg', message: 'Por favor, insira seu RG.' });
            } else if (data.rg.trim().length < 3) {
                errors.push({ field: 'rg', message: 'Por favor, insira seu RG.' });
            }
            
            // Profession validation
            if (!data.profession) {
                errors.push({ field: 'profession', message: 'Por favor, selecione sua profissão.' });
            }
            
            // Specialization validation
            if (!data.specialization) {
                errors.push({ field: 'specialization', message: 'Por favor, insira sua especialização ou semestre.' });
            } else if (data.specialization.trim().length < 2) {
                errors.push({ field: 'specialization', message: 'Por favor, insira sua especialização ou semestre.' });
            }
            
            // Institution validation
            if (!data.institution) {
                errors.push({ field: 'institution', message: 'Por favor, insira o nome da instituição.' });
            } else if (data.institution.trim().length < 3) {
                errors.push({ field: 'institution', message: 'Por favor, insira o nome da instituição.' });
            }
            
            // Registration number validation
            if (!data.registrationNumber) {
                errors.push({ field: 'registrationNumber', message: 'Por favor, insira sua matrícula ou CRO.' });
            } else if (data.registrationNumber.trim().length < 3) {
                errors.push({ field: 'registrationNumber', message: 'Por favor, insira sua matrícula ou CRO.' });
            }
        } else {
            // Company email validation
            if (!data.companyEmail) {
                errors.push({ field: 'companyEmail', message: 'Por favor, insira o e-mail da empresa.' });
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.companyEmail)) {
                    errors.push({ field: 'companyEmail', message: 'Por favor, insira um e-mail válido para a empresa.' });
                }
            }
            
            // CNPJ validation
            if (!data.cnpj) {
                errors.push({ field: 'cnpj', message: 'Por favor, insira o CNPJ da empresa.' });
            } else {
                const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
                if (!cnpjRegex.test(data.cnpj)) {
                    errors.push({ field: 'cnpj', message: 'Por favor, insira um CNPJ válido.' });
                }
            }
            
            // Company name validation
            if (!data.companyName) {
                errors.push({ field: 'companyName', message: 'Por favor, insira a razão social da empresa.' });
            } else if (data.companyName.trim().length < 3) {
                errors.push({ field: 'companyName', message: 'Por favor, insira a razão social da empresa.' });
            }
            
            // Company phone validation
            if (!data.companyPhone) {
                errors.push({ field: 'companyPhone', message: 'Por favor, insira o telefone comercial da empresa.' });
            } else {
                const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
                if (!phoneRegex.test(data.companyPhone)) {
                    errors.push({ field: 'companyPhone', message: 'Por favor, insira um telefone comercial válido.' });
                }
            }
            
            // Responsible name validation
            if (!data.responsibleName) {
                errors.push({ field: 'responsibleName', message: 'Por favor, insira o nome do responsável.' });
            } else if (data.responsibleName.trim().length < 3) {
                errors.push({ field: 'responsibleName', message: 'Por favor, insira o nome do responsável.' });
            }
            
            // Responsible role validation
            if (!data.responsibleRole) {
                errors.push({ field: 'responsibleRole', message: 'Por favor, insira o cargo do responsável.' });
            } else if (data.responsibleRole.trim().length < 3) {
                errors.push({ field: 'responsibleRole', message: 'Por favor, insira o cargo do responsável.' });
            }
        }
        
        // Password validation (common to both)
        if (!data.password) {
            errors.push({ field: 'password', message: 'Por favor, insira uma senha.' });
        } else if (data.password.length < 8) {
            errors.push({ field: 'password', message: 'A senha deve ter pelo menos 8 caracteres.' });
        }
        
        // Password confirmation validation
        if (!data.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Por favor, confirme sua senha.' });
        }
        
        // Phone validation (common to both)
        if (!data.phone) {
            errors.push({ field: 'phone', message: 'Por favor, insira seu telefone.' });
        } else {
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(data.phone)) {
                errors.push({ field: 'phone', message: 'Por favor, insira um telefone válido.' });
            }
        }
        
        // Recipient name validation
        if (!data.recipientName) {
            errors.push({ field: 'recipientName', message: 'Por favor, insira o nome do destinatário.' });
        } else if (data.recipientName.trim().length < 3) {
            errors.push({ field: 'recipientName', message: 'Por favor, insira o nome do destinatário.' });
        }
        
        // CEP validation
        if (!data.cep) {
            errors.push({ field: 'cep', message: 'Por favor, insira o CEP.' });
        } else {
            const cepRegex = /^\d{5}-\d{3}$/;
            if (!cepRegex.test(data.cep)) {
                errors.push({ field: 'cep', message: 'Por favor, insira um CEP válido.' });
            }
        }
        
        // Address number validation
        if (!data.number) {
            errors.push({ field: 'number', message: 'Por favor, insira o número do endereço.' });
        }
        
        // Terms validation
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox || !termsCheckbox.checked) {
            errors.push({ field: 'terms', message: 'Você deve concordar com os termos de uso e política de privacidade.' });
        }
        
        return errors;
    }
    
    // Clear error states
    function clearErrorStates() {
        console.log('Clearing error states');
        
        // Remove error class from all inputs
        const errorInputs = document.querySelectorAll('.form-input.error, select.error, input[type=\"checkbox\"].error, .form-checkbox-label.error');
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
            if (field) {
                field.classList.add('error');
                console.log('Highlighted field:', error.field);
            } else {
                // Handle select elements and other special cases
                if (error.field === 'gender' || error.field === 'profession') {
                    const selectField = document.getElementById(error.field);
                    if (selectField) {
                        selectField.classList.add('error');
                        console.log('Highlighted select field:', error.field);
                    }
                }
                
                // Handle terms checkbox
                if (error.field === 'terms') {
                    const termsCheckbox = document.getElementById('terms');
                    const termsLabel = document.querySelector('label[for=\"terms\"]');
                    if (termsCheckbox) {
                        termsCheckbox.classList.add('error');
                        console.log('Highlighted terms checkbox');
                    }
                    if (termsLabel) {
                        termsLabel.classList.add('error');
                        console.log('Highlighted terms label');
                    }
                }
            }
        });
    }
    
    // Password strength indicator function
    function updatePasswordStrength(password) {
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        if (password.length === 0) {
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
        
        return strength;
    }
    
    // Check password requirements
    function checkPasswordRequirements(password) {
        // This function is kept for compatibility but not used in the new validation
        return true;
    }
    
    // Check if passwords match
    function validatePasswordsMatch() {
        // This function is kept for compatibility but not used in the new validation
        return true;
    }
        });
    }
    
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
            
            // Show loading state
            const originalBtnText = searchCepBtn.innerHTML;
            searchCepBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            searchCepBtn.disabled = true;
            
            // Simulate CEP search (in a real app, this would be an API call to ViaCEP or similar)
            setTimeout(() => {
                // Reset button state
                searchCepBtn.innerHTML = originalBtnText;
                searchCepBtn.disabled = false;
                
                // Simulate successful CEP search with mock data
                if (cep === '40000000') {
                    document.getElementById('street').value = 'Rua Exemplo';
                    document.getElementById('neighborhood').value = 'Bairro Exemplo';
                    document.getElementById('city').value = 'Salvador';
                    document.getElementById('state').value = 'BA';
                } else {
                    // For other CEPs, show a generic example
                    document.getElementById('street').value = 'Rua dos Testes';
                    document.getElementById('neighborhood').value = 'Centro';
                    document.getElementById('city').value = 'Cidade Exemplo';
                    document.getElementById('state').value = 'EX';
                }
                
                alert('CEP encontrado! Os campos de endereço foram preenchidos automaticamente.');
            }, 1500);
        });
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
        const errors = [];
        
        // Determine if we're validating individual or company
        const activeTab = document.querySelector('.tab-button.active');
        const isIndividual = activeTab ? activeTab.dataset.type === 'individual' : true;
        
        if (isIndividual) {
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email || !emailRegex.test(data.email)) {
                errors.push({ field: 'email', message: 'Por favor, insira um e-mail válido.' });
            }
            
            // CPF validation (basic format check)
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!data.cpf || !cpfRegex.test(data.cpf)) {
                errors.push({ field: 'cpf', message: 'Por favor, insira um CPF válido.' });
            }
            
            // Full name validation
            if (!data.fullName || data.fullName.trim().length < 3) {
                errors.push({ field: 'fullName', message: 'Por favor, insira seu nome completo.' });
            }
            
            // Birth date validation
            if (!data.birthDate) {
                errors.push({ field: 'birthDate', message: 'Por favor, selecione sua data de nascimento.' });
            }
            
            // Gender validation
            if (!data.gender) {
                errors.push({ field: 'gender', message: 'Por favor, selecione seu gênero.' });
            }
            
            // RG validation
            if (!data.rg || data.rg.trim().length < 3) {
                errors.push({ field: 'rg', message: 'Por favor, insira seu RG.' });
            }
            
            // Profession validation
            if (!data.profession) {
                errors.push({ field: 'profession', message: 'Por favor, selecione sua profissão.' });
            }
            
            // Specialization validation
            if (!data.specialization || data.specialization.trim().length < 2) {
                errors.push({ field: 'specialization', message: 'Por favor, insira sua especialização ou semestre.' });
            }
            
            // Institution validation
            if (!data.institution || data.institution.trim().length < 3) {
                errors.push({ field: 'institution', message: 'Por favor, insira o nome da instituição.' });
            }
            
            // Registration number validation
            if (!data.registrationNumber || data.registrationNumber.trim().length < 3) {
                errors.push({ field: 'registrationNumber', message: 'Por favor, insira sua matrícula ou CRO.' });
            }
        } else {
            // Company email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.companyEmail || !emailRegex.test(data.companyEmail)) {
                errors.push({ field: 'companyEmail', message: 'Por favor, insira um e-mail válido para a empresa.' });
            }
            
            // CNPJ validation (basic format check)
            const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
            if (!data.cnpj || !cnpjRegex.test(data.cnpj)) {
                errors.push({ field: 'cnpj', message: 'Por favor, insira um CNPJ válido.' });
            }
            
            // Company name validation
            if (!data.companyName || data.companyName.trim().length < 3) {
                errors.push({ field: 'companyName', message: 'Por favor, insira a razão social da empresa.' });
            }
            
            // Company phone validation
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!data.companyPhone || !phoneRegex.test(data.companyPhone)) {
                errors.push({ field: 'companyPhone', message: 'Por favor, insira um telefone comercial válido.' });
            }
            
            // Responsible name validation
            if (!data.responsibleName || data.responsibleName.trim().length < 3) {
                errors.push({ field: 'responsibleName', message: 'Por favor, insira o nome do responsável.' });
            }
            
            // Responsible role validation
            if (!data.responsibleRole || data.responsibleRole.trim().length < 3) {
                errors.push({ field: 'responsibleRole', message: 'Por favor, insira o cargo do responsável.' });
            }
        }
        
        // Password validation (common to both)
        if (!data.password || data.password.length < 8) {
            errors.push({ field: 'password', message: 'A senha deve ter pelo menos 8 caracteres.' });
        }
        
        // Check password strength
        const passwordStrength = updatePasswordStrength(data.password);
        if (passwordStrength < 3) {
            errors.push({ field: 'password', message: 'Por favor, escolha uma senha mais forte. A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.' });
        }
        
        // Password confirmation validation
        if (data.password !== data.confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'As senhas não coincidem.' });
        }
        
        // Phone validation (common to both)
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            errors.push({ field: 'phone', message: 'Por favor, insira um telefone válido.' });
        }
        
        // Recipient name validation
        if (!data.recipientName || data.recipientName.trim().length < 3) {
            errors.push({ field: 'recipientName', message: 'Por favor, insira o nome do destinatário.' });
        }
        
        // CEP validation
        const cepRegex = /^\d{5}-\d{3}$/;
        if (!data.cep || !cepRegex.test(data.cep)) {
            errors.push({ field: 'cep', message: 'Por favor, insira um CEP válido.' });
        }
        
        // Address number validation
        if (!data.number) {
            errors.push({ field: 'number', message: 'Por favor, insira o número do endereço.' });
        }
        
        // Terms validation
        if (!document.getElementById('terms').checked) {
            errors.push({ field: 'terms', message: 'Você deve concordar com os termos de uso e política de privacidade.' });
        }
        
        return errors;
    }
    
    // Password strength indicator function
    function updatePasswordStrength(password) {
        const strengthBar = document.createElement('div');
        strengthBar.className = 'password-strength-bar';
        
        if (password.length === 0) {
            passwordStrength.innerHTML = '';
            return;
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
    
    // Clear error states
    function clearErrorStates() {
        // Remove error class from all inputs
        const errorInputs = document.querySelectorAll('.form-input.error, select.error, input[type="checkbox"].error, .form-checkbox-label.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
        
        // Hide error notification
        errorNotification.classList.remove('show');
    }
    
    // Show error notification
    function showErrorNotification(errors) {
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
        errors.forEach(error => {
            const field = document.getElementById(error.field);
            if (field) {
                field.classList.add('error');
            } else {
                // Handle select elements and other special cases
                if (error.field === 'gender' || error.field === 'profession') {
                    const selectField = document.getElementById(error.field);
                    if (selectField) {
                        selectField.classList.add('error');
                    }
                }
                
                // Handle terms checkbox
                if (error.field === 'terms') {
                    const termsCheckbox = document.getElementById('terms');
                    const termsLabel = document.querySelector('label[for="terms"]');
                    if (termsCheckbox) {
                        termsCheckbox.classList.add('error');
                    }
                    if (termsLabel) {
                        termsLabel.classList.add('error');
                    }
                }
            }
        });
    }
});