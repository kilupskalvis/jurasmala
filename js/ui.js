/* Phone menu, swipe strip counters and the photo lightbox. */
(() => {
  // Labels come from js/i18n.js when it is present; Latvian is the fallback.
  const t = (key, fallback) => (window.i18n && window.i18n.t(key)) || fallback;

  /* Menu: opened from the top label. Closes on a link, Escape or "Aizvērt", and returns
     focus to the label. */
  const menu = document.getElementById('menu');
  if (menu) {
    const openers = [...document.querySelectorAll('.menu-btn')];
    let opener = null;
    const setMenu = (open, from) => {
      menu.classList.toggle('open', open);
      openers.forEach((b) => b.setAttribute('aria-expanded', String(open)));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        opener = from;
        menu.querySelector('ol a').focus();
      } else if (opener) {
        opener.focus({ preventScroll: true });
      }
    };
    openers.forEach((b) => b.addEventListener('click', () => setMenu(true, b)));
    menu.querySelector('[data-menu-close]').addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('ol a, .contacts a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });
  }

  /* Phone menu label: transparent over the opening photo, on a dark backing once the
     opening has scrolled away and the label sits over the page. */
  const topBtn = document.querySelector('.menu-btn');
  if (topBtn) {
    const stage = document.querySelector('[data-stage]');
    const onScroll = () => {
      const bottom = stage ? stage.getBoundingClientRect().bottom : 0;
      topBtn.classList.toggle('solid', bottom < innerHeight * 0.15);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
  }

  /* Swipe strips: a counter and a progress line under each, following the scroll position. */
  document.querySelectorAll('[data-strip]').forEach((strip) => {
    const items = [...strip.children];
    const count = document.createElement('p');
    count.className = 'strip-count';
    count.setAttribute('aria-hidden', 'true');
    count.innerHTML = `<span class="n">1</span><span class="bar"><i></i></span><span>${items.length}</span>`;
    strip.after(count);
    const n = count.querySelector('.n');
    const bar = count.querySelector('i');
    bar.style.setProperty('--w', `${100 / items.length}%`);
    const update = () => {
      const max = strip.scrollWidth - strip.clientWidth;
      const p = max > 0 ? strip.scrollLeft / max : 0;
      n.textContent = Math.round(p * (items.length - 1)) + 1;
      bar.style.setProperty('--x', `${p * (items.length - 1) * 100}%`);
    };
    strip.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  });

  /* Lightbox for any img[data-zoomable]. */
  const zoomables = [...document.querySelectorAll('img[data-zoomable]')];
  if (zoomables.length) {
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<button class="close" type="button"></button><img alt="">';
    document.body.appendChild(box);
    const big = box.querySelector('img');
    const close = box.querySelector('.close');
    const label = () => {
      close.textContent = t('lightbox-close', 'Aizvērt');
      box.setAttribute('aria-label', t('lightbox-label', 'Foto'));
    };
    label();
    document.addEventListener('site:translated', label);
    let last = null;
    const hide = () => { box.classList.remove('open'); if (last) last.focus(); };
    zoomables.forEach((img) => {
      img.tabIndex = 0;
      const show = () => { last = img; big.src = img.currentSrc || img.src; big.alt = img.alt; box.classList.add('open'); close.focus(); };
      img.addEventListener('click', show);
      img.addEventListener('keydown', (e) => { if (e.key === 'Enter') show(); });
    });
    box.addEventListener('click', (e) => { if (e.target !== big) hide(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.classList.contains('open')) hide(); });
  }
})();
