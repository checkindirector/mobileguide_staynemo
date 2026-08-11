const CACHE = 'staynemo-v9';
const CORE = ['/', '/index.html', '/assets/styles.css?v=9', '/assets/data.js?v=9', '/assets/app.js?v=9', '/manifest.webmanifest', '/assets/fonts/oxanium-latin.woff2', '/assets/fonts/material-symbols-outlined.woff2', '/assets/images/logo-staynemo.svg', '/assets/images/logo-staynemo-symbol.svg', '/assets/images/hero-main-professional.webp', '/assets/images/hero-sub-professional.webp', '/assets/images/platforms/airbnb.svg', '/assets/images/platforms/booking-com.svg', '/assets/images/platforms/agoda.svg', '/assets/images/platforms/trip-com.svg'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put('/index.html', copy)); return response; }).catch(() => caches.match('/index.html')));
    return;
  }
  if (url.pathname.startsWith('/assets/images/')) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone())); return response; })));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
