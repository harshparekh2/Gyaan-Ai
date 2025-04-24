document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenu = document.getElementById('mobile-menu');
    const navBar = document.querySelector('.nav-bar');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    body.appendChild(overlay);

    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navBar.classList.toggle('active');
        overlay.classList.toggle('active');

        // Prevent body scrolling when menu is open
        if (navBar.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking on overlay
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        navBar.classList.remove('active');
        this.classList.remove('active');
        body.style.overflow = 'auto';
    });

    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');

    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');

            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');

                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            });
        });
    }

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-bar a:not(.dropdown a)');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileMenu.classList.remove('active');
                navBar.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            navBar.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = 'auto';

            // Reset dropdown functionality
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});