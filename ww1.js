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


self.addEventListener('message', function(event){
  console.log("SW Received Message: " + event.data);
  event.ports[0].postMessage("SW Says 'Hello back!'");
  console.log(event)
});