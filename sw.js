const CACHE = 'staynemo-v80';
const CORE = [
  '/assets/images/guest-storage-v72.png',
  '/',
  '/index.html',
  '/assets/styles.css?v=80',
  '/assets/data.js?v=80',
  '/assets/app.js?v=80',
  '/assets/images/guides/tv-guest-flow-ja-v2.svg',
  '/assets/images/guides/tv-account-guide-ja-v2.svg',
  '/assets/images/guides/induction-guide-ja-v2.svg',
  '/assets/images/guides/hood-guide-ja-v2.svg',
  '/assets/images/guides/microwave-panel-ja.svg',
  '/assets/images/guides/tv-guest-flow-zh-v2.svg',
  '/assets/images/guides/tv-account-guide-zh-v2.svg',
  '/assets/images/guides/induction-guide-zh-v2.svg',
  '/assets/images/guides/hood-guide-zh-v2.svg',
  '/assets/images/guides/microwave-panel-zh.svg',
  '/assets/images/guides/aircon-quick-en-v67.svg',
  '/assets/images/guides/washer-quick-en-v67.svg',
  '/assets/images/guides/aircon-quick-ja-v67.svg',
  '/assets/images/guides/washer-quick-ja-v67.svg',
  '/assets/images/guides/aircon-quick-zh-v67.svg',
  '/assets/images/guides/washer-quick-zh-v67.svg',
  '/assets/images/guides/aircon-quick-zh-TW-v67.svg',
  '/assets/images/guides/washer-quick-zh-TW-v67.svg',
  '/assets/images/guides/tv-guest-flow-zh-TW-v2.svg',
  '/assets/images/guides/tv-account-guide-zh-TW-v2.svg',
  '/assets/images/guides/induction-guide-zh-TW-v2.svg',
  '/assets/images/guides/hood-guide-zh-TW-v2.svg',
  '/assets/images/guides/microwave-panel-zh-TW.svg',
  '/manifest.webmanifest',
  '/assets/fonts/oxanium-latin.woff2',
  '/assets/fonts/material-symbols-outlined.woff2',
  '/assets/images/logo-staynemo-official.png',
  '/assets/images/logo-staynemo-symbol-official.png',
  '/assets/images/photographer-202608/livingroom-03-home-crop-v50.png',
  '/assets/images/photographer-202608/livingroom-01-home-crop-v54.png',
  '/assets/images/photographer-202608/livingroom-04-home-crop-v54.png',
  '/assets/images/photographer-202608/R1-NEMO-home-crop-v56.png',
  '/assets/images/photographer-202608/livingroom-01.webp',
  '/assets/images/photographer-202608/livingroom-02.webp',
  '/assets/images/photographer-202608/livingroom-03.webp',
  '/assets/images/photographer-202608/livingroom-04.webp',
  '/assets/images/photographer-202608/R1-NEMO-01.webp',
  '/assets/images/photographer-202608/R1-NEMO-02.webp',
  '/assets/images/photographer-202608/R1-NEMO-03.webp',
  '/assets/images/photographer-202608/R1-NEMO-toilet.webp',
  '/assets/images/photographer-202608/R2-HADA-01.webp',
  '/assets/images/photographer-202608/R2-HADA-02.webp',
  '/assets/images/photographer-202608/R2-HADA-03.webp',
  '/assets/images/photographer-202608/R2-HADA-bathroom.webp',
  '/assets/images/photographer-202608/R2-HADA-vanity.webp',
  '/assets/images/photographer-202608/nemo-entrance.webp',
  '/assets/images/photographer-202608/stay-nemo-entrance.webp',
  '/assets/images/stay-nemo-og-20260820-v65.png',
  '/assets/images/exterior-entry-side-clean-v2.png',
  '/assets/images/restaurants/hero.jpg',
  '/assets/images/tours/seoul-sunny-hero.webp',
  '/assets/images/platforms/airbnb-official.svg?v=44',
  '/assets/images/platforms/booking-com-official.svg',
  '/assets/images/platforms/trip-com-official.svg',
  '/assets/images/doorlock-night-clean-v2.png',
  '/assets/images/guides/aircon-remote-source-v61.webp',
  '/assets/images/guides/tv-remote-clean-v46.png',
  '/assets/images/guides/official-samsung-ko-v61.webp',
  '/assets/images/guides/official-samsung-en-v61.webp',
  '/assets/images/guides/microwave-panel-ko.svg',
  '/assets/images/guides/microwave-panel-en.svg',
  '/assets/images/guides/lg-fy9wtb-use-01-ko.webp',
  '/assets/images/guides/lg-fy9wtb-use-02-ko.webp',
  '/assets/images/guides/lg-fy9wtb-use-03-ko.webp',
  '/assets/images/guides/lg-fy9wtb-en.webp',
  '/assets/images/guides/tv-guest-flow-ko-v2.svg',
  '/assets/images/guides/tv-account-guide-ko-v2.svg',
  '/assets/images/guides/tv-guest-flow-en-v2.svg',
  '/assets/images/guides/tv-account-guide-en-v2.svg',
  '/assets/images/guides/induction-guide-ko-v2.svg',
  '/assets/images/guides/induction-guide-en-v2.svg',
  '/assets/images/guides/hood-guide-en-v2.svg',
  '/assets/images/guides/hood-guide-ko-v2.svg'
];

self.addEventListener('install', (event) => event.waitUntil(
  caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
));

self.addEventListener('activate', (event) => event.waitUntil(
  caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE).then((cache) => cache.put('/index.html', copy));
      return response;
    }).catch(() => caches.match('/index.html')));
    return;
  }

  if (url.pathname.startsWith('/assets/images/')) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      return response;
    })));
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
