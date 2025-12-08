// /JAVASCRIPT/GLOBAL/BrandPage.js
document.addEventListener('DOMContentLoaded', function () {
    // Check URL for brand parameter
    const urlParams = new URLSearchParams(window.location.search);
    const brandFromUrl = urlParams.get('brand');
    
    // Load brand from URL or default to Acer
    const brandToLoad = brandFromUrl ? brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1) : "Acer";
    
    simplePageTransition(brandToLoad);
});

/*========================================================
  SIMPLE PAGE TRANSITION + LOAD HEADER, FOOTER, BRAND
========================================================*/
function simplePageTransition(brandName) {
    const contentContainer = document.getElementById('content-container');
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    // Step 1: Fade out current content (if any)
    if (contentContainer.innerHTML.trim()) {
        contentContainer.style.opacity = 0;
    }

    // Array of promises for loading
    const loadPromises = [];

    // Load Header
    if (headerContainer) {
        loadPromises.push(
            fetch('/HTML/GLOBAL/Header.html')
                .then(r => {
                    if (!r.ok) throw new Error('Header.html not found');
                    return r.text();
                })
                .then(html => {
                    headerContainer.innerHTML = html;
                    console.log('✅ Header loaded');
                })
        );
    }

    // Load Footer
    if (footerContainer) {
        loadPromises.push(
            fetch('/HTML/GLOBAL/Footer.html')
                .then(r => {
                    if (!r.ok) throw new Error('Footer.html not found');
                    return r.text();
                })
                .then(html => {
                    footerContainer.innerHTML = html;
                    console.log('✅ Footer loaded');
                })
        );
    }

    // Load Brand Content
    loadPromises.push(loadBrand(brandName));

    // Execute all promises
    Promise.all(loadPromises)
        .then(() => {
            console.log(`✅ All content loaded for ${brandName}`);
            
            // Fade in everything
            [headerContainer, contentContainer, footerContainer].forEach(el => {
                if (el) {
                    el.style.transition = 'opacity 0.5s ease';
                    el.style.opacity = 1;
                }
            });

            // Initialize header functions
            initializeHeader();
            
            // Update URL without reloading
            updateUrlWithBrand(brandName);
        })
        .catch(err => {
            console.error("Page loading error:", err);
            showErrorState();
        });
}
// Example Brand.js
async function loadBrand(brand){
  const res = await fetch(`/HTML/GLOBAL/BRANDS/${brand}.html`); // separate brand files
  const html = await res.text();
  document.getElementById('content-container').innerHTML = html;
}

// Load initial brand
loadBrand('Acer');

// Handle clicks on brand buttons
// Handle clicks on brand buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('brand-btn')) {
    loadBrand(e.target.dataset.brand);
  }
});

function setActiveBrandButton(brandName) {
  const buttons = document.querySelectorAll('.brand-btn, .sidebar span.active');
  buttons.forEach(btn => {
    if (btn.dataset?.brand?.toLowerCase() === brandName.toLowerCase()) {
      // Replace span if needed
      if (btn.tagName === 'BUTTON') {
        const span = document.createElement('span');
        span.className = 'active';
        span.textContent = btn.textContent;
        btn.parentNode.replaceChild(span, btn);
      }
    } else {
      if (btn.tagName === 'SPAN') {
        const button = document.createElement('button');
        button.className = 'brand-btn';
        button.dataset.brand = btn.textContent;
        button.textContent = btn.textContent;
        btn.parentNode.replaceChild(button, btn);
      }
    }
  });
}

/*========================================================
  LOAD BRAND CONTENT WITH PATH VALIDATION
========================================================*/
function loadBrand(brandName) {
    const normalizedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase();
    
    const possiblePaths = [
        `/HTML/BRAND/${normalizedBrand}.html`,
        `/HTML/BRAND/${brandName}.html`,
        `../HTML/BRAND/${normalizedBrand}.html`,
        `./HTML/BRAND/${normalizedBrand}.html`,
        `/BRAND/${normalizedBrand}.html`
    ];

    return new Promise((resolve, reject) => {
        const tryPath = (index) => {
            if (index >= possiblePaths.length) {
                console.error(`❌ Could not find ${brandName}.html in any path`);
                reject(new Error(`${brandName} not found`));
                return;
            }

            const currentPath = possiblePaths[index];
            console.log(`🔍 Trying path: ${currentPath}`);

            fetch(currentPath)
                .then(response => {
                    if (!response.ok) {
                        tryPath(index + 1);
                        return;
                    }
                    return response.text();
                })
                .then(html => {
                    if (html) {
                        console.log(`✅ Found ${brandName} at: ${currentPath}`);
                        const contentContainer = document.getElementById('content-container');
                        contentContainer.innerHTML = html;

                        // Dynamically load brand JS
                        const script = document.createElement('script');
                        script.src = `/JAVASCRIPT/BRAND/${normalizedBrand}.js`;
                        script.onload = () => {
                            console.log(`✅ ${normalizedBrand}.js loaded`);
                            initBrandPage(); // keep your initBrandPage call
                            resolve(html);
                        };
                        script.onerror = () => {
                            console.warn(`⚠️ ${normalizedBrand}.js not found`);
                            initBrandPage();
                            resolve(html);
                        };
                        document.body.appendChild(script);
                    }
                })
                .catch(() => tryPath(index + 1));
        };

        tryPath(0);
    });
}
/*========================================================
  UPDATE URL WITH BRAND
========================================================*/
function updateUrlWithBrand(brandName) {
    const url = new URL(window.location);
    url.searchParams.set('brand', brandName.toLowerCase());
    window.history.replaceState({}, '', url);
}

/*========================================================
  INITIALIZE HEADER
========================================================*/
function initializeHeader() {
    // Load header script if needed
    if (typeof initHeaderNavigation !== 'function') {
        const script = document.createElement('script');
        script.src = '/JAVASCRIPT/GLOBAL/Header.js';
        script.onload = function() {
            if (typeof initHeaderNavigation === 'function') {
                initHeaderNavigation();
            }
        };
        document.head.appendChild(script);
    } else {
        initHeaderNavigation();
    }
}

/*========================================================
  BRAND PAGE LOGIC
========================================================*/
function initBrandPage() {
    console.log("Brand page initialized");
    
    // Disable active sidebar link
    disableActiveSidebarLink();
    
    // Initialize product interactions
    initProductInteractions();
}

/*========================================================
  DISABLE ACTIVE SIDEBAR LINK
========================================================*/
function disableActiveSidebarLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const brandName = new URLSearchParams(window.location.search).get('brand');
    
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Check if this link points to current brand
        if (linkHref && linkHref.toLowerCase().includes(brandName ? brandName.toLowerCase() : '')) {
            // Remove href and make it non-clickable
            link.removeAttribute('href');
            link.classList.add('active');
            link.style.pointerEvents = 'none';
            link.style.cursor = 'default';
            
            // Also change to span for semantic correctness
            const span = document.createElement('span');
            span.className = 'active';
            span.textContent = link.textContent;
            link.parentNode.replaceChild(span, link);
        }
    });
}

/*========================================================
  INITIALIZE PRODUCT INTERACTIONS
========================================================*/
function initProductInteractions() {
    const brandProducts = document.querySelectorAll('.product-card, .view-details-btn');
    
    brandProducts.forEach(product => {
        product.addEventListener('click', function () {
            const productId = this.dataset.product || this.closest('[data-product]')?.dataset.product;
            if (productId) {
                console.log("Product clicked:", productId);
                
                // If using Universal Brands system
                if (typeof openUniversalProductModal === 'function') {
                    openUniversalProductModal(productId);
                }
                // If using brand-specific system
                else if (typeof openProductModal === 'function') {
                    openProductModal(productId);
                }
            }
        });
    });
}

/*========================================================
  ERROR STATE UI
========================================================*/
function showErrorState() {
    const contentContainer = document.getElementById('content-container');
    contentContainer.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #666;">
            <h2>⚠️ Unable to Load Content</h2>
            <p>The page you requested could not be loaded.</p>
            <button onclick="simplePageTransition('Acer')" 
                    style="padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">
                Go to Acer Page
            </button>
        </div>
    `;
    contentContainer.style.opacity = 1;
}