// Mobile Menu Toggle Functionality
(function() {
    'use strict';
    
    function initMobileMenu() {
        const menuToggles = document.querySelectorAll('.mobile-menu-toggle');
        const navs = document.querySelectorAll('nav');
        const body = document.body;
        
        menuToggles.forEach((toggle, index) => {
            const nav = navs[index];
            if (!toggle || !nav) return;
            
            toggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = toggle.classList.contains('active');
                
                // Toggle active class
                toggle.classList.toggle('active');
                nav.classList.toggle('active');
                body.classList.toggle('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-toggle')) {
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
                navs.forEach(nav => {
                    nav.classList.remove('active');
                });
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
                navs.forEach(nav => {
                    nav.classList.remove('active');
                });
                body.classList.remove('menu-open');
            });
        });
        
        // Also close menu when clicking on nav-cta button inside menu
        document.querySelectorAll('nav .nav-cta a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
                navs.forEach(nav => {
                    nav.classList.remove('active');
                });
                body.classList.remove('menu-open');
            });
        });
        
        // Close menu on window resize if it becomes desktop size
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                menuToggles.forEach(toggle => {
                    toggle.classList.remove('active');
                });
                navs.forEach(nav => {
                    nav.classList.remove('active');
                });
                body.classList.remove('menu-open');
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();

