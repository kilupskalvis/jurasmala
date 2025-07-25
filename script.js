// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 20,
          behavior: "smooth",
        })
      }
    })
  })

  // Add active class to navigation items on scroll
  const sections = document.querySelectorAll(".section")
  const navItems = document.querySelectorAll(".nav-menu a")

  window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute("id")
      }
    })

    navItems.forEach((item) => {
      item.classList.remove("active")
      if (item.getAttribute("href") === "#" + current) {
        item.classList.add("active")
      }
    })
  })

  // Gallery image modal functionality
  const galleryImages = document.querySelectorAll(".gallery-image")

  galleryImages.forEach((image) => {
    image.addEventListener("click", function () {
      const modal = document.createElement("div")
      modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: pointer;
            `

      const modalImage = document.createElement("img")
      modalImage.src = this.src
      modalImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `

      modal.appendChild(modalImage)
      document.body.appendChild(modal)

      modal.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })
  })

  // Grid images modal functionality (for construction, rooms, plans)
  const gridImages = document.querySelectorAll(".grid-image")

  gridImages.forEach((image) => {
    image.addEventListener("click", function () {
      const modal = document.createElement("div")
      modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                cursor: pointer;
            `

      const modalImage = document.createElement("img")
      modalImage.src = this.src
      modalImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `

      modal.appendChild(modalImage)
      document.body.appendChild(modal)

      modal.addEventListener("click", () => {
        document.body.removeChild(modal)
      })
    })
  })

  // Loan button functionality
  const loanButtons = document.querySelectorAll(".loan-button")

  loanButtons.forEach((button) => {
    button.addEventListener("click", () => {
      alert("Pāradresējam uz bankas aizdevuma pieteikuma formu...")
      // Here you would redirect to the actual bank loan application
      // window.open('bank-loan-url', '_blank');
    })
  })
})