// Сборка очереди карточек для урока и для повторения.
//
// Типы карточек:
//   intro    — учебная: картинка, слово, перевод, озвучка
//   rule     — объяснение правила с примерами
//   sr_ru    — сербское слово (+звук) -> выбрать перевод из 4
//   ru_sr    — русское слово -> выбрать сербское из 4 (варианты озвучиваются)
//   audio    — только звук -> выбрать перевод
//   match    — 5 пар: соединить сербское с русским
//   letters  — звук -> собрать слово из букв
//   type     — русское слово -> напечатать по-сербски
//   build    — собрать предложение из слов
//   cloze    — вставить пропущенное слово в предложение

import { ITEMS, LESSON } from './data.js';
import { progress } from './store.js';

export const shuffle = (a) => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = (a) => a[Math.floor(Math.random() * a.length)];

const each = (ids, t) => shuffle(ids).map((id) => ({ t, id }));
const matchTask = (ids) => ({ t: 'match', ids: shuffle(ids).slice(0, 5) });

// Урок делится на короткие уровни по 1–2 минуты. После каждого — поздравление.
// prev — слова из прошлых уроков, которые подмешиваются для закрепления.
export function buildLessonLevels(lessonId, prev = []) {
  const L = LESSON[lessonId];
  if (L.type === 'words') return wordLevels(L.itemIds, prev);
  if (L.type === 'phrases') return phraseLevels(L.itemIds);
  if (L.type === 'dialog') return dialogLevels(L);
  return grammarLevels(L);
}

const intro = (ids) => ids.map((id) => ({ t: 'intro', id }));
const exTask = (ex) => (ex.k === 'build' ? { t: 'build', id: ex.itemId } : { t: 'cloze', ex });

// 10 слов: знакомимся пятёрками, затем пары, слух и буквы, в конце — контрольный прогон.
function wordLevels(ids, prev) {
  const a = ids.slice(0, 5), b = ids.slice(5);
  const half = shuffle(ids);
  return [
    { title: 'Новые слова', emoji: '🌱', tasks: [...intro(a), ...each(a, 'sr_ru'), ...each(a, 'ru_sr')] },
    { title: 'Ещё новые слова', emoji: '🌿', tasks: [...intro(b), ...each(b, 'sr_ru'), ...each(b, 'ru_sr'),
      ...prev.map((id) => ({ t: pick(['ru_sr', 'audio']), id }))] },
    { title: 'Найди пары', emoji: '🧩', tasks: [matchTask(a), matchTask(b), ...each(ids, 'ru_sr')] },
    { title: 'На слух', emoji: '👂', tasks: [...each(ids, 'audio'), ...each(half.slice(0, 5), 'letters')] },
    { title: 'Финал', emoji: '🏆', tasks: [...each(half.slice(5), 'letters'),
      ...shuffle(ids).map((id) => ({ t: pick(['ru_sr', 'audio', 'letters']), id, final: true }))] },
  ];
}

function phraseLevels(ids) {
  const n = Math.ceil(ids.length / 2), a = ids.slice(0, n), b = ids.slice(n);
  return [
    { title: 'Новые фразы', emoji: '🌱', tasks: [...intro(a), ...each(a, 'sr_ru')] },
    { title: 'Ещё фразы', emoji: '🌿', tasks: [...intro(b), ...each(b, 'sr_ru')] },
    { title: 'Как сказать?', emoji: '💬', tasks: [...each(ids, 'ru_sr'), ...each(ids, 'audio')] },
    { title: 'Собери фразу', emoji: '🧩', tasks: each(ids, 'build') },
    { title: 'Финал', emoji: '🏆', tasks: shuffle(ids).map((id) => ({ t: pick(['ru_sr', 'build', 'audio']), id, final: true })) },
  ];
}

function grammarLevels(L) {
  const words = L.itemIds.filter((id) => ITEMS[id].kind === 'word');
  const builds = shuffle(L.exercises.filter((e) => e.k === 'build'));
  const clozes = shuffle(L.exercises.filter((e) => e.k === 'cloze'));
  const h = Math.ceil(builds.length / 2);
  return [
    { title: 'Правило', emoji: '📐', tasks: [...L.rules.map((_, i) => ({ t: 'rule', lesson: L.id, i })),
      ...intro(words), ...each(words, 'sr_ru'), ...each(words, 'ru_sr')] },
    { title: 'Вставь слово', emoji: '✏️', tasks: clozes.map(exTask) },
    { title: 'Собери предложение', emoji: '🧩', tasks: builds.slice(0, h).map(exTask) },
    { title: 'Финал', emoji: '🏆', tasks: shuffle([...builds.slice(h), ...clozes.slice(0, 2)]).map(exTask) },
  ];
}

// Диалог: посмотреть сцену → понять реплики собеседника → ответить самому → то же на слух.
// Ответы идут по порядку разговора, поэтому после ошибки реплику не откладываем (noRetry).
function dialogLevels(L) {
  const idx = (who) => L.lines.map((l, i) => (l[0] === who ? i : -1)).filter((i) => i >= 0);
  return [
    { title: 'Сцена', emoji: '🎬', tasks: [{ t: 'scene', lesson: L.id }] },
    { title: 'Что тебе сказали?', emoji: '👂', tasks: shuffle(idx('a')).map((i) => ({ t: 'listen', lesson: L.id, i })) },
    { title: 'Ответь', emoji: '💬', tasks: idx('me').map((i) => ({ t: 'chat', lesson: L.id, i, noRetry: true })) },
    { title: 'Финал на слух', emoji: '🏆', tasks: idx('me').map((i) => ({ t: 'chat', lesson: L.id, i, hide: true, noRetry: true })) },
  ];
}

// Быстрое повторение: случайные единицы из всего пройденного и случайные типы карточек.
// ~14 карточек + «пары» ≈ 2–4 минуты. Каждый запуск — новый набор.
const ANY_TYPE = {
  word: ['sr_ru', 'ru_sr', 'audio', 'letters', 'type', 'ru_sr', 'letters'],
  phrase: ['sr_ru', 'ru_sr', 'audio', 'build'],
  sentence: ['build'],
};
export function buildQuickTasks(learned, n = 14) {
  const ids = shuffle(learned);
  const tasks = ids.slice(0, n).map((id) => ({ t: pick(ANY_TYPE[ITEMS[id].kind]), id }));
  const words = ids.slice(n).filter((id) => ITEMS[id].kind === 'word');
  if (words.length >= 5) tasks.splice(Math.floor(Math.random() * tasks.length), 0, matchTask(words.slice(0, 5)));
  return tasks;
}

// Повторение: тип карточки зависит от того, насколько хорошо единица уже знакома.
// Слабые — узнавание, средние — вспоминание и слух, крепкие — сборка и печать.
function reviewType(id) {
  const it = ITEMS[id], iv = progress(id)?.iv || 1;
  if (it.kind === 'sentence') return 'build';
  if (it.kind === 'phrase') return pick(iv < 3 ? ['sr_ru', 'ru_sr', 'audio'] : ['ru_sr', 'audio', 'build']);
  if (iv < 3) return pick(['sr_ru', 'ru_sr', 'audio']);
  if (iv < 7) return pick(['ru_sr', 'audio', 'letters']);
  return pick(['letters', 'type', 'audio', 'ru_sr']);
}

export function buildReviewTasks(ids) {
  let tasks = shuffle(ids).map((id) => ({ t: reviewType(id), id }));
  // самые слабые слова (до 5) объединяем в одну карточку «пары» — быстро и наглядно
  const weak = tasks.filter((x) => x.t === 'sr_ru' && ITEMS[x.id].kind === 'word');
  if (weak.length >= 4) {
    const ids5 = weak.slice(0, 5).map((x) => x.id);
    tasks = tasks.filter((x) => !(x.t === 'sr_ru' && ids5.includes(x.id)));
    tasks.unshift({ t: 'match', ids: ids5 });
  }
  return tasks;
}

// После ошибки карточка возвращается через пару шагов. Для «пар» — отдельными карточками.
export function retryTasks(task, wrongIds) {
  if (task.t === 'match') return wrongIds.map((id) => ({ t: 'ru_sr', id, retry: true }));
  return [{ ...task, retry: true }];
}

// Варианты ответа: того же типа (существительные к существительным и т.п.), с разным переводом.
export function distractors(id, pool, n = 3) {
  const it = ITEMS[id];
  const ok = (x) => x !== id && ITEMS[x] && ITEMS[x].kind === it.kind && ITEMS[x].ru !== it.ru && ITEMS[x].sr !== it.sr;
  const same = shuffle(pool.filter((x) => ok(x) && ITEMS[x].pos === it.pos));
  const other = shuffle(pool.filter((x) => ok(x) && ITEMS[x].pos !== it.pos));
  let out = [...same, ...other].slice(0, n);
  if (out.length < n) {
    const any = shuffle(Object.keys(ITEMS).filter((x) => ok(x) && !out.includes(x)));
    out = [...out, ...any].slice(0, n);
  }
  return out;
}
