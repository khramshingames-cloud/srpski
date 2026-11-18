// Собирает js/levels.js из tools/levels.json (источник — правьте его) и подбирает картинки.
//   node tools/build_levels.mjs
//
// tools/levels.json: [{ id, title, words: [[sr, ru, emoji|null, note?]], phrases: [[sr, ru, emoji]] }]
// Картинки — Microsoft Fluent Emoji 3D (MIT), пакет @lobehub/fluent-emoji-3d: файлы названы кодом эмодзи.
// Если для эмодзи нет картинки, приложение покажет обычный эмодзи; null — карточка без картинки.
import fs from 'fs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const PKG = '@lobehub/fluent-emoji-3d@1.1.0';
const LIST = `${ROOT}/tools/fluent-files.json`;

if (!fs.existsSync(LIST)) {
  const r = await fetch(`https://data.jsdelivr.com/v1/package/npm/${PKG}/flat`);
  const names = (await r.json()).files.map((f) => f.name.replace('/assets/', '').replace('.webp', ''));
  fs.writeFileSync(LIST, JSON.stringify(names));
}
const files = new Set(JSON.parse(fs.readFileSync(LIST, 'utf8')));

// эмодзи -> имя файла: коды через «-», пробуем с вариационным селектором FE0F и без
function imgFor(emoji) {
  if (!emoji) return null;
  const cps = [...emoji].map((c) => c.codePointAt(0).toString(16).padStart(4, '0'));
  const full = cps.join('-'), bare = cps.filter((c) => c !== 'fe0f').join('-');
  return files.has(full) ? full : files.has(bare) ? bare : files.has(bare + '-fe0f') ? bare + '-fe0f' : null;
}

const levels = JSON.parse(fs.readFileSync(`${ROOT}/tools/levels.json`, 'utf8'));
const seen = new Map();
const noImg = [];
const out = levels.map((lv, i) => {
  const card = ([sr, ru, emoji, note], kind) => {
    if (seen.has(sr)) throw new Error(`«${sr}» уже есть в ${seen.get(sr)}`);
    seen.set(sr, lv.title);
    const img = imgFor(emoji);
    if (emoji && !img) noImg.push(`${sr} ${emoji}`);
    return { id: (kind === 'phrase' ? 'p:' : 'w:') + sr, kind, sr, ru, emoji: emoji || null, img, ...(note ? { note } : {}) };
  };
  return { id: 'L' + (i + 1), n: i + 1, stage: lv.stage || 'A1', title: lv.title, cards: [...lv.words.map((w) => card(w, 'word')), ...lv.phrases.map((p) => card(p, 'phrase'))] };
});

fs.writeFileSync(`${ROOT}/js/levels.js`, `// Уровни-карточки. Генерируется tools/build_levels.mjs из tools/levels.json — правьте JSON, не этот файл.
// img — файл картинки Fluent Emoji 3D (код эмодзи), null — без картинки.
export const IMG_BASE = 'https://cdn.jsdelivr.net/npm/${PKG}/assets/';
// Этапы пути: A1 → A2 → B1 → B2, у каждого ~50 тем. Уровни без stage относятся к A1.
export const STAGES = [
  { id: 'A1', title: 'Выживание', about: 'Самые нужные слова: люди, еда, числа, время, дом, город, магазин' },
  { id: 'A2', title: 'Базовый', about: 'Быт подробнее: работа, здоровье, путешествия, учреждения, эмоции' },
  { id: 'B1', title: 'Средний', about: 'Мнения, планы, новости, отношения, природа и общество' },
  { id: 'B2', title: 'Уверенный', about: 'Абстрактные темы, профессии, культура, тонкости языка' },
];
export const LEVELS = ${JSON.stringify(out, null, 1)};
export const CARDS = Object.fromEntries(LEVELS.flatMap((l) => l.cards.map((c) => [c.id, { ...c, level: l.id }])));
export const LEVEL = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
`);
const words = out.reduce((s, l) => s + l.cards.filter((c) => c.kind === 'word').length, 0);
// ударения: у каждого слова из 2+ слогов должна быть разметка в js/stress.js
const { STRESS } = await import('../js/stress.js');
const syllables = (w) => (w.toLowerCase().match(/[aeiou]/g) || []).length + (/(^|[^aeiou])r([^aeiou]|$)/i.test(w) ? 1 : 0);
const noStress = out.flatMap((l) => l.cards).filter((c) => c.kind === 'word').flatMap((c) => c.sr.split(' '))
  .filter((w) => w !== 'se' && syllables(w) >= 2 && !STRESS[w]);
if (noStress.length) console.log('без ударения:', noStress.join(', '));
console.log(`levels ${out.length}, words ${words}, phrases ${seen.size - words}`);
console.log(`без картинки Fluent (будет обычный эмодзи): ${noImg.length ? noImg.join(', ') : 'нет'}`);
