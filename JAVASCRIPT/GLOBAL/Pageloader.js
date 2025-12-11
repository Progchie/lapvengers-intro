// UNIVERSAL PRODUCT DATABASE FOR ALL BRANDS
const universalProducts = {
  // ACER PRODUCTS
  acer1: {
    brand: "acer",
    name: "Acer Aspire 5",
    price: 699.99,
    originalPrice: 799.99,
    shipping: 15.00,
    taxRate: 0.10,
    image: "/IMAGES/Acer/ProductAcer1.png",
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
    brand: "acer",
    name: "Acer OLED Swift",
    price: 1299.99,
    originalPrice: 1499.99,
    shipping: 20.00,
    taxRate: 0.10,
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
    brand: "acer",
    name: "Acer Nitro Gaming",
    price: 1199.99,
    originalPrice: 1399.99,
    shipping: 25.00,
    taxRate: 0.10,
    image: "/IMAGES/Acer/ProductAcer3.png",
    badge: "GAMING",
    rating: 4.6,
    reviews: 89,
    specs: [
      { name: "Processor", value: "AMD Ryzen 7 5800H" },
      { name: "RAM", value: "16GB DDR4" },
      { name: "Storage", value: "1TB SSD + 1TB HDD" },
      { name: "Display", value: '15.6" Full HD 144Hz' },
      { name: "Graphics", value: "NVIDIA GeForce RTX 3060" },
      { name: "Battery", value: "Up to 6 hours" },
      { name: "Weight", value: "2.4 kg" }
    ],
    features: ["RGB Keyboard", "CoolBoost Technology", "4-Zone RGB", "NitroSense"]
  },
  
  // APPLE PRODUCTS
 
  
  
  
  // ADD MORE BRANDS HERE...
};

// Universal Cart and Wishlist
let universalCart = JSON.parse(localStorage.getItem('universalCart')) || [];
let universalWishlist = JSON.parse(localStorage.getItem('universalWishlist')) || [];
let currentProduct = null;
let currentBrand = null;

// Universal Modal Manager
const UniversalModalManager = {
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
  }
};

// Universal Product Modal
function openUniversalProductModal(productId) {
  const product = universalProducts[productId];
  if (!product) {
    console.error(`Product ${productId} not found`);
    return;
  }
  
  currentProduct = product;
  currentBrand = product.brand;
  
  // Update modal with product data
  updateUniversalProductModal(product);
  
  UniversalModalManager.openModal('universalProductModal');
}

function updateUniversalProductModal(product) {
  // Update basic info
  document.getElementById('modalProductName').textContent = product.name;
  document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('modalProductImage').src = product.image;
  
  // Update badge
  const badgeElement = document.getElementById('modalProductBadge');
  if (badgeElement) {
    badgeElement.textContent = product.badge;
    badgeElement.className = `badge ${product.badge.toLowerCase().replace(' ', '-')}`;
  }
  
  // Update rating
  const ratingElement = document.getElementById('modalProductRating');
  if (ratingElement) {
    ratingElement.innerHTML = `⭐ ${product.rating} (${product.reviews} reviews)`;
  }
  
  // Update specs
  const specsList = document.getElementById('modalProductSpecs');
  if (specsList) {
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
      const li = document.createElement('li');
      li.className = 'spec-item';
      li.innerHTML = `
        <span class="spec-name">${spec.name}:</span>
        <span class="spec-value">${spec.value}</span>
      `;
      specsList.appendChild(li);
    });
  }
  
  // Update features
  const featuresContainer = document.getElementById('modalProductFeatures');
  if (featuresContainer) {
    featuresContainer.innerHTML = '';
    product.features.forEach(feature => {
      const span = document.createElement('span');
      span.className = 'feature-tag';
      span.textContent = feature;
      featuresContainer.appendChild(span);
    });
  }
  
  // Update buttons with correct product ID
  const addToCartBtn = document.querySelector('#universalProductModal .add-to-cart-btn');
  const checkoutBtn = document.querySelector('#universalProductModal .checkout-btn');
  const wishlistBtn = document.querySelector('#universalProductModal .wishlist-btn');
  
  if (addToCartBtn) addToCartBtn.dataset.product = Object.keys(universalProducts).find(key => universalProducts[key] === product);
  if (checkoutBtn) checkoutBtn.dataset.product = Object.keys(universalProducts).find(key => universalProducts[key] === product);
  if (wishlistBtn) wishlistBtn.dataset.product = Object.keys(universalProducts).find(key => universalProducts[key] === product);
}

// Universal Checkout Modal
function openUniversalCheckoutModal(productId = null) {
  const targetProduct = productId ? universalProducts[productId] : currentProduct;
  if (!targetProduct) return;
  
  document.getElementById('checkoutProductName').textContent = targetProduct.name;
  document.getElementById('checkoutProductPrice').textContent = `$${targetProduct.price.toFixed(2)}`;
  
  // Calculate totals
  const quantity = parseInt(document.getElementById('checkoutQuantity')?.value || 1);
  const subtotal = targetProduct.price * quantity;
  const tax = subtotal * targetProduct.taxRate;
  const shipping = targetProduct.shipping * quantity;
  const total = subtotal + tax + shipping;
  
  document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('checkoutShipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
  
  UniversalModalManager.closeModal('universalProductModal');
  UniversalModalManager.openModal('checkoutModal');
}

// Universal Cart Functions
function addToUniversalCart(productId = null) {
  const targetProduct = productId ? universalProducts[productId] : currentProduct;
  if (!targetProduct) return;
  
  const productKey = Object.keys(universalProducts).find(key => universalProducts[key] === targetProduct);
  
  const existingItem = universalCart.find(item => item.id === productKey);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    universalCart.push({
      id: productKey,
      brand: targetProduct.brand,
      name: targetProduct.name,
      price: targetProduct.price,
      image: targetProduct.image,
      quantity: 1
    });
  }
  
  localStorage.setItem('universalCart', JSON.stringify(universalCart));
  updateUniversalCartCounter();
  showUniversalNotification(`${targetProduct.name} added to cart!`, 'success');
}

// Universal Wishlist Functions
function toggleUniversalWishlist(productId = null) {
  const targetProduct = productId ? universalProducts[productId] : currentProduct;
  if (!targetProduct) return;
  
  const productKey = Object.keys(universalProducts).find(key => universalProducts[key] === targetProduct);
  const index = universalWishlist.indexOf(productKey);
  
  if (index > -1) {
    universalWishlist.splice(index, 1);
    showUniversalNotification('Removed from wishlist', 'info');
  } else {
    universalWishlist.push(productKey);
    showUniversalNotification('Added to wishlist!', 'success');
  }
  
  localStorage.setItem('universalWishlist', JSON.stringify(universalWishlist));
}

// Universal Cart Counter
function updateUniversalCartCounter() {
  const cartCounter = document.getElementById('universalCartCounter');
  if (cartCounter) {
    const totalItems = universalCart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Universal Notification System
function showUniversalNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `universal-notification ${type}`;
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
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Universal Order Placement
function placeUniversalOrder() {
  const email = document.getElementById('checkoutEmail')?.value;
  const address = document.getElementById('checkoutAddress')?.value;
  
  if (!email || !address) {
    showUniversalNotification('Please fill in all required fields', 'error');
    return;
  }
  
  showUniversalNotification('Processing your order...', 'info');
  
  setTimeout(() => {
    const quantity = parseInt(document.getElementById('checkoutQuantity')?.value || 1);
    const total = currentProduct.price * quantity * (1 + currentProduct.taxRate) + (currentProduct.shipping * quantity);
    
    // Save transaction
    const transaction = {
      id: 'TRX-' + Date.now(),
      date: new Date().toLocaleString(),
      customer: email.split('@')[0],
      product: currentProduct.name,
      brand: currentProduct.brand,
      quantity: quantity,
      total: `$${total.toFixed(2)}`,
      status: 'Completed'
    };
    
    let transactions = JSON.parse(localStorage.getItem('salesTransactions')) || [];
    transactions.unshift(transaction);
    localStorage.setItem('salesTransactions', JSON.stringify(transactions));
    
    // Clear form
    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
    
    UniversalModalManager.closeAllModals();
    
    showUniversalNotification('✅ Order completed!', 'success');
    
    // Optional: Redirect to transactions page
    // setTimeout(() => window.location.href = 'transaction.html', 1500);
    
  }, 1500);
}

// Universal Event Listeners
function setupUniversalEventListeners() {
  document.addEventListener('click', function(event) {
    try {
      // View details buttons (with data-product attribute)
      if (event.target.closest('[data-product]')) {
        const btn = event.target.closest('[data-product]');
        const productId = btn.dataset.product;
        if (universalProducts[productId]) {
          openUniversalProductModal(productId);
        }
      }
      
      // Add to cart buttons
      if (event.target.closest('.add-to-cart-btn')) {
        const btn = event.target.closest('.add-to-cart-btn');
        const productId = btn.dataset.product;
        addToUniversalCart(productId);
      }
      
      // Checkout buttons
      if (event.target.closest('.checkout-btn')) {
        const btn = event.target.closest('.checkout-btn');
        const productId = btn.dataset.product;
        openUniversalCheckoutModal(productId);
      }
      
      // Wishlist buttons
      if (event.target.closest('.wishlist-btn')) {
        const btn = event.target.closest('.wishlist-btn');
        const productId = btn.dataset.product;
        toggleUniversalWishlist(productId);
      }
      
      // Close buttons
      if (event.target.closest('.close-modal')) {
        UniversalModalManager.closeAllModals();
      }
      
      // Place order button
      if (event.target.closest('.place-order-btn')) {
        placeUniversalOrder();
      }
      
    } catch (error) {
      console.error('Event handler error:', error);
    }
  });
  
  // Keyboard support
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      UniversalModalManager.closeAllModals();
    }
  });
  
  // Quantity changes
  document.addEventListener('input', function(event) {
    if (event.target.id === 'checkoutQuantity' && currentProduct) {
      openUniversalCheckoutModal();
    }
  });
}

// Initialize Universal System
function initUniversalBrandSystem() {
  console.log('🚀 Initializing Universal Brand System...');
  
  setupUniversalEventListeners();
  updateUniversalCartCounter();
  
  // Make functions globally available
  window.openUniversalProductModal = openUniversalProductModal;
  window.addToUniversalCart = addToUniversalCart;
  window.openUniversalCheckoutModal = openUniversalCheckoutModal;
  window.placeUniversalOrder = placeUniversalOrder;
  
  console.log('✅ Universal Brand System Initialized');
  
  // Auto-attach to existing product cards
  setTimeout(() => {
    document.querySelectorAll('[data-product]').forEach(btn => {
      const productId = btn.dataset.product;
      if (universalProducts[productId]) {
        btn.onclick = (e) => {
          e.preventDefault();
          openUniversalProductModal(productId);
        };
      }
    });
  }, 500);
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUniversalBrandSystem);
} else {
  initUniversalBrandSystem();
}