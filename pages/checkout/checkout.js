// ===== REFINED CHECKOUT PAGE FUNCTIONALITY =====

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
    const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
    return `
      <div class="cart-item">
        <div class="item-image">
          <img src="https://via.placeholder.com/80x80/e8ece9/333?text=${encodeURIComponent(item.name.substring(0, 15))}" alt="${item.name}">
        </div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <div class="item-brand">Marca não especificada</div>
          <div class="item-quantity">Quantidade: ${item.quantity}</div>
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
      const priceInReais = (item.price > 1000) ? item.price / 100 : item.price;
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