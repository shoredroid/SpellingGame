// sw.js
const CACHE_NAME = 'static-v1';
const urlsToCache = [
  '/',
  'index.html',
  'styles.css',
  'app.js',
  'icon.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
