(function () {
  'use strict';
  if (window.SunnexConsent) return;
  var KEY = 'sunnex-cookie-consent-v1', TTL = 180 * 86400000;
  var gaId = 'G-NXW8TYRTBE', started = false, previousFocus, previousOverflow;
  var inertStates = [], mounted = false;
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && c.version === 1 && typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean' && Number.isFinite(c.savedAt) && Date.now() >= c.savedAt && Date.now() - c.savedAt < TTL) return c;
    } catch (_) {}
    return null;
  }
  var choice = read();
  window['ga-disable-' + gaId] = !(choice && choice.analytics);
  function snapshot() { return Object.assign({necessary: true, analytics: false, marketing: false}, choice || {}, {marketing: false}); }
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
  var policyHTML = "<div class=\"sx-cookie-policy-intro\"><span class=\"sx-cookie-eyebrow\">COOKIE POLICY</span><h3>นโยบายคุกกี้ของ Sunnex Technology</h3><p>เว็บไซต์ sunnext.co.th ให้ความสำคัญกับความเป็นส่วนตัวของผู้เข้าชม นโยบายนี้อธิบายว่าเราใช้คุกกี้และพื้นที่จัดเก็บในเบราว์เซอร์เพื่ออะไร และคุณเลือกอนุญาตหรือปฏิเสธได้อย่างไร</p><small>มีผลวันที่ 26 พฤศจิกายน 2569</small></div>\n<section><h4>1. คุกกี้คืออะไร</h4><p>คุกกี้เป็นข้อมูลขนาดเล็กที่เว็บไซต์หรือผู้ให้บริการบันทึกในเบราว์เซอร์ เพื่อจดจำข้อมูลการใช้งาน เว็บไซต์ยังอาจใช้เทคโนโลยีใกล้เคียง เช่น localStorage ซึ่งจัดเก็บข้อมูลไว้ในอุปกรณ์ของคุณ ข้อมูลบางรายการอาจเชื่อมโยงกับผู้ใช้หรืออุปกรณ์ได้ จึงควรเลือกอนุญาตตามความต้องการของคุณ</p></section>\n<section><h4>2. เราใช้ข้อมูลเหล่านี้เพื่ออะไร</h4><ul><li><b>จดจำตัวเลือกความเป็นส่วนตัว:</b> บันทึกว่าคุณอนุญาตคุกกี้ประเภทใด เพื่อใช้ตัวเลือกเดียวกันเมื่อเปลี่ยนหน้าหรือกลับมาเยี่ยมชม</li><li><b>วิเคราะห์และปรับปรุงเว็บไซต์:</b> เมื่อคุณอนุญาตด้านสถิติ เราใช้ Google Analytics เพื่อเข้าใจจำนวนการเข้าชม หน้าที่ได้รับความสนใจ และการใช้งาน เช่น การกดติดต่อหรือดูรายละเอียดสินค้า</li><li><b>การโฆษณา:</b> ขณะนี้ยังไม่เปิดใช้ Meta Pixel บนระบบคุกกี้นี้ จึงยังไม่มีการส่งข้อมูลโฆษณาไปยัง Meta ผ่านระบบนี้</li></ul></section>\n<section><h4>3. ประเภทและระยะเวลาการจัดเก็บ</h4><div class=\"sx-cookie-policy-type\"><b>คุกกี้และพื้นที่จัดเก็บที่จำเป็น</b><p>ใช้ localStorage ชื่อ sunnex-cookie-consent-v1 เพื่อเก็บตัวเลือกและเวลาที่คุณบันทึก ระบบจะขอให้เลือกใหม่เมื่อครบ 180 วัน การลบข้อมูลเว็บไซต์หรือเปลี่ยนเบราว์เซอร์อาจทำให้ต้องเลือกใหม่ ข้อมูลตัวเลือกเดิมอาจยังอยู่ในอุปกรณ์จนถูกแทนที่หรือลบโดยคุณ</p></div><div class=\"sx-cookie-policy-type\"><b>คุกกี้เพื่อการวิเคราะห์</b><p>ใช้ Google Analytics โดยคุกกี้อาจมีชื่อ _ga และ _ga_* เพื่อแยกผู้ใช้และช่วงการเข้าชม ค่าอายุเริ่มต้นของผู้ให้บริการคือ 2 ปี ทั้งนี้อายุจริงขึ้นกับการตั้งค่าและข้อจำกัดของเบราว์เซอร์ เราจะเริ่มโหลด Google Analytics เมื่อคุณอนุญาตประเภทนี้เท่านั้น</p></div><div class=\"sx-cookie-policy-type\"><b>คุกกี้เพื่อการโฆษณา</b><p>ยังไม่เปิดใช้งาน คุณจึงไม่ต้องอนุญาตประเภทนี้ในขณะนี้ หากเพิ่มเครื่องมือโฆษณาในอนาคต เราจะปรับข้อมูลเกี่ยวกับเครื่องมือ วัตถุประสงค์ และตัวเลือกความยินยอมก่อนใช้งาน</p></div></section>\n<section><h4>4. คุณควบคุมคุกกี้ได้อย่างไร</h4><p>คุณเลือก “ยอมรับทั้งหมด” เพื่ออนุญาตคุกกี้ทางเลือกที่เปิดใช้งานอยู่ เลือก “ไม่ยอมรับทั้งหมด” เพื่อปิดคุกกี้ที่ไม่จำเป็น หรือเลือกเฉพาะประเภทแล้วกด “บันทึกการตั้งค่า” การปฏิเสธไม่ปิดกั้นการอ่านเนื้อหา การดูสินค้า หรือการติดต่อบริษัท</p><p>เปลี่ยนใจได้ทุกเมื่อผ่านปุ่ม “ตั้งค่าคุกกี้” มุมล่างซ้ายของเว็บไซต์ เมื่อถอนความยินยอมด้านสถิติ ระบบจะหยุดการวัดผล พยายามลบคุกกี้ Analytics ที่เข้าถึงได้ และอาจโหลดหน้าใหม่เพื่อหยุดสคริปต์ที่ทำงานอยู่ การถอนความยินยอมไม่ลบข้อมูลที่ส่งไปก่อนหน้าโดยอัตโนมัติ</p><p>คุณสามารถลบข้อมูลเว็บไซต์ผ่านการตั้งค่าเบราว์เซอร์ได้ หากปิดกั้นพื้นที่จัดเก็บทั้งหมด ระบบอาจจำตัวเลือกข้ามหน้าไม่ได้</p></section>\n<section><h4>5. ผู้ให้บริการภายนอก</h4><p>เมื่ออนุญาต Google Analytics ผู้ให้บริการอาจประมวลผลข้อมูลการเข้าชม อุปกรณ์ เบราว์เซอร์ และเหตุการณ์ใช้งานตามการตั้งค่าบริการ อ่านเพิ่มเติมได้ที่ <a href=\"https://policies.google.com/privacy\" target=\"_blank\" rel=\"noopener\">นโยบายความเป็นส่วนตัวของ Google</a> และ <a href=\"https://support.google.com/analytics/answer/11397207\" target=\"_blank\" rel=\"noopener\">ข้อมูลคุกกี้ Google Analytics</a></p><p>ตัวเลือกในหน้าต่างนี้ควบคุม Google Analytics ของเว็บไซต์ ส่วนแผนที่ เนื้อหาฝัง ตัวนับผู้เข้าชม และบริการที่คุณเปิดผ่านลิงก์ภายนอกอาจมีการประมวลผลข้อมูลแยกต่างหาก โปรดศึกษานโยบายของบริการนั้นด้วย</p></section>\n<section><h4>6. ติดต่อและการปรับปรุงนโยบาย</h4><p>หากมีคำถามเกี่ยวกับการใช้คุกกี้ ติดต่อ Sunnex Technology ผ่าน <a href=\"https://line.me/ti/p/~@sunnext\" target=\"_blank\" rel=\"noopener\">LINE @sunnext</a> โทร <a href=\"tel:021151484\">02-115-1484</a> หรือ <a href=\"tel:0814241186\">081-424-1186</a> เราจะปรับนโยบายนี้เมื่อการใช้เครื่องมือหรือวัตถุประสงค์เปลี่ยนแปลง พร้อมระบุวันที่มีผลไว้ในหน้านี้</p></section>\n";
  function save(allowed) {
    var hadAnalytics = started;
    // Advertising is not installed. Never collect advance consent for a future tool.
    choice = {version: 1, necessary: true, analytics: !!allowed.analytics, marketing: false, savedAt: Date.now()};
    try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch (_) {}
    window['ga-disable-' + gaId] = !choice.analytics;
    if (!choice.analytics) clearAnalyticsCookies();
    analytics();
    window.dispatchEvent(new CustomEvent('sunnex:consent-change', {detail: snapshot()}));
    document.getElementById('sx-cookie-banner').hidden = true;
    document.getElementById('sx-cookie-open').hidden = false;
    close();
    document.getElementById('sx-cookie-status').textContent = 'บันทึกการตั้งค่าคุกกี้แล้ว';
    if (hadAnalytics && !choice.analytics) location.reload();
  }
  function selectView(view, focusTab) {
    var isPolicy = view === 'policy';
    document.getElementById('sx-cookie-settings-view').hidden = isPolicy;
    document.getElementById('sx-cookie-policy-view').hidden = !isPolicy;
    ['settings', 'policy'].forEach(function (key) {
      var tab = document.getElementById('sx-cookie-tab-' + key), selected = key === (isPolicy ? 'policy' : 'settings');
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });
    document.getElementById('sx-cookie-dialog-title').textContent = isPolicy ? 'นโยบายคุกกี้' : 'ตั้งค่าความเป็นส่วนตัว';
    document.getElementById('sx-cookie-scroll').scrollTop = 0;
  }
  function open(view) {
    var dialog = document.getElementById('sx-cookie-dialog');
    if (!dialog) return;
    if (dialog.hidden) {
      previousFocus = document.activeElement;
      document.getElementById('sx-cookie-analytics').checked = !!(choice && choice.analytics);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      inertStates = [];
      Array.from(document.body.children).forEach(function (element) {
        if (element.id === 'sx-cookie-root' || /^(SCRIPT|STYLE|LINK)$/.test(element.tagName)) return;
        inertStates.push([element, element.inert]); element.inert = true;
      });
      dialog.hidden = false;
    }
    selectView(view === 'policy' ? 'policy' : 'settings', false);
    document.getElementById('sx-cookie-close').focus();
  }
  function close() {
    var dialog = document.getElementById('sx-cookie-dialog');
    if (!dialog || dialog.hidden) return;
    dialog.hidden = true;
    document.body.style.overflow = previousOverflow || '';
    inertStates.forEach(function (pair) { pair[0].inert = pair[1]; }); inertStates = [];
    if (previousFocus && previousFocus.isConnected && !previousFocus.closest('[hidden]')) previousFocus.focus();
    else document.getElementById('sx-cookie-open').focus();
  }
  window.SunnexConsent = {get: snapshot, open: open, openPolicy: function () { open('policy'); }};
  var shield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.3 2.3 4.7-4.7"/></svg>';
  function mount() {
    if (mounted) return; mounted = true;
    var root = document.createElement('div'); root.id = 'sx-cookie-root';
    root.innerHTML = `
      <section id="sx-cookie-banner" aria-labelledby="sx-cookie-title" hidden>
        <div class="sx-cookie-banner-copy"><span class="sx-cookie-banner-icon">${shield}</span><div><strong id="sx-cookie-title">คุณเลือกความเป็นส่วนตัวได้</strong><p>เราใช้คุกกี้เพื่อวิเคราะห์และปรับปรุงเว็บไซต์เมื่อคุณอนุญาต คุณเลือกยอมรับ ปฏิเสธ หรือเปลี่ยนการตั้งค่าได้ทุกเมื่อ <a href="/cookie-policy/" data-cookie="policy">อ่านนโยบายคุกกี้</a></p></div></div>
        <div class="sx-cookie-actions"><button type="button" data-cookie="settings">ตั้งค่าคุกกี้</button><button type="button" data-cookie="reject">ไม่ยอมรับทั้งหมด</button><button type="button" class="sx-cookie-primary" data-cookie="accept">ยอมรับทั้งหมด</button></div>
      </section>
      <button id="sx-cookie-open" type="button" data-cookie="settings" hidden>${shield}<span>ตั้งค่าคุกกี้</span></button>
      <span id="sx-cookie-status" class="sx-cookie-sr" role="status" aria-live="polite"></span>
      <div id="sx-cookie-dialog" hidden>
        <div class="sx-cookie-panel" role="dialog" aria-modal="true" aria-labelledby="sx-cookie-dialog-title" tabindex="-1">
          <header class="sx-cookie-heading"><div><span class="sx-cookie-eyebrow">SUNNEX · PRIVACY CENTER</span><h2 id="sx-cookie-dialog-title">ตั้งค่าความเป็นส่วนตัว</h2></div><button id="sx-cookie-close" type="button" data-cookie="close" aria-label="ปิดหน้าต่าง">×</button></header>
          <div class="sx-cookie-tabs" role="tablist" aria-label="ข้อมูลและตัวเลือกคุกกี้"><button type="button" role="tab" id="sx-cookie-tab-settings" aria-selected="true" aria-controls="sx-cookie-settings-view" data-cookie="settings-tab">ตั้งค่าคุกกี้</button><button type="button" role="tab" id="sx-cookie-tab-policy" aria-selected="false" aria-controls="sx-cookie-policy-view" tabindex="-1" data-cookie="policy-tab">นโยบายคุกกี้</button></div>
          <div id="sx-cookie-scroll" class="sx-cookie-scroll">
            <div id="sx-cookie-settings-view" role="tabpanel" aria-labelledby="sx-cookie-tab-settings">
              <a class="sx-cookie-brand-card" href="/cookie-policy/" data-cookie="policy"><span class="sx-cookie-brand-icon">${shield}</span><span><b>Cookie Policy (นโยบายคุกกี้)</b><small>sunnext.co.th · Sunnex Technology</small></span><span class="sx-cookie-chevron" aria-hidden="true">›</span></a>
              <p class="sx-cookie-description">เราเคารพสิทธิความเป็นส่วนตัวของคุณ คุกกี้ที่จำเป็นช่วยจดจำตัวเลือก ส่วนคุกกี้เพื่อการวิเคราะห์จะเริ่มทำงานเมื่อคุณยินยอมเท่านั้น คุณปฏิเสธคุกกี้ที่ไม่จำเป็นได้ โดยยังอ่านบทความ ดูสินค้า และติดต่อเราได้ตามปกติ</p>
              <div class="sx-cookie-section-title"><h3>กำหนดความยินยอมคุกกี้</h3><span>เลือกได้ตามต้องการ</span></div>
              <div class="sx-cookie-category"><div class="sx-cookie-category-row"><button type="button" class="sx-cookie-disclosure" aria-expanded="false" aria-controls="sx-cookie-necessary-info" data-cookie="expand"><span class="sx-cookie-arrow" aria-hidden="true">›</span><span>คุกกี้ที่จำเป็น<small>เปิดใช้งานเสมอ</small></span></button><label class="sx-cookie-switch"><input type="checkbox" role="switch" checked disabled aria-label="คุกกี้ที่จำเป็น เปิดใช้งานเสมอ"><span aria-hidden="true"></span></label></div><div id="sx-cookie-necessary-info" class="sx-cookie-category-info" hidden>ใช้พื้นที่จัดเก็บในเบราว์เซอร์เพื่อจดจำตัวเลือกคุกกี้ของคุณ เมื่อเปลี่ยนหน้าจึงไม่ต้องเลือกซ้ำ ระบบจะขอให้เลือกใหม่หลัง 180 วัน โดยไม่ใช้ข้อมูลส่วนนี้เพื่อโฆษณา</div></div>
              <div class="sx-cookie-category"><div class="sx-cookie-category-row"><button type="button" class="sx-cookie-disclosure" aria-expanded="false" aria-controls="sx-cookie-analytics-info" data-cookie="expand"><span class="sx-cookie-arrow" aria-hidden="true">›</span><span>คุกกี้เพื่อการวิเคราะห์<small>ช่วยปรับปรุงเว็บไซต์ให้ใช้งานดีขึ้น</small></span></button><label class="sx-cookie-switch"><input id="sx-cookie-analytics" type="checkbox" role="switch" aria-label="อนุญาตคุกกี้เพื่อการวิเคราะห์"><span aria-hidden="true"></span></label></div><div id="sx-cookie-analytics-info" class="sx-cookie-category-info" hidden>Google Analytics ช่วยให้เราทราบจำนวนการเข้าชม หน้าที่ได้รับความสนใจ และการใช้งาน เช่น การกดติดต่อ ระบบนี้ไม่โหลด Google Analytics จนกว่าคุณจะอนุญาต คุณปิดได้ทุกเมื่อ</div></div>
              <div class="sx-cookie-category"><div class="sx-cookie-category-row"><button type="button" class="sx-cookie-disclosure" aria-expanded="false" aria-controls="sx-cookie-marketing-info" data-cookie="expand"><span class="sx-cookie-arrow" aria-hidden="true">›</span><span>คุกกี้เพื่อการโฆษณา<small>ยังไม่เปิดใช้งาน</small></span></button><label class="sx-cookie-switch"><input id="sx-cookie-marketing" type="checkbox" role="switch" disabled aria-label="คุกกี้เพื่อการโฆษณา ยังไม่เปิดใช้งาน"><span aria-hidden="true"></span></label></div><div id="sx-cookie-marketing-info" class="sx-cookie-category-info" hidden>คุกกี้ประเภทนี้ใช้เพื่อวัดผลโฆษณาและนำเสนอเนื้อหาที่เกี่ยวข้องกับความสนใจ ขณะนี้เรายังไม่เปิดใช้ Meta Pixel จึงยังไม่ขอความยินยอมประเภทนี้ เมื่อมีการใช้งาน เราจะอัปเดตข้อมูลและตัวเลือกให้คุณพิจารณาก่อน</div></div>
              <p class="sx-cookie-note">เปลี่ยนตัวเลือกได้ทุกเมื่อที่ปุ่ม “ตั้งค่าคุกกี้” บนเว็บไซต์</p>
            </div>
            <div id="sx-cookie-policy-view" class="sx-cookie-policy" role="tabpanel" aria-labelledby="sx-cookie-tab-policy" hidden>${policyHTML}<button type="button" class="sx-cookie-back" data-cookie="settings-tab">← กลับไปตั้งค่าคุกกี้</button></div>
          </div>
          <footer class="sx-cookie-modal-footer"><div class="sx-cookie-actions"><button type="button" data-cookie="reject">ไม่ยอมรับทั้งหมด</button><button type="button" data-cookie="accept">ยอมรับทั้งหมด</button><button type="button" data-cookie="save" class="sx-cookie-primary">บันทึกการตั้งค่า</button></div><small>เลือกเฉพาะคุกกี้ที่คุณอนุญาตได้ โดยไม่กระทบการดูเนื้อหา</small></footer>
        </div>
      </div>`;
    document.body.appendChild(root);
    root.addEventListener('click', function (event) {
      var button = event.target.closest('[data-cookie]'); if (!button) return;
      var action = button.getAttribute('data-cookie');
      if (action === 'policy') { event.preventDefault(); open('policy'); }
      if (action === 'settings') open('settings');
      if (action === 'settings-tab' || action === 'policy-tab') selectView(action === 'policy-tab' ? 'policy' : 'settings', true);
      if (action === 'close') close();
      if (action === 'reject') save({analytics: false});
      if (action === 'accept') save({analytics: true});
      if (action === 'save') save({analytics: document.getElementById('sx-cookie-analytics').checked});
      if (action === 'expand') {
        var info = document.getElementById(button.getAttribute('aria-controls'));
        var expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded)); info.hidden = expanded;
      }
    });
    root.addEventListener('keydown', function (event) {
      var dialog = document.getElementById('sx-cookie-dialog'); if (dialog.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.target.getAttribute('role') === 'tab' && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(event.key) !== -1) {
        event.preventDefault();
        var next = event.key === 'Home' ? 'settings' : event.key === 'End' ? 'policy' : event.target.id === 'sx-cookie-tab-settings' ? 'policy' : 'settings';
        selectView(next, true); return;
      }
      if (event.key !== 'Tab') return;
      var nodes = Array.from(dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),[tabindex="0"]')).filter(function (node) { return node.getClientRects().length > 0; });
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
