// Печатает JSON { key: текст } со всем, что приложение озвучивает.
// Используется в gen_audio.py.
import { COURSE, ITEMS } from '../js/data.js';
import { audioKey } from '../js/translit.js';

const EXTRA = ['Dobar dan, kako si?']; // кнопка проверки голоса в настройках

const texts = [
  ...Object.values(ITEMS).map((it) => it.sr),
  ...COURSE.flatMap((L) => (L.rules || []).flatMap((r) => r.examples.map(([sr]) => sr))),
  ...COURSE.flatMap((L) => (L.exercises || []).filter((e) => e.k === 'cloze').map((e) => e.sr.replace('___', e.a))),
  ...COURSE.flatMap((L) => (L.lines || []).map((l) => l[1])),
  ...Object.values(ITEMS).filter((it) => it.ex).map((it) => it.ex.sr),
  ...EXTRA,
];

const out = {};
for (const t of texts) out[audioKey(t)] ||= t;
console.log(JSON.stringify(out));
