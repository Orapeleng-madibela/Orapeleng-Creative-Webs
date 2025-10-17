/**
 * Orapeleng Creative Webs - Main JavaScript
 * Complete JavaScript for all functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // ===== GLOBAL VARIABLES =====
  const body = document.body
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")
  const themeToggle = document.getElementById("themeToggle")
  const backToTopBtn = document.getElementById("backToTop")
  const currentYearElement = document.getElementById("currentYear")

  // ===== SET CURRENT YEAR =====
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // ===== MOBILE NAVIGATION =====
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
      body.style.overflow = navMenu.classList.contains("active") ? "hidden" : ""
    })

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        body.style.overflow = ""
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains("active")) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
        body.style.overflow = ""
      }
    })
  }

  // ===== ACTIVE NAVIGATION LINK =====
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const allNavLinks = document.querySelectorAll(".nav-link")

  allNavLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active")
    }
  })

  // ===== NAVBAR SCROLL EFFECT =====
  let lastScroll = 0

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    // Add scrolled class for shadow
    if (currentScroll > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }

    // Show/hide back to top button
    if (backToTopBtn) {
      if (currentScroll > 300) {
        backToTopBtn.classList.add("show")
      } else {
        backToTopBtn.classList.remove("show")
      }
    }

    lastScroll = currentScroll
  })

  // ===== DARK MODE TOGGLE =====
  if (themeToggle) {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem("theme") || "light"

    if (currentTheme === "dark") {
      body.classList.add("dark-mode")
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode")

      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark")
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      } else {
        localStorage.setItem("theme", "light")
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
    })
  }

  // ===== BACK TO TOP BUTTON =====
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")

      if (href !== "#" && href !== "") {
        e.preventDefault()
        const target = document.querySelector(href)

        if (target) {
          const offsetTop = target.offsetTop - 80

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // ===== ANIMATE ON SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = entry.target.dataset.animation || "fadeInUp 0.6s ease forwards"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  const animateElements = document.querySelectorAll(".animate-on-scroll")
  animateElements.forEach((el) => {
    observer.observe(el)
  })

  // ===== HERO CANVAS ANIMATION =====
  const canvas = document.getElementById("heroCanvas")

  if (canvas) {
    const ctx = canvas.getContext("2d")
    let particles = []
    let animationFrameId

    // Set canvas dimensions
    function setCanvasDimensions() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", () => {
      setCanvasDimensions()
      initParticles()
    })

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = "#4361ee"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    function initParticles() {
      particles = []
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 10000))

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between particles
      ctx.strokeStyle = "rgba(67, 97, 238, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    // Pause animation when not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId)
      } else {
        animate()
      }
    })
  }

  // ===== COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll(".stat-number")

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = Number.parseInt(entry.target.dataset.target)
            animateCounter(entry.target, 0, target, 2000)
            counterObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    statNumbers.forEach((stat) => {
      counterObserver.observe(stat)
    })
  }

  function animateCounter(element, start, end, duration) {
    const range = end - start
    const increment = range / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        element.textContent = end + "+"
        clearInterval(timer)
      } else {
        element.textContent = Math.floor(current)
      }
    }, 16)
  }

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll(".filter-btn")
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.dataset.filter

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        const category = item.dataset.category

        if (filter === "all" || category === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.classList.add("show")
          }, 10)
        } else {
          item.classList.remove("show")
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // ===== PORTFOLIO DATA =====
  const portfolioData = [
    {
      id: 1,
      title: "Business Consulting Website",
      description: "Modern website for a professional consulting firm",
      category: "business",
      tags: ["HTML", "CSS", "JavaScript"],
    },
    {
      id: 2,
      title: "E-commerce Fashion Store",
      description: "Online store for fashion boutique",
      category: "ecommerce",
      tags: ["E-commerce", "Shopping Cart", "Payment Gateway"],
    },
    {
      id: 3,
      title: "Personal Portfolio",
      description: "Creative portfolio for a designer",
      category: "portfolio",
      tags: ["Portfolio", "Responsive", "Modern"],
    },
    {
      id: 4,
      title: "Restaurant Website",
      description: "Website with online menu and reservations",
      category: "business",
      tags: ["Restaurant", "Menu", "Reservations"],
    },
    {
      id: 5,
      title: "Madibela's Family",
      description: "Family website with photo gallery and history",
      category: "portfolio",
      tags: ["Family", "Gallery", "Custom Design"],
      link: "https://madibelasfamily.netlify.app/",
    },
    {
      id: 6,
      title: "Tech Startup Landing Page",
      description: "Modern landing page for tech startup",
      category: "business",
      tags: ["Landing Page", "Modern", "Startup"],
    },
  ]

  // Render portfolio items
  const portfolioGrid = document.getElementById("portfolioGrid")

  if (portfolioGrid) {
    portfolioData.forEach((project, index) => {
      const portfolioItem = document.createElement("div")
      portfolioItem.className = "portfolio-item"
      portfolioItem.dataset.category = project.category
      portfolioItem.style.animationDelay = `${index * 0.1}s`

      portfolioItem.innerHTML = `
                <div class="portfolio-image">
                    ${project.title}
                    <div class="portfolio-overlay">
                        <div class="portfolio-info">
                            <span class="portfolio-category">${project.category}</span>
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-light">View Live Site <i class="fas fa-external-link-alt"></i></a>` : ""}
                        </div>
                    </div>
                </div>
                <div class="portfolio-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="portfolio-tags">
                        ${project.tags.map((tag) => `<span class="portfolio-tag">${tag}</span>`).join("")}
                    </div>
                </div>
            `

      portfolioGrid.appendChild(portfolioItem)

      // Show portfolio items with staggered animation
      setTimeout(() => {
        portfolioItem.classList.add("show")
      }, index * 100)
    })
  }

  // ===== TESTIMONIALS SLIDER =====
  const testimonialsData = [
    {
      name: "Sarah Johnson",
      company: "Bloom Boutique",
      text: "Orapeleng Creative Webs transformed our online presence. Our new website is beautiful, user-friendly, and has significantly increased our online sales. The team was professional and responsive throughout the entire process.",
    },
    {
      name: "Michael Thompson",
      company: "Thompson Consulting",
      text: "I needed a professional website for my consulting business, and Orapeleng delivered beyond my expectations. The design is modern, the site loads quickly, and it's easy to navigate. I've received numerous compliments from clients.",
    },
    {
      name: "Lerato Molefe",
      company: "Molefe Bakery",
      text: "As a small business owner, I was looking for an affordable website solution that didn't compromise on quality. Orapeleng Creative Webs provided exactly that. My website looks premium but was within my budget.",
    },
  ]

  const testimonialsContainer = document.getElementById("testimonialsContainer")
  const testimonialsIndicators = document.getElementById("testimonialsIndicators")
  const prevTestimonialBtn = document.getElementById("prevTestimonial")
  const nextTestimonialBtn = document.getElementById("nextTestimonial")

  if (testimonialsContainer) {
    let currentTestimonial = 0
    let autoplayInterval

    // Render testimonials
    testimonialsData.forEach((testimonial, index) => {
      const testimonialItem = document.createElement("div")
      testimonialItem.className = `testimonial-item ${index === 0 ? "active" : ""}`

      testimonialItem.innerHTML = `
                <div class="testimonial-content">
                    <div class="testimonial-text">
                        <p>"${testimonial.text}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-image">
                            ${testimonial.name.charAt(0)}
                        </div>
                        <div class="author-info">
                            <h4>${testimonial.name}</h4>
                            <p>${testimonial.company}</p>
                        </div>
                    </div>
                </div>
            `

      testimonialsContainer.appendChild(testimonialItem)
    })

    // Render indicators
    if (testimonialsIndicators) {
      testimonialsData.forEach((_, index) => {
        const indicator = document.createElement("button")
        indicator.className = `indicator-dot ${index === 0 ? "active" : ""}`
        indicator.setAttribute("aria-label", `Go to testimonial ${index + 1}`)
        indicator.addEventListener("click", () => goToTestimonial(index))
        testimonialsIndicators.appendChild(indicator)
      })
    }

    function goToTestimonial(index) {
      const items = testimonialsContainer.querySelectorAll(".testimonial-item")
      const indicators = testimonialsIndicators ? testimonialsIndicators.querySelectorAll(".indicator-dot") : []

      items[currentTestimonial].classList.remove("active")
      if (indicators[currentTestimonial]) {
        indicators[currentTestimonial].classList.remove("active")
      }

      currentTestimonial = index

      items[currentTestimonial].classList.add("active")
      if (indicators[currentTestimonial]) {
        indicators[currentTestimonial].classList.add("active")
      }

      resetAutoplay()
    }

    function nextTestimonial() {
      goToTestimonial((currentTestimonial + 1) % testimonialsData.length)
    }

    function prevTestimonial() {
      goToTestimonial((currentTestimonial - 1 + testimonialsData.length) % testimonialsData.length)
    }

    function startAutoplay() {
      autoplayInterval = setInterval(nextTestimonial, 5000)
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval)
    }

    function resetAutoplay() {
      stopAutoplay()
      startAutoplay()
    }

    if (prevTestimonialBtn) {
      prevTestimonialBtn.addEventListener("click", prevTestimonial)
    }

    if (nextTestimonialBtn) {
      nextTestimonialBtn.addEventListener("click", nextTestimonial)
    }

    // Start autoplay
    startAutoplay()

    // Pause on hover
    testimonialsContainer.addEventListener("mouseenter", stopAutoplay)
    testimonialsContainer.addEventListener("mouseleave", startAutoplay)
  }

  // ===== CONSOLE MESSAGE =====
  console.log("%c👋 Welcome to Orapeleng Creative Webs!", "font-size: 20px; color: #4361ee; font-weight: bold;")
  console.log("%cInterested in our code? Contact us for web development services!", "font-size: 14px; color: #6c757d;")
})
