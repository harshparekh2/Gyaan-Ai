document.addEventListener('DOMContentLoaded', function() {
    // Handle dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth <= 480) {
      dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      });
    }
    
    // Form submission handling for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show success message
        document.getElementById('successMsg').style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          document.getElementById('successMsg').style.display = 'none';
        }, 3000);
      });
    }
  });