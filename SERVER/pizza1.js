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
  
    // Render order items in checkout page
    renderOrderItems() {
      const orderItemsContainer = document.getElementById("orderItems")
      const orderSubtotalElement = document.getElementById("orderSubtotal")
      const orderTaxElement = document.getElementById("orderTax")
      const orderDeliveryElement = document.getElementById("orderDelivery")
      const orderTotalElement = document.getElementById("orderTotal")
      const placeOrderBtn = document.getElementById("placeOrderBtn")
  
      if (!orderItemsContainer) return
  
      // Clear container
      orderItemsContainer.innerHTML = ""
  
      if (this.items.length === 0) {
        orderItemsContainer.innerHTML = "<p>Your cart is empty. Please add items to your cart.</p>"
        placeOrderBtn.disabled = true
        return
      }
  
      placeOrderBtn.disabled = false
  
      // Render each item
      this.items.forEach((item) => {
        const orderItemElement = document.createElement("div")
        orderItemElement.className = "order-item"
        orderItemElement.innerHTML = `
                  <div class="order-item-image">
                      <img src="${item.image}" alt="${item.name}">
                  </div>
                  <div class="order-item-details">
                      <h4>${item.name}</h4>
                      <p>${item.size} × ${item.quantity}</p>
                      <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
              `
  
        orderItemsContainer.appendChild(orderItemElement)
      })
  
      // Update order summary
      const subtotal = this.calculateSubtotal()
      const tax = this.calculateTax()
      const total = this.calculateTotal()
  
      orderSubtotalElement.textContent = `$${subtotal.toFixed(2)}`
      orderTaxElement.textContent = `$${tax.toFixed(2)}`
      orderDeliveryElement.textContent = `$${this.deliveryFee.toFixed(2)}`
      orderTotalElement.textContent = `$${total.toFixed(2)}`
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
  const checkoutBtn = document.getElementById("checkoutBtn")
  const productPage = document.getElementById("productPage")
  const checkoutPage = document.getElementById("checkoutPage")
  
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
  
  // Close mobile menu when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      if (navBar.classList.contains("active")) {
        menuToggle.classList.remove("active")
        navBar.classList.remove("active")
        overlay.classList.remove("active")
      }
  
      // Also close cart panel if open
      cartPanel.classList.remove("open")
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
  
  // Function to set up product detail functionality for a specific section
  function setupProductDetail(section) {
    const minusBtn = section.querySelector(".quantity-btn.minus")
    const plusBtn = section.querySelector(".quantity-btn.plus")
    const quantityInput = section.querySelector(".quantity-input")
    const addToCartBtn = section.querySelector(".add-to-cart")
    const buyNowBtn = section.querySelector(".buy-now")
    const sizeOptions = section.querySelectorAll('input[name="size"]')
    const favoriteBtn = section.querySelector(".favorite")
  
    // Quantity selector functionality
    if (minusBtn && plusBtn && quantityInput) {
      minusBtn.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1
        }
      })
  
      plusBtn.addEventListener("click", () => {
        const currentValue = Number.parseInt(quantityInput.value)
        if (currentValue < 10) {
          quantityInput.value = currentValue + 1
        }
      })
  
      // Prevent manual input of invalid values
      quantityInput.addEventListener("change", () => {
        const value = Number.parseInt(quantityInput.value)
        if (isNaN(value) || value < 1) {
          quantityInput.value = 1
        } else if (value > 10) {
          quantityInput.value = 10
        }
      })
    }
  
    // Add to cart functionality
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        // Get selected size and price
        const selectedSize = section.querySelector('input[name="size"]:checked')
        const size = selectedSize.value
        const price = Number.parseFloat(selectedSize.getAttribute("data-price"))
  
        // Get quantity
        const quantity = Number.parseInt(quantityInput.value)
  
        // Get product details
        const name = section.querySelector(".item-info h1").textContent
        const image = section.querySelector(".item-image img").getAttribute("src")
  
        // Create item object
        const item = {
          id: generateItemId(name, size),
          name,
          size,
          price,
          quantity,
          image,
        }
  
        // Add to cart
        cart.addItem(item)
  
        // Show notification
        showNotification("Item Added to Cart!", "Your item has been added to the cart successfully.")
      })
    }
  
    // Buy now functionality
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        // Add to cart first
        addToCartBtn.click()
  
        // Go to checkout
        setTimeout(() => {
          if (checkoutBtn) {
            checkoutBtn.click()
          }
        }, 500)
      })
    }
  
    // Size options functionality
    if (sizeOptions.length > 0) {
      sizeOptions.forEach((option) => {
        option.addEventListener("change", () => {
          const price = option.getAttribute("data-price")
          section.querySelector(".current-price").textContent = `$${price}`
        })
      })
    }
  
    // Favorite button functionality
    if (favoriteBtn) {
      favoriteBtn.addEventListener("click", () => {
        const icon = favoriteBtn.querySelector("i")
        icon.classList.toggle("far")
        icon.classList.toggle("fas")
  
        if (icon.classList.contains("fas")) {
          icon.style.color = "#ff5a5f"
          showNotification("Added to Favorites", "This item has been added to your favorites.")
        } else {
          icon.style.color = ""
          showNotification("Removed from Favorites", "This item has been removed from your favorites.")
        }
      })
    }
  }
  
  // Get all product detail sections
  const productDetailSections = document.querySelectorAll(".item-detail")
  
  // Set up each product detail section
  if (productDetailSections.length > 0) {
    productDetailSections.forEach((section) => {
      setupProductDetail(section)
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
  
  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.items.length === 0) {
        alert("Your cart is empty. Please add items to your cart before checking out.")
        return
      }
  
      // Show checkout page
      productPage.style.display = "none"
      checkoutPage.style.display = "block"
      cartPanel.classList.remove("open")
      overlay.classList.remove("active")
      cart.renderOrderItems()
  
      // Scroll to top
      window.scrollTo(0, 0)
    })
  }
  
  // Order notification elements
  const orderNotification = document.getElementById("orderNotification")
  const closeNotificationBtn = document.querySelector(".close-notification")
  const continueShoppingBtn = document.querySelector(".continue-shopping")
  const viewCartBtn = document.querySelector(".view-cart")
  
  // Notification functionality
  function showNotification(title, message) {
    const notificationTitle = document.querySelector(".notification-text h3")
    const notificationMessage = document.querySelector(".notification-text p")
  
    if (notificationTitle && notificationMessage && orderNotification) {
      notificationTitle.textContent = title
      notificationMessage.textContent = message
      orderNotification.classList.add("show")
  
      // Auto hide after 5 seconds
      setTimeout(() => {
        orderNotification.classList.remove("show")
      }, 5000)
    }
  }
  
  // Close notification
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener("click", () => {
      orderNotification.classList.remove("show")
    })
  }
  
  // Continue shopping button
  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      orderNotification.classList.remove("show")
    })
  }
  
  // View cart button
  if (viewCartBtn) {
    viewCartBtn.addEventListener("click", () => {
      orderNotification.classList.remove("show")
      cartPanel.classList.add("open")
      overlay.classList.add("active")
      cart.renderCart()
    })
  }
  
  // Order success notification
  const orderSuccessNotification = document.getElementById("orderSuccessNotification")
  const backToHomeBtn = document.getElementById("backToHomeBtn")
  const placeOrderBtn = document.getElementById("placeOrderBtn")
  const paymentMethods = document.querySelectorAll(".payment-method")
  
  // Payment method selection
  if (paymentMethods.length > 0) {
    paymentMethods.forEach((method) => {
      method.addEventListener("click", () => {
        // Remove active class from all methods
        paymentMethods.forEach((m) => m.classList.remove("active"))
  
        // Add active class to selected method
        method.classList.add("active")
  
        // Show/hide payment form based on selected method
        const selectedMethod = method.getAttribute("data-method")
        const cardForm = document.getElementById("card-payment-form")
  
        if (selectedMethod === "card") {
          cardForm.style.display = "block"
        } else {
          cardForm.style.display = "none"
        }
      })
    })
  }
  
  // Form validation
  function validateForm() {
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const name = document.getElementById("name").value
    const address = document.getElementById("address").value
    const city = document.getElementById("city").value
    const zip = document.getElementById("zip").value
  
    if (!email || !phone || !name || !address || !city || !zip) {
      return false
    }
  
    // Get selected payment method
    const selectedMethod = document.querySelector(".payment-method.active")
    if (!selectedMethod) return false
  
    const paymentMethod = selectedMethod.getAttribute("data-method")
  
    // Validate payment details if credit card is selected
    if (paymentMethod === "card") {
      const cardNumber = document.getElementById("card-number").value
      const expiry = document.getElementById("expiry").value
      const cvv = document.getElementById("cvv").value
      const cardName = document.getElementById("card-name").value
  
      if (!cardNumber || !expiry || !cvv || !cardName) {
        return false
      }
    }
  
    return true
  }
  
  // Place order
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      if (!validateForm()) {
        alert("Please fill in all required fields.")
        return
      }
  
      // Process order
      // In a real application, you would send the order data to a server
      // For this example, we'll just show a success notification
  
      // Show success notification
      orderSuccessNotification.classList.add("show")
  
      // Clear cart
      cart.clearCart()
    })
  }
  
  // Back to home button
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      orderSuccessNotification.classList.remove("show")
      checkoutPage.style.display = "none"
      productPage.style.display = "block"
      window.scrollTo(0, 0)
    })
  }
  
  // Format credit card input
  const cardNumberInput = document.getElementById("card-number")
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 16) value = value.slice(0, 16)
  
      // Add spaces every 4 digits
      let formattedValue = ""
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += " "
        formattedValue += value[i]
      }
  
      e.target.value = formattedValue
    })
  }
  
  // Format expiry date input
  const expiryInput = document.getElementById("expiry")
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 4) value = value.slice(0, 4)
  
      // Format as MM/YY
      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2)
      }
  
      e.target.value = value
    })
  }
  
  // Format CVV input
  const cvvInput = document.getElementById("cvv")
  if (cvvInput) {
    cvvInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 3) value = value.slice(0, 3)
      e.target.value = value
    })
  }
  
  // Helper function to generate unique item ID
  function generateItemId(name, size) {
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${size}`
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
  