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
  const iconMarkup = (icon, extraClass = '') => {
    if (icon === 'chat_bubble') return `<span class="chat-glyph ${extraClass}" aria-hidden="true"></span>`;
    if (icon === 'devices') return `<span class="facility-glyph ${extraClass}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
    if (icon === 'policy') return `<span class="ui-glyph ${extraClass}" aria-hidden="true">◇</span>`;
    return `<span class="mi ${extraClass}" aria-hidden="true">${icon}</span>`;
  };

  function applyTranslations() {
    document.documentElement.lang = language;
    $('#currentLang').textContent = language.toUpperCase();
    $$('[data-i18n]').forEach((node) => {
      const value = tr(data.translations[node.dataset.i18n]);
      if (value == null) return;
      if (value.includes('<br>')) node.innerHTML = value;
      else node.textContent = value;
    });
    $$('[data-i18n-placeholder]').forEach((node) => {
      const value = tr(data.translations[node.dataset.i18nPlaceholder]);
      if (value != null) node.placeholder = value;
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
    if (route === 'checkout') route = 'checkin';
    if (!document.querySelector(`[data-screen="${route}"]`)) route = 'home';
    currentRoute = route;
    $$('.screen').forEach((screen) => screen.classList.toggle('active', screen.dataset.screen === route));
    $$('.bottom-nav [data-route]').forEach((button) => button.classList.toggle('active', button.dataset.route === route));
    document.body.classList.toggle('is-home', route === 'home');
    document.body.classList.toggle('body-inner', route !== 'home');
    $('#topbar').classList.toggle('scrolled', route !== 'home');
    if (!options.fromHistory) history.pushState({ route }, '', location.pathname + location.search);
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
      return `<button type="button" data-route="${route}">${iconMarkup(icon)}<span>${text.replace(/<br>/g, ' ')}</span><span class="mi">chevron_right</span></button>`;
    }).join('');
  }

  function renderGuides() {
    $('#guideGrid').innerHTML = data.guideCards.map((card) => {
      const route = card.route === 'checkout' ? 'checkin' : card.route;
      return `<button type="button" class="guide-card ${card.color}" data-route="${route}">${iconMarkup(card.icon)}<strong>${tr(card.title)}</strong><small>${tr(card.text)}</small></button>`;
    }).join('');
  }

  function renderOta() {
    const platforms = [
      ['airbnb', 'Airbnb', 'airbnb.svg'], ['booking', 'Booking.com', 'booking-com.svg'], ['agoda', 'Agoda', 'agoda.svg'], ['trip', 'Trip.com', 'trip-com.svg']
    ];
    $('#otaGrid').innerHTML = platforms.map(([key, name, logo]) => {
      const ready = Boolean(config.otaLinks[key]);
      return `<button type="button" class="ota-button ${ready ? 'ready' : ''}" data-ota="${key}" aria-label="${name} ${ready ? 'OPEN' : 'COMING SOON'}"><img src="/assets/images/platforms/${logo}" alt="${name}"><span class="ota-status">${ready ? 'OPEN' : 'COMING SOON'}</span></button>`;
    }).join('');
  }

  function renderGallery(filter = 'all') {
    lightboxItems = data.gallery.filter((item) => filter === 'all' || item[1] === filter);
    $('#galleryGrid').innerHTML = lightboxItems.map((item, index) => `<button class="gallery-item" type="button" data-lightbox-index="${index}" aria-label="${tr(item[2])}"><img src="/assets/images/${item[0]}" alt="${tr(item[2])}" loading="lazy"></button>`).join('');
  }

  function renderSearchResults(query) {
    const target = $('#conciergeResults');
    const normalized = String(query || '').trim().toLocaleLowerCase(language);
    if (!normalized) {
      target.innerHTML = '';
      return;
    }
    const routeKeywords = {
      checkin: '체크인 입실 도어락 arrival entrance luggage 入住 チェックイン',
      checkout: '체크아웃 퇴실 departure trash towel 退房 チェックアウト',
      wifi: 'wifi wi-fi 인터넷 비밀번호 password network 无线 ネット',
      transport: '교통 위치 주소 지하철 역 공항 주차 map subway airport parking 地铁 アクセス',
      rules: '규칙 금연 소음 파티 취사 smoking quiet party rule 规则 ルール',
      appliances: '가전 시설 tv 에어컨 세탁기 전자레인지 인덕션 appliance laundry climate 设备 家電',
      gallery: '사진 객실 공간 침실 gallery room photo 房间 写真',
      contact: '문의 호스트 도움 연락 contact host help 联系 問い合わせ'
    };
    const results = data.guideCards.filter((card) => {
      const text = [card.route, tr(card.title), tr(card.text), routeKeywords[card.route] || ''].join(' ').toLocaleLowerCase(language);
      return normalized.split(/\s+/).every((token) => text.includes(token));
    }).slice(0, 4);
    if (!results.length) {
      target.innerHTML = `<button type="button" data-route="contact"><strong>${tr(data.translations.searchNoResult)}</strong><small>${tr(data.translations.searchContact)}</small></button>`;
      return;
    }
    target.innerHTML = results.map((card) => `<button type="button" data-route="${card.route}"><strong>${tr(card.title)}</strong><small>${tr(card.text)}</small></button>`).join('');
  }

  function contentCard(item) {
    if (item.type === 'notice') return `<article class="content-card notice"><h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'steps') return `<article class="content-card"><h2>${tr(item.title)}</h2><ol class="steps-list">${item.items.map((entry) => `<li>${tr(entry)}</li>`).join('')}</ol></article>`;
    if (item.type === 'photo') return `<article class="content-card photo-card"><img src="/assets/images/${item.image}" alt="${tr(item.title)}" loading="lazy"><h2>${tr(item.title)}</h2></article>`;
    if (item.type === 'card') return `<article class="content-card">${iconMarkup(item.icon, 'card-icon')}<h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'wifi') return `<article class="content-card wifi-card"><h2>${item.title}</h2><p>${tr(item.label)}</p><div class="wifi-row"><code>${item.password}</code><button class="copy-button" type="button" data-copy="${item.password}">${language === 'ko' ? '복사' : 'COPY'}</button></div></article>`;
    if (item.type === 'destination') return `<article class="content-card"><span class="mi card-icon">location_on</span><h2>${item.title}</h2><p>${tr(item.address)}</p></article>`;
    if (item.type === 'actions') return `<div class="map-actions"><a href="${config.maps.naver}" target="_blank" rel="noopener noreferrer">NAVER MAP <span class="mi">north_east</span></a><a href="${config.maps.google}" target="_blank" rel="noopener noreferrer">GOOGLE MAP <span class="mi">north_east</span></a></div>`;
    if (item.type === 'rules') return `<div class="rules-grid">${item.items.map(([icon, title, text]) => `<article class="rule-item"><span class="mi">${icon}</span><div><strong>${tr(title)}</strong><p>${tr(text)}</p></div></article>`).join('')}</div>`;
    return '';
  }

  function renderStayFlow() {
    const target = $('#checkinContent');
    if (!target) return;
    target.innerHTML = `
      <article class="stay-flow-overview">
        <span class="mi">schedule</span>
        <div><small>${tr(data.translations.stayTimes)}</small><strong>${tr(data.translations.stayTimesValue)}</strong></div>
      </article>
      <section class="stay-flow-group">
        <header><span class="mi">login</span><div><small>SELF CHECK-IN</small><h2>${tr(data.translations.selfCheckin)}</h2></div></header>
        <div class="stay-flow-content">${data.content.checkin.map(contentCard).join('')}</div>
      </section>
      <section class="stay-flow-group">
        <header><span class="mi">logout</span><div><small>DEPARTURE</small><h2>${tr(data.translations.departure)}</h2></div></header>
        <div class="stay-flow-content">${data.content.checkout.map(contentCard).join('')}</div>
      </section>`;
  }

  function renderWifi() {
    const target = $('#wifiContent');
    if (!target) return;
    const wifiItems = data.content.wifi.filter((item) => item.type === 'wifi');
    const otherItems = data.content.wifi.filter((item) => item.type !== 'wifi');
    target.innerHTML = `
      <section class="wifi-network-section">
        <h2>${tr(data.translations.wifiNetwork)}</h2>
        <div class="wifi-network-grid">${wifiItems.map((item) => `<article class="wifi-network-card"><span class="mi">wifi</span><div><small>${tr(item.label)}</small><strong>${item.title}</strong></div><code>${item.password}</code><button class="copy-button" type="button" data-copy="${item.title} / ${item.password}">${tr(data.translations.wifiCopy)}</button></article>`).join('')}</div>
      </section>
      ${otherItems.map(contentCard).join('')}`;
  }

  function renderAllContent() {
    Object.entries(data.content).forEach(([name, items]) => {
      if (name === 'checkin' || name === 'checkout' || name === 'wifi') return;
      const target = $(`#${name}Content`);
      if (target) target.innerHTML = items.map(contentCard).join('');
    });
    renderStayFlow();
    renderWifi();
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
    $('#lightboxCaption').textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
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
    const heroShift = event.target.closest('[data-hero-shift]');
    if (heroShift && heroReady) setHero(heroIndex + Number(heroShift.dataset.heroShift));
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
  window.addEventListener('popstate', (event) => navigate(event.state?.route || 'home', { fromHistory: true, instant: true }));
  window.addEventListener('scroll', () => { if (currentRoute === 'home') $('#topbar').classList.toggle('scrolled', window.scrollY > 52); }, { passive: true });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); closeLanguage(); } });

  let touchStart = 0;
  $('#lightbox').addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  $('#lightbox').addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) shiftLightbox(distance > 0 ? -1 : 1); }, { passive: true });

  let heroReady = false;
  let heroIndex = 0;
  let heroPointerStart = null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHero(index) {
    heroIndex = (index + 2) % 2;
    $('#hero').classList.toggle('alt', heroIndex === 1);
    $$('.hero-counter span').forEach((node, itemIndex) => node.classList.toggle('active', itemIndex === heroIndex));
  }

  async function startHeroSequence() {
    const hero = $('#hero');
    const sources = ['/assets/images/hero-main-professional.webp', '/assets/images/hero-sub-professional.webp'];
    await Promise.all(sources.map((src) => {
      const image = new Image();
      image.src = src;
      return typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
    }));
    hero.classList.add('sequence-started');
    if (reduceMotion) {
      heroReady = true;
      hero.classList.add('ready');
      return;
    }
    setTimeout(() => setHero(1), 1920);
    setTimeout(() => setHero(0), 4220);
    setTimeout(() => {
      heroReady = true;
      hero.classList.add('ready');
    }, 5520);
  }

  function initIntroAndHero() {
    const intro = $('#brandIntro');
    if (reduceMotion || sessionStorage.getItem('staynemo-intro-seen') === '1') {
      intro.classList.add('hidden');
      startHeroSequence();
      return;
    }
    document.body.classList.add('intro-active');
    intro.classList.add('run');
    sessionStorage.setItem('staynemo-intro-seen', '1');
    setTimeout(() => intro.classList.add('leaving'), 3048);
    setTimeout(() => {
      intro.classList.add('hidden');
      document.body.classList.remove('intro-active');
      startHeroSequence();
    }, 3240);
  }

  function initMotion() {
    const selector = '.concierge-section,.intro,.quick-section,.stay-signature,.editorial-room-preview,.location-teaser,.home-guide-section,.ota-section,.content-card,.guide-card,.appliance-card,.rule-item';
    const mediaSelector = '.signature-photo,.editorial-mosaic button,.room-card,.gallery-item,.photo-card,.appliance-photo';
    const observer = 'IntersectionObserver' in window && !reduceMotion
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' })
      : null;
    const observe = (root = document) => {
      $$(selector, root).forEach((node, index) => {
        if (node.dataset.motionObserved === 'true') return;
        node.dataset.motionObserved = 'true';
        node.classList.add('motion-item');
        node.style.setProperty('--stagger', `${Math.min(index, 7) * 45}ms`);
        if (observer) observer.observe(node); else node.classList.add('is-visible');
      });
      $$(mediaSelector, root).forEach((node) => node.classList.add('motion-media'));
    };
    observe();
    new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length)) observe();
    }).observe($('#main'), { childList: true, subtree: true });
  }

  $('#conciergeForm').addEventListener('submit', (event) => {
    event.preventDefault();
    renderSearchResults($('#conciergeInput').value);
  });
  $('#conciergeInput').addEventListener('input', (event) => {
    if (!event.target.value.trim()) $('#conciergeResults').innerHTML = '';
  });
  $('#hero').addEventListener('pointerdown', (event) => { if (heroReady) heroPointerStart = event.clientX; });
  $('#hero').addEventListener('pointerup', (event) => {
    if (heroPointerStart == null) return;
    const delta = event.clientX - heroPointerStart;
    heroPointerStart = null;
    if (Math.abs(delta) >= 42) setHero(heroIndex + (delta < 0 ? 1 : -1));
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && !heroReady) startHeroSequence();
  });

  applyTranslations();
  renderOta();
  const initialRoute = history.state?.route || 'home';
  history.replaceState({ route: initialRoute }, '', location.pathname + location.search);
  navigate(initialRoute, { fromHistory: true, instant: true });
  initMotion();
  initIntroAndHero();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('/sw.js').catch(() => {});
})();
