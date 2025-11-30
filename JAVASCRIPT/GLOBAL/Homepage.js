// /JAVASCRIPT/GLOBAL/Homepage.js
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('/HTML/GLOBAL/Header.html')
        .then(response => {
            if (!response.ok) throw new Error('Header not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // Initialize header navigation for ALL pages
            initHeaderNavigation();
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
        })
        .catch(error => console.error('Footer loading error:', error));

    // Load Homepage Content
    fetch('/HTML/GLOBAL/HomepageContent.html')
        .then(response => {
            if (!response.ok) throw new Error('Content not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            initHomepage();
        })
        .catch(error => console.error('Content loading error:', error));
});

function initHomepage() {
    // Homepage specific functionality
    console.log('Homepage initialized');
    
    // Add any homepage-specific interactions here
    initHomepageSliders();
    initFeaturedProducts();
    initHomepageAnimations();
}

// Homepage specific functions
function initHomepageSliders() {
    // Add banner sliders or carousels if needed
    console.log('Homepage sliders initialized');
}

function initFeaturedProducts() {
    // Initialize featured products section
    console.log('Featured products initialized');
}

function initHomepageAnimations() {
    // Add any homepage-specific animations
    console.log('Homepage animations initialized');
}