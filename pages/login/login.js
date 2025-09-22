document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked;
            
            // Simple validation
            if (!email || !password) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Password validation (at least 6 characters)
            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            // Show loading state
            const loginButton = loginForm.querySelector('.login-button');
            const originalButtonText = loginButton.textContent;
            loginButton.textContent = 'Entrando...';
            loginButton.disabled = true;
            
            // Simulate login process (in a real app, this would be an API call)
            setTimeout(() => {
                // Reset button state
                loginButton.textContent = originalButtonText;
                loginButton.disabled = false;
                
                // Show success message
                alert('Login realizado com sucesso! Você será redirecionado para a página inicial.');
                
                // Redirect to home page (simulated)
                 window.location.href = '/pages/home/index.html';
            }, 1500);
        });
    }
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de recuperação de senha será implementada em breve.');
        });
    }
});