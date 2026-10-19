import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('index.html', 'utf8');
const data = fs.readFileSync('assets/data.js', 'utf8');
const app = fs.readFileSync('assets/app.js', 'utf8');
const css = fs.readFileSync('assets/styles.css', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const approved = JSON.parse(fs.readFileSync('docs/approved_spec.json', 'utf8'));

const dataContext = { window:{} };
vm.runInNewContext(data, dataContext);
const stayData = dataContext.window.STAY_NEMO_DATA;

test('aircon annotations use the photographed AC buttons and an unshrunk image in all five languages', () => {
  const render = app.match(/function airconRemoteGuideMarkup\(\) \{[\s\S]*?\n  \}/)?.[0];
  const labels = app.match(/const uiText = \(\) => \(\{[\s\S]*?\}\)\[language\];/)?.[0];
  assert.ok(render && labels);
  for (const language of ['ko','en','ja','zh','zh-TW']) {
    const context = {language, esc:String};
    vm.runInNewContext(labels+'\n'+render+'\nvar markup=airconRemoteGuideMarkup(); var translated=uiText();', context);
    for (const key of ['power','mode','temperature','fan']) assert.ok(context.markup.includes(context.translated[key]));
    for (const [key,points] of Object.entries({power:[[275,695]],mode:[[370,695]],temperature:[[280,778],[286,856]],fan:[[374,778]]})) {
      const group = context.markup.match(new RegExp('data-aircon-control="'+key+'">([\\s\\S]*?)</g>'))?.[1];
      assert.ok(group, key);
      for (const [x,y] of points) assert.ok(group.includes('cx="'+x+'" cy="'+y+'"'), key);
    }
  }
  const imageRule = css.match(/\.aircon-remote-guide>img\{([^}]+)\}/)?.[1];
  for (const rule of ['position:absolute','inset:0','width:100%','height:100%','max-width:none','max-height:none','object-fit:fill']) assert.ok(imageRule.includes(rule), rule);
});

test('OTA renders three safe booking links with translated calls to action in five languages', () => {
  const render = app.match(/function renderOta\(\) \{[\s\S]*?\n  \}/)?.[0];
  const labels = app.match(/const uiText = \(\) => \(\{[\s\S]*?\}\)\[language\];/)?.[0];
  assert.ok(render);
  assert.ok(labels);
  const expected={ko:'예약하기',en:'Book now',ja:'予約する',zh:'立即预订','zh-TW':'立即預訂'};
  for(const language of Object.keys(expected)){
    const target={innerHTML:''};
    const context={language, config:dataContext.window.STAY_NEMO_CONFIG,esc:String,$:()=>target};
    vm.runInNewContext(labels+'\n'+render+'\nrenderOta();',context);
    assert.equal((target.innerHTML.match(/<a /g)||[]).length,3);
    assert.equal((target.innerHTML.match(/target="_blank" rel="noopener noreferrer"/g)||[]).length,3);
    assert.equal((target.innerHTML.match(new RegExp('<small>'+expected[language]+'</small>','g'))||[]).length,3);
    for(const url of Object.values(context.config.otaLinks)) assert.ok(target.innerHTML.includes('href="'+url+'"'));
    assert.doesNotMatch(target.innerHTML,/agoda|Coming soon|준비|準備|即將開放|即将开放/);
    assert.ok(stayData.translations.otaTitle[language]);
    assert.ok(stayData.translations.otaBody[language]);
    assert.doesNotMatch(stayData.translations.otaTitle[language]+stayData.translations.otaBody[language],/soon|준비|まもなく|准备中|準備中|即將開放|即将开放/);
  }
  assert.match(app,/otaButton\?\.tagName === 'A'/);
});

test('CJK copy wraps naturally without changing Korean typography or shrinking text', () => {
  assert.match(css, /html:is\(:lang\(ja\), :lang\(zh\)\)/);
  assert.match(css, /word-break:normal;\s+overflow-wrap:break-word;\s+line-break:strict/);
  assert.match(css, /\.departure-info-copy,\.stay-split-card>div\{min-width:0\}/);
});

test('night entrance warning remains highlighted and translated in the lightbox', () => {
  const fn = app.match(/function updateLightbox\(\) \{[\s\S]*?\n  \}/)?.[0];
  assert.ok(fn);
  const slide = stayData.content.checkin.find(item => item.type === 'arrivalCarousel').items.find(item => item.nightNotice);
  assert.match(app, /nightNotice:Boolean\(slide.nightNotice\)/);
  assert.match(css, /\.lightbox.has-night-notice #lightboxOverlay\{display:block\}/);
  for (const lang of ['ko','en','ja','zh','zh-TW']) {
    const classes = new Map();
    const nodes = {'#lightboxImage':{}, '#lightboxCaption':{}, '#lightboxOverlay':{}, '#lightbox':{classList:{toggle:(key,value)=>classes.set(key,value)}}};
    const context = { lightboxItems:[[slide.image,'arrival',slide.title,{nightNotice:true}]], lightboxIndex:0, lightboxTitle:null, tr:value=>value[lang], esc:String, $:selector=>nodes[selector] };
    vm.runInNewContext(fn, context);
    context.updateLightbox();
    assert.equal(classes.get('has-night-notice'), true);
    assert.equal(nodes['#lightboxOverlay'].innerHTML, '<span class="arrival-night-notice">'+slide.title[lang]+'</span>');
    context.lightboxItems = [['building-entrance.webp','arrival',slide.title,{}]];
    context.updateLightbox();
    assert.equal(classes.get('has-night-notice'), false);
    assert.equal(nodes['#lightboxOverlay'].innerHTML, '');
  }
});

test('three approved OTA links are live without dates and host phone is internationally dialable', () => {
  const links = dataContext.window.STAY_NEMO_CONFIG.otaLinks;
  assert.deepEqual(Object.keys(links), ['airbnb','booking','trip']);
  assert.equal(links.airbnb, 'https://airbnb.co.kr/h/nemohada2');
  assert.equal(links.booking, 'https://www.booking.com/hotel/kr/stay-nemo-seoul-myeongdong-seoulsi.ko.html');
  assert.equal(links.trip, 'https://kr.trip.com/hotels/cityname-hotel-detail-135623092/hotelname/');
  for (const url of Object.values(links)) {
    assert.equal(new URL(url).protocol, 'https:');
    assert.equal(new URL(url).search, '');
  }
  assert.doesNotMatch(app, /agoda/i);
  assert.doesNotMatch(serviceWorker, /agoda/i);
  assert.equal(dataContext.window.STAY_NEMO_CONFIG.contact.phone, '+821059043538');
  const microwave = stayData.appliances.find(item => item.icon === 'microwave');
  for (const lang of ['ko','en','ja','zh','zh-TW']) assert.ok(microwave.manualLabel[lang]);
  assert.match(app, /tr\(item.manualLabel\) \|\| labels.manual/);
});

test('luggage copy renders three separate bullets in all five languages', () => {
  const fn = app.match(/function stayListMarkup\(text\) \{[\s\S]*?\n  \}/)?.[0];
  assert.ok(fn);
  const context = { esc: value => String(value) };
  vm.runInNewContext(fn, context);
  const text = stayData.content.checkin.find(item => item.icon === 'luggage').text;
  for (const lang of ['ko', 'en', 'ja', 'zh', 'zh-TW']) {
    const markup = context.stayListMarkup(text[lang]);
    assert.equal((markup.match(/<li>/g) || []).length, 3, lang);
    assert.equal(markup.replace(/<[^>]+>/g, '').replace(/\s/g, ''), text[lang].replace(/\s/g, ''), lang);
  }
  assert.match(css, /list-style:disc outside/);
});

test('night access card renders each sentence as a bullet in all five languages', () => {
  const card = stayData.content.transport.find(item => item.type === 'notice' && item.title?.ko === '야간 출입');
  const photo = stayData.content.transport.find(item => item.image === 'doorlock-night-clean-v2.png');
  for (const lang of ['ko', 'en', 'ja', 'zh', 'zh-TW']) {
    const context = { esc: String, tr: value => value[lang], iconMarkup: () => '' };
    for (const name of ['stayListMarkup', 'staySplitCard']) {
      const fn = app.match(new RegExp(`function ${name}\\([^]*?\\n  \\}`))?.[0];
      assert.ok(fn);
      vm.runInNewContext(fn, context);
    }
    const markup = context.staySplitCard(card, photo, 'night');
    assert.equal((markup.match(/<li>/g) || []).length, 2, lang);
    const list = markup.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)[1];
    assert.equal(list.replace(/<[^>]+>/g, '').replace(/\s/g, ''), card.text[lang].replace(/\s/g, ''), lang);
    assert.match(markup, /doorlock-night-clean-v2\.png/);
  }
});

test('check-in guidance retains compact bullets except parking and three checkout cards in five languages', () => {
  for (const language of ['ko', 'en', 'ja', 'zh', 'zh-TW']) {
    const target = { innerHTML: '' };
    const context = { data:stayData, language, esc:String, tr:value => typeof value === 'string' ? value : value[language], iconMarkup:() => '', config:{maps:{naver:'#naver',google:'#google'}}, $:() => target, initArrivalCarousels:() => {} };
    for (const name of ['contentCard','stayListMarkup','stayGuideCard','staySplitCard','parkingGuideCard','departureInfoCard','departureEssentials','renderStayFlow']) {
      const fn = app.match(new RegExp(`function ${name}\\([^]*?\\n  \\}`))?.[0];
      assert.ok(fn, name);
      vm.runInNewContext(fn, context);
    }
    context.renderStayFlow();
    const markup = target.innerHTML;
    assert.equal((markup.match(/<ul class="stay-guide-points">/g) || []).length, 4, language);
    assert.equal((markup.match(/<p>/g) || []).length, 6, 'address, parking, checkout introduction and three checkout cards use paragraphs');
    const intro = context.departureEssentials().match(/<header>([\s\S]*?)<\/header>/)[1];
    assert.doesNotMatch(intro, /<ul|<li/);
    assert.match(intro, /<p>[^<]+<\/p>/);
    assert.doesNotMatch(markup, /<ol|undefined|<li>\s*<\/li>/);
    const cards = [stayData.content.checkin[0], stayData.content.checkin.find(x => x.icon === 'luggage'), ...stayData.content.transport.filter(x => x.title?.ko === '야간 출입')];
    for (const card of cards) {
      const list = context.stayListMarkup(card.text[language]);
      assert.ok(markup.includes(list), card.title[language]);
      assert.equal(list.replace(/<[^>]+>/g, '').replace(/\s/g, ''), card.text[language].replace(/\s/g, ''));
    }
    const checklist = stayData.content.checkout.find(x => x.type === 'steps');
    assert.equal((context.stayGuideCard(checklist).match(/<li>/g) || []).length, 5);
    const parking = stayData.content.transport.find(x => x.icon === 'local_parking');
    const parkingMarkup = context.parkingGuideCard(parking);
    assert.doesNotMatch(parkingMarkup, /<ul|<li|<br/);
    assert.ok(parkingMarkup.includes(`<p>${parking.text[language]}</p>`));
    for (const [kind, icon] of [['waste','delete'], ['climate','climate_power'], ['timing',null]]) {
      const item = stayData.content.checkout.find(x => icon ? x.icon === icon : x.type === 'notice');
      const cardMarkup = context.departureInfoCard(item, kind, 1);
      assert.doesNotMatch(cardMarkup, /<ul|<li|<br/);
      assert.ok(cardMarkup.includes(`<p>${item.text[language]}</p>`));
    }
  }
  assert.match(css, /\.stay-guide-points li::marker\{font-size:\.65em\}/);
  assert.match(css, /\.stay-guide-points li\+li\{margin-top:6px\}/);
});

test('luggage storage uses the supplied photo and lock advice in all five languages', () => {
  const card = stayData.content.checkin.find(item => item.icon === 'luggage');
  const photo = stayData.content.checkin.find(item => item.image === 'guest-storage-v72.png');
  assert.ok(photo);
  assert.ok(fs.existsSync('assets/images/' + photo.image));
  const endings = {
    ko:'잠금장치 비밀번호는 사전에 호스트에게 문의 바랍니다.',
    en:'Please contact the host in advance for the lock combination.',
    ja:'錠の暗証番号は事前にホストへお問い合わせください。',
    zh:'请提前向房东询问锁具密码。',
    'zh-TW':'請事先向房東詢問鎖具密碼。'
  };
  for (const [lang, text] of Object.entries(endings)) assert.ok(card.text[lang].endsWith(text), lang);
  assert.match(app, /item\.image === 'guest-storage-v72\.png'/);
  assert.match(css, /\.stay-split-card\.luggage figure img\{height:auto;object-fit:contain\}/);
});

test('AI concierge is fully removed without breaking the home scroll target', () => {
  for (const source of [html, app, css, data]) {
    assert.doesNotMatch(source, /concierge|chatPanel|chatInput|openChatFab|renderSearchResults|api\.openai\.com|OPENAI_API_KEY/i);
  }
  assert.match(html, /data-scroll-target="stayIntro"/);
  assert.match(html, /class="intro section-pad" id="stayIntro"/);
  assert.equal(approved.aiConcierge.enabled, false);
  assert.ok(!approved.masterParity.requiredHomeElements.includes('concierge search'));
});

test('brand and required mobile structure exist', () => {
  assert.match(html, /STAY NEMO/);
  assert.match(html, /bottom-nav/);
  assert.match(html, /data-screen="gallery"/);
  assert.doesNotMatch(html, /data-screen="bathroom"/);
  assert.match(html, /data-screen="appliances"/);
  assert.match(html, /data-screen="nearby"/);
  assert.match(html, /data-screen="tours"/);
  assert.doesNotMatch(html, /data-screen="guide"/);
  assert.doesNotMatch(html, /data-route="guide"/);
  assert.doesNotMatch(html, /gallery-tabs/);
  assert.match(html, /data-gallery-category="common"[\s\S]*data-gallery-category="nemo"[\s\S]*data-gallery-category="hada"[\s\S]*data-gallery-category="bathroom"/);
  assert.match(html, /id="otaBookingGrid"/);
  assert.doesNotMatch(html, /id="otaGrid"/);
});

test('all localized content objects contain all five languages including Taiwan Traditional Chinese', () => {
  const required = ['ko', 'en', 'ja', 'zh', 'zh-TW'];
  const missing = [];
  const visit = (value, path = 'data') => {
    if (!value || typeof value !== 'object') return;
    if (Object.prototype.hasOwnProperty.call(value, 'ko')) {
      required.forEach((lang) => {
        if (!Object.prototype.hasOwnProperty.call(value, lang) || value[lang] == null || value[lang] === '') missing.push(`${path}.${lang}`);
      });
    }
    Object.entries(value).forEach(([key, child]) => visit(child, `${path}.${key}`));
  };
  visit(stayData);
  assert.deepEqual(missing, []);
  stayData.appliances.forEach((item) => required.forEach((lang) => assert.equal(item.guideImages[lang].length, item.guideCaptions[lang].length)));
  assert.match(app, /figcaption class="appliance-guide-caption"/);
  assert.match(app, /<figcaption>\$\{esc\(tr\(slide\.title\)\)\}<\/figcaption>/);
  assert.match(app, /function airconRemoteGuideMarkup/);
  assert.match(app, /const labels = uiText\(\)/);
  assert.match(html, /data-i18n-aria-label/);
  assert.match(html, /data-i18n-alt/);
});

test('social sharing thumbnail uses the approved crop-safe editorial image', () => {
  assert.match(html, /stay-nemo-og-20260820-v65\.png/);
  assert.doesNotMatch(html, /stay-nemo-og-20260813\.png/);
  assert.match(html, /og:image:width" content="1729"/);
  assert.match(html, /og:image:height" content="910"/);
  assert.ok(fs.existsSync('assets/images/stay-nemo-og-20260820-v65.png'));
});

test('five languages and configurable OTA links exist', () => {
  for (const lang of ['ko', 'en', 'ja', 'zh', 'zh-TW']) assert.ok(data.includes(lang));
  assert.match(html, /data-lang="zh-TW" lang="zh-TW"/);
  assert.match(html, /繁體中文（台灣）/);
  assert.match(html, /简体中文/);
  for (const ota of ['airbnb', 'booking', 'trip']) assert.ok(dataContext.window.STAY_NEMO_CONFIG.otaLinks[ota]);
});

test('Taiwan translation preserves media paths, array shapes, and practical terminology', () => {
  let count = 0;
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Object.hasOwn(value, 'ko')) {
      count++;
      assert.equal(typeof value['zh-TW'], typeof value.zh);
      if (Array.isArray(value.zh)) {
        assert.equal(value['zh-TW'].length, value.zh.length);
        value.zh.forEach((text, index) => {
          if (/^https?:/.test(text)) assert.equal(value['zh-TW'][index], text);
          if (/^guides\//.test(text)) {
            assert.equal(value['zh-TW'][index], text.endsWith('.svg') ? text.replace(/-(?:en|zh)(?=-|\.)/, '-zh-TW') : text);
            assert.ok(fs.existsSync(`assets/images/${value['zh-TW'][index]}`));
          }
        });
      }
    }
    Object.values(value).forEach(visit);
  };
  visit(stayData);
  // v70 removes 12 chatbot labels and 20 search-only card translations.
  assert.ok(count >= 514);
  assert.match(JSON.stringify(stayData.appliances.map(item=>item.title['zh-TW'])), /冷氣/);
  const arrival = stayData.content.checkin.find(item=>item.type==='arrivalCarousel');
  assert.match(arrival.items.find(item=>item.nightNotice).title['zh-TW'], /19:30~07:30.*驗證/);
});

test('every non-Korean appliance diagram uses its selected language, not an English fallback', () => {
  for (const lang of ['en', 'ja', 'zh', 'zh-TW']) {
    for (const appliance of stayData.appliances) {
      for (const file of appliance.guideImages[lang]) {
        assert.ok(fs.existsSync(`assets/images/${file}`));
        if (file.endsWith('.svg')) {
          assert.ok(file.includes(`-${lang}-`) || file.endsWith(`-${lang}.svg`), `${lang}: ${file}`);
          const svg = fs.readFileSync(`assets/images/${file}`, 'utf8');
          assert.match(svg, /<svg/);
          if (lang !== 'en') assert.doesNotMatch(svg, />OPEN A STREAMING APP<|>SAFE COOKING<|>RUN WHILE COOKING<|>POWER LEVEL</);
        } else {
          assert.ok(['guides/aircon-remote-source-v61.webp', 'guides/tv-remote-clean-v46.png'].includes(file), `Untranslated raster guide: ${file}`);
        }
      }
    }
  }
  assert.match(css, /\.language-menu\{position:absolute;z-index:120;top:60px;right:14px;/);
  assert.match(app, /temperature:'Temp\. \+ \/ −'/);
});

test('routing, lightbox, copy, and service worker are wired', () => {
  assert.match(app, /function navigate/);
  assert.match(app, /openLightbox/);
  assert.match(app, /navigator\.clipboard/);
  assert.match(app, /history\.replaceState/);
  assert.doesNotMatch(app, /location\.hash/);
  assert.match(app, /serviceWorker\.register/);
});

test('approved brand palette and cache revision are applied', () => {
  for (const color of ['#42413e', '#f4f0e8', '#6d4a34', '#b08a4a', '#26231f']) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }
  assert.equal(approved.approvalStatus, 'approved');
  assert.match(serviceWorker, /staynemo-v80/);
  assert.match(html, /brand-intro-overlay/);
  assert.doesNotMatch(html, /ai-concierge-bot-hanbok\.webp/);
  assert.match(html, /home-discovery/);
  assert.match(html, /logo-staynemo-official\.png/);
  assert.match(html, /logo-staynemo-symbol-official\.png/);
  const homeHero = html.match(/<section class="hero"[\s\S]*?<div class="hero-shade"/)?.[0] || '';
  for (const photo of ['livingroom-03-home-crop-v50.png', 'livingroom-01-home-crop-v54.png', 'livingroom-04-home-crop-v54.png', 'R1-NEMO-home-crop-v56.png']) assert.match(homeHero, new RegExp(photo.replace('.', '\\.')));
  assert.ok(homeHero.indexOf('livingroom-03-home-crop-v50.png') < homeHero.indexOf('livingroom-01-home-crop-v54.png'));
  assert.ok(homeHero.indexOf('livingroom-01-home-crop-v54.png') < homeHero.indexOf('livingroom-04-home-crop-v54.png'));
  assert.ok(homeHero.indexOf('livingroom-04-home-crop-v54.png') < homeHero.indexOf('R1-NEMO-home-crop-v56.png'));
  assert.doesNotMatch(homeHero, /livingroom-02-home-crop-v54\.png/);
  assert.doesNotMatch(homeHero, /livingroom-0[124]\.webp|hero-main-professional|R1-NEMO-03/);
  assert.equal((homeHero.match(/class="hero-fit-image"/g) || []).length, 4);
  assert.match(app, /slides\.length/);
  assert.match(html, /이미지 1 \/ 4/);
  assert.match(css, /background-size:contain/);
  assert.match(css, /background-image:var\(--hero-photo\)/);
  assert.match(css, /wifi-network-grid/);
  assert.doesNotMatch(html, /tel:01059043538/);
  assert.match(html, /data-phone-reveal/);
  assert.match(app, /phoneCallAction/);
  assert.match(html, /menu-photo-hero/);
  for (const hero of ['stay-nemo-entrance.webp', 'livingroom-01.webp', 'livingroom-02.webp', 'livingroom-03.webp', 'livingroom-04.webp']) assert.match(html, new RegExp(hero.replace('.', '\\.')));
  assert.match(html, /checkinOutGuide/);
  for (const logo of ['airbnb-official.svg', 'booking-com-official.svg', 'trip-com-official.svg']) assert.ok(app.includes(logo));
  assert.doesNotMatch(data, /추천 근교 투어/);
  assert.match(data, /근교 추천 투어/);
  const frequentSection = html.match(/<section class="home-guide-section[\s\S]*?<\/section>/)?.[0] || '';
  assert.doesNotMatch(frequentSection, /data-route="contact"/);
});

test('find-us page follows the approved arrival hierarchy', () => {
  assert.match(app, /function transportOverviewCard/);
  assert.match(app, /NEAREST STATION/);
  assert.match(app, /LAST MILE/);
  assert.match(app, /transport-station-accordion[^>]*" open/);
  assert.match(app, /data\.content\.checkin\.find\(\(entry\) => entry\.type === 'arrivalCarousel'\)/);
  assert.match(app, /function renderTransport/);
  assert.match(css, /transport-overview-card/);
  assert.match(css, /transport-facts/);
  assert.match(app, /록갈비 을지로점 건물/);
  assert.match(app, /landmark:'LANDMARK'/);
  assert.match(app, /stationValue:'을지로3가역'/);
  assert.match(app, /lastMileValue:'7, 8번 출구에서 도보 1분'/);
  assert.match(app, /const facts = \[\[transportIcon\('subway'\), labels\.station[\s\S]*labels\.lastMile[\s\S]*labels\.landmark/);
  assert.doesNotMatch(app, /String\(index \+ 1\)\.padStart\(2,'0'\)/);
  assert.match(app, /function stationDirectionsCard/);
  assert.match(css, /station-elevator-highlight/);
  assert.match(css, /station-elevator-highlight\{position:absolute;left:56%;top:40%;width:31%;height:43%/);
  assert.match(css, /v25: slightly larger type scale/);
  assert.match(css, /body\{font-size:17px\}/);
  assert.match(app, /function staySplitCard/);
  assert.match(app, /function parkingGuideCard/);
  assert.match(app, /function departureEssentials/);
  assert.match(app, /function departureInfoCard/);
  assert.match(css, /departure-info-card\{display:grid;grid-template-columns:46%/);
  assert.match(css, /departure-info-card\.climate/);
  assert.match(css, /departure-info-card\.timing/);
  assert.match(app, /checkin-editorial-flow/);
  assert.match(css, /stay-split-card\.luggage\{grid-template-columns:46%/);
  assert.match(css, /stay-split-card\.night\{grid-template-columns:minmax\(0,1fr\) 34%/);
  assert.match(data, /서울시 중구 을지로3가 296-24/);
  assert.match(data, /서울시 중구 을지로16길 26/);
  assert.match(app, /item\.icon === 'local_taxi' && item\.title\?\.ko === '택시로 올 때'/);
  assert.match(css, /transport-station-body \.arrival-carousel\{overflow:hidden;scroll-snap-type:none/);
  assert.match(data, /exterior-from-exit8\.webp[\s\S]*exterior-entry-side-clean-v2\.png[\s\S]*building-entrance\.webp[\s\S]*ground-door\.webp/);
  assert.match(data, /exterior-entry-side-clean-v2\.png', wayfinding:true/);
  assert.match(data, /doorlock-night-clean-v2\.png', nightNotice:true/);
  assert.match(app, /class="arrival-night-notice"/);
  assert.match(app, /slide\.nightNotice \? '' : `<figcaption>/);
  assert.match(css, /\.arrival-night-notice\{[^}]*top:12px;[^}]*background:#f2c94c;[^}]*font-size:15px;[^}]*font-weight:900/);
  assert.match(css, /\.arrival-night-notice\{[^}]*overflow-wrap:anywhere/);
  assert.match(css, /\.arrival-slide\.has-night-notice figcaption\{display:none\}/);
  assert.match(app, /item\.image === 'doorlock-night-clean-v2\.png' \|\| item\.icon === 'local_parking'/);
});

test('editorial gallery uses corrected photographs and requested removals', () => {
  assert.match(css, /grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
  assert.match(css, /heroTextIn/);
  assert.match(css, /background-size:cover!important/);
  assert.match(css, /background-position:26% center/);
  assert.doesNotMatch(data, /common-03\.webp/);
  assert.doesNotMatch(data, /room-nemo-02\.webp/);
  assert.match(data, /photographer-202608\/livingroom-02\.webp/);
  assert.match(data, /photographer-202608\/R1-NEMO-03\.webp','nemo'/);
  assert.ok(data.indexOf("photographer-202608/R1-NEMO-03.webp','nemo'") < data.indexOf("photographer-202608/R1-NEMO-01.webp','nemo'"));
  assert.match(data, /photographer-202608\/R2-HADA-bathroom\.webp/);
  assert.match(html, /gallery-story/);
  assert.match(data, /storyDetail/);
  assert.match(app, /lightboxItems = galleryItems\(\)/);
  assert.doesNotMatch(html, /class="gallery-viewer"/);
  assert.match(html, /photographer-202608\/stay-nemo-entrance\.webp/);
  assert.ok(fs.existsSync('assets/images/logo-staynemo-official.png'));
  assert.ok(fs.existsSync('assets/images/logo-staynemo-symbol-official.png'));
  assert.ok(fs.existsSync('assets/images/platforms/agoda-transparent.png'));
  assert.match(app, /appliance-guide-carousel/);
  assert.match(data, /microwave-panel-ko\.svg/);
  assert.match(data, /tv-remote-clean-v46\.png/);
  assert.match(data, /guides\/aircon-remote-source-v61\.webp','guides\/official-samsung-ko-v61\.webp/);
  assert.match(app, /<img src="\/assets\/images\/guides\/aircon-remote-source-v61\.webp"/);
  assert.match(app, /function tvRemoteGuideMarkup/);
  assert.match(app, /remote-leader-ott/);
  assert.match(app, /remote-leader-ott"><path d="M302 820 H340 V760 H385"\/><circle cx="385" cy="760" r="10"\/><\/g>/);
  assert.doesNotMatch(app, /cx="640" cy="760"|cx="640" cy="838"/);
  assert.match(css, /stroke-width:7/);
  assert.match(css, /#hero \.hero-image::before,[\s\S]*#hero \.hero-image::after\{display:none!important\}/);
  assert.match(css, /#hero \.hero-fit-image\{[\s\S]*inset:0;[\s\S]*width:100%;[\s\S]*height:100%;[\s\S]*object-fit:cover;[\s\S]*object-position:center center;[\s\S]*transform:none/);
  assert.match(app, /register\('\/sw\.js\?v=80', \{ updateViaCache: 'none' \}\)/);
  assert.doesNotMatch(app, /mediaSelector = '[^']*\.appliance-guide-slide/);
  assert.match(html, /brand-intro-logo-frame/);
  assert.match(css, /\.brand-intro-logo-frame\{[^}]*transform:translate\(-3\.82%,-3\.91%\)/);
  assert.match(css, /#hero \.hero-content\{[\s\S]*padding:0!important;[\s\S]*background:transparent!important;[\s\S]*backdrop-filter:none!important/);
  assert.match(css, /#hero \.hero-image\{[\s\S]*transform:none!important/);
  assert.match(css, /#hero \.hero-image\{[\s\S]*background:#000!important/);
  assert.match(data, /Haatz IH-232S · Haatz B60/);
  assert.match(app, /renderRecommendations\('nearby'\)/);
  assert.match(app, /renderRecommendations\('tours'\)/);
  assert.match(app, /host\.style\.display = showHostBanner \? '' : 'none'/);
  assert.match(css, /recommendation-host\[hidden\]\{display:none!important\}/);
  assert.doesNotMatch(app, /recommendation-credit/);
  assert.doesNotMatch(css, /recommendation-credit/);
  assert.match(app, /item\.image\)}\?v=32/);
  assert.match(data, /id:'taegeukdang'/);
  assert.match(data, /id:'daehangno'/);
  assert.match(app, /appliance-header-model/);
  assert.match(app, /images\.length === 1 \? 'is-single'/);
  assert.doesNotMatch(app, /appliance-photo/);
  assert.doesNotMatch(app, /gallery-thumb-caption/);
  assert.doesNotMatch(app, /function renderGuides/);
  assert.match(data, /exterior-from-exit8\.webp/);
  assert.match(data, /exterior-entry-side-clean-v2\.png/);
  assert.match(data, /arrivalCarousel/);
  assert.match(data, /airportAccess/);
  assert.match(data, /transportTitle: L\('찾아오는 길'/);
  assert.doesNotMatch(data, /title:L\('을지로3가역에서'/);
  assert.match(data, /arrivalCarousel[\s\S]*exterior-from-exit8\.webp[\s\S]*ground-door\.webp[\s\S]*building-entrance\.webp/);
  assert.ok(data.indexOf("transport: [") < data.indexOf("{ type:'airportAccess'"));
  assert.ok(data.indexOf("{ type:'airportAccess'") < data.indexOf("{ type:'destination'", data.indexOf("transport: [")));
  assert.match(app, /arrivalWayfindingMarkup/);
  assert.match(app, /arrival-sign-outline/);
  assert.match(app, /transportIcon/);
  assert.match(app, /airport_bus/);
  assert.match(app, /airport-route-step/);
  assert.match(data, /공항버스 6015/);
  assert.match(data, /AREX 공항철도/);
  assert.match(html, /lightboxOverlay/);
  assert.match(data, /climate_power/);
  assert.match(app, /arrival-carousel/);
  assert.match(app, /airport-accordion/);
  assert.match(data, /doorlock-night-clean-v2\.png/);
  assert.match(data, /19:30~07:30 출입 시에만 추가 인증 필요/);
  assert.match(data, /을지로3가 방향으로 약 6분 이동하세요/);
  assert.match(data, /guest-storage-v72\.png/);
  assert.match(data, /recycling\.webp/);
  assert.match(data, /maps\/search\/\?api=1/);
});

test('restaurant and tour recommendations each contain at least twenty places', () => {
  assert.ok(stayData.nearby.places.length >= 20);
  assert.ok(stayData.tours.places.length >= 20);
  assert.ok(fs.existsSync('assets/images/restaurants/jinokhwa.webp'));
  for (const item of [...stayData.nearby.places, ...stayData.tours.places]) {
    assert.ok(fs.existsSync(`assets/images/${item.image}`), `missing recommendation image: ${item.image}`);
  }
});

test('drawer restores icons, subtitles and the approved nine-item order', () => {
  assert.match(app, /const drawerRoutes = \['home', 'gallery', 'transport', 'checkin', 'wifi', 'appliances', 'rules', 'nearby', 'tours'\]/);
  assert.match(app, /스테이 네모 처음 화면/);
  assert.match(app, /다이닝·객실·욕실 사진/);
  assert.match(app, /drawer-menu-icon/);
  assert.match(app, /drawer-menu-copy/);
  assert.match(app, /공항과 역에서 숙소까지/);
  assert.match(app, /함께 지키는 숙소 이용 안내/);
  assert.doesNotMatch(app, /class="drawer-index"/);
  assert.match(css, /\.drawer-menu-copy small/);
  assert.match(css, /\.drawer-menu-icon/);
});

test('house rules use embedded icons without unsupported English ligatures', () => {
  assert.match(app, /function ruleIcon/);
  assert.match(app, /class="rule-icon"/);
  assert.doesNotMatch(app, /<span class="mi">\$\{icon\}<\/span>/);
  assert.match(css, /\.rule-icon svg/);
});
