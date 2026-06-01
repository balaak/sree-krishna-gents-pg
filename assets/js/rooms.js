/* ============================================================
   SKGPG — Room category tabs + carousel
   Tab bar filters .room cards by data-category (All shows all)
   and resets the horizontal scroller to start. Card buttons
   deep-link into the availability sheet via window.openAvailSheet.
   ============================================================ */
(function (w, d) {
  'use strict';

  var grid = d.querySelector('.rooms-grid');
  if (!grid) return;

  var tabs  = Array.prototype.slice.call(d.querySelectorAll('.room-tab'));
  var rooms = Array.prototype.slice.call(grid.querySelectorAll('.room'));

  function track(name, params) {
    if (typeof w.trackEvent === 'function') w.trackEvent(name, params);
  }

  function filter(category) {
    rooms.forEach(function (room) {
      var match = category === 'all' || room.getAttribute('data-category') === category;
      room.classList.toggle('is-filtered', !match);
    });
    // reset scroller to start so the first visible card leads
    grid.scrollLeft = 0;
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      var category = tab.getAttribute('data-filter') || 'all';
      filter(category);
      track('rooms_filter', { event_category: 'Rooms', category: category });
    });
  });

  // Card button → open the availability sheet preselected to this room
  grid.querySelectorAll('.book').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var room = btn.getAttribute('data-room') || '';
      if (typeof w.openAvailSheet === 'function') {
        w.openAvailSheet({ room: room });
      }
    });
  });
})(window, document);
