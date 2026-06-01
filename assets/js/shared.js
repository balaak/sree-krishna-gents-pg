/* ============================================================
   SKGPG — Shared lead module
   Single source of truth for owner phone, label maps, and the
   WhatsApp message builder. Consumed by main.js (form) and
   chatbot.js. Loaded BEFORE both. Exposes window.SKGPG.
   ============================================================ */
(function (w) {
  'use strict';

  var OWNER_PHONE = '919447105351';

  // Raw form-value code → human label. The chatbot already stores
  // resolved labels, so it passes them straight through.
  var LABELS = {
    type: {
      professional:    'Working Professional',
      student:         'Student',
      'self-employed': 'Self-Employed',
      other:           'Other'
    },
    duration: {
      daily:    'Daily (short stay)',
      monthly:  'Monthly',
      longterm: 'Long-term (6 months+)',
      custom:   'Not sure yet'
    },
    room: {
      'premium-single': 'Premium Single (AC, TV, WiFi)',
      'premium-shared': 'Premium Shared — 2 Pax (AC, TV, WiFi)',
      'budget-single':  'Budget Single (Attached Bath)',
      'budget-2pax':    'Budget Shared — 2 Pax (Attached Bath)',
      'budget-3pax':    'Budget Shared — 3 Pax (Attached Bath)',
      'economy':        'Economy (Common Bath)',
      'unsure':         'Not sure yet'
    }
  };

  // Resolve a raw code to its label; empty/unknown returns '' so the
  // line gets omitted from the message.
  function label(group, val) {
    if (!val) return '';
    return (LABELS[group] && LABELS[group][val]) || val;
  }

  // data: { name, phone, type, room, duration, checkin, msg }
  // All values expected pre-resolved to labels (use label() first).
  // Empty values drop their line.
  function buildAvailabilityMessage(data) {
    data = data || {};
    return [
      "Hi! I'd like to check availability at Sree Krishna Gents PG.",
      '',
      'Name: ' + (data.name || ''),
      'Mobile: ' + (data.phone || ''),
      data.type     ? 'I am a: ' + data.type           : null,
      data.room     ? 'Room type: ' + data.room         : null,
      data.duration ? 'Stay duration: ' + data.duration : null,
      data.checkin  ? 'Preferred check-in: ' + data.checkin : null,
      data.msg      ? 'Notes: ' + data.msg              : null,
      '',
      'Can you confirm availability and share the current rate?'
    ].filter(function (l) { return l !== null; }).join('\n');
  }

  function waUrl(text) {
    return 'https://wa.me/' + OWNER_PHONE + '?text=' + encodeURIComponent(text);
  }

  function openWhatsApp(text) {
    w.open(waUrl(text), '_blank', 'noopener');
  }

  w.SKGPG = {
    OWNER_PHONE: OWNER_PHONE,
    LABELS: LABELS,
    label: label,
    buildAvailabilityMessage: buildAvailabilityMessage,
    waUrl: waUrl,
    openWhatsApp: openWhatsApp
  };
})(window);
