const staticCacheName = 'biel-{{ site.time | date: "%Y-%m-%d-%H-%M" }}';

const filesToCache = [
    'index.html',
    'assets/css/style.css',
    'assets/css/myResumestyle.css'
];

// Cache on install
this.addEventListener("install", event => {
  this.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
    })
  )
});

// Clear cache on activate
this.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => (cacheName.startsWith('biel-')))
            .filter(cacheName => (cacheName !== staticCacheName))
            .map(cacheName => caches.delete(cacheName))
        );
      })
    );
  });

  // Serve from Cache
this.addEventListener("fetch", event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
        .catch(() => {
          return caches.match('/index.html');
        })
    )
  });   