const CACHE_NAME = "catprox-cache-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetched) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetched.clone());
            return fetched;
          });
        })
      );
    })
  );
});