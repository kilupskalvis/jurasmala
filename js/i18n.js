/* Languages: Latvian (default) and English.
   Latvian text lives in index.html: every translatable element carries data-i18n="<key>" and
   its Latvian copy is read from the page at start-up. English strings, and the strings that
   only scripts use, are below. The choice is remembered in localStorage under "lang". */
(() => {
  const STORAGE_KEY = 'lang';
  const LANGS = ['lv', 'en'];

  // Strings used only by scripts (bottom bar, plan note, legend, lightbox)
  const scriptLv = {
    'status-available': 'Pieejams',
    'status-reserved': 'Rezervēts',
    'status-sold': 'Pārdots',
    'request-viewing': 'Pieteikt apskati',
    'dock-free': '7 no 22 gabaliem brīvi',
    'lightbox-close': 'Aizvērt',
    'legend-free': 'brīvs',
    'legend-reserved': 'rezervēts',
    'legend-sold': 'pārdots',
    'note-plot': 'zemes gabals',
    'note-or-call': 'vai zvaniet',
    'note-reserved': 'Šis gabals ir rezervēts.',
    'note-sold': 'Šis gabals jau ir pārdots.',
  };

  const en = {
    'doc-title': 'Jūrasmala - Land for sale',
    skip: 'Skip to content',
    'nav-plots': 'Plots',
    'nav-houses': 'Houses',
    'nav-location': 'Location',
    'nav-contacts': 'Contacts',
    'nav-rooms': 'Rooms',
    menu: 'Menu',
    'menu-close': 'Close',
    call: 'Call',
    'walk-house': 'house',
    'walk-sea': 'sea',
    'hero-sub': 'A seaside village in Lembuži on the Vidzeme coast. Land and houses 400 metres from the sea.',
    'hero-count': '7 of 22',
    'hero-count-label': 'plots still free',
    'cap-village': 'The village',
    'cap-village-sub': '22 plots for detached and semi-detached houses. Electricity to every plot, a paved and lit street.',
    'cap-forest': 'Pine forest',
    'cap-forest-sub': 'Coastal pine woods.',
    'cap-path': 'The path to the sea',
    'cap-sea': '400 metres to the sea',
    'cap-sea-sub': 'An hour’s drive from Riga.',
    'about-lead': 'Lembuži village dates back to the 16th century. Almost every kind of beach is found here, along with cliffs and dunes.',
    'about-1': 'The coastal village "Jūrasmala" is in Lembuži, on the picturesque Vidzeme coast, known for its great variety of nature and landscapes and its rich cultural history.',
    'about-2': 'More and more people choose to live outside the city, closer to nature. The village plots are intended for detached or semi-detached houses. Every plot has an electricity connection, and the street is paved and lit.',
    'fig-coast-autumn': 'The coast in autumn',
    'fig-lembuzi': 'Lembuži from the sea',
    'fig-meadows': 'Meadows between the village and the sea',
    'fig-village-sea': 'The village from the sea',
    'location-text': 'Liepupe parish, Limbaži municipality. A beautiful, quiet place on the northern Vidzeme coast, not far from the capital.',
    'tt-station': 'Rail Baltica station "Tūja"',
    'tt-station-note': 'to be built',
    'tt-services': 'Schools, kindergartens, shops, medical care',
    'tt-riga': 'Riga',
    'tt-riga-time': '1 h',
    'plots-title': 'Plots for sale',
    'plots-text': 'Choose a plot on the plan or in the list. Yellow plots are still free.',
    'offer-land': 'Land',
    'offer-house-25': 'Land and house 25 m²',
    'offer-house-60': 'Land and house 60 m²',
    'offer-house-84': 'Land and house 84 m²',
    'sold-label': 'Sold:',
    'prices-valid': 'Prices valid from 30 September 2026.',
    'after-title': 'When built',
    'after-text': 'How the village will look once all the houses are built.',
    'tag-render': 'Visualisation',
    'houses-title': 'Land with a house',
    'houses-text': 'We build the houses ourselves, from design to garden. Houses of 25, 60 and 84 m² are available together with the land, from 105 000 to 198 000 EUR. We use certified, environmentally friendly materials and technologies.',
    'step-1': 'Design',
    'step-2': 'Structural calculations and estimates',
    'step-3': 'Construction',
    'step-4': 'Technical supervision at every stage',
    'step-5': 'Landscaping',
    'fig-house-terrace': 'Timber house with a terrace',
    'fig-house-meadow': 'Black timber house in a meadow',
    'fig-house-small': 'Small house with a terrace',
    'fig-terrace-fire': 'Terrace with a fire pit',
    'fig-render-house': 'House design, visualisation',
    'fig-render-two-storey': 'Two-storey house design, visualisation',
    'rooms-title': 'Rooms',
    'room-living-kitchen': 'Living room and kitchen',
    'room-kitchen': 'Kitchen',
    'room-bathroom': 'Bathroom',
    'room-dining': 'Kitchen and dining area',
    'room-living': 'Living area',
    'finance-lead': 'For buying a house you can apply for a loan at',
    'finance-or': 'or',
    'closing-title': 'Come and see the land in person.',
    'address-region': 'Liepupe parish, Limbaži municipality',
    'consent-text': 'We use cookies and third-party services to improve your browsing experience, analyze site traffic, and provide interactive content.',
    'consent-accept': 'Accept all',
    'consent-decline': 'Essential only',
    'status-available': 'Available',
    'status-reserved': 'Reserved',
    'status-sold': 'Sold',
    'request-viewing': 'Book a viewing',
    'dock-free': '7 of 22 plots free',
    'lightbox-close': 'Close',
    'legend-free': 'free',
    'legend-reserved': 'reserved',
    'legend-sold': 'sold',
    'note-plot': 'plot',
    'note-or-call': 'or call',
    'note-reserved': 'This plot is reserved.',
    'note-sold': 'This plot has already been sold.',
  };

  const elements = [...document.querySelectorAll('[data-i18n]')];
  const lv = { 'doc-title': document.title, ...scriptLv };
  elements.forEach((el) => { if (!(el.dataset.i18n in lv)) lv[el.dataset.i18n] = el.textContent; });
  const strings = { lv, en };

  const api = {
    lang: 'lv',
    strings,
    t: (key) => strings[api.lang][key] ?? lv[key] ?? '',
    setLang(lang) {
      if (!LANGS.includes(lang)) lang = 'lv';
      api.lang = lang;
      document.documentElement.lang = lang;
      document.title = api.t('doc-title');
      elements.forEach((el) => { el.textContent = api.t(el.dataset.i18n); });
      document.querySelectorAll('[data-set-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setLang === lang)));
      try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ }
      document.dispatchEvent(new CustomEvent('site:translated', { detail: { lang } }));
    },
  };
  window.i18n = api;

  document.querySelectorAll('[data-set-lang]').forEach((b) => b.addEventListener('click', () => api.setLang(b.dataset.setLang)));

  let stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch { /* private mode */ }
  if (stored === 'en') api.setLang('en');
  else if (stored && stored !== 'lv') {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* private mode */ }
  }
})();
