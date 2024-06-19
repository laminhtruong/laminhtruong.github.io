const cacheName = "Mirailabs-PetM-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/589a80324270c547acda51db1e8c7175.js.unityweb",
    "Build/30de8d632ac696f644a7ed6ea33d4ddd.data.unityweb",
    "Build/60c017c0264b6269c70a6d23d47576b6.wasm.unityweb",
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
