var CACHE = 'vocab-coreano-v1';
var ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/dogs.png',
  '/manifest.json',
  '/verbos_001_010.json',
  '/verbos_011_020.json',
  '/verbos_021_030.json',
  '/verbos_031_040.json',
  '/verbos_041_050.json',
  '/user-icon/1.png',
  '/user-icon/2.png',
  '/user-icon/3.png',
  '/user-icon/4.png',
  '/user-icon/5.png',
  '/user-icon/6.png',
  '/user-icon/7.png',
  '/user-icon/8.png',
  '/user-icon/9.png',
  '/user-icon/10.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  // Supabase e analytics sempre pela rede
  if (url.hostname.includes('supabase') || url.hostname.includes('vercel')) return;
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        return caches.open(CACHE).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
