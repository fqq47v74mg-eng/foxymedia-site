/* FoxyMedia — progressive enhancement.
   Every page and the service accordions work without JavaScript. */
'use strict';

function initNavigation() {
  var toggle = document.querySelector('.menu-toggle');
  var navigation = document.querySelector('.navigation');
  if (!toggle || !navigation) return;

  var desktop = window.matchMedia('(min-width: 60rem)');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    navigation.hidden = !open && !desktop.matches;
  }

  function resize() {
    toggle.hidden = desktop.matches;
    var focusInNavigation = navigation.contains(document.activeElement);
    var focusOnToggle = document.activeElement === toggle;
    setOpen(false);
    if (!desktop.matches && focusInNavigation) toggle.focus();
    if (desktop.matches && focusOnToggle) navigation.querySelector('a').focus();
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) {
      var restoreFocus = navigation.contains(document.activeElement);
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      if (!desktop.matches && restoreFocus) toggle.focus({ preventScroll: true });
    }
  });

  desktop.addEventListener('change', resize);
  resize();
}

function initContact() {
  var form = document.querySelector('#contact-form');
  if (!form) return;

  var interest = form.querySelector('#interest');
  var help = form.querySelector('#message-help');
  var status = document.querySelector('#form-status');
  var submit = form.querySelector('#send-enquiry');

  var hints = {
    general: 'A short outline is enough to start: your business, audience and objective.',
    media: 'Tell us who the content is for, what it should communicate and what already exists.',
    marketing: 'Tell us your campaign objective, audience and any current marketing activity.',
    partnerships: 'Tell us about the content or campaign you want to develop and the media collaboration you need.',
    brand: 'Tell us about your brand, campaign objective, audience and timing.',
    publisher: 'Tell us about your publication, readers and preferred collaborations.'
  };

  function updateHint() {
    if (help && interest) help.textContent = hints[interest.value] || hints.general;
  }

  if (interest) {
    interest.addEventListener('change', updateHint);

    // Only accept a value actually represented by the select options.
    var requested = new URLSearchParams(window.location.search).get('interest');
    var options = Array.prototype.slice.call(interest.options);
    if (requested && options.some(function (o) { return o.value === requested; })) {
      interest.value = requested;
    }
    updateHint();
  }

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message;
    if (state) { status.setAttribute('data-state', state); }
    else { status.removeAttribute('data-state'); }
  }

  form.addEventListener('input', function (event) {
    if (event.target.setCustomValidity) event.target.setCustomValidity('');
    setStatus('', null);
  });

  form.addEventListener('submit', function (event) {
    if (!form.reportValidity()) return;
    event.preventDefault();

    if (submit) submit.disabled = true;
    setStatus('Sending your enquiry…', null);

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      updateHint();
      setStatus('Thank you — your enquiry has been sent. We will reply by email.', 'ok');
    }).catch(function () {
      setStatus('Something went wrong. Please email hello@foxymedia.io instead.', 'error');
    }).finally(function () {
      if (submit) submit.disabled = false;
    });
  });
}

initNavigation();
initContact();
