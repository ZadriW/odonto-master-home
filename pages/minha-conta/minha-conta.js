document.addEventListener('DOMContentLoaded', function() {
    console.log('Minha Conta page loaded - DOMContentLoaded event fired');
    
    // Load user database from minha-conta.json
    fetch('/data/minha-conta.json')
        .then(response => response.json())
        .then(data => {
            const usuarios = data.usuarios;
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const userId = localStorage.getItem('userId');
            const userFirstName = localStorage.getItem('userFirstName');
            const loggedInView = document.getElementById('logged-in-view');
            const loggedOutView = document.getElementById('logged-out-view');
            const userNameSpan = document.getElementById('user-name');
            const redirectTimer = document.getElementById('redirect-timer');
            
            if (isLoggedIn && userId && userFirstName) {
                // User is logged in
                loggedInView.style.display = 'block';
                loggedOutView.style.display = 'none';
                
                // Find logged in user data
                const usuarioLogado = usuarios.find(usuario => usuario.id === userId);
                
                // Populate user data in different sections
                if (usuarioLogado) {
                    // Load addresses from localStorage if available, otherwise use from database
                    const savedAddresses = localStorage.getItem('userAddresses');
                    if (savedAddresses) {
                        usuarioLogado.enderecos = JSON.parse(savedAddresses);
                    }
                    
                    // Display user's name
                    userNameSpan.textContent = usuarioLogado.perfil.nome.split(' ')[0];
                    
                    // Pre-populate 'Meus Dados' section immediately
                    populateMeusDados(usuarioLogado);
                    
                    // Pre-populate 'Meus Endereços' section
                    populateMeusEnderecos(usuarioLogado);
                    
                    // Pre-populate 'Meus Pedidos' section
                    populateMeusPedidos(usuarioLogado);
                }
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
            if (isLoggedIn && userId && userFirstName) {
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
                        
                        // Find logged in user data again to ensure it's available
                        const usuarioLogado = usuarios.find(usuario => usuario.id === userId);
                        
                        // Load addresses from localStorage if available
                        const savedAddresses = localStorage.getItem('userAddresses');
                        if (savedAddresses) {
                            usuarioLogado.enderecos = JSON.parse(savedAddresses);
                        }
                        
                        // Update active navigation item
                        navItems.forEach(navItem => navItem.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Show the selected section
                        sections.forEach(section => {
                            section.classList.remove('active');
                            if (section.id === sectionToShow + '-section') {
                                section.classList.add('active');
                                
                                // When 'meus-dados' section is shown, populate it with user data
                                if (sectionToShow === 'meus-dados' && usuarioLogado) {
                                    populateMeusDados(usuarioLogado);
                                }
                                
                                // When 'meus-enderecos' section is shown, populate it with user addresses
                                if (sectionToShow === 'meus-enderecos' && usuarioLogado) {
                                    // Load addresses from localStorage if available
                                    const savedAddresses = localStorage.getItem('userAddresses');
                                    if (savedAddresses) {
                                        usuarioLogado.enderecos = JSON.parse(savedAddresses);
                                    }
                                    populateMeusEnderecos(usuarioLogado);
                                }
                                
                                // When 'meus-pedidos' section is shown, populate it with user orders
                                if (sectionToShow === 'meus-pedidos' && usuarioLogado) {
                                    populateMeusPedidos(usuarioLogado);
                                }
                            }
                        });
                    });
                });
                
                // Handle logout
                function handleLogout() {
                    // Show confirmation dialog
                    if (confirm('Tem certeza que deseja sair da sua conta?')) {
                        // Clear user data from localStorage but keep addresses
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('userId');
                        localStorage.removeItem('userFirstName');
                        localStorage.removeItem('userFullName');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('userCpf');
                        localStorage.removeItem('sessoes');
                        
                        // Update session state in data
                        const sessoes = data.sessoes;
                        sessoes.estado_atual = "deslogado";
                        sessoes.usuario_atual_id = null;
                        
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
                        // Find logged in user data
                        const usuario = usuarios.find(usuario => usuario.id === userId);
                        if (usuario) {
                            // Handle personal data update
                            updatePersonalData(usuario);
                        }
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
                    
                    // Update localStorage
                    localStorage.setItem('userEmail', newEmail);
                    
                    // Update the user's email in the database
                    const userIndex = usuarios.findIndex(usuario => usuario.id === userId);
                    if (userIndex !== -1) {
                        usuarios[userIndex].perfil.email = newEmail;
                        
                        // Update the displayed email in the form
                        if (document.getElementById('current-email')) {
                            document.getElementById('current-email').value = newEmail;
                        }
                    }
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
                function updatePersonalData(usuario) {
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
                    
                    // Update user data in database
                    usuario.perfil.nome = fullName;
                    usuario.perfil.cpf = cpf;
                    usuario.perfil.data_nascimento = birthDate;
                    usuario.perfil.telefone = phone;
                    usuario.perfil.genero = gender;
                    
                    // Update localStorage
                    localStorage.setItem('userFullName', fullName);
                    localStorage.setItem('userCpf', cpf);
                    
                    // In a real application, you would send this data to your server
                    alert('Dados pessoais atualizados com sucesso!');
                    
                    // Update the displayed name in the header
                    const userNameSpan = document.getElementById('user-name');
                    if (userNameSpan) {
                        userNameSpan.textContent = fullName.split(' ')[0];
                    }
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
                
                if (newPasswordInput && passwordStrength) {
                    newPasswordInput.addEventListener('input', function() {
                        const password = this.value;
                        updatePasswordStrength(password, passwordStrength);
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
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o banco de dados de usuários:', error);
        });
    
    // Helper function to populate 'Meus Dados' section
    function populateMeusDados(usuario) {
        if (document.getElementById('account-full-name')) {
            document.getElementById('account-full-name').value = usuario.perfil.nome || '';
        }
        if (document.getElementById('account-cpf')) {
            document.getElementById('account-cpf').value = usuario.perfil.cpf || usuario.perfil.cnpj || '';
        }
        if (document.getElementById('account-birth-date')) {
            document.getElementById('account-birth-date').value = usuario.perfil.data_nascimento || '';
        }
        if (document.getElementById('account-phone')) {
            document.getElementById('account-phone').value = usuario.perfil.telefone || '';
        }
        if (document.getElementById('account-gender')) {
            document.getElementById('account-gender').value = usuario.perfil.genero || '';
        }
        if (document.getElementById('current-email')) {
            document.getElementById('current-email').value = usuario.perfil.email || '';
        }
    }
    
    // Helper function to populate 'Meus Endereços' section
    function populateMeusEnderecos(usuario) {
        const addressesContainer = document.querySelector('.addresses-container');
        if (!addressesContainer || !usuario.enderecos) return;
        
        // Clear existing content
        addressesContainer.innerHTML = '';
        
        // Get the first address as the delivery address (or create a default one)
        let enderecoEntrega = usuario.enderecos.length > 0 ? usuario.enderecos[0] : null;
        
        if (!enderecoEntrega) {
            // If no address exists, create a default structure
            enderecoEntrega = {
                id: 'endereco-padrao',
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: ''
            };
        }
        
        // Create the address edit form
        const addressEditForm = document.createElement('div');
        addressEditForm.className = 'address-edit-form';
        addressEditForm.innerHTML = `
            <form id="edit-address-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-endereco-logradouro" class="form-label">Logradouro *</label>
                        <input type="text" id="edit-endereco-logradouro" class="form-input" value="${enderecoEntrega.logradouro}" placeholder="Rua, Avenida, etc." required>
                    </div>
                    <div class="form-group">
                        <label for="edit-endereco-numero" class="form-label">Número *</label>
                        <input type="text" id="edit-endereco-numero" class="form-input" value="${enderecoEntrega.numero}" placeholder="Número" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-endereco-complemento" class="form-label">Complemento</label>
                        <input type="text" id="edit-endereco-complemento" class="form-input" value="${enderecoEntrega.complemento || ''}" placeholder="Apartamento, bloco, etc.">
                    </div>
                    <div class="form-group">
                        <label for="edit-endereco-bairro" class="form-label">Bairro *</label>
                        <input type="text" id="edit-endereco-bairro" class="form-input" value="${enderecoEntrega.bairro}" placeholder="Bairro" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-endereco-cidade" class="form-label">Cidade *</label>
                        <input type="text" id="edit-endereco-cidade" class="form-input" value="${enderecoEntrega.cidade}" placeholder="Cidade" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-endereco-estado" class="form-label">Estado *</label>
                        <select id="edit-endereco-estado" class="form-input" required>
                            <option value="">Selecione</option>
                            <option value="AC" ${enderecoEntrega.estado === 'AC' ? 'selected' : ''}>Acre</option>
                            <option value="AL" ${enderecoEntrega.estado === 'AL' ? 'selected' : ''}>Alagoas</option>
                            <option value="AP" ${enderecoEntrega.estado === 'AP' ? 'selected' : ''}>Amapá</option>
                            <option value="AM" ${enderecoEntrega.estado === 'AM' ? 'selected' : ''}>Amazonas</option>
                            <option value="BA" ${enderecoEntrega.estado === 'BA' ? 'selected' : ''}>Bahia</option>
                            <option value="CE" ${enderecoEntrega.estado === 'CE' ? 'selected' : ''}>Ceará</option>
                            <option value="DF" ${enderecoEntrega.estado === 'DF' ? 'selected' : ''}>Distrito Federal</option>
                            <option value="ES" ${enderecoEntrega.estado === 'ES' ? 'selected' : ''}>Espírito Santo</option>
                            <option value="GO" ${enderecoEntrega.estado === 'GO' ? 'selected' : ''}>Goiás</option>
                            <option value="MA" ${enderecoEntrega.estado === 'MA' ? 'selected' : ''}>Maranhão</option>
                            <option value="MT" ${enderecoEntrega.estado === 'MT' ? 'selected' : ''}>Mato Grosso</option>
                            <option value="MS" ${enderecoEntrega.estado === 'MS' ? 'selected' : ''}>Mato Grosso do Sul</option>
                            <option value="MG" ${enderecoEntrega.estado === 'MG' ? 'selected' : ''}>Minas Gerais</option>
                            <option value="PA" ${enderecoEntrega.estado === 'PA' ? 'selected' : ''}>Pará</option>
                            <option value="PB" ${enderecoEntrega.estado === 'PB' ? 'selected' : ''}>Paraíba</option>
                            <option value="PR" ${enderecoEntrega.estado === 'PR' ? 'selected' : ''}>Paraná</option>
                            <option value="PE" ${enderecoEntrega.estado === 'PE' ? 'selected' : ''}>Pernambuco</option>
                            <option value="PI" ${enderecoEntrega.estado === 'PI' ? 'selected' : ''}>Piauí</option>
                            <option value="RJ" ${enderecoEntrega.estado === 'RJ' ? 'selected' : ''}>Rio de Janeiro</option>
                            <option value="RN" ${enderecoEntrega.estado === 'RN' ? 'selected' : ''}>Rio Grande do Norte</option>
                            <option value="RS" ${enderecoEntrega.estado === 'RS' ? 'selected' : ''}>Rio Grande do Sul</option>
                            <option value="RO" ${enderecoEntrega.estado === 'RO' ? 'selected' : ''}>Rondônia</option>
                            <option value="RR" ${enderecoEntrega.estado === 'RR' ? 'selected' : ''}>Roraima</option>
                            <option value="SC" ${enderecoEntrega.estado === 'SC' ? 'selected' : ''}>Santa Catarina</option>
                            <option value="SP" ${enderecoEntrega.estado === 'SP' ? 'selected' : ''}>São Paulo</option>
                            <option value="SE" ${enderecoEntrega.estado === 'SE' ? 'selected' : ''}>Sergipe</option>
                            <option value="TO" ${enderecoEntrega.estado === 'TO' ? 'selected' : ''}>Tocantins</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-endereco-cep" class="form-label">CEP *</label>
                        <input type="text" id="edit-endereco-cep" class="form-input" value="${enderecoEntrega.cep}" placeholder="00000-000" required>
                    </div>
                </div>
                
                <div class="form-row" style="justify-content: flex-end;">
                    <button type="submit" class="account-button">
                        <i class="fas fa-save"></i> Salvar Endereço
                    </button>
                </div>
            </form>
        `;
        
        addressesContainer.appendChild(addressEditForm);
        
        // Add event listener to the form
        document.getElementById('edit-address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            updateDeliveryAddress(usuario);
        });
        
        // Add mask for CEP field
        const cepInput = document.getElementById('edit-endereco-cep');
        cepInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            
            this.value = value;
        });
    }
    
    // Helper function to populate 'Meus Pedidos' section
    function populateMeusPedidos(usuario) {
        // Load product data to ensure we have the most current information
        fetch('/data/products.json')
            .then(response => response.json())
            .then(produtos => {
                const ordersContainer = document.querySelector('.orders-container');
                if (!ordersContainer || !usuario.pedidos) return;
                
                // Clear existing content
                ordersContainer.innerHTML = '';
                
                if (usuario.pedidos.length === 0) {
                    ordersContainer.innerHTML = '<p class="no-orders-message">Você ainda não possui pedidos.</p>';
                } else {
                    // Create order list
                    const orderList = document.createElement('div');
                    orderList.className = 'order-list';
                    
                    // Sort orders by date (newest first)
                    const sortedOrders = [...usuario.pedidos].sort((a, b) => 
                        new Date(b.data) - new Date(a.data)
                    );
                    
                    sortedOrders.forEach(pedido => {
                        const orderCard = document.createElement('div');
                        orderCard.className = 'order-card';
                        
                        // Format date
                        const orderDate = new Date(pedido.data);
                        const formattedDate = orderDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                        
                        // Process items with current product data
                        const itemsHtml = pedido.itens.map(item => {
                            // Find the current product data from products.json
                            const produtoAtual = produtos[item.produto_id];
                            
                            // Use the original price from the order to maintain historical accuracy
                            // But we have access to current product information if needed
                            const precoOriginal = item.preco_unitario || (produtoAtual ? produtoAtual.price_current || produtoAtual.price : 0);
                            
                            return `
                                <div class="order-item">
                                    <span class="item-name">${item.nome}</span>
                                    <span class="item-quantity">Qtd: ${item.quantidade}</span>
                                    <span class="item-price">R$ ${formatarPreco(precoOriginal)}</span>
                                </div>
                            `;
                        }).join('');
                        
                        orderCard.innerHTML = `
                            <div class="order-header">
                                <div class="order-id">Pedido #${pedido.id.replace('pedido_', '')}</div>
                                <div class="order-date">${formattedDate}</div>
                                <div class="order-status status-${pedido.status.toLowerCase().replace(' ', '-')}">${pedido.status}</div>
                            </div>
                            <div class="order-details">
                                <div class="order-items">
                                    ${itemsHtml}
                                </div>
                                <div class="order-total">
                                    <strong>Total: R$ ${formatarPreco(pedido.valor_total)}</strong>
                                </div>
                            </div>
                            <div class="order-footer">
                                ${pedido.numero_rastreamento ? 
                                    `<div class="tracking-number">Rastreamento: ${pedido.numero_rastreamento}</div>` : 
                                    ''}
                                <div class="payment-method">${pedido.forma_pagamento}</div>
                            </div>
                        `;
                        orderList.appendChild(orderCard);
                    });
                    
                    ordersContainer.appendChild(orderList);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados dos produtos:', error);
                
                // Fallback: display orders with original data if products.json is unavailable
                const ordersContainer = document.querySelector('.orders-container');
                if (!ordersContainer || !usuario.pedidos) return;
                
                // Clear existing content
                ordersContainer.innerHTML = '';
                
                if (usuario.pedidos.length === 0) {
                    ordersContainer.innerHTML = '<p class="no-orders-message">Você ainda não possui pedidos.</p>';
                } else {
                    // Create order list
                    const orderList = document.createElement('div');
                    orderList.className = 'order-list';
                    
                    // Sort orders by date (newest first)
                    const sortedOrders = [...usuario.pedidos].sort((a, b) => 
                        new Date(b.data) - new Date(a.data)
                    );
                    
                    sortedOrders.forEach(pedido => {
                        const orderCard = document.createElement('div');
                        orderCard.className = 'order-card';
                        
                        // Format date
                        const orderDate = new Date(pedido.data);
                        const formattedDate = orderDate.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        });
                        
                        // Process items with original data
                        const itemsHtml = pedido.itens.map(item => {
                            return `
                                <div class="order-item">
                                    <span class="item-name">${item.nome}</span>
                                    <span class="item-quantity">Qtd: ${item.quantidade}</span>
                                    <span class="item-price">R$ ${formatarPreco(item.preco_unitario)}</span>
                                </div>
                            `;
                        }).join('');
                        
                        orderCard.innerHTML = `
                            <div class="order-header">
                                <div class="order-id">Pedido #${pedido.id.replace('pedido_', '')}</div>
                                <div class="order-date">${formattedDate}</div>
                                <div class="order-status status-${pedido.status.toLowerCase().replace(' ', '-')}">${pedido.status}</div>
                            </div>
                            <div class="order-details">
                                <div class="order-items">
                                    ${itemsHtml}
                                </div>
                                <div class="order-total">
                                    <strong>Total: R$ ${formatarPreco(pedido.valor_total)}</strong>
                                </div>
                            </div>
                            <div class="order-footer">
                                ${pedido.numero_rastreamento ? 
                                    `<div class="tracking-number">Rastreamento: ${pedido.numero_rastreamento}</div>` : 
                                    ''}
                                <div class="payment-method">${pedido.forma_pagamento}</div>
                            </div>
                        `;
                        orderList.appendChild(orderCard);
                    });
                    
                    ordersContainer.appendChild(orderList);
                }
            });
    }
    
    // Helper function to get current product price
    function getProdutoAtual(produtoId) {
        return fetch('/data/products.json')
            .then(response => response.json())
            .then(produtos => produtos[produtoId])
            .catch(error => {
                console.error('Erro ao carregar dados do produto:', error);
                return null;
            });
    }
    
    // Helper function to get all current product prices
    function getProdutosAtuais() {
        return fetch('/data/products.json')
            .then(response => response.json())
            .catch(error => {
                console.error('Erro ao carregar dados dos produtos:', error);
                return {};
            });
    }
    
    // Helper function to update delivery address
    function updateDeliveryAddress(usuario) {
        // Create a single address as the delivery address
        const updatedEndereco = {
            id: 'endereco-padrao',
            logradouro: document.getElementById('edit-endereco-logradouro').value,
            numero: document.getElementById('edit-endereco-numero').value,
            complemento: document.getElementById('edit-endereco-complemento').value,
            bairro: document.getElementById('edit-endereco-bairro').value,
            cidade: document.getElementById('edit-endereco-cidade').value,
            estado: document.getElementById('edit-endereco-estado').value,
            cep: document.getElementById('edit-endereco-cep').value
        };
        
        // Replace the first address or add as the only address
        usuario.enderecos = [updatedEndereco];
        
        // Salvar no localStorage
        localStorage.setItem('userAddresses', JSON.stringify(usuario.enderecos));
        
        // Mostrar mensagem de sucesso
        alert('Endereço atualizado com sucesso!');
        
        // Atualizar a exibição
        populateMeusEnderecos(usuario);
    }
    
    // Helper function to format prices
    function formatarPreco(valor) {
        // Converte o valor para número se for string
        const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
        
        // Se o valor for um inteiro maior que 1000, provavelmente está em centavos
        if (Number.isInteger(valorNumerico) && valorNumerico > 1000) {
            return (valorNumerico / 100).toFixed(2).replace('.', ',');
        } else {
            // Caso contrário, formata normalmente
            return valorNumerico.toFixed(2).replace('.', ',');
        }
    }
});