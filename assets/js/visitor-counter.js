/* SUNNEX shared visitor counter: entrance/reload increments; internal navigation reads only. */
(function () {
  'use strict';
  var el = document.querySelector('[data-sunnex-visitors]');
  if (!el) return;
  var marker = 'sunnex_internal_navigation_v1';
  var nav = performance.getEntriesByType('navigation')[0];
  var navType = nav ? nav.type : 'navigate';
  var isInternal = false;
  try {
    var stamp = Number(sessionStorage.getItem(marker) || 0);
    isInternal = navType !== 'reload' && stamp > 0 && Date.now() - stamp < 30000;
    sessionStorage.removeItem(marker);
  } catch (e) { /* Private browsing may block session storage. */ }
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    try {
      var dest = new URL(link.href, location.href);
      if (dest.origin === location.origin && dest.pathname + dest.search !== location.pathname + location.search) {
        sessionStorage.setItem(marker, String(Date.now()));
      }
    } catch (e) { /* Ignore unsupported links. */ }
  }, true);
  var action = isInternal || navType === 'back_forward' ? 'get' : 'hit';
  fetch('/visitor-counter.php?action=' + action, {cache:'no-store', credentials:'same-origin'})
    .then(function (r) { if (!r.ok) throw Error('counter unavailable'); return r.json(); })
    .then(function (data) { if (typeof data.count === 'number') el.textContent = data.count.toLocaleString('en-US'); })
    .catch(function () { el.textContent = '—'; });
}());
