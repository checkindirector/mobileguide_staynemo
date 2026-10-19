(function () {
  'use strict';
  const data = window.STAY_NEMO_DATA;
  const config = window.STAY_NEMO_CONFIG;
  const supported = ['ko', 'en', 'ja', 'zh', 'zh-TW'];
  let language = supported.includes(localStorage.getItem('staynemo-language')) ? localStorage.getItem('staynemo-language') : 'ko';
  let currentRoute = 'home';
  let lightboxItems = [];
  let lightboxIndex = 0;
  let lightboxTitle = null;
  const galleryState = { gallery: 0 };
  let galleryCategory = 'common';
  const recommendationState = { nearby:{ category:'host', query:'' }, tours:{ category:'host', query:'' } };
  const bathroomFiles = new Set(['photographer-202608/R1-NEMO-toilet.webp', 'photographer-202608/R2-HADA-bathroom.webp', 'photographer-202608/R2-HADA-vanity.webp']);
  let toastTimer;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const tr = (value) => value && typeof value === 'object' && supported.some((key) => key in value) ? (value[language] || value.ko) : value;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const uiText = () => ({
    ko:{zoom:'크게 보기',previous:'이전 사진',next:'다음 사진',photoRoute:'사진 경로',swipeTap:'밀거나 눌러 보기',copy:'복사',open:'예약하기',coming:'준비 중',hostPick:'호스트 추천',guide:'안내',swipe:'밀어서 보기',image:'이미지',eunseong:'은성농원',rokgalbi:'록갈비',tvAria:'TV 리모컨 버튼 사용 안내',power:'전원',home:'홈 →',chooseOtt:'OTT 앱 선택',ott:'OTT 바로가기',direction:'방향키 · 확인',back:'뒤로가기',exit:'종료',tvNote:'이용 후 OTT 앱에서 로그아웃하고 TV를 꺼 주세요.',airconAria:'에어컨 조절기 버튼 사용 안내',mode:'모드 · 냉방/난방',temperature:'온도 + / −',fan:'바람 세기'},
    en:{zoom:'Open full size',previous:'Previous photo',next:'Next photo',photoRoute:'Photo route',swipeTap:'Swipe or tap',copy:'Copy',open:'Book now',coming:'Coming soon',hostPick:'Host’s pick',guide:'Guide',swipe:'Swipe',image:'Image',eunseong:'Eunseong Nongwon',rokgalbi:'Rokgalbi',tvAria:'TV remote button guide',power:'Power',home:'Home →',chooseOtt:'Choose an app',ott:'Streaming shortcut',direction:'Arrows · Select',back:'Back',exit:'Exit',tvNote:'Sign out of every streaming app, then turn off the TV.',airconAria:'Air-conditioner controller button guide',mode:'Mode · Cool/Heat',temperature:'Temp. + / −',fan:'Fan speed'},
    ja:{zoom:'拡大表示',previous:'前の写真',next:'次の写真',photoRoute:'写真ルート',swipeTap:'スワイプまたはタップ',copy:'コピー',open:'予約する',coming:'準備中',hostPick:'ホストおすすめ',guide:'ガイド',swipe:'スワイプ',image:'画像',eunseong:'ウンソン農園',rokgalbi:'ロクカルビ',tvAria:'TVリモコンのボタン案内',power:'電源',home:'ホーム →',chooseOtt:'アプリを選択',ott:'配信アプリショートカット',direction:'方向キー・決定',back:'戻る',exit:'終了',tvNote:'利用後は各配信アプリからログアウトし、TVの電源を切ってください。',airconAria:'エアコンコントローラーのボタン案内',mode:'モード・冷房/暖房',temperature:'温度 + / −',fan:'風量'},
    zh:{zoom:'放大查看',previous:'上一张照片',next:'下一张照片',photoRoute:'照片路线',swipeTap:'滑动或点击',copy:'复制',open:'立即预订',coming:'即将开放',hostPick:'房东推荐',guide:'指南',swipe:'滑动',image:'图片',eunseong:'Eunseong Nongwon',rokgalbi:'Rokgalbi',tvAria:'电视遥控器按键指南',power:'电源',home:'主页 →',chooseOtt:'选择应用',ott:'流媒体快捷键',direction:'方向键 · 确认',back:'返回',exit:'退出',tvNote:'使用后请退出所有流媒体应用账号并关闭电视。',airconAria:'空调控制器按键指南',mode:'模式 · 制冷/制热',temperature:'温度 + / −',fan:'风量'}, "zh-TW":{"zoom":"放大查看","previous":"上一張照片","next":"下一張照片","photoRoute":"照片路線","swipeTap":"滑動或點選","copy":"複製","open":"立即預訂","coming":"即將開放","hostPick":"房東推薦","guide":"指南","swipe":"滑動","image":"圖片","eunseong":"Eunseong Nongwon","rokgalbi":"Rokgalbi","tvAria":"電視遙控器按鍵指南","power":"電源","home":"首頁 →","chooseOtt":"選擇 App","ott":"串流快捷鍵","direction":"方向鍵 · 確認","back":"返回","exit":"退出","tvNote":"使用後請退出所有串流 App 帳號並關閉電視。","airconAria":"冷氣控制器按鍵指南","mode":"模式 · 冷房/暖房","temperature":"溫度 + / −","fan":"風量"}
  })[language];
  const iconMarkup = (icon, extraClass = '') => {
    if (icon === 'chat_bubble') return `<span class="chat-glyph ${extraClass}" aria-hidden="true"></span>`;
    if (icon === 'devices') return `<span class="facility-glyph ${extraClass}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
    if (icon === 'climate_power') return `<span class="climate-power-glyph ${extraClass}" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 6v16"/><path d="M15.5 12.5a15 15 0 1 0 17 0"/><path d="M9 37h7M32 37h7"/><path d="M13 31h22"/></svg></span>`;
    if (icon === 'policy') return `<span class="ui-glyph ${extraClass}" aria-hidden="true">◇</span>`;
    return `<span class="mi ${extraClass}" aria-hidden="true">${icon}</span>`;
  };

  function applyTranslations() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    $('#currentLang').textContent = ({ko:'KO', en:'EN', ja:'JA', zh:'CN', 'zh-TW':'TW'})[language];
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
    $$('[data-i18n-aria-label]').forEach((node) => {
      const value = tr(data.translations[node.dataset.i18nAriaLabel]);
      if (value != null) node.setAttribute('aria-label', value.replace(/<br>/g, ' '));
    });
    $$('[data-i18n-alt]').forEach((node) => {
      const value = tr(data.translations[node.dataset.i18nAlt]);
      if (value != null) node.alt = value.replace(/<br>/g, ' ');
    });
    const storyValues = $('.gallery-story-values');
    if (storyValues) storyValues.innerHTML = String(tr(data.translations.storyKeywords) || '').split('·').map((value) => `<span>${esc(value.trim())}</span>`).join('');
    $$('.language-menu button').forEach((button) => button.classList.toggle('active', button.dataset.lang === language));
    renderDrawer();
    renderGallery(galleryCategory);
    renderAllContent();
    renderAppliances();
    renderRecommendations('nearby');
    renderRecommendations('tours');
    renderOta();
    if ($('#lightbox').open) $('#lightbox').close();
    const heroCounter = $('.hero-counter');
    if (heroCounter) heroCounter.setAttribute('aria-label', `${uiText().image} ${heroIndex + 1} / ${$$('.hero-image', $('#hero')).length}`);
    document.title = currentRoute === 'home' ? 'STAY NEMO — Seoul Private Stay' : `${routeLabel(currentRoute).replace(/<br>/g, ' ')} — STAY NEMO`;
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
    const drawerRoutes = ['home', 'gallery', 'transport', 'checkin', 'wifi', 'appliances', 'rules', 'nearby', 'tours'];
    const drawerSubtitles = {
      home: { ko:'스테이 네모 처음 화면', en:'Return to the Stay NEMO home', ja:'STAY NEMOのホームへ', zh:'返回 Stay NEMO 首页', "zh-TW":"返回 Stay NEMO 首頁" },
      gallery: { ko:'다이닝·객실·욕실 사진', en:'Dining, rooms and bathrooms', ja:'ダイニング・客室・バスルーム', zh:'餐厅、客房与浴室照片', "zh-TW":"餐廳、客房與浴室照片" },
      transport: { ko:'공항과 역에서 숙소까지', en:'From the airport and station', ja:'空港・駅から宿まで', zh:'从机场和车站前往住宿', "zh-TW":"從機場和車站前往住宿" },
      checkin: { ko:'입실·퇴실 방법과 이용 안내', en:'Arrival, departure and stay guide', ja:'入室・退室と滞在案内', zh:'入住、退房与住宿指南', "zh-TW":"入住、退房與住宿指南" },
      wifi: { ko:'네트워크 정보와 비밀번호', en:'Network details and password', ja:'ネットワーク情報とパスワード', zh:'网络信息与密码', "zh-TW":"網路資訊與密碼" },
      appliances: { ko:'냉난방·주방·가전 사용법', en:'Heating, kitchen and appliance guide', ja:'冷暖房・キッチン・家電の使い方', zh:'冷暖气、厨房与家电用法', "zh-TW":"冷暖氣、廚房與家電用法" },
      nearby: { ko:'NEMO가 고른 주변 맛집', en:'Nearby tables selected by NEMO', ja:'NEMOが選ぶ周辺の店', zh:'NEMO 精选周边餐厅', "zh-TW":"NEMO 精選周邊餐廳" },
      tours: { ko:'서울에서 만나는 추천 20곳', en:'20 places to discover in Seoul', ja:'ソウルで出会うおすすめ20選', zh:'首尔推荐 20 处', "zh-TW":"首爾推薦 20 處" },
      rules: { ko:'함께 지키는 숙소 이용 안내', en:'A considerate guide for everyone', ja:'みんなで守る滞在ガイド', zh:'共同遵守的住宿指南', "zh-TW":"共同遵守的住宿指南" }
    };
    $('#drawerNav').innerHTML = drawerRoutes.map((route) => {
      const [, icon, label] = data.menu.find(([name]) => name === route);
      const text = data.translations[label] ? tr(data.translations[label]) : label;
      const subtitle = drawerSubtitles[route][language];
      const reliableIcon = route === 'tours' ? 'near_me' : icon;
      const drawerIcon = iconMarkup(reliableIcon, 'drawer-menu-icon');
      return `<button type="button" data-route="${route}">${drawerIcon}<span class="drawer-menu-copy"><strong>${text.replace(/<br>/g, ' ')}</strong><small>${subtitle}</small></span><span class="mi drawer-arrow" aria-hidden="true">chevron_right</span></button>`;
    }).join('');
  }

  function renderOta() {
    const labels = uiText();
    const platforms = [
      ['airbnb', 'Airbnb', 'airbnb-official.svg?v=44'], ['booking', 'Booking.com', 'booking-com-official.svg'], ['trip', 'Trip.com', 'trip-com-official.svg']
    ];
    $('#otaBookingGrid').innerHTML = platforms.map(([key, name, logo]) => {
      const ready = Boolean(config.otaLinks[key]);
      const status = ready ? labels.open : labels.coming;
      const tag = ready ? 'a' : 'button';
      const attributes = ready ? `href="${esc(config.otaLinks[key])}" target="_blank" rel="noopener noreferrer"` : 'type="button"';
      return `<${tag} ${attributes} class="ota-booking-button ${ready ? 'ready' : ''}" data-ota="${key}" aria-label="${name} · ${status}"><span class="ota-booking-logo"><img src="/assets/images/platforms/${logo}" alt=""></span><span class="ota-booking-copy"><strong>${name}</strong><small>${status}</small></span><span class="ota-booking-arrow" aria-hidden="true">↗</span></${tag}>`;
    }).join('');
  }

  function galleryItems(category = galleryCategory) {
    if (category === 'bathroom') return data.gallery.filter((item) => bathroomFiles.has(item[0]));
    return data.gallery.filter((item) => item[1] === category && !bathroomFiles.has(item[0]));
  }

  function bathroomTitle(file) {
    const photographerTitles = {
      'photographer-202608/R1-NEMO-toilet.webp': { ko:'NEMO 화장실', en:'NEMO bathroom', ja:'NEMO バスルーム', zh:'NEMO 浴室', "zh-TW":"NEMO 浴室" },
      'photographer-202608/R2-HADA-bathroom.webp': { ko:'HADA 화장실', en:'HADA bathroom', ja:'HADA バスルーム', zh:'HADA 浴室', "zh-TW":"HADA 浴室" },
      'photographer-202608/R2-HADA-vanity.webp': { ko:'HADA 화장대', en:'HADA vanity', ja:'HADA ドレッサー', zh:'HADA 梳妆台', "zh-TW":"HADA 梳妝檯" }
    };
    if (photographerTitles[file]) return tr(photographerTitles[file]);
    file = file.replace('-editorial.webp', '.webp');
    const titles = {
      'room-nemo-08.webp': { ko:'NEMO 세면 공간', en:'NEMO vanity', ja:'NEMO 洗面スペース', zh:'NEMO 洗漱区', "zh-TW":"NEMO 洗漱區" },
      'room-nemo-09.webp': { ko:'NEMO 샤워실 입구', en:'NEMO shower room entrance', ja:'NEMO シャワールーム入口', zh:'NEMO 淋浴间入口', "zh-TW":"NEMO 淋浴間入口" },
      'room-nemo-10.webp': { ko:'NEMO 화장실 입구', en:'NEMO toilet entrance', ja:'NEMO トイレ入口', zh:'NEMO 卫生间入口', "zh-TW":"NEMO 洗手間入口" },
      'room-nemo-11.webp': { ko:'NEMO 샤워실', en:'NEMO shower room', ja:'NEMO シャワールーム', zh:'NEMO 淋浴间', "zh-TW":"NEMO 淋浴間" },
      'room-nemo-12.webp': { ko:'NEMO 화장실', en:'NEMO toilet', ja:'NEMO トイレ', zh:'NEMO 卫生间', "zh-TW":"NEMO 洗手間" },
      'room-hada-05.webp': { ko:'HADA 욕실', en:'HADA bathroom', ja:'HADA バスルーム', zh:'HADA 浴室', "zh-TW":"HADA 浴室" },
      'room-hada-06.webp': { ko:'HADA 화장실 입구', en:'HADA bathroom entrance', ja:'HADA バスルーム入口', zh:'HADA 浴室入口', "zh-TW":"HADA 浴室入口" }
    };
    return tr(titles[file]);
  }

  function galleryItemTitle(item) {
    return galleryCategory === 'bathroom' ? bathroomTitle(item[0]) : tr(item[2]);
  }

  function animateGalleryImage(screen, direction) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const image = $('[data-gallery-main]', screen);
    const className = direction === 'prev' ? 'gallery-image-prev' : 'gallery-image-next';
    image.classList.remove('gallery-image-next', 'gallery-image-prev');
    void image.offsetWidth;
    image.classList.add(className);
    image.addEventListener('animationend', () => image.classList.remove(className), { once: true });
  }

  function selectGallery(index, animate = false) {
    const screen = $('[data-gallery-screen="gallery"]');
    const items = galleryItems();
    if (!screen || !items.length) return;
    const previous = galleryState.gallery || 0;
    const next = (index + items.length) % items.length;
    galleryState.gallery = next;
    $$('[data-gallery-index]', screen).forEach((button, buttonIndex) => {
      const active = buttonIndex === next;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    const item = items[next];
    const image = $('[data-gallery-main]', screen);
    image.src = `/assets/images/${item[0]}`;
    image.alt = galleryItemTitle(item);
    $('[data-gallery-title]', screen).textContent = galleryItemTitle(item);
    $('[data-gallery-count]', screen).textContent = `${next + 1} / ${items.length}`;
    if (animate && previous !== next) {
      animateGalleryImage(screen, next > previous || (previous === items.length - 1 && next === 0) ? 'next' : 'prev');
      $$('[data-gallery-index]', screen)[next]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  function renderGallery(category = galleryCategory) {
    galleryCategory = category;
    const screen = $('[data-gallery-screen="gallery"]');
    if (!screen) return;
    const items = galleryItems();
    $$('[data-gallery-category]', screen).forEach((button) => button.setAttribute('aria-selected', String(button.dataset.galleryCategory === galleryCategory)));
    const labels = uiText();
    $('[data-gallery-thumbs]', screen).innerHTML = items.map((item, index) => `<button class="gallery-thumb" type="button" role="option" aria-selected="false" aria-label="${galleryItemTitle(item)} · ${labels.zoom}" data-gallery-index="${index}"><img src="/assets/images/${item[0]}" alt="${galleryItemTitle(item)}" loading="lazy"><span class="gallery-thumb-index">${String(index + 1).padStart(2, '0')}</span></button>`).join('');
  }

  function openGalleryLightbox() {
    lightboxItems = galleryItems();
    lightboxTitle = null;
    openLightbox(galleryState.gallery);
  }

  function openPhoneDialog() {
    $('#phoneNumber').textContent = config.contact.displayPhone;
    $('#phoneCallAction').href = `tel:${config.contact.phone}`;
    $('#phoneDialog').showModal();
  }

  function arrivalWayfindingMarkup() {
    const labels = uiText();
    return `<span class="arrival-wayfinding" aria-hidden="true">
      <svg class="arrival-wayfinding-svg" viewBox="0 0 1000 750" preserveAspectRatio="none">
        <g class="arrival-sign-outline"><rect x="0" y="332" width="330" height="125" rx="8"/><rect x="682" y="331" width="318" height="94" rx="8"/></g>
        <g class="arrival-landmark arrival-landmark-left"><rect x="52" y="465" width="250" height="76" rx="8"/><text x="177" y="515">${esc(labels.eunseong)}</text></g>
        <g class="arrival-landmark arrival-landmark-right"><rect x="735" y="430" width="220" height="76" rx="8"/><text x="845" y="480">${esc(labels.rokgalbi)}</text></g>
        <g class="arrival-floor"><rect x="523" y="116" width="447" height="126" rx="10"/><rect x="618" y="132" width="272" height="56" rx="7" class="arrival-floor-label"/><text x="754" y="169">STAY NEMO · 3F</text></g>
        <path class="arrival-alley-path" d="M500 718 C500 650 493 588 502 532"/><path class="arrival-alley-tip" d="M502 488 L472 548 L532 548 Z"/>
      </svg>
    </span>`;
  }

  function transportIcon(name) {
    const common = 'viewBox="0 0 24 24" aria-hidden="true"';
    const icons = {
      flight_land:`<svg ${common}><path d="M3 18h18M4 8l6 4 2-7 2 1-1 7 6 3"/></svg>`,
      train:`<svg ${common}><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M8 7h8M8 12h.01M16 12h.01M8 18l-2 3m10-3l2 3M8 21h8"/></svg>`,
      subway:`<svg ${common}><rect x="5" y="3" width="14" height="15" rx="3"/><path d="M8 7h8M8 12h.01M16 12h.01M8 18l-2 3m10-3l2 3M8 21h8"/></svg>`,
      sync_alt:`<svg ${common}><path d="M7 7h11l-3-3m3 3l-3 3M17 17H6l3 3m-3-3l3-3"/></svg>`,
      directions_walk:`<svg ${common}><circle cx="13" cy="4" r="2"/><path d="M11 8l3 2 2 3m-5-5l-2 5 3 2-2 5m2-5l4 5"/></svg>`,
      airport_bus:`<svg ${common}><rect x="4" y="4" width="16" height="15" rx="3"/><path d="M7 8h10M7 12h.01M17 12h.01M7 19v2m10-2v2M8 16h8"/></svg>`,
      local_taxi:`<svg ${common}><path d="M5 10l2-4h10l2 4M4 10h16v7H4zM7 17v2m10-2v2M7 13h.01M17 13h.01"/></svg>`,
      address:`<svg ${common}><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 4V2h6v2M8 9h8m-8 4h5m-5 4h7"/></svg>`
    };
    return icons[name] || icons.train;
  }

  function arrivalCarouselCard(item) {
    const labels = uiText();
    return `<article class="arrival-guide-card">
      <header class="arrival-guide-head"><div><small>${labels.photoRoute}</small><h2>${tr(item.title)}</h2></div><span class="arrival-guide-count" data-arrival-count>01 / ${String(item.items.length).padStart(2, '0')}</span></header>
      <div class="arrival-carousel-wrap">
        <div class="arrival-carousel" data-arrival-carousel>${item.items.map((slide, index) => `<figure class="arrival-slide${slide.nightNotice ? ' has-night-notice' : ''}"><button type="button" data-arrival-zoom="${index}" aria-label="${esc(tr(slide.title))} · ${labels.zoom}"><img src="/assets/images/${slide.image}" alt="${esc(tr(slide.title))}" loading="lazy">${slide.wayfinding ? arrivalWayfindingMarkup() : ''}${slide.nightNotice ? `<span class="arrival-night-notice">${esc(tr(slide.title))}</span>` : ''}<span class="arrival-step">${String(index + 1).padStart(2, '0')}</span></button>${slide.nightNotice ? '' : `<figcaption>${esc(tr(slide.title))}</figcaption>`}</figure>`).join('')}</div>
        <button class="arrival-carousel-arrow previous" type="button" data-arrival-shift="-1" aria-label="${labels.previous}"><span class="mi">chevron_left</span></button>
        <button class="arrival-carousel-arrow next" type="button" data-arrival-shift="1" aria-label="${labels.next}"><span class="mi">chevron_right</span></button>
      </div>
      <footer class="arrival-guide-footer"><div>${item.items.map((_, index) => `<i class="${index === 0 ? 'active' : ''}" data-arrival-dot="${index}"></i>`).join('')}</div><span>${labels.swipeTap}</span></footer>
    </article>`;
  }

  function stationDirectionsCard(item) {
    const luggageNotice = data.content.transport.find((entry) => entry.type === 'notice' && entry.title?.ko === '짐이 많다면 10번 출구 엘리베이터');
    const luggagePhoto = data.content.transport.find((entry) => entry.image === 'station-elevator-exit10.webp');
    const tip = luggageNotice && luggagePhoto ? `<aside class="station-luggage-tip"><header><span class="mi">luggage</span><div><small>LUGGAGE ROUTE</small><strong>${tr(luggageNotice.title)}</strong></div></header><p>${tr(luggageNotice.text)}</p><figure><img src="/assets/images/${luggagePhoto.image}" alt="${esc(tr(luggagePhoto.title))}" loading="lazy"><span class="station-elevator-highlight"><b>${language === 'ko' ? '10번 출구 엘리베이터' : tr(luggagePhoto.title)}</b></span></figure></aside>` : '';
    return `<article class="station-directions-card"><h2>${tr(item.title)}</h2><ol class="steps-list">${item.items.map((entry, index) => `<li><span>${tr(entry)}</span>${index === 0 ? tip : ''}</li>`).join('')}</ol></article>`;
  }

  function airportAccessCard(item) {
    const labels = {
      ko:{source:'공항 공식 교통정보 확인',eyebrow:'ROUTE OPTIONS',title:'경로별 찾아오는 길',station:'을지로3가역에서',stationSummary:'7·8번 출구에서 STAY NEMO까지'},
      en:{source:'View official airport transport',eyebrow:'ROUTE OPTIONS',title:'Choose your route',station:'From Euljiro 3-ga Station',stationSummary:'From Exit 7 or 8 to STAY NEMO'},
      ja:{source:'空港公式交通情報を見る',eyebrow:'ROUTE OPTIONS',title:'アクセス方法を選ぶ',station:'乙支路3街駅から',stationSummary:'7・8番出口からSTAY NEMOまで'},
      zh:{source:'查看机场官方交通信息',eyebrow:'ROUTE OPTIONS',title:'选择到达路线',station:'从乙支路3街站出发',stationSummary:'从 7 或 8 号出口前往 STAY NEMO'}, "zh-TW":{"source":"查看機場官方交通資訊","eyebrow":"ROUTE OPTIONS","title":"選擇到達路線","station":"從乙支路3街站出發","stationSummary":"從 7 或 8 號出口前往 STAY NEMO"}
    }[language];
    const route = (entry) => `<article class="airport-route-card"><div class="airport-route-top"><h3>${tr(entry.title)}</h3><span>${tr(entry.badge)}</span></div><div class="airport-route-tags">${tr(entry.tags).map((tag) => `<span>${tr(tag)}</span>`).join('')}</div><div class="airport-route-map"><div class="airport-route-head"><strong>${tr(entry.path)}</strong><p>${tr(entry.note)}</p></div><div class="airport-route-steps">${entry.steps.map((step) => `<div class="airport-route-step"><span class="airport-route-node">${transportIcon(step.icon)}</span><div><small>${tr(step.label)}</small><strong>${tr(step.title)}</strong><p>${tr(step.body)}</p></div></div>`).join('')}</div></div></article>`;
    const stationSteps = data.content.checkin.find((entry) => entry.type === 'steps');
    const stationCarousel = data.content.checkin.find((entry) => entry.type === 'arrivalCarousel');
    const station = `<details class="airport-accordion transport-station-accordion" open><summary><span class="airport-round-icon">${transportIcon('subway')}</span><span><strong>${labels.station}</strong><small>${labels.stationSummary}</small></span><span class="airport-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span></summary><div class="airport-accordion-body transport-station-body">${stationDirectionsCard(stationSteps)}${arrivalCarouselCard(stationCarousel)}</div></details>`;
    const airports = item.airports.map((airport) => `<details class="airport-accordion"><summary><span class="airport-round-icon">${transportIcon('flight_land')}</span><span><strong>${tr(airport.title)}</strong><small>${tr(airport.summary)}</small></span><span class="airport-chevron" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span></summary><div class="airport-accordion-body">${airport.routes.map(route).join('')}<a class="airport-source" href="${airport.source}" target="_blank" rel="noopener noreferrer"><span>${labels.source}</span><span aria-hidden="true">↗</span></a></div></details>`).join('');
    return `<section class="airport-access-card transport-route-card"><header><span class="airport-section-icon">${transportIcon('train')}</span><div><small>${labels.eyebrow}</small><h2>${labels.title}</h2></div></header><div class="airport-accordion-list">${station}${airports}</div></section>`;
  }

  function transportOverviewCard() {
    const labels = {
      ko:{eyebrow:'STAY NEMO · EULJIRO',title:'도착 정보',address:'주소',addressValue:'서울시 중구 을지로3가 291-37 · 3층',landmark:'LANDMARK',landmarkValue:'록갈비 을지로점 건물',station:'NEAREST STATION',stationValue:'을지로3가역',lastMile:'LAST MILE',lastMileValue:'7, 8번 출구에서 도보 1분'},
      en:{eyebrow:'STAY NEMO · EULJIRO',title:'Arrival essentials',address:'ADDRESS',addressValue:'3F, 291-37 Euljiro 3-ga, Jung-gu, Seoul',landmark:'LANDMARK',landmarkValue:'Rokgalbi Euljiro Branch building',station:'NEAREST STATION',stationValue:'Euljiro 3-ga Station',lastMile:'LAST MILE',lastMileValue:'1-minute walk from Exit 7 or 8'},
      ja:{eyebrow:'STAY NEMO · EULJIRO',title:'到着情報',address:'住所',addressValue:'ソウル特別市中区乙支路3街291-37・3階',landmark:'LANDMARK',landmarkValue:'ロクカルビ乙支路店の建物',station:'NEAREST STATION',stationValue:'乙支路3街駅',lastMile:'LAST MILE',lastMileValue:'7・8番出口から徒歩1分'},
      zh:{eyebrow:'STAY NEMO · EULJIRO',title:'抵达信息',address:'地址',addressValue:'首尔特别市中区乙支路3街 291-37 · 3层',landmark:'LANDMARK',landmarkValue:'Rokgalbi 乙支路店所在大楼',station:'NEAREST STATION',stationValue:'乙支路3街站',lastMile:'LAST MILE',lastMileValue:'从 7 或 8 号出口步行1分钟'}, "zh-TW":{"eyebrow":"STAY NEMO · EULJIRO","title":"抵達資訊","address":"地址","addressValue":"首爾特別市中區乙支路3街 291-37 · 3層","landmark":"LANDMARK","landmarkValue":"Rokgalbi 乙支路店所在大樓","station":"NEAREST STATION","stationValue":"乙支路3街站","lastMile":"LAST MILE","lastMileValue":"從 7 或 8 號出口步行1分鐘"}
    }[language];
    const facts = [[transportIcon('subway'), labels.station, labels.stationValue],[transportIcon('directions_walk'), labels.lastMile, labels.lastMileValue],[transportIcon('directions_walk'), labels.landmark, labels.landmarkValue]];
    return `<section class="transport-overview-card"><header><span class="transport-overview-mark">${transportIcon('address')}</span><div><small>${labels.eyebrow}</small><h2>${labels.title}</h2></div></header><article class="transport-address-feature"><small>${labels.address}</small><strong>${labels.addressValue}</strong></article><div class="transport-facts">${facts.map(([icon,label,value]) => `<article class="transport-fact"><span>${icon}</span><div><small>${label}</small><strong>${value}</strong></div></article>`).join('')}</div></section>`;
  }

  function syncArrivalCarousel(carousel) {
    if (!carousel) return;
    const card = carousel.closest('.arrival-guide-card');
    const slides = $$('.arrival-slide', carousel);
    const index = Math.max(0, Math.min(slides.length - 1, Math.round(carousel.scrollLeft / Math.max(1, carousel.clientWidth))));
    $$('[data-arrival-dot]', card).forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
    const count = $('[data-arrival-count]', card);
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  }

  function initArrivalCarousels() {
    $$('[data-arrival-carousel]').forEach((carousel) => {
      let frame = 0;
      carousel.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => syncArrivalCarousel(carousel));
      }, { passive:true });
      syncArrivalCarousel(carousel);
    });
  }

  function ruleIcon(icon) {
    const shapes = {
      smoke_free: '<path d="M4 16h13v3H4zM17 16h3v3h-3M7 12h7M3 3l18 18"/>',
      notifications_off: '<path d="M7 17h10l-1.4-2v-4a3.6 3.6 0 0 0-7.2 0v4L7 17ZM10 20h4M4 4l16 16"/>',
      pets: '<circle cx="7" cy="9" r="1.5"/><circle cx="11" cy="6.5" r="1.5"/><circle cx="15" cy="7.5" r="1.5"/><circle cx="17" cy="11" r="1.5"/><path d="M8 16c0-2.4 1.8-4.5 4-4.5s4 2.1 4 4.5c0 1.5-1.1 2.5-2.5 2.1L12 17.5l-1.5.6C9.1 18.5 8 17.5 8 16Z"/>',
      celebration: '<path d="m5 19 4-11 7 7-11 4ZM9 8l7 7M15 4v3M20 9h-3M18 5l-2 2"/>',
      skillet: '<circle cx="10" cy="12" r="5"/><path d="M15 12h6M7 10h6"/>',
      local_fire_department: '<path d="M12 21c-4 0-7-2.8-7-6.5 0-2.7 1.8-5 4-6.8.3 2 1 3.2 2.2 4.1-.2-3 1.3-6.1 4.2-8.8.2 3.2 3.6 5.5 3.6 9.1 0 5-3.1 8.9-7 8.9Z"/>'
    };
    return `<span class="rule-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${shapes[icon] || shapes.local_fire_department}</svg></span>`;
  }

  function contentCard(item) {
    if (item.type === 'notice') return `<article class="content-card notice"><h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'steps') return `<article class="content-card"><h2>${tr(item.title)}</h2><ol class="steps-list">${item.items.map((entry) => `<li>${tr(entry)}</li>`).join('')}</ol></article>`;
    if (item.type === 'photo') return `<article class="content-card photo-card"><img src="/assets/images/${item.image}" alt="${tr(item.title)}" loading="lazy"></article>`;
    if (item.type === 'card') return `<article class="content-card">${iconMarkup(item.icon, 'card-icon')}<h2>${tr(item.title)}</h2><p>${tr(item.text)}</p></article>`;
    if (item.type === 'wifi') return `<article class="content-card wifi-card"><h2>${item.title}</h2><p>${tr(item.label)}</p><div class="wifi-row"><code>${item.password}</code><button class="copy-button" type="button" data-copy="${item.password}">${uiText().copy}</button></div></article>`;
    if (item.type === 'destination') return `<article class="content-card"><span class="mi card-icon">location_on</span><h2>${item.title}</h2><p>${tr(item.address)}</p></article>`;
    if (item.type === 'actions') return `<div class="map-actions"><a href="${config.maps.naver}" target="_blank" rel="noopener noreferrer">NAVER MAP <span class="map-arrow" aria-hidden="true">↗</span></a><a href="${config.maps.google}" target="_blank" rel="noopener noreferrer">GOOGLE MAP <span class="map-arrow" aria-hidden="true">↗</span></a></div>`;
    if (item.type === 'arrivalCarousel') return arrivalCarouselCard(item);
    if (item.type === 'airportAccess') return airportAccessCard(item);
    if (item.type === 'rules') return `<div class="rules-grid">${item.items.map(([icon, title, text]) => `<article class="rule-item">${ruleIcon(icon)}<div><strong>${tr(title)}</strong><p>${tr(text)}</p></div></article>`).join('')}</div>`;
    return '';
  }

  function stayListMarkup(text) {
    const sentences = (Array.isArray(text) ? text : [text]).flatMap((entry) => String(entry).match(/[^。.!?！？]+[。.!?！？]*/g) || []).map((sentence) => sentence.trim()).filter(Boolean);
    return `<ul class="stay-guide-points">${sentences.map((sentence) => `<li>${esc(sentence.trim())}</li>`).join('')}</ul>`;
  }

  function stayGuideCard(item) {
    if (item.type === 'notice') return `<article class="content-card notice"><h2>${tr(item.title)}</h2>${stayListMarkup(tr(item.text))}</article>`;
    if (item.type === 'steps') return `<article class="content-card"><h2>${tr(item.title)}</h2>${stayListMarkup(item.items.map((entry) => tr(entry)))}</article>`;
    return contentCard(item);
  }

  function staySplitCard(card, photo, kind) {
    const eyebrow = kind === 'night' ? 'NIGHT ACCESS' : 'LUGGAGE STORAGE';
    const description = stayListMarkup(tr(card.text));
    return `<article class="stay-split-card ${kind}"><figure><img src="/assets/images/${photo.image}" alt="${esc(tr(photo.title))}" loading="lazy"></figure><div>${iconMarkup(card.icon || (kind === 'night' ? 'key' : 'luggage'), 'stay-split-icon')}<small>${eyebrow}</small><h3>${tr(card.title)}</h3>${description}</div></article>`;
  }

  function parkingGuideCard(item) {
    return `<article class="checkin-parking-card"><header>${iconMarkup(item.icon, 'checkin-parking-icon')}<div><small>PARKING</small><h3>${tr(item.title)}</h3></div></header><p>${esc(tr(item.text))}</p><div class="parking-location-list">${item.locations.map((location) => `<article><span class="mi">location_on</span><div><strong>${tr(location.name)}</strong><address>${tr(location.address)}</address></div></article>`).join('')}</div></article>`;
  }

  function departureInfoCard(item, kind, index, photo = null) {
    const meta = {
      waste: { eyebrow:'WASTE', icon:'delete' },
      climate: { eyebrow:'CLIMATE & POWER', icon:'climate_power' },
      timing: { eyebrow:'FLEXIBLE TIME', icon:'schedule' }
    }[kind];
    const visual = photo
      ? `<figure><img src="/assets/images/${photo.image}" alt="${esc(tr(photo.title))}" loading="lazy"><span class="departure-photo-index">${String(index).padStart(2, '0')}</span></figure>`
      : `<figure class="departure-graphic">${iconMarkup(meta.icon, 'departure-graphic-icon')}<span>${String(index).padStart(2, '0')}</span></figure>`;
    return `<article class="departure-info-card ${kind}">${visual}<div class="departure-info-copy"><small>${meta.eyebrow}</small><h3>${tr(item.title)}</h3><p>${esc(tr(item.text))}</p></div></article>`;
  }

  function departureEssentials() {
    const labels = {
      ko:{eyebrow:'CHECK-OUT ESSENTIALS',title:'체크아웃 핵심 안내',text:'퇴실 전, 아래 세 가지를 마지막으로 확인해 주세요.'},
      en:{eyebrow:'CHECK-OUT ESSENTIALS',title:'Check-out essentials',text:'Before leaving, please make one final check of these three items.'},
      ja:{eyebrow:'CHECK-OUT ESSENTIALS',title:'チェックアウトのご案内',text:'退室前に、以下の3点を最後にご確認ください。'},
      zh:{eyebrow:'CHECK-OUT ESSENTIALS',title:'退房重点指南',text:'离开前，请最后确认以下三项。'}, "zh-TW":{"eyebrow":"CHECK-OUT ESSENTIALS","title":"退房重點指南","text":"離開前，請最後確認以下三項。"}
    }[language];
    const waste = data.content.checkout.find((item) => item.icon === 'delete');
    const photo = data.content.checkout.find((item) => item.image === 'recycling.webp');
    const climate = data.content.checkout.find((item) => item.icon === 'climate_power');
    const timing = data.content.checkout.find((item) => item.type === 'notice');
    return `<section class="departure-essentials"><header><small>${labels.eyebrow}</small><h3>${labels.title}</h3><p>${esc(labels.text)}</p></header><div class="departure-info-list">${departureInfoCard(waste, 'waste', 1, photo)}${departureInfoCard(climate, 'climate', 2)}${departureInfoCard(timing, 'timing', 3)}</div></section>`;
  }

  function renderStayFlow() {
    const target = $('#checkinContent');
    if (!target) return;
    const arrivalMeta = data.content.checkin.slice(0, 3);
    const luggageCard = data.content.checkin.find((item) => item.icon === 'luggage');
    const luggagePhoto = data.content.checkin.find((item) => item.image === 'guest-storage-v72.png');
    const parkingCard = data.content.transport.find((item) => item.icon === 'local_parking');
    const nightCard = data.content.transport.find((item) => item.type === 'notice' && item.title?.ko === '야간 출입');
    const nightPhoto = data.content.transport.find((item) => item.image === 'doorlock-night-clean-v2.png');
    const departureChecklist = data.content.checkout.find((item) => item.type === 'steps');
    target.innerHTML = `
      <article class="stay-flow-overview">
        <div class="stay-time arrival"><small>ARRIVAL</small><strong>16:00</strong><span>${tr(data.translations.checkin)}</span></div>
        <i aria-hidden="true"></i>
        <div class="stay-time departure"><small>DEPARTURE</small><strong>11:00</strong><span>${tr(data.translations.checkout)}</span></div>
      </article>
      <section class="stay-flow-group arrival-group">
        <header><span class="mi">login</span><div><small>SELF CHECK-IN</small><h2>${tr(data.translations.selfCheckin)}</h2></div></header>
        <div class="arrival-meta">${arrivalMeta.map(stayGuideCard).join('')}</div>
        <div class="stay-flow-content checkin-editorial-flow">${parkingGuideCard(parkingCard)}${staySplitCard(luggageCard, luggagePhoto, 'luggage')}${staySplitCard(nightCard, nightPhoto, 'night')}</div>
      </section>
      <section class="stay-flow-group departure-group">
        <header><span class="mi">logout</span><div><small>DEPARTURE</small><h2>${tr(data.translations.departure)}</h2></div></header>
        <div class="stay-flow-content departure-flow">${stayGuideCard(departureChecklist)}${departureEssentials()}</div>
      </section>`;
    initArrivalCarousels();
  }

  function renderTransport() {
    const target = $('#transportContent');
    if (!target) return;
    const items = data.content.transport;
    const airportAccess = items.find((item) => item.type === 'airportAccess');
    const duplicateRoutePhotos = new Set(['exterior-from-exit8.webp','exterior-entry-side-clean-v2.png','building-entrance.webp','ground-door.webp']);
    const movedOrEmbedded = (item) => item.image === 'station-elevator-exit10.webp' || item.image === 'doorlock-night-clean-v2.png' || item.icon === 'local_parking' || (item.type === 'notice' && ['짐이 많다면 10번 출구 엘리베이터','야간 출입'].includes(item.title?.ko)) || (item.icon === 'local_taxi' && item.title?.ko === '택시로 올 때');
    const extras = items.filter((item) => item !== airportAccess && item.type !== 'destination' && item.type !== 'actions' && !movedOrEmbedded(item) && !(item.type === 'photo' && duplicateRoutePhotos.has(item.image)));
    target.innerHTML = `${transportOverviewCard()}${contentCard({ type:'actions' })}${airportAccessCard(airportAccess)}<section class="transport-extra-content">${extras.map(contentCard).join('')}</section>`;
    initArrivalCarousels();
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
      if (name === 'checkin' || name === 'checkout' || name === 'wifi' || name === 'transport') return;
      const target = $(`#${name}Content`);
      if (target) target.innerHTML = items.map(contentCard).join('');
    });
    renderStayFlow();
    renderWifi();
    renderTransport();
  }

  function recommendationLabels() {
    return ({
      ko:{places:'곳',from:'숙소에서',empty:'조건에 맞는 장소가 없습니다.',map:'지도',details:'공식 정보',search:'추천 장소 검색'},
      en:{places:'places',from:'From the stay',empty:'No places match your search.',map:'Map',details:'Official details',search:'Search recommendations'},
      ja:{places:'か所',from:'宿から',empty:'条件に合う場所がありません。',map:'地図',details:'公式情報',search:'おすすめを検索'},
      zh:{places:'处',from:'从住宿出发',empty:'没有符合条件的地点。',map:'地图',details:'官方信息',search:'搜索推荐'}, "zh-TW":{"places":"處","from":"從住宿出發","empty":"沒有符合條件的地點。","map":"地圖","details":"官方資訊","search":"搜尋推薦"}
    })[language];
  }

  const anotherHouseRestaurantImages = new Set([
    'coffee.webp', 'seoulzip.webp', 'buchon.webp', 'soonhee.webp',
    'jinokhwa.webp', 'cheongsudang.webp', 'everest.webp', 'jokbal.webp',
    'jeonju.webp', 'pho.webp', 'haejang.webp', 'onion-anguk.webp',
    'london-bagel.webp', 'mil-toast.webp', 'fritz-wonseo.webp', 'taegeukdang.webp'
  ]);

  function sharedRecommendationImage(item, kind) {
    if (kind === 'tours') {
      return item.image.replace('tours/spots/', 'tours/spots/anotherhouse-v33/');
    }
    const filename = item.image.replace('restaurants/', '');
    return anotherHouseRestaurantImages.has(filename)
      ? `restaurants/anotherhouse-v33/${filename}`
      : item.image;
  }

  function recommendationCard(item, kind) {
    const labels = recommendationLabels();
    const travel = tr(item.walk || item.travel);
    const tags = tr(item.tags) || [];
    item = { ...item, image: sharedRecommendationImage(item, kind) };
    return `<article class="recommendation-card ${item.host ? 'is-host' : ''}">
      <figure class="recommendation-photo"><img src="/assets/images/${esc(item.image)}?v=32" alt="${esc(tr(item.name))}" loading="lazy">${item.host ? `<span class="recommendation-pick"><span class="mi">hotel_class</span> ${uiText().hostPick}</span>` : ''}</figure>
      <div class="recommendation-body"><div class="recommendation-heading"><h3>${esc(tr(item.name))}</h3>${item.category ? `<span>${esc(tr(item.category))}</span>` : ''}</div>
      <div class="recommendation-travel"><span class="mi">${kind === 'tours' ? 'directions_walk' : 'near_me'}</span><small>${labels.from}</small><strong>${esc(travel)}</strong></div>
      <p>${esc(tr(item.text))}</p><div class="recommendation-tags">${tags.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div>
      <div class="recommendation-actions"><a href="${esc(item.naver)}" target="_blank" rel="noopener"><span class="mi">location_on</span>NAVER</a><a href="${esc(item.google)}" target="_blank" rel="noopener"><span class="mi">map</span>GOOGLE</a>${item.official ? `<a href="${esc(item.official)}" target="_blank" rel="noopener"><span class="mi">open_in_new</span>${labels.details}</a>` : ''}</div></div>
    </article>`;
  }

  function renderRecommendationCards(kind) {
    const source = data[kind];
    const state = recommendationState[kind];
    const normalizedQuery = state.query.trim().toLocaleLowerCase(language);
    const places = source.places.filter((item) => {
      const categoryMatch = state.category === 'all' || (state.category === 'host' ? item.host : item.categories.includes(state.category));
      const haystack = [tr(item.name), tr(item.category), tr(item.text), ...(tr(item.tags) || [])].join(' ').toLocaleLowerCase(language);
      return categoryMatch && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
    const root = $(`#${kind}Content`);
    if (!root) return;
    const list = $('[data-recommend-list]', root);
    const host = $('[data-recommend-host]', root);
    const count = $('[data-recommend-count]', root);
    const empty = $('[data-recommend-empty]', root);
    list.innerHTML = places.map((item) => recommendationCard(item, kind)).join('');
    const showHostBanner = state.category === 'host';
    host.hidden = !showHostBanner;
    host.style.display = showHostBanner ? '' : 'none';
    count.textContent = String(places.length);
    empty.hidden = places.length > 0;
  }

  function renderRecommendations(kind) {
    const source = data[kind];
    const root = $(`#${kind}Content`);
    if (!source || !root) return;
    const labels = recommendationLabels();
    const state = recommendationState[kind];
    root.innerHTML = `<div class="recommendation-controls"><div class="recommendation-filter" role="tablist">${source.categories.map((item) => `<button type="button" class="${item.id === state.category ? 'active' : ''}" data-recommend-category="${esc(item.id)}">${esc(tr(item.label))}</button>`).join('')}</div><label class="recommendation-search"><span class="mi">search</span><input type="search" value="${esc(state.query)}" placeholder="${esc(tr(source.searchPlaceholder) || labels.search)}" data-recommend-search></label></div>
      <section class="recommendation-host" data-recommend-host><span class="mi">hotel_class</span><div><small>HOST’S PICK</small><strong>${esc(tr(source.hostTitle))}</strong></div></section>
      <div class="recommendation-summary"><strong><span data-recommend-count>0</span> ${labels.places}</strong><span>${esc(tr(source.summary))}</span></div>
      <div class="recommendation-list" data-recommend-list></div><p class="recommendation-empty" data-recommend-empty hidden>${labels.empty}</p>`;
    $$('[data-recommend-category]', root).forEach((button) => button.addEventListener('click', () => {
      state.category = button.dataset.recommendCategory;
      $$('[data-recommend-category]', root).forEach((item) => item.classList.toggle('active', item === button));
      renderRecommendationCards(kind);
    }));
    $('[data-recommend-search]', root).addEventListener('input', (event) => { state.query = event.target.value; renderRecommendationCards(kind); });
    renderRecommendationCards(kind);
  }

  function applianceLabels() {
    return ({
      ko:{model:'모델명',guide:'사용 가이드',manual:'공식 자료 보기',caution:'주의사항',zoom:'확대 보기',previous:'이전 장',next:'다음 장'},
      en:{model:'Model',guide:'HOW TO USE',manual:'View official source',caution:'Caution',zoom:'Open full screen',previous:'Previous page',next:'Next page'},
      ja:{model:'モデル名',guide:'使用ガイド',manual:'公式資料を見る',caution:'注意事項',zoom:'拡大表示',previous:'前のページ',next:'次のページ'},
      zh:{model:'型号',guide:'使用指南',manual:'查看官方资料',caution:'注意事项',zoom:'放大查看',previous:'上一页',next:'下一页'}, "zh-TW":{"model":"型號","guide":"使用指南","manual":"查看官方資料","caution":"注意事項","zoom":"放大查看","previous":"上一頁","next":"下一頁"}
    })[language];
  }

  function applianceIcon(name) {
    const paths = {
      climate:'<path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z"/><path d="M12 7v9"/><path d="M8 5H5M8 9H6"/>',
      tv:'<rect x="3" y="5" width="18" height="13" rx="2"/><path d="m8 21 4-3 4 3M8 10h8M8 13h5"/>',
      washer:'<rect x="3" y="2.5" width="18" height="19" rx="2"/><circle cx="12" cy="13" r="5.5"/><path d="M6 6h5M17 6h1M9 13c1 2 3 3 5 2"/>',
      cooktop:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="11" r="5"/><circle cx="12" cy="11" r="2.5"/><path d="M7 18h10"/>',
      microwave:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M15 5v14M5.5 8.5h6v7h-6z"/><circle cx="18" cy="9" r="1"/><circle cx="18" cy="13" r="1"/>'
    };
    return `<span class="appliance-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.tv}</svg></span>`;
  }

  function tvRemoteGuideMarkup() {
    const labels = uiText();
    return `<span class="tv-remote-guide" role="img" aria-label="${esc(labels.tvAria)}">
      <svg viewBox="0 0 1024 1536" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <image href="/assets/images/guides/tv-remote-clean-v46.png" x="0" y="0" width="1024" height="1536" preserveAspectRatio="xMidYMid meet"/>
        <g class="remote-callouts">
          <g class="remote-badge"><rect x="38" y="146" width="66" height="66" rx="16"/><text x="71" y="192">1</text></g>
          <text class="remote-label" x="122" y="190">${esc(labels.power)}</text>
          <g class="remote-leader"><path d="M232 180 H326 L390 188"/><circle cx="390" cy="188" r="12"/></g>

          <g class="remote-badge"><rect x="38" y="632" width="66" height="66" rx="16"/><text x="71" y="678">2</text></g>
          <text class="remote-label" x="122" y="657">${esc(labels.home)}</text><text class="remote-label remote-label-small" x="122" y="698">${esc(labels.chooseOtt)}</text>
          <g class="remote-leader"><path d="M292 680 H340 L455 730 H480 V760"/><circle cx="480" cy="760" r="12"/></g>

          <g class="remote-badge"><rect x="38" y="784" width="66" height="66" rx="16"/><text x="71" y="830">3</text></g>
          <text class="remote-label remote-label-small remote-label-ott" x="122" y="830">${esc(labels.ott)}</text>
          <g class="remote-leader remote-leader-ott"><path d="M302 820 H340 V760 H385"/><circle cx="385" cy="760" r="10"/></g>

          <g class="remote-badge"><rect x="912" y="864" width="66" height="66" rx="16"/><text x="945" y="910">4</text></g>
          <text class="remote-label remote-label-small remote-label-right" x="894" y="906">${esc(labels.direction)}</text>
          <g class="remote-leader"><path d="M912 918 H860 L548 918"/><circle cx="548" cy="918" r="12"/></g>

          <g class="remote-badge"><rect x="38" y="1010" width="66" height="66" rx="16"/><text x="71" y="1056">5</text></g>
          <text class="remote-label remote-label-small" x="122" y="1052">${esc(labels.back)}</text>
          <g class="remote-leader"><path d="M292 1042 H340 L390 998"/><circle cx="390" cy="998" r="12"/></g>

          <g class="remote-badge"><rect x="912" y="1010" width="66" height="66" rx="16"/><text x="945" y="1056">6</text></g>
          <text class="remote-label remote-label-small remote-label-right" x="894" y="1030">${esc(labels.exit)}</text>
          <g class="remote-leader"><path d="M912 1042 H824 L640 998"/><circle cx="640" cy="998" r="12"/></g>

          <g class="remote-note"><rect x="50" y="1348" width="924" height="128" rx="22"/><text x="512" y="1423">${esc(labels.tvNote)}</text></g>
        </g>
      </svg>
    </span>`;
  }

  function airconRemoteGuideMarkup() {
    const labels = uiText();
    return `<span class="aircon-remote-guide" role="img" aria-label="${esc(labels.airconAria)}">
      <img src="/assets/images/guides/aircon-remote-source-v61.webp" alt="" loading="eager" decoding="async">
      <svg viewBox="0 0 1200 1600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g class="aircon-callouts">
          <g class="aircon-label"><rect x="18" y="588" width="220" height="76" rx="18"/><text x="128" y="637">1 · ${esc(labels.power)}</text></g>
          <g class="remote-leader" data-aircon-control="power"><path d="M238 626 H260 L275 695"/><circle cx="275" cy="695" r="12"/></g>
          <g class="aircon-label"><rect x="742" y="588" width="438" height="76" rx="18"/><text x="961" y="637">2 · ${esc(labels.mode)}</text></g>
          <g class="remote-leader" data-aircon-control="mode"><path d="M742 626 H505 L370 695"/><circle cx="370" cy="695" r="12"/></g>
          <g class="aircon-label"><rect x="8" y="780" width="220" height="76" rx="18"/><text x="118" y="829">3 · ${esc(labels.temperature)}</text></g>
          <g class="remote-leader" data-aircon-control="temperature"><path d="M228 818 H240 M240 818 L280 778 M240 818 L286 856"/><circle cx="280" cy="778" r="12"/><circle cx="286" cy="856" r="12"/></g>
          <g class="aircon-label"><rect x="820" y="780" width="360" height="76" rx="18"/><text x="1000" y="829">4 · ${esc(labels.fan)}</text></g>
          <g class="remote-leader" data-aircon-control="fan"><path d="M820 818 H510 L374 778"/><circle cx="374" cy="778" r="12"/></g>
        </g>
      </svg>
    </span>`;
  }

  function syncApplianceCarousel(carousel) {
    const slides = $$('.appliance-guide-slide', carousel);
    if (!slides.length) return;
    const index = slides.reduce((best, slide, i) => Math.abs(slide.offsetLeft - carousel.scrollLeft) < Math.abs(slides[best].offsetLeft - carousel.scrollLeft) ? i : best, 0);
    const card = carousel.closest('.appliance-card');
    $('[data-appliance-count]', card).textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    $$('[data-appliance-dot]', card).forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  function renderAppliances() {
    const labels = applianceLabels();
    $('#applianceList').innerHTML = data.appliances.map((item, itemIndex) => {
      const images = tr(item.guideImages) || [];
      const captions = tr(item.guideCaptions) || [];
      const figures = images.map((image, imageIndex) => {
        const media = image === 'guides/tv-remote-clean-v46.png'
          ? tvRemoteGuideMarkup()
          : image === 'guides/aircon-remote-source-v61.webp'
            ? airconRemoteGuideMarkup()
          : `<img src="/assets/images/${image}" alt="${tr(item.title)} ${labels.guide} ${imageIndex + 1}" loading="lazy">`;
        const caption = captions[imageIndex] || `${tr(item.title)} · ${labels.guide} ${imageIndex + 1}`;
        return `<figure class="appliance-guide-slide"><button type="button" data-appliance-zoom="${itemIndex}:${imageIndex}" aria-label="${labels.zoom}: ${caption}">${media}</button><figcaption class="appliance-guide-caption">${esc(caption)}</figcaption><span>${String(imageIndex + 1).padStart(2, '0')}</span></figure>`;
      }).join('');
      const controls = images.length > 1 ? `<button type="button" class="appliance-carousel-arrow previous" data-appliance-shift="-1" aria-label="${labels.previous}"><span class="mi">chevron_left</span></button><button type="button" class="appliance-carousel-arrow next" data-appliance-shift="1" aria-label="${labels.next}"><span class="mi">chevron_right</span></button>` : '';
      const dots = images.map((_, index) => `<i data-appliance-dot class="${index === 0 ? 'active' : ''}"></i>`).join('');
      return `<article class="appliance-card" data-appliance-index="${itemIndex}"><header class="appliance-title">${applianceIcon(item.icon)}<div><h2>${tr(item.title)}</h2><small>${tr(item.meta)}</small>${item.model ? `<strong class="appliance-header-model"><span>${labels.model}</span>${item.model}</strong>` : ''}</div></header><div class="appliance-guide-label"><span>${labels.guide}</span><strong data-appliance-count>01 / ${String(images.length).padStart(2, '0')}</strong></div><div class="appliance-carousel-wrap">${controls}<div class="appliance-guide-carousel ${images.length === 1 ? 'is-single' : ''}" data-appliance-carousel>${figures}</div></div><div class="appliance-carousel-footer"><div>${dots}</div><span>${images.length === 1 ? uiText().guide : uiText().swipe}</span></div><div class="appliance-copy"><ol>${tr(item.steps).map((step) => `<li>${step}</li>`).join('')}</ol>${item.caution ? `<aside class="appliance-caution"><strong>${labels.caution}</strong><p>${tr(item.caution)}</p></aside>` : ''}${item.manualUrl ? `<a class="appliance-manual" href="${item.manualUrl}" target="_blank" rel="noopener noreferrer"><span class="mi">menu_book</span><span>${esc(tr(item.manualLabel) || labels.manual)}</span><span aria-hidden="true">↗</span></a>` : ''}</div></article>`;
    }).join('');
    $$('[data-appliance-carousel]').forEach((carousel) => {
      let frame = 0;
      carousel.addEventListener('scroll', () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => syncApplianceCarousel(carousel));
      }, { passive:true });
    });
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
    const tvGuide = item[0] === 'guides/tv-remote-clean-v46.png';
    const airconGuide = item[0] === 'guides/aircon-remote-source-v61.webp';
    $('#lightboxImage').src = tvGuide || airconGuide ? '' : `/assets/images/${item[0]}`;
    const title = lightboxTitle || (item[2] ? tr(item[2]) : galleryItemTitle(item));
    $('#lightboxImage').alt = title;
    const overlay = $('#lightboxOverlay');
    const wayfinding = Boolean(item[3]?.wayfinding);
    const nightNotice = Boolean(item[3]?.nightNotice);
    $('#lightbox').classList.toggle('has-wayfinding', wayfinding);
    $('#lightbox').classList.toggle('has-night-notice', nightNotice);
    $('#lightbox').classList.toggle('has-tv-guide', tvGuide);
    $('#lightbox').classList.toggle('has-aircon-guide', airconGuide);
    overlay.innerHTML = tvGuide ? tvRemoteGuideMarkup() : airconGuide ? airconRemoteGuideMarkup() : wayfinding ? arrivalWayfindingMarkup() : nightNotice ? `<span class="arrival-night-notice">${esc(title)}</span>` : '';
    const count = `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
    $('#lightboxCaption').textContent = ['arrival', 'appliance'].includes(item[1]) ? `${title} · ${count}` : count;
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
    if (otaButton?.tagName === 'A') return;
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
    const galleryCategoryButton = event.target.closest('[data-gallery-category]');
    if (galleryCategoryButton) {
      galleryState.gallery = 0;
      renderGallery(galleryCategoryButton.dataset.galleryCategory);
      return;
    }
    const galleryThumb = event.target.closest('[data-gallery-index]');
    if (galleryThumb) {
      galleryState.gallery = Number(galleryThumb.dataset.galleryIndex);
      lightboxItems = galleryItems();
      lightboxTitle = null;
      openLightbox(galleryState.gallery);
      return;
    }
    const galleryMain = event.target.closest('[data-gallery-main-button]');
    if (galleryMain) {
      openGalleryLightbox();
      return;
    }
    if (event.target.closest('[data-phone-reveal]')) {
      openPhoneDialog();
      return;
    }
    if (event.target.closest('[data-phone-close]')) {
      $('#phoneDialog').close();
      return;
    }
    const applianceShift = event.target.closest('[data-appliance-shift]');
    if (applianceShift) {
      const carousel = $('[data-appliance-carousel]', applianceShift.closest('.appliance-card'));
      carousel.scrollBy({ left: Number(applianceShift.dataset.applianceShift) * carousel.clientWidth * .88, behavior:'smooth' });
      return;
    }
    const applianceZoom = event.target.closest('[data-appliance-zoom]');
    if (applianceZoom) {
      const [itemIndex, imageIndex] = applianceZoom.dataset.applianceZoom.split(':').map(Number);
      const item = data.appliances[itemIndex];
      const captions = tr(item.guideCaptions) || [];
      lightboxItems = tr(item.guideImages).map((image, index) => [image, 'appliance', captions[index] || tr(item.title)]);
      lightboxTitle = null;
      openLightbox(imageIndex);
      return;
    }
    const arrivalShift = event.target.closest('[data-arrival-shift]');
    if (arrivalShift) {
      const carousel = $('[data-arrival-carousel]', arrivalShift.closest('.arrival-guide-card'));
      const current = Math.round(carousel.scrollLeft / Math.max(1, carousel.clientWidth));
      const next = Math.max(0, Math.min(carousel.children.length - 1, current + Number(arrivalShift.dataset.arrivalShift)));
      carousel.scrollTo({ left: next * carousel.clientWidth, behavior:'smooth' });
      return;
    }
    const arrivalZoom = event.target.closest('[data-arrival-zoom]');
    if (arrivalZoom) {
      const route = data.content.checkin.find((item) => item.type === 'arrivalCarousel');
      lightboxItems = route.items.map((slide) => [slide.image, 'arrival', slide.title, { wayfinding:Boolean(slide.wayfinding), nightNotice:Boolean(slide.nightNotice) }]);
      lightboxTitle = null;
      openLightbox(Number(arrivalZoom.dataset.arrivalZoom));
      return;
    }
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
  $('#phoneDialog').addEventListener('click', (event) => { if (event.target === $('#phoneDialog')) $('#phoneDialog').close(); });
  window.addEventListener('popstate', (event) => navigate(event.state?.route || 'home', { fromHistory: true, instant: true }));
  window.addEventListener('scroll', () => { if (currentRoute === 'home') $('#topbar').classList.toggle('scrolled', window.scrollY > 52); }, { passive: true });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeDrawer(); closeLanguage(); } });

  let touchStart = 0;
  $('#lightbox').addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
  $('#lightbox').addEventListener('touchend', (event) => { const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) shiftLightbox(distance > 0 ? -1 : 1); }, { passive: true });

  $$('[data-gallery-swipe-area]').forEach((area) => {
    let galleryTouchStart = 0;
    area.addEventListener('touchstart', (event) => { galleryTouchStart = event.touches[0].clientX; }, { passive: true });
    area.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - galleryTouchStart;
      if (Math.abs(distance) < 42) return;
      selectGallery(galleryState.gallery + (distance < 0 ? 1 : -1), true);
    }, { passive: true });
  });

  let heroReady = false;
  let heroIndex = 0;
  let heroPointerStart = null;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHero(index) {
    const slides = $$('.hero-image', $('#hero'));
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, itemIndex) => slide.classList.toggle('is-active', itemIndex === heroIndex));
    $$('.hero-counter span').forEach((node, itemIndex) => node.classList.toggle('active', itemIndex === heroIndex));
    $('.hero-counter').setAttribute('aria-label', `${uiText().image} ${heroIndex + 1} / ${slides.length}`);
  }

  async function startHeroSequence() {
    const hero = $('#hero');
    const sources = [
      '/assets/images/photographer-202608/livingroom-03-home-crop-v50.png',
      '/assets/images/photographer-202608/livingroom-01-home-crop-v54.png',
      '/assets/images/photographer-202608/livingroom-04-home-crop-v54.png',
      '/assets/images/photographer-202608/R1-NEMO-home-crop-v56.png'
    ];
    await Promise.all(sources.map((src) => {
      const image = new Image();
      image.src = src;
      return typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
    }));
    hero.classList.add('sequence-started');
    const revealHeroText = () => requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('motion-ready')));
    if (document.visibilityState === 'hidden') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') revealHeroText();
      }, { once: true });
    } else {
      revealHeroText();
    }
    if (reduceMotion) {
      heroReady = true;
      hero.classList.add('ready');
      return;
    }
    setTimeout(() => setHero(1), 2400);
    setTimeout(() => setHero(2), 4800);
    setTimeout(() => setHero(3), 7200);
    setTimeout(() => setHero(0), 9600);
    setTimeout(() => {
      heroReady = true;
      hero.classList.add('ready');
    }, 10200);
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
    const selector = '.intro,.quick-section,.stay-signature,.editorial-room-preview,.location-teaser,.home-discovery,.home-guide-section,.ota-section,.content-card,.appliance-card,.rule-item,.stay-flow-overview,.stay-flow-group,.wifi-network-card';
    const mediaSelector = '.signature-photo,.editorial-mosaic button,.gallery-viewer,.gallery-thumb,.photo-card,.menu-photo-hero';
    const staggerGroups = '.essential-grid,.editorial-mosaic,.home-discovery-grid,.home-guide-links,.ota-booking-grid,.content-stack,.appliance-list,.gallery-thumbs';
    const observer = 'IntersectionObserver' in window && !reduceMotion
      ? new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.1, rootMargin: '0px 0px -5% 0px' })
      : null;
    const observeNode = (node, index = 0) => {
        if (node.dataset.motionObserved === 'true') return;
        node.dataset.motionObserved = 'true';
        node.classList.add('motion-item');
        node.style.setProperty('--stagger', `${Math.min(index, 7) * 55}ms`);
        if (observer) observer.observe(node); else node.classList.add('is-visible');
    };
    const observe = (root = document) => {
      $$(selector, root).forEach((node, index) => observeNode(node, index));
      $$(mediaSelector, root).forEach((node, index) => {
        node.classList.add('motion-media');
        observeNode(node, index);
      });
      $$(staggerGroups, root).forEach((group) => [...group.children].forEach((child, index) => {
        child.style.setProperty('--stagger', `${Math.min(index, 7) * 55}ms`);
      }));
    };
    observe();
    new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length)) observe();
    }).observe($('#main'), { childList: true, subtree: true });
  }

  $('#hero').addEventListener('pointerdown', (event) => { if (heroReady) heroPointerStart = event.clientX; });
  $('#hero').addEventListener('pointerup', (event) => {
    if (heroPointerStart == null) return;
    const delta = event.clientX - heroPointerStart;
    heroPointerStart = null;
    if (Math.abs(delta) >= 42) setHero(heroIndex + (delta < 0 ? 1 : -1));
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.remove('motion-ready');
      requestAnimationFrame(() => document.body.classList.add('motion-ready'));
      if (!heroReady) startHeroSequence();
    }
  });

  applyTranslations();
  renderOta();
  const initialRoute = history.state?.route || 'home';
  history.replaceState({ route: initialRoute }, '', location.pathname + location.search);
  navigate(initialRoute, { fromHistory: true, instant: true });
  initMotion();
  initIntroAndHero();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('/sw.js?v=80', { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => {});
  }
})();
