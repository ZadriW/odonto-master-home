document.addEventListener('DOMContentLoaded', () => {
    // Debug: Check what's in localStorage
    console.log('LocalStorage odonto_applied_coupon:', localStorage.getItem('odonto_applied_coupon'));
    console.log('LocalStorage odonto_cart:', localStorage.getItem('odonto_cart'));
    
    // Clean up any invalid coupon data at startup
    try {
        const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
        if (appliedCouponStr) {
            const appliedCoupon = JSON.parse(appliedCouponStr);
            // Validate coupon structure
            if (!(appliedCoupon && 
                typeof appliedCoupon === 'object' && 
                appliedCoupon.code && 
                typeof appliedCoupon.code === 'string' &&
                appliedCoupon.type && 
                (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") &&
                appliedCoupon.discount && 
                typeof appliedCoupon.discount === 'number')) {
                // Invalid coupon structure, remove it
                console.log('Invalid coupon structure found at startup, removing');
                localStorage.removeItem('odonto_applied_coupon');
            }
        }
    } catch (error) {
        console.error('Error validating coupon at startup, removing invalid data');
        localStorage.removeItem('odonto_applied_coupon');
    }
    
    // Ensure discount section is hidden at startup
    const discountSection = document.getElementById('discount-section');
    const discountRow = document.getElementById('discount-row');
    if (discountSection) discountSection.style.display = 'none';
    if (discountRow) discountRow.style.display = 'none';
    
    // Seleciona os elementos relevantes
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    const editOrderBtn = document.getElementById('edit-order-btn');
    const orderItemsContainer = document.getElementById('order-items-container');
    
    // Seleciona os elementos do endereço
    const editAddressBtn = document.getElementById('edit-address-btn');
    const addressDisplay = document.getElementById('address-display');
    const addressEditForm = document.getElementById('address-edit-form');
    const cancelEditAddressBtn = document.getElementById('cancel-edit-address');
    const saveEditAddressBtn = document.getElementById('save-edit-address');
    
    // Verifica se estamos na página correta
    if (!shippingOptions.length) {
        return; // Sai da função se os elementos não existirem
    }
    
    // Carrega os dados do carrinho
    loadCartItems();
    
    // Carrega os dados do cliente
    loadCustomerData();
    
    // Configura as datas de entrega
    setupDeliveryDates();
    
    // Verifica e exibe cupom aplicado, se houver
    displayAppliedCoupon();
    
    // Adiciona eventos aos botões de envio
    shippingOptions.forEach(option => {
        option.addEventListener('change', updateShippingCost);
    });
    
    // Adiciona eventos aos botões de ação
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', confirmOrder);
    }
    
    if (editOrderBtn) {
        editOrderBtn.addEventListener('click', editOrder);
    }
    
    // Adiciona eventos para edição de endereço
    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', showEditAddressForm);
    }
    
    if (cancelEditAddressBtn) {
        cancelEditAddressBtn.addEventListener('click', hideEditAddressForm);
    }
    
    if (saveEditAddressBtn) {
        saveEditAddressBtn.addEventListener('click', saveEditedAddress);
    }
    
    // Função para configurar as datas de entrega
    function setupDeliveryDates() {
        try {
            const today = new Date();
            
            // Correios Sedex: 1-2 dias
            const sedexDelivery = new Date(today);
            sedexDelivery.setDate(today.getDate() + 2);
            const sedexElement = document.getElementById('eta-sedex');
            if (sedexElement) {
                sedexElement.textContent = formatDate(sedexDelivery);
            }
            
            // Retirada: 1 dia
            const pickupDelivery = new Date(today);
            pickupDelivery.setDate(today.getDate() + 1);
            const pickupElement = document.getElementById('eta-pickup');
            if (pickupElement) {
                pickupElement.textContent = formatDate(pickupDelivery);
            }
        } catch (error) {
            console.error('Erro ao configurar datas de entrega:', error);
        }
    }
    
    // Função para carregar os itens do carrinho
    function loadCartItems() {
        try {
            // Obtém os itens do carrinho do localStorage
            const cartItems = JSON.parse(localStorage.getItem('odonto_cart')) || [];
            
            if (cartItems.length === 0) {
                orderItemsContainer.innerHTML = `
                    <div class="empty-cart-message">
                        <p>Seu carrinho está vazio.</p>
                        <a href="/pages/home/index.html" class="btn btn--secondary">Voltar às compras</a>
                    </div>
                `;
                return;
            }
            
            // Verifica se todos os itens têm as propriedades necessárias
            const validItems = cartItems.filter(item => 
                item.hasOwnProperty('id') && 
                item.hasOwnProperty('name') && 
                item.hasOwnProperty('price') && 
                item.hasOwnProperty('quantity') &&
                !isNaN(item.price) &&
                !isNaN(item.quantity)
            );
            
            if (validItems.length !== cartItems.length) {
                console.warn('Alguns itens do carrinho são inválidos e foram ignorados');
            }
            
            if (validItems.length === 0) {
                orderItemsContainer.innerHTML = `
                    <div class="empty-cart-message">
                        <p>Nenhum item válido encontrado no carrinho.</p>
                        <a href="/pages/home/index.html" class="btn btn--secondary">Voltar às compras</a>
                    </div>
                `;
                return;
            }
            
            // Renderiza os itens do carrinho
            renderCartItems(validItems);
            
            // Calcula e exibe os totais
            calculateAndDisplayTotals(validItems);
        } catch (error) {
            console.error('Erro ao carregar itens do carrinho:', error);
            if (orderItemsContainer) {
                orderItemsContainer.innerHTML = `
                    <div class="error-message">
                        <p>Erro ao carregar os itens do carrinho.</p>
                        <p>Detalhes: ${error.message}</p>
                        <button class="btn btn--secondary" onclick="location.reload()">Tentar novamente</button>
                    </div>
                `;
            }
        }
    }
    
    // Função para renderizar os itens do carrinho
    function renderCartItems(items) {
        if (!orderItemsContainer) return;
        
        // Verifica se há cupom aplicado para mostrar preços tachados
        let hasAppliedCoupon = false;
        try {
            const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
            if (appliedCouponStr) {
                try {
                    const appliedCoupon = JSON.parse(appliedCouponStr);
                    // Validate coupon structure
                    if (appliedCoupon && 
                        typeof appliedCoupon === 'object' && 
                        appliedCoupon.code && 
                        typeof appliedCoupon.code === 'string' &&
                        appliedCoupon.type && 
                        (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") &&
                        appliedCoupon.discount && 
                        typeof appliedCoupon.discount === 'number') {
                        hasAppliedCoupon = true;
                    }
                } catch (parseError) {
                    console.error('Failed to parse coupon data in renderCartItems');
                }
            }
        } catch (error) {
            console.error('Erro ao verificar cupom aplicado:', error);
        }
        
        orderItemsContainer.innerHTML = items.map(item => {
            try {
                // Verifica se o preço está em centavos (como no sistema principal) ou em reais
                const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
                const originalPrice = priceInReais * 1.15; // Preço original com 15% a mais
                
                // Verifica se os valores são números válidos
                if (isNaN(priceInReais) || isNaN(originalPrice)) {
                    throw new Error('Invalid price value');
                }
                
                // Adiciona classe para mostrar preços tachados somente quando há cupom
                const itemClass = hasAppliedCoupon ? 'order-item has-discount' : 'order-item';
                
                return `
                <div class="${itemClass}">
                    <div class="item-image">
                        <img src="https://via.placeholder.com/80x80/e8ece9/333?text=${encodeURIComponent(item.name.substring(0, 15))}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-brand">Marca não especificada</div>
                        <div class="item-quantity">Quantidade: ${item.quantity} unidade${item.quantity > 1 ? 's' : ''}</div>
                    </div>
                    <div class="item-price">
                        <span class="price-original">R$ ${originalPrice.toFixed(2).replace('.', ',')}</span>
                        <span class="price-current">R$ ${priceInReais.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            `;
            } catch (error) {
                console.error('Erro ao processar item do carrinho:', item, error);
                return `
                <div class="order-item">
                    <div class="item-image">
                        <img src="https://via.placeholder.com/80x80/e8ece9/333?text=Erro" alt="Erro">
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">Erro ao carregar item</h3>
                        <div class="item-brand">Dados inválidos</div>
                        <div class="item-quantity">Não foi possível exibir este item</div>
                    </div>
                    <div class="item-price">
                        <span class="price-original">-</span>
                        <span class="price-current">-</span>
                    </div>
                </div>
            `;
            }
        }).join('');
    }
    
    // Função para calcular e exibir os totais
    function calculateAndDisplayTotals(items) {
        try {
            // Calcula o subtotal (verificando se o preço está em centavos ou reais)
            const subtotal = items.reduce((sum, item) => {
                try {
                    const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
                    
                    // Verifica se o preço é um número válido
                    if (isNaN(priceInReais)) {
                        throw new Error(`Preço inválido para o item ${item.name}: ${item.price}`);
                    }
                    
                    const itemTotal = priceInReais * item.quantity;
                    
                    // Verifica se o total do item é um número válido
                    if (isNaN(itemTotal)) {
                        throw new Error(`Total inválido para o item ${item.name}`);
                    }
                    
                    return sum + itemTotal;
                } catch (itemError) {
                    console.error('Erro ao calcular total do item:', item, itemError);
                    return sum; // Ignora itens com erro
                }
            }, 0);
            
            // Verifica se há cupom aplicado
            let discount = 0;
            let hasAppliedCoupon = false;
            let appliedCoupon = null;
            try {
                const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
                if (appliedCouponStr) {
                    try {
                        appliedCoupon = JSON.parse(appliedCouponStr);
                        // Validate coupon structure
                        if (appliedCoupon && 
                            typeof appliedCoupon === 'object' && 
                            appliedCoupon.code && 
                            typeof appliedCoupon.code === 'string' &&
                            appliedCoupon.type && 
                            (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") &&
                            appliedCoupon.discount && 
                            typeof appliedCoupon.discount === 'number') {
                            hasAppliedCoupon = true;
                            if (appliedCoupon.type === "percentage") {
                                discount = subtotal * (appliedCoupon.discount / 100);
                            } else if (appliedCoupon.type === "fixed") {
                                discount = appliedCoupon.discount;
                            }
                        } else {
                            // Invalid coupon structure, remove it
                            console.log('Invalid coupon structure in calculateAndDisplayTotals, removing');
                            localStorage.removeItem('odonto_applied_coupon');
                        }
                    } catch (parseError) {
                        console.error('Failed to parse coupon data in calculateAndDisplayTotals, removing');
                        localStorage.removeItem('odonto_applied_coupon');
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar cupom aplicado:', error);
                // Em caso de erro, remove o cupom inválido do localStorage
                localStorage.removeItem('odonto_applied_coupon');
            }
            
            // Se não houver cupom aplicado, não mostra desconto
            const hasDiscount = hasAppliedCoupon && discount > 0;
            
            // Custos de envio (valor padrão - Correios Sedex)
            const shippingCost = 25.00;
            
            // Calcula o total
            const grandTotal = subtotal - discount + shippingCost;
            
            // Atualiza os elementos na interface
            if (document.getElementById('subtotal')) {
                document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            }
            if (document.getElementById('shipping-cost')) {
                document.getElementById('shipping-cost').textContent = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
            }
            if (document.getElementById('grand-total')) {
                document.getElementById('grand-total').textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
            }
            
            // Exibe o desconto somente se houver cupom aplicado
            if (hasAppliedCoupon && hasDiscount) {
                if (document.getElementById('discount-code')) {
                    document.getElementById('discount-code').textContent = appliedCoupon.code;
                }
                if (document.getElementById('discount-value')) {
                    document.getElementById('discount-value').textContent = `Você economizou R$ ${discount.toFixed(2).replace('.', ',')}`;
                }
                if (document.getElementById('discount-amount')) {
                    document.getElementById('discount-amount').textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
                }
                if (discountRow) discountRow.style.display = 'flex';
                if (discountSection) discountSection.style.display = 'block';
            } else {
                if (discountRow) discountRow.style.display = 'none';
                if (discountSection) discountSection.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao calcular totais:', error);
        }
    }
    
    // Função para exibir o cupom aplicado, se houver
    function displayAppliedCoupon() {
        try {
            // First, clean up any invalid coupon data
            const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
            console.log('Applied coupon string from localStorage:', appliedCouponStr); // Debug log
            
            if (appliedCouponStr) {
                let appliedCoupon = null;
                try {
                    appliedCoupon = JSON.parse(appliedCouponStr);
                } catch (parseError) {
                    console.error('Failed to parse coupon data, removing invalid data');
                    localStorage.removeItem('odonto_applied_coupon');
                    // Hide coupon section and return
                    if (discountSection) discountSection.style.display = 'none';
                    if (discountRow) discountRow.style.display = 'none';
                    return;
                }
                
                console.log('Parsed applied coupon:', appliedCoupon); // Debug log
                
                // Validate coupon structure
                if (appliedCoupon && 
                    typeof appliedCoupon === 'object' && 
                    appliedCoupon.code && 
                    typeof appliedCoupon.code === 'string' &&
                    appliedCoupon.type && 
                    (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") &&
                    appliedCoupon.discount && 
                    typeof appliedCoupon.discount === 'number') {
                    
                    console.log('Valid coupon found, displaying coupon section'); // Debug log
                    document.getElementById('discount-code').textContent = appliedCoupon.code;
                    
                    // Exibe a seção de cupom
                    if (discountSection) discountSection.style.display = 'block';
                    
                    // Atualiza o cálculo de totais para usar o cupom real
                    updateTotalsWithCoupon(appliedCoupon);
                    
                    // Re-renderiza os itens do carrinho para mostrar preços tachados
                    const cartItems = JSON.parse(localStorage.getItem('odonto_cart')) || [];
                    if (cartItems.length > 0) {
                        renderCartItems(cartItems);
                    }
                } else {
                    // Invalid coupon structure
                    console.log('Invalid coupon structure, removing and hiding coupon section'); // Debug log
                    localStorage.removeItem('odonto_applied_coupon');
                    if (discountSection) discountSection.style.display = 'none';
                    if (discountRow) discountRow.style.display = 'none';
                }
            } else {
                // No coupon data found
                console.log('No coupon data found, hiding coupon section'); // Debug log
                if (discountSection) discountSection.style.display = 'none';
                if (discountRow) discountRow.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao carregar cupom aplicado:', error);
            // Em caso de erro, esconde a seção de cupom
            if (discountSection) discountSection.style.display = 'none';
            if (discountRow) discountRow.style.display = 'none';
        }
    }
    
    // Função para atualizar totais com cupom aplicado
    function updateTotalsWithCoupon(coupon) {
        try {
            // Verifica se o cupom tem os dados necessários
            if (!coupon || !coupon.code || !(coupon.type === "percentage" || coupon.type === "fixed")) {
                console.log('Invalid coupon provided to updateTotalsWithCoupon');
                return;
            }
            
            // Obtém os itens do carrinho do localStorage
            const cartItems = JSON.parse(localStorage.getItem('odonto_cart')) || [];
            
            // Calcula o subtotal (verificando se o preço está em centavos ou reais)
            const subtotal = cartItems.reduce((sum, item) => {
                try {
                    const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
                    
                    // Verifica se o preço é um número válido
                    if (isNaN(priceInReais)) {
                        throw new Error(`Preço inválido para o item ${item.name}: ${item.price}`);
                    }
                    
                    const itemTotal = priceInReais * item.quantity;
                    
                    // Verifica se o total do item é um número válido
                    if (isNaN(itemTotal)) {
                        throw new Error(`Total inválido para o item ${item.name}`);
                    }
                    
                    return sum + itemTotal;
                } catch (itemError) {
                    console.error('Erro ao calcular total do item:', item, itemError);
                    return sum; // Ignora itens com erro
                }
            }, 0);
            
            // Calcula o desconto com base no cupom
            let discount = 0;
            if (coupon.type === "percentage") {
                discount = subtotal * (coupon.discount / 100);
            } else if (coupon.type === "fixed") {
                discount = coupon.discount;
            }
            
            // Atualiza os elementos na interface
            if (document.getElementById('discount-code')) {
                document.getElementById('discount-code').textContent = coupon.code;
            }
            if (document.getElementById('discount-value')) {
                document.getElementById('discount-value').textContent = `Você economizou R$ ${discount.toFixed(2).replace('.', ',')}`;
            }
            if (document.getElementById('discount-amount')) {
                document.getElementById('discount-amount').textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
            }
            
            if (discountRow) discountRow.style.display = 'flex';
        } catch (error) {
            console.error('Erro ao atualizar totais com cupom:', error);
        }
    }
    
    // Função para formatar a data
    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Função para atualizar o custo de envio
    function updateShippingCost() {
        const selectedOption = document.querySelector('input[name="shipping"]:checked');
        if (!selectedOption) return;
        
        // Valores de frete atualizados
        const shippingCosts = {
            sedex: 25.00,
            pickup: 0.00
        };
        
        const selectedValue = selectedOption.value;
        const shippingCost = shippingCosts[selectedValue] || 0;
        
        // Atualiza o valor do frete na interface
        const shippingCostElement = document.getElementById('shipping-cost');
        if (shippingCostElement) {
            if (shippingCost === 0) {
                shippingCostElement.textContent = 'Grátis';
            } else {
                shippingCostElement.textContent = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
            }
        }
        
        // Recalcula o total do pedido
        recalculateOrderTotal(shippingCost);
    }
    
    // Função para recalcular o total do pedido
    function recalculateOrderTotal(shippingCost) {
        try {
            // Obtém os itens do carrinho do localStorage
            const cartItems = JSON.parse(localStorage.getItem('odonto_cart')) || [];
            
            // Calcula o subtotal (verificando se o preço está em centavos ou reais)
            const subtotal = cartItems.reduce((sum, item) => {
                try {
                    const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
                    
                    // Verifica se o preço é um número válido
                    if (isNaN(priceInReais)) {
                        throw new Error(`Preço inválido para o item ${item.name}: ${item.price}`);
                    }
                    
                    const itemTotal = priceInReais * item.quantity;
                    
                    // Verifica se o total do item é um número válido
                    if (isNaN(itemTotal)) {
                        throw new Error(`Total inválido para o item ${item.name}`);
                    }
                    
                    return sum + itemTotal;
                } catch (itemError) {
                    console.error('Erro ao calcular total do item:', item, itemError);
                    return sum; // Ignora itens com erro
                }
            }, 0);
            
            // Verifica se há cupom aplicado
            let discount = 0;
            try {
                const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
                if (appliedCouponStr) {
                    try {
                        const appliedCoupon = JSON.parse(appliedCouponStr);
                        // Validate coupon structure
                        if (appliedCoupon && 
                            typeof appliedCoupon === 'object' && 
                            appliedCoupon.code && 
                            typeof appliedCoupon.code === 'string' &&
                            appliedCoupon.type && 
                            (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") &&
                            appliedCoupon.discount && 
                            typeof appliedCoupon.discount === 'number') {
                            if (appliedCoupon.type === "percentage") {
                                discount = subtotal * (appliedCoupon.discount / 100);
                            } else if (appliedCoupon.type === "fixed") {
                                discount = appliedCoupon.discount;
                            }
                        } else {
                            // Invalid coupon structure, remove it
                            console.log('Invalid coupon structure in recalculateOrderTotal, removing');
                            localStorage.removeItem('odonto_applied_coupon');
                        }
                    } catch (parseError) {
                        console.error('Failed to parse coupon data in recalculateOrderTotal, removing');
                        localStorage.removeItem('odonto_applied_coupon');
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar cupom aplicado:', error);
            }
            
            const grandTotal = subtotal - discount + shippingCost;
            
            // Atualiza os totais na interface
            const grandTotalElement = document.getElementById('grand-total');
            if (grandTotalElement) {
                grandTotalElement.textContent = `R$ ${grandTotal.toFixed(2).replace('.', ',')}`;
            }
        } catch (error) {
            console.error('Erro ao recalcular total do pedido:', error);
        }
    }
    
    // Função para confirmar o pedido
    function confirmOrder() {
        // Verifica se uma opção de envio foi selecionada
        const selectedOption = document.querySelector('input[name="shipping"]:checked');
        if (!selectedOption) {
            alert('Por favor, selecione uma forma de envio.');
            return;
        }
        
        // Mostra um indicador de carregamento
        const originalText = confirmOrderBtn.innerHTML;
        confirmOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        confirmOrderBtn.disabled = true;
        confirmOrderBtn.classList.add('loading');
        
        // Simula o processo de confirmação do pedido
        setTimeout(() => {
            // Em uma implementação real, aqui você faria uma chamada AJAX para o servidor
            // para processar o pedido
            
            // Para este exemplo, vamos simular uma confirmação bem-sucedida
            alert('Pedido confirmado com sucesso! Você será redirecionado para a página de pagamento.');
            
            // Limpa o carrinho e o cupom aplicado após a confirmação
            localStorage.removeItem('odonto_cart');
            localStorage.removeItem('odonto_applied_coupon');
            
            // Redireciona para a página de pagamento (simulado)
            // window.location.href = '/pagamento/index.html';
            
            // Restaura o botão
            confirmOrderBtn.innerHTML = originalText;
            confirmOrderBtn.disabled = false;
            confirmOrderBtn.classList.remove('loading');
        }, 2000);
    }
    
    // Função para mostrar o formulário de edição de endereço
    function showEditAddressForm() {
        // Preenche os campos do formulário com os dados atuais
        document.getElementById('edit-recipient').value = document.getElementById('address-recipient').textContent;
        document.getElementById('edit-cep').value = document.getElementById('address-zipcode').textContent;
        document.getElementById('edit-number').value = document.getElementById('address-number').textContent;
        document.getElementById('edit-complement').value = document.getElementById('address-complement').textContent;
        
        // Mostra o formulário e esconde a visualização
        addressDisplay.style.display = 'none';
        addressEditForm.style.display = 'block';
    }
    
    // Função para esconder o formulário de edição de endereço
    function hideEditAddressForm() {
        addressEditForm.style.display = 'none';
        addressDisplay.style.display = 'block';
    }
    
    // Função para salvar o endereço editado
    function saveEditedAddress() {
        // Obtém os valores dos campos
        const recipient = document.getElementById('edit-recipient').value;
        const cep = document.getElementById('edit-cep').value;
        const number = document.getElementById('edit-number').value;
        const complement = document.getElementById('edit-complement').value;
        
        // Validação simples
        if (!recipient || !cep || !number) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Atualiza os elementos de exibição
        document.getElementById('address-recipient').textContent = recipient;
        document.getElementById('address-zipcode').textContent = cep;
        document.getElementById('address-number').textContent = number;
        document.getElementById('address-complement').textContent = complement;
        
        // Esconde o formulário e mostra a visualização
        hideEditAddressForm();
        
        // Aqui você poderia salvar os dados em algum lugar, como localStorage ou enviar para o servidor
        console.log('Endereço atualizado:', { recipient, cep, number, complement });
    }
    
    // Função para editar o pedido
    function editOrder() {
        // Confirma se o usuário quer realmente editar o pedido
        if (confirm('Você será redirecionado de volta ao carrinho para editar seu pedido. Deseja continuar?')) {
            // Redireciona para a página do carrinho
            window.location.href = '/pages/checkout/checkout.html'; // Página Minha Conta
        }
    }
    
    // Inicializa os totais do pedido
    updateShippingCost();
});

// Função para carregar dados do cliente (simulada)
function loadCustomerData() {
    // Em uma implementação real, esses dados viriam de uma API ou do localStorage
    const customerData = {
        name: 'Dr. João Silva Santos',
        document: '123.456.789-00',
        email: 'joao.silva@email.com',
        phone: '(71) 99999-9999',
        address: {
            recipient: 'Dr. João Silva Santos',
            zipcode: '40000-000',
            number: '123',
            complement: 'Apto 456'
            // Logradouro, bairro, cidade/estado serão obtidos via API no futuro
        }
    };
    
    // Preenche os campos com os dados do cliente
    document.getElementById('customer-name').textContent = customerData.name;
    document.getElementById('customer-document').textContent = customerData.document;
    document.getElementById('customer-email').textContent = customerData.email;
    document.getElementById('customer-phone').textContent = customerData.phone;
    document.getElementById('address-recipient').textContent = customerData.address.recipient;
    document.getElementById('address-zipcode').textContent = customerData.address.zipcode;
    document.getElementById('address-number').textContent = customerData.address.number;
    document.getElementById('address-complement').textContent = customerData.address.complement;
    // Removido: Logradouro, bairro, cidade/estado serão obtidos via API no futuro
}