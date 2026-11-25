(() => {
  'use strict';
  const grid = document.getElementById('article-list');
  if (!grid || !window.fetch || !window.DOMParser) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let controller = null;
  let revision = 0;
  async function fade(frames, duration) {
    if (reduced.matches || !grid.animate) return;
    try { await grid.animate(frames, {duration, easing: 'ease-out'}).finished; } catch (_) {}
  }
  async function navigate(url, push) {
    const ownRevision = ++revision;
    if (controller) controller.abort();
    controller = new AbortController();
    grid.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(url, {signal: controller.signal, credentials: 'same-origin'});
      if (!response.ok) throw new Error('Page unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const nextGrid = doc.getElementById('article-list');
      const nextNav = doc.querySelector('.article-pagination');
      if (!nextGrid || !nextNav) throw new Error('Invalid article page');
      if (ownRevision !== revision) return;
      await fade([{opacity: 1}, {opacity: 0}], 120);
      if (ownRevision !== revision) return;
      grid.replaceChildren(...Array.from(nextGrid.children));
      document.querySelector('.article-pagination').replaceWith(nextNav);
      document.title = doc.title;
      ['link[rel="canonical"]', 'meta[property="og:url"]', 'meta[property="og:title"]', 'meta[name="twitter:title"]'].forEach(selector => {
        const original = document.querySelector(selector);
        const replacement = doc.querySelector(selector);
        if (original && replacement) original.replaceWith(replacement);
      });
      if (push) history.pushState({articlePage: true}, '', url);
      const top = grid.getBoundingClientRect().top + window.scrollY - 96;
      if (window.scrollY > top + 8) window.scrollTo({top: Math.max(0, top), behavior: reduced.matches ? 'instant' : 'smooth'});
      grid.focus({preventScroll: true});
      await fade([{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'translateY(0)'}], 220);
    } catch (error) {
      if (error.name !== 'AbortError' && ownRevision === revision) window.location.assign(url);
    } finally {
      if (ownRevision === revision) grid.removeAttribute('aria-busy');
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('.article-pagination a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    if (url.pathname === location.pathname) return;
    navigate(url.href, true);
  });
  window.addEventListener('popstate', () => navigate(location.href, false));
})();
