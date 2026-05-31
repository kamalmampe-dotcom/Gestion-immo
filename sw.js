// Service worker — « cache d'abord » : ouverture instantanée sur mobile + hors-ligne,
// avec mise à jour silencieuse en arrière-plan (stale-while-revalidate).
const CACHE = 'immogestion-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // on supprime les anciens caches (v1) puis on prend le contrôle
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // on ne met jamais en cache les appels à Supabase (données toujours fraîches)
  if (req.method !== 'GET' || req.url.includes('supabase.co')) return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        // on ne met en cache que les réponses valides de notre propre site
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      // cache d'abord (instantané), sinon réseau
      return cached || network;
    })
  );
});
