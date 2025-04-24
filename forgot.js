document.addEventListener('DOMContentLoaded', function() {
  // Menu toggle functionality
  const menuToggle = document.getElementById('menuToggle');
  const navBar = document.getElementById('navBar');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navBar.classList.toggle('active');
      
      // Change icon based on menu state
      const icon = menuToggle.querySelector('i');
      if (navBar.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Handle dropdown menus on mobile
  const dropdowns = document.querySelectorAll('.dropdown');
  
  if (window.innerWidth <= 576) {
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.dropdown-toggle');
      
      if (link) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          
          // Toggle dropdown icon
          const icon = link.querySelector('.fa-chevron-down');
          if (icon) {
            if (dropdown.classList.contains('active')) {
              icon.classList.remove('fa-chevron-down');
              icon.classList.add('fa-chevron-up');
            } else {
              icon.classList.remove('fa-chevron-up');
              icon.classList.add('fa-chevron-down');
            }
          }
        });
      }
    });
  }
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navBar.classList.contains('active') && 
        !navBar.contains(e.target) && 
        e.target !== menuToggle && 
        !menuToggle.contains(e.target)) {
      navBar.classList.remove('active');
      
      // Reset icon
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 576) {
      navBar.classList.remove('active');
      
      // Reset icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
      
      // Reset dropdowns
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const icon = dropdown.querySelector('.fa-chevron-up');
        if (icon) {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        }
      });
    }
  });
  
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