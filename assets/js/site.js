/* FoxyMedia — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function isMobile() { return window.matchMedia('(max-width: 1000px)').matches; }

  function syncNav() {
    if (!nav || !toggle) return;
    if (isMobile()) {
      nav.hidden = toggle.getAttribute('aria-expanded') !== 'true';
    } else {
      nav.hidden = false;
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      syncNav();
    });
    window.addEventListener('resize', syncNav);
    syncNav();

    /* Close nav on mobile when any link is tapped */
    Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        if (isMobile()) {
          toggle.setAttribute('aria-expanded', 'false');
          syncNav();
        }
      });
    });
  }

  /* ---- Current year in the footer --------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

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
