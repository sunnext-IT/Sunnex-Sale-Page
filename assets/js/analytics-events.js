(function () {
  'use strict';

  var measurementId = 'G-NXW8TYRTBE';

  function sendEvent(name, parameters) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', name, Object.assign({
      send_to: measurementId,
      transport_type: 'beacon'
    }, parameters || {}));
  }

  function cleanText(element) {
    return (element && element.textContent ? element.textContent : '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120);
  }

  document.addEventListener('click', function (event) {
    var target = event.target.closest('a, button');
    if (!target) return;

    var href = target.tagName === 'A' ? (target.getAttribute('href') || '') : '';
    var label = cleanText(target);

    if (/line\.me|lin\.ee/i.test(href)) {
      sendEvent('generate_lead', {
        method: 'line',
        link_url: target.href,
        link_text: label || 'LINE @sunnext'
      });
      return;
    }

    if (/^tel:/i.test(href)) {
      sendEvent('click_to_call', {
        phone_number: href.replace(/^tel:/i, ''),
        link_text: label
      });
      return;
    }

    if (/ดูภาพโบรชัวร์แบบเต็ม|เปิดโบรชัวร์|ดูโบรชัวร์/i.test(label)) {
      sendEvent('view_brochure', {
        brochure_name: document.querySelector('h1')
          ? cleanText(document.querySelector('h1'))
          : document.title
      });
      return;
    }

    if (target.tagName === 'A' && /ดูรายละเอียด/i.test(label)) {
      var card = target.closest('article');
      var itemHeading = card ? card.querySelector('h2, h3') : null;

      sendEvent('select_item', {
        item_list_name: 'product_cards',
        item_name: itemHeading ? cleanText(itemHeading) : label,
        link_url: target.href
      });
    }
  }, true);
})();
