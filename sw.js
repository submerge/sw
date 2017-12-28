// service work 本身在单独的一个线程中运行，
// 不能访问DOM

// service work中只能进行异步操作，不能进行通过操作
// 比如 localStorage.setItem操作为同步，就不能在
// service work 中使用

// importScripts('./path-to-regexp.js');

// console.log('test3 test4');
// 需要缓存的文件类型
// 只允许缓存js, css, png等类型资源
const FILE_LISTS = ['js','css','png'];

//  缓存版本
const CACHE_VERSION = '1';
const CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};


// 安装阶段，将首屏需要的资源进行加载并缓存
// 也可以将用户可能会使用到的资源进行预加载
self.addEventListener('install', function(event) {
   // 缓存指定的文件
    const urlsToPrefetch = [
      // 'vendor.js'
    ];
  
    event.waitUntil(
      caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
        // 遍历需要缓存的资源list
        var cachePromises = urlsToPrefetch.map(function(urlToPrefetch) {
          // 拼接资源url
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


// 调用cache API 缓存的资源除非手动删除，否贼一只在设备硬盘中
// activate 事件中，手工清楚之前版本的缓存
self.addEventListener('activate', function(event) {
  // var cacheWhitelist = ['v1'];
  event.waitUntil(
  // 遍历 caches 里所有缓存的 keys 值
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // if (cacheWhitelist.includes(cacheName)) {
          if (cacheName != CURRENT_CACHES.prefetch) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


// 此处fetch事件比较关键,比较牛逼
// 拦截应用中所有的http请求
// 判断如果请求的是js, css, png且缓存中有，则直接从缓存中返回
// 否则，正常向服务端发送http请求
self.addEventListener('fetch', function(event) {
  event.respondWith(
  caches.match(event.request).then(function(resp) {
      // 如果缓存中有，则直接返回
      // 否则从服务器拉取，并更新缓存
      return resp || fetch(event.request).then(function(response) {
          console.log('save file:' + response.url);

           if(!checkFile(event.request)) {
              return response;
           }
          // 需要缓存,则将资源放到 caches Object 中
          return caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
            // 此处注意: response.clone()
            // 因为一个流只能被使用一次  
            cache.put(event.request, response.clone());
              return response;
          });
      });
  }));
});



// 判断文件是否需要被缓存
function checkFile(request){
    // var matchPath = pathtoRegexp(PATH_FILE);
    var url = request.url;
    console.log(url);
    var method = request.method.toLowerCase();
    // url = matchPath.exec(url)[1];
    return !!(goSaving(url) && method === 'get'); // 只缓存get请求的静态资源
}

var goSaving = function(url){
  for(var file of FILE_LISTS){
       if(url.endsWith(file)) return true;
   }
   return false;
}


// document 文件懒更新
// 即先展示缓存中资源，然后更新缓存
/*
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
*/



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

self.addEventListener('message',event =>{
  // test send note
  sendNote();

  console.log("receive message" + event.data);
});




/*
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
*/