/* ============================================================
   SKGPG — Mobile nav drawer
   Hamburger (< 960px) → slide-in side panel from the right with
   the 5 section links. Smooth-scroll is already bound globally to
   all a[href^="#"]; this module only owns open / close + a11y.
   ============================================================ */
(function (w, d) {
  'use strict';

  var burger  = d.getElementById('navBurger');
  var overlay = d.getElementById('navOverlay');
  var drawer  = d.getElementById('navDrawer');
  if (!burger || !overlay || !drawer) return;

  var closeBtn = d.getElementById('navDrawerClose');
  var links    = Array.prototype.slice.call(drawer.querySelectorAll('a[href]'));

  var isOpen = false;

  function track(name, params) {
    if (typeof w.trackEvent === 'function') w.trackEvent(name, params);
  }

  function open() {
    if (isOpen) return;
    isOpen = true;

    overlay.hidden = false;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');

    // Force a reflow so the initial (off-screen) state is committed, then
    // add the classes synchronously to play the slide/fade in. More robust
    // than requestAnimationFrame, which can be throttled while the page is
    // not painting.
    void drawer.offsetWidth;
    overlay.classList.add('show');
    drawer.classList.add('open');
    d.body.style.overflow = 'hidden';

    // guard: don't steal focus into the drawer if it was closed before this fires
    if (closeBtn) setTimeout(function () { if (isOpen) closeBtn.focus(); }, 200);
    track('nav_drawer_open', { event_category: 'Nav' });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;

    // Return focus to the trigger (burger) BEFORE hiding the drawer from
    // assistive tech — setting aria-hidden on an ancestor of the focused
    // element is blocked by the browser and warns.
    if (burger && burger.focus) burger.focus();

    overlay.classList.remove('show');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    d.body.style.overflow = '';

    setTimeout(function () {
      overlay.hidden = true;
      drawer.hidden = true;
    }, 240);
  }

  function toggle() { isOpen ? close() : open(); }

  burger.addEventListener('click', toggle);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // close on any drawer link tap (global handler still does the scroll)
  links.forEach(function (a) {
    a.addEventListener('click', close);
  });

  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  // safety: if viewport grows past desktop breakpoint while open, reset
  if (w.matchMedia) {
    var mq = w.matchMedia('(min-width: 960px)');
    var onChange = function (e) { if (e.matches && isOpen) close(); };
    mq.addEventListener ? mq.addEventListener('change', onChange)
                        : mq.addListener(onChange);
  }
})(window, document);
