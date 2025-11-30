// Product data
const products = {
  acer1: {
    name: "Acer Aspire 5",
    price: "$699.99",
    image: "/IMAGES/Acer/ProductAcer1.png",
    specs: [
      { name: "Processor", value: "Intel Core i5-1135G7" },
      { name: "RAM", value: "8GB DDR4" },
      { name: "Storage", value: "512GB SSD" },
      { name: "Display", value: "15.6\" Full HD IPS" },
      { name: "Graphics", value: "Intel Iris Xe Graphics" },
      { name: "Battery", value: "Up to 8 hours" },
      { name: "Weight", value: "1.65 kg" }
    ]
  },
  acer2: {
    name: "Acer OLED Swift",
    price: "$1,299.99",
    image: "https://placehold.co/500x400/42627B/FFFFFF?text=Acer+OLED+Swift",
    specs: [
      { name: "Processor", value: "Intel Core i7-1165G7" },
      { name: "RAM", value: "16GB LPDDR4X" },
      { name: "Storage", value: "1TB NVMe SSD" },
      { name: "Display", value: "14\" 2.8K OLED" },
      { name: "Graphics", value: "Intel Iris Xe Graphics" },
      { name: "Battery", value: "Up to 10 hours" },
      { name: "Weight", value: "1.2 kg" }
    ]
  },
  acer3: {
    name: "Acer Nitro Gaming",
    price: "$1,199.99",
    image: "https://placehold.co/500x400/42627B/FFFFFF?text=Acer+Nitro+Gaming",
    specs: [
      { name: "Processor", value: "AMD Ryzen 7 5800H" },
      { name: "RAM", value: "16GB DDR4" },
      { name: "Storage", value: "1TB SSD + 1TB HDD" },
      { name: "Display", value: "15.6\" Full HD 144Hz" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 3060" },
      { name: "Battery", value: "Up to 6 hours" },
      { name: "Weight", value: "2.4 kg" }
    ]
  }
};

// Current selected product
let currentProduct = null;

// Open product details modal
function openProductModal(productId) {
  currentProduct = products[productId];
  
  document.getElementById('modalProductName').textContent = currentProduct.name;
  document.getElementById('modalProductPrice').textContent = currentProduct.price;
  document.getElementById('modalProductImage').src = currentProduct.image;
  
  const specsList = document.getElementById('modalProductSpecs');
  specsList.innerHTML = '';
  
  currentProduct.specs.forEach(spec => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="spec-name">${spec.name}:</span><span class="spec-value">${spec.value}</span>`;
    specsList.appendChild(li);
  });
  
  document.getElementById('productModal').style.display = 'block';
}

// Close product details modal
function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
}

// Open checkout modal
function openCheckoutModal() {
  if (!currentProduct) return;
  
  document.getElementById('checkoutProductName').textContent = currentProduct.name;
  document.getElementById('checkoutProductPrice').textContent = currentProduct.price;
  
  // Calculate tax and total
  const price = parseFloat(currentProduct.price.replace('$', ''));
  const tax = price * 0.1; // 10% tax
  const total = price + tax + 15; // price + tax + shipping
  
  document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
  
  document.getElementById('productModal').style.display = 'none';
  document.getElementById('checkoutModal').style.display = 'block';
}

// Close checkout modal
function closeCheckoutModal() {
  document.getElementById('checkoutModal').style.display = 'none';
}

// Place order
function placeOrder() {
  alert('Thank you for your order! Your laptop will be shipped soon.');
  closeCheckoutModal();
}

// Event Delegation for dynamic content
function setupEventListeners() {
  console.log('🔄 Setting up Acer event listeners...');
  
  // Use event delegation for product buttons
  document.addEventListener('click', function(event) {
    // Product detail buttons
    if (event.target.classList.contains('view-details-btn') || 
        event.target.closest('.view-details-btn')) {
      const productId = event.target.dataset.product || 
                       event.target.closest('[data-product]')?.dataset.product;
      if (productId && products[productId]) {
        openProductModal(productId);
      }
    }
    
    // Close modal buttons
    if (event.target.classList.contains('close-modal') || 
        event.target.closest('.close-modal')) {
      closeProductModal();
    }
    
    if (event.target.classList.contains('close-checkout') || 
        event.target.closest('.close-checkout')) {
      closeCheckoutModal();
    }
    
    // Checkout buttons
    if (event.target.classList.contains('checkout-btn') || 
        event.target.closest('.checkout-btn')) {
      openCheckoutModal();
    }
    
    // Place order buttons
    if (event.target.classList.contains('place-order-btn') || 
        event.target.closest('.place-order-btn')) {
      placeOrder();
    }
  });
  
  // Close modals when clicking outside
  document.addEventListener('click', function(event) {
    const productModal = document.getElementById('productModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (event.target === productModal) {
      closeProductModal();
    }
    
    if (event.target === checkoutModal) {
      closeCheckoutModal();
    }
  });
  
  // Dropdown menus with event delegation
  document.addEventListener('mouseover', function(event) {
    if (event.target.classList.contains('dropdown') || 
        event.target.closest('.dropdown')) {
      const dropdown = event.target.closest('.dropdown');
      const content = dropdown?.querySelector('.dropdown-content');
      if (content) content.style.display = 'block';
    }
  });
  
  document.addEventListener('mouseout', function(event) {
    if (event.target.classList.contains('dropdown') || 
        event.target.closest('.dropdown')) {
      const dropdown = event.target.closest('.dropdown');
      const content = dropdown?.querySelector('.dropdown-content');
      if (content) content.style.display = 'none';
    }
  });
}

// Initialize Acer functionality
function initAcer() {
  console.log('🚀 Initializing Acer page...');
  setupEventListeners();
  
  // Make functions globally available
  window.openProductModal = openProductModal;
  window.closeProductModal = closeProductModal;
  window.openCheckoutModal = openCheckoutModal;
  window.closeCheckoutModal = closeCheckoutModal;
  window.placeOrder = placeOrder;
  
  console.log('✅ Acer page initialized successfully');
}

// Auto-initialize when Acer content is detected
function checkAndInitAcer() {
  const contentContainer = document.getElementById('content-container');
  if (contentContainer && contentContainer.innerHTML.includes('acer')) {
    setTimeout(initAcer, 100);
  }
}

// Check when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndInitAcer);
} else {
  checkAndInitAcer();
}

// Also check when content is dynamically loaded
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
      checkAndInitAcer();
    }
  });
});

// Start observing
const contentContainer = document.getElementById('content-container');
if (contentContainer) {
  observer.observe(contentContainer, { childList: true, subtree: true });
}