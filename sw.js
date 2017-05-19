importScripts('./path-to-regexp.js');

console.log('test3');

// 需要缓存的文件类型
const FILE_LISTS = ['js','css','png'];

//  缓存版本
const CACHE_VERSION = 1;
const CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};


// 安装
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

// 判断文件是否需要被缓存
function checkFile(request){
    // var matchPath = pathtoRegexp(PATH_FILE);
    var url = request.url;
    console.log(url);
    var method = request.method.toLowerCase();
    // url = matchPath.exec(url)[1];
    return !!(goSaving(url) && method === 'get'); // 只缓存get请求的静态资源
}


self.addEventListener('fetch', function(event) {
    // 检查是否需要缓存
    if(!checkFile(event.request))return;

    event.respondWith(
    caches.match(event.request).then(function(resp) {
        // 如果缓存中国年有，则直接返回
        // 否则从服务器拉取，并更新缓存
        return resp || fetch(event.request).then(function(response) {
            console.log('save file:' + response.url);
            // 需要缓存,则将资源放到 caches Object 中
            return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
                cache.put(event.request, response.clone());
                return response;
            });
        });
    }));
});


// document 文件懒更新
// 即先展示缓存中资源，然后更新缓存
self.addEventListener('message',event =>{
    console.log("receive message" + event.data);
    // 更新根目录下的 html 文件。
    var url = event.data;
    console.log("update root file " + url);
    event.waitUntil(
        caches.open(CURRENT_CACHES.prefetch).then(cache=>{
            return fetch(url)
            .then(res=>{
                cache.put(url,res);
            })
        })
    )
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
        actions:[{
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

self.addEventListener('push', function (event) {
  sendNote();
})

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
