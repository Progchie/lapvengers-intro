// /JAVASCRIPT/GLOBAL/BrandPage.js
document.addEventListener('DOMContentLoaded', function() {
  // Load Header
  fetch('/HTML/GLOBAL/Header.html')
    .then(response => {
      if (!response.ok) throw new Error('Header not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      // Initialize header navigation - IMPORTANT!
      if (typeof initHeaderNavigation === 'function') {
        initHeaderNavigation();
      } else {
        console.error('initHeaderNavigation function not found!');
        // Fallback: manually load Header.js
        loadHeaderScript();
      }
    })
    .catch(error => console.error('Header loading error:', error));

  // Load Footer
  fetch('/HTML/GLOBAL/Footer.html')
    .then(response => {
      if (!response.ok) throw new Error('Footer not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
      if (typeof initFooter === 'function') initFooter();
    })
    .catch(error => console.error('Footer loading error:', error));

  // Load Brand Content
  fetch('/HTML/BRAND/Acer.html')
    .then(response => {
      if (!response.ok) throw new Error('Brand content not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('content-container').innerHTML = html;
      // Initialize brand page functionality
      initBrandPage();
    })
    .catch(error => console.error('Brand content loading error:', error));
});

// Fallback function to load Header.js dynamically
function loadHeaderScript() {
  const script = document.createElement('script');
  script.src = '/JAVASCRIPT/GLOBAL/Header.js';
  script.onload = function() {
    if (typeof initHeaderNavigation === 'function') {
      initHeaderNavigation();
    } else {
      console.error('Header navigation still not available');
    }
  };
  script.onerror = function() {
    console.error('Failed to load Header.js');
  };
  document.head.appendChild(script);
}

// Brand page specific functionality
function initBrandPage() {
  console.log('Brand page initialized');
  // Add your brand page specific JavaScript here
  
  // Example: Brand-specific interactions
  const brandProducts = document.querySelectorAll('.product-card');
  if (brandProducts.length > 0) {
    brandProducts.forEach(product => {
      product.addEventListener('click', function() {
        console.log('Product clicked:', this.dataset.productId);
        // Add product interaction logic
      });
    });
  }
}

// /JAVASCRIPT/GLOBAL/BrandPage.js
document.addEventListener('DOMContentLoaded', function() {
    simplePageTransition();
});

function simplePageTransition() {
    const contentContainer = document.getElementById('content-container');
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    // Step 1: Fade out content (if any)
    contentContainer.style.opacity = 0;

    // Step 2: Load header, footer, and brand content
    Promise.all([
        fetch('/HTML/GLOBAL/Header.html').then(r => r.text()).then(html => headerContainer.innerHTML = html),
        fetch('/HTML/GLOBAL/Footer.html').then(r => r.text()).then(html => footerContainer.innerHTML = html),
        fetch('/HTML/BRAND/Acer.html').then(r => r.text()).then(html => contentContainer.innerHTML = html)
    ])
    .then(() => {
        // Step 3: Fade in all content
        [headerContainer, contentContainer, footerContainer].forEach(el => {
            el.style.transition = 'opacity 0.5s ease';
            el.style.opacity = 1;
        });

        // Step 4: Initialize header navigation
        if (typeof initHeaderNavigation === 'function') {
            initHeaderNavigation();
        } else {
            loadHeaderScript().then(initHeaderNavigation);
        }
    })
    .catch(err => {
        console.error('Error loading page:', err);
        showErrorState();
    });
}

function loadHeaderScript() {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = '/JAVASCRIPT/GLOBAL/Header.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

function showErrorState() {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = `
        <div class="error-state">
            <h2>⚠️ Unable to Load Content</h2>
            <p>Please try again later.</p>
            <button onclick="location.reload()">Retry</button>
        </div>
    `;
}
