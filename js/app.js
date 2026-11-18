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
  const cur = store.currentLevel();
  const passedCards = store.passedLevels().flatMap((L) => L.cards);

  const node = (L) => {
    const st = store.isPassed(L.id) ? 'passed' : cur?.id === L.id ? 'current' : 'locked';
    return `<button class="node ${st}" data-level="${L.id}">
      <span class="node-pic">${levelPic(L)}</span><b>${esc(L.title)}</b>${st === 'passed' ? '<span class="node-ok">✓</span>' : ''}
    </button>`;
  };

  view.innerHTML = `
    ${passedCards.length ? `<div class="modes">
      <button class="mode" data-act="warmup">🔁 Разминка</button>
      ${passedCards.length >= 20 ? '<button class="mode" data-act="mix">🎲 Микс</button>' : ''}
    </div>` : ''}
    ${STAGES.map((S) => {
      const ls = LEVELS.filter((L) => L.stage === S.id);
      if (!ls.length) return `<p class="stage-soon">${S.id} · скоро</p>`;
      const done = ls.filter((L) => store.isPassed(L.id)).length;
      return `<section class="stage">
        <div class="stage-h"><b>${S.id}</b><div class="meter"><i style="width:${Math.round((done / ls.length) * 100)}%"></i></div></div>
        <div class="path">${ls.map(node).join('')}</div>
      </section>`;
    }).join('')}`;

  view.onclick = (e) => {
    const n = e.target.closest('[data-level]');
    if (n) return store.isOpen(n.dataset.level) ? playLevel(n.dataset.level) : toast(`Сначала «${cur.title}»`);
    const b = e.target.closest('[data-act]');
    if (b?.dataset.act === 'warmup') playWarmup();
    if (b?.dataset.act === 'mix') playMix();
  };
  view.querySelector('.node.current')?.scrollIntoView({ block: 'center' });
}

// ================= Колода: карточки по кругу =================

function playLevel(id) {
  const L = LEVEL[id];
  playDeck({ cards: L.cards, levelIds: [L.id], cover: levelPic(L) });
}

function playWarmup() {
  const ls = store.passedLevels();
  // уровень за уровнем, внутри уровня — вперемешку
  playDeck({ cards: ls.flatMap((L) => L.cards), build: () => ls.flatMap((L) => shuffle(L.cards)), levelIds: ls.map((L) => L.id), cover: '<span class="pic num">🔁</span>' });
}

function playMix() {
  const pick = shuffle(store.passedLevels().flatMap((L) => L.cards)).slice(0, MIX_SIZE);
  playDeck({ cards: pick, build: () => shuffle(pick), levelIds: [], cover: '<span class="pic num">🎲</span>' });
}

function playDeck({ cards, build, levelIds, cover }) {
  const S = { order: build ? build() : [...cards], i: 0, flipped: false, started: Date.now() };
  preload(cards.map((c) => c.sr));
  const ov = document.createElement('div');
  ov.className = 'deck';
  ov.innerHTML = `
    <header><button class="x" aria-label="Закрыть">✕</button><div class="d-prog"><i></i></div><button class="prev" aria-label="Назад">‹</button></header>
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
    $('.prev', ov).style.visibility = S.i > 0 ? 'visible' : 'hidden';
    stage.innerHTML = `<div class="fc ${c.img || c.emoji ? '' : 'nopic'} ${c.kind}" role="button" aria-label="Перевернуть">
      <div class="fc-in">
        <div class="fc-face front">${pic(c)}<div class="fc-ru">${esc(c.ru)}</div></div>
        <div class="fc-face back">${pic(c, 'sm')}<div class="fc-sr">${SRH(c)}</div><button class="fc-spk" aria-label="Ещё раз">🔊</button></div>
      </div></div>`;
    // следующую картинку подгружаем заранее
    const nx = S.order[S.i + 1];
    if (nx?.img) new Image().src = `${IMG_BASE}${nx.img}.webp`;
  }

  // Заставка между кругами: иконка уровня и одна строка
  function showInterlude() {
    S.interlude = true;
    $('.d-prog i', ov).style.width = '100%';
    $('.prev', ov).style.visibility = 'hidden';
    stage.innerHTML = `<div class="fc interlude" role="button"><div class="fc-in"><div class="fc-face front">
      ${cover.replace(' sm', '')}<p class="il-go">Нажми, чтобы пройти снова</p>
    </div></div></div>`;
    buzz([20, 40, 20]);
  }

  stage.onclick = (e) => {
    const fc = e.target.closest('.fc');
    if (!fc) return;
    if (S.interlude) {
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
    store.finishRound(levelIds);
    showInterlude();
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
  const num = (n, label) => `<div class="card"><b>${n}</b><span>${label}</span></div>`;

  view.innerHTML = `
    <h2 class="page-h">Прогресс</h2>
    <section class="grid-stats">
      ${num(t.words, 'слов')}${num(t.passed, 'уровней')}${num(t.flipped, 'карточек')}
      ${num(t.phrases, 'фраз')}${num(store.streak(), 'дней подряд')}${num(t.minutes, 'минут')}
    </section>
    <section class="card stages">${STAGES.map((S) => {
      const ls = LEVELS.filter((L) => L.stage === S.id);
      const done = ls.filter((L) => store.isPassed(L.id)).length;
      return `<div class="st-row ${ls.length ? '' : 'soon'}"><b>${S.id}</b>
        <div class="meter"><i style="width:${ls.length ? Math.round((done / ls.length) * 100) : 0}%"></i></div>
        <small>${ls.length ? `${done}/${ls.length}` : 'скоро'}</small></div>`;
    }).join('')}</section>
    <section class="card">
      <div class="activity">${last.map((d) => {
        const n = days[d]?.cards || 0;
        return `<div class="act-col" title="${d}: ${n}"><div class="act-bar"><i style="height:${Math.round((n / maxCards) * 100)}%"></i></div><small>${wd[new Date(d).getDay()]}</small></div>`;
      }).join('')}</div>
    </section>`;
  view.onclick = null;
}

// ================= Слова =================

function renderWords() {
  const ls = LEVELS.filter((L) => store.isOpen(L.id));
  view.innerHTML = `<h2 class="page-h">Слова</h2>` + ls.map((L) => `
    <h4 class="w-group">${esc(L.title)}</h4>
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
`;

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
    <div class="sticky-bar"><button class="btn" data-act="copy">Скопировать отмеченные (<span id="badn">${count()}</span>)</button></div>
    ${LEVELS.map((L) => `<h4 class="w-group">${esc(L.title)}</h4><ul class="words">${L.cards.map((c) => `<li data-sr="${esc(c.sr)}">
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
