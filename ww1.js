// importScripts('./path-to-regexp.js');

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  
 // 缓存指定的文件
  const urlsToPrefetch = [
    'vendor.js'
  ];

  event.waitUntil(
    caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
      var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
        var url = new URL(urlToPrefetch,location.origin); // 拼路径

        console.log('now send the request to' + url);

        var request = new Request(url);
        return fetch(request).then(function(response) {
          if (response.status >= 400) {
            throw new Error('request for ' + urlToPrefetch +
              ' failed with status ' + response.statusText);
          }

          return cache.put(urlToPrefetch, response);
        }).catch(function(error) {
          console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
        });
      });

      return Promise.all(cachePromises).then(function() {
        console.log('Pre-fetching complete.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});

const FILE_LISTS = ['js','css','png'];
const PATH_FILE = '/:file?'; // 缓存接受的路径文件


var goSaving = function(url){
  for(var file of FILE_LISTS){
    if(url.endsWith(file)) return true;
  }
  return false;
}


// 判断 path/method/contentType
function checkFile(request){
  var matchPath = pathtoRegexp(PATH_FILE);
  var url = location.pathname;
  var method = request.method.toLowerCase();
  url = matchPath.exec(url)[1];
  return !!(goSaving(url) && method === 'get');
}

self.addEventListener('fetch', function(event) {
  // 检查是否需要缓存！！！！！！！！很重要！！！！！
  // if(!checkFile(event.request))return;

  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
          console.log('save file:' + location.href);
          // 需要缓存,则将资源放到 caches Object 中
          return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
    })
  );
});

Notification.requestPermission();

function sendNote(){
  console.log('send Note');
  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/student.png';
  var tag = 'simple-push-demo-notification-tag'+ Math.random();
  var data = {
    doge: {
      wow: 'such amaze notification data'
    }
  };
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag,
      data: data,
      actions:[
        {
          action:"focus",
          title:"focus"
        }]
    })
}

self.addEventListener('notificationclick', function(event) {
  var messageId = event.notification.data;
  event.notification.close();
  if(event.action === "focus"){
    focusOpen();
  }
});

function focusOpen(){
  var url = location.href;
  clients.matchAll({
    type:'window',
    includeUncontrolled: true
  }).then(clients=>{
    for(var client of clients){
      if(client.url = url) return client.focus(); // 经过测试，focus 貌似无效
    }
    console.log('not focus');
    clients.openWindow(location.origin);
  })
}