/* ============================================================
   SKGPG AI Chatbot — Phase 1 (rule-based, no backend)
   Phase 3 upgrade: swap sendBotMessage() for Claude Haiku API call
   ============================================================ */

const OWNER_PHONE = '919447105351';

const FLOWS = {
  welcome: {
    msg: "Hi! 👋 I'm the Sree Krishna PG assistant.\n\nI can help you check availability, answer questions about pricing, amenities, and location.\n\nWhat would you like to do?",
    opts: [
      { label: '🏠 Check Availability', next: 'avail_name' },
      { label: '💰 Pricing & Deposit',   next: 'pricing' },
      { label: '📍 Location & Directions', next: 'location' },
      { label: '📋 House Rules',          next: 'rules' },
      { label: '🛎️ Amenities',           next: 'amenities' },
    ]
  },
  pricing: {
    msg: "Here's the full pricing breakdown:\n\n• **Daily:** ₹400/day\n• **Monthly:** ₹6,500/month\n• **Security Deposit:** ₹7,500 (refundable)\n• **Electric appliance surcharge:** ₹250/month (iron box, etc.)\n\nFood is not provided — but there are great options nearby.",
    opts: [
      { label: '🏠 Check Availability', next: 'avail_name' },
      { label: '⬅️ Back to menu',       next: 'welcome' },
    ]
  },
  location: {
    msg: "📍 **Address:**\nVRWA 41, 52/2761, Om Muruga,\nLane No. 9, Maplachery Rd,\nVyttila, Ernakulam — 682019\n\n🚇 Near Vyttila Metro Station\n🚌 Near Vyttila Mobility Hub (Bus Terminus)\n🛒 Near Vyttila Junction",
    opts: [
      { label: '🗺️ Open in Google Maps', url: 'https://maps.google.com/?q=Sree+krishna+gents+pg+vyttila', next: null },
      { label: '🏠 Check Availability',  next: 'avail_name' },
      { label: '⬅️ Back to menu',        next: 'welcome' },
    ]
  },
  rules: {
    msg: "📋 **House Rules:**\n\n🚫 No cooking in rooms\n⚡ Declare electric appliances (₹250/month surcharge)\n📅 Rent due before the due date\n🔒 Security deposit: ₹7,500 refundable\n🤫 Quiet, respectful environment\n👥 Visitors by prior permission only\n\nThese rules create the peaceful atmosphere our tenants love.",
    opts: [
      { label: '🏠 Check Availability', next: 'avail_name' },
      { label: '⬅️ Back to menu',       next: 'welcome' },
    ]
  },
  amenities: {
    msg: "🛎️ **What's included:**\n\n💧 Aqua Guard purified water\n📷 CCTV security\n🛵 Two-wheeler parking (free)\n🧹 Room + bathroom cleaned 2×/week\n🚇 Vyttila Metro nearby\n🚌 Bus Terminus walkable\n👤 Responsive, direct owner",
    opts: [
      { label: '🏠 Check Availability', next: 'avail_name' },
      { label: '⬅️ Back to menu',       next: 'welcome' },
    ]
  },

  // ── Availability flow ──────────────────────────────────────
  avail_name: {
    msg: "Let's check availability for you! 😊\n\nFirst — what's your name?",
    input: true,
    inputPlaceholder: 'Your full name…',
    next: 'avail_phone',
    storeAs: 'name'
  },
  avail_phone: {
    msg: "Nice to meet you, {name}! 👋\n\nWhat's the best mobile number to reach you on?",
    input: true,
    inputPlaceholder: '+91 98765 43210',
    next: 'avail_type',
    storeAs: 'phone'
  },
  avail_type: {
    msg: "Got it! Just one more — what best describes you?\n\n(This helps us understand your needs better.)",
    opts: [
      { label: '💼 Working Professional', next: 'avail_duration', storeAs: 'type', storeVal: 'Working Professional' },
      { label: '🎓 Student',             next: 'avail_duration', storeAs: 'type', storeVal: 'Student' },
      { label: '🧑‍💻 Self-Employed',       next: 'avail_duration', storeAs: 'type', storeVal: 'Self-Employed' },
      { label: '👤 Other',               next: 'avail_duration', storeAs: 'type', storeVal: 'Other' },
    ]
  },
  avail_duration: {
    msg: "How long are you looking to stay?",
    opts: [
      { label: '📅 Daily (short stay)',   next: 'avail_connect', storeAs: 'duration', storeVal: 'Daily' },
      { label: '📆 Monthly',              next: 'avail_connect', storeAs: 'duration', storeVal: 'Monthly' },
      { label: '🗓️ Long-term (6m+)',     next: 'avail_connect', storeAs: 'duration', storeVal: 'Long-term' },
      { label: '🤷 Not sure yet',         next: 'avail_connect', storeAs: 'duration', storeVal: 'Not sure' },
    ]
  },
  avail_connect: {
    msg: "Perfect! I'll connect you with the owner right now via WhatsApp. He'll confirm availability and answer any questions directly. 🙌",
    opts: [
      { label: '💬 Open WhatsApp Now', next: null, action: 'openWhatsApp' },
      { label: '📞 Call Instead',      next: null, action: 'openCall' },
    ]
  }
};

// ── State ──────────────────────────────────────────────────────
const state = { name: '', phone: '', type: '', duration: '', step: 'welcome', awaitingInput: false, inputStoreAs: '', inputNext: '' };

// ── DOM refs ───────────────────────────────────────────────────
const bubble   = document.getElementById('chatBubble');
const panel    = document.getElementById('chatPanel');
const closeBtn = document.getElementById('chatClose');
const msgArea  = document.getElementById('chatMessages');
const optsArea = document.getElementById('chatOptions');
const inputEl  = document.getElementById('chatInput');
const sendBtn  = document.getElementById('chatSendBtn');

// ── Toggle ─────────────────────────────────────────────────────
function openChat() {
  panel.classList.add('open');
  bubble.querySelector('.chat-badge').style.display = 'none';
  if (msgArea.children.length === 0) startFlow('welcome');
}
function closeChat() { panel.classList.remove('open'); }

bubble.addEventListener('click', openChat);
bubble.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openChat(); });
closeBtn.addEventListener('click', closeChat);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

// ── Message rendering ──────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function addMsg(text, role = 'bot') {
  const el = document.createElement('div');
  el.className = `chat-msg ${role}`;
  const formatted = text
    .replace(/\{name\}/g, state.name || 'there')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  el.innerHTML = `<div class="bubble">${formatted}</div><div class="msg-time">${now()}</div>`;
  msgArea.appendChild(el);
  msgArea.scrollTop = msgArea.scrollHeight;
}

function clearOpts() { optsArea.innerHTML = ''; }

function showOpts(opts) {
  clearOpts();
  opts.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-opt' + (opt.action === 'openWhatsApp' ? ' wa-opt' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => handleOpt(opt));
    optsArea.appendChild(btn);
  });
}

// ── Flow engine ────────────────────────────────────────────────
function startFlow(stepKey) {
  state.step = stepKey;
  const step = FLOWS[stepKey];
  if (!step) return;

  setTimeout(() => {
    addMsg(step.msg);
    if (step.input) {
      state.awaitingInput = true;
      state.inputStoreAs  = step.storeAs;
      state.inputNext     = step.next;
      inputEl.placeholder = step.inputPlaceholder || 'Type here…';
      inputEl.focus();
      clearOpts();
    } else {
      state.awaitingInput = false;
      inputEl.placeholder = 'Type a question…';
      if (step.opts) showOpts(step.opts);
    }
  }, 380);
}

function handleOpt(opt) {
  addMsg(opt.label, 'user');
  clearOpts();

  if (opt.storeAs && opt.storeVal) state[opt.storeAs] = opt.storeVal;

  if (opt.action === 'openWhatsApp') { openWhatsApp(); return; }
  if (opt.action === 'openCall')     { window.location.href = 'tel:+' + OWNER_PHONE; return; }
  if (opt.url) { window.open(opt.url, '_blank', 'noopener'); }

  if (opt.next) setTimeout(() => startFlow(opt.next), 300);
}

function handleInput() {
  const val = inputEl.value.trim();
  if (!val) return;
  addMsg(val, 'user');
  inputEl.value = '';
  if (state.awaitingInput && state.inputStoreAs) state[state.inputStoreAs] = val;
  state.awaitingInput = false;
  if (state.inputNext) setTimeout(() => startFlow(state.inputNext), 300);
}

sendBtn.addEventListener('click', handleInput);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(); });

// ── WhatsApp pre-fill ──────────────────────────────────────────
function openWhatsApp() {
  const msg = `Hi! I'm interested in Sree Krishna Gents PG.

Name: ${state.name}
Mobile: ${state.phone}
I am a: ${state.type}
Stay duration: ${state.duration}

Can you confirm availability?`;
  const url = `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
  setTimeout(() => {
    addMsg("✅ WhatsApp opened with your details pre-filled! The owner will confirm availability shortly. You can also call directly: 094471 05351", 'bot');
  }, 400);
}

// ── Free-text FAQ fallback ─────────────────────────────────────
// Basic keyword matching — Phase 3 will replace with Claude Haiku API
function handleFreeText(text) {
  const t = text.toLowerCase();
  if (t.match(/price|cost|rate|rent|₹|rupee|monthly|daily/)) return startFlow('pricing');
  if (t.match(/location|address|where|map|direction|metro|bus/)) return startFlow('location');
  if (t.match(/rule|regulation|cook|visitor|quiet|appliance/)) return startFlow('rules');
  if (t.match(/amenity|amenities|wifi|water|cctv|parking|clean/)) return startFlow('amenities');
  if (t.match(/available|availability|room|check|book|stay/)) return startFlow('avail_name');
  // Fallback
  addMsg("I'm not sure about that yet — let me connect you with the owner who can answer anything! 👇", 'bot');
  setTimeout(() => showOpts([
    { label: '💬 WhatsApp Owner', action: 'openWhatsApp' },
    { label: '📞 Call Owner', action: 'openCall' },
    { label: '⬅️ Main Menu', next: 'welcome' },
  ]), 300);
}
