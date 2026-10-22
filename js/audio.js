// Озвучка через голос, встроенный в телефон/браузер (Web Speech API).
// Ищем сербский голос, если его нет — хорватский или боснийский (произношение почти то же).
// Позже заменим на заранее записанные нейро-голосом mp3 — они одинаковые на всех устройствах.

import { settings } from './store.js';

const synth = window.speechSynthesis;
let voice = null;

function chooseVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  const by = (prefix) => voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
  const sr = by('sr');
  voice = sr.find((v) => /latn|natural|online/i.test(v.name)) || sr[0] || by('hr')[0] || by('bs')[0] || null;
}
if (synth) {
  chooseVoice();
  synth.addEventListener?.('voiceschanged', chooseVoice);
}

export const voiceInfo = () => (voice ? `${voice.name} (${voice.lang})` : null);
export const hasSpeech = () => !!synth;

export function speak(text) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'sr-RS';
  u.rate = settings().rate;
  synth.speak(u);
}
