// Professional Animation System
// Scroll-triggered animations using Intersection Observer

(function() {
    'use strict';

    // Animation configuration
    const animationConfig = {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
        staggerDelay: 100 // milliseconds between staggered animations
    };

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize animations on page load
    function initAnimations() {
        if (prefersReducedMotion) {
            // If user prefers reduced motion, just remove animation classes
            document.querySelectorAll('[class*="animate-"]').forEach(el => {
                el.classList.remove('animate-on-scroll', 'animate-on-load');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        // Page load animations
        initPageLoadAnimations();
        
        // Scroll-triggered animations
        initScrollAnimations();
        
        // Stagger animations for grid items
        initStaggerAnimations();
    }

    // Page load animations
    function initPageLoadAnimations() {
        // Animate header on load (only for homepage hero header)
        const header = document.querySelector('header:not(.internal-header)');
        if (header) {
            header.classList.add('animate-on-load');
        }

        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate-on-load');
        }

        // Animate page header for internal pages
        const pageHeader = document.querySelector('.page-header');
        if (pageHeader) {
            pageHeader.classList.add('animate-on-load');
        }

        // Animate elements with animate-on-load class
        document.querySelectorAll('.animate-on-load').forEach((el, index) => {
            if (!el.style.animationDelay) {
                el.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }

    // Scroll-triggered animations using Intersection Observer
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add visible class to trigger animation
                    element.classList.add('is-visible');
                    
                    // For elements with children that should animate, trigger child animations
                    const children = element.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('is-visible');
                        }, index * animationConfig.staggerDelay);
                    });
                    
                    // Special handling for grid containers - animate grid items when parent is visible
                    if (element.classList.contains('values-grid') || element.classList.contains('content-section') || element.classList.contains('page-content')) {
                        const gridItems = element.querySelectorAll('.grid-item, .content-card');
                        gridItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('is-visible');
                            }, 300 + (index * animationConfig.staggerDelay)); // Delay after section becomes visible
                        });
                    }
                    
                    // Also handle nested content sections
                    const nestedSections = element.querySelectorAll('.content-section');
                    nestedSections.forEach(nestedSection => {
                        if (!nestedSection.classList.contains('is-visible')) {
                            nestedSection.classList.add('is-visible');
                            const cards = nestedSection.querySelectorAll('.content-card');
                            cards.forEach((card, index) => {
                                setTimeout(() => {
                                    card.classList.add('is-visible');
                                }, 400 + (index * animationConfig.staggerDelay));
                            });
                        }
                    });
                    
                    // Stop observing once animated
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px', // More lenient - trigger earlier
            threshold: 0.05 // Lower threshold to trigger sooner
        });

        // Helper function to check if element is in viewport and make visible
        function checkInitialVisibility(element) {
            const rect = element.getBoundingClientRect();
            // More lenient check - if element is mostly in viewport or close to it
            const isInViewport = rect.top < window.innerHeight + 200 && rect.bottom > -200;
            if (isInViewport && !element.classList.contains('is-visible')) {
                // Add visible class immediately
                element.classList.add('is-visible');
                
                // Also trigger grid items if it's a grid section
                if (element.classList.contains('values-grid') || element.classList.contains('content-section')) {
                    const gridItems = element.querySelectorAll('.grid-item, .content-card');
                    if (gridItems.length > 0) {
                        // Small delay to ensure parent transition starts first
                        setTimeout(() => {
                            gridItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.classList.add('is-visible');
                                }, index * animationConfig.staggerDelay);
                            });
                        }, 100);
                    }
                }
                return true;
            }
            return false;
        }

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            // Check if already in viewport on page load
            if (!checkInitialVisibility(el)) {
                observer.observe(el);
            }
        });

        // Observe sections for section-level animations
        document.querySelectorAll('section, .content-section, .cta-section, .values-grid, .involvement-section, .page-content, footer').forEach(el => {
            if (!el.classList.contains('hero') && !el.classList.contains('page-header')) {
                if (!el.classList.contains('animate-on-scroll')) {
                    el.classList.add('animate-on-scroll');
                }
                // Check if already in viewport on page load
                if (!checkInitialVisibility(el)) {
                    observer.observe(el);
                }
            }
        });
        
        // Also observe all content sections individually (they might be nested)
        document.querySelectorAll('.content-section').forEach(el => {
            if (!el.classList.contains('animate-on-scroll')) {
                el.classList.add('animate-on-scroll');
            }
            if (!checkInitialVisibility(el)) {
                observer.observe(el);
            }
        });
    }

    // Stagger animations for grid items and lists
    function initStaggerAnimations() {
        // Don't auto-animate grid items - they'll be triggered by parent section visibility
        // Only handle footer columns separately
        const footerContainer = document.querySelector('.footer-container');
        if (footerContainer) {
            const footerCols = footerContainer.querySelectorAll('.footer-col');
            footerCols.forEach((col, index) => {
                col.style.transitionDelay = `${index * 0.1}s`;
            });
        }
    }

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Parallax effect for hero sections (subtle) - disabled for now to avoid conflicts
    function initParallax() {
        // Parallax disabled to prevent conflicts with animations
        // Can be re-enabled if needed with proper coordination
        return;
    }

    // Check and animate sections that are already in viewport on page load
    function checkSectionsInViewport() {
        // Check all sections and content sections
        document.querySelectorAll('.values-grid, .content-section, section:not(.hero):not(.page-header):not(.involvement-section), .page-content').forEach(section => {
            if (!section.classList.contains('is-visible')) {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                // Check if section is visible or close to viewport
                const isInView = rect.top < windowHeight + 200 && rect.bottom > -200;
                
                if (isInView) {
                    section.classList.add('is-visible');
                    
                    // Animate grid items and content cards
                    const gridItems = section.querySelectorAll('.grid-item, .content-card');
                    if (gridItems.length > 0) {
                        setTimeout(() => {
                            gridItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.classList.add('is-visible');
                                }, index * animationConfig.staggerDelay);
                            });
                        }, 100);
                    }
                }
            }
        });
        
        // Also check individual content sections that might be nested
        document.querySelectorAll('.content-section').forEach(section => {
            if (!section.classList.contains('is-visible')) {
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const isInView = rect.top < windowHeight + 300 && rect.bottom > -300;
                
                if (isInView) {
                    section.classList.add('is-visible');
                    
                    // Animate content cards within this section
                    const cards = section.querySelectorAll('.content-card');
                    if (cards.length > 0) {
                        setTimeout(() => {
                            cards.forEach((card, index) => {
                                setTimeout(() => {
                                    card.classList.add('is-visible');
                                }, index * animationConfig.staggerDelay);
                            });
                        }, 150);
                    }
                }
            }
        });
    }

    // Initialize everything when DOM is ready
    function initializeAll() {
        // First, check for sections already in viewport
        checkSectionsInViewport();
        
        // Then initialize animations
        initAnimations();
        initSmoothScroll();
        initParallax();
        
        // Double-check after a short delay to catch any missed elements
        setTimeout(checkSectionsInViewport, 100);
        setTimeout(checkSectionsInViewport, 500);
        setTimeout(checkSectionsInViewport, 1000);
        
        // Also make sure all content sections that are in viewport get visible class
        // This is a more aggressive check to ensure nothing is missed
        setTimeout(() => {
            document.querySelectorAll('.content-section').forEach(section => {
                if (!section.classList.contains('is-visible')) {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    // Very lenient check - if it's anywhere near the viewport, make it visible
                    if (rect.top < windowHeight + 500 && rect.bottom > -500) {
                        section.classList.add('is-visible');
                        const cards = section.querySelectorAll('.content-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('is-visible');
                            }, 200 + (index * animationConfig.staggerDelay));
                        });
                    }
                }
            });
        }, 1500);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        // DOM already loaded, initialize immediately
        initializeAll();
    }

    // Re-initialize animations for dynamically loaded content
    window.initAnimations = initAnimations;

})();

