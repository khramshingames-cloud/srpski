// Контент курса. Всё на латинице, екавица (как говорят в Сербии).
// Кириллица получается автоматически через translit.js.
//
// Слово: [sr, ru, emoji, pos, note?]   pos: pron | n | v | adj | adv | num | other
// Фраза: [sr, ru, emoji, note?]

// Словарь первых 100 слов по частям речи: [sr, ru, emoji, pos, note?]
// 42 существительных · 20 глаголов · 7 прилагательных · 16 наречий · 5 местоимений · 5 чисел · 5 служебных
const WORDS = [
  // Существительные
  ['voda', 'вода', '💧', 'n'],
  ['hleb', 'хлеб', '🍞', 'n'],
  ['kafa', 'кофе', '☕', 'n'],
  ['mleko', 'молоко', '🥛', 'n'],
  ['pivo', 'пиво', '🍺', 'n'],
  ['vino', 'вино', '🍷', 'n'],
  ['jabuka', 'яблоко', '🍎', 'n'],
  ['sir', 'сыр', '🧀', 'n'],
  ['meso', 'мясо', '🥩', 'n'],
  ['čaj', 'чай', '🍵', 'n'],
  ['čovek', 'человек; мужчина', '🧑', 'n'],
  ['žena', 'женщина; жена', '👩‍🦰', 'n'],
  ['dete', 'ребёнок', '👶', 'n'],
  ['prijatelj', 'друг', '🤝', 'n'],
  ['mama', 'мама', '👩‍👧', 'n'],
  ['tata', 'папа', '👨‍👧', 'n'],
  ['brat', 'брат', '👦', 'n'],
  ['sestra', 'сестра', '👧', 'n'],
  ['ime', 'имя', '📛', 'n'],
  ['kuća', 'дом', '🏠', 'n'],
  ['grad', 'город', '🏙️', 'n'],
  ['ulica', 'улица', '🛣️', 'n'],
  ['prodavnica', 'магазин', '🏪', 'n'],
  ['restoran', 'ресторан', '🍴', 'n'],
  ['posao', 'работа', '💼', 'n'],
  ['škola', 'школа', '🏫', 'n'],
  ['auto', 'машина', '🚗', 'n'],
  ['autobus', 'автобус', '🚌', 'n'],
  ['stan', 'квартира', '🏢', 'n', '⚠️ Ложный друг: не «стан», а «квартира»'],
  ['soba', 'комната', '🛏️', 'n'],
  ['dan', 'день', '☀️', 'n'],
  ['noć', 'ночь', '🌙', 'n'],
  ['jutro', 'утро', '🌅', 'n'],
  ['veče', 'вечер', '🌆', 'n'],
  ['vreme', 'время; погода', '⏰', 'n', 'Kakvo je vreme? — Какая погода?'],
  ['sat', 'час; часы', '🕐', 'n'],
  ['novac', 'деньги', '💰', 'n', 'Разговорно: pare'],
  ['cena', 'цена', '🏷️', 'n'],
  ['račun', 'счёт', '🧾', 'n'],
  ['pomoć', 'помощь', '🆘', 'n'],
  ['telefon', 'телефон', '📱', 'n'],
  ['put', 'дорога; путь; раз', '🛤️', 'n', 'prvi put — первый раз'],
  // Глаголы
  ['biti', 'быть', '🧍', 'v', 'ja sam, ti si, on je'],
  ['imati', 'иметь', '🎒', 'v', 'imam — у меня есть'],
  ['voleti', 'любить', '❤️', 'v', 'volim — я люблю'],
  ['jesti', 'есть, кушать', '🍽️', 'v', 'jedem — я ем'],
  ['piti', 'пить', '🥤', 'v', 'pijem — я пью'],
  ['raditi', 'работать; делать', '🛠️', 'v', 'radim — я работаю'],
  ['znati', 'знать', '🧠', 'v', 'znam — я знаю'],
  ['govoriti', 'говорить', '🗣️', 'v', 'govorim — я говорю'],
  ['ići', 'идти; ехать', '🚶', 'v', 'idem — я иду'],
  ['želeti', 'хотеть', '💭', 'v', 'želim — я хочу'],
  ['videti', 'видеть', '👀', 'v', 'vidim — я вижу'],
  ['čuti', 'слышать', '👂', 'v', 'čujem — я слышу'],
  ['kupiti', 'купить', '🛒', 'v', 'kupim — я куплю'],
  ['dati', 'дать', '🎁', 'v', 'dam — я дам'],
  ['živeti', 'жить', '🏡', 'v', 'živim — я живу'],
  ['učiti', 'учить; учиться', '📖', 'v', 'učim — я учу'],
  ['razumeti', 'понимать', '💡', 'v', 'razumem — я понимаю'],
  ['spavati', 'спать', '😴', 'v', 'spavam — я сплю'],
  ['čitati', 'читать', '📰', 'v', 'čitam — я читаю'],
  ['doći', 'прийти', '🚪', 'v', 'dođem — я приду'],
  // Прилагательные
  ['dobar', 'хороший', '👍', 'adj'],
  ['loš', 'плохой', '👎', 'adj'],
  ['veliki', 'большой', '🐘', 'adj'],
  ['mali', 'маленький', '🐭', 'adj'],
  ['novi', 'новый', '✨', 'adj'],
  ['stari', 'старый', '👴', 'adj'],
  ['lep', 'красивый', '🌸', 'adj'],
  // Наречия
  ['dobro', 'хорошо', '👌', 'adv'],
  ['mnogo', 'много', '📚', 'adv'],
  ['malo', 'мало; немного', '🤏', 'adv'],
  ['danas', 'сегодня', '📅', 'adv'],
  ['sutra', 'завтра', '⏭️', 'adv'],
  ['juče', 'вчера', '⏮️', 'adv'],
  ['sada', 'сейчас', '⏱️', 'adv', 'Часто коротко: sad'],
  ['ovde', 'здесь', '👇', 'adv'],
  ['tamo', 'там', '🗺️', 'adv'],
  ['uvek', 'всегда', '♾️', 'adv'],
  ['često', 'часто', '🔁', 'adv'],
  ['ponekad', 'иногда', '🎲', 'adv'],
  ['koliko', 'сколько', '🔢', 'adv'],
  ['levo', 'налево; слева', '⬅️', 'adv'],
  ['desno', 'направо; справа', '➡️', 'adv'],
  ['pravo', 'прямо', '⬆️', 'adv', '⚠️ Ложный друг: не «право», а «прямо»'],
  // Местоимения
  ['ja', 'я', '🙋', 'pron'],
  ['ti', 'ты', '🫵', 'pron'],
  ['on', 'он', '👨', 'pron'],
  ['ona', 'она', '👩', 'pron'],
  ['mi', 'мы', '👫', 'pron'],
  // Числа
  ['jedan', 'один', '1️⃣', 'num'],
  ['dva', 'два', '2️⃣', 'num'],
  ['tri', 'три', '3️⃣', 'num'],
  ['četiri', 'четыре', '4️⃣', 'num'],
  ['pet', 'пять', '5️⃣', 'num'],
  // Служебные и вежливость
  ['da', 'да', '✅', 'other'],
  ['ne', 'нет; не', '❌', 'other'],
  ['zdravo', 'привет', '👋', 'other'],
  ['hvala', 'спасибо', '🙏', 'other'],
  ['molim', 'пожалуйста', '🤲', 'other', 'Ещё «прошу» и «что?», когда переспрашиваешь'],
];
const BY_SR = Object.fromEntries(WORDS.map((w) => [w[0], w]));
const w = (list) => list.split(' ').map((sr) => BY_SR[sr]);

// Каждый урок слов — смесь: ~4 существительных, 2 глагола, 1–2 признака/наречия, 1–2 служебных.
// Слова подобраны так, чтобы следующий урок правил или фраз строился только из уже знакомого.
export const COURSE = [
  { id: 'L1', type: 'words', title: 'Первые шаги', words: w('ja ti da ne zdravo hvala voda kafa piti dobro') },
  { id: 'L2', type: 'words', title: 'За столом', words: w('on ona molim hleb mleko čaj jabuka jesti voleti dobar') },
  { id: 'L3', type: 'words', title: 'У меня есть', words: w('mi pivo vino sir meso imati želeti loš mnogo malo') },
  {
    id: 'G1', type: 'grammar', title: 'Я пью, ты пьёшь',
    words: [
      ['i', 'и', '➕', 'other'],
    ],
    rules: [
      {
        title: 'Глагол меняет окончание — как в русском',
        html: `<table class="conj">
          <tr><th></th><th>piti</th><th>jesti</th><th>imati</th><th>voleti</th></tr>
          <tr><td>ja</td><td>pijem</td><td>jedem</td><td>imam</td><td>volim</td></tr>
          <tr><td>ti</td><td>piješ</td><td>jedeš</td><td>imaš</td><td>voliš</td></tr>
          <tr><td>on / ona</td><td>pije</td><td>jede</td><td>ima</td><td>voli</td></tr>
          <tr><td>mi</td><td>pijemo</td><td>jedemo</td><td>imamo</td><td>volimo</td></tr>
        </table>
        <p>Местоимение часто опускают — окончание и так всё говорит.</p>`,
        examples: [['Pijem čaj.', 'Я пью чай.'], ['Imaš hleb.', 'У тебя есть хлеб.']],
      },
      {
        title: 'Вода → воду',
        html: `<p>Слова на <b>-a</b> после глагола меняют <b>-a</b> на <b>-u</b>. Ровно как в русском: вода → воду.</p>
        <p>Остальные (hleb, mleko, čaj…) не меняются.</p>`,
        examples: [['Pijem vodu.', 'Я пью воду.'], ['Volim kafu.', 'Я люблю кофе.'], ['Jedem hleb.', 'Я ем хлеб.']],
      },
    ],
    exercises: [
      { k: 'build', ru: 'Я пью воду.', sr: 'Ja pijem vodu.', extra: ['voda', 'piješ'] },
      { k: 'build', ru: 'Ты ешь хлеб.', sr: 'Ti jedeš hleb.', extra: ['jedem'] },
      { k: 'build', ru: 'Он любит кофе.', sr: 'On voli kafu.', extra: ['kafa', 'volim'] },
      { k: 'build', ru: 'Мы пьём чай.', sr: 'Mi pijemo čaj.', extra: ['pije'] },
      { k: 'build', ru: 'У меня есть яблоко.', sr: 'Ja imam jabuku.', extra: ['jabuka', 'ima'] },
      { k: 'build', ru: 'Она пьёт вино и пиво.', sr: 'Ona pije vino i pivo.', extra: ['pijem'] },
      { k: 'cloze', ru: 'Я пью молоко.', sr: 'Ja ___ mleko.', a: 'pijem', opts: ['pijem', 'piješ', 'pije', 'pijemo'] },
      { k: 'cloze', ru: 'Мы едим мясо.', sr: 'Mi ___ meso.', a: 'jedemo', opts: ['jedem', 'jedeš', 'jede', 'jedemo'] },
      { k: 'cloze', ru: 'Ты любишь сыр.', sr: 'Ti ___ sir.', a: 'voliš', opts: ['volim', 'voliš', 'voli', 'volimo'] },
      { k: 'cloze', ru: 'Я люблю кофе.', sr: 'Volim ___.', a: 'kafu', opts: ['kafa', 'kafu'] },
      { k: 'cloze', ru: 'Она ест яблоко.', sr: 'Ona jede ___.', a: 'jabuku', opts: ['jabuka', 'jabuku'] },
    ],
  },
  { id: 'L4', type: 'words', title: 'Люди', words: w('čovek žena prijatelj dete ime biti znati lep mali sada') },
  { id: 'L5', type: 'words', title: 'Дом и семья', words: w('mama tata brat sestra kuća raditi govoriti veliki novi ovde') },
  { id: 'L6', type: 'words', title: 'Город', words: w('grad ulica prodavnica autobus posao ići živeti stari tamo jedan') },
  {
    id: 'G2', type: 'grammar', title: 'Кто? Что? Где?',
    words: [
      ['ko', 'кто', '🕵️', 'pron'],
      ['šta', 'что', '❔', 'pron'],
      ['gde', 'где', '📍', 'adv'],
      ['kako', 'как', '🤔', 'adv'],
      ['to', 'это', '👆', 'pron'],
    ],
    rules: [
      {
        title: '«Есть» не выбрасываем',
        html: `<p>В русском говорим «это дом», а в сербском — «это <b>есть</b> дом». Связка обязательна:</p>
        <table class="conj"><tr><td>ja</td><td>sam</td></tr><tr><td>ti</td><td>si</td></tr><tr><td>on / ona / to</td><td>je</td></tr></table>`,
        examples: [['To je kuća.', 'Это дом.'], ['Ti si dobar prijatelj.', 'Ты хороший друг.']],
      },
      {
        title: 'Вопросы',
        html: `<p>Вопросительное слово — в начало, дальше как обычно:</p>
        <p><b>ko</b> — кто, <b>šta</b> — что, <b>gde</b> — где, <b>kako</b> — как</p>`,
        examples: [['Ko je to?', 'Кто это?'], ['Gde je prodavnica?', 'Где магазин?'], ['Kako si?', 'Как ты?']],
      },
    ],
    exercises: [
      { k: 'build', ru: 'Где магазин?', sr: 'Gde je prodavnica?', extra: ['ko'] },
      { k: 'build', ru: 'Кто это?', sr: 'Ko je to?', extra: ['šta'] },
      { k: 'build', ru: 'Что ты пьёшь?', sr: 'Šta piješ?', extra: ['pijem', 'gde'] },
      { k: 'build', ru: 'Это хороший город.', sr: 'To je dobar grad.', extra: ['loš'] },
      { k: 'build', ru: 'Где ты работаешь?', sr: 'Gde radiš?', extra: ['radim', 'kako'] },
      { k: 'build', ru: 'Ты хороший друг.', sr: 'Ti si dobar prijatelj.', extra: ['sam'] },
      { k: 'cloze', ru: 'Где автобус?', sr: '___ je autobus?', a: 'Gde', opts: ['Gde', 'Ko', 'Šta', 'Kako'] },
      { k: 'cloze', ru: 'Как ты?', sr: 'Kako ___?', a: 'si', opts: ['sam', 'si', 'je'] },
      { k: 'cloze', ru: 'Я хороший.', sr: 'Ja ___ dobar.', a: 'sam', opts: ['sam', 'si', 'je'] },
      { k: 'cloze', ru: 'Что это?', sr: '___ je to?', a: 'Šta', opts: ['Šta', 'Ko', 'Gde', 'Kako'] },
    ],
  },
  { id: 'L7', type: 'words', title: 'Мой день', words: w('dan noć jutro veče spavati učiti danas sutra dva tri') },
  {
    id: 'P1', type: 'phrases', title: 'Привет и пока', phrases: [
      ['Dobro jutro!', 'Доброе утро!', '🌅'],
      ['Dobar dan!', 'Добрый день!', '☀️', 'Универсальное «здравствуйте»'],
      ['Dobro veče!', 'Добрый вечер!', '🌆'],
      ['Laku noć!', 'Спокойной ночи!', '🌙'],
      ['Kako si?', 'Как ты? / Как дела?', '🙂'],
      ['Dobro sam, hvala.', 'Хорошо, спасибо.', '😊'],
      ['Izvinite.', 'Извините.', '🙇'],
      ['Vidimo se!', 'Увидимся!', '👋'],
    ],
  },
  { id: 'L8', type: 'words', title: 'Каждый день', words: w('škola soba stan vreme videti razumeti čitati uvek često četiri') },
  { id: 'L9', type: 'words', title: 'Иногда', words: w('auto restoran telefon sat pomoć čuti doći juče ponekad pet') },
  {
    id: 'G3', type: 'grammar', title: 'Не знаю, не понимаю',
    words: [
      ['nisam', 'я не (есть)', '🙅', 'other', 'ne + sam'],
      ['nije', 'он/она/это не (есть)', '🚫', 'other', 'ne + je'],
    ],
    rules: [
      {
        title: '«Не» перед глаголом — отдельно',
        html: `<p>Как в русском: <b>ne</b> + глагол.</p>`,
        examples: [['Ne znam.', 'Я не знаю.'], ['Ne razumem.', 'Я не понимаю.'], ['Ona ne pije kafu.', 'Она не пьёт кофе.']],
      },
      {
        title: 'Но «не есть» — одним словом',
        html: `<table class="conj"><tr><td>ja</td><td>sam → <b>nisam</b></td></tr><tr><td>ti</td><td>si → <b>nisi</b></td></tr><tr><td>on / ona / to</td><td>je → <b>nije</b></td></tr></table>`,
        examples: [['On nije ovde.', 'Его здесь нет.'], ['To nije kafa.', 'Это не кофе.']],
      },
    ],
    exercises: [
      { k: 'build', ru: 'Я не понимаю.', sr: 'Ne razumem.', extra: ['razumeš', 'nije'] },
      { k: 'build', ru: 'Я не знаю.', sr: 'Ne znam.', extra: ['znaš'] },
      { k: 'build', ru: 'Она не пьёт кофе.', sr: 'Ona ne pije kafu.', extra: ['kafa', 'nije'] },
      { k: 'build', ru: 'Мы не живём здесь.', sr: 'Mi ne živimo ovde.', extra: ['tamo'] },
      { k: 'build', ru: 'Его здесь нет.', sr: 'On nije ovde.', extra: ['ne', 'je'] },
      { k: 'build', ru: 'Сегодня я не работаю.', sr: 'Danas ne radim.', extra: ['sutra'] },
      { k: 'build', ru: 'Это не чай.', sr: 'To nije čaj.', extra: ['ne'] },
      { k: 'cloze', ru: 'Я не знаю.', sr: '___ znam.', a: 'Ne', opts: ['Ne', 'Nije', 'Nisam'] },
      { k: 'cloze', ru: 'Это не вода.', sr: 'To ___ voda.', a: 'nije', opts: ['ne', 'nije', 'nisam'] },
      { k: 'cloze', ru: 'Он не здесь, он там.', sr: 'On nije ovde, on je ___.', a: 'tamo', opts: ['tamo', 'ovde', 'uvek'] },
      { k: 'cloze', ru: 'Я всегда пью кофе.', sr: 'Ja ___ pijem kafu.', a: 'uvek', opts: ['uvek', 'ponekad', 'često'] },
    ],
  },
  { id: 'L10', type: 'words', title: 'Покупки и дорога', words: w('novac cena račun put kupiti dati koliko levo desno pravo') },
  {
    id: 'P2', type: 'phrases', title: 'Очень по-сербски', phrases: [
      ['Koliko košta?', 'Сколько стоит?', '💰'],
      ['Račun, molim.', 'Счёт, пожалуйста.', '🧾'],
      ['Ne razumem.', 'Я не понимаю.', '🤷'],
      ['Može!', 'Можно! / Давай!', '👌', 'Самое частое «да, давай» в Сербии'],
      ['Važi!', 'Договорились! / Ок!', '🤝'],
      ['Nema problema.', 'Без проблем.', '😎'],
      ['Nema veze.', 'Ничего страшного.', '🙂', 'Ещё «неважно»'],
      ['Polako.', 'Потихоньку. / Не спеши.', '🐢', 'Почти девиз Сербии 🙂'],
      ['Prijatno!', 'Приятного аппетита!', '🍽️', 'Ещё «всего доброго» при прощании'],
    ],
  },
];

// ---- Индекс всех единиц, которые попадают в повторение ----
// id: w:<sr> — слово, p:<sr> — фраза, s:<lesson>:<n> — предложение из урока правил
export const ITEMS = {};
for (const lesson of COURSE) {
  lesson.itemIds = [];
  for (const [sr, ru, emoji, pos, note] of lesson.words || []) {
    const id = 'w:' + sr;
    ITEMS[id] = { id, kind: 'word', sr, ru, emoji, pos, note, lesson: lesson.id };
    lesson.itemIds.push(id);
  }
  for (const [sr, ru, emoji, note] of lesson.phrases || []) {
    const id = 'p:' + sr;
    ITEMS[id] = { id, kind: 'phrase', sr, ru, emoji, pos: 'phrase', note, lesson: lesson.id };
    lesson.itemIds.push(id);
  }
  (lesson.exercises || []).forEach((ex, n) => {
    ex.id = `x:${lesson.id}:${n}`;
    if (ex.k !== 'build') return;
    const id = `s:${lesson.id}:${n}`;
    ITEMS[id] = { id, kind: 'sentence', sr: ex.sr, ru: ex.ru, emoji: '💬', pos: 'sentence', extra: ex.extra, lesson: lesson.id };
    ex.itemId = id;
    lesson.itemIds.push(id);
  });
}

export const LESSON = Object.fromEntries(COURSE.map((l) => [l.id, l]));
