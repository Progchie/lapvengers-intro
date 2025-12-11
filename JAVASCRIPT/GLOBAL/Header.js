// Simple Header Navigation




function initHeaderNavigation() {
    // Navigation links
    const navLinks = {
        'Home': '/HTML/GLOBAL/Homepage.html',
        'Brands': '/HTML/GLOBAL/Brand.html',
        'About us': '/HTML/GLOBAL/AboutUs.html',
        'Contact Us': '/HTML/GLOBAL/ContactUs.html',
        'Sales Transactions': '/HTML/GLOBAL/SalesTransactions.html'
    };

    // Add click events to nav links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.textContent.trim();
            const route = navLinks[pageName];
            if (route) {
                window.location.href = route;
            }
        });
    });


    const menuBtn = document.getElementById('menuBtn');
    const navBar = document.querySelector('.nav-bar');
    
    if (menuBtn && navBar) {
        menuBtn.addEventListener('click', function() {
            navBar.classList.toggle('active');
        });
    }

    // Profile button
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = '/HTML/MAIN/Profile.html';
        });
    }
}



// Initialize when page loads
document.addEventListener('DOMContentLoaded', initHeaderNavigation);

