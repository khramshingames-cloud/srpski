// Оценка уровня (A0–B2) и экран статистики.
//
// Уровень — примерный: считаем «очки знания» из слов, фраз и правил.
// Слово «знаю» — если пережило хотя бы одно интервальное повторение (интервал ≥ 3 дней),
// иначе «учу» и идёт с меньшим весом. Фраза весит как 2 слова, тема правил — как 20.
// Пороги ориентируются на общепринятые объёмы словаря: A1 ≈ 500–700 слов, A2 ≈ 1200–1500,
// B1 ≈ 2500–3000, B2 ≈ 5000+.

import { COURSE, ITEMS } from './data.js';
import * as store from './store.js';

export const CEFR = [
  { id: 'A0', at: 0, name: 'Старт', can: 'Знаешь отдельные слова и приветствия.' },
  { id: 'A1', at: 600, name: 'Выживание', can: 'Представишься, закажешь кофе, спросишь цену и дорогу, поймёшь простые вопросы.' },
  { id: 'A2', at: 1400, name: 'Базовый', can: 'Расскажешь о себе и своём дне, справишься в магазине, у врача, с арендодателем.' },
  { id: 'B1', at: 3000, name: 'Средний', can: 'Поддержишь разговор на знакомые темы, поймёшь основное в речи и новостях.' },
  { id: 'B2', at: 6000, name: 'Уверенный', can: 'Свободно общаешься с носителями, понимаешь фильмы и сложные тексты.' },
];

export function knowledge() {
  let known = 0, learning = 0, phrases = 0, phrasesLearning = 0;
  for (const id of store.learnedIds()) {
    const it = ITEMS[id], p = store.progress(id);
    const solid = p.iv >= 3;
    if (it.kind === 'word') solid ? known++ : learning++;
    if (it.kind === 'phrase') solid ? phrases++ : phrasesLearning++;
  }
  const grammar = COURSE.filter((L) => L.type === 'grammar' && store.isDone(L.id)).length;
  const score = known + learning * 0.4 + phrases * 2 + phrasesLearning * 0.8 + grammar * 20;
  return { known, learning, phrases, phrasesLearning, grammar, score };
}

export function cefr(score = knowledge().score) {
  let i = 0;
  while (i < CEFR.length - 1 && score >= CEFR[i + 1].at) i++;
  const cur = CEFR[i], next = CEFR[i + 1] || null;
  const pct = next ? Math.max(0, Math.min(1, (score - cur.at) / (next.at - cur.at))) : 1;
  return { cur, next, pct, idx: i, toNext: next ? Math.ceil(next.at - score) : 0 };
}

const SKILLS = [
  { key: 'Узнавание', icon: '👀', types: ['sr_ru', 'match'] },
  { key: 'Вспоминание', icon: '💭', types: ['ru_sr'] },
  { key: 'На слух', icon: '👂', types: ['audio'] },
  { key: 'Написание', icon: '✍️', types: ['letters', 'type'] },
  { key: 'Предложения', icon: '🧩', types: ['build', 'cloze'] },
  { key: 'Диалоги', icon: '💬', types: ['chat', 'listen'] },
];
const POS = { n: 'Существительные', v: 'Глаголы', adj: 'Прилагательные', adv: 'Наречия', pron: 'Местоимения', num: 'Числа', other: 'Служебные', phrase: 'Фразы', sentence: 'Предложения' };

const pctOf = ([ok, bad]) => (ok + bad ? ok / (ok + bad) : null);

export function renderProgress(view, { esc, D, say, SRH }) {
  const k = knowledge(), c = cefr(k.score);
  const st = store.stats();
  const lessonsDone = COURSE.filter((L) => store.isDone(L.id)).length;
  const days = store.daysLog();
  const totalMin = Math.round(Object.values(days).reduce((s, d) => s + (d.ms || 0), 0) / 60000);
  const totalCards = Object.values(days).reduce((s, d) => s + (d.cards || 0), 0);
  const totalOk = Object.values(days).reduce((s, d) => s + (d.ok || 0), 0);

  // активность за 14 дней
  const last = Array.from({ length: 14 }, (_, i) => store.today(i - 13));
  const maxCards = Math.max(10, ...last.map((d) => days[d]?.cards || 0));
  const wd = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  const skills = SKILLS.map((s) => {
    const sum = s.types.reduce((a, t) => { const v = st.types?.[t] || [0, 0]; return [a[0] + v[0], a[1] + v[1]]; }, [0, 0]);
    return { ...s, n: sum[0] + sum[1], p: pctOf(sum) };
  });
  const rated = skills.filter((s) => s.n >= 10);
  const best = rated.length ? rated.reduce((a, b) => (b.p > a.p ? b : a)) : null;
  const worst = rated.length > 1 ? rated.reduce((a, b) => (b.p < a.p ? b : a)) : null;

  const pos = Object.entries(st.pos || {}).filter(([, v]) => v[0] + v[1] >= 5)
    .map(([key, v]) => ({ key, p: pctOf(v), n: v[0] + v[1] })).sort((a, b) => a.p - b.p);

  const hard = store.learnedIds().map((id) => ({ id, p: store.progress(id) }))
    .filter((x) => x.p.lapses > 0).sort((a, b) => b.p.lapses - a.p.lapses || a.p.ease - b.p.ease).slice(0, 8);

  const bar = (p) => `<div class="meter"><i style="width:${Math.round((p ?? 0) * 100)}%"></i></div>`;

  view.innerHTML = `
    <h2 class="page-h">Мой прогресс</h2>

    <section class="card level-hero">
      <div class="lv-top">
        <div class="lv-badge">${c.cur.id}</div>
        <div>
          <div class="lv-name">${c.cur.name}</div>
          <div class="muted-t">${c.next ? `до ${c.next.id} — ${Math.round(c.pct * 100)}%` : 'Вершина курса'}</div>
        </div>
      </div>
      ${c.next ? `${bar(c.pct)}<p class="muted-t">До ${c.next.id} осталось примерно <b>${c.toNext}</b> слов (фраза считается за два слова, тема грамматики — за двадцать).</p>` : ''}
      <ol class="chain">${CEFR.map((l, i) => `
        <li class="${i < c.idx ? 'past' : i === c.idx ? 'now' : ''}">
          <span class="dot">${i < c.idx ? '✓' : l.id}</span>
          <div><b>${l.id} · ${l.name}</b><small>${l.can}</small></div>
        </li>`).join('')}
      </ol>
      <p class="fine">Оценка примерная: считает слова, которые ты удержал в памяти, фразы и пройденные правила.</p>
    </section>

    <section class="grid-stats">
      <div class="card"><b>${k.known}</b><span>слов знаю</span><small>+${k.learning} учу</small></div>
      <div class="card"><b>${k.phrases + k.phrasesLearning}</b><span>фраз</span><small>${k.phrases} закреплено</small></div>
      <div class="card"><b>${k.grammar}</b><span>тем грамматики</span><small>из ${COURSE.filter((L) => L.type === 'grammar').length}</small></div>
      <div class="card"><b>${lessonsDone}</b><span>уроков</span><small>из ${COURSE.length}</small></div>
      <div class="card"><b>${store.streak()}</b><span>дней подряд</span><small>🔥</small></div>
      <div class="card"><b>${totalMin}</b><span>минут занятий</span><small>${totalCards} карточек</small></div>
    </section>

    <section class="card">
      <h3>Последние 2 недели</h3>
      <div class="activity">${last.map((d) => {
        const n = days[d]?.cards || 0;
        return `<div class="act-col" title="${d}: ${n}"><div class="act-bar"><i style="height:${Math.round((n / maxCards) * 100)}%"></i></div><small>${wd[new Date(d).getDay()]}</small></div>`;
      }).join('')}</div>
      <p class="muted-t">Точность за всё время: <b>${totalCards ? Math.round((totalOk / totalCards) * 100) : 0}%</b></p>
    </section>

    <section class="card">
      <h3>Навыки</h3>
      ${skills.map((s) => `<div class="skill"><span>${s.icon} ${s.key}</span>${bar(s.p)}<b>${s.p == null ? '—' : Math.round(s.p * 100) + '%'}</b></div>`).join('')}
      ${best ? `<p class="note-good">💪 Лучше всего: <b>${best.key.toLowerCase()}</b></p>` : '<p class="muted-t">Пройди пару уроков — появятся сильные и слабые стороны.</p>'}
      ${worst && worst !== best ? `<p class="note-work">🌱 Подтянуть: <b>${worst.key.toLowerCase()}</b></p>` : ''}
    </section>

    ${pos.length ? `<section class="card"><h3>По частям речи</h3>
      ${pos.map((x) => `<div class="skill"><span>${POS[x.key] || x.key}</span>${bar(x.p)}<b>${Math.round(x.p * 100)}%</b></div>`).join('')}
    </section>` : ''}

    ${hard.length ? `<section class="card"><h3>Где чаще ошибаюсь</h3>
      <ul class="hard-list">${hard.map(({ id, p }) => `<li data-sr="${esc(ITEMS[id].sr)}"><span>${ITEMS[id].emoji}</span>
        <div><b>${SRH(ITEMS[id])}</b><small>${esc(ITEMS[id].ru)}</small></div><em>✕${p.lapses}</em></li>`).join('')}</ul>
      <p class="fine">Эти слова чаще попадают в повторение, пока не закрепятся.</p>
    </section>` : ''}`;

  view.onclick = (e) => { const li = e.target.closest('li[data-sr]'); if (li) say(li.dataset.sr); };
}
