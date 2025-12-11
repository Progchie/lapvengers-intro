// /JAVASCRIPT/GLOBAL/ContactUs.js
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
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

    // Load Contact Content (Yung separated Contact.html file)
    fetch('/HTML/TEMPLATE/Contact.html')  
        .then(response => {
            if (!response.ok) throw new Error('Contact content not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            initContactUs();
        })
        .catch(error => console.error('Contact content loading error:', error));
});

function initContactUs() {
    // Contact page specific functionality
    console.log('Contact Us page initialized');
    
    // Initialize contact form functionality
    initContactForm();
    initMapIfNeeded();
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Contact form submitted');
            // Add your form submission logic here
        });
    }
}

function initMapIfNeeded() {
    // Initialize Google Maps or any map functionality
    console.log('Map functionality initialized if needed');
}

