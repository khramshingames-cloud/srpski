// Прогресс: какие уровни пройдены (хотя бы один полный круг карточек), сколько кругов,
// активность по дням и настройки. Хранится в телефоне (localStorage).

import { LEVELS } from './levels.js';

const KEY = 'srpski.v1'; // ключ прежний — прогресс прошлых версий подхватывается

const DEFAULTS = {
  script: 'lat',   // lat | cyr
  autoplay: true,  // озвучивать карточку при перевороте
  rate: 1,         // скорость озвучки
  voice: 'f',      // f — Софи, m — Никола
  stress: true,    // подсвечивать ударную гласную
};

const fresh = (settings = DEFAULTS) => ({ v: 3, levels: {}, days: {}, settings: { ...settings } });

// v1/v2 (старый курс с уроками) → v3: уровень считается пройденным, если все его слова уже учились.
function migrate(s) {
  if (s.v === 3) return s;
  const known = new Set(Object.keys(s.items || {}));
  const levels = {};
  for (const L of LEVELS) {
    const words = L.cards.filter((c) => c.kind === 'word');
    if (words.length && words.every((c) => known.has(c.id))) levels[L.id] = { rounds: 1, first: null, last: null };
  }
  const { reviewSize, ...settings } = s.settings || {};
  return { ...fresh({ ...DEFAULTS, ...settings }), levels, days: s.days || {} };
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.v >= 1) {
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
save();

export const settings = () => state.settings;
export function setSetting(k, v) { state.settings[k] = v; save(); }

export function resetAll() { state = fresh(state.settings); save(); }
export const exportState = () => JSON.stringify(state);
export function importState(json) {
  const s = migrate(JSON.parse(json));
  state = { ...fresh(), ...s, settings: { ...DEFAULTS, ...s.settings } };
  save();
}

// ---- даты ----
export function today(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function day() { return (state.days[today()] ||= {}); }

// ---- уровни ----
export const levelInfo = (id) => state.levels[id] || null;
export const isPassed = (id) => !!state.levels[id];
export const passedLevels = () => LEVELS.filter((L) => isPassed(L.id));
// Текущий — первый непройденный; всё до него открыто, дальше — закрыто
export const currentLevel = () => LEVELS.find((L) => !isPassed(L.id)) || null;
export const isOpen = (id) => {
  const cur = currentLevel();
  return isPassed(id) || !cur || cur.id === id;
};

// Полный круг по колоде. levelIds — уровни, чьи карточки были в круге (у разминки и микса их несколько).
// Возвращает true, если какой-то уровень пройден впервые.
export function finishRound(levelIds) {
  const t = today();
  let firstTime = false;
  for (const id of levelIds) {
    if (!state.levels[id]) { state.levels[id] = { rounds: 0, first: t }; firstTime = true; }
    state.levels[id].rounds++;
    state.levels[id].last = t;
  }
  const d = day();
  d.rounds = (d.rounds || 0) + 1;
  save();
  return firstTime;
}

// ---- статистика ----
export function countCard() { const d = day(); d.cards = (d.cards || 0) + 1; }
export function addTime(ms) { const d = day(); d.ms = (d.ms || 0) + Math.min(ms, 60 * 60 * 1000); save(); }
export const daysLog = () => state.days;

export function streak() {
  let n = 0;
  const active = (d) => state.days[d] && (state.days[d].cards || state.days[d].rounds);
  let off = active(today()) ? 0 : -1; // сегодня ещё не занимались — серия не обрывается
  while (active(today(off))) { n++; off--; }
  return n;
}
