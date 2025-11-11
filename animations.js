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
                    
                    // Stop observing once animated
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: animationConfig.rootMargin,
            threshold: animationConfig.threshold
        });

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Observe sections for section-level animations
        document.querySelectorAll('section, .content-section, .cta-section, .values-grid, .involvement-section, footer').forEach(el => {
            if (!el.classList.contains('hero') && !el.classList.contains('page-header')) {
                if (!el.classList.contains('animate-on-scroll')) {
                    el.classList.add('animate-on-scroll');
                }
                observer.observe(el);
            }
        });
    }

    // Stagger animations for grid items and lists
    function initStaggerAnimations() {
        const grids = document.querySelectorAll('.grid-container, .content-grid, .footer-container');
        
        grids.forEach(grid => {
            const items = grid.querySelectorAll('.grid-item, .content-card, .footer-col');
            items.forEach((item, index) => {
                item.classList.add('animate-on-scroll');
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
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

    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAnimations();
            initSmoothScroll();
            initParallax();
        });
    } else {
        initAnimations();
        initSmoothScroll();
        initParallax();
    }

    // Re-initialize animations for dynamically loaded content
    window.initAnimations = initAnimations;

})();

