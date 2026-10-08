/* ===========================================================
   Mario Blazevski — site behaviour
   Shared by the English and Macedonian pages.
   Reads window.SITE (config.js) and window.I18N (set per page).
   =========================================================== */
(function () {
  'use strict';
  var C = window.SITE || {};
  var T = window.I18N || {};
  var P = C.pricing || {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. fill configurable values ---------- */
  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();

  document.querySelectorAll('[data-fill]').forEach(function (el) {
    var k = el.getAttribute('data-fill');
    if (C[k]) el.textContent = C[k];
  });

  if (C.companyId && $('companyid')) $('companyid').textContent = ' (' + C.companyId + ')';

  var cap = $('capacity');
  if (cap) {
    var capText = (T.capacity || C.capacity);
    if (capText) { cap.querySelector('b').textContent = capText; }
    else { cap.classList.add('hidden'); }
  }

  /* ---------- 2. mobile navigation ---------- */
  var tog = $('navtoggle'), mnav = $('mobilenav');
  if (tog && mnav) {
    tog.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      tog.setAttribute('aria-expanded', open ? 'true' : 'false');
      tog.textContent = open ? (T.close || 'Close') : (T.menu || 'Menu');
    });
    mnav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mnav.classList.remove('open');
        tog.setAttribute('aria-expanded', 'false');
        tog.textContent = T.menu || 'Menu';
      }
    });
  }

  /* ---------- 3. contact routes (hidden when unconfigured) ---------- */
  function route(id, href) {
    var el = $(id); if (!el) return;
    if (!href) { el.classList.add('hidden'); return; }
    el.href = href;
  }
  route('c-whatsapp', C.whatsapp ? 'https://wa.me/' + C.whatsapp : '');
  route('c-viber', C.viber ? 'viber://chat?number=%2B' + C.viber : '');
  route('c-email', C.email ? 'mailto:' + C.email + '?subject=' + encodeURIComponent(T.mailSubject || 'Quote request') : '');
  route('c-linkedin', C.linkedin || '');
  if (C.email && $('c-email-sub')) $('c-email-sub').textContent = C.email;

  /* ---------- 4. price estimator ---------- */
  var est = $('estimator');
  if (est) {
    var mats = P.materials || {};
    var matSel = $('e-material');

    Object.keys(mats).forEach(function (code) {
      var o = document.createElement('option');
      o.value = code;
      o.textContent = code + ((T.materialHint && T.materialHint[code]) ? ' — ' + T.materialHint[code] : '');
      matSel.appendChild(o);
    });
    if (mats.PETG) matSel.value = 'PETG';

    function round(n) { return n >= 60 ? Math.round(n / 5) * 5 : Math.round(n); }

    function calc() {
      var x = parseFloat($('e-x').value) || 0,
          y = parseFloat($('e-y').value) || 0,
          z = parseFloat($('e-z').value) || 0,
          qty = Math.max(1, parseInt($('e-qty').value, 10) || 1),
          infill = parseFloat($('e-strength').value),
          m = mats[matSel.value] || { density: 1.27, pricePerKg: 25 };

      var out = $('e-out'), warn = $('e-warn');
      warn.classList.add('hidden');

      if (!(x > 0 && y > 0 && z > 0)) {
        out.textContent = '—';
        $('e-mass').textContent = '—';
        $('e-time').textContent = '—';
        $('e-unit').textContent = '—';
        return;
      }

      var bbox = (x * y * z) / 1000;                                  /* cm³ */
      var occ = P.occupancy || 0.3;                                   /* part vs bounding box */
      var wall = P.wallShare || 0.45;                                 /* perimeters vs infill */
      var vol = bbox * occ * (wall + (1 - wall) * infill);            /* cm³ of filament */
      var mass = vol * (m.density || 1.27);                           /* grams */
      var matCost = (mass / 1000) * (m.pricePerKg || 25);
      var hours = vol / (P.throughput || 11) + 0.3;
      var unit = (matCost + hours * (P.ratePerHour || 6)) * (P.margin || 1.6);
      unit = Math.max(unit, P.minUnit || 4);

      var disc = qty >= 10 ? 0.85 : qty >= 5 ? 0.9 : qty >= 2 ? 0.95 : 1;
      var total = (P.setupFee || 8) + unit * qty * disc;
      total = Math.max(total, P.minPrice || 10);

      var lo = round(total * 0.8), hi = round(total * 1.25);
      out.innerHTML = '€' + lo + '–' + hi + ' <small>' + (qty > 1 ? (T.forQty || 'for') + ' ' + qty : (T.perPart || 'for one part')) + '</small>';
      $('e-mass').textContent = Math.round(mass * qty) + ' g';
      $('e-time').textContent = (hours * qty).toFixed(1) + ' h';
      $('e-unit').textContent = '€' + round(total / qty);

      var msgs = [];
      var lim = P.buildVolume || 256;
      if (Math.max(x, y, z) > lim) msgs.push((T.warnSize || 'Larger than the build volume of 256 mm. The part would need splitting and bonding, or another process.'));
      if (total > (P.askDirect || 800)) msgs.push((T.warnBig || 'At this size, send the part over directly — a real quote will beat this estimate.'));
      if (msgs.length) { warn.innerHTML = msgs.join('<br>'); warn.classList.remove('hidden'); }
    }

    /* quick presets — most visitors do not know their part in millimetres */
    var chips = est.querySelectorAll('.chip');
    function clearChips() {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    }
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        $('e-x').value = c.dataset.x;
        $('e-y').value = c.dataset.y;
        $('e-z').value = c.dataset.z;
        $('e-strength').value = c.dataset.s;
        if (mats[c.dataset.m]) matSel.value = c.dataset.m;
        clearChips();
        c.setAttribute('aria-pressed', 'true');
        calc();
      });
    });

    est.addEventListener('input', function (e) {
      if (!e.target.classList.contains('chip')) clearChips();
      calc();
    });
    est.addEventListener('change', function (e) {
      if (!e.target.classList.contains('chip')) clearChips();
      calc();
    });
    calc();

    /* carry the numbers into the quote form */
    var use = $('e-use');
    if (use) {
      use.addEventListener('click', function (e) {
        e.preventDefault();
        var msg = $('message');
        if (msg) {
          var line = (T.estLine || 'From the estimator') + ': ' +
            ($('e-x').value || '?') + ' × ' + ($('e-y').value || '?') + ' × ' + ($('e-z').value || '?') + ' mm, ' +
            matSel.value + ', ' +
            $('e-strength').selectedOptions[0].textContent.toLowerCase() + ', ' +
            (T.qtyWord || 'quantity') + ' ' + ($('e-qty').value || '1') + '. ' +
            (T.estimated || 'Estimated') + ' ' + $('e-out').textContent.replace(/\s+/g, ' ').trim() + '.\n\n';
          msg.value = line + msg.value;
          msg.focus();
          msg.setSelectionRange(msg.value.length, msg.value.length);
        }
        document.getElementById('quote').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ---------- 5. quote form ---------- */
  var form = $('quoteform');
  if (form) {
    var sent = $('sent'), status = $('status'), btn = $('submitbtn');

    if (!C.formEndpoint) {
      var ff = $('filefield');
      if (ff) ff.innerHTML = '<p class="hint">' + (T.noFileNote ||
        'Attach files by replying to the email that opens: STL, STEP, 3MF, DXF, PDF or a photo.') + '</p>';
    }

    function mark(id, bad) { var el = $(id); if (el) el.classList.toggle('invalid', bad); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.company_hp.value) return;                       /* honeypot */
      status.className = 'status dim'; status.textContent = '';

      var okName = form.name.value.trim().length > 0,
          okMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()),
          okMsg  = form.message.value.trim().length > 0;
      mark('f-name', !okName); mark('f-email', !okMail); mark('f-message', !okMsg);
      if (!(okName && okMail && okMsg)) {
        var first = form.querySelector('.invalid input, .invalid textarea');
        if (first) first.focus();
        return;
      }

      if (!C.formEndpoint) {
        var body = 'Name: ' + form.name.value + '\n' +
                   'Email: ' + form.email.value + '\n' +
                   'Part type: ' + form.type.value + '\n' +
                   'Country: ' + form.country.value + '\n\n' +
                   form.message.value + '\n';
        window.location.href = 'mailto:' + C.email +
          '?subject=' + encodeURIComponent((T.mailSubject || 'Quote request') + ' — ' + form.name.value) +
          '&body=' + encodeURIComponent(body);
        status.textContent = T.mailOpening || 'Your email app is opening with the request filled in. Attach any files there and send.';
        return;
      }

      btn.disabled = true;
      status.textContent = T.sending || 'Sending…';
      fetch(C.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad response');
          form.classList.add('hidden');
          sent.classList.remove('hidden');
          sent.focus();
        })
        .catch(function () {
          status.className = 'status err';
          status.innerHTML = (T.sendFail || 'That did not send. Please email it to') +
            ' <a href="mailto:' + C.email + '">' + C.email + '</a>.';
        })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
