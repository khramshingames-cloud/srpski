// Проверка контента: дубликаты, объём, и что упражнения правил строятся из уже пройденных слов.
//   node tools/check.mjs
import { COURSE, UNITS, ITEMS } from '../js/data.js';
import { norm } from '../js/translit.js';

let problems = 0;
const seen = new Map();
for (const L of COURSE) {
  for (const w of L.words || []) {
    const k = norm(w[0]);
    if (seen.has(k)) { console.log(`DUP word "${w[0]}" in ${L.id} and ${seen.get(k)}`); problems++; }
    seen.set(k, L.id);
  }
}
const ruSeen = new Map();
for (const it of Object.values(ITEMS).filter((i) => i.kind === 'word')) {
  if (ruSeen.has(it.ru)) { console.log(`same translation "${it.ru}": ${it.sr} / ${ruSeen.get(it.ru)}`); }
  ruSeen.set(it.ru, it.sr);
}

// «знакомо», если слово уже было или похоже на пройденное (грубая проверка словоформ)
const known = [];
const NAMES = new Set(['ana', 'marko']);
const isKnown = (t) => NAMES.has(t) || known.some((k) => k === t || (k.length >= 3 && t.startsWith(k.slice(0, Math.max(3, k.length - 2)))));
for (const L of COURSE) {
  for (const w of L.words || []) known.push(...norm(w[0]).split(' '));
  if (L.type !== 'grammar') continue;
  const texts = [...L.exercises.map((e) => (e.a ? e.sr.replace('___', e.a) : e.sr)), ...L.rules.flatMap((r) => r.examples.map((x) => x[0]))];
  const unknown = new Set();
  for (const t of texts) for (const tok of norm(t).split(' ')) if (tok && !isKnown(tok)) unknown.add(tok);
  if (unknown.size) console.log(`${L.id} «${L.title}» — проверить словоформы: ${[...unknown].join(', ')}`);
}

const words = Object.values(ITEMS).filter((i) => i.kind === 'word').length;
const phrases = Object.values(ITEMS).filter((i) => i.kind === 'phrase').length;
const sentences = Object.values(ITEMS).filter((i) => i.kind === 'sentence').length;
console.log(`\nunits ${UNITS.length}, lessons ${COURSE.length} (words ${COURSE.filter((l) => l.type === 'words').length}, grammar ${COURSE.filter((l) => l.type === 'grammar').length}, phrases ${COURSE.filter((l) => l.type === 'phrases').length})`);
console.log(`words ${words}, phrases ${phrases}, sentences ${sentences}, problems ${problems}`);

// ---- ударения: у каждого слова из 2+ слогов должна быть разметка ----
const { STRESS } = await import('../js/stress.js');
const syllables = (w) => (w.toLowerCase().match(/[aeiou]/g) || []).length + (/(^|[^aeiou])r([^aeiou]|$)/i.test(w) ? 1 : 0);
const wordTokens = new Set(Object.values(ITEMS).filter((i) => i.kind === 'word').flatMap((i) => i.sr.split(' ')).filter((w) => w !== 'se'));
const missing = [...wordTokens].filter((w) => syllables(w) >= 2 && !STRESS[w]);
const extra = Object.keys(STRESS).filter((w) => !wordTokens.has(w));
console.log(`stress: ${Object.keys(STRESS).length} marked, missing ${missing.length}${missing.length ? ': ' + missing.join(', ') : ''}${extra.length ? ' | not in course: ' + extra.join(', ') : ''}`);
