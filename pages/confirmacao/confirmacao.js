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
            
            // Calcula e exibe os totais antes de renderizar os itens para garantir consistência
            const totals = calculateAndDisplayTotals(validItems);
            
            // Renderiza os itens do carrinho
            renderCartItems(validItems);
            
            // Verifica e exibe cupom aplicado, se houver
            displayAppliedCoupon();
            
            return validItems;
        } catch (error) {
            console.error('Erro ao carregar itens do carrinho:', error);
            orderItemsContainer.innerHTML = `
                <div class="error-message">
                    <p>Ocorreu um erro ao carregar os itens do carrinho.</p>
                    <button class="btn btn--secondary" onclick="location.reload()">Recarregar Página</button>
                </div>
            `;
            return [];
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
                const itemPrice = item.price_current || item.price;
                const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
                const originalPrice = item.price_original ? (item.price_original > 1000 ? item.price_original / 100 : item.price_original) : (priceInReais * 1.15);
                
                // Verificar informações de parcelamento
                let installmentInfo = '';
                if (item.installments) {
                    const installmentCount = item.installments.count || 10;
                    const installmentValue = item.installments.value || (priceInReais / installmentCount);
                    installmentInfo = `${installmentCount}x sem juros de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
                } else {
                    // Usar padrão de 10x se não houver informações específicas
                    installmentInfo = `10x sem juros de R$ ${(priceInReais/10).toFixed(2).replace('.', ',')}`;
                }
                
                // Verifica se os valores são números válidos
                if (isNaN(priceInReais) || isNaN(originalPrice) || !isFinite(priceInReais) || !isFinite(originalPrice)) {
                    console.warn(`Valores inválidos para o item ${item.name}: price=${itemPrice}, calculated=${priceInReais}`);
                    throw new Error(`Invalid price value`);
                }
                
                // Obter informações do produto do banco de dados para usar imagem real
                const productInfo = window.app ? window.app.productDB.getProduct(item.id) : null;
                const productImage = productInfo ? productInfo.image : 
                                   (item.image || `https://placehold.co/60x60/e8ece9/333?text=${encodeURIComponent(item.name.substring(0, 15))}`);
                
                const brand = productInfo ? productInfo.brand : 'Marca não especificada';
                
                // Calcular preço unitário e total com as mesmas regras da função de cálculo de subtotal
                const itemUnitPrice = priceInReais;
                const itemTotalPrice = itemUnitPrice * item.quantity;
                
                // Verificar se os valores calculados são válidos
                if (isNaN(itemUnitPrice) || isNaN(itemTotalPrice) || !isFinite(itemUnitPrice) || !isFinite(itemTotalPrice) || itemUnitPrice <= 0 || itemTotalPrice <= 0) {
                    console.warn(`Cálculo inválido para o item ${item.name}: unitPrice=${itemUnitPrice}, totalPrice=${itemTotalPrice}`);
                    throw new Error(`Invalid calculated price`);
                }
                
                // Adiciona classe para mostrar preços tachados somente quando há cupom
                const itemClass = hasAppliedCoupon ? 'order-item has-discount' : 'order-item';
                
                return `
                <div class="${itemClass}">
                    <div class="cart-item__image">
                        <img src="${productImage}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/e8ece9/333?text=Produto';">
                    </div>
                    <div class="cart-item__info">
                        <h4 class="item-name">${item.name}</h4>
                        <div class="item-brand">${brand}</div>
                        <div class="item-quantity">Quantidade: ${item.quantity} unidade${item.quantity > 1 ? 's' : ''}</div>
                        <div class="item-installment">${installmentInfo}</div>
                    </div>
                    <div class="cart-item__price">
                        ${hasAppliedCoupon ? `<div class="price-original">R$ ${originalPrice.toFixed(2).replace('.', ',')}</div>` : ''}
                        <div class="price-current">R$ ${itemUnitPrice.toFixed(2).replace('.', ',')}</div>
                    </div>
                </div>
            `;
            } catch (error) {
                console.error('Erro ao processar item do carrinho:', item, error);
                return `
                <div class="order-item">
                    <div class="cart-item__image">
                        <img src="https://placehold.co/60x60/e8ece9/333?text=Erro" alt="Erro" onerror="this.src='https://placehold.co/60x60/e8ece9/333?text=Erro';">
                    </div>
                    <div class="cart-item__info">
                        <h4 class="item-name">Erro ao carregar item</h4>
                        <div class="item-brand">Dados inválidos</div>
                        <div class="item-quantity">Não foi possível exibir este item</div>
                    </div>
                    <div class="cart-item__price">
                        <div class="price-current">-</div>
                    </div>
                </div>
            `;
            }
        }).join('');
    }
    
    // Função de cálculo universal para totais do pedido
    function calculateOrderTotals(items) {
        // Inicializa valores
        let subtotal = 0;
        let discount = 0;
        let shippingCost = 25.00; // Valor padrão
        let hasValidCoupon = false;
        let appliedCoupon = null;
        
        // Calcula subtotal a partir dos itens
        for (const item of items) {
            try {
                const itemPrice = item.price_current || item.price;
                const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
                
                // Validação de preço
                if (typeof priceInReais === 'number' && isFinite(priceInReais) && priceInReais > 0) {
                    const itemTotal = priceInReais * item.quantity;
                    if (typeof itemTotal === 'number' && isFinite(itemTotal) && itemTotal > 0) {
                        subtotal += itemTotal;
                    }
                }
            } catch (error) {
                console.warn('Erro ao processar item:', item, error);
            }
        }
        
        // Valida subtotal
        subtotal = typeof subtotal === 'number' && isFinite(subtotal) && subtotal >= 0 ? subtotal : 0;
        
        // Processa cupom se existir
        try {
            const couponData = localStorage.getItem('odonto_applied_coupon');
            if (couponData) {
                const coupon = JSON.parse(couponData);
                
                // Valida estrutura do cupom
                if (coupon && 
                    typeof coupon === 'object' && 
                    typeof coupon.code === 'string' && 
                    coupon.code.trim() !== '' &&
                    typeof coupon.type === 'string' && 
                    ['percentage', 'fixed'].includes(coupon.type) &&
                    typeof coupon.discount === 'number' && 
                    coupon.discount >= 0) {
                    
                    hasValidCoupon = true;
                    appliedCoupon = coupon;
                    
                    // Calcula desconto
                    if (coupon.type === 'percentage') {
                        discount = subtotal * (coupon.discount / 100);
                    } else if (coupon.type === 'fixed') {
                        discount = Math.min(coupon.discount, subtotal); // Não pode exceder subtotal
                    }
                    
                    // Garante que desconto não exceda subtotal
                    discount = Math.min(discount, subtotal);
                } else {
                    // Remove cupom inválido
                    localStorage.removeItem('odonto_applied_coupon');
                }
            }
        } catch (error) {
            console.warn('Erro ao processar cupom:', error);
            localStorage.removeItem('odonto_applied_coupon');
        }
        
        // Calcula totais finais
        const totalAfterDiscount = subtotal - discount;
        const grandTotal = totalAfterDiscount + shippingCost;
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)), 
            shippingCost: parseFloat(shippingCost.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
            hasValidCoupon,
            appliedCoupon
        };
    }
    
    // Função para atualizar a exibição dos totais
    function displayOrderTotals(totals) {
        // Atualiza subtotal
        const subtotalElement = document.getElementById('subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `R$ ${totals.subtotal.toFixed(2).replace('.', ',')}`;
        }
        
        // Atualiza desconto
        const discountRow = document.getElementById('discount-row');
        const discountAmount = document.getElementById('discount-amount');
        const discountSection = document.getElementById('discount-section');
        const discountCode = document.getElementById('discount-code');
        const discountValue = document.getElementById('discount-value');
        
        if (totals.hasValidCoupon && totals.discount > 0) {
            if (discountAmount) {
                discountAmount.textContent = `- R$ ${totals.discount.toFixed(2).replace('.', ',')}`;
            }
            if (discountRow) discountRow.style.display = 'flex';
            if (discountSection) discountSection.style.display = 'block';
            
            // Atualiza informações do cupom
            if (totals.appliedCoupon) {
                if (discountCode) discountCode.textContent = totals.appliedCoupon.code;
                if (discountValue) {
                    const displayValue = totals.appliedCoupon.type === 'percentage' 
                        ? `${totals.appliedCoupon.discount}%` 
                        : `R$ ${totals.appliedCoupon.discount.toFixed(2).replace('.', ',')}`;
                    discountValue.textContent = displayValue;
                }
            }
        } else {
            if (discountRow) discountRow.style.display = 'none';
            if (discountSection) discountSection.style.display = 'none';
        }
        
        // Atualiza frete
        const shippingElement = document.getElementById('shipping-cost');
        if (shippingElement) {
            shippingElement.textContent = `R$ ${totals.shippingCost.toFixed(2).replace('.', ',')}`;
        }
        
        // Atualiza total geral
        const grandTotalElement = document.getElementById('grand-total');
        if (grandTotalElement) {
            grandTotalElement.textContent = `R$ ${totals.grandTotal.toFixed(2).replace('.', ',')}`;
        }
    }
    
    // Função principal para calcular e exibir totais
    function calculateAndDisplayTotals(items) {
        try {
            const totals = calculateOrderTotals(items);
            displayOrderTotals(totals);
            
            return totals;
        } catch (error) {
            console.error('Erro ao calcular e exibir totais:', error);
            
            // Exibe valores padrão em caso de erro
            const defaultTotals = {
                subtotal: 0,
                discount: 0, 
                shippingCost: 25.00,
                grandTotal: 25.00,
                hasValidCoupon: false,
                appliedCoupon: null
            };
            
            displayOrderTotals(defaultTotals);
            return defaultTotals;
        }
    }
    
    // Função para verificar e exibir cupom aplicado
    function displayAppliedCoupon() {
        try {
            // Obtém o cupom aplicado do localStorage
            const appliedCouponStr = localStorage.getItem('odonto_applied_coupon');
            
            // Verifica se há algo no localStorage
            if (appliedCouponStr && appliedCouponStr !== 'null' && appliedCouponStr !== 'undefined') {
                const appliedCoupon = JSON.parse(appliedCouponStr);
                
                // Valida se o cupom tem uma estrutura válida
                if (appliedCoupon && 
                    typeof appliedCoupon === 'object' && 
                    appliedCoupon.code && 
                    typeof appliedCoupon.code === 'string' &&
                    appliedCoupon.type && 
                    (appliedCoupon.type === "percentage" || appliedCoupon.type === "fixed") && 
                    appliedCoupon.discount && 
                    typeof appliedCoupon.discount === 'number') {
                    
                    // Exibe o cupom aplicado
                    document.getElementById('discount-code').textContent = appliedCoupon.code;
                    document.getElementById('discount-value').textContent = appliedCoupon.type === "percentage" 
                        ? `${appliedCoupon.discount}%` 
                        : `R$ ${appliedCoupon.discount.toFixed(2).replace('.', ',')}`;
                    
                    // Mostra a seção de desconto
                    const discountSection = document.getElementById('discount-section');
                    const discountRow = document.getElementById('discount-row');
                    if (discountSection) discountSection.style.display = 'block';
                    if (discountRow) discountRow.style.display = 'flex';
                    
                    console.log('Cupom aplicado exibido:', appliedCoupon.code);
                } else {
                    // Estrutura inválida, remove o cupom
                    console.log('Estrutura de cupom inválida encontrada, removendo');
                    localStorage.removeItem('odonto_applied_coupon');
                    
                    // Esconde a seção de desconto
                    const discountSection = document.getElementById('discount-section');
                    const discountRow = document.getElementById('discount-row');
                    if (discountSection) discountSection.style.display = 'none';
                    if (discountRow) discountRow.style.display = 'none';
                }
            } else {
                // Não há cupom aplicado, esconde a seção de desconto
                const discountSection = document.getElementById('discount-section');
                const discountRow = document.getElementById('discount-row');
                if (discountSection) discountSection.style.display = 'none';
                if (discountRow) discountRow.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao exibir cupom aplicado:', error);
            // Em caso de erro, remove o cupom inválido do localStorage
            localStorage.removeItem('odonto_applied_coupon');
            
            // Esconde a seção de desconto
            const discountSection = document.getElementById('discount-section');
            const discountRow = document.getElementById('discount-row');
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
                    // Usar price_current se dispon�vel, sen�o usar o campo price antigo para compatibilidade\n                    const itemPrice = item.price_current || item.price;\n                    const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
                    
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
            
            // Garantir que o subtotal também seja atualizado
            if (document.getElementById('subtotal')) {
                // Recalcula o subtotal de forma segura para evitar zeros
                const cartItems = JSON.parse(localStorage.getItem('odonto_cart')) || [];
                const recalculatedSubtotal = cartItems.reduce((sum, item) => {
                    try {
                        const itemPrice = item.price_current || item.price;
                        const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
                        if (!isNaN(priceInReais) && priceInReais > 0) {
                            const itemTotal = priceInReais * item.quantity;
                            if (!isNaN(itemTotal) && itemTotal > 0) {
                                return sum + itemTotal;
                            }
                        }
                        return sum;
                    } catch (itemError) {
                        return sum;
                    }
                }, 0);
                
                document.getElementById('subtotal').textContent = `R$ ${recalculatedSubtotal.toFixed(2).replace('.', ',')}`;
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
                    // Usar price_current se dispon�vel, sen�o usar o campo price antigo para compatibilidade\n                    const itemPrice = item.price_current || item.price;\n                    const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
                    
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
            
            // Atualiza os totais na interface usando a nova lógica centralizada
            const totals = calculateOrderTotals(cartItems);
            
            // Atualiza totais com o frete fornecido
            const updatedTotals = {
                ...totals,
                shippingCost: parseFloat(shippingCost.toFixed(2)),
                grandTotal: parseFloat((totals.subtotal - totals.discount + shippingCost).toFixed(2))
            };
            
            // Atualiza a exibição
            displayOrderTotals(updatedTotals);
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
    
    // Limpar cupom aplicado quando o usuário sair da página
    window.addEventListener('beforeunload', function() {
        // Remover o cupom do localStorage para que precise ser inserido novamente
        localStorage.removeItem('odonto_applied_coupon');
    });
    
    // Alternativamente, para remover o cupom quando sair da página de confirmação e ir para outra página
    window.addEventListener('unload', function() {
        // Remover o cupom do localStorage para que precise ser inserido novamente
        localStorage.removeItem('odonto_applied_coupon');
    });
});

// Função para carregar os dados do cliente
    function loadCustomerData() {
        try {
            // Verifica se há usuário logado
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const userId = localStorage.getItem('userId');
            
            if (isLoggedIn && userId) {
                // Tenta carregar dados do arquivo minha-conta.json
                fetch('/data/minha-conta.json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        const usuarioLogado = data.usuarios.find(usuario => usuario.id === userId);
                        if (usuarioLogado) {
                            // Preenche os dados do cliente
                            document.getElementById('customer-name').textContent = usuarioLogado.perfil.nome || '-';
                            document.getElementById('customer-document').textContent = usuarioLogado.perfil.cpf || usuarioLogado.perfil.cnpj || '-';
                            document.getElementById('customer-email').textContent = usuarioLogado.perfil.email || '-';
                            document.getElementById('customer-phone').textContent = usuarioLogado.perfil.telefone || '-';
                            
                            // Preenche os dados de endereço (primeiro endereço ou endereço principal)
                            if (usuarioLogado.enderecos && usuarioLogado.enderecos.length > 0) {
                                // Procura primeiro pelo endereço principal, senão pega o primeiro
                                const enderecoPrincipal = usuarioLogado.enderecos.find(end => end.principal === true);
                                const endereco = enderecoPrincipal || usuarioLogado.enderecos[0];
                                
                                document.getElementById('address-recipient').textContent = usuarioLogado.perfil.nome || '-';
                                document.getElementById('address-zipcode').textContent = endereco.cep || '-';
                                document.getElementById('address-number').textContent = endereco.numero || '-';
                                document.getElementById('address-complement').textContent = endereco.complemento || '-';
                            }
                        } else {
                            // Se não encontrar o usuário, usa fallback
                            console.warn('Usuário não encontrado no arquivo minha-conta.json');
                            loadCustomerDataFallback();
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao carregar dados do usuário:', error);
                        // Fallback para dados locais
                        loadCustomerDataFallback();
                    });
            } else {
                // Se não estiver logado, usa fallback
                loadCustomerDataFallback();
            }
        } catch (error) {
            console.error('Erro ao carregar dados do cliente:', error);
            loadCustomerDataFallback();
        }
    }
    
    // Função fallback para carregar dados do cliente
    function loadCustomerDataFallback() {
        try {
            // Obtém os dados do cliente do localStorage
            const customerData = JSON.parse(localStorage.getItem('odonto_customer_data')) || {};
            
            // Preenche os dados do cliente
            document.getElementById('customer-name').textContent = customerData.name || '-';
            document.getElementById('customer-document').textContent = customerData.document || customerData.cpf || customerData.cnpj || '-';
            document.getElementById('customer-email').textContent = customerData.email || '-';
            document.getElementById('customer-phone').textContent = customerData.phone || '-';
            
            // Preenche os dados de endereço
            document.getElementById('address-recipient').textContent = customerData.recipient || customerData.name || '-';
            document.getElementById('address-zipcode').textContent = customerData.zipcode || customerData.cep || '-';
            document.getElementById('address-number').textContent = customerData.number || '-';
            document.getElementById('address-complement').textContent = customerData.complement || customerData.complemento || '-';
        } catch (error) {
            console.error('Erro ao carregar dados do cliente (fallback):', error);
        }
    }
