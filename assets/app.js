(function () {
  'use strict';
  const data = window.STAY_NEMO_DATA;
  const config = window.STAY_NEMO_CONFIG;
  const supported = ['ko', 'en', 'ja', 'zh'];
  let language = supported.includes(localStorage.getItem('staynemo-language')) ? localStorage.getItem('staynemo-language') : 'ko';
  let currentRoute = 'home';
  let lightboxItems = [];
  let lightboxIndex = 0;
  let toastTimer;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const tr = (value) => value && typeof value === 'object' && supported.some((key) => key in value) ? (value[language] || value.ko) : value;

  function applyTranslations() {
    document.documentElement.lang = language;
    $('#currentLang').textContent = language.toUpperCase();
    $$('[data-i18n]').forEach((node) => {
      const value = tr(data.translations[node.dataset.i18n]);
      if (value == null) return;
      if (value.includes('<br>')) node.innerHTML = value;
      else node.textContent = value;
    });
    $$('.language-menu button').forEach((button) => button.classList.toggle('active', button.dataset.lang === language));
    renderDrawer();
    renderGuides();
    renderGallery($('.gallery-tabs [aria-selected=true]')?.dataset.gallery || 'all');
    renderAllContent();
    renderAppliances();
    renderOta();
  }

  function routeLabel(route) {
    const item = data.menu.find(([name]) => name === route);
    if (!item) return route;
    const label = item[2];
    return data.translations[label] ? tr(data.translations[label]) : label;
  }

  function navigate(route, options = {}) {
    if (!document.querySelector(`[data-screen="${route}"]`)) route = 'home';
    currentRoute = route;
    $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.dataset.screen === route));
    $$('.bottom-nav [data-route]').forEach((button) => button.classList.toggle('active', button.dataset.route === route));
    document.body.classList.toggle('is-home', route === 'home');
    document.body.classList.toggle('body-inner', route !== 'home');
    $('#topbar').classList.toggle('scrolled', route !== 'home');
    if (!options.fromHistory) history.pushState({ route }, '', route === 'home' ? location.pathname : `#${route}`);
    closeDrawer();
    closeLanguage();
    window.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
    document.title = route === 'home' ? 'STAY NEMO — Seoul Private Stay' : `${routeLabel(route).replace(/<br>/g, ' ')} — STAY NEMO`;
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => showToast(tr(data.translations.copied))).catch(() => showToast(text));
  }

  function renderDrawer() {
    $('#drawerNav').innerHTML = data.menu.map(([route, icon, label]) => {
      const text = data.translations[label] ? tr(data.translations[label]) : label;
      return `<button type="button" data-route="${route}"><span class="mi">${icon}</span><span>${text.replace(/<br>/g, ' ')}</span><span class="mi">chevron_right</span></button>`;
    }).join('');
  }

  function renderGuides() {
    $('#guideGrid').innerHTML = data.guideCards.map((card) => `<button type="button" class="guide-card ${card.color}" data-route="${card.route}"><span class="mi">${card.icon}</span><strong>${tr(card.title)}</strong><small>${tr(card.text)}</small></button>`).join('');
  }

  function renderOta() {
    const platforms = [
      ['airbnb', 'Airbnb'], ['booking', 'Booking.com'], ['agoda', 'Agoda'], ['trip', 'Trip.com']
    ];
    $('#otaGrid').innerHTML = platforms.map(([key, name]) => {
      const ready = Boolean(config.otaLinks[key]);
      return `<button type="button" class="ota-button ${ready ? 'ready' : ''}" data-ota="${key}"><span><span class="ota-name">${name}</span><span class="ota-status">${ready ? 'OPEN' : 'COMING SOON'}</span></span><span class="mi">${ready ? 'north_east' : 'schedule'}</span></button>`;
    }).join('');
  }

  function renderGallery(filter = 'all') {
    lightboxItems = data.gallery.filter((item) => filter === 'all' || item[1] === filter);
    $('#galleryGrid').innerHTML = lightboxItems.map((item, index) => `<button class="gallery-item" type="button" data-lightbox-index="${index}" aria-label="${tr(item[2])}"><img src="/assets/images/${item[0]}" alt="${tr(item[2])}" loading="lazy"></button>`).join('');
  }

  function contentCard(item) {
    if (item.type === 'notice') return `<article class="content-card notice"><h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'steps') return `<article class="content-card"><h2>${tr(item.title)}</h2><ol class="steps-list">${item.items.map((entry) => `<li>${tr(entry)}</li>`).join('')}</ol></article>`;
    if (item.type === 'photo') return `<article class="content-card photo-card"><img src="/assets/images/${item.image}" alt="${tr(item.title)}" loading="lazy"><h2>${tr(item.title)}</h2></article>`;
    if (item.type === 'card') return `<article class="content-card"><span class="mi card-icon">${item.icon}</span><h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'wifi') return `<article class="content-card wifi-card"><h2>${item.title}</h2><p>${tr(item.label)}</p><div class="wifi-row"><code>${item.password}</code><button class="copy-button" type="button" data-copy="${item.password}">${language === 'ko' ? '복사' : 'COPY'}</button></div></article>`;
    if (item.type === 'destination') return `<article class="content-card"><span class="mi card-icon">location_on</span><h2>${item.title}</h2><p>${tr(item.address)}</p></article>`;
    if (item.type === 'actions') return `<div class="map-actions"><a href="${config.maps.naver}" target="_blank" rel="noopener noreferrer">NAVER MAP <span class="mi">north_east</span></a><a href="${config.maps.google}" target="_blank" rel="noopener noreferrer">GOOGLE MAP <span class="mi">north_east</span></a></div>`;
    if (item.type === 'rules') return `<div class="rules-grid">${item.items.map(([icon, title, text]) => `<article class="rule-item"><span class="mi">${icon}</span><div><strong>${tr(title)}</strong><p>${tr(text)}</p></div></article>`).join('')}</div>`;
    return '';
  }

  function renderAllContent() {
    Object.entries(data.content).forEach(([name, items]) => {
      const target = $(`#${name}Content`);
      if (target) target.innerHTML = items.map(contentCard).join('');
    });
  }

  function renderAppliances() {
    $('#applianceList').innerHTML = data.appliances.map((item) => `<article class="appliance-card"><div class="appliance-photo"><img src="/assets/images/${item.image}" alt="${tr(item.title)}" loading="lazy"></div><div class="appliance-copy"><div class="appliance-title"><span class="mi">${item.icon}</span><div><h2>${tr(item.title)}</h2><small>${tr(item.meta)}</small></div></div><ol>${tr(item.steps).map((step) => `<li>${step}</li>`).join('')}</ol></div></article>`).join('');
  }

  function openDrawer() {
    const drawer = $('#drawer');
    $('#drawerBackdrop').hidden = false;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    $('.menu-trigger').setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.drawer-close').focus(), 40);
  }

  function closeDrawer() {
    const drawer = $('#drawer');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    $('.menu-trigger').setAttribute('aria-expanded', 'false');
    $('#drawerBackdrop').hidden = true;
    document.body.style.overflow = '';
  }

  function closeLanguage() {
    $('#languageMenu').classList.remove('open');
    $('.language-trigger').setAttribute('aria-expanded', 'false');
  }

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    $('#lightbox').showModal();
  }

  function updateLightbox() {
    const item = lightboxItems[lightboxIndex];
    $('#lightboxImage').src = `/assets/images/${item[0]}`;
    $('#lightboxImage').alt = tr(item[2]);
    $('#lightboxCaption').textContent = `${lightboxIndex + 1} / ${lightboxItems.length} · ${tr(item[2])}`;
  }

  function shiftLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    updateLightbox();
  }

  document.addEventListener('click', (event) => {
    const routeButton = event.target.closest('[data-route]');
    if (routeButton) {
      event.preventDefault();
      navigate(routeButton.dataset.route);
      return;
    }
    const scrollButton = event.target.closest('[data-scroll-target]');
    if (scrollButton) {
      $(`#${scrollButton.dataset.scrollTarget}`)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const languageButton = event.target.closest('[data-lang]');
    if (languageButton) {
      language = languageButton.dataset.lang;
      localStorage.setItem('staynemo-language', language);
      applyTranslations();
      closeLanguage();
      return;
    }
    const otaButton = event.target.closest('[data-ota]');
    if (otaButton) {
      const url = config.otaLinks[otaButton.dataset.ota];
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      else showToast(tr(data.translations.readySoon));
      return;
    }
    const copyButton = event.target.closest('[data-copy]');
    if (copyButton) {
      copyText(copyButton.dataset.copy);
      return;
    }
    const galleryTab = event.target.closest('[data-gallery]');
    if (galleryTab) {
      $$('.gallery-tabs button').forEach((button) => button.setAttribute('aria-selected', button === galleryTab ? 'true' : 'false'));
      renderGallery(galleryTab.dataset.gallery);
      return;
    }
    const lightboxButton = event.target.closest('[data-lightbox-index]');
    if (lightboxButton) openLightbox(Number(lightboxButton.dataset.lightboxIndex));
  });

  $('.menu-trigger').addEventListener('click', openDrawer);
  $('.drawer-close').addEventListener('click', closeDrawer);
  $('#drawerBackdrop').addEventListener('click', closeDrawer);
  $('.language-trigger').addEventListener('click', () => {
    const menu = $('#languageMenu');
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    $('.language-trigger').setAttribute('aria-expanded', String(open));
  });
  $('.lightbox-close').addEventListener('click', () => $('#lightbox').close());
  $('.lightbox-prev').addEventListener('click', () => shiftLightbox(-1));
  $('.lightbox-next').addEventListener('click', () => shiftLightbox(1));
  $('#lightbox').addEventListener('click', (event) => { if (event.target === $('#lightbox')) $('#lightbox').close(); });
  $('#lightbox').addEventListener('keydown', (event) => { if (event.key === 'ArrowLeft') shiftLightbox(-1); if (event.key === 'ArrowRight') shiftLightbox(1); });
  window.addEventListener('popstate', () => navigate((location.hash || '#home').slice(1), { fromHistory: true, instant: true }));
  window.addEventListener('scroll', () => { if (currentRoute === 'home') $('#topbar').classList.toggle('scrolled', window.scrollY > 52); }, { passive: true });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); closeLanguage(); } });

  let touchStart = 0;
  $('#lightbox').addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  $('#lightbox').addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) shiftLightbox(distance > 0 ? -1 : 1); }, { passive: true });

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => {
    if (currentRoute !== 'home') return;
    $('#hero').classList.toggle('alt');
    const alt = $('#hero').classList.contains('alt');
    $$('.hero-counter span').forEach((node, index) => node.classList.toggle('active', index === (alt ? 1 : 0)));
  }, 6200);

  applyTranslations();
  renderOta();
  navigate((location.hash || '#home').slice(1), { fromHistory: true, instant: true });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('/sw.js').catch(() => {});
})();
