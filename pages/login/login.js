document.addEventListener('DOMContentLoaded', function() {
    // Load user database from minha-conta.json
    fetch('/data/minha-conta.json')
        .then(response => response.json())
        .then(data => {
            const usuarios = data.usuarios;
            
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
                        
                        // Verify credentials against user database
                        const usuarioEncontrado = usuarios.find(usuario => 
                            (usuario.perfil.email === email || usuario.login === email) && 
                            usuario.senha === password && 
                            usuario.ativo
                        );
                        
                        if (usuarioEncontrado) {
                            // Login successful - save user data to localStorage
                            localStorage.setItem('isLoggedIn', 'true');
                            localStorage.setItem('userId', usuarioEncontrado.id);
                            localStorage.setItem('userFirstName', usuarioEncontrado.perfil.nome.split(' ')[0]);
                            localStorage.setItem('userFullName', usuarioEncontrado.perfil.nome);
                            localStorage.setItem('userEmail', usuarioEncontrado.perfil.email);
                            localStorage.setItem('userCpf', usuarioEncontrado.perfil.cpf || usuarioEncontrado.perfil.cnpj || '');
                            
                            // Update session state in data
                            const sessoes = data.sessoes;
                            sessoes.estado_atual = "logado";
                            sessoes.usuario_atual_id = usuarioEncontrado.id;
                            
                            // Load saved addresses from localStorage if available
                            const savedAddresses = localStorage.getItem('userAddresses');
                            if (savedAddresses) {
                                // Merge saved addresses with the user's addresses from the database
                                const parsedAddresses = JSON.parse(savedAddresses);
                                // Only update if the user doesn't already have addresses in the database
                                if (!usuarioEncontrado.enderecos || usuarioEncontrado.enderecos.length === 0) {
                                    usuarioEncontrado.enderecos = parsedAddresses;
                                }
                            }
                            
                            // Show success message
                            alert('Login realizado com sucesso! Você será redirecionado para a Página Inicial.');
                            
                            // Redirect to home page (simulated)
                             window.location.href = '/pages/home/index.html';
                        } else {
                            // Login failed
                            alert('E-mail ou senha incorretos. Por favor, tente novamente.');
                        }
                    }, 1500);
                });
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o banco de dados de usuários:', error);
            alert('Erro ao carregar o sistema de login. Por favor, tente novamente mais tarde.');
        });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de recuperação de senha será implementada em breve.');
        });
    }
});