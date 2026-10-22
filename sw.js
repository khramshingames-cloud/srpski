// Офлайн-режим.
// Код и стили: сначала сеть (чтобы обновления приходили сразу), без сети — из кэша.
// Озвучка: сначала кэш (файлы не меняются), все mp3 скачиваются заранее при установке.
// После перегенерации озвучки — поднять версию CACHE.
const CACHE = 'srpski-v2';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/data.js', 'js/store.js', 'js/engine.js', 'js/audio.js', 'js/translit.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
];
const VOICES = ['f', 'm'];

async function precache() {
  const c = await caches.open(CACHE);
  await c.addAll(SHELL);
  try {
    const keys = await (await fetch('audio/list.json')).json();
    const files = VOICES.flatMap((v) => keys.map((k) => `audio/${v}/${k}.mp3`));
    // по одному, чтобы один сбой не ломал установку
    await Promise.all(files.map((f) => c.add(f).catch(() => {})));
  } catch {}
}

self.addEventListener('install', (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.pathname.includes('/audio/') && url.pathname.endsWith('.mp3')) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request)),
  );
});
