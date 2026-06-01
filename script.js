/* ==========================================================
   Orapeleng Creative Webs — script.js
   ========================================================== */
(function () {
  'use strict';

  /* ── helpers ───────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  /* ── 1. CURRENT YEAR ───────────────────────────────────── */
  $$('#currentYear').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ── 2. STICKY NAVBAR (glass on scroll) ────────────────── */
  var header = $('#mainHeader');
  var lastY  = 0;

  function syncHeader() {
    var y = window.scrollY;
    if (!header) return;

    /* Glass effect */
    header.classList.toggle('scrolled', y > 40);

    /* Hide on scroll-down, show on scroll-up (optional UX improvement) */
    /* Disabled for now — keep it always visible */
    lastY = y;
  }
  on(window, 'scroll', syncHeader, { passive: true });
  syncHeader();

  /* ── 3. HAMBURGER MENU ─────────────────────────────────── */
  /*
     HTML expects:
       <button id="mobileMenuBtn" ...> (empty — bars added below)
       <div id="mobileOverlay">
       <div id="mobileMenu">
         <button id="mobileCloseBtn">
         <ul class="mobile-nav-list">
  */
  var menuBtn    = $('#mobileMenuBtn');
  var closeBtn   = $('#mobileCloseBtn');
  var menuPanel  = $('#mobileMenu');
  var overlay    = $('#mobileOverlay');
  var menuOpen   = false;

  /* Inject three animated bars into the button */
  if (menuBtn) {
    menuBtn.innerHTML =
      '<span class="bar bar-1"></span>' +
      '<span class="bar bar-2"></span>' +
      '<span class="bar bar-3"></span>';
    menuBtn.setAttribute('aria-label',    'Open navigation menu');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-controls', 'mobileMenu');
    menuBtn.setAttribute('role',          'button');
  }

  function openMenu() {
    menuOpen = true;
    if (menuPanel)  menuPanel.classList.add('active');
    if (overlay)    overlay.classList.add('active');
    if (menuBtn) {
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label',    'Close navigation menu');
    }
    document.body.style.overflow = 'hidden';
    /* Move focus to first link (accessibility) */
    var first = menuPanel && $('a', menuPanel);
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function closeMenu() {
    menuOpen = false;
    if (menuPanel)  menuPanel.classList.remove('active');
    if (overlay)    overlay.classList.remove('active');
    if (menuBtn) {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label',    'Open navigation menu');
    }
    document.body.style.overflow = '';
  }

  on(menuBtn,  'click', function () { menuOpen ? closeMenu() : openMenu(); });
  on(closeBtn, 'click', closeMenu);
  on(overlay,  'click', closeMenu);

  /* ESC to close */
  on(document, 'keydown', function (e) { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  /* Close on nav link tap */
  $$('.mobile-nav-list a').forEach(function (a) { on(a, 'click', closeMenu); });

  /* Also close if window resizes to desktop width (avoids body-overflow lock) */
  on(window, 'resize', function () {
    if (window.innerWidth >= 768 && menuOpen) closeMenu();
  }, { passive: true });

  /* ── 4. ACTIVE NAV LINK ────────────────────────────────── */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-list a, .mobile-nav-list a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  /* ── 5. SMOOTH SCROLL (hash links) ────────────────────── */
  $$('a[href^="#"]').forEach(function (a) {
    on(a, 'click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = $(id);
      if (target) {
        e.preventDefault();
        closeMenu();
        var offset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '64',
          10
        );
        window.scrollTo({ top: target.offsetTop - offset - 8, behavior: 'smooth' });
      }
    });
  });

  /* ── 6. BACK TO TOP ────────────────────────────────────── */
  var backBtn = document.createElement('button');
  backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backBtn.className = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backBtn);

  on(window, 'scroll', function () {
    backBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
  }, { passive: true });
  on(backBtn, 'click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ── 7. SCROLL REVEAL (IntersectionObserver) ───────────── */
  /*
     Uses IO where available (zero scroll cost).
     Falls back to class-add for very old browsers.
  */
  var revealEls = $$('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el  = entry.target;
        /* Stagger siblings within the same parent */
        var siblings = Array.from(el.parentElement.querySelectorAll('.reveal:not(.visible)'));
        var idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx * 0.07) + 's';
        el.classList.add('visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    /* Fallback: reveal everything immediately */
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── 8. TABS ───────────────────────────────────────────── */
  var tabBtns  = $$('.tab-btn');
  var tabPanes = $$('.tab-pane');

  tabBtns.forEach(function (btn) {
    on(btn, 'click', function () {
      tabBtns.forEach(function (b)  { b.classList.remove('active'); });
      tabPanes.forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var pane = $('#' + btn.getAttribute('data-tab'));
      if (pane) pane.classList.add('active');
    });
  });

  /* ── 9. FAQ ACCORDION ──────────────────────────────────── */
  $$('.faq-item').forEach(function (item) {
    var q      = $('.faq-question', item);
    var answer = $('.faq-answer',   item);
    if (!q || !answer) return;

    on(q, 'click', function () {
      var wasOpen = item.classList.contains('open');
      /* Close all */
      $$('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        var a = $('.faq-answer', other);
        if (a) a.style.maxHeight = null;
      });
      /* Reopen if it was closed */
      if (!wasOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── 10. CONTACT FORM ──────────────────────────────────── */
  var form = $('#contactForm');
  if (form) {

    function showMsg(type, html) {
      var old = $('.form-message', form);
      if (old) old.remove();
      var div = document.createElement('div');
      div.className = 'form-message ' + type;
      div.innerHTML = html;
      form.appendChild(div);
      div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () {
        div.style.transition = 'opacity .5s ease';
        div.style.opacity = '0';
        setTimeout(function () { if (div.parentNode) div.remove(); }, 550);
      }, 6000);
    }

    on(form, 'submit', function (e) {
      e.preventDefault();
      var name    = ($('#name',    form) || {}).value || '';
      var email   = ($('#email',   form) || {}).value || '';
      var subject = ($('#subject', form) || {}).value || '';
      var message = ($('#message', form) || {}).value || '';

      if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        showMsg('error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.');
        return;
      }

      var btn      = $('button[type="submit"]', form);
      var origHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled  = true;

      fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        btn.innerHTML = origHTML;
        btn.disabled  = false;
        if (res.ok) {
          showMsg('success', '<i class="fas fa-check-circle"></i> Message sent! We\'ll be in touch shortly.');
          form.reset();
        } else {
          showMsg('error', '<i class="fas fa-exclamation-circle"></i> Something went wrong — please try again.');
        }
      }).catch(function () {
        btn.innerHTML = origHTML;
        btn.disabled  = false;
        showMsg('error', '<i class="fas fa-exclamation-circle"></i> Network error — please try again.');
      });
    });
  }

  /* ── 11. HERO CANVAS ───────────────────────────────────── */
  var canvas = $('#heroCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var C1  = '79,110,247';
    var C2  = '0,229,196';
    var pts = [];
    var raf;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    on(window, 'resize', resizeCanvas, { passive: true });

    /* Fewer particles on small screens = better perf */
    var count = window.innerWidth < 480 ? 18 : (window.innerWidth < 768 ? 26 : 38);
    for (var i = 0; i < count; i++) {
      pts.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        r:  Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        c:  Math.random() > 0.72 ? C2 : C1,
        a:  Math.random() * 0.4 + 0.2
      });
    }

    /* Page Visibility API — pause canvas when tab hidden */
    var paused = false;
    on(document, 'visibilitychange', function () {
      paused = document.hidden;
      if (!paused) drawLoop();
    });

    function drawLoop() {
      if (paused) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Connection lines */
      for (var i = 0; i < pts.length - 1; i++) {
        for (var j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x;
          var dy = pts[i].y - pts[j].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + C1 + ',' + (0.09 * (1 - d / 110)) + ')';
            ctx.lineWidth   = 0.7;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      /* Particles */
      pts.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)            p.x = canvas.width;
        else if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)            p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;
      });

      raf = requestAnimationFrame(drawLoop);
    }
    drawLoop();
  }

  /* ── 12. CARD TILT (desktop pointer devices only) ──────── */
  if (window.matchMedia('(hover: hover) and (min-width: 992px)').matches) {
    $$('.service-card, .market-card').forEach(function (card) {
      on(card, 'mouseenter', function () {
        card.style.transition = 'transform .08s ease, box-shadow .3s ease, border-color .3s ease';
      });
      on(card, 'mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left)  / r.width  - 0.5;
        var y = (e.clientY - r.top)   / r.height - 0.5;
        card.style.transform = 'translateY(-6px) rotateY(' + (x * 3.5) + 'deg) rotateX(' + (-y * 3.5) + 'deg)';
      });
      on(card, 'mouseleave', function () {
        card.style.transition = 'transform .4s ease, box-shadow .3s ease, border-color .3s ease';
        card.style.transform  = '';
      });
    });
  }

})();
