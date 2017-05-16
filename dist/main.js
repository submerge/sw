/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	importScripts('./path-to-regexp.js');

	var CACHE_VERSION = 1;
	var CURRENT_CACHES = {
	  prefetch: 'prefetch-cache-v' + CACHE_VERSION
	};

	self.addEventListener('install', function (event) {
	  event.waitUntil(caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
	    console.log(cache);
	  }));
	});

	/*self.addEventListener('fetch', function(event) {
	  console.log(event.request);
	  event.respondWith(
	    caches.match(event.request)
	      .then(function(response) {
	        // Cache hit - return response
	        if (response) {
	          return response;
	        }
	        // return fetch(event.request);


	        // 因为 event.request 流已经在 caches.match 中使用过一次，
	        // 那么该流是不能再次使用的。我们只能得到它的副本，拿去使用。
	        var fetchRequest = event.request.clone();
	        // fetch 的通过信方式，得到 Request 对象，然后发送请求
	        return fetch(fetchRequest).then(
	          function(response) {
	            // 检查是否成功
	            if(!response || response.status !== 200 || response.type !== 'basic') {
	              return response;
	            }

	            // 如果成功，该 response 一是要拿给浏览器渲染，而是要进行缓存。
	            // 不过需要记住，由于 caches.put 使用的是文件的响应流，一旦使用，
	            // 那么返回的 response 就无法访问造成失败，所以，这里需要复制一份。
	            var responseToCache = response.clone();

	            /*caches.open(CACHE_NAME)
	              .then(function(cache) {
	                cache.put(event.request, responseToCache);
	              });

	            return response;
	          }
	        );
	      }
	    )
	  );
	});


	self.addEventListener('activate', function(event) {
	  var cacheWhitelist = ['v2'];

	  event.waitUntil(
	    caches.keys().then(function(keyList) {
	      /*return Promise.all(keyList.map(function(key) {
	        if (cacheWhitelist.indexOf(key) === -1) {
	          return caches.delete(key);
	        }
	      }));
	      console.log(keyList);
	    })
	  );
	});
	*/

	// push
	// 在 SW 中使用
	function sendNote() {
	  console.log('send Note');
	  var title = 'Yay a message.';
	  var body = 'We have received a push message.';
	  var icon = '/icon/icon_title.png';
	  var tag = 'simple-push-demo-notification-tag' + Math.random();
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
	    actions: [{
	      action: "focus",
	      title: "focus"
	    }]
	  });
	}

	// sendNote();

	self.addEventListener('message', function (event) {
	  // test send note
	  sendNote();

	  console.log("receive message" + event.data);
	});

	self.addEventListener('notificationclick', function (event) {
	  var messageId = event.notification.data;
	  event.notification.close();
	  clients.openWindow(location.origin);
	});

	function focusOpen() {
	  var url = location.href;
	  clients.matchAll({
	    type: 'window',
	    includeUncontrolled: true
	  }).then(function (clients) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = clients[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var client = _step.value;

	        if (client.url = url) return client.focus(); // 经过测试，focus 貌似无效
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    console.log('not focus');
	    clients.openWindow(location.origin);
	  });
	}

/***/ }
/******/ ]);