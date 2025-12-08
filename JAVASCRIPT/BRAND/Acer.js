
// Cart and Wishlist data
let cartItems = JSON.parse(localStorage.getItem('Cart')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('Wishlist')) || [];

// Product data for dynamic updates
const productData = {
  // Acer products
  acer1: { name: "Acer Aspire 5", price: 699.99, originalPrice: 799.99, shipping: 15.00, taxRate: 0.10 },
  acer2: { name: "Acer OLED Swift", price: 1299.99, originalPrice: 1499.99, shipping: 15.00, taxRate: 0.10 },
  acer3: { name: "Acer Nitro Gaming", price: 1199.99, originalPrice: 1399.99, shipping: 15.00, taxRate: 0.10 },

  // Apple products
  apple1: { name: "Apple MacBook Air", price: 999.99, originalPrice: 1199.99, shipping: 20.00, taxRate: 0.10 },
  apple2: { name: "Apple MacBook Pro", price: 1999.99, originalPrice: 2199.99, shipping: 20.00, taxRate: 0.10 },
  apple3: { name: "Apple iMac", price: 1799.99, originalPrice: 1999.99, shipping: 25.00, taxRate: 0.10 }
};


// Modal Manager
const ModalManager = {
  currentProductId: null,
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      this.addBackdrop();
    }
  },
  
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      this.removeBackdrop();
    }
  },
  
  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    this.removeBackdrop();
    this.currentProductId = null;
  },
  
  addBackdrop() {
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
      `;
      backdrop.onclick = () => this.closeAllModals();
      document.body.appendChild(backdrop);
    }
  },
  
  removeBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
};

// Product Modal Functions
function openProductModal(productId) {
  // Hide all product modals first
  document.querySelectorAll('.product-modal').forEach(modal => {
    modal.style.display = 'none';
  });
  
  // Show the selected product modal
  const selectedModal = document.getElementById(`${productId}-modal`);
  if (selectedModal) {
    selectedModal.style.display = 'flex';
    ModalManager.currentProductId = productId;
    ModalManager.openModal('productModal');
    updateWishlistButton(productId);
  }
}

function closeProductModal() {
  ModalManager.closeModal('productModal');
}

// Checkout Functions
function openCheckoutModal(productId = null) {
  // Use current product ID or provided one
  const targetProductId = productId || ModalManager.currentProductId;
  
  if (!targetProductId || !productData[targetProductId]) {
    console.error('Product not found');
    return;
  }
  
  const product = productData[targetProductId];
  
  // Update checkout summary
  document.getElementById('checkoutProductName').textContent = product.name;
  document.getElementById('checkoutProductPrice').textContent = `$${product.price.toFixed(2)}`;
  
  // Calculate and update totals
  calculateAndUpdateTotals(product);
  
  // Close product modal if open
  ModalManager.closeModal('productModal');
  
  // Open checkout modal
  ModalManager.openModal('checkoutModal');
}

function calculateAndUpdateTotals(product) {
  const quantity = parseInt(document.getElementById('checkoutQuantity').value) || 1;
  const subtotal = product.price * quantity;
  const tax = subtotal * product.taxRate;
  const shipping = product.shipping * quantity;
  const total = subtotal + tax + shipping;
  
  document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

function closeCheckoutModal() {
  ModalManager.closeModal('checkoutModal');
}

// Cart Functions
function addToCart(productId = null) {
  const targetProductId = productId || ModalManager.currentProductId;
  
  if (!targetProductId || !productData[targetProductId]) {
    console.error('Product not found');
    return;
  }
  
  const product = productData[targetProductId];
  
  // Check if product already in cart
  const existingItemIndex = cartItems.findIndex(item => item.id === targetProductId);
  
  if (existingItemIndex > -1) {
    // Update quantity
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // Add new item
    cartItems.push({
      id: targetProductId,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  // Save to localStorage
  localStorage.setItem('acerCart', JSON.stringify(cartItems));
  
  // Update cart counter
  updateCartCounter();
  
  // Show notification
  showNotification(`${product.name} added to cart!`, 'success');
}

// Wishlist Functions
function toggleWishlist(productId = null) {
  const targetProductId = productId || ModalManager.currentProductId;
  
  if (!targetProductId) {
    console.error('Product not found');
    return;
  }
  
  const index = wishlistItems.indexOf(targetProductId);
  
  if (index > -1) {
    // Remove from wishlist
    wishlistItems.splice(index, 1);
    showNotification('Removed from wishlist', 'info');
  } else {
    // Add to wishlist
    wishlistItems.push(targetProductId);
    showNotification('Added to wishlist!', 'success');
  }
  
  // Save to localStorage
  localStorage.setItem('acerWishlist', JSON.stringify(wishlistItems));
  
  // Update wishlist button
  updateWishlistButton(targetProductId);
}

function updateWishlistButton(productId) {
  const wishlistBtn = document.querySelector(`.wishlist-btn[data-product="${productId}"]`);
  if (wishlistBtn) {
    const isInWishlist = wishlistItems.includes(productId);
    const heartIcon = wishlistBtn.querySelector('i');
    
    if (heartIcon) {
      if (isInWishlist) {
        heartIcon.className = 'fas fa-heart';
        wishlistBtn.style.color = '#e74c3c';
      } else {
        heartIcon.className = 'far fa-heart';
        wishlistBtn.style.color = '';
      }
    }
  }
}

// Order Placement
function placeOrder() {
  // Get form values
  const fullName = document.getElementById('checkoutFullname').value.trim();
  const email = document.getElementById('checkoutEmail').value.trim();
  const address = document.getElementById('checkoutAddress').value.trim();
  const city = document.getElementById('checkoutCity').value.trim();
  const zip = document.getElementById('checkoutZip').value.trim();
  const paymentMethod = document.getElementById('checkoutPayment').value;
  const cardNumber = document.getElementById('checkoutCard').value.trim();
  const termsAgreed = document.getElementById('termsAgreement').checked;
  
  // Validation
  if (!fullName || !email || !address || !city || !zip || !paymentMethod || !cardNumber) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  if (!termsAgreed) {
    showNotification('Please agree to the Terms & Conditions', 'error');
    return;
  }
  
  if (cardNumber.length < 16) {
    showNotification('Please enter a valid card number', 'error');
    return;
  }
  
  // Get current product
  const productId = ModalManager.currentProductId;
  if (!productId || !productData[productId]) {
    showNotification('Product not found', 'error');
    return;
  }
  
  const product = productData[productId];
  const quantity = parseInt(document.getElementById('checkoutQuantity').value) || 1;
  
  // Show processing message
  showNotification('Processing your order...', 'info');
  
  // Simulate order processing
  setTimeout(() => {
    // Create transaction record
   const transaction = {
  id: 'LAPV-' + Date.now(),
  date: new Date().toLocaleString(), // readable format
  customer: fullName,
  email: email,
  product: product.name,
  quantity: quantity,
  unitPrice: product.price.toFixed(2),
  payment: paymentMethod,
  delivery: `${address}, ${city}, ${zip}`,
  total: (product.price * quantity * (1 + product.taxRate) + product.shipping * quantity).toFixed(2),
  status: 'Completed'
};

    
    // Save transaction to localStorage
  let transactions = JSON.parse(localStorage.getItem('salesTransactions')) || [];
transactions.unshift(transaction); // latest first
localStorage.setItem('salesTransactions', JSON.stringify(transactions));

window.location.href = '/HTML/GLOBAL/SalesTransactions.html?newTransaction=1';


document.addEventListener('click', function(event) {
  const checkoutBtn = event.target.closest('.checkout-btn');
  if (!checkoutBtn) return;

  const productId = checkoutBtn.dataset.product;
  openCheckoutModal(productId); // dynamic function handles modal update

  event.preventDefault();
});

    
    // Add to cart history
    addToCart(productId);
    
    // Clear form
    document.querySelectorAll('#checkoutModal input, #checkoutModal select, #checkoutModal textarea').forEach(element => {
      if (element.type !== 'button' && element.type !== 'submit') {
        element.value = '';
      }
    });
    document.getElementById('termsAgreement').checked = false;
    
    // Close modals
    ModalManager.closeAllModals();
    
    // Show success message
    showNotification('✅ Order placed successfully! Redirecting to transactions...', 'success');
    
    // Redirect to transaction page
    setTimeout(() => {
      window.location.href = 'SalesTransactions.html';
    }, 1500);
    
  }, 1500);
}

// Cart Counter
function updateCartCounter() {
  const cartCounter = document.getElementById('cartCounter');
  if (cartCounter) {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Notification System
function showNotification(message, type = 'success') {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(notification => notification.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    font-weight: 500;
    max-width: 400px;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Event Listeners Setup
function setupEventListeners() {
  // View Details Buttons
  document.addEventListener('click', function(event) {
    const viewDetailsBtn = event.target.closest('.view-details-btn');
    if (viewDetailsBtn) {
      const productId = viewDetailsBtn.dataset.product;
      openProductModal(productId);
      event.preventDefault();
    }
  });
  
  // Add to Cart Buttons
  document.addEventListener('click', function(event) {
    const addToCartBtn = event.target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
      const productId = addToCartBtn.dataset.product;
      addToCart(productId);
      event.preventDefault();
    }
  });
  
  // Checkout/Buy Now Buttons
  document.addEventListener('click', function(event) {
    const checkoutBtn = event.target.closest('.checkout-btn');
    if (checkoutBtn) {
      const productId = checkoutBtn.dataset.product;
      openCheckoutModal(productId);
      event.preventDefault();
    }
  });
  
  // Wishlist Buttons
  document.addEventListener('click', function(event) {
    const wishlistBtn = event.target.closest('.wishlist-btn');
    if (wishlistBtn) {
      const productId = wishlistBtn.dataset.product;
      toggleWishlist(productId);
      event.preventDefault();
    }
  });
  
  // Close Modal Buttons
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close-modal')) {
      ModalManager.closeAllModals();
      event.preventDefault();
    }
  });
  
  // Place Order Button
  document.addEventListener('click', function(event) {
    if (event.target.closest('.place-order-btn')) {
      placeOrder();
      event.preventDefault();
    }
  });
  
  // Quantity change in checkout
  document.addEventListener('change', function(event) {
    if (event.target.id === 'checkoutQuantity' && ModalManager.currentProductId) {
      const product = productData[ModalManager.currentProductId];
      if (product) {
        calculateAndUpdateTotals(product);
      }
    }
  });
  
  // Close modal when clicking outside
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      ModalManager.closeAllModals();
    }
  });
  
  // Escape key to close modals
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      ModalManager.closeAllModals();
    }
  });
  
  // Product card click (optional - can open modal directly)
  document.addEventListener('click', function(event) {
    const productCard = event.target.closest('.product-card');
    if (productCard && !event.target.closest('.view-details-btn')) {
      const viewDetailsBtn = productCard.querySelector('.view-details-btn');
      if (viewDetailsBtn) {
        const productId = viewDetailsBtn.dataset.product;
        openProductModal(productId);
      }
    }
  });
}

// Initialize Application
function initAcer() {
  console.log('🚀 Initializing Acer Page...');
  
  // Setup event listeners
  setupEventListeners();
  
  // Update cart counter
  updateCartCounter();
  
  // Load wishlist status
  wishlistItems.forEach(productId => {
    updateWishlistButton(productId);
  });
  
  // Make functions globally available
  window.openProductModal = openProductModal;
  window.closeProductModal = closeProductModal;
  window.openCheckoutModal = openCheckoutModal;
  window.closeCheckoutModal = closeCheckoutModal;
  window.addToCart = addToCart;
  window.toggleWishlist = toggleWishlist;
  window.placeOrder = placeOrder;
  
  console.log('✅ Acer Page Initialized');
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAcer);
} else {
  initAcer();
}

// Add CSS for notification
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
    animation: slideInRight 0.3s ease;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .modal-backdrop {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(notificationStyles);