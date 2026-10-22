// Прогресс и интервальное повторение (упрощённый SM-2).
//
// У каждой выученной единицы есть интервал (дней до следующего показа) и «лёгкость».
// Ответил с первого раза -> интервал растёт: 1 -> 3 -> ~7 -> ~17 -> ...
// Ошибся -> интервал сбрасывается на 1 день, лёгкость падает (слово будет приходить чаще).

import { COURSE, ITEMS } from './data.js';

const KEY = 'srpski.v1'; // имя ключа не меняем, версия данных — внутри
const MAX_INTERVAL = 60;

const DEFAULTS = {
  script: 'lat',     // lat | cyr
  reviewSize: 20,    // сколько единиц в ежедневном повторении
  autoplay: true,
  rate: 1,           // множитель скорости озвучки
  voice: 'f',        // f — Софи, m — Никола
  stress: true,      // подсвечивать ударную гласную
};

const fresh = (settings = DEFAULTS) => ({ v: 2, items: {}, done: [], days: {}, partial: {}, stats: {}, settings: { ...settings } });

// v1 → v2: курс расширен до 500 слов и уроки переставлены. Выученные слова сохраняем (они по тексту),
// а пройденными считаем уроки, все слова которых уже выучены.
function migrate(s) {
  if (s.v === 1) {
    s = { ...fresh(s.settings), items: s.items, days: s.days };
    s.done = COURSE.filter((L) => L.itemIds.length && L.itemIds.every((id) => s.items[id])).map((L) => L.id);
  }
  return s;
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && (raw.v === 1 || raw.v === 2)) {
      const s = migrate(raw);
      return { ...fresh(), ...s, settings: { ...DEFAULTS, ...s.settings } };
    }
  } catch {}
  return fresh();
}

let state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export const settings = () => state.settings;
export function setSetting(k, v) { state.settings[k] = v; save(); }

export function resetAll() {
  state = fresh(state.settings);
  save();
}
export const exportState = () => JSON.stringify(state);
export function importState(json) {
  const s = migrate(JSON.parse(json));
  if (s.v !== 2) throw new Error('bad version');
  state = { ...fresh(), ...s, settings: { ...DEFAULTS, ...s.settings } };
  save();
}

// ---- даты ----
export function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const dayDiff = (a, b) => Math.round((new Date(a) - new Date(b)) / 86400000);

// ---- единицы ----
export const progress = (id) => state.items[id];
export const learnedIds = () => Object.keys(state.items).filter((id) => ITEMS[id]);
export const isDone = (lessonId) => state.done.includes(lessonId);
export const nextLesson = () => COURSE.find((l) => !isDone(l.id));

// Сила слова 0..1 для полоски в словаре
export function strength(id) {
  const p = state.items[id];
  if (!p) return 0;
  return Math.min(1, Math.log2(1 + p.iv) / Math.log2(1 + 30));
}

// Записать результат одной единицы за сессию. errors — сколько раз ошибся в этой сессии.
export function record(id, errors) {
  const t = today();
  let p = state.items[id];
  if (!p) {
    // первое знакомство в уроке
    p = state.items[id] = { iv: 1, ease: errors ? 2.3 : 2.5, reps: 1, lapses: 0, due: today(1), last: t, seen: 1 };
    return;
  }
  // повторное в тот же день не двигает интервал вверх, только вниз при ошибке
  const sameDay = p.last === t;
  if (errors) {
    p.lapses++;
    p.ease = Math.max(1.3, p.ease - 0.2);
    p.iv = 1;
    p.reps = 1;
  } else if (!sameDay) {
    p.iv = p.reps <= 1 ? 3 : Math.min(MAX_INTERVAL, Math.round(p.iv * p.ease));
    p.ease = Math.min(3, p.ease + 0.05);
    p.reps++;
  }
  p.due = today(p.iv);
  p.last = t;
  p.seen++;
}

// Ежедневная подборка: сначала «пора повторить» (самые просроченные и трудные),
// если их меньше лимита — добираем давно не виденными, чтобы все слова крутились.
// extra — дополнительное повторение по желанию: можно брать и то, что уже видели сегодня.
export function pickReview(n = state.settings.reviewSize, extra = false) {
  const t = today();
  const all = learnedIds().map((id) => ({ id, p: state.items[id] }));
  const due = all.filter((x) => x.p.due <= t)
    .sort((a, b) => dayDiff(t, b.p.due) - dayDiff(t, a.p.due) || a.p.ease - b.p.ease);
  const rest = all.filter((x) => x.p.due > t && (extra || x.p.last !== t))
    .sort((a, b) => (a.p.last < b.p.last ? -1 : a.p.last > b.p.last ? 1 : a.p.ease - b.p.ease));
  return [...due, ...rest].slice(0, n).map((x) => x.id);
}

export const dueCount = () => learnedIds().filter((id) => state.items[id].due <= today()).length;

// ---- дни и серия ----
function day() { return (state.days[today()] ||= { review: false, lessons: 0 }); }
export const reviewDoneToday = () => !!state.days[today()]?.review;
export const lessonsToday = () => state.days[today()]?.lessons || 0;

export function finishReview() { day().review = true; save(); }
export function finishLesson(lessonId) {
  if (!state.done.includes(lessonId)) state.done.push(lessonId);
  day().lessons++;
  save();
}

// ---- статистика ----
// По типам карточек и частям речи копим [верно, ошибок]; по дням — карточки, верные, время.
export function logAnswer(type, ok, id) {
  const st = (state.stats ||= {});
  const bump = (group, key) => {
    const g = (st[group] ||= {});
    const v = (g[key] ||= [0, 0]);
    v[ok ? 0 : 1]++;
  };
  bump('types', type);
  if (id && ITEMS[id]) bump('pos', ITEMS[id].pos);
  const d = day();
  d.cards = (d.cards || 0) + 1;
  if (ok) d.ok = (d.ok || 0) + 1;
}
export function addTime(ms) {
  const d = day();
  d.ms = (d.ms || 0) + Math.min(ms, 60 * 60 * 1000);
  save();
}
export const stats = () => state.stats || {};
export const daysLog = () => state.days;

// ---- уровни внутри урока ----
// Пока урок не пройден до конца, копим ошибки и показанные слова; в повторение всё уходит после финала.
export const levelProgress = (lessonId) => state.partial?.[lessonId] || null;

export function finishLevel(lessonId, levelIndex, levelCount, errors, seenIds) {
  state.partial ||= {};
  const p = (state.partial[lessonId] ||= { level: 0, errors: {}, seen: [] });
  for (const [k, v] of Object.entries(errors)) p.errors[k] = (p.errors[k] || 0) + v;
  p.seen = [...new Set([...p.seen, ...seenIds])];
  p.level = levelIndex + 1;
  const d = day();
  d.levels = (d.levels || 0) + 1;
  if (p.level < levelCount) { save(); return null; }
  delete state.partial[lessonId];
  return p;
}

export function streak() {
  let n = 0;
  const active = (d) => state.days[d] && (state.days[d].review || state.days[d].lessons || state.days[d].levels);
  // сегодня ещё не занимались — серия не обрывается
  let off = active(today()) ? 0 : -1;
  while (active(today(off))) { n++; off--; }
  return n;
}
