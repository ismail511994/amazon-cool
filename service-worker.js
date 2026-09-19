const CACHE_NAME='amazon-cool-v1';
const ASSETS=[
  '/amazon-cool/',
  '/amazon-cool/index.html',
  '/amazon-cool/manifest.json'
];

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){return k!==CACHE_NAME}).map(function(k){return caches.delete(k)})
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(response){
      var copy=response.clone();
      caches.open(CACHE_NAME).then(function(cache){
        cache.put(e.request,copy).catch(function(){});
      });
      return response;
    }).catch(function(){
      return caches.match(e.request).then(function(cached){
        return cached||caches.match('/amazon-cool/index.html');
      });
    })
  );
});
