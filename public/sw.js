// public/sw.js
const CACHE_NAME = 'assets-cache';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // intercept any /e/* requests
  if (url.pathname.startsWith('/e/')) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const targetUrl = url.href.replace('/e/', '/api/proxy?url=');
      const response = await fetch(targetUrl);
      const clone = response.clone();
      cache.put(event.request, clone);
      return response;
    })());
  }
});