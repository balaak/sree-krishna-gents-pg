/* ============================================================
   SKGPG — Main JS
   Form → WhatsApp, scroll effects, analytics events
   ============================================================ */

const OWNER_PHONE = '919447105351';

// ── Availability Form → WhatsApp ───────────────────────────────
const form = document.getElementById('availabilityForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name     = document.getElementById('f-name').value.trim();
    const phone    = document.getElementById('f-phone').value.trim();
    const type     = document.getElementById('f-type').value;
    const duration = document.getElementById('f-duration').value;
    const checkin  = document.getElementById('f-checkin').value;
    const msg      = document.getElementById('f-msg').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and mobile number.');
      return;
    }

    const typeLabel = {
      professional: 'Working Professional',
      student: 'Student',
      'self-employed': 'Self-Employed',
      other: 'Other'
    }[type] || type || 'Not specified';

    const durationLabel = {
      daily: 'Daily (short stay)',
      monthly: 'Monthly',
      longterm: 'Long-term (6 months+)',
      custom: 'Not sure yet'
    }[duration] || duration || 'Not specified';

    const lines = [
      `Hi! I'd like to check availability at Sree Krishna Gents PG.`,
      ``,
      `Name: ${name}`,
      `Mobile: ${phone}`,
      `I am a: ${typeLabel}`,
      `Stay duration: ${durationLabel}`,
      checkin ? `Preferred check-in: ${checkin}` : null,
      msg     ? `Notes: ${msg}` : null,
      ``,
      `Can you confirm availability?`
    ].filter(l => l !== null).join('\n');

    window.open(`https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
  });
}

// ── Sticky nav background on scroll ───────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(11, 22, 41, 0.98)';
  } else {
    nav.style.background = 'rgba(11, 22, 41, 0.92)';
  }
}, { passive: true });

// ── Set min date on check-in field ────────────────────────────
const checkinInput = document.getElementById('f-checkin');
if (checkinInput) {
  const today = new Date().toISOString().split('T')[0];
  checkinInput.min = today;
}

// ── Smooth scroll for nav links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

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
if (form) {
  form.addEventListener('submit', () => trackEvent('avail_form_submit', { event_category: 'Lead' }));
}
