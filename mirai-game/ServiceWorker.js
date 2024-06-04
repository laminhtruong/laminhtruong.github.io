const cacheName = "DefaultCompany-bug-battle-3d-0.1.0";
const contentToCache = [
    "Build/5336a4b2c43054286fd70b1faa467eee.loader.js",
    "Build/207e37e4f65cd3399e909dbb48b7b10a.framework.js.unityweb",
    "Build/b92664f82de4c5d711897bc4e91fbd3c.data.unityweb",
    "Build/3b3b2eb65bffd35b268a791a9c6ec6d8.wasm.unityweb",
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
