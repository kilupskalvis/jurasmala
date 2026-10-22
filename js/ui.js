/* Phone menu, bottom bar, swipe strip counters and the photo lightbox. */
(() => {
  // Labels come from js/i18n.js when it is present; Latvian is the fallback.
  const t = (key, fallback) => (window.i18n && window.i18n.t(key)) || fallback;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  /* Menu: opened from the top label (on the opening) or the bottom bar. Closes on a link,
     Escape or "Aizvērt", and returns focus to whichever button opened it. */
  const menu = document.getElementById('menu');
  if (menu) {
    const openers = [...document.querySelectorAll('.menu-btn, .dock-menu')];
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

  /* Bottom bar: shown after the opening. In the plots section it carries the chosen plot
     and "Pieteikt apskati"; elsewhere it offers a call. */
  const dock = document.querySelector('.dock');
  if (dock) {
    const info = dock.querySelector('.dock-info');
    const cta = dock.querySelector('.dock-cta');
    const topBtn = document.querySelector('.menu-btn');
    const stage = document.querySelector('[data-stage]');
    const plots = document.getElementById('gabali');
    const plan = document.querySelector('[data-plan-print]');
    let chosen = (plan && plan.selectedPlot) || null;
    let inPlots = false;
    const render = () => {
      cta.hidden = false;
      if (inPlots && chosen) {
        const price = chosen.status === 'available'
          ? `<span>${fmt(chosen.price)} EUR</span>`
          : (chosen.status === 'reserved' ? t('status-reserved', 'Rezervēts') : t('status-sold', 'Pārdots'));
        info.innerHTML = `<b>Jūras iela ${chosen.id}</b>${price}`;
        if (chosen.status === 'available') {
          cta.textContent = t('request-viewing', 'Pieteikt apskati');
          cta.href = `mailto:kristine@kilupa.lv?subject=${encodeURIComponent(`Jūrasmala, Jūras iela ${chosen.id}`)}`;
        } else {
          cta.hidden = true;
        }
      } else {
        info.textContent = t('dock-free', '7 no 22 gabaliem brīvi');
        cta.textContent = t('call', 'Zvanīt');
        cta.href = 'tel:+37120440777';
      }
    };
    document.addEventListener('plot:select', (e) => { chosen = e.detail; render(); });
    document.addEventListener('site:translated', render);
    if (plots) new IntersectionObserver(([e]) => { inPlots = e.isIntersecting; render(); }, { rootMargin: '-35% 0px -35% 0px' }).observe(plots);
    const onScroll = () => {
      const past = !stage || stage.getBoundingClientRect().bottom < innerHeight * 0.85;
      dock.classList.toggle('on', past);
      if (topBtn) topBtn.classList.toggle('away', past);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();
    render();
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
    const label = () => { close.textContent = t('lightbox-close', 'Aizvērt'); };
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
