const VERSION = 'isapp-' + Date.now();

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(() => {
        // Уведомить все вкладки об обновлении
        self.clients.matchAll().then(clients => {
          clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
        });
      })
  );
});

// Всегда сеть, кэш не используем
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request, { cache: 'no-store' }).catch(() => new Response('Офлайн', { status: 503 }))
  );
});
