document.addEventListener('DOMContentLoaded', function() {
    console.log('Minha Conta page loaded - DOMContentLoaded event fired');
    
    // Check if user is logged in
    const userFirstName = localStorage.getItem('userFirstName');
    const loggedInView = document.getElementById('logged-in-view');
    const loggedOutView = document.getElementById('logged-out-view');
    const userNameSpan = document.getElementById('user-name');
    const redirectTimer = document.getElementById('redirect-timer');
    
    if (userFirstName) {
        // User is logged in
        loggedInView.style.display = 'block';
        loggedOutView.style.display = 'none';
        
        // Display user's name
        userNameSpan.textContent = userFirstName;
    } else {
        // User is not logged in
        loggedInView.style.display = 'none';
        loggedOutView.style.display = 'block';
        
        // Start redirect timer
        let timeLeft = 10;
        const timer = setInterval(() => {
            timeLeft--;
            if (redirectTimer) {
                redirectTimer.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                window.location.href = '/pages/home/index.html';
            }
        }, 1000);
    }
    
    // Account navigation (only if user is logged in)
    if (userFirstName) {
        const navItems = document.querySelectorAll('.account-nav-item');
        const sections = document.querySelectorAll('.account-section');
        
        // Add event listeners to navigation items
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the section to show
                const sectionToShow = this.getAttribute('data-section');
                
                // Handle logout separately
                if (sectionToShow === 'sair') {
                    handleLogout();
                    return;
                }
                
                // Update active navigation item
                navItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');
                
                // Show the selected section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === sectionToShow + '-section') {
                        section.classList.add('active');
                    }
                });
            });
        });
        
        // Handle logout
        function handleLogout() {
            // Show confirmation dialog
            if (confirm('Tem certeza que deseja sair da sua conta?')) {
                // Clear user data from localStorage
                localStorage.removeItem('userFirstName');
                
                // Redirect to home page
                window.location.href = '/pages/home/index.html';
            }
        }
        
        // Add event listener to logout link
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
        
        // Form submissions
        const emailForm = document.getElementById('email-form');
        const passwordForm = document.getElementById('password-form');
        const personalDataForm = document.getElementById('personal-data-form');
        
        if (emailForm) {
            emailForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle email update
                updateEmail();
            });
        }
        
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle password update
                updatePassword();
            });
        }
        
        if (personalDataForm) {
            personalDataForm.addEventListener('submit', function(e) {
                e.preventDefault();
                // Handle personal data update
                updatePersonalData();
            });
        }
        
        // Update email function
        function updateEmail() {
            const newEmail = document.getElementById('new-email').value;
            const confirmNewEmail = document.getElementById('confirm-new-email').value;
            
            // Basic validation
            if (!newEmail || !confirmNewEmail) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            if (newEmail !== confirmNewEmail) {
                alert('Os emails não coincidem.');
                return;
            }
            
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                alert('Por favor, insira um email válido.');
                return;
            }
            
            // In a real application, you would send this data to your server
            alert('Email atualizado com sucesso!');
            
            // Reset form
            emailForm.reset();
        }
        
        // Update password function
        function updatePassword() {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            // Basic validation
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                alert('As senhas não coincidem.');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('A nova senha deve ter pelo menos 8 caracteres.');
                return;
            }
            
            // In a real application, you would send this data to your server
            alert('Senha atualizada com sucesso!');
            
            // Reset form
            passwordForm.reset();
        }
        
        // Update personal data function
        function updatePersonalData() {
            const fullName = document.getElementById('account-full-name').value;
            const cpf = document.getElementById('account-cpf').value;
            const birthDate = document.getElementById('account-birth-date').value;
            const phone = document.getElementById('account-phone').value;
            const gender = document.getElementById('account-gender').value;
            
            // Basic validation
            if (!fullName || !cpf || !birthDate || !phone || !gender) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // In a real application, you would send this data to your server
            alert('Dados pessoais atualizados com sucesso!');
            
            // Reset form
            personalDataForm.reset();
        }
        
        // Add address button
        const addAddressButton = document.getElementById('add-address-button');
        if (addAddressButton) {
            addAddressButton.addEventListener('click', function() {
                alert('Funcionalidade de adicionar endereço ainda não implementada.');
            });
        }
        
        // Phone formatting
        const phoneInputs = document.querySelectorAll('#account-phone');
        phoneInputs.forEach(input => {
            input.addEventListener('input', function() {
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
        });
        
        // CPF formatting
        const cpfInputs = document.querySelectorAll('#account-cpf');
        cpfInputs.forEach(input => {
            input.addEventListener('input', function() {
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
        });
        
        // Password strength indicator
        const newPasswordInput = document.getElementById('new-password');
        const passwordStrength = document.getElementById('new-password-strength');
        const confirmNewPasswordInput = document.getElementById('confirm-new-password');
        
        // Create password requirements notification element
        const passwordRequirements = document.createElement('div');
        passwordRequirements.id = 'new-password-requirements';
        passwordRequirements.className = 'password-requirements';
        passwordRequirements.style.display = 'none';
        
        if (newPasswordInput && passwordStrength) {
            // Insert password requirements after password strength indicator
            passwordStrength.parentNode.insertBefore(passwordRequirements, passwordStrength.nextSibling);
            
            newPasswordInput.addEventListener('input', function() {
                const password = this.value;
                updatePasswordStrength(password, passwordStrength);
                checkPasswordRequirements(password);
                validatePasswordsMatch(); // Also check if passwords match when password changes
            });
        }
        
        // Confirm new password validation
        if (confirmNewPasswordInput) {
            confirmNewPasswordInput.addEventListener('input', function() {
                validatePasswordsMatch();
            });
        }
        
        // Password strength indicator function
        function updatePasswordStrength(password, strengthElement) {
            if (!strengthElement) return 0;
            
            if (password.length === 0) {
                strengthElement.innerHTML = '';
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
            strengthElement.innerHTML = '';
            strengthElement.appendChild(strengthBar);
            
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
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;
            
            if (confirmNewPassword.length === 0) return true;
            
            if (newPassword !== confirmNewPassword) {
                confirmNewPasswordInput.setCustomValidity('As senhas não coincidem');
                return false;
            } else {
                confirmNewPasswordInput.setCustomValidity('');
                return true;
            }
        }
    }
});