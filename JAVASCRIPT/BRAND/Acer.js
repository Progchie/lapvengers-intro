// Enhanced Product data with more details
const products = {
  acer1: {
    id: "acer1",
    name: "Acer Aspire 5",
    price: "$699.99",
    originalPrice: "$799.99",
    image: "IMAGES/Acer/ProductAcer1.png",
    badge: "BEST SELLER",
    rating: 4.5,
    reviews: 128,
    specs: [
      { name: "Processor", value: "Intel Core i5-1135G7" },
      { name: "RAM", value: "8GB DDR4" },
      { name: "Storage", value: "512GB SSD" },
      { name: "Display", value: '15.6" Full HD IPS' },
      { name: "Graphics", value: "Intel Iris Xe Graphics" },
      { name: "Battery", value: "Up to 8 hours" },
      { name: "Weight", value: "1.65 kg" }
    ],
    features: ["Thin & Light", "Backlit Keyboard", "Fingerprint Reader", "Wi-Fi 6"]
  },
  acer2: {
    id: "acer2",
    name: "Acer OLED Swift",
    price: "$1,299.99",
    originalPrice: "$1,499.99",
    image: "/IMAGES/Acer/ProductAcer2.png",
    badge: "PREMIUM",
    rating: 4.8,
    reviews: 64,
    specs: [
      { name: "Processor", value: "Intel Core i7-1165G7" },
      { name: "RAM", value: "16GB LPDDR4X" },
      { name: "Storage", value: "1TB NVMe SSD" },
      { name: "Display", value: '14" 2.8K OLED' },
      { name: "Graphics", value: "Intel Iris Xe Graphics" },
      { name: "Battery", value: "Up to 10 hours" },
      { name: "Weight", value: "1.2 kg" }
    ],
    features: ["OLED Display", "Military Grade Durability", "Thunderbolt 4", "AI Noise Cancellation"]
  },
  acer3: {
    id: "acer3",
    name: "Acer Nitro Gaming",
    price: "$1,199.99",
    originalPrice: "$1,399.99",
    image: "/IMAGES/Acer/ProductAcer3.png",
    badge: "GAMING",
    rating: 4.6,
    reviews: 89,
    specs: [
      { name: "Processor", value: "AMD Ryzen 7 5800H" },
      { name: "RAM", value: "16GB DDR4", icon: "💾" },
      { name: "Storage", value: "1TB SSD + 1TB HDD" },
      { name: "Display", value: '15.6" Full HD 144Hz' },
      { name: "Graphics", value: "NVIDIA GeForce RTX 3060" },
      { name: "Battery", value: "Up to 6 hours" },
      { name: "Weight", value: "2.4 kg" }
    ],
    features: ["RGB Keyboard", "CoolBoost Technology", "4-Zone RGB", "NitroSense"]
  }
};

// Current selected product and state
let currentProduct = null;
let cartItems = JSON.parse(localStorage.getItem('acerCart')) || [];

// Enhanced modal management
const ModalManager = {
  openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
    this.addBackdrop();
  },

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
    this.removeBackdrop();
  },

  addBackdrop() {
    const backdrop = document.createElement('div');
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
  },

  removeBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  },

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    this.removeBackdrop();
    document.body.style.overflow = 'auto';
  }
};

// Enhanced product modal with image gallery
function openProductModal(productId) {
  currentProduct = products[productId];
  if (!currentProduct) return;

  const modal = document.getElementById('productModal');
  
  // Update modal content
  document.getElementById('modalProductName').textContent = currentProduct.name;
  document.getElementById('modalProductPrice').textContent = currentProduct.price;
  
  if (currentProduct.originalPrice) {
    document.getElementById('modalOriginalPrice').textContent = currentProduct.originalPrice;
    document.getElementById('modalOriginalPrice').style.display = 'inline';
  }
  
  document.getElementById('modalProductImage').src = currentProduct.image;
  document.getElementById('modalProductBadge').textContent = currentProduct.badge;
  
  // Update rating
  const ratingElement = document.getElementById('modalProductRating');
  ratingElement.innerHTML = `⭐ ${currentProduct.rating} (${currentProduct.reviews} reviews)`;
  
  // Update specs with icons
  const specsList = document.getElementById('modalProductSpecs');
  specsList.innerHTML = '';
  
  currentProduct.specs.forEach(spec => {
    const li = document.createElement('li');
    li.className = 'spec-item';
    li.innerHTML = `
      <span class="spec-icon">${spec.icon || '📊'}</span>
      <span class="spec-name">${spec.name}:</span>
      <span class="spec-value">${spec.value}</span>
    `;
    specsList.appendChild(li);
  });
  
  // Update features
  const featuresContainer = document.getElementById('modalProductFeatures');
  featuresContainer.innerHTML = '';
  
  currentProduct.features.forEach(feature => {
    const span = document.createElement('span');
    span.className = 'feature-tag';
    span.textContent = feature;
    featuresContainer.appendChild(span);
  });
  
  ModalManager.openModal('productModal');
}

// Enhanced checkout with quantity
function openCheckoutModal() {
  if (!currentProduct) return;
  
  document.getElementById('checkoutProductName').textContent = currentProduct.name;
  document.getElementById('checkoutProductPrice').textContent = currentProduct.price;
  
  // Calculate totals
  const price = parseFloat(currentProduct.price.replace('$', ''));
  const quantity = parseInt(document.getElementById('checkoutQuantity')?.value || 1);
  const subtotal = price * quantity;
  const tax = subtotal * 0.1;
  const shipping = quantity * 15;
  const total = subtotal + tax + shipping;
  
  document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
  
  ModalManager.closeModal('productModal');
  ModalManager.openModal('checkoutModal');
}

// Enhanced cart functionality
function addToCart() {
  if (!currentProduct) return;
  
  const existingItem = cartItems.find(item => item.id === currentProduct.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...currentProduct,
      quantity: 1
    });
  }
  
  localStorage.setItem('acerCart', JSON.stringify(cartItems));
  updateCartCounter();
  showNotification(`${currentProduct.name} added to cart!`);
}

function updateCartCounter() {
  const cartCounter = document.getElementById('cartCounter');
  if (cartCounter) {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
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

// ENHANCED order placement with redirect to transaction.html
function placeOrder() {
  const email = document.getElementById('checkoutEmail')?.value;
  const address = document.getElementById('checkoutAddress')?.value;
  
  if (!email || !address) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  // Simulate order processing
  showNotification('Processing your order...', 'info');
  
  setTimeout(() => {
    // Get order details
    const quantity = parseInt(document.getElementById('checkoutQuantity')?.value || 1);
    const price = parseFloat(currentProduct.price.replace('$', ''));
    const total = price * quantity;
    
    // Save transaction data to localStorage
    const transactionData = {
      id: 'TRX-' + Date.now(),
      date: new Date().toLocaleString(),
      customer: email.split('@')[0] || 'Customer',
      product: currentProduct.name,
      quantity: quantity,
      unitPrice: currentProduct.price,
      payment: 'Credit Card', // Default or get from form
      delivery: address,
      total: `$${total.toFixed(2)}`,
      status: 'Completed'
    };
    
    // Get existing transactions or initialize
    let transactions = JSON.parse(localStorage.getItem('salesTransactions')) || [];
    transactions.unshift(transactionData); // Add new transaction to beginning
    localStorage.setItem('salesTransactions', JSON.stringify(transactions));
    
    // Clear cart
    cartItems = [];
    localStorage.setItem('acerCart', JSON.stringify(cartItems));
    updateCartCounter();
    
    // Reset form
    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
    
    // Close modal
    ModalManager.closeAllModals();
    
    // Show success message before redirect
    showNotification('✅ Order completed! Redirecting to transactions...', 'success');
    
    // Redirect to transaction page after short delay
    setTimeout(() => {
      window.location.href = 'transaction.html';
    }, 1000);
    
  }, 1500);
}

// Product comparison functionality
function openCompareModal(productIds) {
  // Implementation for product comparison
  console.log('Compare products:', productIds);
}

// Wishlist functionality
function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('acerWishlist')) || [];
  const index = wishlist.indexOf(productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showNotification('Removed from wishlist');
  } else {
    wishlist.push(productId);
    showNotification('Added to wishlist!');
  }
  
  localStorage.setItem('acerWishlist', JSON.stringify(wishlist));
  updateWishlistButtons();
}

function updateWishlistButtons() {
  const wishlist = JSON.parse(localStorage.getItem('acerWishlist')) || [];
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const productId = btn.dataset.product;
    if (wishlist.includes(productId)) {
      btn.classList.add('in-wishlist');
      btn.innerHTML = '❤️';
    } else {
      btn.classList.remove('in-wishlist');
      btn.innerHTML = '🤍';
    }
  });
}

// Enhanced event listeners with error handling
function setupEventListeners() {
  // Event delegation for all interactive elements
  document.addEventListener('click', function(event) {
    const target = event.target;
    
    try {
      // Product buttons
      if (target.closest('.view-details-btn')) {
        const btn = target.closest('.view-details-btn');
        openProductModal(btn.dataset.product);
      }
      
      // Add to cart buttons
      if (target.closest('.add-to-cart-btn')) {
        addToCart();
      }
      
      // Wishlist buttons
      if (target.closest('.wishlist-btn')) {
        const btn = target.closest('.wishlist-btn');
        toggleWishlist(btn.dataset.product);
      }
      
      // Close buttons
      if (target.closest('.close-modal')) {
        ModalManager.closeAllModals();
      }
      
      // Checkout buttons
      if (target.closest('.checkout-btn')) {
        openCheckoutModal();
      }
      
      // Place order button
      if (target.closest('.place-order-btn')) {
        placeOrder();
      }
      
    } catch (error) {
      console.error('Event handler error:', error);
    }
  });
  
  // Keyboard events
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      ModalManager.closeAllModals();
    }
  });
  
  // Quantity changes
  document.addEventListener('input', function(event) {
    if (event.target.id === 'checkoutQuantity') {
      openCheckoutModal(); // Recalculate totals
    }
  });
}

// Initialize everything
function initAcer() {
  console.log('🚀 Initializing Acer enhanced features...');
  
  setupEventListeners();
  updateCartCounter();
  updateWishlistButtons();
  
  // Make functions globally available
  window.openProductModal = openProductModal;
  window.addToCart = addToCart;
  window.toggleWishlist = toggleWishlist;
  window.placeOrder = placeOrder;
  
  console.log('✅ Acer enhanced features initialized');
}

// Auto-initialize when Acer content is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAcer);
} else {
  initAcer();
}

