const CACHE_NAME = 'spark-homes-estimator-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './tokens/colors.css',
  './tokens/typography.css',
  './tokens/spacing.css',
  './tokens/fonts.css',
  './js/priceList.js',
  './js/appState.js',
  './js/SectionView.js',
  './js/RoomManager.js',
  './js/PhotoCapture.js',
  './js/EstimatorApp.js',
  './js/main.js',
  './assets/fonts/SpaceGrotesk-Variable.woff2',
  './assets/fonts/WorkSans-Variable.woff2',
  './assets/logo/spark-homes-logo.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
        }
        return response;
      }).catch(function() {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
