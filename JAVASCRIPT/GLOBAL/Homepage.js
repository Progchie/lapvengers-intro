// /JAVASCRIPT/TEMPLATE/home.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage loaded');

    // Load Header
    fetch('/HTML/GLOBAL/Header.html')
        .then(response => {
            if (!response.ok) throw new Error('Header not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            
            // Initialize header navigation
            requestAnimationFrame(() => {
                initHeaderNavigation();
            });
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

    // Load HOME Content
    fetch('/HTML/TEMPLATE/Home.html')
        .then(response => {
            if (!response.ok) throw new Error('Home content not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            
            // Wait for DOM to update
            requestAnimationFrame(() => {
                // Initialize LAPVENGERS modules
                LAPVENGERS.init();
            });
        })
        .catch(error => console.error('Home content loading error:', error));
});

// --------------------------
// LAPVENGERS Website Functionality - Dynamic  Pattern
// --------------------------
const LAPVENGERS = (function() {
    // Private Variables
    let carouselInstance = null;
    let navigationInstance = null;
    let videoInstance = null;
    let animationInstance = null;
    
    // Carousel Module
    const Carousel = {
        elements: {
            slides: null,
            slideImages: null,
            prevBtn: null,
            nextBtn: null,
            dots: null,
            carousel: null
        },
        
        state: {
            currentSlide: 0,
            totalSlides: 0,
            slideInterval: 5000,
            autoSlide: null,
            isAutoPlaying: true,
            touchStartX: 0,
            touchEndX: 0
        },
        
        init: function() {
            this.cacheElements();
            if (!this.validateElements()) {
                console.warn('Carousel elements not found');
                return null;
            }
            
            this.state.totalSlides = this.elements.slideImages.length;
            this.setupEventListeners();
            this.update();
            this.startAutoSlide();
            
            console.log('Carousel initialized');
            return this;
        },
        
        cacheElements: function() {
            this.elements.slides = document.querySelector('.slides');
            this.elements.slideImages = document.querySelectorAll('.slides img');
            this.elements.prevBtn = document.querySelector('.prev-btn');
            this.elements.nextBtn = document.querySelector('.next-btn');
            this.elements.dots = document.querySelectorAll('.dot');
            this.elements.carousel = document.querySelector('.carousel');
        },
        
        validateElements: function() {
            const hasElements = this.elements.slides && 
                               this.elements.slideImages.length > 0 &&
                               this.elements.prevBtn && 
                               this.elements.nextBtn;
            
            if (!hasElements) {
                console.warn('Missing carousel elements');
            }
            return hasElements;
        },
        
        setupEventListeners: function() {
            // Button listeners
            this.elements.prevBtn.addEventListener('click', () => this.prev());
            this.elements.nextBtn.addEventListener('click', () => this.next());
            
            // Dot listeners
            this.elements.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goTo(index));
            });
            
            // Touch/swipe
            if ('ontouchstart' in window) {
                this.elements.slides.addEventListener('touchstart', (e) => {
                    this.state.touchStartX = e.changedTouches[0].screenX;
                    this.pause();
                });
                
                this.elements.slides.addEventListener('touchend', (e) => {
                    this.state.touchEndX = e.changedTouches[0].screenX;
                    this.handleSwipe();
                    this.resume();
                });
            }
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });
            
            // Pause on hover
            this.elements.carousel.addEventListener('mouseenter', () => this.pause());
            this.elements.carousel.addEventListener('mouseleave', () => this.resume());
        },
        
        update: function() {
            // Move slides
            this.elements.slides.style.transform = `translateX(-${this.state.currentSlide * 100}%)`;
            
            // Update dots
            this.elements.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.state.currentSlide);
            });
        },
        
        next: function() {
            this.state.currentSlide = (this.state.currentSlide + 1) % this.state.totalSlides;
            this.update();
        },
        
        prev: function() {
            this.state.currentSlide = (this.state.currentSlide - 1 + this.state.totalSlides) % this.state.totalSlides;
            this.update();
        },
        
        goTo: function(index) {
            if (index >= 0 && index < this.state.totalSlides) {
                this.state.currentSlide = index;
                this.update();
            }
        },
        
        startAutoSlide: function() {
            this.state.isAutoPlaying = true;
            this.state.autoSlide = setInterval(() => this.next(), this.state.slideInterval);
        },
        
        pause: function() {
            if (this.state.autoSlide) {
                clearInterval(this.state.autoSlide);
                this.state.isAutoPlaying = false;
            }
        },
        
        resume: function() {
            if (!this.state.isAutoPlaying) {
                this.startAutoSlide();
            }
        },
        
        handleSwipe: function() {
            const swipeThreshold = 50;
            const diff = this.state.touchStartX - this.state.touchEndX;
            
            if (diff > swipeThreshold) {
                this.next(); // Swipe left
            } else if (diff < -swipeThreshold) {
                this.prev(); // Swipe right
            }
        },
        
        destroy: function() {
            this.pause();
            // Remove event listeners if needed
            console.log('Carousel destroyed');
        }
    };
    
    // Navigation Module
    const Navigation = {
        elements: {
            navItems: null,
            sections: null
        },
        
        state: {
            currentSection: '',
            scrollDebounce: null
        },
        
        init: function() {
            this.cacheElements();
            if (this.elements.navItems.length === 0 || this.elements.sections.length === 0) {
                console.warn('Navigation elements not found');
                return null;
            }
            
            this.setupEventListeners();
            this.updateActiveNav();
            
            console.log('Navigation initialized');
            return this;
        },
        
        cacheElements: function() {
            this.elements.navItems = document.querySelectorAll('.nav-item');
            this.elements.sections = document.querySelectorAll('.recommend-section');
        },
        
        setupEventListeners: function() {
            // Nav item clicks
            this.elements.navItems.forEach(item => {
                item.addEventListener('click', (e) => this.handleNavClick(e, item));
            });
            
            // Scroll events with debounce
            window.addEventListener('scroll', () => {
                clearTimeout(this.state.scrollDebounce);
                this.state.scrollDebounce = setTimeout(() => {
                    this.updateActiveNav();
                }, 100);
            });
        },
        
        handleNavClick: function(e, item) {
            e.preventDefault();
            
            // Update active state
            this.elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Scroll to section
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },
        
        updateActiveNav: function() {
            let newCurrentSection = '';
            
            this.elements.sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                    newCurrentSection = section.id;
                }
            });
            
            // Only update if section changed
            if (newCurrentSection && newCurrentSection !== this.state.currentSection) {
                this.state.currentSection = newCurrentSection;
                
                this.elements.navItems.forEach(nav => {
                    nav.classList.remove('active');
                    if (nav.getAttribute('href') === `#${newCurrentSection}`) {
                        nav.classList.add('active');
                    }
                });
            }
        },
        
        destroy: function() {
            // Clean up event listeners
            console.log('Navigation destroyed');
        }
    };
    
    // Video Module
    const VideoPlayer = {
        elements: {
            videoCards: null
        },
        
        init: function() {
            this.cacheElements();
            if (this.elements.videoCards.length === 0) {
                console.warn('Video cards not found');
                return null;
            }
            
            this.setupEventListeners();
            
            console.log('Video Player initialized');
            return this;
        },
        
        cacheElements: function() {
            this.elements.videoCards = document.querySelectorAll('.video-card');
        },
        
        setupEventListeners: function() {
            this.elements.videoCards.forEach(card => {
                const videoLink = card.querySelector('.video-link a');
                
                // Card click (excluding YouTube link)
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.video-link') && videoLink) {
                        window.open(videoLink.href, '_blank');
                    }
                });
                
                // Hover effects
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                    card.style.transition = 'transform 0.3s ease';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                });
            });
        },
        
        destroy: function() {
            console.log('Video Player destroyed');
        }
    };
    
    // Animation Module
    const Animations = {
        elements: {
            specCards: null,
            priceTags: null
        },
        
        init: function() {
            this.cacheElements();
            this.setupCardAnimations();
            this.setupScrollAnimations();
            this.formatPrices();
            
            console.log('Animations initialized');
            return this;
        },
        
        cacheElements: function() {
            this.elements.specCards = document.querySelectorAll('.spec-card');
            this.elements.priceTags = document.querySelectorAll('.price-tag');
        },
        
        setupCardAnimations: function() {
            this.elements.specCards.forEach(card => {
                const image = card.querySelector('.spec-image img');
                
                if (image) {
                    card.addEventListener('mouseenter', () => {
                        image.style.transform = 'scale(1.08) rotate(-2deg)';
                        image.style.transition = 'transform 0.4s ease';
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        image.style.transform = 'scale(1) rotate(0deg)';
                    });
                }
            });
        },
        
        setupScrollAnimations: function() {
            const sections = document.querySelectorAll('.recommend-section');
            if (sections.length === 0) return;
            
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
            
            sections.forEach(section => observer.observe(section));
        },
        
        formatPrices: function() {
            this.elements.priceTags.forEach(tag => {
                const priceText = tag.textContent.trim();
                if (!priceText.startsWith('$')) {
                    tag.textContent = '$' + priceText;
                }
            });
        },
        
        destroy: function() {
            console.log('Animations destroyed');
        }
    };
    
    // Responsive Module
    const Responsive = {
        state: {
            currentBreakpoint: '',
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            }
        },
        
        init: function() {
            this.detectBreakpoint();
            this.setupLayout();
            this.setupResizeListener();
            
            console.log('Responsive initialized');
            return this;
        },
        
        detectBreakpoint: function() {
            const width = window.innerWidth;
            
            if (width <= this.state.breakpoints.mobile) {
                this.state.currentBreakpoint = 'mobile';
            } else if (width <= this.state.breakpoints.tablet) {
                this.state.currentBreakpoint = 'tablet';
            } else {
                this.state.currentBreakpoint = 'desktop';
            }
        },
        
        setupLayout: function() {
            const specContents = document.querySelectorAll('.spec-content');
            
            specContents.forEach(content => {
                if (this.state.currentBreakpoint === 'mobile') {
                    content.style.flexDirection = 'column';
                } else {
                    content.style.flexDirection = 'row';
                }
            });
        },
        
        setupResizeListener: function() {
            let resizeTimer;
            
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    const oldBreakpoint = this.state.currentBreakpoint;
                    this.detectBreakpoint();
                    
                    if (oldBreakpoint !== this.state.currentBreakpoint) {
                        this.setupLayout();
                        console.log(`Breakpoint changed to: ${this.state.currentBreakpoint}`);
                    }
                }, 250);
            });
        },
        
        getBreakpoint: function() {
            return this.state.currentBreakpoint;
        },
        
        destroy: function() {
            console.log('Responsive destroyed');
        }
    };
    
    // Smooth Scroll Module
    const SmoothScroll = {
        init: function() {
            this.setupSmoothScroll();
            
            console.log('Smooth Scroll initialized');
            return this;
        },
        
        setupSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    
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
        },
        
        destroy: function() {
            console.log('Smooth Scroll destroyed');
        }
    };
    
    // Public API
    return {
        // Initialize all modules
        init: function() {
            console.log('LAPVENGERS Website Initializing...');
            
            try {
                // Initialize modules
                carouselInstance = Object.create(Carousel).init();
                navigationInstance = Object.create(Navigation).init();
                videoInstance = Object.create(VideoPlayer).init();
                animationInstance = Object.create(Animations).init();
                Object.create(Responsive).init();
                Object.create(SmoothScroll).init();
                
                console.log('LAPVENGERS initialized successfully');
                this.bindGlobalEvents();
                
                // Make available globally
                window.LAPVENGERS = this;
                
                return this;
            } catch (error) {
                console.error('LAPVENGERS Initialization error:', error);
                return null;
            }
        },
        
        // Initialize specific modules
        initCarousel: function() {
            carouselInstance = Object.create(Carousel).init();
            return carouselInstance;
        },
        
        initNavigation: function() {
            navigationInstance = Object.create(Navigation).init();
            return navigationInstance;
        },
        
        initVideoPlayer: function() {
            videoInstance = Object.create(VideoPlayer).init();
            return videoInstance;
        },
        
        initAnimations: function() {
            animationInstance = Object.create(Animations).init();
            return animationInstance;
        },
        
        // Get module instances
        getCarousel: function() {
            return carouselInstance;
        },
        
        getNavigation: function() {
            return navigationInstance;
        },
        
        getVideoPlayer: function() {
            return videoInstance;
        },
        
        getAnimations: function() {
            return animationInstance;
        },
        
        // Bind global events
        bindGlobalEvents: function() {
            // Already handled in individual modules
        },
        
        // Cleanup/destroy
        destroy: function() {
            if (carouselInstance && carouselInstance.destroy) {
                carouselInstance.destroy();
            }
            if (navigationInstance && navigationInstance.destroy) {
                navigationInstance.destroy();
            }
            if (videoInstance && videoInstance.destroy) {
                videoInstance.destroy();
            }
            if (animationInstance && animationInstance.destroy) {
                animationInstance.destroy();
            }
            
            console.log('LAPVENGERS Website destroyed');
        }
    };
})();

// Fallback for older browsers
if (typeof Object.create !== 'function') {
    Object.create = function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}