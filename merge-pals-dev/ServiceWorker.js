const cacheName = "Mirailabs-PetM-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/bc1ea92d986136355c624eb2e4de3f7f.js.unityweb",
    "Build/163099cbd80368025f8f86a8f9366fd4.data.unityweb",
    "Build/0fdd4a0eefe4eaf2e87c4a83562f9895.wasm.unityweb",
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
