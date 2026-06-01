/* ============================================================
   SKGPG — Main JS
   Form → WhatsApp, check-in min date, analytics events.
   Phone + message builder live in shared.js (window.SKGPG).
   Header shadow, scroll reveal, count-up and smooth-scroll are
   handled by the inline script in index.html.
   ============================================================ */

// ── Availability Form → WhatsApp ───────────────────────────────
const form = document.getElementById('availabilityForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and mobile number.');
      return;
    }

    const text = SKGPG.buildAvailabilityMessage({
      name:     name,
      phone:    phone,
      type:     SKGPG.label('type',     document.getElementById('f-type').value),
      room:     SKGPG.label('room',     document.getElementById('f-room').value),
      duration: SKGPG.label('duration', document.getElementById('f-duration').value),
      checkin:  document.getElementById('f-checkin').value,
      msg:      document.getElementById('f-msg').value.trim()
    });

    SKGPG.openWhatsApp(text);
    trackEvent('avail_form_submit', { event_category: 'Lead' });
  });
}

// ── Set min date on check-in field ────────────────────────────
const checkinInput = document.getElementById('f-checkin');
if (checkinInput) {
  const today = new Date().toISOString().split('T')[0];
  checkinInput.min = today;
}

// ── GA4 event tracking stubs (wired up in Phase 5) ────────────
function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params);
  }
}

document.querySelectorAll('a[href^="tel:"]').forEach(el => {
  el.addEventListener('click', () => trackEvent('call_click', { event_category: 'CTA' }));
});
document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
  el.addEventListener('click', () => trackEvent('whatsapp_click', { event_category: 'CTA' }));
});
