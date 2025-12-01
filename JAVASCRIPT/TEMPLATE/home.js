// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Carousel Variables
    const slides = document.querySelector('.slides');
    const slideImages = document.querySelectorAll('.slides img');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    // Navigation Variables
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.recommend-section');
    
    // Carousel State
    let currentSlide = 0;
    const totalSlides = slideImages.length;
    const slideInterval = 5000; // 5 seconds
    let autoSlide;
    
    // Initialize Carousel
    function initCarousel() {
        // Set initial position
        updateCarousel();
        
        // Start auto slide
        startAutoSlide();
        
        // Add event listeners for buttons
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
        
        // Add event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide();
            });
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });
        
        slides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // Swipe left - next slide
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
    // Carousel Functions
    function updateCarousel() {
        // Move slides
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, slideInterval);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlide);
    }
    
    // Pause auto-slide on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Initialize Navigation
    function initNavigation() {
        // Set first nav item as active by default
        const firstSectionId = sections[0].id;
        const correspondingNav = document.querySelector(`.nav-item[href="#${firstSectionId}"]`);
        if (correspondingNav) {
            correspondingNav.classList.add('active');
        }
        
        // Nav item click event
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked nav item
                this.classList.add('active');
                
                // Scroll to section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', updateActiveNav);
        
        // Initial update
        updateActiveNav();
    }
    
    function updateActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        if (currentSection) {
            navItems.forEach(nav => {
                nav.classList.remove('active');
                if (nav.getAttribute('href') === `#${currentSection}`) {
                    nav.classList.add('active');
                }
            });
        }
    }
    
    // Video Play Functionality
    function initVideoCards() {
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            const playButton = card.querySelector('.play-button');
            const videoLink = card.querySelector('.video-link a');
            
            // Make entire card clickable to play video
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on the YouTube link
                if (!e.target.closest('.video-link')) {
                    window.open(videoLink.href, '_blank');
                }
            });
            
            // Hover effect
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Card Hover Animations
    function initCardAnimations() {
        const specCards = document.querySelectorAll('.spec-card');
        
        specCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const image = this.querySelector('.spec-image img');
                if (image) {
                    image.style.transform = 'scale(1.08) rotate(-2deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const image = this.querySelector('.spec-image img');
                if (image) {
                    image.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // Smooth Scroll Enhancement
    function initSmoothScroll() {
        // Add smooth scroll to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only process if it's an internal link
                if (href !== '#') {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }
    
    // Responsive Adjustments
    function initResponsive() {
        function adjustLayout() {
            const width = window.innerWidth;
            
            if (width <= 768) {
                // Mobile adjustments
                document.querySelectorAll('.spec-content').forEach(content => {
                    content.style.flexDirection = 'column';
                });
            } else {
                // Desktop adjustments
                document.querySelectorAll('.spec-content').forEach(content => {
                    content.style.flexDirection = 'row';
                });
            }
        }
        
        // Initial adjustment
        adjustLayout();
        
        // Adjust on resize
        window.addEventListener('resize', adjustLayout);
    }
    
    // Price Formatter
    function formatPrices() {
        const priceTags = document.querySelectorAll('.price-tag');
        
        priceTags.forEach(tag => {
            const priceText = tag.textContent;
            // Add currency symbol if not present
            if (!priceText.includes('$')) {
                tag.textContent = '$' + priceText;
            }
        });
    }
    
    // Initialize all functions
    initCarousel();
    initNavigation();
    initVideoCards();
    initCardAnimations();
    initSmoothScroll();
    initResponsive();
    formatPrices();
    
    // Add fade-in animation to sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('smooth-fade');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });
});