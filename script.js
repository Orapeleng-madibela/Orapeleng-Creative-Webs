// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {

    // ===== CURRENT YEAR =====
    var yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== HEADER SCROLL EFFECT =====
    var header = document.getElementById('mainHeader');
    if (header) {
        function updateHeader() {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // ===== DESKTOP CTA (show after scroll) =====
    var desktopCta = document.getElementById('desktopCta');
    if (desktopCta) {
        window.addEventListener('scroll', function () {
            if (window.innerWidth >= 768) {
                desktopCta.style.display = window.scrollY > 100 ? 'inline-flex' : 'none';
            }
        }, { passive: true });
    }

    // ===== MOBILE MENU =====
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileCloseBtn = document.getElementById('mobileCloseBtn');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileOverlay = document.getElementById('mobileOverlay');

    function openMobileMenu() {
        if (!mobileMenu || !mobileOverlay) return;
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        if (!mobileMenu || !mobileOverlay) return;
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    // Close on nav link click (mobile)
    var mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // ===== ACTIVE NAV LINK =====
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var allNavLinks = document.querySelectorAll('.nav-list a, .mobile-nav-list a');
    allNavLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        // Remove any active set by HTML for dynamic detection
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                closeMobileMenu();
                window.scrollTo({
                    top: target.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== BACK TO TOP =====
    var backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        backToTop.style.display = (window.scrollY > 400) ? 'flex' : 'none';
    }, { passive: true });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== REVEAL ON SCROLL =====
    var revealElements = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        var windowHeight = window.innerHeight;
        revealElements.forEach(function (el, index) {
            var top = el.getBoundingClientRect().top;
            if (top < windowHeight - 80) {
                // Stagger delay for sibling items
                var siblings = el.parentElement ? el.parentElement.querySelectorAll('.reveal') : [];
                var sibIndex = Array.from(siblings).indexOf(el);
                el.style.transitionDelay = (sibIndex * 0.07) + 's';
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // run on load

    // ===== TABS =====
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tabBtns.forEach(function (b) { b.classList.remove('active'); });
            tabPanes.forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            var targetId = btn.getAttribute('data-tab');
            var pane = document.getElementById(targetId);
            if (pane) pane.classList.add('active');
        });
    });

    // ===== FAQ ACCORDION =====
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (!question || !answer) return;

        question.addEventListener('click', function () {
            var isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(function (other) {
                other.classList.remove('open');
                var otherAnswer = other.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = null;
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ===== CONTACT FORM =====
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var subject = document.getElementById('subject').value.trim();
            var message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                showFormMsg('error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.');
                return;
            }

            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Use fetch to submit to Formspree
            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            }).then(function (response) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                if (response.ok) {
                    showFormMsg('success', '<i class="fas fa-check-circle"></i> Message sent! We\'ll be in touch shortly.');
                    contactForm.reset();
                } else {
                    showFormMsg('error', '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.');
                }
            }).catch(function () {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                showFormMsg('error', '<i class="fas fa-exclamation-circle"></i> Network error. Please try again.');
            });
        });

        function showFormMsg(type, html) {
            var existing = contactForm.querySelector('.form-message');
            if (existing) existing.remove();
            var msg = document.createElement('div');
            msg.className = 'form-message ' + type;
            msg.innerHTML = html;
            contactForm.appendChild(msg);
            msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(function () {
                msg.style.opacity = '0';
                msg.style.transition = 'opacity 0.5s ease';
                setTimeout(function () { if (msg.parentNode) msg.remove(); }, 500);
            }, 6000);
        }
    }

    // ===== HERO CANVAS ANIMATION =====
    var canvas = document.getElementById('heroCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        var particles = [];
        var PARTICLE_COUNT = 40;
        var PRIMARY = '79, 110, 247';
        var ACCENT = '0, 229, 196';

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.8,
                speedY: (Math.random() - 0.5) * 0.8,
                color: Math.random() > 0.7 ? ACCENT : PRIMARY,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(' + PRIMARY + ', ' + (0.12 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + p.color + ', ' + p.opacity + ')';
                ctx.fill();
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x < 0) p.x = canvas.width;
                else if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                else if (p.y > canvas.height) p.y = 0;
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== PORTFOLIO HOVER (CSS handles most, but ensure overlay shows on touch) =====
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var overlay = item.querySelector('.portfolio-overlay');
            if (!overlay) return;
            // Toggle for touch devices
            var isVisible = overlay.style.opacity === '1';
            overlay.style.opacity = isVisible ? '0' : '1';
        });
    });

    // ===== CARD HOVER TILT (subtle) =====
    var tiltCards = document.querySelectorAll('.service-card, .market-card');
    tiltCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width - 0.5;
            var y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'translateY(-6px) rotateY(' + (x * 4) + 'deg) rotateX(' + (-y * 4) + 'deg)';
        });
        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
        });
        card.addEventListener('mouseenter', function () {
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });

    // ===== NUMBERS COUNTER ANIMATION =====
    var statNumbers = document.querySelectorAll('.stat-number');
    var animated = false;

    function animateNumbers() {
        if (animated) return;
        statNumbers.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                animated = true;
                // Simple fade-in pop for each stat
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
                setTimeout(function () {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                }, 100);
            }
        });
    }

    window.addEventListener('scroll', animateNumbers, { passive: true });
    animateNumbers();
});
