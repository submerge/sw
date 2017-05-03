self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mysite-static-v1').then(function(cache) {
      return cache.addAll([
        '/sw/css/index.css',
        '/sw/js/index.js'
      ]);
    })
  );
});