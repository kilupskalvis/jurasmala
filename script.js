/* ============================================================
   JŪRASMALA — Site JavaScript
   Vanilla JS. No frameworks. GitHub Pages compatible.
   ============================================================ */

/* --- Translations --- */
const translations = {
  lv: {
    'nav-about': 'Par mums',
    'nav-location': 'Lokācija',
    'nav-construction': 'Būvniecība',
    'nav-rooms': 'Telpu galerija',
    'nav-plans': 'Zemes plāns',
    'nav-gallery': 'Galerija',
    'nav-contacts': 'Kontakti',
    'hero-tagline': 'Jūrasmala',
    'hero-subtitle': 'Tava sapņu māja Vidzemes jūrmalā',
    'about-text': 'Piejūras ciemats "Jūrasmala" atrodas Lembužos gleznainajā Vidzemes jūrmalas piekrastē, kurai raksturīga īpaši liela dabas un ainavu daudzveidība, kā arī bagāta kultūrvēsture. Šeit sastopamas gandrīz visu iespējamo tipu pludmales, stāvkrasti un kāpas. Lembužciema pirmsākumi meklējami vēl tālajā 16. gadsimtā. Ciemats atrodas stundas braucienā no Rīgas, 400 metrus no jūras. Arvien vairāk cilvēki ikdienas dzīvesvietu izvēlas ārpus pilsētas tuvāk dabai – klusumā un harmonijā, lieliska vieta, kur baudīt dabu un smelties enerģiju. Ciemata zemesgabali paredzēti privātmāju vai dvīņu māju apbūvei. Ciemata iedzīvotāju ērtībām izbūvēts elektrības pieslēgums katram zemes gabalam, kā arī asfaltēta un apgaismota iela.',
    'location-title': 'Lokācija',
    'location-text': 'Īpašums atrodas Liepupes pagastā, Limbažu novadā, ciematā Lembužos. Šī ir lieliska vieta, kur skaisti un klusi dzīvot, nav tālu no galvaspilsētas pasakainajā Ziemeļvidzemes jūras piekrastē. Ciemats atrodas vien 15 līdz 40 minūšu brauciena attālumā no skolām, pirmskolas izglītības iestādēm, veikaliem, ārstniecības iestādēm un citiem svarīgiem objektiem. Vien 10 minūšu brauciena attālumā tiks izbūvēta Rail Baltic dzelzceļa stacija "Tūja".',
    'construction-title': 'Būvniecība',
    'construction-text': 'Piedāvājam pilnu pakalpojumu spektru sākot ar projektēšanu un beidzot ar teritorijas ainavisko labiekārtošanu. Veicam konstruktīvos aprēķinus un celtniecības tāmju sastādīšanu. Veicam tehnisko uzraudzību un kontroli katrā būvniecības etapā. Izmantojam sertificētus, videi draudzīgus ekoloģiskus materiālus un tehnoloģijas. Uz šo brīdi piedāvājumā 2 izstrādāti projekti mājām 50 kv. m., un 90 kv.m.',
    'rooms-title': 'Telpu galerija',
    'plans-title': 'Zemes plāns',
    'plots-heading': 'Zemes gabali',
    'gallery-title': 'Galerija',
    'room-1': 'Dzīvojamā istaba ar virtuvi',
    'room-3': 'Virtuve un ēdamzona',
    'room-4': 'Dzīvojamā zona',
    'room-5': 'Vannas istaba',
    'room-6': 'Virtuve',
    'financing-title': 'Māju finansējuma partneri',
    'filter-all': 'Visi',
    'filter-available': 'Pieejami',
    'filter-sold': 'Pārdoti',
    'filter-reserved': 'Rezervēti',
    'table-address': 'Adrese',
    'table-offer': 'Piedāvājums',
    'table-area': 'Platība, m²',
    'table-price': 'Cena, EUR',
    'table-availability': 'Pieejamība',
    'table-land': 'Zeme',
    'table-land-house-25': 'Zeme un māja (25m²)',
    'table-land-house-60': 'Zeme un māja (60m²)',
    'table-land-house-84': 'Zeme un māja (84m²)',
    'status-available': 'Pieejams',
    'status-sold': 'Pārdots',
    'status-reserved': 'Rezervēts',
    'loan-button': 'Pieteikties aizdevumam',
    'contact-title': 'Sazinieties ar mums',
    'phone-label': 'Tālrunis:',
    'email-label': 'E-pasts:',
    'social-title': 'Sekojiet mums',
    'copyright': 'Visas tiesības aizsargātas © 2026 jurasmala.lv',
    'map-load-text': 'Noklikšķiniet, lai ielādētu karti',
    'map-load-note': 'Tiks ielādēts Google Maps',
    'consent-title': 'Privātuma iestatījumi',
    'consent-text': 'Mēs izmantojam sīkdatnes un trešo pušu pakalpojumus, lai uzlabotu jūsu pārlūkošanas pieredzi, analizētu vietnes apmeklējumu un nodrošinātu interaktīvu saturu.',
    'consent-accept': 'Pieņemt visas',
    'consent-decline': 'Tikai nepieciešamās'
  },
  en: {
    'nav-about': 'About Us',
    'nav-location': 'Location',
    'nav-construction': 'Construction',
    'nav-rooms': 'Room Gallery',
    'nav-plans': 'Land Plans',
    'nav-gallery': 'Gallery',
    'nav-contacts': 'Contacts',
    'hero-tagline': 'Jūrasmala',
    'hero-subtitle': 'Your dream home on the Vidzeme coast',
    'about-text': 'The coastal village "Jūrasmala" is located in Lembuži on the picturesque Vidzeme coast, characterized by exceptionally diverse nature and landscapes, as well as rich cultural history. Here you can find almost all possible types of beaches, cliffs and dunes. The origins of Lembuži village date back to the distant 16th century. The village is located an hour\'s drive from Riga, 400 meters from the sea. More and more people choose to live outside the city closer to nature - in silence and harmony, a great place to enjoy nature and draw energy. The village plots are intended for private or twin house development. For the convenience of village residents, electricity connection has been built for each plot, as well as paved and illuminated street.',
    'location-title': 'Location',
    'location-text': 'The property is located in Liepupe parish, Limbaži municipality, in the village of Lembuži. This is a great place to live beautifully and quietly, not far from the capital in the fairytale Northern Vidzeme seashore. The village is only 15 to 40 minutes drive from schools, preschool educational institutions, shops, medical institutions and other important facilities. Only 10 minutes drive away, the Rail Baltic railway station "Tūja" will be built.',
    'construction-title': 'Construction',
    'construction-text': 'We offer a full range of services from design to landscape development of the territory. We perform structural calculations and construction estimate preparation. We provide technical supervision and control at each construction stage. We use certified, environmentally friendly ecological materials and technologies. Currently, we offer 2 developed projects for houses of 50 sq. m. and 90 sq. m.',
    'rooms-title': 'Room Gallery',
    'plans-title': 'Land Plan',
    'plots-heading': 'Land Plots',
    'gallery-title': 'Gallery',
    'room-1': 'Living room and kitchen',
    'room-3': 'Kitchen and dining area',
    'room-4': 'Living area',
    'room-5': 'Bathroom',
    'room-6': 'Kitchen',
    'financing-title': 'Home Financing Partners',
    'filter-all': 'All',
    'filter-available': 'Available',
    'filter-sold': 'Sold',
    'filter-reserved': 'Reserved',
    'table-address': 'Address',
    'table-offer': 'Offer',
    'table-area': 'Area, m²',
    'table-price': 'Price, EUR',
    'table-availability': 'Availability',
    'table-land': 'Land',
    'table-land-house-25': 'Land and house (25m²)',
    'table-land-house-60': 'Land and house (60m²)',
    'table-land-house-84': 'Land and house (84m²)',
    'status-available': 'Available',
    'status-sold': 'Sold',
    'status-reserved': 'Reserved',
    'loan-button': 'Apply for Loan',
    'contact-title': 'Contact Us',
    'phone-label': 'Phone:',
    'email-label': 'Email:',
    'social-title': 'Follow Us',
    'copyright': 'All rights reserved © 2026 jurasmala.lv',
    'map-load-text': 'Click to load map',
    'map-load-note': 'Google Maps will be loaded',
    'consent-title': 'Privacy Settings',
    'consent-text': 'We use cookies and third-party services to improve your browsing experience, analyze site traffic, and provide interactive content.',
    'consent-accept': 'Accept all',
    'consent-decline': 'Essential only'
  },
  ru: {
    'nav-about': 'О нас',
    'nav-location': 'Местоположение',
    'nav-construction': 'Строительство',
    'nav-rooms': 'Галерея комнат',
    'nav-plans': 'План земли',
    'nav-gallery': 'Галерея',
    'nav-contacts': 'Контакты',
    'hero-tagline': 'Юрасмала',
    'hero-subtitle': 'Дом вашей мечты на побережье Видземе',
    'about-text': 'Прибрежная деревня "Юрасмала" расположена в Лембужи на живописном побережье Видземе, которое характеризуется исключительно большим разнообразием природы и ландшафтов, а также богатой культурной историей. Здесь встречаются почти все возможные типы пляжей, утесы и дюны. Истоки деревни Лембужи восходят к далекому 16 веку. Деревня находится в часе езды от Риги, в 400 метрах от моря. Все больше людей выбирают повседневную жизнь за городом ближе к природе - в тишине и гармонии, отличное место, чтобы наслаждаться природой и черпать энергию. Участки деревни предназначены для застройки частными или двойными домами. Для удобства жителей деревни построено электроснабжение для каждого участка, а также асфальтированная и освещенная улица.',
    'location-title': 'Местоположение',
    'location-text': 'Недвижимость расположена в Лиепупской волости, Лимбажском крае, в деревне Лембужи. Это отличное место для красивой и тихой жизни, недалеко от столицы на сказочном северном побережье Видземе. Деревня находится всего в 15-40 минутах езды от школ, дошкольных учреждений, магазинов, медицинских учреждений и других важных объектов. Всего в 10 минутах езды будет построена железнодорожная станция Rail Baltic "Туя".',
    'construction-title': 'Строительство',
    'construction-text': 'Мы предлагаем полный спектр услуг от проектирования до ландшафтного благоустройства территории. Выполняем конструктивные расчеты и составление строительных смет. Осуществляем технический надзор и контроль на каждом этапе строительства. Используем сертифицированные, экологически чистые материалы и технологии. На данный момент в предложении 2 разработанных проекта домов 50 кв. м. и 90 кв. м.',
    'rooms-title': 'Галерея комнат',
    'plans-title': 'План земли',
    'plots-heading': 'Земельные участки',
    'gallery-title': 'Галерея',
    'room-1': 'Гостиная с кухней',
    'room-3': 'Кухня и столовая',
    'room-4': 'Жилая зона',
    'room-5': 'Ванная комната',
    'room-6': 'Кухня',
    'financing-title': 'Партнеры по финансированию домов',
    'filter-all': 'Все',
    'filter-available': 'Доступные',
    'filter-sold': 'Проданные',
    'filter-reserved': 'Забронированные',
    'table-address': 'Адрес',
    'table-offer': 'Предложение',
    'table-area': 'Площадь, м²',
    'table-price': 'Цена, EUR',
    'table-availability': 'Доступность',
    'table-land': 'Земля',
    'table-land-house-25': 'Земля и дом (25м²)',
    'table-land-house-60': 'Земля и дом (60м²)',
    'table-land-house-84': 'Земля и дом (84м²)',
    'status-available': 'Доступен',
    'status-sold': 'Продан',
    'status-reserved': 'Забронирован',
    'loan-button': 'Подать заявку на кредит',
    'contact-title': 'Свяжитесь с нами',
    'phone-label': 'Телефон:',
    'email-label': 'Email:',
    'social-title': 'Следите за нами',
    'copyright': 'Все права защищены © 2026 jurasmala.lv',
    'map-load-text': 'Нажмите, чтобы загрузить карту',
    'map-load-note': 'Будет загружен Google Maps',
    'consent-title': 'Настройки конфиденциальности',
    'consent-text': 'Мы используем файлы cookie и сторонние сервисы для улучшения вашего опыта просмотра, анализа посещаемости сайта и предоставления интерактивного контента.',
    'consent-accept': 'Принять все',
    'consent-decline': 'Только необходимые'
  }
};

/* --- Translation --- */
let currentLang = 'lv';

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.lv[key] || '';
}

function translatePage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  document.dispatchEvent(new CustomEvent('site:translated'));
}

/* --- Language Switcher (Desktop) --- */
function initLangSwitcher() {
  const btn = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  dropdown.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', () => {
      const lang = option.dataset.lang;
      translatePage(lang);
      document.querySelector('.lang-current').textContent = lang.toUpperCase();
      dropdown.querySelectorAll('.lang-option').forEach(o => o.setAttribute('aria-selected', 'false'));
      option.setAttribute('aria-selected', 'true');
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      updateMobileLangButtons(lang);
    });
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });
}

/* --- Mobile Nav --- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('mobileNavOverlay');
  if (!hamburger || !mobileNav || !overlay) return;

  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeNav();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
      }
    });
  });

  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      translatePage(lang);
      document.querySelector('.lang-current').textContent = lang.toUpperCase();
      updateMobileLangButtons(lang);
      document.querySelectorAll('.lang-option').forEach(o => {
        o.setAttribute('aria-selected', o.dataset.lang === lang ? 'true' : 'false');
      });
    });
  });
}

function updateMobileLangButtons(lang) {
  document.querySelectorAll('.mobile-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/* --- Sticky Header --- */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- Active Nav Tracking --- */
function initNavTracking() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-links a');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        let current = '';
        sections.forEach(section => {
          if (window.scrollY >= section.offsetTop - 120) {
            current = section.id;
          }
        });
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- Page Load Animation --- */
function initPageLoad() {
  const hero = document.querySelector('.hero');

  function showHero() {
    document.querySelectorAll('.anim-hero').forEach(el => {
      el.classList.add('visible');
    });
  }

  const img = new Image();
  img.src = 'data/coastal_image.webp';
  img.onload = () => {
    if (hero) hero.classList.add('hero-loaded');
    showHero();
  };

  if (img.complete) {
    if (hero) hero.classList.add('hero-loaded');
    showHero();
  }
}

/* --- Dynamic Copyright Year --- */
function updateCopyrightYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('[data-translate="copyright"]').forEach(el => {
    el.textContent = el.textContent.replace(/© \d{4}/, '© ' + year);
  });
}

/* --- Scroll Reveal (IntersectionObserver) --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Touch Swipe --- */
function onSwipe(el, handler) {
  let startX = null;
  let startY = null;

  el.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  el.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      handler(dx < 0 ? 1 : -1);
    }
  });
}

/* --- Image Swap (fade out, preload, fade in) --- */
function swapImage(img, src, onSwap) {
  const token = (img._swapToken || 0) + 1;
  img._swapToken = token;
  img.classList.add('is-switching');

  const preload = new Image();
  preload.src = src;
  const ready = preload.decode ? preload.decode().catch(() => {}) : Promise.resolve();
  const fadedOut = new Promise(resolve => setTimeout(resolve, 220));

  Promise.all([ready, fadedOut]).then(() => {
    if (img._swapToken !== token) return;
    img.src = src;
    if (onSwap) onSwap();
    img.classList.remove('is-switching');
  });
}

/* --- Image Load Handling --- */
function initImageLoading() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    if (img.complete && img.naturalHeight > 0) {
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img-loaded'));
    }
  });
}

/* --- Map Click-to-Load --- */
function initMap() {
  const placeholder = document.getElementById('mapPlaceholder');
  if (!placeholder) return;

  placeholder.addEventListener('click', loadMap);
  placeholder.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      loadMap();
    }
  });
}

/* --- Lightbox --- */
let openLightbox = () => {};

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const img = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav--next');
  const captionText = lightbox.querySelector('.lightbox-caption-text');
  const counter = lightbox.querySelector('.lightbox-counter');
  if (!img || !closeBtn || !prevBtn || !nextBtn || !captionText || !counter) return;

  let items = [];
  let index = 0;
  let triggerElement = null;
  let closeTimer = null;

  function updateMeta() {
    const item = items[index];
    img.alt = item.alt;
    captionText.textContent = item.alt;
    counter.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
  }

  function step(delta) {
    if (items.length < 2) return;
    index = (index + delta + items.length) % items.length;
    swapImage(img, items[index].src, updateMeta);
  }

  openLightbox = (list, start, trigger) => {
    items = list;
    index = Math.max(0, start);
    triggerElement = trigger || null;
    clearTimeout(closeTimer);

    const multiple = items.length > 1;
    prevBtn.hidden = !multiple;
    nextBtn.hidden = !multiple;

    img._swapToken = (img._swapToken || 0) + 1;
    img.classList.remove('is-switching');
    img.src = items[index].src;
    updateMeta();

    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  function closeLightbox() {
    lightbox.classList.remove('active');
    closeTimer = setTimeout(() => {
      lightbox.hidden = true;
      img.removeAttribute('src');
      document.body.style.overflow = '';
      if (triggerElement) {
        triggerElement.focus();
        triggerElement = null;
      }
    }, 300);
  }

  // Images open together with the rest of their section (data-group)
  document.querySelectorAll('.lightbox-trigger').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');

    const open = () => {
      const group = el.dataset.group;
      const members = group
        ? [...document.querySelectorAll('.lightbox-trigger[data-group="' + group + '"]')]
        : [el];
      openLightbox(
        members.map(m => ({ src: m.currentSrc || m.src, alt: m.alt })),
        members.indexOf(el),
        el
      );
    };

    el.addEventListener('click', open);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  onSwipe(lightbox, step);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Keep focus inside the dialog
  lightbox.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const focusable = [closeBtn, prevBtn, nextBtn].filter(b => !b.hidden);
    const i = focusable.indexOf(document.activeElement);
    const next = e.shiftKey
      ? (i - 1 + focusable.length) % focusable.length
      : (i + 1) % focusable.length;
    focusable[next].focus();
  });
}

/* --- Plot Table Filter --- */
function initPlotFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const table = document.getElementById('plotsTable');
  if (!tabs.length || !table) return;
  const rows = table.querySelectorAll('tbody tr[data-status]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');

      const filter = tab.dataset.filter;
      rows.forEach(row => {
        const status = row.dataset.status;
        const show = filter === 'all' || status === filter;
        row.classList.toggle('filter-hidden', !show);
      });
    });

    tab.addEventListener('keydown', e => {
      const tabsArray = [...tabs];
      const idx = tabsArray.indexOf(tab);
      let nextIdx = idx;

      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabsArray.length;
      else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabsArray.length) % tabsArray.length;
      else return;

      e.preventDefault();
      tabsArray[nextIdx].focus();
      tabsArray[nextIdx].click();
    });
  });
}

/* --- Room Gallery (stage + thumbnails) --- */
function initRoomStage() {
  const stage = document.getElementById('roomStage');
  const img = document.getElementById('roomStageImg');
  const caption = document.getElementById('roomStageCaption');
  const indexEl = document.getElementById('roomIndex');
  const prev = document.getElementById('roomPrev');
  const next = document.getElementById('roomNext');
  const thumbs = [...document.querySelectorAll('.room-thumb')];
  if (!stage || !img || !caption || !indexEl || !prev || !next || !thumbs.length) return;

  let current = 0;

  function show(i) {
    const target = (i + thumbs.length) % thumbs.length;
    if (target === current) return;
    current = target;
    const thumb = thumbs[current];

    thumbs.forEach((b, j) => b.setAttribute('aria-current', j === current ? 'true' : 'false'));
    indexEl.textContent = current + 1;

    // Keep the active thumbnail in view when the rail scrolls (mobile)
    const rail = thumb.parentElement;
    if (rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({
        left: thumb.offsetLeft - (rail.clientWidth - thumb.clientWidth) / 2,
        behavior: 'smooth'
      });
    }

    swapImage(img, thumb.dataset.src, () => {
      img.width = thumb.dataset.width;
      img.height = thumb.dataset.height;
      caption.setAttribute('data-translate', thumb.dataset.caption);
      caption.textContent = t(thumb.dataset.caption);
      img.alt = caption.textContent;
    });
  }

  function openCurrent() {
    openLightbox(
      thumbs.map(b => ({ src: b.dataset.src, alt: t(b.dataset.caption) })),
      current,
      img
    );
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => show(i));
  });

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  onSwipe(stage, delta => show(current + delta));

  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });

  img.setAttribute('role', 'button');
  img.setAttribute('tabindex', '0');
  img.addEventListener('click', openCurrent);
  img.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCurrent();
    }
  });

  document.addEventListener('site:translated', () => {
    img.alt = caption.textContent;
  });
}

/* --- Cookie Consent & Meta Pixel --- */
function loadMetaPixel() {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '634309711849349');
  fbq('track', 'PageView');
}

function loadMap() {
  var placeholder = document.getElementById('mapPlaceholder');
  if (!placeholder || placeholder.classList.contains('map-loaded')) return;
  placeholder.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4727.158869393929!2d24.3941950789476!3d57.4670815960261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1753264332454!5m2!1sen!2sus" width="100%" height="400" style="border:0; border-radius:3px;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  placeholder.classList.add('map-loaded');
}

function initCookieConsent() {
  var banner = document.getElementById('consentBanner');
  var acceptBtn = document.getElementById('consentAccept');
  var declineBtn = document.getElementById('consentDecline');
  if (!banner || !acceptBtn || !declineBtn) return;

  var consent = localStorage.getItem('cookie-consent');

  if (consent === 'accepted') {
    loadMetaPixel();
    loadMap();
    return;
  }

  if (consent === 'essential') {
    loadMap();
    return;
  }

  banner.classList.add('active');

  function hideBanner() {
    banner.classList.add('consent-banner--hiding');
    setTimeout(function() {
      banner.classList.remove('active');
      banner.classList.remove('consent-banner--hiding');
    }, 350);
  }

  acceptBtn.addEventListener('click', function() {
    localStorage.setItem('cookie-consent', 'accepted');
    hideBanner();
    loadMetaPixel();
    loadMap();
  });

  declineBtn.addEventListener('click', function() {
    localStorage.setItem('cookie-consent', 'essential');
    hideBanner();
    loadMap();
  });
}

/* --- Init All --- */
document.addEventListener('DOMContentLoaded', () => {
  updateMobileLangButtons('lv');
  initLangSwitcher();
  initMobileNav();
  initStickyHeader();
  initNavTracking();
  initPageLoad();
  initScrollReveal();
  initImageLoading();
  initMap();
  initCookieConsent();
  initLightbox();
  initPlotFilters();
  initRoomStage();
  updateCopyrightYear();
});
