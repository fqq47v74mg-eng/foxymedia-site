/* FoxyMedia — site behaviour. No dependencies. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function isMobile() { return window.matchMedia('(max-width: 1000px)').matches; }

  function syncNav() {
    if (!nav || !toggle) return;
    var open = toggle.getAttribute('aria-expanded') === 'true';
    nav.hidden = isMobile() ? !open : false;
    document.body.style.overflow = (isMobile() && open) ? 'hidden' : '';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      syncNav();
    });
    window.addEventListener('resize', syncNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false'); syncNav(); toggle.focus();
      }
    });
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        if (isMobile()) { toggle.setAttribute('aria-expanded', 'false'); syncNav(); }
      });
    });
    syncNav();
  }

  /* ---- Header border once the page scrolls ------------------------------ */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Current year in the footer --------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Scroll reveal ----------------------------------------------------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var targets = document.querySelectorAll(
      '.head-block, .card, .vert, .step, .stats > div, .principle, .spec, .split > div, .table-scroll, .faq, .role, .cta__in'
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(targets, function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--d', Math.min(siblings, 6) * 0.06 + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---- Card spotlight follows the pointer ------------------------------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('.card'), function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---- Contact form ------------------------------------------------------
     Posts to the endpoint in the form's `action` (Formspree) without leaving
     the page, then swaps the form for the success note.
  ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-form]'), function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('[type=submit]');
      var ok = form.parentElement.querySelector('[data-form-ok]');
      var err = form.querySelector('[data-form-err]');
      var label = btn ? btn.innerHTML : '';
      function done() { form.hidden = true; if (ok) { ok.hidden = false; ok.focus(); } }
      function fail(msg) {
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        if (err) { err.textContent = msg; err.hidden = false; }
      }
      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      if (err) err.hidden = true;
      var endpoint = form.getAttribute('action');
      if (!endpoint) { done(); return; }
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (res.ok) { done(); return; }
          return res.json().catch(function () { return {}; }).then(function (json) {
            var msg = (json.errors || []).map(function (x) { return x.message; }).join(', ');
            fail((msg || 'Something went wrong') + ' \u2014 please try again or email hello@foxymedia.io.');
          });
        })
        .catch(function () { fail('Network error \u2014 please try again or email hello@foxymedia.io.'); });
    });
  });
})();
