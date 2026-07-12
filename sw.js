// TrainAI Service Worker: Netzwerk zuerst (immer aktuellste Version nach Deploy),
// Cache als Fallback für Offline-Start. Fremd-Origins (intervals.icu, Claude-API) werden nie angefasst.
const CACHE = 'trainai-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
