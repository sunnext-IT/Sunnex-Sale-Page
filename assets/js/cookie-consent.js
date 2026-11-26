(function () {
  'use strict';
  if (window.SunnexConsent) return;
  var KEY = 'sunnex-cookie-consent-v1', TTL = 180 * 86400000;
  var gaId = 'G-NXW8TYRTBE', started = false, previousFocus;
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.version === 1 && typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean' && Number.isFinite(c.savedAt) && Date.now() >= c.savedAt && Date.now() - c.savedAt < TTL) return c;
    } catch (_) {}
    return null;
  }
  var choice = read();
  window['ga-disable-' + gaId] = !(choice && choice.analytics);
  function snapshot() { return Object.assign({necessary: true, analytics: false, marketing: false}, choice || {}); }
  function analytics() {
    if (!choice || !choice.analytics || started) return;
    started = true;
    window['ga-disable-' + gaId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'});
    window.gtag('js', new Date());
    window.gtag('config', gaId);
    var tag = document.createElement('script');
    tag.async = true; tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
    document.head.appendChild(tag);
  }
  function clearAnalyticsCookies() {
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) return;
      var domains = ['', location.hostname, '.' + location.hostname];
      var bits = location.hostname.split('.');
      while (bits.length > 2) { bits.shift(); domains.push('.' + bits.join('.')); }
      var paths = ['/'], segments = location.pathname.split('/').filter(Boolean), path = '';
      segments.forEach(function (segment) { path += '/' + segment; paths.push(path, path + '/'); });
      domains.forEach(function (domain) { paths.forEach(function (p) {
        document.cookie = name + '=; Max-Age=0; path=' + p + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      }); });
    });
  }
  function save(allowed) {
    var hadAnalytics = started;
    choice = {version: 1, necessary: true, analytics: !!allowed.analytics, marketing: !!allowed.marketing, savedAt: Date.now()};
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (_) {}
    window['ga-disable-' + gaId] = !choice.analytics;
    if (!choice.analytics) clearAnalyticsCookies();
    analytics();
    window.dispatchEvent(new CustomEvent('sunnex:consent-change', {detail: snapshot()}));
    document.getElementById('sx-cookie-banner').hidden = true;
    close();
    document.getElementById('sx-cookie-open').hidden = false;
    if (hadAnalytics && !choice.analytics) location.reload();
  }
  function open() {
    var dialog = document.getElementById('sx-cookie-dialog');
    previousFocus = document.activeElement;
    document.getElementById('sx-cookie-analytics').checked = !!(choice && choice.analytics);
    document.getElementById('sx-cookie-marketing').checked = !!(choice && choice.marketing);
    dialog.hidden = false;
    dialog.querySelector('button').focus();
  }
  function close() {
    var dialog = document.getElementById('sx-cookie-dialog');
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }
  window.SunnexConsent = {get: snapshot, open: open};
  function mount() {
    var root = document.createElement('div'); root.id = 'sx-cookie-root';
    root.innerHTML = '<section id="sx-cookie-banner" aria-labelledby="sx-cookie-title" hidden><div><strong id="sx-cookie-title">ความเป็นส่วนตัวของคุณสำคัญกับเรา</strong><p>เว็บไซต์ใช้พื้นที่จัดเก็บที่จำเป็นเพื่อจดจำตัวเลือกของคุณ คุกกี้สถิติและการตลาดจะใช้เมื่อคุณยินยอมเท่านั้น คุณปฏิเสธได้และยังใช้งานเว็บไซต์ได้ตามปกติ <a href="/cookie-policy/">อ่านนโยบายคุกกี้</a></p></div><div class="sx-cookie-actions"><button type="button" data-cookie="settings">ตั้งค่าคุกกี้</button><button type="button" data-cookie="reject">ปฏิเสธคุกกี้ที่ไม่จำเป็น</button><button type="button" class="sx-cookie-primary" data-cookie="accept">ยอมรับทั้งหมด</button></div></section><button id="sx-cookie-open" type="button" hidden>ตั้งค่าคุกกี้</button><div id="sx-cookie-dialog" hidden><div class="sx-cookie-panel" role="dialog" aria-modal="true" aria-labelledby="sx-cookie-settings-title" tabindex="-1"><div class="sx-cookie-heading"><h2 id="sx-cookie-settings-title">ตั้งค่าคุกกี้</h2><button type="button" data-cookie="close" aria-label="ปิดหน้าต่างตั้งค่าคุกกี้">×</button></div><p>เลือกสิ่งที่คุณอนุญาตได้ และกลับมาเปลี่ยนตัวเลือกได้จากปุ่ม “ตั้งค่าคุกกี้”</p><label class="sx-cookie-option"><span><b>จำเป็นต่อการใช้งาน</b><small>บันทึกตัวเลือกคุกกี้ในอุปกรณ์ เพื่อไม่ต้องถามซ้ำเมื่อเปลี่ยนหน้า</small></span><input type="checkbox" checked disabled aria-label="จำเป็นต่อการใช้งาน เปิดเสมอ"></label><label class="sx-cookie-option"><span><b>สถิติและการวิเคราะห์</b><small>Google Analytics ช่วยวิเคราะห์การเข้าชมและการใช้งานเว็บไซต์ เริ่มทำงานเมื่อคุณอนุญาต</small></span><input id="sx-cookie-analytics" type="checkbox"></label><label class="sx-cookie-option"><span><b>การตลาด</b><small>สำหรับการวัดผลและโฆษณาที่เกี่ยวข้อง ขณะนี้ยังไม่เปิดใช้ Meta Pixel การเลือกนี้ยังไม่ส่งข้อมูลให้ Meta</small></span><input id="sx-cookie-marketing" type="checkbox"></label><p><a href="/cookie-policy/">รายละเอียดนโยบายคุกกี้และการเปลี่ยนตัวเลือก</a></p><div class="sx-cookie-actions"><button type="button" data-cookie="reject">ปฏิเสธคุกกี้ที่ไม่จำเป็น</button><button type="button" data-cookie="save" class="sx-cookie-primary">บันทึกตัวเลือก</button><button type="button" data-cookie="accept">ยอมรับทั้งหมด</button></div></div></div>';
    document.body.appendChild(root);
    root.addEventListener('click', function (event) {
      var button = event.target.closest('button'); if (!button) return;
      var action = button.getAttribute('data-cookie');
      if (button.id === 'sx-cookie-open' || action === 'settings') open();
      if (action === 'close') close();
      if (action === 'reject') save({analytics: false, marketing: false});
      if (action === 'accept') save({analytics: true, marketing: true});
      if (action === 'save') save({analytics: document.getElementById('sx-cookie-analytics').checked, marketing: document.getElementById('sx-cookie-marketing').checked});
    });
    root.addEventListener('keydown', function (event) {
      var dialog = document.getElementById('sx-cookie-dialog'); if (dialog.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab') return;
      var nodes = Array.from(dialog.querySelectorAll('button,a,input:not(:disabled)'));
      var first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.getElementById('sx-cookie-banner').hidden = !!choice;
    document.getElementById('sx-cookie-open').hidden = !choice;
    analytics();
  }
  window.addEventListener('storage', function (event) { if (event.key === KEY || event.key === null) location.reload(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
