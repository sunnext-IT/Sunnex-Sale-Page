(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.rv-faq details').forEach(item => {
    const summary = item.querySelector('summary');
    let animation = null, targetOpen = item.open;
    summary.addEventListener('click', e => {
      if (!item.animate || reduced.matches) return;
      e.preventDefault();
      const start = item.getBoundingClientRect().height;
      if (animation) { animation.onfinish = null; animation.cancel(); }
      targetOpen = !targetOpen;
      item.open = true;
      const end = targetOpen ? item.getBoundingClientRect().height : summary.getBoundingClientRect().height;
      item.style.overflow = 'hidden';
      animation = item.animate([{ height: start + 'px' }, { height: end + 'px' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
      animation.onfinish = () => { item.open = targetOpen; item.style.overflow = ''; animation = null; };
    });
  });
  const data = document.getElementById('roModels');
  if (!data) return;
  const models = JSON.parse(data.textContent);
  const buttons = [...document.querySelectorAll('[data-ro-model]')];
  const image = document.getElementById('roMainImage');
  const full = document.getElementById('roFullImage');
  const dialog = document.getElementById('roImageDialog');
  const overview = document.getElementById('roOverview');
  const status = document.getElementById('roSelectionStatus');
  const initialSrc = image.getAttribute('src'), initialAlt = image.alt;
  let selected = null;
  function select(q, writeHistory = false) {
    const model = models.find(m => m.q === q);
    selected = model ? q : null;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.roModel) === selected)));
    overview.hidden = !!model;
    models.forEach(m => { document.getElementById('roSpec' + m.q).hidden = m.q !== selected; });
    const src = model ? '../../../assets/images/products/ro-water-system/' + model.image : initialSrc;
    const alt = model ? `เครื่องกรองน้ำดื่ม RO Sunnex ${q}Q (${q} คิว) กำลังผลิต ${model.flow.toLocaleString('en-US')} ลิตรต่อวัน` : initialAlt;
    image.src = src; image.alt = alt; full.src = src; full.alt = alt + ' แบบเต็ม';
    status.textContent = model ? `กำลังดูรุ่น ${q}Q / ${q} คิว · กดรุ่นเดิมอีกครั้งเพื่อกลับภาพหลัก` : '';
    if (!reduced.matches && image.animate) image.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    if (writeHistory) {
      const suffix = model ? '#' + q + 'q' : '';
      history.pushState(null, '', location.pathname + location.search + suffix);
    }
  }
  function fromHash() {
    const match = location.hash.match(/^#(3|6|12|24)q$/i);
    select(match ? Number(match[1]) : null);
  }
  buttons.forEach(b => b.addEventListener('click', () => {
    const q = Number(b.dataset.roModel); select(selected === q ? null : q, true);
  }));
  document.querySelectorAll('[data-ro-link]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); select(Number(a.dataset.roLink), true);
    document.querySelector('.rv-hero').scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
  }));
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('popstate', fromHash);
  window.openProductImage = () => dialog.showModal();
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  fromHash();
})();
