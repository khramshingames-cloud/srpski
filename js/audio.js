// Озвучка: заранее записанные mp3 нейро-голосами (audio/f — Софи, audio/m — Никола).
// Если файла нет — голос телефона, но только сербский/хорватский/боснийский:
// чужой голос читает сербские слова по буквам, лучше промолчать.
// Повторное нажатие на ту же фразу проигрывает её медленнее.

import { settings } from './store.js';
import { audioKey } from './translit.js';

export const VOICES = { f: 'Софи (женский)', m: 'Никола (мужской)' };

const player = new Audio();
player.preload = 'auto';
let last = { text: null, at: 0, slow: false };

// iOS разрешает звук только после касания: «разблокируем» плеер на первом же тапе
const SILENT = 'data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';
function unlock() {
  document.removeEventListener('pointerdown', unlock, true);
  if (player.src) return;
  player.src = SILENT;
  player.play().catch(() => {});
}
document.addEventListener('pointerdown', unlock, true);

// ---- запасной вариант: голос устройства ----
const synth = window.speechSynthesis;
let ttsVoice = null;
function chooseVoice() {
  const voices = synth.getVoices();
  const by = (p) => voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(p));
  ttsVoice = by('sr') || by('hr') || by('bs') || null;
}
if (synth) { chooseVoice(); synth.addEventListener?.('voiceschanged', chooseVoice); }

function ttsFallback(text) {
  if (!synth || !ttsVoice) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = ttsVoice; u.lang = ttsVoice.lang; u.rate = 0.85 * settings().rate;
  synth.speak(u);
}

export const fileFor = (text, voice = settings().voice) => `audio/${voice}/${audioKey(text)}.mp3`;

// mp3 держим в памяти как blob: так Safari не спотыкается о Range-запросы к офлайн-кэшу,
// а повторное воспроизведение мгновенное.
const blobs = new Map();
async function blobUrl(url) {
  if (!blobs.has(url)) {
    blobs.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.blob();
    }).then((b) => URL.createObjectURL(b)).catch((e) => { blobs.delete(url); throw e; }));
  }
  return blobs.get(url);
}

// Тихо докачиваем всю озвучку выбранного голоса для офлайна (~10 МБ), по 4 файла за раз.
// Service worker кладёт их в кэш; уже скачанные отдаются мгновенно.
export async function warmAudio(voice = settings().voice) {
  const flag = `srpski.audioWarm.${voice}`;
  try { if (localStorage.getItem(flag) === '1') return; } catch {}
  if (!('serviceWorker' in navigator)) return;
  await navigator.serviceWorker.ready;
  let keys;
  try { keys = await (await fetch('audio/list.json', { cache: 'no-cache' })).json(); } catch { return; }
  let i = 0, failed = 0;
  const worker = async () => {
    while (i < keys.length) {
      const k = keys[i++];
      try { const r = await fetch(`audio/${voice}/${k}.mp3`); if (!r.ok) failed++; } catch { failed++; }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  if (!failed) try { localStorage.setItem(flag, '1'); } catch {}
}

export function preload(texts) {
  for (const t of texts) blobUrl(fileFor(t)).catch(() => {});
}

let seq = 0;
export async function speak(text, opts = {}) {
  const now = Date.now();
  const again = text === last.text && now - last.at < 10000;
  const slow = opts.slow ?? (again ? !last.slow : false);
  last = { text, at: now, slow };
  const my = ++seq;

  synth?.cancel();
  player.pause();
  let src;
  try { src = await blobUrl(fileFor(text, opts.voice)); } catch { if (my === seq) ttsFallback(text); return; }
  if (my !== seq) return; // пока грузилось, попросили другое слово
  player.src = src;
  const rate = settings().rate * (slow ? 0.7 : 1);
  player.defaultPlaybackRate = rate;
  player.playbackRate = rate;
  player.play().catch(() => {});
}

export function stop() { player.pause(); synth?.cancel(); }
