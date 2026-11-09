// Service worker antigo da raiz: remove a si mesmo e o cache antigo.
// As fichas agora ficam em /cadastro/ e /prospeccao/, cada uma com seu próprio aplicativo.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (nomes) {
            return Promise.all(nomes.filter(function (n) { return n.indexOf('ficha-') === 0; }).map(function (n) { return caches.delete(n); }));
        }).then(function () { return self.registration.unregister(); })
          .then(function () { return self.clients.matchAll(); })
          .then(function (cs) { cs.forEach(function (c) { c.navigate(c.url); }); })
    );
});
