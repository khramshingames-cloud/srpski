// Srpski — карточки с самопроверкой.
// Уровни идут по пути A1 → A2 → B1 → B2. Карточка: картинка + русское слово; тап — переворот,
// сербское слово и озвучка; ещё тап — следующая. После последней карточки появляется заставка
// уровня, и колода идёт по кругу, пока не закроешь. Один полный круг = уровень пройден.

import { LEVELS, LEVEL, STAGES, IMG_BASE } from './levels.js';
import * as store from './store.js';
import { speak, stop, preload, warmAudio, VOICES } from './audio.js';
import { toCyr } from './translit.js';
import { stressParts } from './stress.js';

const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const D = (s) => (store.settings().script === 'cyr' ? toCyr(s) : s); // сербский в выбранной азбуке
const buzz = (p) => { try { navigator.vibrate?.(p); } catch {} };
const shuffle = (a) => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many}`;
};

// Сербское слово с подсвеченной ударной гласной (jábuka); фразы — как есть
function SRH(card) {
  if (card.kind !== 'word' || !store.settings().stress) return esc(D(card.sr));
  return stressParts(card.sr).map(([a, v, b]) => (v ? `${esc(D(a))}<span class="acc">${esc(D(v))}́</span>${esc(D(b))}` : esc(D(a)))).join(' ');
}

// Картинка карточки: Fluent 3D, иначе крупные цифры («11», «½»), иначе пусто (абстрактное слово)
function pic(card, cls = '') {
  if (card.img) return `<img class="pic ${cls}" src="${IMG_BASE}${card.img}.webp" alt="" draggable="false">`;
  if (card.emoji) return `<span class="pic num ${cls}">${esc(card.emoji)}</span>`;
  return '';
}
const levelPic = (L) => pic(L.cards.find((c) => c.img) || L.cards[0], 'sm');
const words = (cards) => cards.filter((c) => c.kind === 'word');

const view = $('#view');
let tab = 'levels';

// ================= Вкладки =================

function renderTabs() {
  document.querySelectorAll('nav button').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  ({ levels: renderLevels, stats: renderStats, words: renderWords, settings: renderSettings })[tab]();
}
document.querySelector('nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-tab]');
  if (b) { tab = b.dataset.tab; window.scrollTo(0, 0); renderTabs(); }
});

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Laku noć' : h < 11 ? 'Dobro jutro' : h < 18 ? 'Dobar dan' : 'Dobro veče';
}

function totals() {
  const passed = store.passedLevels();
  const cards = passed.flatMap((L) => L.cards);
  const days = Object.values(store.daysLog());
  return {
    passed: passed.length,
    words: words(cards).length,
    phrases: cards.length - words(cards).length,
    flipped: days.reduce((s, d) => s + (d.cards || 0), 0),
    rounds: days.reduce((s, d) => s + (d.rounds || 0), 0),
    minutes: Math.round(days.reduce((s, d) => s + (d.ms || 0), 0) / 60000),
  };
}

const MIX_SIZE = 50;

// ---- Главная: путь уровней ----
function renderLevels() {
  const t = totals(), cur = store.currentLevel();
  const passedCards = store.passedLevels().flatMap((L) => L.cards);

  const node = (L) => {
    const info = store.levelInfo(L.id), isCur = cur?.id === L.id, open = store.isOpen(L.id);
    const st = info ? 'passed' : isCur ? 'current' : 'locked';
    const n = words(L.cards).length, ph = L.cards.length - n;
    return `<button class="node ${st}" data-level="${L.id}">
      <span class="node-pic">${levelPic(L)}<i>${L.n}</i></span>
      <span class="node-t"><b>${esc(L.title)}</b>
        <small>${plural(n, 'слово', 'слова', 'слов')}${ph ? ` · ${plural(ph, 'фраза', 'фразы', 'фраз')}` : ''}</small></span>
      <span class="node-st">${info ? `✓<small>×${info.rounds}</small>` : isCur ? 'Начать' : open ? '' : '🔒'}</span>
    </button>`;
  };

  view.innerHTML = `
    <section class="hello">
      <div><p class="hello-sub">${greeting()}! 👋</p><h2>Уровни</h2></div>
      <div class="streak" title="Дней подряд">🔥 ${store.streak()}</div>
    </section>
    <section class="tiles3">
      <div><b>${t.words}</b><span>${plural(t.words, 'слово', 'слова', 'слов').replace(/^\d+ /, '')}</span></div>
      <div><b>${t.passed}</b><span>${plural(t.passed, 'уровень', 'уровня', 'уровней').replace(/^\d+ /, '')}</span></div>
      <div><b>${t.flipped}</b><span>${plural(t.flipped, 'карточка', 'карточки', 'карточек').replace(/^\d+ /, '')}</span></div>
    </section>
    ${t.passed ? `<div class="modes">
      <button class="mode warm" data-act="warmup"><span>🔁</span><b>Разминка</b><small>все пройденные уровни подряд · ${passedCards.length}</small></button>
      <button class="mode mix" data-act="mix" ${passedCards.length < 20 ? 'disabled' : ''}><span>🎲</span><b>Микс ${MIX_SIZE}</b>
        <small>${passedCards.length < 20 ? 'откроется после ~3 уровней' : 'случайные карточки из пройденного'}</small></button>
    </div>` : ''}
    ${STAGES.map((S) => {
      const ls = LEVELS.filter((L) => L.stage === S.id);
      const done = ls.filter((L) => store.isPassed(L.id)).length;
      return `<section class="stage ${ls.length ? '' : 'soon'}">
        <div class="stage-h"><span class="stage-id">${S.id}</span>
          <div><b>${S.title}</b><small>${ls.length ? `${done} из ${ls.length} тем` : 'скоро · ~50 тем'}</small></div></div>
        ${ls.length ? `<div class="meter"><i style="width:${Math.round((done / ls.length) * 100)}%"></i></div>
          <div class="path">${ls.map(node).join('')}</div>` : `<p class="stage-about">${esc(S.about)}</p>`}
      </section>`;
    }).join('')}`;

  view.onclick = (e) => {
    const n = e.target.closest('[data-level]');
    if (n) {
      if (!store.isOpen(n.dataset.level)) return toast(`Сначала пройди уровень ${cur.n} — «${cur.title}»`);
      return playLevel(n.dataset.level);
    }
    const b = e.target.closest('[data-act]');
    if (b?.dataset.act === 'warmup') playWarmup();
    if (b?.dataset.act === 'mix') playMix();
  };
  view.querySelector('.node.current')?.scrollIntoView({ block: 'center' });
}

// ================= Колода: карточки по кругу =================

function playLevel(id) {
  const L = LEVEL[id];
  playDeck({ kind: 'level', kicker: `${L.stage} · Уровень ${L.n}`, title: L.title, cards: L.cards, levelIds: [L.id], cover: L });
}

function playWarmup() {
  const ls = store.passedLevels();
  // уровень за уровнем, внутри уровня — вперемешку
  playDeck({ kind: 'warmup', kicker: 'Разминка', title: `${plural(ls.length, 'уровень', 'уровня', 'уровней')} подряд`,
    cards: ls.flatMap((L) => L.cards), build: () => ls.flatMap((L) => shuffle(L.cards)), levelIds: ls.map((L) => L.id) });
}

function playMix(cards) {
  const pool = store.passedLevels().flatMap((L) => L.cards);
  const pick = cards || shuffle(pool).slice(0, MIX_SIZE);
  playDeck({ kind: 'mix', kicker: 'Микс', title: plural(pick.length, 'карточка', 'карточки', 'карточек'), cards: pick,
    build: () => shuffle(pick), levelIds: [] });
}

function playDeck({ kind, kicker, title, cards, build, levelIds, cover }) {
  const S = { order: build ? build() : [...cards], i: 0, flipped: false, round: 1, started: Date.now() };
  preload(cards.map((c) => c.sr));
  const ov = document.createElement('div');
  ov.className = 'deck';
  ov.innerHTML = `
    <header>
      <button class="x" aria-label="Закрыть">✕</button>
      <div class="d-title"><small>${esc(kicker)}</small><b>${esc(title)}</b></div>
      <button class="prev" aria-label="Предыдущая карточка">‹</button>
    </header>
    <div class="d-prog"><i></i></div>
    <p class="d-count"></p>
    <main class="d-stage"></main>`;
  document.body.appendChild(ov);
  document.body.classList.add('in-deck');
  const stage = $('.d-stage', ov);

  const close = () => {
    stop();
    store.addTime(Date.now() - S.started);
    ov.remove();
    document.body.classList.remove('in-deck');
    renderTabs();
  };
  $('.x', ov).onclick = close;
  $('.prev', ov).onclick = () => { if (S.i > 0 && !S.interlude) { S.i--; showCard(); } };

  function showCard() {
    S.flipped = false;
    S.interlude = false;
    const c = S.order[S.i];
    $('.d-prog i', ov).style.width = `${(S.i / S.order.length) * 100}%`;
    $('.d-count', ov).textContent = `${S.i + 1} / ${S.order.length}${S.round > 1 ? ` · круг ${S.round}` : ''}`;
    $('.prev', ov).style.visibility = S.i > 0 ? 'visible' : 'hidden';
    const hasPic = !!(c.img || c.emoji);
    stage.innerHTML = `<div class="fc ${hasPic ? '' : 'nopic'} ${c.kind}" role="button" aria-label="Перевернуть">
      <div class="fc-in">
        <div class="fc-face front">${pic(c)}<div class="fc-ru">${esc(c.ru)}</div>${c.kind === 'phrase' ? '<span class="fc-tag">фраза</span>' : ''}</div>
        <div class="fc-face back">${pic(c, 'sm')}<div class="fc-sr">${SRH(c)}</div><div class="fc-ru2">${esc(c.ru)}</div>
          ${c.note ? `<div class="fc-note">${esc(D(c.note))}</div>` : ''}<button class="fc-spk" aria-label="Ещё раз">🔊</button></div>
      </div></div>
      <p class="d-hint">${S.i === 0 && S.round === 1 ? 'Скажи вслух по-сербски и нажми на карточку' : '&nbsp;'}</p>`;
    // следующую картинку подгружаем заранее
    const nx = S.order[S.i + 1];
    if (nx?.img) new Image().src = `${IMG_BASE}${nx.img}.webp`;
  }

  function showInterlude(firstTime) {
    S.interlude = true;
    $('.d-prog i', ov).style.width = '100%';
    $('.d-count', ov).textContent = `Круг ${S.round} пройден`;
    $('.prev', ov).style.visibility = 'hidden';
    const nextL = kind === 'level' ? store.currentLevel() : null;
    stage.innerHTML = `<div class="fc interlude" role="button">
      <div class="fc-in"><div class="fc-face front">
        ${cover ? levelPic(cover).replace('sm', '') : `<span class="pic num">${kind === 'mix' ? '🎲' : '🔁'}</span>`}
        <small class="il-kicker">${esc(kicker)}</small>
        <div class="fc-ru">${esc(title)}</div>
        ${firstTime ? `<p class="il-new">✓ Уровень пройден!${nextL ? ` Открыт уровень ${nextL.n}` : ''}</p>` : `<p class="il-sub">${plural(S.order.length, 'карточка', 'карточки', 'карточек')} · круг ${S.round + 1}</p>`}
        <span class="il-go">Нажми — ещё круг</span>
      </div></div></div>
      <div class="d-links">
        ${kind === 'level' && nextL && nextL.id !== levelIds[0] ? `<button class="link" data-next="${nextL.id}">Уровень ${nextL.n}: ${esc(nextL.title)} ›</button>` : ''}
        ${kind === 'mix' ? '<button class="link" data-newmix>Новые 50 карточек ›</button>' : ''}
      </div>`;
    buzz([20, 40, 20]);
  }

  stage.onclick = (e) => {
    if (e.target.closest('[data-next]')) { const id = e.target.closest('[data-next]').dataset.next; close(); return playLevel(id); }
    if (e.target.closest('[data-newmix]')) { close(); return playMix(); }
    const fc = e.target.closest('.fc');
    if (!fc) return;
    if (S.interlude) {
      S.round++;
      S.order = build ? build() : shuffle(cards);
      S.i = 0;
      return showCard();
    }
    const c = S.order[S.i];
    if (e.target.closest('.fc-spk')) return speak(c.sr);
    if (!S.flipped) {
      S.flipped = true;
      fc.classList.add('flipped');
      store.countCard();
      if (store.settings().autoplay) speak(c.sr, { slow: false });
      return;
    }
    S.i++;
    if (S.i < S.order.length) return showCard();
    showInterlude(store.finishRound(levelIds));
  };

  showCard();
}

// ================= Прогресс =================

function renderStats() {
  const t = totals();
  const days = store.daysLog();
  const last = Array.from({ length: 14 }, (_, i) => store.today(i - 13));
  const maxCards = Math.max(10, ...last.map((d) => days[d]?.cards || 0));
  const wd = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const passed = store.passedLevels().map((L) => ({ L, info: store.levelInfo(L.id) }));
  const weekAgo = store.today(-7);
  const stale = passed.filter(({ info }) => info.last && info.last < weekAgo);
  const favorite = [...passed].sort((a, b) => b.info.rounds - a.info.rounds).slice(0, 5);

  view.innerHTML = `
    <h2 class="page-h">Прогресс</h2>
    <section class="card">
      <h3>Путь</h3>
      <ol class="chain">${STAGES.map((S) => {
        const ls = LEVELS.filter((L) => L.stage === S.id);
        const done = ls.filter((L) => store.isPassed(L.id)).length;
        const state = ls.length && done === ls.length ? 'past' : ls.length && (done || S.id === 'A1') ? 'now' : '';
        return `<li class="${state}"><span class="dot">${state === 'past' ? '✓' : S.id}</span>
          <div><b>${S.id} · ${S.title}</b><small>${ls.length ? `${done} из ${ls.length} тем · ${plural(words(ls.flatMap((L) => L.cards)).length, 'слово', 'слова', 'слов')}` : 'скоро'}</small>
          ${ls.length ? `<div class="meter thin"><i style="width:${Math.round((done / ls.length) * 100)}%"></i></div>` : ''}</div></li>`;
      }).join('')}</ol>
    </section>
    <section class="grid-stats">
      <div class="card"><b>${t.words}</b><span>слов знаю</span><small>в пройденных уровнях</small></div>
      <div class="card"><b>${t.phrases}</b><span>фраз</span></div>
      <div class="card"><b>${t.passed}</b><span>уровней</span><small>из ${LEVELS.length}</small></div>
      <div class="card"><b>${t.flipped}</b><span>карточек</span><small>перевёрнуто всего</small></div>
      <div class="card"><b>${t.rounds}</b><span>кругов</span><small>пройдено</small></div>
      <div class="card"><b>${t.minutes}</b><span>минут</span><small>🔥 ${store.streak()} дн. подряд</small></div>
    </section>
    <section class="card">
      <h3>Последние 2 недели</h3>
      <div class="activity">${last.map((d) => {
        const n = days[d]?.cards || 0;
        return `<div class="act-col" title="${d}: ${n}"><div class="act-bar"><i style="height:${Math.round((n / maxCards) * 100)}%"></i></div><small>${wd[new Date(d).getDay()]}</small></div>`;
      }).join('')}</div>
      <p class="muted-t">Карточек сегодня: <b>${days[store.today()]?.cards || 0}</b></p>
    </section>
    ${favorite.length ? `<section class="card"><h3>Больше всего кругов</h3>
      <ul class="lv-list">${favorite.map(({ L, info }) => `<li data-level="${L.id}">${levelPic(L)}<span>${L.n}. ${esc(L.title)}</span><b>×${info.rounds}</b></li>`).join('')}</ul></section>` : ''}
    ${stale.length ? `<section class="card"><h3>Давно не повторял</h3>
      <ul class="lv-list">${stale.map(({ L, info }) => `<li data-level="${L.id}">${levelPic(L)}<span>${L.n}. ${esc(L.title)}</span><small>${info.last}</small></li>`).join('')}</ul></section>` : ''}`;
  view.onclick = (e) => { const li = e.target.closest('[data-level]'); if (li) playLevel(li.dataset.level); };
}

// ================= Слова =================

function renderWords() {
  const ls = LEVELS.filter((L) => store.isOpen(L.id));
  view.innerHTML = `<h2 class="page-h">Слова <small>${totals().words}</small></h2>
    <p class="muted-t page-sub">Нажми на слово — прозвучит</p>` + ls.map((L) => `
    <h4 class="w-group">${L.n}. ${esc(L.title)}${store.isPassed(L.id) ? '' : ' · сейчас'}</h4>
    <ul class="words">${L.cards.map((c) => `<li data-sr="${esc(c.sr)}"><span class="w-pic">${pic(c, 'xs') || '·'}</span>
      <div class="w-t"><b>${SRH(c)}</b><small>${esc(c.ru)}</small></div><span class="w-play">🔊</span></li>`).join('')}</ul>`).join('');
  view.onclick = (e) => { const li = e.target.closest('li[data-sr]'); if (li) speak(li.dataset.sr); };
}

// ================= Настройки =================

const BAD_KEY = 'srpski.badAudio';
const loadBad = () => { try { return new Set(JSON.parse(localStorage.getItem(BAD_KEY)) || []); } catch { return new Set(); } };
const saveBad = (set) => { try { localStorage.setItem(BAD_KEY, JSON.stringify([...set])); } catch {} };

function renderSettings() {
  const s = store.settings();
  view.innerHTML = `<h2 class="page-h">Настройки</h2>
    <div class="set"><label>Азбука</label>
      <div class="seg" data-k="script">
        <button data-v="lat" class="${s.script === 'lat' ? 'on' : ''}">Latinica</button>
        <button data-v="cyr" class="${s.script === 'cyr' ? 'on' : ''}">Ћирилица</button>
      </div></div>
    <div class="set"><label>Голос</label>
      <div class="seg" data-k="voice">${Object.entries(VOICES).map(([k, name]) => `<button data-v="${k}" class="${s.voice === k ? 'on' : ''}">${name}</button>`).join('')}</div>
      <label class="mt">Скорость озвучки: <b id="rt">${s.rate}</b></label>
      <input type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}" data-k="rate">
      <small>Нажми 🔊 на перевёрнутой карточке ещё раз — слово прозвучит медленнее.</small>
      <div class="btns mt"><button class="btn ghost" data-act="test">🔊 «Dobar dan, kako si?»</button>
        <button class="btn ghost" data-act="audio-check">Проверка озвучки</button></div>
    </div>
    <div class="set row"><label>Озвучивать при перевороте</label><input type="checkbox" data-k="autoplay" ${s.autoplay ? 'checked' : ''}></div>
    <div class="set row"><label>Показывать ударения (jábuka)</label><input type="checkbox" data-k="stress" ${s.stress ? 'checked' : ''}></div>
    <div class="set"><label>Прогресс</label>
      <div class="btns">
        <button class="btn ghost" data-act="export">Сохранить в файл</button>
        <button class="btn ghost" data-act="import">Загрузить из файла</button>
        <button class="btn danger" data-act="reset">Сбросить всё</button>
      </div>
      <input type="file" id="imp" accept="application/json" hidden></div>
    <div class="set about"><label>Как заниматься</label>
      <p>Смотришь на картинку и русское слово, говоришь вслух по-сербски, нажимаешь — проверяешь себя и слушаешь произношение. Ещё нажатие — следующая карточка.</p>
      <p>После последней карточки появляется заставка уровня: нажми — и круг начнётся заново. Крути, пока не скажешь всё без запинки. Один полный круг — уровень пройден и открыт следующий.</p>
      <p><b>Разминка</b> — все пройденные уровни подряд. <b>Микс</b> — 50 случайных карточек из пройденного, когда уровней станет много.</p>
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
    if (b.dataset.act === 'test') speak('Dobar dan, kako si?');
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
    if (k === 'autoplay' || k === 'stress') store.setSetting(k, e.target.checked);
    else store.setSetting(k, Number(e.target.value));
    if (k === 'rate') $('#rt').textContent = e.target.value;
  };
  $('#imp').onchange = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { store.importState(await f.text()); alert('Прогресс загружен'); renderSettings(); } catch { alert('Не получилось прочитать файл'); }
  };
}

// Прослушать всё подряд и отметить плохо озвученное — список можно скопировать и прислать
function renderAudioCheck() {
  const voice = store.settings().voice;
  const bad = loadBad();
  const mark = (sr) => `${voice}:${sr}`;
  const count = () => [...bad].filter((x) => x.startsWith(voice + ':')).length;
  view.innerHTML = `<button class="link" data-act="back">← Настройки</button>
    <h2 class="page-h">Проверка озвучки</h2>
    <p class="muted-t page-sub">Голос: ${VOICES[voice]}. Нажми на строку — прозвучит. 👎 — если ударение или произношение неверные.</p>
    <div class="sticky-bar"><button class="btn" data-act="copy">Скопировать отмеченные (<span id="badn">${count()}</span>)</button></div>
    ${LEVELS.map((L) => `<h4 class="w-group">${L.n}. ${esc(L.title)}</h4><ul class="words">${L.cards.map((c) => `<li data-sr="${esc(c.sr)}">
      <span class="w-pic">${pic(c, 'xs') || '·'}</span><div class="w-t"><b>${SRH(c)}</b><small>${esc(c.ru)}</small></div>
      <button class="flag ${bad.has(mark(c.sr)) ? 'on' : ''}" data-flag="${esc(c.sr)}" aria-label="Плохо озвучено">👎</button></li>`).join('')}</ul>`).join('')}`;
  view.onclick = async (e) => {
    const f = e.target.closest('[data-flag]');
    if (f) {
      const k = mark(f.dataset.flag);
      bad.has(k) ? bad.delete(k) : bad.add(k);
      f.classList.toggle('on', bad.has(k));
      saveBad(bad);
      $('#badn').textContent = count();
      return;
    }
    const b = e.target.closest('[data-act]');
    if (b?.dataset.act === 'back') return renderSettings();
    if (b?.dataset.act === 'copy') {
      const text = 'Плохая озвучка:\n' + [...bad].sort().join('\n');
      try { await navigator.clipboard.writeText(text); alert('Скопировано — пришли этот список'); } catch { prompt('Скопируй список:', text); }
      return;
    }
    const li = e.target.closest('li[data-sr]');
    if (li) speak(li.dataset.sr);
  };
}

// ================= Мелочи =================

function toast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('out'), 2200);
  setTimeout(() => t.remove(), 2600);
}

// Все картинки (~3 МБ) — заранее, чтобы карточки работали без интернета
function warmImages() {
  const urls = [...new Set(LEVELS.flatMap((L) => L.cards).filter((c) => c.img).map((c) => `${IMG_BASE}${c.img}.webp`))];
  urls.forEach((u, i) => setTimeout(() => { new Image().src = u; }, i * 30));
}

renderTabs();
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
  setTimeout(() => { warmAudio(); warmImages(); }, 3000);
}
