// Guarda a ficha no celular para funcionar sem internet.
// Ao publicar uma nova versão da ficha, aumente o número abaixo.
var CACHE = 'ficha-prosp-v1';
var ARQUIVOS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
    e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
    e.waitUntil(caches.keys().then(function (nomes) {
        return Promise.all(nomes.filter(function (n) { return n.indexOf('ficha-prosp-') === 0 && n !== CACHE; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); }));
});

// Responde com a cópia guardada (funciona offline) e, se houver internet, atualiza a cópia em segundo plano.
self.addEventListener('fetch', function (e) {
    if (e.request.method !== 'GET') return;
    e.respondWith(caches.open(CACHE).then(function (c) {
        return c.match(e.request, { ignoreSearch: true }).then(function (guardado) {
            var rede = fetch(e.request).then(function (resp) {
                if (resp && resp.ok) c.put(e.request, resp.clone());
                return resp;
            }).catch(function () { return guardado; });
            return guardado || rede;
        });
    }));
});
