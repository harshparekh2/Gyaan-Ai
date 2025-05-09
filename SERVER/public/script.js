document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(() => {
            preloader.classList.add('fade');
        }, 500);
    });
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navBar = document.querySelector('.nav-bar');
  
  if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', function() {
          navBar.classList.toggle('active');
          
          // Change icon based on menu state
          const icon = this.querySelector('i');
          if (navBar.classList.contains('active')) {
              icon.classList.remove('fa-bars');
              icon.classList.add('fa-times');
          } else {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
          }
      });
  }
  
  // Mobile Dropdown Toggle
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
              e.preventDefault();
              const parent = this.parentElement;
              parent.classList.toggle('active');
              
              // Change dropdown icon
              const icon = this.querySelector('.fa-chevron-down');
              if (parent.classList.contains('active')) {
                  icon.classList.remove('fa-chevron-down');
                  icon.classList.add('fa-chevron-up');
              } else {
                  icon.classList.remove('fa-chevron-up');
                  icon.classList.add('fa-chevron-down');
              }
          }
      });
  });
  
  // Back to Top Button
  const backToTopButton = document.getElementById('backToTop');
  
  if (backToTopButton) {
      window.addEventListener('scroll', function() {
          if (window.pageYOffset > 300) {
              backToTopButton.classList.add('active');
          } else {
              backToTopButton.classList.remove('active');
          }
      });
      
      backToTopButton.addEventListener('click', function(e) {
          e.preventDefault();
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
      if (navBar && navBar.classList.contains('active')) {
          if (!navBar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
              navBar.classList.remove('active');
              const icon = mobileMenuToggle.querySelector('i');
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
          }
      }
  });
  
  // Responsive image loading
  function handleResponsiveImages() {
      const windowWidth = window.innerWidth;
      const images = document.querySelectorAll('img[data-src]');
      
      images.forEach(img => {
          if (windowWidth <= 768) {
              if (img.dataset.mobileSrc) {
                  img.src = img.dataset.mobileSrc;
              }
          } else {
              img.src = img.dataset.src;
          }
      });
  }
  
  // Initial call and resize listener
  handleResponsiveImages();
  window.addEventListener('resize', handleResponsiveImages);
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          
          if (href !== '#') {
              e.preventDefault();
              const target = document.querySelector(href);
              
              if (target) {
                  target.scrollIntoView({
                      behavior: 'smooth'
                  });
                  
                  // Close mobile menu after clicking
                  if (navBar && navBar.classList.contains('active')) {
                      navBar.classList.remove('active');
                      const icon = mobileMenuToggle.querySelector('i');
                      icon.classList.remove('fa-times');
                      icon.classList.add('fa-bars');
                  }
              }
          }
      });
  });
});
//add search bar functionality
const restaurants = [
    { name: "Pizza Palace", location: "New York", cuisine: "Italian" },
    { name: "Sushi World", location: "San Francisco", cuisine: "Japanese" },
    { name: "Curry House", location: "Chicago", cuisine: "Indian" },
    { name: "Burger Barn", location: "New York", cuisine: "American" },
    { name: "Taco Town", location: "Los Angeles", cuisine: "Mexican" },
  ];
  
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      location: params.get('location')?.toLowerCase() || "",
      query: params.get('query')?.toLowerCase() || "",
    };
  }
  
  function renderRestaurants(filtered) {
    const listDiv = document.getElementById('restaurantList');
    listDiv.innerHTML = "";
  
    if (filtered.length === 0) {
      listDiv.innerHTML = "<p>No restaurants found matching your search.</p>";
      return;
    }
  
    filtered.forEach(r => {
      const div = document.createElement('div');
      div.className = "restaurant-card";
      div.innerHTML = `<h3>${r.name}</h3><p>${r.cuisine} - ${r.location}</p>`;
      listDiv.appendChild(div);
    });
  }
  
  function filterRestaurants() {
    const { location, query } = getQueryParams();
  
    const filtered = restaurants.filter(r =>
      (location === "" || r.location.toLowerCase().includes(location)) &&
      (query === "" || r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query))
    );
  
    renderRestaurants(filtered);
  }
  
  window.onload = filterRestaurants;
  
