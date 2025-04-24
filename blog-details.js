document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".mobile-menu-toggle")
    const navMenu = document.querySelector(".nav-menu")
  
    if (menuToggle) {
      menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active")
        // Change icon based on menu state
        const icon = this.querySelector("i")
        if (navMenu.classList.contains("active")) {
          icon.classList.remove("fa-bars")
          icon.classList.add("fa-times")
        } else {
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      })
    }
  
    // Handle dropdowns on mobile
    const dropdowns = document.querySelectorAll(".dropdown")
  
    if (window.innerWidth <= 768) {
      dropdowns.forEach((dropdown) => {
        const dropdownLink = dropdown.querySelector("a")
  
        dropdownLink.addEventListener("click", function (e) {
          // Only prevent default if we're on mobile
          if (window.innerWidth <= 768) {
            e.preventDefault()
            dropdown.classList.toggle("active")
  
            // Toggle dropdown icon
            const icon = this.querySelector(".fa-chevron-down")
            if (icon) {
              if (dropdown.classList.contains("active")) {
                icon.classList.remove("fa-chevron-down")
                icon.classList.add("fa-chevron-up")
              } else {
                icon.classList.remove("fa-chevron-up")
                icon.classList.add("fa-chevron-down")
              }
            }
          }
        })
      })
    }
  
    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!e.target.closest(".nav-bar") && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
          const icon = menuToggle.querySelector("i")
          icon.classList.remove("fa-times")
          icon.classList.add("fa-bars")
        }
      }
    })
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        // Don't interfere with dropdown functionality on mobile
        if (this.classList.contains("dropdown") && window.innerWidth <= 768) {
          return
        }
  
        const targetId = this.getAttribute("href")
        if (targetId !== "#") {
          const targetElement = document.querySelector(targetId)
          if (targetElement) {
            e.preventDefault()
            window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: "smooth",
            })
          }
        }
      })
    })
  
    // Responsive image handling
    const images = document.querySelectorAll("img")
    images.forEach((img) => {
      img.addEventListener("error", function () {
        this.src = "/placeholder.svg?height=300&width=400"
        this.alt = "Image placeholder"
      })
    })
  
    // Add animation on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".section-cards, .blogs-cards, .header img, figure")
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.3
  
        if (elementPosition < screenPosition) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }
      })
    }
  
    // Set initial state for animation
    const elementsToAnimate = document.querySelectorAll(".section-cards, .blogs-cards, .header img, figure")
    elementsToAnimate.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  
    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
        const icon = menuToggle.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  })
  