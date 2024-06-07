const cacheName = "Mirailabs-PetM-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/e72ed9bf581a755feffe29b9f27cbde8.js.unityweb",
    "Build/bb98e7ad1976d6ded8ed4d3146bcd751.data.unityweb",
    "Build/b7bc764daa706f1b25b3d5cc7a254f68.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
