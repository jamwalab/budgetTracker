//Define cache name
const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//Files to be cached
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/index.js',
  '/js/idb.js',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
  '/api/transaction',
  '/icons/icon-192x192.png',
  '/icons/icon-144x144.png'
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      //Update API data in cache
      if(e.request.url.match('/api/transaction')) {
        e.waitUntil(
          caches.open(CACHE_NAME).then(function (cache) {
            console.log('updating API in : ' + CACHE_NAME)
            return cache.add('/api/transaction')
          })
          //display message if app is offline
          .catch(() => console.log("App offline, displaying cached data!"))
        )
      }

      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

    })
  );
 
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});