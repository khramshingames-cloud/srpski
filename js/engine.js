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

export function buildLessonTasks(lessonId) {
  const L = LESSON[lessonId];
  if (L.type === 'words') return wordLesson(L.itemIds);
  if (L.type === 'phrases') return phraseLesson(L.itemIds);
  return grammarLesson(L);
}

// 10 слов: знакомимся пятёрками, затем круги разными типами карточек, в конце — контрольный прогон.
function wordLesson(ids) {
  const a = ids.slice(0, 5), b = ids.slice(5);
  return [
    ...a.map((id) => ({ t: 'intro', id })),
    ...each(a, 'sr_ru'),
    matchTask(a),
    ...b.map((id) => ({ t: 'intro', id })),
    ...each(b, 'sr_ru'),
    matchTask(b),
    ...each(ids, 'ru_sr'),
    ...each(ids, 'audio'),
    ...each(ids, 'letters'),
    ...shuffle(ids).map((id) => ({ t: pick(['ru_sr', 'audio', 'letters']), id, final: true })),
  ];
}

function phraseLesson(ids) {
  return [
    ...ids.map((id) => ({ t: 'intro', id })),
    ...each(ids, 'sr_ru'),
    ...each(ids, 'ru_sr'),
    ...each(ids, 'audio'),
    ...each(ids, 'build'),
    ...shuffle(ids).map((id) => ({ t: pick(['ru_sr', 'build']), id, final: true })),
  ];
}

function grammarLesson(L) {
  const words = L.itemIds.filter((id) => ITEMS[id].kind === 'word');
  return [
    ...L.rules.map((_, i) => ({ t: 'rule', lesson: L.id, i })),
    ...words.map((id) => ({ t: 'intro', id })),
    ...each(words, 'sr_ru'),
    ...each(words, 'ru_sr'),
    ...shuffle(L.exercises).map((ex) => ex.k === 'build' ? { t: 'build', id: ex.itemId } : { t: 'cloze', ex }),
  ];
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
