const cacheName = "Mirailabs-Merge Pals-1.0.0";
const contentToCache = [
    "Build/development.loader.js",
    "Build/4ba2751d13eece24e5c0cb1772c25a49.js.unityweb",
    "Build/85cb22cb7902da1a1828d05c475c1bc3.data.unityweb",
    "Build/d81d299511578ad017e0620b1de711d1.wasm.unityweb",
    "Data/style.css"

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
