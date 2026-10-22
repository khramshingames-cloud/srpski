import { COURSE, ITEMS, LESSON } from './data.js';
import * as store from './store.js';
import { buildLessonTasks, buildReviewTasks, retryTasks, distractors, shuffle } from './engine.js';
import { speak, voiceInfo, hasSpeech } from './audio.js';
import { toCyr, letters, norm, stripDiacritics } from './translit.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Сербский текст в выбранной азбуке
const D = (s) => (store.settings().script === 'cyr' ? toCyr(s) : s);
const say = (sr) => speak(sr);
const autoSay = (sr) => { if (store.settings().autoplay) setTimeout(() => say(sr), 150); };

const TYPE_LABEL = { words: 'Слова', grammar: 'Правило', phrases: 'Фразы' };
const view = $('#view');
let tab = 'home';

// ================= Вкладки =================

function renderTabs() {
  document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  ({ home: renderHome, course: renderCourse, words: renderWords, settings: renderSettings })[tab]();
}
document.querySelector('nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-tab]');
  if (b) { tab = b.dataset.tab; renderTabs(); }
});

function countKinds() {
  const ids = store.learnedIds();
  return {
    words: ids.filter((id) => ITEMS[id].kind === 'word').length,
    phrases: ids.filter((id) => ITEMS[id].kind === 'phrase').length,
    sentences: ids.filter((id) => ITEMS[id].kind === 'sentence').length,
  };
}

function renderHome() {
  const learned = store.learnedIds().length;
  const reviewDone = store.reviewDoneToday();
  const reviewIds = store.pickReview();
  const next = store.nextLesson();
  const c = countKinds();
  const due = store.dueCount();
  const lessonLocked = reviewIds.length > 0 && !reviewDone;
  const st = store.streak();

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
          <p>${reviewIds.length} шт. · пора повторить: ${due} · ~${Math.max(2, Math.round(reviewIds.length * 0.15))} мин</p>
          <button class="btn" data-act="review">Начать повторение</button></div></div>`;

  const preview = next?.type === 'grammar'
    ? `${next.rules.map((r) => esc(r.title)).join(' · ')}<br><small>${next.exercises.length} упражнений из знакомых слов</small>`
    : next ? next.itemIds.filter((id) => ITEMS[id].kind !== 'sentence').slice(0, 6)
    .map((id) => `${ITEMS[id].emoji} ${esc(D(ITEMS[id].sr))}`).join(' · ') : '';

  const lessonCard = !next
    ? `<div class="step ok"><div class="step-n">🏁</div><div><h3>Первые 100 слов пройдены!</h3><p>Продолжай ежедневное повторение. Следующий блок скоро.</p></div></div>`
    : `<div class="step ${lessonLocked ? 'muted' : 'active'}"><div class="step-n">2</div><div>
        <span class="badge ${next.type}">${TYPE_LABEL[next.type]}</span>
        <h3>${esc(next.title)}</h3>
        <p class="preview">${preview}</p>
        ${lessonLocked
          ? `<p class="hint">Сначала повторение 👆</p>`
          : `<button class="btn" data-act="lesson" data-id="${next.id}">${store.lessonsToday() ? 'Ещё урок' : 'Начать урок'}</button>`}
      </div></div>`;

  view.innerHTML = `
    <section class="hello">
      <div><h2>Zdravo! 👋</h2><p class="muted-t">Сегодня: повторение → новый урок</p></div>
      <div class="streak" title="Дней подряд">🔥 ${st}</div>
    </section>
    <section class="stats">
      <div><b>${c.words}</b><span>слов</span></div>
      <div><b>${c.phrases}</b><span>фраз</span></div>
      <div><b>${c.sentences}</b><span>предложений</span></div>
    </section>
    ${reviewCard}
    ${lessonCard}`;

  view.onclick = (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'review') startReview();
    if (b.dataset.act === 'extra-review') startReview(true);
    if (b.dataset.act === 'lesson') startLesson(b.dataset.id);
  };
}

function renderCourse() {
  const next = store.nextLesson();
  view.innerHTML = `<h2 class="page-h">Курс: первые 100 слов</h2>
    <p class="muted-t page-sub">10 уроков слов · 3 урока правил · 2 урока фраз</p>
    <ul class="course">${COURSE.map((L) => {
      const done = store.isDone(L.id), isNext = next && next.id === L.id;
      const n = L.itemIds.filter((id) => ITEMS[id].kind !== 'sentence').length;
      const icon = done ? '✓' : isNext ? '▶' : '🔒';
      return `<li class="${done ? 'done' : isNext ? 'next' : 'locked'}" data-id="${L.id}">
        <span class="c-ico">${icon}</span>
        <div><span class="badge ${L.type}">${TYPE_LABEL[L.type]}</span> <b>${esc(L.title)}</b>
        <small>${L.type === 'phrases' ? n + ' фраз' : n + ' слов'}${L.exercises ? ' · ' + L.exercises.length + ' упражнений' : ''}</small></div>
      </li>`;
    }).join('')}</ul>`;
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

function renderSettings() {
  const s = store.settings();
  const v = voiceInfo();
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
      <label>Скорость речи: <b id="rt">${s.rate}</b></label>
      <input type="range" min="0.5" max="1.2" step="0.05" value="${s.rate}" data-k="rate">
      <small>Голос: ${v ? esc(v) : hasSpeech() ? '⚠️ сербский голос не найден, используется голос по умолчанию' : '⚠️ браузер не поддерживает озвучку'}</small>
      <button class="btn ghost" data-act="test">🔊 Проверить: «Dobar dan, kako si?»</button>
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
      <p>1. <b>Повторение</b>: ${s.reviewSize} карточек из уже выученного. Первыми идут те, кому «пора», потом давно не виденные. Ошибся — карточка вернётся через пару шагов, а интервал слова сбросится. Без ошибок — следующий показ через 3, 7, 17… дней.</p>
      <p>2. <b>Новый урок</b>: 10 слов. Знакомство пятёрками, потом круги: выбор перевода → выбор сербского → на слух → из букв → контрольный прогон.</p>
      <p>3. Каждые 3 урока слов — <b>урок правил</b>, после 7-го и 10-го — <b>урок фраз</b>.</p>
    </div>`;

  view.onclick = (e) => {
    const seg = e.target.closest('.seg button');
    if (seg) { store.setSetting(seg.parentElement.dataset.k, seg.dataset.v); renderSettings(); return; }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'test') say('Dobar dan, kako si?');
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
    },
  });
}

function startLesson(lessonId) {
  const L = LESSON[lessonId];
  runSession({
    title: L.title,
    tasks: buildLessonTasks(lessonId),
    pool: [...new Set([...store.learnedIds(), ...L.itemIds])],
    onDone(errors) {
      L.itemIds.forEach((id) => store.record(id, errors[id] || 0));
      store.finishLesson(lessonId);
    },
  });
}

function runSession({ title, tasks, pool, onDone }) {
  const S = { tasks: [...tasks], i: 0, errors: {}, seen: new Set(), mistakes: 0, answered: 0 };
  const ov = document.createElement('div');
  ov.className = 'session';
  ov.innerHTML = `
    <header><button class="x" aria-label="Закрыть">✕</button><div class="prog"><i></i></div><span class="s-title">${esc(title)}</span></header>
    <main id="card"></main>
    <footer id="foot"><div class="fb"></div><button class="btn big" id="go"></button></footer>`;
  document.body.appendChild(ov);
  document.body.classList.add('in-session');
  const card = $('#card', ov), foot = $('#foot', ov), go = $('#go', ov), fb = $('.fb', ov);

  $('.x', ov).onclick = () => { if (confirm('Выйти? Прогресс этой сессии не сохранится.')) close(); };
  function close() { speechSynthesis?.cancel(); ov.remove(); document.body.classList.remove('in-session'); renderTabs(); }

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
        const errId = task.id || task.ex?.id;
        if (res.ok) {
          foot.className = 'good';
          fb.innerHTML = `<b>${res.near ? 'Почти! ' : pickPraise()}</b>${res.near ? `<span>Правильно: ${esc(res.answer)}</span>` : ''}`;
        } else {
          foot.className = 'bad';
          fb.innerHTML = `<b>Правильно:</b><span>${esc(res.answer)}</span>`;
          markError(errId); S.mistakes++;
          requeue(task, []);
        }
        if (res.sayAfter) say(res.sayAfter);
        go.textContent = 'Дальше'; go.onclick = advance;
      };
    }
  }
  function advance() { S.i++; show(); }

  function finish() {
    onDone(S.errors, S.seen);
    const hard = Object.keys(S.errors).filter((id) => ITEMS[id]);
    card.innerHTML = `<div class="finish">
      <div class="finish-e">🎉</div>
      <h2>${title} — готово!</h2>
      <p>Карточек: <b>${S.answered}</b> · ошибок: <b>${S.mistakes}</b></p>
      ${hard.length ? `<p class="muted-t">Чаще будут попадаться:</p><ul class="hard">${hard.map((id) => `<li>${ITEMS[id].emoji} <b>${esc(D(ITEMS[id].sr))}</b> — ${esc(ITEMS[id].ru)}</li>`).join('')}</ul>` : '<p>Без единой ошибки 💪</p>'}
    </div>`;
    $('.prog i', ov).style.width = '100%';
    foot.className = 'good'; fb.innerHTML = '';
    go.textContent = 'Готово'; go.disabled = false; go.onclick = close;
  }

  show();
}

const PRAISE = ['Верно!', 'Tačno! ✓', 'Bravo!', 'Супер!', 'Odlično!'];
const pickPraise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];

// ================= Карточки =================

const speakBtn = (sr, big) => `<button class="spk${big ? ' big' : ''}" data-say="${esc(sr)}" aria-label="Озвучить">🔊</button>`;
function bindSpeak(el) {
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

const RENDER = {
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
    audio: `<span class="tag">Что ты слышишь?</span>${speakBtn(it.sr, true)}`,
  }[mode];
  el.innerHTML = `<div class="q">${head}</div>`;
  bindSpeak(el);
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
}
