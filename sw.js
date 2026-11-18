// Офлайн-режим.
// Код и стили: сначала сеть в обход HTTP-кэша браузера (иначе можно получить смесь старых
// и новых модулей), без сети — из кэша.
// Озвучка: сначала кэш, в отдельном хранилище — обновление кода её не перекачивает.
// Приложение само докачивает озвучку выбранного голоса и картинки в фоне.
// Картинки (Fluent Emoji 3D) берутся с jsDelivr и тоже кладутся в кэш навсегда.
// После перегенерации озвучки — поднять версию AUDIO.
const CACHE = 'srpski-v12';
const IMAGES = 'srpski-images-v1'; // картинки Fluent Emoji с jsDelivr
const AUDIO = 'srpski-audio-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/levels.js', 'js/store.js', 'js/audio.js', 'js/translit.js', 'js/stress.js',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE)
    .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'no-cache' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => ![CACHE, AUDIO, IMAGES].includes(k)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(IMAGES).then((c) => c.put(e.request, copy));
      return res;
    })));
    return;
  }
  if (url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3')) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(AUDIO).then((c) => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request)),
  );
});
