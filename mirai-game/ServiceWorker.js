const cacheName = "Mirailabs-PetM-0.1.0";
const contentToCache = [
    "Build/Build.loader.js",
    "Build/9038d560b865101001c577f64045031b.js.unityweb",
    "Build/bf411c036dfb099936bd287cf8c20cdd.data.unityweb",
    "Build/47a92c8b4f727412bf18d9dc85a439e9.wasm.unityweb",
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
