console.log('ww5jk')

// 安装
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mysite-static-v8').then(function(cache) {
        return cache.addAll([
          './css/index.css'
        ]);
      })
    );
  });


self.addEventListener('fetch', function(event) {
  console.log(event.request.url)
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});