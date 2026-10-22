import { COURSE, ITEMS, LESSON, UNITS, UNIT } from './data.js';
import * as store from './store.js';
import { buildLessonLevels, buildReviewTasks, buildQuickTasks, retryTasks, distractors, shuffle } from './engine.js';
import { speak, stop, preload, warmAudio, VOICES } from './audio.js';
import { toCyr, letters, norm, stripDiacritics } from './translit.js';
import { renderProgress, knowledge, cefr } from './progress.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Сербский текст в выбранной азбуке
const D = (s) => (store.settings().script === 'cyr' ? toCyr(s) : s);
const say = (sr) => speak(sr);
const autoSay = (sr) => { if (store.settings().autoplay) setTimeout(() => say(sr), 150); };
// Лёгкая вибрация на Android (iPhone веб-приложениям вибрацию не даёт)
const buzz = (p) => { try { navigator.vibrate?.(p); } catch {} };

const TYPE_LABEL = { words: 'Слова', grammar: 'Правило', phrases: 'Фразы', dialog: 'Диалог' };
const view = $('#view');
let tab = 'home';

// ================= Вкладки =================

function renderTabs() {
  document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  ({
    home: renderHome, course: renderCourse, progress: () => renderProgress(view, { esc, D, say }),
    words: renderWords, settings: renderSettings,
  })[tab]();
  window.scrollTo(0, 0);
}
document.querySelector('nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-tab]');
  if (b) { tab = b.dataset.tab; renderTabs(); }
});

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return ['Laku noć', '🌙'];
  if (h < 11) return ['Dobro jutro', '☀️'];
  if (h < 18) return ['Dobar dan', '🌤️'];
  return ['Dobro veče', '🌆'];
}

function renderHome() {
  const learned = store.learnedIds().length;
  const reviewDone = store.reviewDoneToday();
  const reviewIds = store.pickReview();
  const next = store.nextLesson();
  const due = store.dueCount();
  const lvl = next ? store.levelProgress(next.id)?.level || 0 : 0;
  // начатый урок можно продолжить в любой момент
  const lessonLocked = reviewIds.length > 0 && !reviewDone && !lvl;
  const st = store.streak();
  const k = knowledge(), c = cefr(k.score);
  const [hello, sun] = greeting();
  const unit = next && UNIT[next.unit];
  const unitLessons = unit ? unit.lessons : [];
  const unitDone = unitLessons.filter((L) => store.isDone(L.id)).length;

  const reviewCard = learned === 0
    ? `<div class="step muted"><div class="step-n">1</div><div><h3>Повторение</h3><p>Появится после первого урока</p></div></div>`
    : !reviewDone && !reviewIds.length
    ? `<div class="step ok"><div class="step-n">✓</div><div><h3>Повторять пока нечего</h3>
        <p>Сегодняшние слова вернутся завтра</p>
        <button class="link" data-act="extra-review">Всё равно повторить</button></div></div>`
    : reviewDone
      ? `<div class="step ok"><div class="step-n">✓</div><div><h3>Повторение сделано</h3>
          <button class="link" data-act="extra-review">Ещё одно повторение</button></div></div>`
      : `<div class="step active"><div class="step-n">1</div><div><h3>Повторение</h3>
          <p>${reviewIds.length} карточек · ~${Math.max(2, Math.round(reviewIds.length * 0.15))} мин${due ? ` · пора: ${due}` : ''}</p>
          <button class="btn" data-act="review">Начать повторение</button></div></div>`;

  const preview = next?.type === 'dialog' ? `${next.emoji} ${esc(next.scene)}`
    : next?.type === 'grammar'
    ? `${next.rules.map((r) => esc(r.title)).join(' · ')}`
    : next ? next.itemIds.filter((id) => ITEMS[id].kind !== 'sentence').slice(0, 5)
      .map((id) => `<span class="chip">${ITEMS[id].emoji} ${esc(D(ITEMS[id].sr))}</span>`).join('') : '';

  const lessonCard = !next
    ? `<div class="step ok"><div class="step-n">🏁</div><div><h3>Весь курс пройден!</h3><p>Продолжай ежедневное повторение — оно держит слова в памяти.</p></div></div>`
    : `<div class="step ${lessonLocked ? 'muted' : 'active'}"><div class="step-n">2</div><div>
        <span class="badge ${next.type}">${TYPE_LABEL[next.type]}</span>
        <h3>${esc(next.title)}</h3>
        <div class="preview">${preview}</div>
        ${levelDots(next.id)}
        ${lessonLocked
          ? `<p class="hint">Сначала повторение — так новое ляжет на крепкую базу 👆</p>`
          : `<button class="btn" data-act="lesson" data-id="${next.id}">${lvl
            ? `Продолжить: уровень ${lvl + 1}`
            : store.lessonsToday() ? 'Ещё урок' : 'Начать урок'}</button>`}
      </div></div>`;

  view.innerHTML = `
    <section class="hello">
      <div><p class="hello-sub">${sun} ${hello}!</p><h2>Учим сербский</h2></div>
      <div class="streak" title="Дней подряд">🔥 ${st}</div>
    </section>
    <button class="card level-mini" data-act="progress">
      <div class="lv-badge sm">${c.cur.id}</div>
      <div class="lm-body">
        <div class="lm-row"><b>${c.cur.name}</b><span>${c.next ? `${Math.round(c.pct * 100)}% до ${c.next.id}` : 'максимум'}</span></div>
        <div class="meter"><i style="width:${Math.round(c.pct * 100)}%"></i></div>
        <small>${k.known + k.learning} слов · ${k.phrases + k.phrasesLearning} фраз · ${k.grammar} тем</small>
      </div>
    </button>
    ${unit ? `<p class="unit-line">${unit.emoji} Блок ${UNITS.indexOf(unit) + 1} · ${esc(unit.title)} <span>${unitDone}/${unitLessons.length}</span></p>` : ''}
    ${reviewCard}
    ${lessonCard}
    ${learned >= 4 ? `<button class="card quick" data-act="quick">
      <span class="q-ico">⚡</span>
      <div><b>Быстрое повторение</b><small>2–4 минуты · всё пройденное вперемешку · каждый раз новое</small></div>
      <span class="q-go">›</span>
    </button>` : ''}`;

  view.onclick = (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'review') startReview();
    if (b.dataset.act === 'extra-review') startReview(true);
    if (b.dataset.act === 'quick') startQuick();
    if (b.dataset.act === 'lesson') startLesson(b.dataset.id);
    if (b.dataset.act === 'progress') { tab = 'progress'; renderTabs(); }
  };
}

const levelsOf = (lessonId) => buildLessonLevels(lessonId);

// Кружки уровней урока: пройден, текущий, впереди
function levelDots(lessonId) {
  const levels = levelsOf(lessonId);
  const done = store.isDone(lessonId) && !store.levelProgress(lessonId) ? levels.length : store.levelProgress(lessonId)?.level || 0;
  return `<div class="dots">${levels.map((l, i) => `<span class="${i < done ? 'on' : i === done ? 'cur' : ''}" title="${esc(l.title)}">${l.emoji}</span>`).join('')}</div>`;
}

function renderCourse() {
  const next = store.nextLesson();
  const total = { words: 0, grammar: 0, phrases: 0 };
  COURSE.forEach((L) => total[L.type]++);
  view.innerHTML = `<h2 class="page-h">Курс</h2>
    <p class="muted-t page-sub">${UNITS.length} блоков · ${total.words} уроков слов · ${total.grammar} правил · ${total.phrases} уроков фраз</p>
    ${UNITS.map((u, ui) => {
      const done = u.lessons.filter((L) => store.isDone(L.id)).length;
      const open = u.lessons.some((L) => L === next) || (done > 0 && done < u.lessons.length);
      return `<details class="unit" ${open ? 'open' : ''}>
        <summary>
          <span class="u-emoji">${u.emoji}</span>
          <div class="u-t"><small>Блок ${ui + 1} · ${u.cefr}</small><b>${esc(u.title)}</b>
            <div class="meter thin"><i style="width:${Math.round((done / u.lessons.length) * 100)}%"></i></div></div>
          <span class="u-n">${done}/${u.lessons.length}</span>
        </summary>
        <ul class="course">${u.lessons.map((L) => {
          const isDone = store.isDone(L.id), isNext = next && next.id === L.id;
          const n = L.itemIds.filter((id) => ITEMS[id].kind !== 'sentence').length;
          const icon = isDone ? '✓' : isNext ? '▶' : '·';
          return `<li class="${isDone ? 'done' : isNext ? 'next' : 'locked'}" data-id="${L.id}">
            <span class="c-ico">${icon}</span>
            <div><span class="badge ${L.type}">${TYPE_LABEL[L.type]}</span> <b>${esc(L.title)}</b>
            <small>${L.type === 'phrases' ? n + ' фраз' : L.type === 'grammar' ? L.exercises.length + ' упражнений' : L.type === 'dialog' ? L.lines.filter((l) => l[0] === 'me').length + ' реплик · ' + esc(L.who.name) : n + ' слов'}</small>
            ${isDone || isNext ? levelDots(L.id) : ''}</div>
          </li>`;
        }).join('')}</ul>
      </details>`;
    }).join('')}`;
  view.onclick = (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li || li.classList.contains('locked')) return;
    startLesson(li.dataset.id);
  };
}

function renderWords() {
  const ids = store.learnedIds();
  if (!ids.length) { view.innerHTML = `<h2 class="page-h">Мои слова</h2><p class="empty">Пока пусто — пройди первый урок 🙂</p>`; return; }
  const t = store.today();
  const groups = COURSE.filter((L) => ids.some((id) => ITEMS[id].lesson === L.id));
  view.innerHTML = `<h2 class="page-h">Мои слова <small>${ids.length}</small></h2>` + groups.map((L) => `
    <h4 class="w-group">${esc(L.title)}</h4>
    <ul class="words">${L.itemIds.filter((id) => store.progress(id)).map((id) => {
      const it = ITEMS[id], p = store.progress(id), s = store.strength(id);
      const when = p.due <= t ? 'сегодня' : `через ${Math.round((new Date(p.due) - new Date(t)) / 86400000)} дн.`;
      return `<li data-sr="${esc(it.sr)}"><span class="w-e">${it.emoji}</span>
        <div class="w-t"><b>${esc(D(it.sr))}</b><small>${esc(it.ru)}</small></div>
        <div class="w-s"><div class="bar"><i style="width:${Math.round(s * 100)}%"></i></div><small>${when}</small></div></li>`;
    }).join('')}</ul>`).join('');
  view.onclick = (e) => { const li = e.target.closest('li[data-sr]'); if (li) say(li.dataset.sr); };
}

// Прослушать всё подряд и отметить плохо озвученное. Отметки — только в этом браузере,
// список копируется и отправляется, чтобы перегенерировать или заменить записью носителя.
const BAD_KEY = 'srpski.badAudio';
const loadBad = () => { try { return new Set(JSON.parse(localStorage.getItem(BAD_KEY)) || []); } catch { return new Set(); } };
const saveBad = (set) => { try { localStorage.setItem(BAD_KEY, JSON.stringify([...set])); } catch {} };

function renderAudioCheck() {
  const voice = store.settings().voice;
  const bad = loadBad();
  const mark = (sr) => `${voice}:${sr}`;
  const rows = COURSE.map((L) => `<h4 class="w-group">${esc(L.title)}</h4><ul class="words">${L.itemIds.map((id) => {
    const it = ITEMS[id];
    return `<li data-sr="${esc(it.sr)}"><span class="w-e">${it.emoji}</span>
      <div class="w-t"><b>${esc(D(it.sr))}</b><small>${esc(it.ru)}</small></div>
      <button class="flag ${bad.has(mark(it.sr)) ? 'on' : ''}" data-flag="${esc(it.sr)}" aria-label="Плохо озвучено">👎</button></li>`;
  }).join('')}</ul>`).join('');
  view.innerHTML = `<button class="link" data-act="back">← Настройки</button>
    <h2 class="page-h">Проверка озвучки</h2>
    <p class="muted-t page-sub">Голос: ${VOICES[voice]}. Нажми на строку — прозвучит. 👎 — если ударение или произношение неверные.</p>
    <div class="sticky-bar"><button class="btn" data-act="copy">Скопировать отмеченные (<span id="badn">${[...bad].filter((x) => x.startsWith(voice + ':')).length}</span>)</button></div>
    ${rows}`;
  view.onclick = async (e) => {
    const f = e.target.closest('[data-flag]');
    if (f) {
      const k = mark(f.dataset.flag);
      bad.has(k) ? bad.delete(k) : bad.add(k);
      f.classList.toggle('on', bad.has(k));
      saveBad(bad);
      $('#badn').textContent = [...bad].filter((x) => x.startsWith(voice + ':')).length;
      return;
    }
    const b = e.target.closest('[data-act]');
    if (b?.dataset.act === 'back') return renderSettings();
    if (b?.dataset.act === 'copy') {
      const text = 'Плохая озвучка:\n' + [...bad].sort().join('\n');
      try { await navigator.clipboard.writeText(text); alert('Скопировано — пришли этот список мне'); } catch { prompt('Скопируй список:', text); }
      return;
    }
    const li = e.target.closest('li[data-sr]');
    if (li) say(li.dataset.sr);
  };
}

function renderSettings() {
  const s = store.settings();
  view.innerHTML = `<h2 class="page-h">Настройки</h2>
    <div class="set">
      <label>Азбука</label>
      <div class="seg" data-k="script">
        <button data-v="lat" class="${s.script === 'lat' ? 'on' : ''}">Latinica</button>
        <button data-v="cyr" class="${s.script === 'cyr' ? 'on' : ''}">Ћирилица</button>
      </div>
    </div>
    <div class="set">
      <label>Карточек в ежедневном повторении: <b id="rs">${s.reviewSize}</b></label>
      <input type="range" min="10" max="40" step="5" value="${s.reviewSize}" data-k="reviewSize">
      <small>20 ≈ 3–4 минуты. Каждое слово при этом всплывает примерно раз в 3–5 дней, трудные — чаще.</small>
    </div>
    <div class="set row"><label>Автоозвучка карточек</label><input type="checkbox" data-k="autoplay" ${s.autoplay ? 'checked' : ''}></div>
    <div class="set">
      <label>Голос</label>
      <div class="seg" data-k="voice">
        ${Object.entries(VOICES).map(([k, name]) => `<button data-v="${k}" class="${s.voice === k ? 'on' : ''}">${name}</button>`).join('')}
      </div>
      <label class="mt">Скорость озвучки: <b id="rt">${s.rate}</b></label>
      <input type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}" data-k="rate">
      <small>Нажми 🔊 ещё раз — фраза прозвучит медленнее.</small>
      <div class="btns mt">
        <button class="btn ghost" data-act="test">🔊 «Dobar dan, kako si?»</button>
        <button class="btn ghost" data-act="audio-check">Проверка озвучки</button>
      </div>
    </div>
    <div class="set">
      <label>Прогресс</label>
      <div class="btns">
        <button class="btn ghost" data-act="export">Сохранить в файл</button>
        <button class="btn ghost" data-act="import">Загрузить из файла</button>
        <button class="btn danger" data-act="reset">Сбросить всё</button>
      </div>
      <input type="file" id="imp" accept="application/json" hidden>
    </div>
    <div class="set about">
      <label>Как устроен день</label>
      <p>1. <b>Повторение</b>: ${s.reviewSize} карточек из уже выученного. Первыми идут те, кому «пора», потом давно не виденные. Ошибся — карточка вернётся через пару шагов, а слово будет приходить чаще. Без ошибок — следующий показ через 3, 7, 17… дней.</p>
      <p>2. <b>Новый урок</b>: 10 слов за 5 коротких уровней — знакомство, пары, на слух, по буквам, финал. Можно остановиться после любого уровня.</p>
      <p>3. Курс — 12 блоков от A0 до A2: 500+ слов, 13 тем грамматики и 16 уроков полезных фраз. Правила и фразы идут сразу после слов, которые для них нужны.</p>
    </div>`;

  view.onclick = (e) => {
    const seg = e.target.closest('.seg button');
    if (seg) {
      const k = seg.parentElement.dataset.k;
      store.setSetting(k, seg.dataset.v);
      renderSettings();
      if (k === 'voice') { speak('Dobar dan, kako si?', { slow: false }); warmAudio(); }
      return;
    }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'test') say('Dobar dan, kako si?');
    if (b.dataset.act === 'audio-check') renderAudioCheck();
    if (b.dataset.act === 'reset' && confirm('Удалить весь прогресс?')) { store.resetAll(); renderSettings(); }
    if (b.dataset.act === 'export') {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([store.exportState()], { type: 'application/json' }));
      a.download = `srpski-progress-${store.today()}.json`;
      a.click();
    }
    if (b.dataset.act === 'import') $('#imp').click();
  };
  view.oninput = (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    if (k === 'autoplay') store.setSetting(k, e.target.checked);
    else store.setSetting(k, Number(e.target.value));
    if (k === 'reviewSize') $('#rs').textContent = e.target.value;
    if (k === 'rate') $('#rt').textContent = e.target.value;
  };
  $('#imp').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { store.importState(await f.text()); alert('Прогресс загружен'); renderSettings(); } catch { alert('Не получилось прочитать файл'); }
  };
}

// ================= Сессия (урок или повторение) =================

// Быстрое повторение: правильные ответы не сдвигают расписание (чтобы не «перескакивать» интервалы),
// а ошибки учитываются — такие слова чаще придут в ежедневном повторении.
function startQuick() {
  const ids = store.learnedIds();
  if (ids.length < 4) return;
  runSession({
    title: 'Быстрое повторение',
    tasks: buildQuickTasks(ids),
    pool: ids,
    onDone(errors) {
      Object.keys(errors).filter((id) => ITEMS[id]).forEach((id) => store.record(id, errors[id]));
      store.save();
      return { emoji: '⚡', title: 'Быстрое повторение — готово!', next: { label: '⚡ Ещё раз — новые задания', run: startQuick } };
    },
  });
}

function startReview(extra = false) {
  const ids = store.pickReview(undefined, extra);
  if (!ids.length) return;
  runSession({
    title: 'Повторение',
    tasks: buildReviewTasks(ids),
    pool: store.learnedIds(),
    onDone(errors, seen) {
      seen.forEach((id) => store.record(id, errors[id] || 0));
      store.finishReview();
      return { emoji: '🔁', title: 'Повторение готово!' };
    },
  });
}

// Слова из прошлых уроков для закрепления: из самых слабых, но каждый раз разные
function prevWords(L, n = 4) {
  const ids = store.learnedIds().filter((id) => ITEMS[id].kind === 'word' && ITEMS[id].lesson !== L.id);
  return shuffle(ids.sort((a, b) => store.strength(a) - store.strength(b)).slice(0, n * 2)).slice(0, n);
}

function startLesson(lessonId) {
  const L = LESSON[lessonId];
  const levels = buildLessonLevels(lessonId, prevWords(L));
  let n = store.levelProgress(lessonId)?.level || 0;
  if (n >= levels.length) n = 0;
  const level = levels[n];
  runSession({
    title: `${L.title} · ${level.title}`,
    tasks: level.tasks,
    pool: [...new Set([...store.learnedIds(), ...L.itemIds])],
    onDone(errors, seen) {
      const all = store.finishLevel(lessonId, n, levels.length, errors, [...seen]);
      const dots = levelDots(lessonId);
      if (!all) {
        const nx = levels[n + 1];
        return {
          emoji: level.emoji, title: `Уровень ${n + 1} из ${levels.length} пройден!`, dots,
          next: { label: `Дальше: ${nx.emoji} ${nx.title}`, run: () => startLesson(lessonId) },
        };
      }
      // урок целиком: всё изученное уходит в ежедневное повторение
      new Set([...L.itemIds, ...all.seen]).forEach((id) => ITEMS[id] && store.record(id, all.errors[id] || 0));
      store.finishLesson(lessonId);
      const nl = store.nextLesson();
      return {
        emoji: '🏆', title: `Урок «${L.title}» пройден!`, dots, big: true,
        next: nl && (!store.pickReview().length || store.reviewDoneToday())
          ? { label: `Следующий урок: ${nl.title}`, run: () => startLesson(nl.id) } : null,
      };
    },
  });
}

function runSession({ title, tasks, pool, onDone }) {
  const S = { tasks: [...tasks], i: 0, errors: {}, seen: new Set(), mistakes: 0, answered: 0, started: Date.now() };
  // заранее подгружаем звук всех карточек сессии — без пауз и пропусков
  preload([...new Set(tasks.flatMap((t) => [
    ...(t.id ? [ITEMS[t.id].sr] : []), ...(t.ids || []).map((id) => ITEMS[id].sr),
    ...(t.ex ? [t.ex.sr.replace('___', t.ex.a)] : []),
    ...(t.t === 'rule' ? LESSON[t.lesson].rules[t.i].examples.map(([sr]) => sr) : []),
  ]))]);
  // в диалогах у собеседника свой голос
  const dl = tasks.find((t) => LESSON[t.lesson]?.type === 'dialog');
  if (dl) LESSON[dl.lesson].lines.forEach((l) => preload([l[1]], voiceOf(LESSON[dl.lesson], l)));
  const ov = document.createElement('div');
  ov.className = 'session';
  ov.innerHTML = `
    <header><button class="x" aria-label="Закрыть">✕</button><div class="prog"><i></i></div><span class="s-title">${esc(title)}</span></header>
    <main id="card"></main>
    <footer id="foot"><div class="fb"></div><button class="btn big" id="go"></button></footer>`;
  document.body.appendChild(ov);
  document.body.classList.add('in-session');
  const card = $('#card', ov), foot = $('#foot', ov), go = $('#go', ov), fb = $('.fb', ov);

  $('.x', ov).onclick = () => { if (S.i >= S.tasks.length || confirm('Выйти? Прогресс этого уровня не сохранится, пройденные уровни останутся.')) close(); };
  function close() { stop(); ov.remove(); document.body.classList.remove('in-session'); renderTabs(); }

  const markError = (id) => { S.errors[id] = (S.errors[id] || 0) + 1; };
  const requeue = (task, wrongIds) => {
    const at = Math.min(S.tasks.length, S.i + 1 + 3);
    S.tasks.splice(at, 0, ...retryTasks(task, wrongIds));
  };

  function show() {
    if (S.i >= S.tasks.length) return finish();
    $('.prog i', ov).style.width = `${(S.i / S.tasks.length) * 100}%`;
    const task = S.tasks[S.i];
    if (task.id) S.seen.add(task.id);
    if (task.ids) task.ids.forEach((id) => S.seen.add(id));
    foot.className = '';
    fb.innerHTML = '';
    card.innerHTML = '';
    card.scrollTop = 0;

    const R = RENDER[task.t](task, card, pool, {
      ready(on) { go.disabled = !on; },
      finish(wrongIds) {
        task.ids.forEach((id) => store.logAnswer('match', !wrongIds.includes(id), id));
        if (wrongIds.length) { wrongIds.forEach(markError); requeue(task, wrongIds); S.mistakes += wrongIds.length; }
        S.answered++;
        go.textContent = 'Дальше'; go.disabled = false; go.onclick = advance;
      },
    });

    if (R.mode === 'info') {
      go.textContent = task.t === 'rule' ? 'Понятно' : 'Дальше'; go.disabled = false; go.onclick = advance;
    } else if (R.mode === 'self') {
      go.textContent = 'Соедини пары'; go.disabled = true; go.onclick = null;
    } else {
      go.textContent = 'Проверить'; go.disabled = true;
      go.onclick = () => {
        const res = R.check();
        S.answered++;
        const errId = task.id || task.ex?.id || `${task.lesson}:${task.i}`;
        store.logAnswer(task.t, res.ok, task.id);
        buzz(res.ok ? 12 : [30, 40, 30]);
        if (res.ok) {
          foot.className = 'good';
          fb.innerHTML = `<b>${res.near ? 'Почти! ' : pickPraise()}</b>${res.near ? `<span>Правильно: ${esc(res.answer)}</span>` : ''}`;
        } else {
          foot.className = 'bad';
          fb.innerHTML = `<b>Правильно:</b><span>${esc(res.answer)}</span>${res.why ? `<small>${esc(res.why)}</small>` : ''}`;
          markError(errId); S.mistakes++;
          if (!task.noRetry) requeue(task, []);
        }
        if (res.sayAfter) speak(res.sayAfter, res.sayVoice ? { voice: res.sayVoice } : {});
        go.textContent = 'Дальше'; go.onclick = advance;
      };
    }
  }
  function advance() { S.i++; show(); }

  function finish() {
    store.addTime(Date.now() - S.started);
    const res = onDone(S.errors, S.seen) || {};
    const stars = S.mistakes === 0 ? 3 : S.mistakes <= 2 ? 2 : 1;
    const hard = Object.keys(S.errors).filter((id) => ITEMS[id]);
    card.innerHTML = `<div class="finish ${res.big ? 'big' : ''}">
      <div class="confetti">${confetti()}</div>
      <div class="finish-e">${res.emoji || '🎉'}</div>
      <h2>${esc(res.title || title + ' — готово!')}</h2>
      <div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(3 - stars)}</i></div>
      <p class="compliment">${compliment(stars)}</p>
      ${res.dots || ''}
      <p class="muted-t">Карточек: <b>${S.answered}</b> · ошибок: <b>${S.mistakes}</b></p>
      ${hard.length ? `<p class="muted-t">Чаще будут попадаться:</p><ul class="hard">${hard.map((id) => `<li>${ITEMS[id].emoji} <b>${esc(D(ITEMS[id].sr))}</b> — ${esc(ITEMS[id].ru)}</li>`).join('')}</ul>` : ''}
      ${res.next ? '<button class="link" data-act="home">На сегодня хватит — на главную</button>' : ''}
    </div>`;
    $('.prog i', ov).style.width = '100%';
    foot.className = 'good'; fb.innerHTML = '';
    go.disabled = false;
    if (res.next) {
      go.textContent = res.next.label;
      go.onclick = () => { close(); res.next.run(); };
      $('[data-act=home]', card).onclick = close;
    } else {
      go.textContent = 'Готово'; go.onclick = close;
    }
  }

  show();
}

const rnd = (a) => a[Math.floor(Math.random() * a.length)];
const PRAISE = ['Верно!', 'Tačno! ✓', 'Bravo!', 'Супер!', 'Odlično!'];
const pickPraise = () => rnd(PRAISE);

const COMPLIMENTS = {
  3: [
    'Bravo! Ни одной ошибки — чисто как по нотам 🎯',
    'Odlično! Сербы бы тобой гордились 🇷🇸',
    'Svaka čast! Мозг работает как часы 🧠',
    'Sjajno! Схватываешь на лету 🚀',
    'Без единой ошибки. Ты точно в первый раз? 😏',
  ],
  2: [
    'Bravo! Почти идеально 💪',
    'Odlično! Пара промахов — и всё уже запомнилось',
    'Супер темп! Ещё чуть-чуть — и будет без ошибок',
    'Dobro! Слова уже цепляются за память 🧲',
  ],
  1: [
    'Ошибки — это и есть обучение. Эти слова вернутся, и ты их добьёшь 💪',
    'Polako! Главное — регулярность, а она у тебя есть 🐢',
    'Трудные слова отмечены — в следующий раз будет легче',
  ],
};
const compliment = (stars) => rnd(COMPLIMENTS[stars]);
const confetti = () => Array.from({ length: 14 }, (_, i) =>
  `<i style="left:${Math.round(Math.random() * 100)}%;animation-delay:${(Math.random() * 0.6).toFixed(2)}s">${rnd(['🎉', '⭐', '✨', '🇷🇸', '🎊'])}</i>`).join('');

// ================= Карточки =================

const speakBtn = (sr, big) => `<button class="spk${big ? ' big' : ''}" data-say="${esc(sr)}" aria-label="Озвучить">🔊</button>`;
// #card один на всю сессию — обработчик вешаем один раз, иначе одно нажатие запускает звук N раз
function bindSpeak(el) {
  if (el.dataset.speakBound) return;
  el.dataset.speakBound = '1';
  el.addEventListener('click', (e) => { const b = e.target.closest('[data-say]'); if (b) say(b.dataset.say); });
}

function optionList(el, opts, label, onPick) {
  const wrap = document.createElement('div');
  wrap.className = 'opts';
  wrap.innerHTML = opts.map((o, i) => `<button class="opt" data-i="${i}">${esc(label(o))}</button>`).join('');
  wrap.onclick = (e) => {
    const b = e.target.closest('.opt');
    if (!b || wrap.classList.contains('locked')) return;
    wrap.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel'));
    b.classList.add('sel');
    onPick(opts[+b.dataset.i]);
  };
  el.appendChild(wrap);
  return {
    reveal(correct, chosen) {
      wrap.classList.add('locked');
      wrap.querySelectorAll('.opt').forEach((b) => {
        const o = opts[+b.dataset.i];
        if (o === correct) b.classList.add('right');
        else if (o === chosen) b.classList.add('wrong');
      });
    },
  };
}

// Плитки для сборки (буквы или слова)
function tiles(el, units, onChange) {
  const box = document.createElement('div');
  box.innerHTML = `<div class="answer"></div><div class="tiles"></div>`;
  el.appendChild(box);
  const ans = $('.answer', box), pool = $('.tiles', box);
  const picked = [];
  pool.innerHTML = units.map((u, i) => `<button class="tile" data-i="${i}">${esc(D(u))}</button>`).join('');
  pool.onclick = (e) => {
    const b = e.target.closest('.tile');
    if (!b || b.disabled || box.classList.contains('locked')) return;
    b.disabled = true; picked.push(+b.dataset.i); draw();
  };
  ans.onclick = (e) => {
    const b = e.target.closest('.tile');
    if (!b || box.classList.contains('locked')) return;
    const i = +b.dataset.i;
    picked.splice(picked.indexOf(i), 1);
    pool.querySelector(`[data-i="${i}"]`).disabled = false;
    draw();
  };
  function draw() {
    ans.innerHTML = picked.map((i) => `<button class="tile" data-i="${i}">${esc(D(units[i]))}</button>`).join('');
    onChange(picked.map((i) => units[i]));
  }
  return { lock(ok) { box.classList.add('locked'); ans.classList.add(ok ? 'right' : 'wrong'); } };
}

// ---- диалоги ----
const voiceOf = (L, line) => (line[0] === 'a' ? L.who.voice : store.settings().voice);
const sayLine = (L, line) => speak(line[1], { voice: voiceOf(L, line), slow: false });

function bubble(L, line, i, { hideText = false } = {}) {
  const me = line[0] === 'me';
  return `<div class="bub ${me ? 'me' : 'them'}" data-line="${i}">
    ${me ? '' : `<span class="ava" title="${esc(L.who.name)}">${L.who.emoji}</span>`}
    <div class="bub-in">
      <div class="bub-t">${hideText ? '<span class="hidden-t">🔊 · · ·</span> <button class="link show-t">показать</button>' : esc(D(line[1]))}</div>
      <div class="bub-ru" hidden>${esc(line[2])}</div>
      <button class="tr" aria-label="Перевод">ru</button>
    </div>
  </div>`;
}
// Нажатие на реплику — звук; «ru» — перевод; «показать» — текст скрытой реплики
function bindChat(el, L) {
  el.querySelectorAll('.bub').forEach((b) => {
    b.onclick = (e) => {
      const line = L.lines[+b.dataset.line];
      if (e.target.closest('.tr')) { const ru = b.querySelector('.bub-ru'); ru.hidden = !ru.hidden; return; }
      if (e.target.closest('.show-t')) { b.querySelector('.bub-t').textContent = D(line[1]); return; }
      sayLine(L, line);
    };
  });
}

const RENDER = {
  scene(task, el) {
    const L = LESSON[task.lesson];
    el.innerHTML = `<div class="scene-head"><div class="scene-e">${L.emoji}</div>
      <p>${esc(L.scene)}</p><small>Нажми на реплику — прозвучит, «ru» — перевод</small></div>
      <div class="chat">${L.lines.map((l, i) => bubble(L, l, i)).join('')}</div>
      <button class="btn ghost play-all">▶ Прослушать весь диалог</button>`;
    bindChat(el, L);
    $('.play-all', el).onclick = async () => {
      for (const [i, l] of L.lines.entries()) {
        const b = el.querySelector(`.bub[data-line="${i}"]`);
        if (!b) return;
        b.classList.add('playing');
        b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        const ended = await sayLine(L, l);
        b.classList.remove('playing');
        if (!ended) return; // прервали — например, нажали на другую реплику
      }
    };
    return { mode: 'info' };
  },

  listen(task, el, pool, ctx) {
    const L = LESSON[task.lesson], line = L.lines[task.i];
    const others = shuffle(L.lines.filter((l, i) => l[0] === 'a' && i !== task.i)).slice(0, 2).map((l) => l[2]);
    el.innerHTML = `<div class="q"><span class="tag">Что тебе сказали?</span>
      <div class="who"><span class="ava big">${L.who.emoji}</span><b>${esc(L.who.name)}</b></div>
      <button class="spk big" aria-label="Озвучить">🔊</button>
      <button class="link peek">Показать текст</button><div class="sr phrase" hidden>${esc(D(line[1]))}</div></div>`;
    $('.spk', el).onclick = () => speak(line[1], { voice: voiceOf(L, line) });
    $('.peek', el).onclick = (e) => { e.target.hidden = true; e.target.nextElementSibling.hidden = false; };
    let chosen = null;
    const O = optionList(el, shuffle([line[2], ...others]), (x) => x, (x) => { chosen = x; ctx.ready(true); });
    setTimeout(() => sayLine(L, line), 200);
    return {
      check() {
        const ok = chosen === line[2];
        O.reveal(line[2], chosen);
        return { ok, answer: `${D(line[1])} — ${line[2]}` };
      },
    };
  },

  chat(task, el, pool, ctx) {
    const L = LESSON[task.lesson], line = L.lines[task.i], prev = L.lines[task.i - 1];
    el.innerHTML = `<div class="chat">${L.lines.slice(0, task.i).map((l, i) => bubble(L, l, i, { hideText: task.hide && l[0] === 'a' })).join('')}</div>
      <p class="your-turn">Твой ответ:</p>`;
    bindChat(el, L);
    const chat = $('.chat', el);
    let chosen = null;
    const opts = shuffle([line[1], ...line[3].map(([sr]) => sr)]);
    const O = optionList(el, opts, D, (x) => { chosen = x; speak(x, { slow: false }); ctx.ready(true); });
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    if (prev && prev[0] === 'a') setTimeout(() => sayLine(L, prev), 200);
    return {
      check() {
        const ok = chosen === line[1];
        O.reveal(line[1], chosen);
        if (ok) {
          chat.insertAdjacentHTML('beforeend', bubble(L, line, task.i));
          bindChat(el, L);
        }
        const why = ok ? null : line[3].find(([sr]) => sr === chosen)?.[1];
        return { ok, why, answer: `${D(line[1])} — ${line[2]}`, sayAfter: ok ? null : line[1] };
      },
    };
  },

  intro(task, el) {
    const it = ITEMS[task.id];
    el.innerHTML = `<div class="intro">
      <span class="tag">Новое ${it.kind === 'phrase' ? 'выражение' : 'слово'}</span>
      <div class="emoji">${it.emoji}</div>
      <div class="sr ${it.kind === 'phrase' ? 'phrase' : ''}">${esc(D(it.sr))}</div>
      <div class="ru">${esc(it.ru)}</div>
      ${it.note ? `<div class="note">${esc(D(it.note))}</div>` : ''}
      ${speakBtn(it.sr, true)}
    </div>`;
    bindSpeak(el);
    autoSay(it.sr);
    return { mode: 'info' };
  },

  rule(task, el) {
    const r = LESSON[task.lesson].rules[task.i];
    el.innerHTML = `<div class="rule">
      <span class="tag">Правило</span>
      <h2>${esc(r.title)}</h2>
      <div class="rule-body">${r.html}</div>
      <ul class="ex">${r.examples.map(([sr, ru]) => `<li>${speakBtn(sr)}<div><b>${esc(D(sr))}</b><small>${esc(ru)}</small></div></li>`).join('')}</ul>
    </div>`;
    if (store.settings().script === 'cyr') cyrTextNodes($('.rule-body', el));
    bindSpeak(el);
    return { mode: 'info' };
  },

  sr_ru: (t, el, pool, ctx) => choice(t, el, pool, ctx, 'sr_ru'),
  ru_sr: (t, el, pool, ctx) => choice(t, el, pool, ctx, 'ru_sr'),
  audio: (t, el, pool, ctx) => choice(t, el, pool, ctx, 'audio'),

  match(task, el, pool, ctx) {
    const left = shuffle(task.ids), right = shuffle(task.ids);
    const wrong = new Set();
    let selL = null, selR = null, left_n = task.ids.length;
    el.innerHTML = `<div class="q"><span class="tag">Соедини пары</span></div>
      <div class="match">
        <div class="col">${left.map((id) => `<button class="m" data-side="l" data-id="${id}">${esc(D(ITEMS[id].sr))}</button>`).join('')}</div>
        <div class="col">${right.map((id) => `<button class="m" data-side="r" data-id="${id}">${esc(ITEMS[id].ru)}</button>`).join('')}</div>
      </div>`;
    el.querySelector('.match').onclick = (e) => {
      const b = e.target.closest('.m');
      if (!b || b.classList.contains('done')) return;
      const side = b.dataset.side;
      el.querySelectorAll(`.m[data-side="${side}"]`).forEach((x) => x.classList.remove('sel'));
      b.classList.add('sel');
      if (side === 'l') { selL = b; say(ITEMS[b.dataset.id].sr); } else selR = b;
      if (selL && selR) {
        const a = selL, c = selR;
        selL = selR = null;
        if (a.dataset.id === c.dataset.id) {
          [a, c].forEach((x) => { x.classList.remove('sel'); x.classList.add('done'); });
          if (--left_n === 0) ctx.finish([...wrong]);
        } else {
          wrong.add(a.dataset.id);
          [a, c].forEach((x) => { x.classList.remove('sel'); x.classList.add('bad'); });
          setTimeout(() => [a, c].forEach((x) => x.classList.remove('bad')), 500);
        }
      }
    };
    return { mode: 'self' };
  },

  letters(task, el, pool, ctx) {
    const it = ITEMS[task.id];
    const units = letters(it.sr.toLowerCase());
    const extra = shuffle([...'abcčćdđefghijklmnoprsštuvzž'].filter((c) => !units.includes(c))).slice(0, 2);
    el.innerHTML = `<div class="q"><span class="tag">Собери слово на слух</span>
      <div class="emoji sm">${it.emoji}</div>${speakBtn(it.sr, true)}
      <button class="link hint-b">Подсказка</button><div class="hint-t" hidden>${esc(it.ru)}</div></div>`;
    bindSpeak(el);
    $('.hint-b', el).onclick = (e) => { e.target.hidden = true; $('.hint-t', el).hidden = false; };
    let cur = [];
    const T = tiles(el, shuffle([...units, ...extra]), (p) => { cur = p; ctx.ready(p.length === units.length); });
    autoSay(it.sr);
    return {
      check() {
        const ok = cur.join('') === units.join('');
        T.lock(ok);
        return { ok, answer: `${D(it.sr)} — ${it.ru}`, sayAfter: ok ? null : it.sr };
      },
    };
  },

  type(task, el, pool, ctx) {
    const it = ITEMS[task.id];
    const cyr = store.settings().script === 'cyr';
    const keys = cyr ? ['ч', 'ћ', 'ш', 'ж', 'ђ', 'љ', 'њ', 'џ', 'ј'] : ['č', 'ć', 'š', 'ž', 'đ'];
    el.innerHTML = `<div class="q"><span class="tag">Напиши по-сербски</span>
      <div class="emoji sm">${it.emoji}</div><div class="prompt">${esc(it.ru)}</div></div>
      <input class="type-in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${cyr ? 'пиши ћирилицом или latinicom' : 'piši ovde'}">
      <div class="keys">${keys.map((k) => `<button class="key">${k}</button>`).join('')}</div>`;
    const inp = $('.type-in', el);
    inp.oninput = () => ctx.ready(inp.value.trim().length > 0);
    $('.keys', el).onclick = (e) => {
      const b = e.target.closest('.key');
      if (!b) return;
      inp.value += b.textContent; inp.focus(); ctx.ready(true);
    };
    setTimeout(() => inp.focus(), 50);
    return {
      check() {
        inp.disabled = true;
        const a = norm(inp.value), want = norm(it.sr);
        const ok = a === want, near = !ok && stripDiacritics(a) === stripDiacritics(want);
        inp.classList.add(ok || near ? 'right' : 'wrong');
        return { ok: ok || near, near, answer: `${D(it.sr)} — ${it.ru}`, sayAfter: it.sr };
      },
    };
  },

  build(task, el, pool, ctx) {
    const it = ITEMS[task.id];
    const words = it.sr.replace(/[.,!?]/g, '').split(/\s+/);
    let extra = it.extra || [];
    if (it.kind === 'phrase') {
      extra = shuffle(pool.filter((x) => ITEMS[x].kind === 'phrase' && x !== it.id)
        .flatMap((x) => ITEMS[x].sr.replace(/[.,!?]/g, '').split(/\s+/)))
        .filter((w) => !words.includes(w)).slice(0, 2);
    }
    el.innerHTML = `<div class="q"><span class="tag">Собери ${it.kind === 'phrase' ? 'фразу' : 'предложение'}</span>
      <div class="prompt">${esc(it.ru)}</div></div>`;
    let cur = [];
    const T = tiles(el, shuffle([...words, ...extra]), (p) => { cur = p; ctx.ready(p.length > 0); });
    return {
      check() {
        const ok = norm(cur.join(' ')) === norm(it.sr);
        T.lock(ok);
        return { ok, answer: D(it.sr), sayAfter: it.sr };
      },
    };
  },

  cloze(task, el, pool, ctx) {
    const ex = task.ex;
    const [before, after] = ex.sr.split('___');
    el.innerHTML = `<div class="q"><span class="tag">Вставь слово</span>
      <div class="prompt sm">${esc(ex.ru)}</div>
      <div class="cloze">${esc(D(before))}<span class="blank">&nbsp;?&nbsp;</span>${esc(D(after))}</div></div>`;
    let chosen = null;
    const O = optionList(el, shuffle(ex.opts), D, (o) => { chosen = o; $('.blank', el).textContent = D(o); ctx.ready(true); });
    return {
      check() {
        const ok = chosen === ex.a;
        O.reveal(ex.a, chosen);
        $('.blank', el).classList.add(ok ? 'right' : 'wrong');
        const full = ex.sr.replace('___', ex.a);
        return { ok, answer: D(full), sayAfter: full };
      },
    };
  },
};

function choice(task, el, pool, ctx, mode) {
  const it = ITEMS[task.id];
  const opts = shuffle([task.id, ...distractors(task.id, pool)]);
  const head = {
    sr_ru: `<span class="tag">Как переводится?</span><div class="emoji sm">${it.emoji}</div>
            <div class="sr">${esc(D(it.sr))}</div>${speakBtn(it.sr)}`,
    ru_sr: `<span class="tag">Как сказать по-сербски?</span><div class="emoji sm">${it.emoji}</div>
            <div class="prompt">${esc(it.ru)}</div>`,
    audio: `<span class="tag">Что ты слышишь?</span>${speakBtn(it.sr, true)}
            <button class="link peek">Не слышно? Показать слово</button><div class="sr" hidden>${esc(D(it.sr))}</div>`,
  }[mode];
  el.innerHTML = `<div class="q">${head}</div>`;
  bindSpeak(el);
  const peek = $('.peek', el);
  if (peek) peek.onclick = () => { peek.hidden = true; peek.nextElementSibling.hidden = false; };
  let chosen = null;
  const O = optionList(el, opts, (id) => (mode === 'ru_sr' ? D(ITEMS[id].sr) : ITEMS[id].ru), (id) => {
    chosen = id;
    if (mode === 'ru_sr') say(ITEMS[id].sr);
    ctx.ready(true);
  });
  if (mode !== 'ru_sr') autoSay(it.sr);
  return {
    check() {
      const ok = chosen === task.id;
      O.reveal(task.id, chosen);
      return { ok, answer: `${D(it.sr)} — ${it.ru}`, sayAfter: mode === 'ru_sr' && ok ? null : it.sr };
    },
  };
}

function cyrTextNodes(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) n.nodeValue = toCyr(n.nodeValue);
}

// ================= Старт =================
renderTabs();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  // озвучку для офлайна качаем, когда приложение уже показалось
  setTimeout(() => warmAudio(), 4000);
}
