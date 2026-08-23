/* Offline shell for the storefront. Screenshots and icons cache as they load. */
const CACHE = 'premium-app-store-v2';
const SHELL = ['./', './index.html', './styles.css', './apps.js', './app.js',
               './manifest.webmanifest', './assets/icons/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The catalog and the code that renders it. GitHub Pages serves these with
   max-age=600, and a plain fetch() honours that — so a tab could show a
   ten-minute-old storefront, listing an app as "Soon" after it had shipped.
   Revalidating costs a 304 on an unchanged file and nothing else. Screenshots
   and icons are deliberately excluded: they are immutable once published and
   there are a lot of them. */
const ALWAYS_FRESH = /\/$|\.(?:html|js|css|webmanifest)$/;

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const opts = ALWAYS_FRESH.test(new URL(req.url).pathname) ? { cache: 'no-cache' } : undefined;
  e.respondWith(
    fetch(req, opts)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
