const CACHE_NAME = 'newt-tracker-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handler required for PWA
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
