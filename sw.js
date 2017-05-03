console.log(caches);
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mysite-static-v1').then(function(cache) {
      console.log(cache);
      return cache.addAll([
        '/sw/css/index.css',
        '/sw/js/index.js'
      ]);
    })
  );
});


self.addEventListener('fetch', function(event) {
  console.log('fetch');
  console.log(event.request);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
