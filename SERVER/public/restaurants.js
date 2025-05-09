// Shopping Cart Class
class ShoppingCart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem("cart")) || []
      this.deliveryFee = 2.99
      this.taxRate = 0.1 // 10% tax rate
    }
  
    // Add item to cart
    addItem(item) {
      const existingItemIndex = this.items.findIndex((i) => i.id === item.id && i.size === item.size)
  
      if (existingItemIndex > -1) {
        this.items[existingItemIndex].quantity += item.quantity
      } else {
        this.items.push(item)
      }
  
      this.saveCart()
      this.updateCartCount()
      return this.items
    }
  
    // Remove item from cart
    removeItem(index) {
      this.items.splice(index, 1)
      this.saveCart()
      this.updateCartCount()
      return this.items
    }
  
    // Update item quantity
    updateQuantity(index, quantity) {
      if (quantity <= 0) {
        return this.removeItem(index)
      }
  
      this.items[index].quantity = quantity
      this.saveCart()
      this.updateCartCount()
      return this.items
    }
  
    // Clear cart
    clearCart() {
      this.items = []
      this.saveCart()
      this.updateCartCount()
      return this.items
    }
  
    // Calculate subtotal
    calculateSubtotal() {
      return this.items.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    }
  
    // Calculate tax
    calculateTax() {
      return this.calculateSubtotal() * this.taxRate
    }
  
    // Calculate total
    calculateTotal() {
      return this.calculateSubtotal() + this.calculateTax() + this.deliveryFee
    }
  
    // Save cart to localStorage
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.items))
    }
  
    // Update cart count in UI
    updateCartCount() {
      const cartCountElement = document.querySelector(".cart-count")
      if (cartCountElement) {
        const itemCount = this.items.reduce((count, item) => count + item.quantity, 0)
        cartCountElement.textContent = itemCount
      }
    }
  
    // Render cart items in UI
    renderCart() {
      const cartItemsContainer = document.getElementById("cartItems")
      const cartSubtotalElement = document.getElementById("cartSubtotal")
      const cartTaxElement = document.getElementById("cartTax")
      const cartDeliveryElement = document.getElementById("cartDelivery")
      const cartTotalElement = document.getElementById("cartTotal")
  
      if (!cartItemsContainer) return
  
      // Clear cart container
      cartItemsContainer.innerHTML = ""
  
      if (this.items.length === 0) {
        cartItemsContainer.innerHTML = `
                  <div class="empty-cart-message">
                      <i class="fas fa-shopping-cart"></i>
                      <p>Your cart is empty</p>
                      <button class="btn btn-primary" id="startShoppingBtn">Start Shopping</button>
                  </div>
              `
  
        // Hide summary and footer when cart is empty
        document.getElementById("cartSummary").style.display = "none"
        document.querySelector(".cart-footer").style.display = "none"
  
        // Add event listener to start shopping button
        const startShoppingBtn = document.getElementById("startShoppingBtn")
        if (startShoppingBtn) {
          startShoppingBtn.addEventListener("click", () => {
            document.getElementById("cartPanel").classList.remove("open")
            document.getElementById("overlay").classList.remove("active")
          })
        }
  
        return
      }
  
      // Show summary and footer when cart has items
      document.getElementById("cartSummary").style.display = "block"
      document.querySelector(".cart-footer").style.display = "flex"
  
      // Render each cart item
      this.items.forEach((item, index) => {
        const cartItemElement = document.createElement("div")
        cartItemElement.className = "cart-item"
        cartItemElement.innerHTML = `
                  <div class="cart-item-image">
                      <img src="${item.image}" alt="${item.name}">
                  </div>
                  <div class="cart-item-details">
                      <h4>${item.name}</h4>
                      <p>${item.size}</p>
                      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                      <div class="cart-item-quantity">
                          <button class="cart-quantity-btn minus" data-index="${index}">-</button>
                          <span>${item.quantity}</span>
                          <button class="cart-quantity-btn plus" data-index="${index}">+</button>
                      </div>
                  </div>
                  <button class="cart-item-remove" data-index="${index}">&times;</button>
              `
  
        cartItemsContainer.appendChild(cartItemElement)
      })
  
      // Update cart summary
      const subtotal = this.calculateSubtotal()
      const tax = this.calculateTax()
      const total = this.calculateTotal()
  
      cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`
      cartTaxElement.textContent = `$${tax.toFixed(2)}`
      cartDeliveryElement.textContent = `$${this.deliveryFee.toFixed(2)}`
      cartTotalElement.textContent = `$${total.toFixed(2)}`
  
      // Add event listeners to quantity buttons and remove buttons
      const minusButtons = document.querySelectorAll(".cart-quantity-btn.minus")
      const plusButtons = document.querySelectorAll(".cart-quantity-btn.plus")
      const removeButtons = document.querySelectorAll(".cart-item-remove")
  
      minusButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number.parseInt(button.getAttribute("data-index"))
          this.updateQuantity(index, this.items[index].quantity - 1)
          this.renderCart()
        })
      })
  
      plusButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number.parseInt(button.getAttribute("data-index"))
          this.updateQuantity(index, this.items[index].quantity + 1)
          this.renderCart()
        })
      })
  
      removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number.parseInt(button.getAttribute("data-index"))
          this.removeItem(index)
          this.renderCart()
        })
      })
    }
  }
  
  // Initialize cart
  const cart = new ShoppingCart()
  
  // DOM elements
  const cartToggle = document.getElementById("cartToggle")
  const cartPanel = document.getElementById("cartPanel")
  const closeCartBtn = document.querySelector(".close-cart")
  const overlay = document.getElementById("overlay")
  const clearCartBtn = document.getElementById("clearCart")
  
  // Mobile menu toggle functionality
  const menuToggle = document.getElementById("menuToggle")
  const navBar = document.getElementById("navBar")
  const dropdowns = document.querySelectorAll(".dropdown")
  
  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active")
      navBar.classList.toggle("active")
  
      // If menu is open, add overlay
      if (navBar.classList.contains("active")) {
        overlay.classList.add("active")
      } else {
        overlay.classList.remove("active")
      }
    })
  }
  
  // Close mobile menu and other elements when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      // Close mobile menu if open
      if (navBar.classList.contains("active")) {
        menuToggle.classList.remove("active")
        navBar.classList.remove("active")
      }
  
      // Close cart panel if open
      cartPanel.classList.remove("open")
  
      // Close any open restaurant menus
      document.querySelectorAll(".restaurant-menu").forEach((menu) => {
        menu.style.display = "none"
      })
  
      // Always remove the overlay when clicked
      overlay.classList.remove("active")
    })
  }
  
  // Handle dropdown menus in mobile view
  if (dropdowns.length > 0) {
    dropdowns.forEach((dropdown) => {
      const dropdownLink = dropdown.querySelector("a")
  
      // For mobile: toggle dropdown on click
      dropdownLink.addEventListener("click", (e) => {
        // Only for mobile view
        if (window.innerWidth <= 768) {
          e.preventDefault()
          dropdown.classList.toggle("active")
        }
      })
    })
  }
  
  // Toggle cart panel
  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault()
      cartPanel.classList.add("open")
      overlay.classList.add("active")
  
      // Close mobile menu if open
      menuToggle.classList.remove("active")
      navBar.classList.remove("active")
  
      cart.renderCart()
    })
  }
  
  // Close cart panel
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      cartPanel.classList.remove("open")
      overlay.classList.remove("active")
    })
  }
  
  // Clear cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        cart.clearCart()
        cart.renderCart()
      }
    })
  }
  
  // Restaurant card click functionality
  const restaurantCards = document.querySelectorAll(".restaurant-card")
  const closeMenuButtons = document.querySelectorAll(".close-menu")
  
  if (restaurantCards.length > 0) {
    restaurantCards.forEach((card) => {
      // Make both the card and the view menu button clickable
      const viewMenuBtn = card.querySelector(".view-menu")
  
      // Function to show the menu
      const showMenu = () => {
        // Get target menu
        const targetMenu = card.getAttribute("data-target")
        const menuElement = document.getElementById(targetMenu)
  
        // Hide all menus first
        document.querySelectorAll(".restaurant-menu").forEach((menu) => {
          menu.style.display = "none"
        })
  
        // Show target menu
        if (menuElement) {
          menuElement.style.display = "block"
          menuElement.classList.add("active")
  
          // Scroll to menu
          menuElement.scrollIntoView({ behavior: "smooth" })
  
          // We're NOT adding the overlay here anymore
        }
      }
  
      // Add click event to the button
      viewMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation() // Prevent double triggering
        showMenu()
      })
  
      // Add click event to the entire card
      card.addEventListener("click", (e) => {
        // Don't trigger if clicking on the button (already handled)
        if (!e.target.closest(".view-menu")) {
          showMenu()
        }
      })
    })
  }
  
  if (closeMenuButtons.length > 0) {
    closeMenuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Hide parent menu
        const menuElement = button.closest(".restaurant-menu")
        if (menuElement) {
          menuElement.style.display = "none"
          menuElement.classList.remove("active")
  
          // We're NOT removing the overlay here anymore since we're not adding it
        }
      })
    })
  }
  
  // Update cart count on page load
  document.addEventListener("DOMContentLoaded", () => {
    cart.updateCartCount()
  
    // Check screen size and adjust menu accordingly
    const checkScreenSize = () => {
      if (window.innerWidth > 768) {
        navBar.classList.remove("active")
        menuToggle.classList.remove("active")
  
        // Remove active class from dropdowns in desktop view
        dropdowns.forEach((dropdown) => {
          dropdown.classList.remove("active")
        })
      }
    }
  
    // Initial check
    checkScreenSize()
  
    // Listen for window resize
    window.addEventListener("resize", checkScreenSize)
  })
  