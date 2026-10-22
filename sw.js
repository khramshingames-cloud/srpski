// Офлайн-режим.
// Код и стили: сначала сеть в обход HTTP-кэша браузера (иначе можно получить смесь старых
// и новых модулей), без сети — из кэша.
// Озвучка: сначала кэш (файлы не меняются), все mp3 скачиваются заранее при установке.
// Озвучка лежит в отдельном кэше, чтобы обновление кода не скачивало её заново.
// После перегенерации озвучки — поднять версию AUDIO.
const CACHE = 'srpski-v3';
const AUDIO = 'srpski-audio-v1';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/data.js', 'js/store.js', 'js/engine.js', 'js/audio.js', 'js/translit.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
];
const VOICES = ['f', 'm'];

async function precache() {
  await (await caches.open(CACHE)).addAll(SHELL.map((u) => new Request(u, { cache: 'no-cache' })));
  try {
    const c = await caches.open(AUDIO);
    const have = new Set((await c.keys()).map((r) => new URL(r.url).pathname));
    const keys = await (await fetch('audio/list.json')).json();
    const files = VOICES.flatMap((v) => keys.map((k) => `audio/${v}/${k}.mp3`));
    // по одному, чтобы один сбой не ломал установку
    await Promise.all(files.filter((f) => !have.has(new URL(f, self.registration.scope).pathname)).map((f) => c.add(f).catch(() => {})));
  } catch {}
}

self.addEventListener('install', (e) => {
  e.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== AUDIO).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
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
