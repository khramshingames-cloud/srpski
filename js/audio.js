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

export function speak(text, opts = {}) {
  const now = Date.now();
  const again = text === last.text && now - last.at < 10000;
  const slow = opts.slow ?? (again ? !last.slow : false);
  last = { text, at: now, slow };

  synth?.cancel();
  player.pause();
  player.onerror = () => ttsFallback(text);
  player.src = fileFor(text, opts.voice);
  const rate = settings().rate * (slow ? 0.7 : 1);
  player.defaultPlaybackRate = rate;
  player.playbackRate = rate;
  player.play().catch(() => {});
}

export function stop() { player.pause(); synth?.cancel(); }
