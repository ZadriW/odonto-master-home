// ===== REFINED CHECKOUT PAGE FUNCTIONALITY =====

// Carregar o banco de dados de produtos antes de qualquer operação
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se o app principal já está inicializado (pode ter vindo de outros scripts)
  if (!window.app) {
    // Se não estiver inicializado, criar uma instância simplificada
    window.app = {
      productDB: {
        products: {},
        // Função para obter produto
        getProduct(productId) {
          // Em ambiente de checkout, buscar do localStorage ou carregar dados básicos
          const allProducts = {
            'prod1': { id: 'prod1', name: 'Kit Clareamento Dental Whiteness HP', price: 18990, discount: 27, image: '/images/clareador-whiteness.png', category: 'Clareamento Dental', brand: 'Whiteness' },
            'prod2': { id: 'prod2', name: 'Resina Composta Z350 XT', price: 24590, discount: 15, image: '/images/resina-composta.png', category: 'Resina Composta', brand: 'Z350' },
            'prod3': { id: 'prod3', name: 'Anestésico Mepivacaína 3%', price: 8990, discount: 30, image: '/images/anestesico.png', category: 'Anestésico', brand: 'Mepivacaína' },
            'prod4': { id: 'prod4', name: 'Broca Carbide FG 245', price: 3490, discount: 10, image: '/images/broca.png', category: 'Broca', brand: 'Carbide' },
            'prod5': { id: 'prod5', name: 'Fotopolimerizador LED Radii Plus', price: 89900, discount: 20, image: '/images/fotopolimerizador.png', category: 'Fotopolimerizador', brand: 'Radii' },
            'prod6': { id: 'prod6', name: 'Cimento de Ionômero de Vidro', price: 5690, discount: 18, image: '/images/ionomero.png', category: 'Cimento', brand: 'Marca' },
            'prod7': { id: 'prod7', name: 'Kit Endodontia Rotatória Avançado', price: 145000, discount: 25, image: '/images/kit-endodontia.png', category: 'Kit', brand: 'Kit' },
            'prod8': { id: 'prod8', name: 'Ácido Fosfórico 37% Gel', price: 2290, discount: 12, image: '/images/acido.png', category: 'Ácido Fosfórico', brand: 'Marca' },
            'prod9': { id: 'prod9', name: 'Autoclave Vitale Class CD 21 Litros', price: 450000, discount: 10, image: '/images/autoclave.png', category: 'Autoclave', brand: 'Vitale' },
            'prod10': { id: 'prod10', name: 'Cadeira Odontológica Kavo Unik', price: 2500000, discount: 15, image: '/images/cadeira.png', category: 'Cadeira Odontológica', brand: 'Kavo' }
          };
          return allProducts[productId] || null;
        }
      }
    };
  }
});

// Get cart data from localStorage using the existing cart system
function getCartData() {
  try {
    const cart = localStorage.getItem('odonto_cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
}

// Save cart data to localStorage
function saveCartData(cart) {
  try {
    localStorage.setItem('odonto_cart', JSON.stringify(cart));
    // Dispatch event to notify other parts of the app
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    return true;
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
    return false;
  }
}

// Get cart data
let cartData = getCartData();

// Coupon data (in a real application, this would come from an API)
let appliedCoupon = null;
const coupons = {
  "DESC10": { discount: 10, type: "percentage" },
  "DESC20": { discount: 20, type: "percentage" },
  "DESC50": { discount: 50, type: "fixed" }
};

// DOM Elements
const cartItemsContainer = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const discountLine = document.getElementById('discountLine');
const discountAmount = document.getElementById('discountAmount');
const totalAmount = document.getElementById('totalAmount');
const couponInput = document.getElementById('couponInput');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const finalizeOrderBtn = document.getElementById('finalizeOrderBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  renderCartItems();
  updateCartTotals();
  
  // Event listeners
  applyCouponBtn.addEventListener('click', applyCoupon);
  continueShoppingBtn.addEventListener('click', continueShopping);
  finalizeOrderBtn.addEventListener('click', finalizeOrder);
  
  // Listen for cart updates from other pages
  window.addEventListener('cartUpdated', function(event) {
    cartData = event.detail || getCartData() || [];
    renderCartItems();
    updateCartTotals();
  });
});

// Render cart items
function renderCartItems() {
  if (!cartItemsContainer) return;
  
  if (!cartData || cartData.length === 0) {
    cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    return;
  }
  
  cartItemsContainer.innerHTML = cartData.map(item => {
    // Usar price_current se disponível, senão usar o campo price antigo para compatibilidade
    const itemPrice = item.price_current || item.price;
    let priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
    
    // Verificar se temos informações de parcelamento no item
    let installmentInfo = '';
    if (item.installments) {
      const installmentCount = item.installments.count || 10;
      const installmentValue = item.installments.value || (priceInReais / installmentCount);
      installmentInfo = `${installmentCount}x sem juros de R$ ${installmentValue.toFixed(2).replace('.', ',')}`;
    } else {
      // Usar padrão de 10x se não houver informações específicas
      installmentInfo = `10x sem juros de R$ ${(priceInReais/10).toFixed(2).replace('.', ',')}`;
    }
    
    // Obter informações do produto do banco de dados para usar imagem real
    const productInfo = window.app ? window.app.productDB.getProduct(item.id) : null;
    const productImage = productInfo ? productInfo.image : 
                        (item.image || `https://placehold.co/60x60/e8ece9/333?text=${encodeURIComponent(item.name.substring(0, 15))}`);
    
    const brand = productInfo ? productInfo.brand : 'Marca não especificada';
    
    return `
      <div class="cart-item">
        <div class="cart-item__image">
          <img src="${productImage}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/e8ece9/333?text=Produto';">
        </div>
        <div class="cart-item__info">
          <h4 class="item-name">${item.name}</h4>
          <div class="item-brand">${brand}</div>
          <div class="item-quantity">Quantidade: ${item.quantity}</div>
          <div class="item-installment">${installmentInfo}</div>
        </div>
        <div class="item-price">
          R$ ${priceInReais.toFixed(2).replace('.', ',')}
        </div>
      </div>
    `;
  }).join('');
}

// Update item quantity
function updateQuantity(itemId, change) {
  const item = cartData.find(item => item.id == itemId);
  if (item) {
    const newQuantity = item.quantity + change;
    
    // Update quantity in cart
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      removeItem(itemId);
    } else {
      // Update quantity
      item.quantity = newQuantity;
      saveCartData(cartData);
    }
    
    // Re-render the cart and update totals
    renderCartItems();
    updateCartTotals();
  }
}

// Remove item from cart
function removeItem(itemId) {
  cartData = cartData.filter(item => item.id != itemId);
  saveCartData(cartData);
  
  // Re-render the cart and update totals
  renderCartItems();
  updateCartTotals();
}

// Apply coupon
function applyCoupon() {
  const couponCode = couponInput.value.trim().toUpperCase();
  
  if (coupons[couponCode]) {
    appliedCoupon = {
      code: couponCode,
      ...coupons[couponCode]
    };
    
    // Save applied coupon to localStorage
    localStorage.setItem('odonto_applied_coupon', JSON.stringify(appliedCoupon));
    
    alert(`Cupom "${couponCode}" aplicado com sucesso!`);
    updateCartTotals();
  } else {
    alert('Cupom inválido. Por favor, verifique o código e tente novamente.');
  }
}

// Update cart totals
function updateCartTotals() {
  // Calculate subtotal
    let subtotal = 0;
    if (cartData && cartData.length > 0) {
      cartData.forEach(item => {
        // Usar price_current se disponível, senão usar o campo price antigo para compatibilidade
        const itemPrice = item.price_current || item.price;
        const priceInReais = (itemPrice > 1000) ? itemPrice / 100 : itemPrice;
        subtotal += priceInReais * item.quantity;
      });
    }
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = subtotal * (appliedCoupon.discount / 100);
    } else if (appliedCoupon.type === "fixed") {
      discount = appliedCoupon.discount;
    }
  }
  
  // Calculate total
  const total = subtotal - discount;
  
  // Update the DOM
  subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  
  if (appliedCoupon) {
    discountLine.style.display = 'flex';
    discountAmount.textContent = `- R$ ${discount.toFixed(2).replace('.', ',')}`;
    
    // Save applied coupon to localStorage
    localStorage.setItem('odonto_applied_coupon', JSON.stringify(appliedCoupon));
  } else {
    discountLine.style.display = 'none';
  }
  
  totalAmount.innerHTML = `<strong>R$ ${total.toFixed(2).replace('.', ',')}</strong>`;
}

// Finalize order
function finalizeOrder() {
  if (!cartData || cartData.length === 0) {
    alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
    return;
  }
  
  // In a real implementation, this would submit the order
  alert('Pedido finalizado com sucesso!');
  // Clear cart after order is finalized
  saveCartData([]);
  // Redirect to confirmation page
  // window.location.href = '/pages/confirmacao/confirmacao.html';
}

// Make addItemToCart globally accessible for testing
window.addItemToCart = function(item) {
  // Check if item already exists in cart
  const existingItem = cartData.find(cartItem => cartItem.id == item.id);
  
  if (existingItem) {
    // If item exists, increase quantity
    existingItem.quantity += item.quantity || 1;
  } else {
    // If item doesn't exist, add it to cart
    cartData.push(item);
  }
  
  saveCartData(cartData);
  renderCartItems();
  updateCartTotals();
};