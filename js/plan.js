/* Plot plan: pins on the aerial photo, built from the price-list rows and the sold line in
   the HTML (data-plot, data-status, data-offer, data-area, data-price, data-x, data-y).
   The list and the pins highlight each other; choosing a plot writes a short note and
   tells the rest of the page via a `plot:select` event. */
(() => {
  const root = document.querySelector('[data-plan-print]');
  if (!root) return;
  const t = (key, fallback) => (window.i18n && window.i18n.t(key)) || fallback;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const OFFER = { land: 'Zeme', 'house-25': 'Zeme un māja 25 m²', 'house-60': 'Zeme un māja 60 m²', 'house-84': 'Zeme un māja 84 m²' };
  const offerLabel = (o) => t(`offer-${o}`, OFFER[o]);

  const map = root.querySelector('.sheet-map');
  const note = root.querySelector('.sheet-note');
  const sources = [...root.querySelectorAll('.pricelist li[data-plot], .sold-line [data-plot]')];
  const plots = sources.map((el) => ({
    id: el.dataset.plot,
    status: el.dataset.status,
    offer: el.dataset.offer,
    area: Number(el.dataset.area),
    price: el.dataset.price ? Number(el.dataset.price) : null,
    x: Number(el.dataset.x),
    y: Number(el.dataset.y),
  }));
  const byId = new Map(plots.map((p) => [p.id, p]));

  // The wrapper is the visible box; on phones it crops nothing and pins the plan (styles-mobile.css)
  const scroller = document.createElement('div');
  scroller.className = 'sheet-scroll';
  map.before(scroller);
  scroller.appendChild(map);
  const legend = document.createElement('p');
  legend.className = 'sheet-legend';
  scroller.appendChild(legend);
  const renderLegend = () => {
    const reserved = plots.some((p) => p.status === 'reserved')
      ? `<span class="r"><i></i>${t('legend-reserved', 'rezervēts')}</span>` : '';
    legend.innerHTML = `<span class="a"><i></i>${t('legend-free', 'brīvs')}</span>${reserved}<span class="s"><i></i>${t('legend-sold', 'pārdots')}</span>`;
  };

  // Reserved rows keep their place in the list but show their status instead of a price
  const renderRows = () => {
    root.querySelectorAll('.pricelist li[data-status="reserved"] .price').forEach((el) => { el.textContent = t('status-reserved', 'Rezervēts'); });
  };

  const pins = new Map();
  plots.forEach((p, k) => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = `pin ${p.status}`;
    pin.dataset.plot = p.id;
    pin.style.left = `${p.x * 100}%`;
    pin.style.top = `${p.y * 100}%`;
    pin.style.setProperty('--k', k);
    pin.textContent = p.id;
    map.appendChild(pin);
    pins.set(p.id, pin);
  });
  const labelPins = () => pins.forEach((pin, id) => {
    const s = byId.get(id).status;
    pin.setAttribute('aria-label', `Jūras iela ${id}, ${t(`status-${s}`, { available: 'Pieejams', reserved: 'Rezervēts', sold: 'Pārdots' }[s])}`);
  });

  // Elements in the list and sold line that point at each plot
  const triggers = new Map();
  sources.forEach((el) => triggers.set(el.dataset.plot, el.matches('li') ? el.querySelector('button') : el));

  let current = null;
  const renderNote = () => {
    const p = current;
    if (!p) return;
    const head = `<p class="note-addr">Jūras iela ${p.id}</p>`;
    if (p.status === 'available') {
      const subject = encodeURIComponent(`Jūrasmala, Jūras iela ${p.id}`);
      note.innerHTML = `${head}<p>${offerLabel(p.offer)}, ${t('note-plot', 'zemes gabals')} ${fmt(p.area)} m², <span class="amber">${fmt(p.price)} EUR</span>.</p>`
        + `<p><a class="link" href="mailto:kristine@kilupa.lv?subject=${subject}">${t('request-viewing', 'Pieteikt apskati')}</a> ${t('note-or-call', 'vai zvaniet')} <a class="link" href="tel:+37120440777">+371 2044 0777</a></p>`;
    } else {
      const status = p.status === 'reserved' ? t('note-reserved', 'Šis gabals ir rezervēts.') : t('note-sold', 'Šis gabals jau ir pārdots.');
      note.innerHTML = `${head}<p>${offerLabel(p.offer)}, ${fmt(p.area)} m². ${status}</p>`;
    }
  };
  const select = (id) => {
    current = byId.get(id);
    pins.forEach((pin, k) => pin.classList.toggle('selected', k === id));
    triggers.forEach((el, k) => el.setAttribute('aria-pressed', String(k === id)));
    renderNote();
    const { x, y, ...detail } = current;
    root.selectedPlot = detail;
    document.dispatchEvent(new CustomEvent('plot:select', { detail }));
  };
  const hot = (id, on) => {
    pins.get(id).classList.toggle('hot', on);
    triggers.get(id).classList.toggle('hot', on);
  };
  for (const [id, el] of [...pins, ...triggers]) {
    el.addEventListener('click', () => select(id));
    ['pointerenter', 'focus'].forEach((ev) => el.addEventListener(ev, () => hot(id, true)));
    ['pointerleave', 'blur'].forEach((ev) => el.addEventListener(ev, () => hot(id, false)));
  }

  const renderAll = () => { renderLegend(); renderRows(); labelPins(); renderNote(); };
  document.addEventListener('site:translated', renderAll);
  renderAll();
  const first = plots.find((p) => p.status === 'available');
  if (first) select(first.id);

  // Pins arrive in a quick cascade the first time the plan is seen
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting) { map.classList.add('in'); obs.disconnect(); }
  }, { threshold: 0.35 }).observe(scroller);
})();
