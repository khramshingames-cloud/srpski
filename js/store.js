// Прогресс и интервальное повторение (упрощённый SM-2).
//
// У каждой выученной единицы есть интервал (дней до следующего показа) и «лёгкость».
// Ответил с первого раза -> интервал растёт: 1 -> 3 -> ~7 -> ~17 -> ...
// Ошибся -> интервал сбрасывается на 1 день, лёгкость падает (слово будет приходить чаще).

import { COURSE, ITEMS } from './data.js';

const KEY = 'srpski.v1';
const MAX_INTERVAL = 60;

const DEFAULTS = {
  script: 'lat',     // lat | cyr
  reviewSize: 20,    // сколько единиц в ежедневном повторении
  autoplay: true,
  rate: 1,           // множитель скорости озвучки
  voice: 'f',        // f — Софи, m — Никола
};

let state = load();

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) return { ...s, settings: { ...DEFAULTS, ...s.settings } };
  } catch {}
  return { v: 1, items: {}, done: [], days: {}, settings: { ...DEFAULTS } };
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export const settings = () => state.settings;
export function setSetting(k, v) { state.settings[k] = v; save(); }

export function resetAll() {
  state = { v: 1, items: {}, done: [], days: {}, settings: state.settings };
  save();
}
export const exportState = () => JSON.stringify(state);
export function importState(json) {
  const s = JSON.parse(json);
  if (s.v !== 1) throw new Error('bad version');
  state = { ...s, settings: { ...DEFAULTS, ...s.settings } };
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

export function streak() {
  let n = 0;
  const active = (d) => state.days[d] && (state.days[d].review || state.days[d].lessons);
  // сегодня ещё не занимались — серия не обрывается
  let off = active(today()) ? 0 : -1;
  while (active(today(off))) { n++; off--; }
  return n;
}
