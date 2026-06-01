/* ============================================================
   SKGPG — Availability bottom sheet
   The single mobile lead path: sticky "Check Availability" bar →
   3–5 quick taps → WhatsApp pre-filled (via window.SKGPG).
   Exposes window.openAvailSheet(preselect) — preselect optional,
   e.g. { room: 'Budget room' } so room cards can deep-link (P2).
   ============================================================ */
(function (w, d) {
  'use strict';

  var overlay  = d.getElementById('sheetOverlay');
  var sheet    = d.getElementById('availSheet');
  if (!overlay || !sheet) return;

  var closeBtn = d.getElementById('sheetClose');
  var backBtn  = d.getElementById('sheetBack');
  var sendBtn  = d.getElementById('sheetSend');
  var nameEl   = d.getElementById('sheet-name');
  var phoneEl  = d.getElementById('sheet-phone');
  var errEl    = d.getElementById('sheetErr');
  var steps    = Array.prototype.slice.call(sheet.querySelectorAll('.sheet-step'));
  var dots     = Array.prototype.slice.call(sheet.querySelectorAll('.sheet-progress .dot'));
  var triggerBtn = d.getElementById('stickyCheckBtn');

  var lastFocus = null;
  var state = { room: '', type: '', duration: '', current: 1 };
  var TOTAL = steps.length; // 4

  function track(name, params) {
    if (typeof w.trackEvent === 'function') w.trackEvent(name, params);
  }

  function showStep(n) {
    state.current = n;
    steps.forEach(function (s) {
      s.hidden = parseInt(s.getAttribute('data-step'), 10) !== n;
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('done', i < n - 1);
      dot.classList.toggle('active', i === n - 1);
    });
    backBtn.hidden = n === 1;
    // focus management: first input on contact step, else the sheet
    if (n === TOTAL && nameEl) {
      setTimeout(function () { nameEl.focus(); }, 260);
    }
  }

  function open(preselect) {
    lastFocus = d.activeElement;
    state = { room: '', type: '', duration: '', current: 1 };
    if (preselect && preselect.room) state.room = preselect.room;
    // clear chip selections + inputs
    sheet.querySelectorAll('.chip.selected').forEach(function (c) { c.classList.remove('selected'); });
    if (nameEl) nameEl.value = '';
    if (phoneEl) phoneEl.value = '';
    if (errEl) errEl.hidden = true;

    overlay.hidden = false;
    sheet.hidden = false;
    sheet.setAttribute('aria-hidden', 'false');
    // next frame → animate in
    requestAnimationFrame(function () {
      overlay.classList.add('show');
      sheet.classList.add('open');
    });
    d.body.style.overflow = 'hidden';
    // jump past any pre-filled step
    showStep(preselect && preselect.room ? 2 : 1);
    track('sheet_open', { event_category: 'Lead' });
  }

  function close() {
    overlay.classList.remove('show');
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    d.body.style.overflow = '';
    setTimeout(function () {
      overlay.hidden = true;
      sheet.hidden = true;
    }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // chip selection → store + auto-advance
  sheet.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var field = chip.getAttribute('data-field');
      var val   = chip.getAttribute('data-val');
      state[field] = val;
      // visual select within this step
      chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('selected'); });
      chip.classList.add('selected');
      if (state.current < TOTAL) {
        setTimeout(function () { showStep(state.current + 1); }, 180);
      }
    });
  });

  function send() {
    var name  = (nameEl.value || '').trim();
    var phone = (phoneEl.value || '').trim();
    if (!name || !phone) {
      errEl.hidden = false;
      return;
    }
    errEl.hidden = true;
    var text = w.SKGPG.buildAvailabilityMessage({
      name: name,
      phone: phone,
      type: state.type,
      room: state.room,
      duration: state.duration
    });
    track('sheet_submit', { event_category: 'Lead' });
    w.SKGPG.openWhatsApp(text);
    close();
  }

  triggerBtn && triggerBtn.addEventListener('click', function () { open(); });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  backBtn.addEventListener('click', function () {
    if (state.current > 1) showStep(state.current - 1);
  });
  sendBtn.addEventListener('click', send);
  phoneEl && phoneEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !sheet.hidden) close();
  });

  // public API for room cards (P2) and any other entry point
  w.openAvailSheet = open;
})(window, document);
