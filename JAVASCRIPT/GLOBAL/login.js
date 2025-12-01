document.addEventListener('DOMContentLoaded', function() {
    console.log('Main page loaded');
    // Load the modal automatically
    loadLoginModal();
});

// FUNCTION TO LOAD LOGIN MODAL
function loadLoginModal() {
    console.log('Loading login modal...');
    
    fetch('/HTML/TEMPLATE/logIN.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load login: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Login HTML loaded, length:', html.length);
            
            // Create modal wrapper
            const modalWrapper = document.createElement('div');
            modalWrapper.id = 'loginModal';
            modalWrapper.className = 'login-modal';
            modalWrapper.innerHTML = html;
            
            // Add to container
            const container = document.getElementById('login-modal-container');
            if (container) {
                container.appendChild(modalWrapper);
            } else {
                const newContainer = document.createElement('div');
                newContainer.id = 'login-modal-container';
                document.body.appendChild(newContainer);
                newContainer.appendChild(modalWrapper);
            }
            
            console.log('Login modal added to DOM');
            
            // Initialize login functionality
            initLoginModal();
        })
        .catch(error => {
            console.error('Login modal loading error:', error);
            showErrorMessage();
        });
}

// SIMPLE ERROR MESSAGE INSTEAD OF FALLBACK
function showErrorMessage() {
    const errorHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <p>Login form failed to load. Please try again later.</p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 15px;">
                Reload Page
            </button>
        </div>
    `;
    
    const container = document.getElementById('login-modal-container') || document.body;
    container.innerHTML = errorHTML;
}

// INITIALIZE LOGIN MODAL FUNCTIONALITY (ISANG FUNCTION LANG)
function initLoginModal() {
    console.log('Initializing login modal functionality...');
    
    const modal = document.getElementById('loginModal');
    if (!modal) {
        console.error('Login modal not found for initialization');
        return;
    }
    
    // Get elements
    const closeBtn = modal.querySelector('#closeLoginBtn');
    const continueBtn = modal.querySelector('#continueBtn');
    const doneBtn = modal.querySelector('#doneBtn');
    const successPopup = modal.querySelector('#successPopup');
    const popupMessage = modal.querySelector('#popupMessage');
    const signupLink = modal.querySelector('#signupLink');
    
    const emailInput = modal.querySelector('#loginEmail');
    const passwordInput = modal.querySelector('#loginPassword');
    
    // Close button functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', hideLoginModal);
    }
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideLoginModal();
        }
    });
    
    // Login button functionality
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked');
            
            // Basic validation
            if (!emailInput || !emailInput.value.trim()) {
                alert('Please enter your email');
                return;
            }
            
            if (!passwordInput || !passwordInput.value.trim()) {
                alert('Please enter your password');
                return;
            }
            
            // Email format validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Simulate login process
            console.log('Attempting login with:', {
                email: emailInput.value,
                password: '***'
            });
            
            // Show loading
            const originalText = continueBtn.textContent;
            continueBtn.textContent = 'Logging in...';
            continueBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success popup
                if (successPopup && popupMessage) {
                    popupMessage.textContent = 'Login successful! Redirecting...';
                    successPopup.style.display = 'flex';
                }
                
                // Reset button
                continueBtn.textContent = originalText;
                continueBtn.disabled = false;
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    if (successPopup) successPopup.style.display = 'none';
                    hideLoginModal();
                    
                    // Clear form inputs
                    if (emailInput) emailInput.value = '';
                    if (passwordInput) passwordInput.value = '';
                    
                    // Redirect to homepage
                    window.location.href = '/HTML/GLOBAL/HomePage.html';
                }, 2000);
                
            }, 1500);
        });
    }
    
    // Done button in popup
    if (doneBtn) {
        doneBtn.addEventListener('click', function() {
            if (successPopup) successPopup.style.display = 'none';
            hideLoginModal();
            
            // Redirect to homepage when done is clicked
            window.location.href = '/HTML/GLOBAL/HomePage.html';
        });
    }
    
    // Signup link
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            hideLoginModal();
            // Redirect to signup page
            window.location.href = '/HTML/GLOBAL/SignUp.html';
        });
    }
    
    // Enter key support
    if (emailInput && passwordInput) {
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (continueBtn) continueBtn.click();
            }
        });
        
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (continueBtn) continueBtn.click();
            }
        });
    }
    
    console.log('Login modal initialized successfully');
}

// SHOW/HIDE MODAL FUNCTIONS
function showLoginModal() {
    console.log('Showing login modal');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        document.body.classList.add('modal-open');
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = modal.querySelector('#loginEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    } else {
        console.error('Login modal not found. Trying to load again...');
        loadLoginModal();
        setTimeout(showLoginModal, 500);
    }
}

function hideLoginModal() {
    console.log('Hiding login modal');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        document.body.classList.remove('modal-open');
        
        // Clear form inputs
        const emailInput = modal.querySelector('#loginEmail');
        const passwordInput = modal.querySelector('#loginPassword');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        // Hide success popup if visible
        const successPopup = modal.querySelector('#successPopup');
        if (successPopup) successPopup.style.display = 'none';
    }
}

// GLOBAL CLICK HANDLER FOR SIGNUP LINKS (Event Delegation)
document.addEventListener('click', function(e) {
    // Handle signup link clicks
    if (e.target && e.target.id === 'signupLink') {
        e.preventDefault();
        hideLoginModal();
        window.location.href = '/HTML/GLOBAL/SignUp.html';
    }
    
    // Handle show login button clicks
    if (e.target && e.target.id === 'showLoginBtn') {
        e.preventDefault();
        showLoginModal();
    }
});

// Test function
function testLoginModal() {
    console.log('=== TESTING LOGIN MODAL ===');
    console.log('Modal element:', document.getElementById('loginModal'));
    console.log('Close button:', document.querySelector('#closeLoginBtn'));
    console.log('Continue button:', document.querySelector('#continueBtn'));
}