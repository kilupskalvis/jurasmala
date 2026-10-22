/* Page motion: html.motion / is-loaded classes, one-shot reveals, scrubbed headings. */
(() => {
  const root = document.documentElement;
  root.classList.add('motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Stagger index for the load sequence
  document.querySelectorAll('[data-load-item]').forEach((el, i) => el.style.setProperty('--i', i));
  const markLoaded = () => requestAnimationFrame(() => root.classList.add('is-loaded'));
  if (document.readyState === 'complete') markLoaded();
  else addEventListener('load', markLoaded);

  if (reduced) return;

  // One-shot reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal], [data-reveal-image]').forEach((el) => io.observe(el));

  // Split scrubbed headings into words, keeping nested spans (e.g. .dim) intact
  const split = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        split(child);
      }
    });
  };
  const scrubbed = [...document.querySelectorAll('[data-reveal-lines]')];
  scrubbed.forEach(split);
  const parallax = [...document.querySelectorAll('[data-parallax]')];

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    scrubbed.forEach((el) => {
      const r = el.getBoundingClientRect();
      // 0 when the heading's top hits 90% of the viewport, 1 when it reaches 45%
      const p = Math.min(1, Math.max(0, (vh * 0.9 - r.top) / (vh * 0.45)));
      const words = el.querySelectorAll('.w');
      const n = words.length;
      words.forEach((w, i) => {
        // Each word starts clearing a little after the previous one
        const start = (i / n) * 0.75;
        const local = Math.min(1, Math.max(0, (p - start) / 0.25));
        w.style.setProperty('--o', (0.12 + 0.88 * local).toFixed(3));
        w.style.setProperty('--b', ((1 - local) * 6).toFixed(2) + 'px');
      });
    });
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const centre = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 roughly
      el.style.setProperty('--py', (-centre * r.height * 0.08 - r.height * 0.08) + 'px');
    });
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();
