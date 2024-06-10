const cacheName = "Mirailabs-PetM-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/9b7149c87bf930edfbe73d5ba00d6f99.js.unityweb",
    "Build/f570ffeff83c19576755239aa461a258.data.unityweb",
    "Build/99318684e3b8f7bde37106e8771e595a.wasm.unityweb",
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
