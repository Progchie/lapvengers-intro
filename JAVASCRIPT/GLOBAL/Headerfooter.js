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
