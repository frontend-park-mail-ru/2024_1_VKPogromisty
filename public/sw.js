// eslint-disable-next-line no-undef
const { assets } = serviceWorkerOption;
const CACHE_NAME = "socio-cache";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...assets]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (navigator.onLine) {
        return fetch(event.request).then((response) => {
          if (event.request.method !== "GET") {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            try {
              cache.put(event.request, responseClone);
            } catch (e) {
              // eslint-disable-next-line
              console.log(e);
            }
          });

          return response;
        });
      }

      return caches.match(event.request).then((response) => {
        return (
          response ||
          new Response(JSON.stringify({ status: 408 }), { status: 200 })
        );
      });
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            caches.delete(key).then(() => {});
          }
        }),
      ),
    ),
  );
});
