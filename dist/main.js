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

	console.log('test3');

	// 需要缓存的文件类型
	var FILE_LISTS = ['js', 'css', 'png'];

	//  缓存版本
	var CACHE_VERSION = 1;
	var CURRENT_CACHES = {
	    prefetch: 'prefetch-cache-v' + CACHE_VERSION
	};

	// 安装
	self.addEventListener('install', function (event) {
	    event.waitUntil(caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
	        console.log(cache);
	    }));
	});

	var goSaving = function goSaving(url) {
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = FILE_LISTS[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var file = _step.value;

	            if (url.endsWith(file)) return true;
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

	    return false;
	};

	// 判断文件是否需要被缓存
	function checkFile(request) {
	    var matchPath = pathtoRegexp(PATH_FILE);
	    var url = request.url;
	    console.log(url);
	    var method = request.method.toLowerCase();
	    // url = matchPath.exec(url)[1];
	    return !!(goSaving(url) && method === 'get'); // 只缓存get请求的静态资源
	}

	self.addEventListener('fetch', function (event) {
	    // 检查是否需要缓存
	    if (!checkFile(event.request)) return;

	    event.respondWith(caches.match(event.request).then(function (resp) {
	        // 如果缓存中国年有，则直接返回
	        // 否则从服务器拉取，并更新缓存
	        return resp || fetch(event.request).then(function (response) {
	            console.log('save file:' + response.url);
	            // 需要缓存,则将资源放到 caches Object 中
	            return caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
	                cache.put(event.request, response.clone());
	                return response;
	            });
	        });
	    }));
	});

	// document 文件懒更新
	// 即先展示缓存中资源，然后更新缓存
	self.addEventListener('message', function (event) {
	    console.log("receive message" + event.data);
	    // 更新根目录下的 html 文件。
	    var url = event.data;
	    console.log("update root file " + url);
	    event.waitUntil(caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
	        return fetch(url).then(function (res) {
	            cache.put(url, res);
	        });
	    }));
	});

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

	self.addEventListener('push', function (event) {
	    sendNote();
	});

	function focusOpen() {
	    var url = location.href;
	    clients.matchAll({
	        type: 'window',
	        includeUncontrolled: true
	    }).then(function (clients) {
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;

	        try {
	            for (var _iterator2 = clients[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                var client = _step2.value;

	                if (client.url = url) return client.focus(); // 经过测试，focus 貌似无效
	            }
	        } catch (err) {
	            _didIteratorError2 = true;
	            _iteratorError2 = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion2 && _iterator2.return) {
	                    _iterator2.return();
	                }
	            } finally {
	                if (_didIteratorError2) {
	                    throw _iteratorError2;
	                }
	            }
	        }

	        console.log('not focus');
	        clients.openWindow(location.origin);
	    });
	}

/***/ }
/******/ ]);