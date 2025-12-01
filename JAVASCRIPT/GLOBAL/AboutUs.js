// /JAVASCRIPT/GLOBAL/AboutPage.js

document.addEventListener('DOMContentLoaded', function() {
    loadAboutPage();
});

function loadAboutPage() {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;
    
    // Show loading state
    showLoadingState(contentContainer);

     fetch('/HTML/GLOBAL/Header.html')
        .then(response => {
            if (!response.ok) throw new Error('Header not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // Initialize header navigation
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

    
    // Load About content
    fetch('/HTML/TEMPLATE/About.html')
        .then(response => {
            if (!response.ok) throw new Error('About page not found');
            return response.text();
        })
        .then(html => {
            // Parse the HTML and extract just the content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const aboutContent = doc.querySelector('#about-content');
            
            if (aboutContent) {
                contentContainer.innerHTML = aboutContent.innerHTML;
                
                // Wait for DOM to update then initialize
                requestAnimationFrame(() => {
                    initializeAboutPage();
                });
            } else {
                contentContainer.innerHTML = '<p>Error loading About page content</p>';
            }
        })
        .catch(error => {
            console.error('About page loading error:', error);
            contentContainer.innerHTML = `
                <div class="error-state">
                    <h2>⚠️ Unable to Load About Page</h2>
                    <p>Please try again later.</p>
                    <button onclick="loadAboutPage()">Retry</button>
                </div>
            `;
        });
}

function showLoadingState(container) {
    container.innerHTML = `
        <div class="page-transition-overlay">
            <div class="loading-animation">
                <div class="loading-ring"></div>
                <div class="loading-ring"></div>
                <div class="loading-ring"></div>
            </div>
            <div class="loading-text">Loading About Page</div>
        </div>
    `;
}

function initializeAboutPage() {
    console.log('About page initialized');
    
    // Add any About page specific JavaScript here
    // Example: Add animations or interactions
    
    // Add fade-in animation
    const aboutContainer = document.querySelector('.about-container');
    if (aboutContainer) {
        aboutContainer.classList.add('fade-in');
    }
    
    // Remove loading overlay after content loads
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }, 500);
    }
}