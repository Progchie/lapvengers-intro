// MAIN PAGE LOADER WITH COMPLETE SIGNUP FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    console.log('Main page loaded - Loading signup form directly');
    
    // Load Footer
    loadFooter();
    
    // Directly load signup form
    loadSignupPage();
});

// Load Footer
function loadFooter() {
    fetch('/HTML/GLOBAL/Footer.html')
        .then(response => {
            if (!response.ok) throw new Error('Footer not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
            console.log('Footer loaded');
        })
        .catch(error => {
            console.error('Footer loading error:', error);
            document.getElementById('footer-container').innerHTML = '<footer>Error loading footer</footer>';
        });
}

// Load Signup Page
function loadSignupPage() {
    console.log('Loading signup form...');
    
    // Show loading state
    document.getElementById('content-container').innerHTML = `
        <div style="padding: 40px; text-align: center;">
            <div style="font-size: 2rem; color: #42627B; margin-bottom: 20px;">⏳</div>
            <p>Loading signup form...</p>
        </div>
    `;
    
    // Fetch the signup form
    fetch('/HTML/TEMPLATE/Signup.html')
        .then(response => {
            console.log('Fetch response status:', response.status);
            if (!response.ok) {
                throw new Error(`Signup form not found (${response.status})`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Signup form loaded successfully');
            document.getElementById('content-container').innerHTML = html;
            
            // INITIALIZE SIGNUP FUNCTIONALITY HERE
            setTimeout(() => {
                initializeSignupWithPopup();
            }, 100);
        })
        .catch(error => {
            console.error('Error loading signup form:', error);
            // Show fallback form with functionality
            showFallbackSignupForm();
        });
}

// ======== SIGNUP WITH POPUP FUNCTIONALITY ========
function initializeSignupWithPopup() {
    const signupContainer = document.querySelector('.signup-container');
    
    if (!signupContainer) {
        console.log('Signup container not found, trying fallback');
        setTimeout(() => {
            if (!document.querySelector('.signup-container') && !document.querySelector('.signup-layout')) {
                console.error('Still no signup container found');
                // Try to force initialize
                forceInitializeSignup();
            }
        }, 500);
        return;
    }
    
    console.log('Initializing signup with popup functionality...');
    
    // Get elements
    const continueBtn = document.getElementById("signupContinueBtn");
    const popup = document.getElementById("signupPopup");
    const doneBtn = document.getElementById("signupDoneBtn");
    const loginLink = document.getElementById("loginLink");
    
    if (!continueBtn) {
        console.error('Continue button not found!');
        return;
    }
    
    // Continue button click - WITH POPUP
    continueBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Validation
        const fullname = document.getElementById("signupFullname").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();
        
        if (!fullname) {
            showErrorPopup("Please enter your full name");
            return;
        }
        
        if (!email) {
            showErrorPopup("Please enter your email");
            return;
        }
        
        if (!validateEmail(email)) {
            showErrorPopup("Please enter a valid email address");
            return;
        }
        
        if (!password) {
            showErrorPopup("Please enter your password");
            return;
        }
        
        if (password.length < 6) {
            showErrorPopup("Password must be at least 6 characters");
            return;
        }
        
        if (!confirmPassword) {
            showErrorPopup("Please confirm your password");
            return;
        }
        
        if (password !== confirmPassword) {
            showErrorPopup("Passwords do not match");
            return;
        }
        
        // Show loading
        continueBtn.textContent = 'Creating Account...';
        continueBtn.disabled = true;
        
        // Simulate API call, then show success popup
        setTimeout(() => {
            // Show success popup
            if (popup) {
                popup.style.display = "flex";
            }
            
            // Reset button
            continueBtn.textContent = 'Continue';
            continueBtn.disabled = false;
            
            // Clear form (optional)
            document.getElementById("signupFullname").value = '';
            document.getElementById("signupEmail").value = '';
            document.getElementById("signupPassword").value = '';
            document.getElementById("signupConfirmPassword").value = '';
            
        }, 1500);
    });
    
    // Done button closes popup AND REDIRECTS TO LOGIN PAGE
    if (doneBtn && popup) {
        doneBtn.addEventListener("click", function() {
            console.log('Done button clicked - redirecting to login');
            popup.style.display = "none";
            
            // Wait a bit for popup to hide, then redirect
            setTimeout(() => {
                window.location.href = "/HTML/GLOBAL/Login.html";
            }, 300);
        });
    }
    
    // Login link also redirects to login page
    if (loginLink) {
        loginLink.addEventListener("click", function(e) {
            e.preventDefault();
            console.log('Login link clicked - redirecting');
            window.location.href = "/HTML/GLOBAL/Login.html";
        });
    }
    
    // Enter key support
    const inputIds = ["signupFullname", "signupEmail", "signupPassword", "signupConfirmPassword"];
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        if (input && continueBtn) {
            input.addEventListener("keypress", function(e) {
                if (e.key === "Enter") {
                    continueBtn.click();
                }
            });
        }
    });
    
    console.log('Signup form with popup initialized successfully!');
}

// Fallback initialization if elements not found
function forceInitializeSignup() {
    console.log('Force initializing signup form...');
    
    // Try to find elements with different selectors
    const continueBtn = document.getElementById("signupContinueBtn") || 
                       document.querySelector('[id*="continue"]') ||
                       document.querySelector('button');
    
    if (!continueBtn) {
        console.error('No button found');
        return;
    }
    
    // Add event listener anyway
    continueBtn.addEventListener("click", function(e) {
        e.preventDefault();
        alert("Signup functionality would work here.");
    });
    
    console.log('Signup force initialized');
}

// Helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showErrorPopup(message) {
    // Create error popup if doesn't exist
    let errorPopup = document.getElementById('errorPopup');
    
    if (!errorPopup) {
        errorPopup = document.createElement('div');
        errorPopup.id = 'errorPopup';
        errorPopup.className = 'popup';
        errorPopup.innerHTML = `
            <div class="popup-box error-box">
                <div class="icon">
                    <div style="font-size: 40px; color: #f44336;">⚠️</div>
                </div>
                <p id="errorMessage">${message}</p>
                <button id="errorCloseBtn" class="popup-done">OK</button>
            </div>
        `;
        document.body.appendChild(errorPopup);
        
        // Add close functionality
        document.getElementById('errorCloseBtn').addEventListener('click', function() {
            errorPopup.style.display = 'none';
        });
        
        // Close on background click
        errorPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                errorPopup.style.display = 'none';
            }
        });
        
        // Auto close after 3 seconds
        setTimeout(() => {
            if (errorPopup) errorPopup.style.display = 'none';
        }, 3000);
    }
    
    // Set message and show
    document.getElementById('errorMessage').textContent = message;
    errorPopup.style.display = 'flex';
}

// Show fallback signup form

    
  
// Debug function
function debugPage() {
    console.log('=== PAGE DEBUG ===');
    console.log('Content container:', document.getElementById('content-container'));
    console.log('Signup container:', document.querySelector('.signup-container'));
    console.log('Continue button:', document.getElementById('signupContinueBtn'));
    console.log('Done button:', document.getElementById('signupDoneBtn'));
    
    // Test functionality
    if (typeof initializeSignupWithPopup === 'function') {
        console.log('Signup function is available');
    }
}

// Export functions to global scope
window.loadSignupPage = loadSignupPage;
window.debugPage = debugPage;
window.initializeSignupWithPopup = initializeSignupWithPopup;

