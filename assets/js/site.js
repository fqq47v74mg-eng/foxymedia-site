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
  }

  /* ---- Current year in the footer --------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Hero performance board -------------------------------------------
     Demo figures that drift slightly so the board reads as live. Replace the
     rows with a feed from the platform when the API is wired up.
  ------------------------------------------------------------------------ */
  var board = document.querySelector('[data-board]');
  if (board && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cells = board.querySelectorAll('[data-metric]');
    setInterval(function () {
      var cell = cells[Math.floor(Math.random() * cells.length)];
      if (!cell) return;
      var value = parseFloat(cell.getAttribute('data-metric'));
      var drift = (Math.random() - 0.42) * (value * 0.03);
      var next = Math.max(0, value + drift);
      cell.setAttribute('data-metric', String(next));
      cell.textContent = cell.getAttribute('data-prefix') === '1'
        ? '$' + next.toFixed(2)
        : Math.round(next).toLocaleString('en-GB');
      var delta = cell.parentElement.querySelector('.flow__delta');
      if (delta) {
        var pct = (drift / value) * 100;
        delta.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
        delta.setAttribute('data-dir', pct >= 0 ? 'up' : 'down');
      }
    }, 2200);
  }

  /* ---- Contact form ------------------------------------------------------
     Front-end validation plus a success state. Point `action` at your CRM,
     form endpoint or serverless handler to make it live.
  ------------------------------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-form]'), function (form) {
    form.addEventListener('submit', function (event) {
      if (form.getAttribute('action')) return; // real endpoint configured
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var ok = form.parentElement.querySelector('[data-form-ok]');
      form.hidden = true;
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  });
})();
