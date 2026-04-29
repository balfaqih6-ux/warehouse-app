const CACHE = 'warehouse-zain-v3';

const FILES = [
  '/',
  '/index.html',
  '/receiving.html',
  '/audit.html',
  '/admin.html',
  '/office.html',
  '/config.js',
  '/manifest.json',
  '/zain-logo.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(FILES))
      .catch(() => null)
  );

  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clonedResponse = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(event.request, clonedResponse);
        });

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
