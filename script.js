// Wait for the page to load
window.onload = function() {
    // ===== COMMON FUNCTIONS =====
    
    // Set current year in footer
    var currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.innerHTML = new Date().getFullYear();
    }
    
    // ===== MOBILE MENU =====
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = function() {
            // Toggle mobile menu
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mobileMenu.classList.add('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        };
        
        // Close mobile menu when clicking outside
        document.onclick = function(event) {
            if (mobileMenu.classList.contains('active') && 
                event.target !== mobileMenu && 
                event.target !== mobileMenuBtn && 
                !mobileMenuBtn.contains(event.target) && 
                !mobileMenu.contains(event.target)) {
                
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        };
    }
    
    // ===== ACTIVE NAVIGATION =====
    // Add active class to current page in navigation
    var currentPage = window.location.pathname.split('/').pop();
    var navLinks = document.querySelectorAll('.nav-list a, .mobile-nav-list a');
    
    for (var i = 0; i < navLinks.length; i++) {
        var link = navLinks[i];
        var href = link.getAttribute('href');
        
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    }
    
    // ===== SMOOTH SCROLL =====
    // Smooth scroll for anchor links
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    for (var i = 0; i < anchorLinks.length; i++) {
        anchorLinks[i].onclick = function(e) {
            e.preventDefault();
            
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Smooth scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        };
    }
    
    // ===== BACK TO TOP BUTTON =====
    // Create back to top button
    var backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.title = 'Back to top';
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button based on scroll position
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };
    
    // Scroll to top when button is clicked
    backToTopBtn.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // ===== TABS =====
    // Handle tab functionality
    var tabButtons = document.querySelectorAll('.tab-btn');
    var tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length > 0 && tabPanes.length > 0) {
        for (var i = 0; i < tabButtons.length; i++) {
            tabButtons[i].onclick = function() {
                // Remove active class from all buttons and panes
                for (var j = 0; j < tabButtons.length; j++) {
                    tabButtons[j].classList.remove('active');
                }
                
                for (var k = 0; k < tabPanes.length; k++) {
                    tabPanes[k].classList.remove('active');
                }
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding tab pane
                var tabId = this.getAttribute('data-tab');
                var tabPane = document.getElementById(tabId);
                
                if (tabPane) {
                    tabPane.classList.add('active');
                    
                    // Add fade-in animation
                    tabPane.style.opacity = '0';
                    setTimeout(function() {
                        tabPane.style.opacity = '1';
                        tabPane.style.transition = 'opacity 0.3s ease';
                    }, 50);
                }
            };
        }
    }
    
    // ===== PORTFOLIO ITEMS =====
    // Add hover effect to portfolio items
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    
    for (var i = 0; i < portfolioItems.length; i++) {
        portfolioItems[i].onmouseenter = function() {
            var overlay = this.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
            }
        };
        
        portfolioItems[i].onmouseleave = function() {
            var overlay = this.querySelector('.portfolio-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
            }
        };
    }
    
    // ===== FAQ ACCORDION =====
    // Make FAQ items expandable/collapsible
    var faqItems = document.querySelectorAll('.faq-item h3');
    
    for (var i = 0; i < faqItems.length; i++) {
        faqItems[i].onclick = function() {
            var content = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
            } else {
                this.classList.add('active');
            }
        };
    }
    
    // ===== CONTACT FORM WITH FORMSPREE =====
    var contactForm = document.getElementById('contactForm');
    var formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Show loading state
            var submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.classList.add('loading');
            submitButton.querySelector('.btn-text').style.display = 'none';
            submitButton.querySelector('.btn-loading').style.display = 'inline-block';
            submitButton.disabled = true;
            
            // Use fetch API to submit the form to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Reset loading state
                submitButton.classList.remove('loading');
                submitButton.querySelector('.btn-text').style.display = 'inline-block';
                submitButton.querySelector('.btn-loading').style.display = 'none';
                submitButton.disabled = false;
                
                if (data.ok) {
                    // Success
                    showFormMessage('success', 'Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    // Error
                    showFormMessage('error', 'There was a problem sending your message. Please try again.');
                }
            })
            .catch(error => {
                // Reset loading state
                submitButton.classList.remove('loading');
                submitButton.querySelector('.btn-text').style.display = 'inline-block';
                submitButton.querySelector('.btn-loading').style.display = 'none';
                submitButton.disabled = false;
                
                // Show error message
                showFormMessage('error', 'There was a problem sending your message. Please try again.');
                console.error('Form submission error:', error);
            });
            
            // Prevent the default form submission
            e.preventDefault();
        });
    }
    
    // Function to show form message
    function showFormMessage(type, text) {
        if (!formMessage) return;
        
        // Set message content and class
        formMessage.textContent = text;
        formMessage.className = 'form-message ' + type;
        
        // Remove message after 5 seconds
        setTimeout(function() {
            formMessage.style.opacity = '0';
            
            setTimeout(function() {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
                formMessage.style.opacity = '1';
            }, 500);
        }, 5000);
    }
    
    // ===== HERO ANIMATION =====
    // Create canvas animation for hero section
    var canvas = document.getElementById('heroCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
        
        // Create particles
        var particles = [];
        var particleCount = 30;
        
        for (var i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 5 + 1,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5,
                color: '#4361ee'
            });
        }
        
        // Animation function
        function animate() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections between particles
            ctx.strokeStyle = 'rgba(67, 97, 238, 0.1)';
            ctx.lineWidth = 1;
            
            for (var i = 0; i < particles.length; i++) {
                for (var j = i; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            // Update and draw particles
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                
                // Draw particle
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Update position
                p.x += p.speedX;
                p.y += p.speedY;
                
                // Wrap around edges
                if (p.x > canvas.width) p.x = 0;
                else if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                else if (p.y < 0) p.y = canvas.height;
            }
            
            // Request next animation frame
            requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
    }
    
    // ===== IMAGE GALLERY =====
    // Add lightbox functionality for portfolio images
    var portfolioImages = document.querySelectorAll('.portfolio-image img');
    
    for (var imageIndex = 0; imageIndex < portfolioImages.length; imageIndex++) {
        portfolioImages[imageIndex].onclick = function() {
            // Create lightbox
            var lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.position = 'fixed';
            lightbox.style.top = '0';
            lightbox.style.left = '0';
            lightbox.style.width = '100%';
            lightbox.style.height = '100%';
            lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightbox.style.zIndex = '1000';
            
            // Create image
            var img = document.createElement('img');
            img.src = this.src;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.border = '5px solid white';
            img.style.borderRadius = '5px';
            
            // Create close button
            var closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '20px';
            closeBtn.style.right = '20px';
            closeBtn.style.fontSize = '30px';
            closeBtn.style.color = 'white';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.cursor = 'pointer';
            
            // Add elements to lightbox
            lightbox.appendChild(img);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);
            
            // Close lightbox when close button is clicked
            closeBtn.onclick = function() {
                document.body.removeChild(lightbox);
            };
            
            // Close lightbox when clicking outside the image
            lightbox.onclick = function(e) {
                if (e.target === lightbox) {
                    document.body.removeChild(lightbox);
                }
            };
        };
    }
};
