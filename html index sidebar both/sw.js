const CACHE_NAME = 'al-study-tracker-v3';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './sidebar.html',
  './wosandi/index.html',
  './wosandi/app.js',
  './wosandi/dataService.js',
  './wosandi/gradeController.js',
  './wosandi/subjectDrawer.js',
  './wosandi/subjectManager.js',
  './wosandi/todayPriorities.js',
  './wosandi/unitAnalytics.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache error (some assets cached):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Don't intercept Supabase REST or Realtime websocket requests
  const url = new URL(req.url);
  if (url.hostname.includes('supabase.co')) return;

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed; return cached response if present
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
