importScripts('./path-to-regexp.js');


const FILE_LISTS = ['js','css','png'];
const PATH_FILE = '/:file?'; // 缓存接受的路径文件

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
        console.log(cache);
    })
  );
});

var goSaving = function(url){
   for(var file of FILE_LISTS){
        if(url.endsWith(file)) return true;
    }
    return false;
}


function checkFile(request){
    var matchPath = pathtoRegexp(PATH_FILE);
    var url = request.url;
    // console.log(url);
    console.log(url);
    var method = request.method.toLowerCase();
    // url = matchPath.exec(url)[1];
    return !!(goSaving(url) && method === 'get');
}




self.addEventListener('fetch', function(event) {
    // 检查是否需要缓存
    if(!checkFile(event.request))return;

    event.respondWith(
    caches.match(event.request).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
            console.log(response);
            console.log('save file:' + location.href);
            // 需要缓存,则将资源放到 caches Object 中
            return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        });
    }));
});

// push
// 在 SW 中使用
function sendNote(){
  console.log('send Note');
  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/icon/icon_title.png';
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

// sendNote();

self.addEventListener('message',event =>{
  // test send note
  sendNote();

  console.log("receive message" + event.data);
});

self.addEventListener('notificationclick', function(event) {
  var messageId = event.notification.data;
  event.notification.close();
  clients.openWindow(location.origin);
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
