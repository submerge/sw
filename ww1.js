console.log('ww4jk')

// 安装
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('mysite-static-v7').then(function(cache) {
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