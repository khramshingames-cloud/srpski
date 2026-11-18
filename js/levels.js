// Уровни-карточки. Генерируется tools/build_levels.mjs из tools/levels.json — правьте JSON, не этот файл.
// img — файл картинки Fluent Emoji 3D (код эмодзи), null — без картинки.
export const IMG_BASE = 'https://cdn.jsdelivr.net/npm/@lobehub/fluent-emoji-3d@1.1.0/assets/';
// Этапы пути: A1 → A2 → B1 → B2, у каждого ~50 тем. Уровни без stage относятся к A1.
export const STAGES = [
  { id: 'A1', title: 'Выживание', about: 'Самые нужные слова: люди, еда, числа, время, дом, город, магазин' },
  { id: 'A2', title: 'Базовый', about: 'Быт подробнее: работа, здоровье, путешествия, учреждения, эмоции' },
  { id: 'B1', title: 'Средний', about: 'Мнения, планы, новости, отношения, природа и общество' },
  { id: 'B2', title: 'Уверенный', about: 'Абстрактные темы, профессии, культура, тонкости языка' },
];
export const LEVELS = [
 {
  "id": "L1",
  "n": 1,
  "stage": "A1",
  "title": "Привет и вежливость",
  "cards": [
   {
    "id": "w:zdravo",
    "kind": "word",
    "sr": "zdravo",
    "ru": "привет; здравствуй",
    "emoji": "👋",
    "img": "1f44b"
   },
   {
    "id": "w:ćao",
    "kind": "word",
    "sr": "ćao",
    "ru": "привет; пока",
    "emoji": "✌️",
    "img": "270c-fe0f",
    "note": "Неформально, с друзьями"
   },
   {
    "id": "w:hvala",
    "kind": "word",
    "sr": "hvala",
    "ru": "спасибо",
    "emoji": "🙏",
    "img": "1f64f"
   },
   {
    "id": "w:molim",
    "kind": "word",
    "sr": "molim",
    "ru": "пожалуйста; прошу",
    "emoji": "🤲",
    "img": "1f932",
    "note": "Ещё «что?», когда переспрашиваешь"
   },
   {
    "id": "w:izvinite",
    "kind": "word",
    "sr": "izvinite",
    "ru": "извините",
    "emoji": "🙇",
    "img": "1f647",
    "note": "izvini — на «ты»"
   },
   {
    "id": "w:da",
    "kind": "word",
    "sr": "da",
    "ru": "да",
    "emoji": "✅",
    "img": "2705"
   },
   {
    "id": "w:ne",
    "kind": "word",
    "sr": "ne",
    "ru": "нет; не",
    "emoji": "❌",
    "img": "274c"
   },
   {
    "id": "w:dobro",
    "kind": "word",
    "sr": "dobro",
    "ru": "хорошо",
    "emoji": "👌",
    "img": "1f44c"
   },
   {
    "id": "p:Izvinite, ne razumem.",
    "kind": "phrase",
    "sr": "Izvinite, ne razumem.",
    "ru": "Извините, я не понимаю.",
    "emoji": "🤷",
    "img": "1f937"
   },
   {
    "id": "p:Možete li da ponovite?",
    "kind": "phrase",
    "sr": "Možete li da ponovite?",
    "ru": "Можете повторить?",
    "emoji": "🔁",
    "img": "1f501"
   }
  ]
 },
 {
  "id": "L2",
  "n": 2,
  "stage": "A1",
  "title": "Я, ты, мы",
  "cards": [
   {
    "id": "w:ja",
    "kind": "word",
    "sr": "ja",
    "ru": "я",
    "emoji": "🙋",
    "img": "1f64b"
   },
   {
    "id": "w:ti",
    "kind": "word",
    "sr": "ti",
    "ru": "ты",
    "emoji": "🫵",
    "img": "1faf5"
   },
   {
    "id": "w:on",
    "kind": "word",
    "sr": "on",
    "ru": "он",
    "emoji": "👨",
    "img": "1f468"
   },
   {
    "id": "w:ona",
    "kind": "word",
    "sr": "ona",
    "ru": "она",
    "emoji": "👩",
    "img": "1f469"
   },
   {
    "id": "w:mi",
    "kind": "word",
    "sr": "mi",
    "ru": "мы",
    "emoji": "👫",
    "img": "1f46b"
   },
   {
    "id": "w:vi",
    "kind": "word",
    "sr": "vi",
    "ru": "вы",
    "emoji": "🫶",
    "img": "1faf6",
    "note": "И вежливое «Вы»"
   },
   {
    "id": "w:oni",
    "kind": "word",
    "sr": "oni",
    "ru": "они",
    "emoji": "👥",
    "img": "1f465"
   },
   {
    "id": "w:moj",
    "kind": "word",
    "sr": "moj",
    "ru": "мой",
    "emoji": "🫴",
    "img": "1faf4",
    "note": "moj / moja / moje"
   },
   {
    "id": "w:tvoj",
    "kind": "word",
    "sr": "tvoj",
    "ru": "твой",
    "emoji": "🫵",
    "img": "1faf5",
    "note": "tvoj / tvoja / tvoje"
   },
   {
    "id": "w:ovaj",
    "kind": "word",
    "sr": "ovaj",
    "ru": "этот",
    "emoji": "👆",
    "img": "1f446",
    "note": "ovaj / ova / ovo"
   }
  ]
 },
 {
  "id": "L3",
  "n": 3,
  "stage": "A1",
  "title": "Напитки",
  "cards": [
   {
    "id": "w:voda",
    "kind": "word",
    "sr": "voda",
    "ru": "вода",
    "emoji": "💧",
    "img": "1f4a7"
   },
   {
    "id": "w:kafa",
    "kind": "word",
    "sr": "kafa",
    "ru": "кофе",
    "emoji": "☕",
    "img": "2615"
   },
   {
    "id": "w:čaj",
    "kind": "word",
    "sr": "čaj",
    "ru": "чай",
    "emoji": "🍵",
    "img": "1f375"
   },
   {
    "id": "w:pivo",
    "kind": "word",
    "sr": "pivo",
    "ru": "пиво",
    "emoji": "🍺",
    "img": "1f37a"
   },
   {
    "id": "w:vino",
    "kind": "word",
    "sr": "vino",
    "ru": "вино",
    "emoji": "🍷",
    "img": "1f377"
   },
   {
    "id": "w:sok",
    "kind": "word",
    "sr": "sok",
    "ru": "сок",
    "emoji": "🧃",
    "img": "1f9c3"
   },
   {
    "id": "w:mleko",
    "kind": "word",
    "sr": "mleko",
    "ru": "молоко",
    "emoji": "🥛",
    "img": "1f95b"
   },
   {
    "id": "w:šećer",
    "kind": "word",
    "sr": "šećer",
    "ru": "сахар",
    "emoji": "🍬",
    "img": "1f36c"
   },
   {
    "id": "p:Kafu sa mlekom, molim.",
    "kind": "phrase",
    "sr": "Kafu sa mlekom, molim.",
    "ru": "Кофе с молоком, пожалуйста.",
    "emoji": "☕",
    "img": "2615"
   }
  ]
 },
 {
  "id": "L4",
  "n": 4,
  "stage": "A1",
  "title": "Знакомство и языки",
  "cards": [
   {
    "id": "w:ime",
    "kind": "word",
    "sr": "ime",
    "ru": "имя",
    "emoji": "📛",
    "img": "1f4db"
   },
   {
    "id": "w:Srbija",
    "kind": "word",
    "sr": "Srbija",
    "ru": "Сербия",
    "emoji": "🇷🇸",
    "img": "1f1f7-1f1f8"
   },
   {
    "id": "w:Rusija",
    "kind": "word",
    "sr": "Rusija",
    "ru": "Россия",
    "emoji": "🇷🇺",
    "img": "1f1f7-1f1fa"
   },
   {
    "id": "w:Beograd",
    "kind": "word",
    "sr": "Beograd",
    "ru": "Белград",
    "emoji": "🏰",
    "img": "1f3f0"
   },
   {
    "id": "w:srpski",
    "kind": "word",
    "sr": "srpski",
    "ru": "сербский; по-сербски",
    "emoji": "🇷🇸",
    "img": "1f1f7-1f1f8"
   },
   {
    "id": "w:engleski",
    "kind": "word",
    "sr": "engleski",
    "ru": "английский; по-английски",
    "emoji": "🇬🇧",
    "img": "1f1ec-1f1e7"
   },
   {
    "id": "w:ruski",
    "kind": "word",
    "sr": "ruski",
    "ru": "русский; по-русски",
    "emoji": "🇷🇺",
    "img": "1f1f7-1f1fa"
   },
   {
    "id": "w:jezik",
    "kind": "word",
    "sr": "jezik",
    "ru": "язык",
    "emoji": "👅",
    "img": "1f445"
   },
   {
    "id": "w:iz",
    "kind": "word",
    "sr": "iz",
    "ru": "из",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:odakle",
    "kind": "word",
    "sr": "odakle",
    "ru": "откуда",
    "emoji": "🧭",
    "img": "1f9ed"
   },
   {
    "id": "p:Možemo li da pričamo na engleskom?",
    "kind": "phrase",
    "sr": "Možemo li da pričamo na engleskom?",
    "ru": "Можем поговорить по-английски?",
    "emoji": "💬",
    "img": "1f4ac"
   },
   {
    "id": "p:Drago mi je!",
    "kind": "phrase",
    "sr": "Drago mi je!",
    "ru": "Очень приятно!",
    "emoji": "🤝",
    "img": "1f91d"
   }
  ]
 },
 {
  "id": "L5",
  "n": 5,
  "stage": "A1",
  "title": "Главные глаголы",
  "cards": [
   {
    "id": "w:biti",
    "kind": "word",
    "sr": "biti",
    "ru": "быть",
    "emoji": "🧍",
    "img": "1f9cd",
    "note": "ja sam, ti si, on je"
   },
   {
    "id": "w:imati",
    "kind": "word",
    "sr": "imati",
    "ru": "иметь",
    "emoji": "🎒",
    "img": "1f392",
    "note": "imam — у меня есть"
   },
   {
    "id": "w:znati",
    "kind": "word",
    "sr": "znati",
    "ru": "знать",
    "emoji": "🧠",
    "img": "1f9e0",
    "note": "znam — я знаю"
   },
   {
    "id": "w:razumeti",
    "kind": "word",
    "sr": "razumeti",
    "ru": "понимать",
    "emoji": "💡",
    "img": "1f4a1",
    "note": "razumem — я понимаю"
   },
   {
    "id": "w:govoriti",
    "kind": "word",
    "sr": "govoriti",
    "ru": "говорить",
    "emoji": "🗣️",
    "img": "1f5e3-fe0f",
    "note": "govorim — я говорю"
   },
   {
    "id": "w:živeti",
    "kind": "word",
    "sr": "živeti",
    "ru": "жить",
    "emoji": "🏡",
    "img": "1f3e1",
    "note": "živim — я живу"
   },
   {
    "id": "w:zvati se",
    "kind": "word",
    "sr": "zvati se",
    "ru": "называться",
    "emoji": "🏷️",
    "img": "1f3f7-fe0f",
    "note": "zovem se — меня зовут"
   },
   {
    "id": "w:hteti",
    "kind": "word",
    "sr": "hteti",
    "ru": "хотеть",
    "emoji": "💭",
    "img": "1f4ad",
    "note": "hoću — я хочу"
   },
   {
    "id": "w:voleti",
    "kind": "word",
    "sr": "voleti",
    "ru": "любить",
    "emoji": "❤️",
    "img": "2764-fe0f",
    "note": "volim — я люблю"
   },
   {
    "id": "w:želeti",
    "kind": "word",
    "sr": "želeti",
    "ru": "желать; хотеть",
    "emoji": "🌠",
    "img": "1f320",
    "note": "želim — я хочу (вежливо)"
   }
  ]
 },
 {
  "id": "L6",
  "n": 6,
  "stage": "A1",
  "title": "Вопросы",
  "cards": [
   {
    "id": "w:ko",
    "kind": "word",
    "sr": "ko",
    "ru": "кто",
    "emoji": "🕵️",
    "img": "1f575-fe0f"
   },
   {
    "id": "w:šta",
    "kind": "word",
    "sr": "šta",
    "ru": "что",
    "emoji": "❔",
    "img": "2754"
   },
   {
    "id": "w:gde",
    "kind": "word",
    "sr": "gde",
    "ru": "где",
    "emoji": "📍",
    "img": "1f4cd"
   },
   {
    "id": "w:kako",
    "kind": "word",
    "sr": "kako",
    "ru": "как",
    "emoji": "🤷",
    "img": "1f937"
   },
   {
    "id": "w:kada",
    "kind": "word",
    "sr": "kada",
    "ru": "когда",
    "emoji": "🗓️",
    "img": "1f5d3-fe0f",
    "note": "Часто коротко: kad"
   },
   {
    "id": "w:zašto",
    "kind": "word",
    "sr": "zašto",
    "ru": "почему; зачем",
    "emoji": "🤨",
    "img": "1f928"
   },
   {
    "id": "w:koji",
    "kind": "word",
    "sr": "koji",
    "ru": "какой; который",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:kuda",
    "kind": "word",
    "sr": "kuda",
    "ru": "куда",
    "emoji": "🧭",
    "img": "1f9ed"
   },
   {
    "id": "w:čiji",
    "kind": "word",
    "sr": "čiji",
    "ru": "чей",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:koliko",
    "kind": "word",
    "sr": "koliko",
    "ru": "сколько",
    "emoji": "🔢",
    "img": "1f522"
   },
   {
    "id": "w:li",
    "kind": "word",
    "sr": "li",
    "ru": "ли (вопрос)",
    "emoji": null,
    "img": null,
    "note": "Govorite li…? — Вы говорите…?"
   },
   {
    "id": "p:Kako se to kaže na srpskom?",
    "kind": "phrase",
    "sr": "Kako se to kaže na srpskom?",
    "ru": "Как это сказать по-сербски?",
    "emoji": "🗣️",
    "img": "1f5e3-fe0f"
   }
  ]
 },
 {
  "id": "L7",
  "n": 7,
  "stage": "A1",
  "title": "Числа 1–10",
  "cards": [
   {
    "id": "w:jedan",
    "kind": "word",
    "sr": "jedan",
    "ru": "один",
    "emoji": "1️⃣",
    "img": "0031-fe0f-20e3"
   },
   {
    "id": "w:dva",
    "kind": "word",
    "sr": "dva",
    "ru": "два",
    "emoji": "2️⃣",
    "img": "0032-fe0f-20e3"
   },
   {
    "id": "w:tri",
    "kind": "word",
    "sr": "tri",
    "ru": "три",
    "emoji": "3️⃣",
    "img": "0033-fe0f-20e3"
   },
   {
    "id": "w:četiri",
    "kind": "word",
    "sr": "četiri",
    "ru": "четыре",
    "emoji": "4️⃣",
    "img": "0034-fe0f-20e3"
   },
   {
    "id": "w:pet",
    "kind": "word",
    "sr": "pet",
    "ru": "пять",
    "emoji": "5️⃣",
    "img": "0035-fe0f-20e3"
   },
   {
    "id": "w:šest",
    "kind": "word",
    "sr": "šest",
    "ru": "шесть",
    "emoji": "6️⃣",
    "img": "0036-fe0f-20e3"
   },
   {
    "id": "w:sedam",
    "kind": "word",
    "sr": "sedam",
    "ru": "семь",
    "emoji": "7️⃣",
    "img": "0037-fe0f-20e3"
   },
   {
    "id": "w:osam",
    "kind": "word",
    "sr": "osam",
    "ru": "восемь",
    "emoji": "8️⃣",
    "img": "0038-fe0f-20e3"
   },
   {
    "id": "w:devet",
    "kind": "word",
    "sr": "devet",
    "ru": "девять",
    "emoji": "9️⃣",
    "img": "0039-fe0f-20e3"
   },
   {
    "id": "w:deset",
    "kind": "word",
    "sr": "deset",
    "ru": "десять",
    "emoji": "🔟",
    "img": "1f51f"
   }
  ]
 },
 {
  "id": "L8",
  "n": 8,
  "stage": "A1",
  "title": "Еда",
  "cards": [
   {
    "id": "w:hleb",
    "kind": "word",
    "sr": "hleb",
    "ru": "хлеб",
    "emoji": "🍞",
    "img": "1f35e"
   },
   {
    "id": "w:jabuka",
    "kind": "word",
    "sr": "jabuka",
    "ru": "яблоко",
    "emoji": "🍎",
    "img": "1f34e"
   },
   {
    "id": "w:sir",
    "kind": "word",
    "sr": "sir",
    "ru": "сыр",
    "emoji": "🧀",
    "img": "1f9c0"
   },
   {
    "id": "w:meso",
    "kind": "word",
    "sr": "meso",
    "ru": "мясо",
    "emoji": "🥩",
    "img": "1f969"
   },
   {
    "id": "w:riba",
    "kind": "word",
    "sr": "riba",
    "ru": "рыба",
    "emoji": "🐟",
    "img": "1f41f"
   },
   {
    "id": "w:piletina",
    "kind": "word",
    "sr": "piletina",
    "ru": "курица (мясо)",
    "emoji": "🍗",
    "img": "1f357"
   },
   {
    "id": "w:salata",
    "kind": "word",
    "sr": "salata",
    "ru": "салат",
    "emoji": "🥗",
    "img": "1f957"
   },
   {
    "id": "w:supa",
    "kind": "word",
    "sr": "supa",
    "ru": "суп",
    "emoji": "🍲",
    "img": "1f372"
   },
   {
    "id": "w:jaje",
    "kind": "word",
    "sr": "jaje",
    "ru": "яйцо",
    "emoji": "🥚",
    "img": "1f95a"
   },
   {
    "id": "w:voće",
    "kind": "word",
    "sr": "voće",
    "ru": "фрукты",
    "emoji": "🍇",
    "img": "1f347"
   },
   {
    "id": "w:povrće",
    "kind": "word",
    "sr": "povrće",
    "ru": "овощи",
    "emoji": "🥕",
    "img": "1f955"
   },
   {
    "id": "p:Gde se nalazi povrće?",
    "kind": "phrase",
    "sr": "Gde se nalazi povrće?",
    "ru": "Где тут овощи?",
    "emoji": "🥕",
    "img": "1f955"
   }
  ]
 },
 {
  "id": "L9",
  "n": 9,
  "stage": "A1",
  "title": "Деньги",
  "cards": [
   {
    "id": "w:novac",
    "kind": "word",
    "sr": "novac",
    "ru": "деньги",
    "emoji": "💰",
    "img": "1f4b0",
    "note": "Разговорно: pare"
   },
   {
    "id": "w:dinar",
    "kind": "word",
    "sr": "dinar",
    "ru": "динар",
    "emoji": "🪙",
    "img": "1fa99"
   },
   {
    "id": "w:evro",
    "kind": "word",
    "sr": "evro",
    "ru": "евро",
    "emoji": "💶",
    "img": "1f4b6"
   },
   {
    "id": "w:cena",
    "kind": "word",
    "sr": "cena",
    "ru": "цена",
    "emoji": "🏷️",
    "img": "1f3f7-fe0f"
   },
   {
    "id": "w:račun",
    "kind": "word",
    "sr": "račun",
    "ru": "счёт",
    "emoji": "🧾",
    "img": "1f9fe"
   },
   {
    "id": "w:kartica",
    "kind": "word",
    "sr": "kartica",
    "ru": "карта (банковская)",
    "emoji": "💳",
    "img": "1f4b3"
   },
   {
    "id": "w:gotovina",
    "kind": "word",
    "sr": "gotovina",
    "ru": "наличные",
    "emoji": "💵",
    "img": "1f4b5"
   },
   {
    "id": "w:skupo",
    "kind": "word",
    "sr": "skupo",
    "ru": "дорого",
    "emoji": "📈",
    "img": "1f4c8"
   },
   {
    "id": "w:jeftino",
    "kind": "word",
    "sr": "jeftino",
    "ru": "дёшево",
    "emoji": "📉",
    "img": "1f4c9"
   },
   {
    "id": "w:platiti",
    "kind": "word",
    "sr": "platiti",
    "ru": "заплатить",
    "emoji": "💸",
    "img": "1f4b8",
    "note": "platim — я заплачу"
   },
   {
    "id": "p:Koliko košta?",
    "kind": "phrase",
    "sr": "Koliko košta?",
    "ru": "Сколько стоит?",
    "emoji": "💰",
    "img": "1f4b0"
   },
   {
    "id": "p:Mogu li da platim karticom?",
    "kind": "phrase",
    "sr": "Mogu li da platim karticom?",
    "ru": "Можно оплатить картой?",
    "emoji": "💳",
    "img": "1f4b3"
   }
  ]
 },
 {
  "id": "L10",
  "n": 10,
  "stage": "A1",
  "title": "Числа до тысячи",
  "cards": [
   {
    "id": "w:jedanaest",
    "kind": "word",
    "sr": "jedanaest",
    "ru": "одиннадцать",
    "emoji": "11",
    "img": null
   },
   {
    "id": "w:dvanaest",
    "kind": "word",
    "sr": "dvanaest",
    "ru": "двенадцать",
    "emoji": "12",
    "img": null
   },
   {
    "id": "w:petnaest",
    "kind": "word",
    "sr": "petnaest",
    "ru": "пятнадцать",
    "emoji": "15",
    "img": null
   },
   {
    "id": "w:dvadeset",
    "kind": "word",
    "sr": "dvadeset",
    "ru": "двадцать",
    "emoji": "20",
    "img": null
   },
   {
    "id": "w:trideset",
    "kind": "word",
    "sr": "trideset",
    "ru": "тридцать",
    "emoji": "30",
    "img": null
   },
   {
    "id": "w:pedeset",
    "kind": "word",
    "sr": "pedeset",
    "ru": "пятьдесят",
    "emoji": "50",
    "img": null
   },
   {
    "id": "w:sto",
    "kind": "word",
    "sr": "sto",
    "ru": "сто",
    "emoji": "💯",
    "img": "1f4af"
   },
   {
    "id": "w:hiljada",
    "kind": "word",
    "sr": "hiljada",
    "ru": "тысяча",
    "emoji": "1000",
    "img": null
   }
  ]
 },
 {
  "id": "L11",
  "n": 11,
  "stage": "A1",
  "title": "Время",
  "cards": [
   {
    "id": "w:sat",
    "kind": "word",
    "sr": "sat",
    "ru": "час; часы",
    "emoji": "🕐",
    "img": "1f550"
   },
   {
    "id": "w:minut",
    "kind": "word",
    "sr": "minut",
    "ru": "минута",
    "emoji": "⏱️",
    "img": "23f1-fe0f"
   },
   {
    "id": "w:vreme",
    "kind": "word",
    "sr": "vreme",
    "ru": "время; погода",
    "emoji": "⏰",
    "img": "23f0"
   },
   {
    "id": "w:danas",
    "kind": "word",
    "sr": "danas",
    "ru": "сегодня",
    "emoji": "📅",
    "img": "1f4c5"
   },
   {
    "id": "w:sutra",
    "kind": "word",
    "sr": "sutra",
    "ru": "завтра",
    "emoji": "⏭️",
    "img": "23ed-fe0f"
   },
   {
    "id": "w:juče",
    "kind": "word",
    "sr": "juče",
    "ru": "вчера",
    "emoji": "⏮️",
    "img": "23ee-fe0f"
   },
   {
    "id": "w:sada",
    "kind": "word",
    "sr": "sada",
    "ru": "сейчас",
    "emoji": "⌚",
    "img": "231a",
    "note": "Часто коротко: sad"
   },
   {
    "id": "w:jutro",
    "kind": "word",
    "sr": "jutro",
    "ru": "утро",
    "emoji": "🌅",
    "img": "1f305"
   },
   {
    "id": "w:veče",
    "kind": "word",
    "sr": "veče",
    "ru": "вечер",
    "emoji": "🌆",
    "img": "1f306"
   },
   {
    "id": "w:dan",
    "kind": "word",
    "sr": "dan",
    "ru": "день",
    "emoji": "☀️",
    "img": "2600-fe0f"
   },
   {
    "id": "w:noć",
    "kind": "word",
    "sr": "noć",
    "ru": "ночь",
    "emoji": "🌃",
    "img": "1f303"
   },
   {
    "id": "p:Koliko je sati?",
    "kind": "phrase",
    "sr": "Koliko je sati?",
    "ru": "Который час?",
    "emoji": "🕐",
    "img": "1f550"
   }
  ]
 },
 {
  "id": "L12",
  "n": 12,
  "stage": "A1",
  "title": "Дни недели",
  "cards": [
   {
    "id": "w:ponedeljak",
    "kind": "word",
    "sr": "ponedeljak",
    "ru": "понедельник",
    "emoji": "1️⃣",
    "img": "0031-fe0f-20e3"
   },
   {
    "id": "w:utorak",
    "kind": "word",
    "sr": "utorak",
    "ru": "вторник",
    "emoji": "2️⃣",
    "img": "0032-fe0f-20e3"
   },
   {
    "id": "w:sreda",
    "kind": "word",
    "sr": "sreda",
    "ru": "среда",
    "emoji": "3️⃣",
    "img": "0033-fe0f-20e3"
   },
   {
    "id": "w:četvrtak",
    "kind": "word",
    "sr": "četvrtak",
    "ru": "четверг",
    "emoji": "4️⃣",
    "img": "0034-fe0f-20e3"
   },
   {
    "id": "w:petak",
    "kind": "word",
    "sr": "petak",
    "ru": "пятница",
    "emoji": "5️⃣",
    "img": "0035-fe0f-20e3"
   },
   {
    "id": "w:subota",
    "kind": "word",
    "sr": "subota",
    "ru": "суббота",
    "emoji": "6️⃣",
    "img": "0036-fe0f-20e3"
   },
   {
    "id": "w:nedelja",
    "kind": "word",
    "sr": "nedelja",
    "ru": "воскресенье",
    "emoji": "7️⃣",
    "img": "0037-fe0f-20e3",
    "note": "⚠️ Не «неделя», а воскресенье (хотя «неделя» тоже)"
   },
   {
    "id": "w:vikend",
    "kind": "word",
    "sr": "vikend",
    "ru": "выходные",
    "emoji": "🛋️",
    "img": "1f6cb-fe0f"
   },
   {
    "id": "w:sedmica",
    "kind": "word",
    "sr": "sedmica",
    "ru": "неделя",
    "emoji": "🗓️",
    "img": "1f5d3-fe0f"
   }
  ]
 },
 {
  "id": "L13",
  "n": 13,
  "stage": "A1",
  "title": "В кафе",
  "cards": [
   {
    "id": "w:restoran",
    "kind": "word",
    "sr": "restoran",
    "ru": "ресторан",
    "emoji": "🍴",
    "img": "1f374"
   },
   {
    "id": "w:kafić",
    "kind": "word",
    "sr": "kafić",
    "ru": "кафе",
    "emoji": "🪑",
    "img": "1fa91"
   },
   {
    "id": "w:konobar",
    "kind": "word",
    "sr": "konobar",
    "ru": "официант",
    "emoji": "🤵",
    "img": "1f935"
   },
   {
    "id": "w:jelovnik",
    "kind": "word",
    "sr": "jelovnik",
    "ru": "меню",
    "emoji": "📋",
    "img": "1f4cb"
   },
   {
    "id": "w:čaša",
    "kind": "word",
    "sr": "čaša",
    "ru": "стакан; бокал",
    "emoji": "🥛",
    "img": "1f95b"
   },
   {
    "id": "w:tanjir",
    "kind": "word",
    "sr": "tanjir",
    "ru": "тарелка",
    "emoji": "🍽️",
    "img": "1f37d-fe0f"
   },
   {
    "id": "w:doručak",
    "kind": "word",
    "sr": "doručak",
    "ru": "завтрак",
    "emoji": "🥐",
    "img": "1f950"
   },
   {
    "id": "w:ručak",
    "kind": "word",
    "sr": "ručak",
    "ru": "обед",
    "emoji": "🍝",
    "img": "1f35d"
   },
   {
    "id": "w:večera",
    "kind": "word",
    "sr": "večera",
    "ru": "ужин",
    "emoji": "🍷",
    "img": "1f377"
   },
   {
    "id": "w:ukusno",
    "kind": "word",
    "sr": "ukusno",
    "ru": "вкусно",
    "emoji": "😋",
    "img": "1f60b"
   },
   {
    "id": "p:Račun, molim.",
    "kind": "phrase",
    "sr": "Račun, molim.",
    "ru": "Счёт, пожалуйста.",
    "emoji": "🧾",
    "img": "1f9fe"
   }
  ]
 },
 {
  "id": "L14",
  "n": 14,
  "stage": "A1",
  "title": "Глаголы на каждый день",
  "cards": [
   {
    "id": "w:jesti",
    "kind": "word",
    "sr": "jesti",
    "ru": "есть, кушать",
    "emoji": "🍽️",
    "img": "1f37d-fe0f",
    "note": "jedem — я ем"
   },
   {
    "id": "w:piti",
    "kind": "word",
    "sr": "piti",
    "ru": "пить",
    "emoji": "🥤",
    "img": "1f964",
    "note": "pijem — я пью"
   },
   {
    "id": "w:raditi",
    "kind": "word",
    "sr": "raditi",
    "ru": "работать; делать",
    "emoji": "🛠️",
    "img": "1f6e0-fe0f",
    "note": "radim — я работаю"
   },
   {
    "id": "w:ići",
    "kind": "word",
    "sr": "ići",
    "ru": "идти; ехать",
    "emoji": "🚶",
    "img": "1f6b6",
    "note": "idem — я иду"
   },
   {
    "id": "w:doći",
    "kind": "word",
    "sr": "doći",
    "ru": "прийти",
    "emoji": "🚪",
    "img": "1f6aa",
    "note": "dođem — я приду"
   },
   {
    "id": "w:videti",
    "kind": "word",
    "sr": "videti",
    "ru": "видеть",
    "emoji": "👀",
    "img": "1f440",
    "note": "vidim — я вижу"
   },
   {
    "id": "w:kupiti",
    "kind": "word",
    "sr": "kupiti",
    "ru": "купить",
    "emoji": "🛒",
    "img": "1f6d2",
    "note": "kupim — я куплю"
   },
   {
    "id": "w:dati",
    "kind": "word",
    "sr": "dati",
    "ru": "дать",
    "emoji": "🎁",
    "img": "1f381",
    "note": "dam — я дам"
   },
   {
    "id": "w:čekati",
    "kind": "word",
    "sr": "čekati",
    "ru": "ждать",
    "emoji": "⏳",
    "img": "23f3",
    "note": "čekam — я жду"
   },
   {
    "id": "w:pomoći",
    "kind": "word",
    "sr": "pomoći",
    "ru": "помочь",
    "emoji": "🆘",
    "img": "1f198",
    "note": "pomognem — я помогу"
   }
  ]
 },
 {
  "id": "L15",
  "n": 15,
  "stage": "A1",
  "title": "Дом и квартира",
  "cards": [
   {
    "id": "w:kuća",
    "kind": "word",
    "sr": "kuća",
    "ru": "дом",
    "emoji": "🏠",
    "img": "1f3e0"
   },
   {
    "id": "w:stan",
    "kind": "word",
    "sr": "stan",
    "ru": "квартира",
    "emoji": "🏢",
    "img": "1f3e2",
    "note": "⚠️ Не «стан», а квартира"
   },
   {
    "id": "w:soba",
    "kind": "word",
    "sr": "soba",
    "ru": "комната",
    "emoji": "🛏️",
    "img": "1f6cf-fe0f"
   },
   {
    "id": "w:kuhinja",
    "kind": "word",
    "sr": "kuhinja",
    "ru": "кухня",
    "emoji": "🍳",
    "img": "1f373"
   },
   {
    "id": "w:kupatilo",
    "kind": "word",
    "sr": "kupatilo",
    "ru": "ванная",
    "emoji": "🛁",
    "img": "1f6c1"
   },
   {
    "id": "w:sprat",
    "kind": "word",
    "sr": "sprat",
    "ru": "этаж",
    "emoji": "🪜",
    "img": "1fa9c"
   },
   {
    "id": "w:vrata",
    "kind": "word",
    "sr": "vrata",
    "ru": "дверь",
    "emoji": "🚪",
    "img": "1f6aa"
   },
   {
    "id": "w:prozor",
    "kind": "word",
    "sr": "prozor",
    "ru": "окно",
    "emoji": "🪟",
    "img": "1fa9f"
   },
   {
    "id": "w:ključ",
    "kind": "word",
    "sr": "ključ",
    "ru": "ключ",
    "emoji": "🔑",
    "img": "1f511"
   },
   {
    "id": "w:adresa",
    "kind": "word",
    "sr": "adresa",
    "ru": "адрес",
    "emoji": "📮",
    "img": "1f4ee"
   },
   {
    "id": "p:Nema tople vode.",
    "kind": "phrase",
    "sr": "Nema tople vode.",
    "ru": "Нет горячей воды.",
    "emoji": "🚿",
    "img": "1f6bf"
   }
  ]
 },
 {
  "id": "L16",
  "n": 16,
  "stage": "A1",
  "title": "Где? Налево, направо",
  "cards": [
   {
    "id": "w:levo",
    "kind": "word",
    "sr": "levo",
    "ru": "налево; слева",
    "emoji": "⬅️",
    "img": "2b05-fe0f"
   },
   {
    "id": "w:desno",
    "kind": "word",
    "sr": "desno",
    "ru": "направо; справа",
    "emoji": "➡️",
    "img": "27a1-fe0f"
   },
   {
    "id": "w:pravo",
    "kind": "word",
    "sr": "pravo",
    "ru": "прямо",
    "emoji": "⬆️",
    "img": "2b06-fe0f",
    "note": "⚠️ Не «право», а прямо"
   },
   {
    "id": "w:ovde",
    "kind": "word",
    "sr": "ovde",
    "ru": "здесь",
    "emoji": "👇",
    "img": "1f447"
   },
   {
    "id": "w:tamo",
    "kind": "word",
    "sr": "tamo",
    "ru": "там",
    "emoji": "👉",
    "img": "1f449"
   },
   {
    "id": "w:ispred",
    "kind": "word",
    "sr": "ispred",
    "ru": "перед",
    "emoji": "⬆️",
    "img": "2b06-fe0f"
   },
   {
    "id": "w:iza",
    "kind": "word",
    "sr": "iza",
    "ru": "за; позади",
    "emoji": "⬇️",
    "img": "2b07-fe0f"
   },
   {
    "id": "w:pored",
    "kind": "word",
    "sr": "pored",
    "ru": "рядом с",
    "emoji": "👫",
    "img": "1f46b"
   },
   {
    "id": "w:između",
    "kind": "word",
    "sr": "između",
    "ru": "между",
    "emoji": "↔️",
    "img": "2194-fe0f"
   }
  ]
 },
 {
  "id": "L17",
  "n": 17,
  "stage": "A1",
  "title": "Город и транспорт",
  "cards": [
   {
    "id": "w:grad",
    "kind": "word",
    "sr": "grad",
    "ru": "город",
    "emoji": "🏙️",
    "img": "1f3d9-fe0f"
   },
   {
    "id": "w:ulica",
    "kind": "word",
    "sr": "ulica",
    "ru": "улица",
    "emoji": "🛣️",
    "img": "1f6e3-fe0f"
   },
   {
    "id": "w:trg",
    "kind": "word",
    "sr": "trg",
    "ru": "площадь",
    "emoji": "⛲",
    "img": "26f2"
   },
   {
    "id": "w:centar",
    "kind": "word",
    "sr": "centar",
    "ru": "центр",
    "emoji": "🏛️",
    "img": "1f3db-fe0f"
   },
   {
    "id": "w:stanica",
    "kind": "word",
    "sr": "stanica",
    "ru": "остановка; станция",
    "emoji": "🚏",
    "img": "1f68f"
   },
   {
    "id": "w:autobus",
    "kind": "word",
    "sr": "autobus",
    "ru": "автобус",
    "emoji": "🚌",
    "img": "1f68c"
   },
   {
    "id": "w:tramvaj",
    "kind": "word",
    "sr": "tramvaj",
    "ru": "трамвай",
    "emoji": "🚋",
    "img": "1f68b"
   },
   {
    "id": "w:taksi",
    "kind": "word",
    "sr": "taksi",
    "ru": "такси",
    "emoji": "🚕",
    "img": "1f695"
   },
   {
    "id": "w:auto",
    "kind": "word",
    "sr": "auto",
    "ru": "машина",
    "emoji": "🚗",
    "img": "1f697"
   },
   {
    "id": "w:karta",
    "kind": "word",
    "sr": "karta",
    "ru": "билет; карта",
    "emoji": "🎫",
    "img": "1f3ab"
   },
   {
    "id": "p:Kako da stignem do centra?",
    "kind": "phrase",
    "sr": "Kako da stignem do centra?",
    "ru": "Как добраться до центра?",
    "emoji": "🗺️",
    "img": "1f5fa-fe0f"
   }
  ]
 },
 {
  "id": "L18",
  "n": 18,
  "stage": "A1",
  "title": "Люди",
  "cards": [
   {
    "id": "w:čovek",
    "kind": "word",
    "sr": "čovek",
    "ru": "человек; мужчина",
    "emoji": "🧑",
    "img": "1f9d1"
   },
   {
    "id": "w:žena",
    "kind": "word",
    "sr": "žena",
    "ru": "женщина; жена",
    "emoji": "👩‍🦰",
    "img": "1f469-200d-1f9b0"
   },
   {
    "id": "w:muž",
    "kind": "word",
    "sr": "muž",
    "ru": "муж",
    "emoji": "💍",
    "img": "1f48d"
   },
   {
    "id": "w:dete",
    "kind": "word",
    "sr": "dete",
    "ru": "ребёнок",
    "emoji": "👶",
    "img": "1f476"
   },
   {
    "id": "w:deca",
    "kind": "word",
    "sr": "deca",
    "ru": "дети",
    "emoji": "🧒",
    "img": "1f9d2"
   },
   {
    "id": "w:prijatelj",
    "kind": "word",
    "sr": "prijatelj",
    "ru": "друг",
    "emoji": "🤝",
    "img": "1f91d"
   },
   {
    "id": "w:devojka",
    "kind": "word",
    "sr": "devojka",
    "ru": "девушка",
    "emoji": "👩",
    "img": "1f469"
   },
   {
    "id": "w:dečko",
    "kind": "word",
    "sr": "dečko",
    "ru": "парень",
    "emoji": "👦",
    "img": "1f466"
   },
   {
    "id": "w:porodica",
    "kind": "word",
    "sr": "porodica",
    "ru": "семья",
    "emoji": "👨‍👩‍👧",
    "img": "1f468-200d-1f469-200d-1f467"
   },
   {
    "id": "w:komšija",
    "kind": "word",
    "sr": "komšija",
    "ru": "сосед",
    "emoji": "🏘️",
    "img": "1f3d8-fe0f"
   }
  ]
 },
 {
  "id": "L19",
  "n": 19,
  "stage": "A1",
  "title": "Семья",
  "cards": [
   {
    "id": "w:majka",
    "kind": "word",
    "sr": "majka",
    "ru": "мать",
    "emoji": "👩‍👧",
    "img": "1f469-200d-1f467"
   },
   {
    "id": "w:otac",
    "kind": "word",
    "sr": "otac",
    "ru": "отец",
    "emoji": "👨‍👧",
    "img": "1f468-200d-1f467"
   },
   {
    "id": "w:mama",
    "kind": "word",
    "sr": "mama",
    "ru": "мама",
    "emoji": "🤱",
    "img": "1f931"
   },
   {
    "id": "w:tata",
    "kind": "word",
    "sr": "tata",
    "ru": "папа",
    "emoji": "👨",
    "img": "1f468"
   },
   {
    "id": "w:sin",
    "kind": "word",
    "sr": "sin",
    "ru": "сын",
    "emoji": "👦",
    "img": "1f466"
   },
   {
    "id": "w:ćerka",
    "kind": "word",
    "sr": "ćerka",
    "ru": "дочь",
    "emoji": "👧",
    "img": "1f467"
   },
   {
    "id": "w:brat",
    "kind": "word",
    "sr": "brat",
    "ru": "брат",
    "emoji": "🧑",
    "img": "1f9d1"
   },
   {
    "id": "w:sestra",
    "kind": "word",
    "sr": "sestra",
    "ru": "сестра",
    "emoji": "👩",
    "img": "1f469"
   },
   {
    "id": "w:baba",
    "kind": "word",
    "sr": "baba",
    "ru": "бабушка",
    "emoji": "👵",
    "img": "1f475"
   },
   {
    "id": "w:deda",
    "kind": "word",
    "sr": "deda",
    "ru": "дедушка",
    "emoji": "👴",
    "img": "1f474"
   }
  ]
 },
 {
  "id": "L20",
  "n": 20,
  "stage": "A1",
  "title": "Какой? Хороший, большой",
  "cards": [
   {
    "id": "w:dobar",
    "kind": "word",
    "sr": "dobar",
    "ru": "хороший",
    "emoji": "👍",
    "img": "1f44d"
   },
   {
    "id": "w:loš",
    "kind": "word",
    "sr": "loš",
    "ru": "плохой",
    "emoji": "👎",
    "img": "1f44e"
   },
   {
    "id": "w:veliki",
    "kind": "word",
    "sr": "veliki",
    "ru": "большой",
    "emoji": "🐘",
    "img": "1f418"
   },
   {
    "id": "w:mali",
    "kind": "word",
    "sr": "mali",
    "ru": "маленький",
    "emoji": "🐭",
    "img": "1f42d"
   },
   {
    "id": "w:novi",
    "kind": "word",
    "sr": "novi",
    "ru": "новый",
    "emoji": "✨",
    "img": "2728"
   },
   {
    "id": "w:stari",
    "kind": "word",
    "sr": "stari",
    "ru": "старый",
    "emoji": "👴",
    "img": "1f474"
   },
   {
    "id": "w:lep",
    "kind": "word",
    "sr": "lep",
    "ru": "красивый",
    "emoji": "🌸",
    "img": "1f338"
   },
   {
    "id": "w:topao",
    "kind": "word",
    "sr": "topao",
    "ru": "тёплый",
    "emoji": "🔥",
    "img": "1f525"
   },
   {
    "id": "w:hladan",
    "kind": "word",
    "sr": "hladan",
    "ru": "холодный",
    "emoji": "🧊",
    "img": "1f9ca"
   },
   {
    "id": "w:važan",
    "kind": "word",
    "sr": "važan",
    "ru": "важный",
    "emoji": "⭐",
    "img": "2b50"
   }
  ]
 },
 {
  "id": "L21",
  "n": 21,
  "stage": "A1",
  "title": "Много, мало, всё",
  "cards": [
   {
    "id": "w:vrlo",
    "kind": "word",
    "sr": "vrlo",
    "ru": "очень",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:jako",
    "kind": "word",
    "sr": "jako",
    "ru": "очень; сильно",
    "emoji": null,
    "img": null,
    "note": "⚠️ Не «ярко», а очень"
   },
   {
    "id": "w:malo",
    "kind": "word",
    "sr": "malo",
    "ru": "мало; немного",
    "emoji": "🤏",
    "img": "1f90f"
   },
   {
    "id": "w:mnogo",
    "kind": "word",
    "sr": "mnogo",
    "ru": "много",
    "emoji": "📚",
    "img": "1f4da"
   },
   {
    "id": "w:sve",
    "kind": "word",
    "sr": "sve",
    "ru": "всё",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:nešto",
    "kind": "word",
    "sr": "nešto",
    "ru": "что-то",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:ništa",
    "kind": "word",
    "sr": "ništa",
    "ru": "ничего",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:još",
    "kind": "word",
    "sr": "još",
    "ru": "ещё",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L22",
  "n": 22,
  "stage": "A1",
  "title": "И, но, если",
  "cards": [
   {
    "id": "w:i",
    "kind": "word",
    "sr": "i",
    "ru": "и",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:a",
    "kind": "word",
    "sr": "a",
    "ru": "а",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:ali",
    "kind": "word",
    "sr": "ali",
    "ru": "но",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:ili",
    "kind": "word",
    "sr": "ili",
    "ru": "или",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:jer",
    "kind": "word",
    "sr": "jer",
    "ru": "потому что",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:ako",
    "kind": "word",
    "sr": "ako",
    "ru": "если",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:zato",
    "kind": "word",
    "sr": "zato",
    "ru": "поэтому",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:možda",
    "kind": "word",
    "sr": "možda",
    "ru": "может быть",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L23",
  "n": 23,
  "stage": "A1",
  "title": "Ноль, половина, первый",
  "cards": [
   {
    "id": "w:nula",
    "kind": "word",
    "sr": "nula",
    "ru": "ноль",
    "emoji": "0️⃣",
    "img": "0030-fe0f-20e3"
   },
   {
    "id": "w:pola",
    "kind": "word",
    "sr": "pola",
    "ru": "половина",
    "emoji": "½",
    "img": null
   },
   {
    "id": "w:prvi",
    "kind": "word",
    "sr": "prvi",
    "ru": "первый",
    "emoji": "🥇",
    "img": "1f947"
   },
   {
    "id": "w:drugi",
    "kind": "word",
    "sr": "drugi",
    "ru": "второй; другой",
    "emoji": "🥈",
    "img": "1f948"
   },
   {
    "id": "w:treći",
    "kind": "word",
    "sr": "treći",
    "ru": "третий",
    "emoji": "🥉",
    "img": "1f949"
   },
   {
    "id": "w:četvrti",
    "kind": "word",
    "sr": "četvrti",
    "ru": "четвёртый",
    "emoji": "4️⃣",
    "img": "0034-fe0f-20e3"
   }
  ]
 },
 {
  "id": "L24",
  "n": 24,
  "stage": "A1",
  "title": "Магазин",
  "cards": [
   {
    "id": "w:prodavnica",
    "kind": "word",
    "sr": "prodavnica",
    "ru": "магазин",
    "emoji": "🏪",
    "img": "1f3ea"
   },
   {
    "id": "w:pijaca",
    "kind": "word",
    "sr": "pijaca",
    "ru": "рынок",
    "emoji": "🧺",
    "img": "1f9fa"
   },
   {
    "id": "w:apoteka",
    "kind": "word",
    "sr": "apoteka",
    "ru": "аптека",
    "emoji": "💊",
    "img": "1f48a"
   },
   {
    "id": "w:pekara",
    "kind": "word",
    "sr": "pekara",
    "ru": "пекарня",
    "emoji": "🥖",
    "img": "1f956"
   },
   {
    "id": "w:kasa",
    "kind": "word",
    "sr": "kasa",
    "ru": "касса",
    "emoji": "🛒",
    "img": "1f6d2"
   },
   {
    "id": "w:kesa",
    "kind": "word",
    "sr": "kesa",
    "ru": "пакет",
    "emoji": "🛍️",
    "img": "1f6cd-fe0f"
   },
   {
    "id": "w:flaša",
    "kind": "word",
    "sr": "flaša",
    "ru": "бутылка",
    "emoji": "🍾",
    "img": "1f37e"
   },
   {
    "id": "w:kilogram",
    "kind": "word",
    "sr": "kilogram",
    "ru": "килограмм",
    "emoji": "⚖️",
    "img": "2696-fe0f"
   },
   {
    "id": "w:litar",
    "kind": "word",
    "sr": "litar",
    "ru": "литр",
    "emoji": "🧴",
    "img": "1f9f4"
   },
   {
    "id": "w:komad",
    "kind": "word",
    "sr": "komad",
    "ru": "штука; кусок",
    "emoji": "🧱",
    "img": "1f9f1"
   },
   {
    "id": "p:Ne treba mi kesa.",
    "kind": "phrase",
    "sr": "Ne treba mi kesa.",
    "ru": "Пакет не нужен.",
    "emoji": "🛍️",
    "img": "1f6cd-fe0f"
   },
   {
    "id": "p:Samo gledam, hvala.",
    "kind": "phrase",
    "sr": "Samo gledam, hvala.",
    "ru": "Я просто смотрю, спасибо.",
    "emoji": "👀",
    "img": "1f440"
   }
  ]
 },
 {
  "id": "L25",
  "n": 25,
  "stage": "A1",
  "title": "Могу, должен, нужно",
  "cards": [
   {
    "id": "w:moći",
    "kind": "word",
    "sr": "moći",
    "ru": "мочь",
    "emoji": "💪",
    "img": "1f4aa",
    "note": "mogu — я могу"
   },
   {
    "id": "w:morati",
    "kind": "word",
    "sr": "morati",
    "ru": "быть должным",
    "emoji": "❗",
    "img": "2757",
    "note": "moram — я должен"
   },
   {
    "id": "w:trebati",
    "kind": "word",
    "sr": "trebati",
    "ru": "нужно; надо",
    "emoji": "🧩",
    "img": "1f9e9",
    "note": "treba mi — мне нужно"
   },
   {
    "id": "w:misliti",
    "kind": "word",
    "sr": "misliti",
    "ru": "думать",
    "emoji": "🤔",
    "img": "1f914",
    "note": "mislim — я думаю"
   },
   {
    "id": "w:pitati",
    "kind": "word",
    "sr": "pitati",
    "ru": "спрашивать",
    "emoji": "🙋",
    "img": "1f64b",
    "note": "⚠️ Не «питать», а спрашивать"
   },
   {
    "id": "w:reći",
    "kind": "word",
    "sr": "reći",
    "ru": "сказать",
    "emoji": "💬",
    "img": "1f4ac",
    "note": "kažem — я скажу"
   },
   {
    "id": "w:tražiti",
    "kind": "word",
    "sr": "tražiti",
    "ru": "искать; просить",
    "emoji": "🔎",
    "img": "1f50e",
    "note": "tražim — я ищу"
   },
   {
    "id": "w:sviđati se",
    "kind": "word",
    "sr": "sviđati se",
    "ru": "нравиться",
    "emoji": "😍",
    "img": "1f60d",
    "note": "sviđa mi se — мне нравится"
   },
   {
    "id": "p:Možete li da mi pomognete?",
    "kind": "phrase",
    "sr": "Možete li da mi pomognete?",
    "ru": "Можете мне помочь?",
    "emoji": "💬",
    "img": "1f4ac"
   }
  ]
 },
 {
  "id": "L26",
  "n": 26,
  "stage": "A1",
  "title": "Работа и учёба",
  "cards": [
   {
    "id": "w:posao",
    "kind": "word",
    "sr": "posao",
    "ru": "работа",
    "emoji": "💼",
    "img": "1f4bc"
   },
   {
    "id": "w:šef",
    "kind": "word",
    "sr": "šef",
    "ru": "начальник",
    "emoji": "🧑‍💼",
    "img": "1f9d1-200d-1f4bc"
   },
   {
    "id": "w:kolega",
    "kind": "word",
    "sr": "kolega",
    "ru": "коллега",
    "emoji": "👥",
    "img": "1f465"
   },
   {
    "id": "w:sastanak",
    "kind": "word",
    "sr": "sastanak",
    "ru": "встреча; совещание",
    "emoji": "🗓️",
    "img": "1f5d3-fe0f"
   },
   {
    "id": "w:škola",
    "kind": "word",
    "sr": "škola",
    "ru": "школа",
    "emoji": "🏫",
    "img": "1f3eb"
   },
   {
    "id": "w:učiti",
    "kind": "word",
    "sr": "učiti",
    "ru": "учить; учиться",
    "emoji": "📖",
    "img": "1f4d6",
    "note": "učim — я учу"
   },
   {
    "id": "w:reč",
    "kind": "word",
    "sr": "reč",
    "ru": "слово",
    "emoji": "🔤",
    "img": "1f524"
   },
   {
    "id": "w:pitanje",
    "kind": "word",
    "sr": "pitanje",
    "ru": "вопрос",
    "emoji": "❓",
    "img": "2753"
   },
   {
    "id": "w:odgovor",
    "kind": "word",
    "sr": "odgovor",
    "ru": "ответ",
    "emoji": "💬",
    "img": "1f4ac"
   }
  ]
 },
 {
  "id": "L27",
  "n": 27,
  "stage": "A1",
  "title": "Мой день",
  "cards": [
   {
    "id": "w:spavati",
    "kind": "word",
    "sr": "spavati",
    "ru": "спать",
    "emoji": "😴",
    "img": "1f634",
    "note": "spavam — я сплю"
   },
   {
    "id": "w:ustati",
    "kind": "word",
    "sr": "ustati",
    "ru": "встать",
    "emoji": "🌄",
    "img": "1f304",
    "note": "ustanem — я встану"
   },
   {
    "id": "w:kuvati",
    "kind": "word",
    "sr": "kuvati",
    "ru": "готовить (еду)",
    "emoji": "🍳",
    "img": "1f373",
    "note": "kuvam — я готовлю"
   },
   {
    "id": "w:prati",
    "kind": "word",
    "sr": "prati",
    "ru": "мыть; стирать",
    "emoji": "🧼",
    "img": "1f9fc",
    "note": "perem — я мою"
   },
   {
    "id": "w:čitati",
    "kind": "word",
    "sr": "čitati",
    "ru": "читать",
    "emoji": "📰",
    "img": "1f4f0",
    "note": "čitam — я читаю"
   },
   {
    "id": "w:pisati",
    "kind": "word",
    "sr": "pisati",
    "ru": "писать",
    "emoji": "✍️",
    "img": "270d-fe0f",
    "note": "pišem — я пишу"
   },
   {
    "id": "w:gledati",
    "kind": "word",
    "sr": "gledati",
    "ru": "смотреть",
    "emoji": "📺",
    "img": "1f4fa",
    "note": "gledam — я смотрю"
   },
   {
    "id": "w:slušati",
    "kind": "word",
    "sr": "slušati",
    "ru": "слушать",
    "emoji": "🎧",
    "img": "1f3a7",
    "note": "slušam — я слушаю"
   },
   {
    "id": "w:čuti",
    "kind": "word",
    "sr": "čuti",
    "ru": "слышать",
    "emoji": "👂",
    "img": "1f442",
    "note": "čujem — я слышу"
   },
   {
    "id": "w:odmarati se",
    "kind": "word",
    "sr": "odmarati se",
    "ru": "отдыхать",
    "emoji": "🛋️",
    "img": "1f6cb-fe0f",
    "note": "odmaram se — я отдыхаю"
   },
   {
    "id": "p:Vidimo se sutra!",
    "kind": "phrase",
    "sr": "Vidimo se sutra!",
    "ru": "Увидимся завтра!",
    "emoji": "👋",
    "img": "1f44b"
   }
  ]
 },
 {
  "id": "L28",
  "n": 28,
  "stage": "A1",
  "title": "В, на, с, без",
  "cards": [
   {
    "id": "w:u",
    "kind": "word",
    "sr": "u",
    "ru": "в",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:na",
    "kind": "word",
    "sr": "na",
    "ru": "на",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:kod",
    "kind": "word",
    "sr": "kod",
    "ru": "у (кого-то)",
    "emoji": null,
    "img": null,
    "note": "kod kuće — дома"
   },
   {
    "id": "w:sa",
    "kind": "word",
    "sr": "sa",
    "ru": "с",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:bez",
    "kind": "word",
    "sr": "bez",
    "ru": "без",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:za",
    "kind": "word",
    "sr": "za",
    "ru": "для; за",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:od",
    "kind": "word",
    "sr": "od",
    "ru": "от",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:do",
    "kind": "word",
    "sr": "do",
    "ru": "до",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L29",
  "n": 29,
  "stage": "A1",
  "title": "Январь — июнь",
  "cards": [
   {
    "id": "w:januar",
    "kind": "word",
    "sr": "januar",
    "ru": "январь",
    "emoji": "❄️",
    "img": "2744-fe0f"
   },
   {
    "id": "w:februar",
    "kind": "word",
    "sr": "februar",
    "ru": "февраль",
    "emoji": "🌨️",
    "img": "1f328-fe0f"
   },
   {
    "id": "w:mart",
    "kind": "word",
    "sr": "mart",
    "ru": "март",
    "emoji": "🌷",
    "img": "1f337"
   },
   {
    "id": "w:april",
    "kind": "word",
    "sr": "april",
    "ru": "апрель",
    "emoji": "🌧️",
    "img": "1f327-fe0f"
   },
   {
    "id": "w:maj",
    "kind": "word",
    "sr": "maj",
    "ru": "май",
    "emoji": "🌼",
    "img": "1f33c"
   },
   {
    "id": "w:jun",
    "kind": "word",
    "sr": "jun",
    "ru": "июнь",
    "emoji": "🌞",
    "img": "1f31e"
   },
   {
    "id": "w:mesec",
    "kind": "word",
    "sr": "mesec",
    "ru": "месяц",
    "emoji": "🌙",
    "img": "1f319"
   },
   {
    "id": "w:godina",
    "kind": "word",
    "sr": "godina",
    "ru": "год",
    "emoji": "📆",
    "img": "1f4c6"
   },
   {
    "id": "w:datum",
    "kind": "word",
    "sr": "datum",
    "ru": "дата",
    "emoji": "📌",
    "img": "1f4cc"
   }
  ]
 },
 {
  "id": "L30",
  "n": 30,
  "stage": "A1",
  "title": "Июль — декабрь и времена года",
  "cards": [
   {
    "id": "w:jul",
    "kind": "word",
    "sr": "jul",
    "ru": "июль",
    "emoji": "🏖️",
    "img": "1f3d6-fe0f"
   },
   {
    "id": "w:avgust",
    "kind": "word",
    "sr": "avgust",
    "ru": "август",
    "emoji": "🍉",
    "img": "1f349"
   },
   {
    "id": "w:septembar",
    "kind": "word",
    "sr": "septembar",
    "ru": "сентябрь",
    "emoji": "🍂",
    "img": "1f342"
   },
   {
    "id": "w:oktobar",
    "kind": "word",
    "sr": "oktobar",
    "ru": "октябрь",
    "emoji": "🎃",
    "img": "1f383"
   },
   {
    "id": "w:novembar",
    "kind": "word",
    "sr": "novembar",
    "ru": "ноябрь",
    "emoji": "🌫️",
    "img": "1f32b-fe0f"
   },
   {
    "id": "w:decembar",
    "kind": "word",
    "sr": "decembar",
    "ru": "декабрь",
    "emoji": "🎄",
    "img": "1f384"
   },
   {
    "id": "w:proleće",
    "kind": "word",
    "sr": "proleće",
    "ru": "весна",
    "emoji": "🌸",
    "img": "1f338"
   },
   {
    "id": "w:leto",
    "kind": "word",
    "sr": "leto",
    "ru": "лето",
    "emoji": "☀️",
    "img": "2600-fe0f",
    "note": "⚠️ leto — лето, а не «лёд»"
   },
   {
    "id": "w:jesen",
    "kind": "word",
    "sr": "jesen",
    "ru": "осень",
    "emoji": "🍁",
    "img": "1f341"
   },
   {
    "id": "w:zima",
    "kind": "word",
    "sr": "zima",
    "ru": "зима",
    "emoji": "⛄",
    "img": "26c4"
   }
  ]
 },
 {
  "id": "L31",
  "n": 31,
  "stage": "A1",
  "title": "Тело и здоровье",
  "cards": [
   {
    "id": "w:glava",
    "kind": "word",
    "sr": "glava",
    "ru": "голова",
    "emoji": "🧠",
    "img": "1f9e0"
   },
   {
    "id": "w:ruka",
    "kind": "word",
    "sr": "ruka",
    "ru": "рука",
    "emoji": "✋",
    "img": "270b"
   },
   {
    "id": "w:noga",
    "kind": "word",
    "sr": "noga",
    "ru": "нога",
    "emoji": "🦵",
    "img": "1f9b5"
   },
   {
    "id": "w:oko",
    "kind": "word",
    "sr": "oko",
    "ru": "глаз",
    "emoji": "👁️",
    "img": "1f441-fe0f"
   },
   {
    "id": "w:zub",
    "kind": "word",
    "sr": "zub",
    "ru": "зуб",
    "emoji": "🦷",
    "img": "1f9b7"
   },
   {
    "id": "w:stomak",
    "kind": "word",
    "sr": "stomak",
    "ru": "живот",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:lekar",
    "kind": "word",
    "sr": "lekar",
    "ru": "врач",
    "emoji": "👩‍⚕️",
    "img": "1f469-200d-2695-fe0f"
   },
   {
    "id": "w:bolnica",
    "kind": "word",
    "sr": "bolnica",
    "ru": "больница",
    "emoji": "🏥",
    "img": "1f3e5"
   },
   {
    "id": "w:lek",
    "kind": "word",
    "sr": "lek",
    "ru": "лекарство",
    "emoji": "💊",
    "img": "1f48a"
   },
   {
    "id": "w:boleti",
    "kind": "word",
    "sr": "boleti",
    "ru": "болеть",
    "emoji": "🤕",
    "img": "1f915",
    "note": "boli me — у меня болит"
   },
   {
    "id": "w:bolestan",
    "kind": "word",
    "sr": "bolestan",
    "ru": "больной",
    "emoji": "🤒",
    "img": "1f912"
   },
   {
    "id": "p:Boli me glava.",
    "kind": "phrase",
    "sr": "Boli me glava.",
    "ru": "У меня болит голова.",
    "emoji": "🤕",
    "img": "1f915"
   },
   {
    "id": "p:Treba mi lekar.",
    "kind": "phrase",
    "sr": "Treba mi lekar.",
    "ru": "Мне нужен врач.",
    "emoji": "👩‍⚕️",
    "img": "1f469-200d-2695-fe0f"
   }
  ]
 },
 {
  "id": "L32",
  "n": 32,
  "stage": "A1",
  "title": "Погода",
  "cards": [
   {
    "id": "w:sunce",
    "kind": "word",
    "sr": "sunce",
    "ru": "солнце",
    "emoji": "☀️",
    "img": "2600-fe0f"
   },
   {
    "id": "w:kiša",
    "kind": "word",
    "sr": "kiša",
    "ru": "дождь",
    "emoji": "🌧️",
    "img": "1f327-fe0f"
   },
   {
    "id": "w:sneg",
    "kind": "word",
    "sr": "sneg",
    "ru": "снег",
    "emoji": "❄️",
    "img": "2744-fe0f"
   },
   {
    "id": "w:vetar",
    "kind": "word",
    "sr": "vetar",
    "ru": "ветер",
    "emoji": "🌬️",
    "img": "1f32c-fe0f"
   },
   {
    "id": "w:oblak",
    "kind": "word",
    "sr": "oblak",
    "ru": "облако",
    "emoji": "☁️",
    "img": "2601-fe0f"
   },
   {
    "id": "w:toplo",
    "kind": "word",
    "sr": "toplo",
    "ru": "тепло",
    "emoji": "🌡️",
    "img": "1f321-fe0f"
   },
   {
    "id": "w:hladno",
    "kind": "word",
    "sr": "hladno",
    "ru": "холодно",
    "emoji": "🥶",
    "img": "1f976"
   },
   {
    "id": "w:nebo",
    "kind": "word",
    "sr": "nebo",
    "ru": "небо",
    "emoji": "🌌",
    "img": "1f30c"
   }
  ]
 },
 {
  "id": "L33",
  "n": 33,
  "stage": "A1",
  "title": "Цвета и одежда",
  "cards": [
   {
    "id": "w:boja",
    "kind": "word",
    "sr": "boja",
    "ru": "цвет",
    "emoji": "🎨",
    "img": "1f3a8"
   },
   {
    "id": "w:crven",
    "kind": "word",
    "sr": "crven",
    "ru": "красный",
    "emoji": "🔴",
    "img": "1f534"
   },
   {
    "id": "w:plav",
    "kind": "word",
    "sr": "plav",
    "ru": "синий; голубой",
    "emoji": "🔵",
    "img": "1f535"
   },
   {
    "id": "w:zelen",
    "kind": "word",
    "sr": "zelen",
    "ru": "зелёный",
    "emoji": "🟢",
    "img": "1f7e2"
   },
   {
    "id": "w:beo",
    "kind": "word",
    "sr": "beo",
    "ru": "белый",
    "emoji": "⚪",
    "img": "26aa",
    "note": "bela, belo"
   },
   {
    "id": "w:crn",
    "kind": "word",
    "sr": "crn",
    "ru": "чёрный",
    "emoji": "⚫",
    "img": "26ab"
   },
   {
    "id": "w:žut",
    "kind": "word",
    "sr": "žut",
    "ru": "жёлтый",
    "emoji": "🟡",
    "img": "1f7e1"
   },
   {
    "id": "w:majica",
    "kind": "word",
    "sr": "majica",
    "ru": "футболка",
    "emoji": "👕",
    "img": "1f455"
   },
   {
    "id": "w:jakna",
    "kind": "word",
    "sr": "jakna",
    "ru": "куртка",
    "emoji": "🧥",
    "img": "1f9e5"
   },
   {
    "id": "w:cipele",
    "kind": "word",
    "sr": "cipele",
    "ru": "туфли; ботинки",
    "emoji": "👞",
    "img": "1f45e"
   }
  ]
 },
 {
  "id": "L34",
  "n": 34,
  "stage": "A1",
  "title": "Как ты себя чувствуешь?",
  "cards": [
   {
    "id": "w:srećan",
    "kind": "word",
    "sr": "srećan",
    "ru": "счастливый",
    "emoji": "😊",
    "img": "1f60a"
   },
   {
    "id": "w:tužan",
    "kind": "word",
    "sr": "tužan",
    "ru": "грустный",
    "emoji": "😢",
    "img": "1f622"
   },
   {
    "id": "w:umoran",
    "kind": "word",
    "sr": "umoran",
    "ru": "уставший",
    "emoji": "😴",
    "img": "1f634"
   },
   {
    "id": "w:gladan",
    "kind": "word",
    "sr": "gladan",
    "ru": "голодный",
    "emoji": "🍽️",
    "img": "1f37d-fe0f"
   },
   {
    "id": "w:žedan",
    "kind": "word",
    "sr": "žedan",
    "ru": "испытывающий жажду",
    "emoji": "🥤",
    "img": "1f964",
    "note": "Žedan sam — хочу пить"
   },
   {
    "id": "w:ljut",
    "kind": "word",
    "sr": "ljut",
    "ru": "злой; острый",
    "emoji": "😠",
    "img": "1f620",
    "note": "И про еду: острое"
   },
   {
    "id": "w:zauzet",
    "kind": "word",
    "sr": "zauzet",
    "ru": "занятой",
    "emoji": "⏳",
    "img": "23f3"
   },
   {
    "id": "w:slobodan",
    "kind": "word",
    "sr": "slobodan",
    "ru": "свободный",
    "emoji": "🕊️",
    "img": "1f54a-fe0f"
   },
   {
    "id": "w:siguran",
    "kind": "word",
    "sr": "siguran",
    "ru": "уверенный",
    "emoji": "😌",
    "img": "1f60c"
   },
   {
    "id": "p:Nema veze.",
    "kind": "phrase",
    "sr": "Nema veze.",
    "ru": "Ничего страшного.",
    "emoji": "🙂",
    "img": "1f642"
   }
  ]
 },
 {
  "id": "L35",
  "n": 35,
  "stage": "A1",
  "title": "Всегда, иногда, никогда",
  "cards": [
   {
    "id": "w:uvek",
    "kind": "word",
    "sr": "uvek",
    "ru": "всегда",
    "emoji": "♾️",
    "img": "267e-fe0f"
   },
   {
    "id": "w:nikad",
    "kind": "word",
    "sr": "nikad",
    "ru": "никогда",
    "emoji": "🚫",
    "img": "1f6ab"
   },
   {
    "id": "w:ponekad",
    "kind": "word",
    "sr": "ponekad",
    "ru": "иногда",
    "emoji": "🎲",
    "img": "1f3b2"
   },
   {
    "id": "w:često",
    "kind": "word",
    "sr": "često",
    "ru": "часто",
    "emoji": "🔁",
    "img": "1f501"
   },
   {
    "id": "w:retko",
    "kind": "word",
    "sr": "retko",
    "ru": "редко",
    "emoji": "🦄",
    "img": "1f984"
   },
   {
    "id": "w:opet",
    "kind": "word",
    "sr": "opet",
    "ru": "опять",
    "emoji": "🔁",
    "img": "1f501"
   },
   {
    "id": "w:jednom",
    "kind": "word",
    "sr": "jednom",
    "ru": "однажды; один раз",
    "emoji": "1️⃣",
    "img": "0031-fe0f-20e3"
   },
   {
    "id": "w:svaki",
    "kind": "word",
    "sr": "svaki",
    "ru": "каждый",
    "emoji": "🔂",
    "img": "1f502"
   }
  ]
 },
 {
  "id": "L36",
  "n": 36,
  "stage": "A1",
  "title": "Путешествие",
  "cards": [
   {
    "id": "w:aerodrom",
    "kind": "word",
    "sr": "aerodrom",
    "ru": "аэропорт",
    "emoji": "🛫",
    "img": "1f6eb"
   },
   {
    "id": "w:avion",
    "kind": "word",
    "sr": "avion",
    "ru": "самолёт",
    "emoji": "✈️",
    "img": "2708-fe0f"
   },
   {
    "id": "w:voz",
    "kind": "word",
    "sr": "voz",
    "ru": "поезд",
    "emoji": "🚆",
    "img": "1f686"
   },
   {
    "id": "w:hotel",
    "kind": "word",
    "sr": "hotel",
    "ru": "отель",
    "emoji": "🏨",
    "img": "1f3e8"
   },
   {
    "id": "w:pasoš",
    "kind": "word",
    "sr": "pasoš",
    "ru": "паспорт",
    "emoji": "🛂",
    "img": "1f6c2"
   },
   {
    "id": "w:kofer",
    "kind": "word",
    "sr": "kofer",
    "ru": "чемодан",
    "emoji": "🧳",
    "img": "1f9f3"
   },
   {
    "id": "w:rezervacija",
    "kind": "word",
    "sr": "rezervacija",
    "ru": "бронь",
    "emoji": "📑",
    "img": "1f4d1"
   },
   {
    "id": "w:ulaz",
    "kind": "word",
    "sr": "ulaz",
    "ru": "вход",
    "emoji": "🚪",
    "img": "1f6aa"
   },
   {
    "id": "w:izlaz",
    "kind": "word",
    "sr": "izlaz",
    "ru": "выход",
    "emoji": "🏃",
    "img": "1f3c3"
   },
   {
    "id": "w:turista",
    "kind": "word",
    "sr": "turista",
    "ru": "турист",
    "emoji": "📸",
    "img": "1f4f8"
   },
   {
    "id": "p:Imam rezervaciju.",
    "kind": "phrase",
    "sr": "Imam rezervaciju.",
    "ru": "У меня бронь.",
    "emoji": "🏨",
    "img": "1f3e8"
   }
  ]
 },
 {
  "id": "L37",
  "n": 37,
  "stage": "A1",
  "title": "Движение",
  "cards": [
   {
    "id": "w:ući",
    "kind": "word",
    "sr": "ući",
    "ru": "войти",
    "emoji": "➡️",
    "img": "27a1-fe0f",
    "note": "uđem — я войду"
   },
   {
    "id": "w:izaći",
    "kind": "word",
    "sr": "izaći",
    "ru": "выйти",
    "emoji": "⬅️",
    "img": "2b05-fe0f",
    "note": "izađem — я выйду"
   },
   {
    "id": "w:vratiti se",
    "kind": "word",
    "sr": "vratiti se",
    "ru": "вернуться",
    "emoji": "🔙",
    "img": "1f519",
    "note": "vratim se — я вернусь"
   },
   {
    "id": "w:putovati",
    "kind": "word",
    "sr": "putovati",
    "ru": "путешествовать",
    "emoji": "🌍",
    "img": "1f30d",
    "note": "putujem — я путешествую"
   },
   {
    "id": "w:voziti",
    "kind": "word",
    "sr": "voziti",
    "ru": "водить; везти",
    "emoji": "🚗",
    "img": "1f697",
    "note": "vozim — я вожу"
   },
   {
    "id": "w:šetati",
    "kind": "word",
    "sr": "šetati",
    "ru": "гулять",
    "emoji": "🚶",
    "img": "1f6b6",
    "note": "šetam — я гуляю"
   },
   {
    "id": "w:trčati",
    "kind": "word",
    "sr": "trčati",
    "ru": "бегать",
    "emoji": "🏃",
    "img": "1f3c3",
    "note": "trčim — я бегу"
   },
   {
    "id": "w:stići",
    "kind": "word",
    "sr": "stići",
    "ru": "прибыть; успеть",
    "emoji": "🏁",
    "img": "1f3c1",
    "note": "stignem — я прибуду"
   },
   {
    "id": "w:krenuti",
    "kind": "word",
    "sr": "krenuti",
    "ru": "отправиться",
    "emoji": "🚦",
    "img": "1f6a6",
    "note": "krenem — я отправлюсь"
   },
   {
    "id": "w:ostati",
    "kind": "word",
    "sr": "ostati",
    "ru": "остаться",
    "emoji": "⚓",
    "img": "2693",
    "note": "ostanem — я останусь"
   }
  ]
 },
 {
  "id": "L38",
  "n": 38,
  "stage": "A1",
  "title": "Мебель и техника",
  "cards": [
   {
    "id": "w:krevet",
    "kind": "word",
    "sr": "krevet",
    "ru": "кровать",
    "emoji": "🛏️",
    "img": "1f6cf-fe0f"
   },
   {
    "id": "w:stolica",
    "kind": "word",
    "sr": "stolica",
    "ru": "стул",
    "emoji": "🪑",
    "img": "1fa91"
   },
   {
    "id": "w:kauč",
    "kind": "word",
    "sr": "kauč",
    "ru": "диван",
    "emoji": "🛋️",
    "img": "1f6cb-fe0f"
   },
   {
    "id": "w:ormar",
    "kind": "word",
    "sr": "ormar",
    "ru": "шкаф",
    "emoji": "🗄️",
    "img": "1f5c4-fe0f"
   },
   {
    "id": "w:frižider",
    "kind": "word",
    "sr": "frižider",
    "ru": "холодильник",
    "emoji": "🧊",
    "img": "1f9ca"
   },
   {
    "id": "w:šporet",
    "kind": "word",
    "sr": "šporet",
    "ru": "плита",
    "emoji": "🔥",
    "img": "1f525"
   },
   {
    "id": "w:mašina",
    "kind": "word",
    "sr": "mašina",
    "ru": "стиральная машина",
    "emoji": "🫧",
    "img": "1fae7"
   },
   {
    "id": "w:televizor",
    "kind": "word",
    "sr": "televizor",
    "ru": "телевизор",
    "emoji": "📺",
    "img": "1f4fa"
   },
   {
    "id": "w:lampa",
    "kind": "word",
    "sr": "lampa",
    "ru": "лампа",
    "emoji": "💡",
    "img": "1f4a1"
   },
   {
    "id": "w:struja",
    "kind": "word",
    "sr": "struja",
    "ru": "электричество",
    "emoji": "⚡",
    "img": "26a1"
   }
  ]
 },
 {
  "id": "L39",
  "n": 39,
  "stage": "A1",
  "title": "Телефон и интернет",
  "cards": [
   {
    "id": "w:telefon",
    "kind": "word",
    "sr": "telefon",
    "ru": "телефон",
    "emoji": "📱",
    "img": "1f4f1"
   },
   {
    "id": "w:poruka",
    "kind": "word",
    "sr": "poruka",
    "ru": "сообщение",
    "emoji": "💬",
    "img": "1f4ac"
   },
   {
    "id": "w:internet",
    "kind": "word",
    "sr": "internet",
    "ru": "интернет",
    "emoji": "🌐",
    "img": "1f310"
   },
   {
    "id": "w:lozinka",
    "kind": "word",
    "sr": "lozinka",
    "ru": "пароль",
    "emoji": "🔐",
    "img": "1f510"
   },
   {
    "id": "w:aplikacija",
    "kind": "word",
    "sr": "aplikacija",
    "ru": "приложение",
    "emoji": "📲",
    "img": "1f4f2"
   },
   {
    "id": "w:slika",
    "kind": "word",
    "sr": "slika",
    "ru": "фото; картинка",
    "emoji": "🖼️",
    "img": "1f5bc-fe0f"
   },
   {
    "id": "w:zvati",
    "kind": "word",
    "sr": "zvati",
    "ru": "звонить; звать",
    "emoji": "📞",
    "img": "1f4de",
    "note": "zovem — я звоню"
   },
   {
    "id": "w:poslati",
    "kind": "word",
    "sr": "poslati",
    "ru": "отправить",
    "emoji": "📤",
    "img": "1f4e4",
    "note": "pošaljem — я отправлю"
   },
   {
    "id": "w:kompjuter",
    "kind": "word",
    "sr": "kompjuter",
    "ru": "компьютер",
    "emoji": "💻",
    "img": "1f4bb"
   },
   {
    "id": "w:punjač",
    "kind": "word",
    "sr": "punjač",
    "ru": "зарядка",
    "emoji": "🔌",
    "img": "1f50c"
   },
   {
    "id": "p:Koja je šifra za internet?",
    "kind": "phrase",
    "sr": "Koja je šifra za internet?",
    "ru": "Какой пароль от вайфая?",
    "emoji": "📶",
    "img": "1f4f6"
   }
  ]
 },
 {
  "id": "L40",
  "n": 40,
  "stage": "A1",
  "title": "Продукты",
  "cards": [
   {
    "id": "w:krompir",
    "kind": "word",
    "sr": "krompir",
    "ru": "картошка",
    "emoji": "🥔",
    "img": "1f954"
   },
   {
    "id": "w:paradajz",
    "kind": "word",
    "sr": "paradajz",
    "ru": "помидор",
    "emoji": "🍅",
    "img": "1f345"
   },
   {
    "id": "w:luk",
    "kind": "word",
    "sr": "luk",
    "ru": "лук",
    "emoji": "🧅",
    "img": "1f9c5"
   },
   {
    "id": "w:pirinač",
    "kind": "word",
    "sr": "pirinač",
    "ru": "рис",
    "emoji": "🍚",
    "img": "1f35a"
   },
   {
    "id": "w:testenina",
    "kind": "word",
    "sr": "testenina",
    "ru": "макароны",
    "emoji": "🍝",
    "img": "1f35d"
   },
   {
    "id": "w:so",
    "kind": "word",
    "sr": "so",
    "ru": "соль",
    "emoji": "🧂",
    "img": "1f9c2"
   },
   {
    "id": "w:ulje",
    "kind": "word",
    "sr": "ulje",
    "ru": "масло (растительное)",
    "emoji": "🫒",
    "img": "1fad2"
   },
   {
    "id": "w:puter",
    "kind": "word",
    "sr": "puter",
    "ru": "сливочное масло",
    "emoji": "🧈",
    "img": "1f9c8"
   },
   {
    "id": "w:kolač",
    "kind": "word",
    "sr": "kolač",
    "ru": "пирожное; торт",
    "emoji": "🍰",
    "img": "1f370"
   },
   {
    "id": "w:sladoled",
    "kind": "word",
    "sr": "sladoled",
    "ru": "мороженое",
    "emoji": "🍦",
    "img": "1f366"
   }
  ]
 },
 {
  "id": "L41",
  "n": 41,
  "stage": "A1",
  "title": "На кухне",
  "cards": [
   {
    "id": "w:nož",
    "kind": "word",
    "sr": "nož",
    "ru": "нож",
    "emoji": "🔪",
    "img": "1f52a"
   },
   {
    "id": "w:viljuška",
    "kind": "word",
    "sr": "viljuška",
    "ru": "вилка",
    "emoji": "🍴",
    "img": "1f374"
   },
   {
    "id": "w:kašika",
    "kind": "word",
    "sr": "kašika",
    "ru": "ложка",
    "emoji": "🥄",
    "img": "1f944"
   },
   {
    "id": "w:šolja",
    "kind": "word",
    "sr": "šolja",
    "ru": "чашка",
    "emoji": "☕",
    "img": "2615"
   },
   {
    "id": "w:lonac",
    "kind": "word",
    "sr": "lonac",
    "ru": "кастрюля",
    "emoji": "🍲",
    "img": "1f372"
   },
   {
    "id": "w:recept",
    "kind": "word",
    "sr": "recept",
    "ru": "рецепт",
    "emoji": "📖",
    "img": "1f4d6"
   },
   {
    "id": "w:svež",
    "kind": "word",
    "sr": "svež",
    "ru": "свежий",
    "emoji": "🌿",
    "img": "1f33f"
   },
   {
    "id": "w:sladak",
    "kind": "word",
    "sr": "sladak",
    "ru": "сладкий",
    "emoji": "🍯",
    "img": "1f36f"
   },
   {
    "id": "w:slan",
    "kind": "word",
    "sr": "slan",
    "ru": "солёный",
    "emoji": "🥨",
    "img": "1f968"
   },
   {
    "id": "w:kiseo",
    "kind": "word",
    "sr": "kiseo",
    "ru": "кислый",
    "emoji": "🍋",
    "img": "1f34b"
   }
  ]
 },
 {
  "id": "L42",
  "n": 42,
  "stage": "A1",
  "title": "Сразу, скоро, поздно",
  "cards": [
   {
    "id": "w:odmah",
    "kind": "word",
    "sr": "odmah",
    "ru": "сразу",
    "emoji": "⚡",
    "img": "26a1"
   },
   {
    "id": "w:uskoro",
    "kind": "word",
    "sr": "uskoro",
    "ru": "скоро",
    "emoji": "🔜",
    "img": "1f51c"
   },
   {
    "id": "w:kasnije",
    "kind": "word",
    "sr": "kasnije",
    "ru": "позже",
    "emoji": "🕰️",
    "img": "1f570-fe0f"
   },
   {
    "id": "w:rano",
    "kind": "word",
    "sr": "rano",
    "ru": "рано",
    "emoji": "🐓",
    "img": "1f413"
   },
   {
    "id": "w:kasno",
    "kind": "word",
    "sr": "kasno",
    "ru": "поздно",
    "emoji": "🦉",
    "img": "1f989"
   },
   {
    "id": "w:već",
    "kind": "word",
    "sr": "već",
    "ru": "уже",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:onda",
    "kind": "word",
    "sr": "onda",
    "ru": "тогда; потом",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:dok",
    "kind": "word",
    "sr": "dok",
    "ru": "пока",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L43",
  "n": 43,
  "stage": "A1",
  "title": "Думаю, верю, помню",
  "cards": [
   {
    "id": "w:verovati",
    "kind": "word",
    "sr": "verovati",
    "ru": "верить",
    "emoji": "🙏",
    "img": "1f64f",
    "note": "verujem — я верю"
   },
   {
    "id": "w:osećati se",
    "kind": "word",
    "sr": "osećati se",
    "ru": "чувствовать себя",
    "emoji": "🫶",
    "img": "1faf6",
    "note": "osećam se — я чувствую себя"
   },
   {
    "id": "w:zaboraviti",
    "kind": "word",
    "sr": "zaboraviti",
    "ru": "забыть",
    "emoji": "🫥",
    "img": "1fae5",
    "note": "zaboravim — я забуду"
   },
   {
    "id": "w:sećati se",
    "kind": "word",
    "sr": "sećati se",
    "ru": "помнить",
    "emoji": "🧠",
    "img": "1f9e0",
    "note": "sećam se — я помню"
   },
   {
    "id": "w:nadati se",
    "kind": "word",
    "sr": "nadati se",
    "ru": "надеяться",
    "emoji": "🌈",
    "img": "1f308",
    "note": "nadam se — надеюсь"
   },
   {
    "id": "w:smejati se",
    "kind": "word",
    "sr": "smejati se",
    "ru": "смеяться",
    "emoji": "😂",
    "img": "1f602",
    "note": "smejem se — я смеюсь"
   },
   {
    "id": "w:plakati",
    "kind": "word",
    "sr": "plakati",
    "ru": "плакать",
    "emoji": "😭",
    "img": "1f62d",
    "note": "plačem — я плачу"
   },
   {
    "id": "w:brinuti",
    "kind": "word",
    "sr": "brinuti",
    "ru": "волноваться",
    "emoji": "😟",
    "img": "1f61f",
    "note": "Ne brini! — Не волнуйся!"
   },
   {
    "id": "w:mrzeti",
    "kind": "word",
    "sr": "mrzeti",
    "ru": "ненавидеть",
    "emoji": "😤",
    "img": "1f624",
    "note": "mrzim — я ненавижу"
   },
   {
    "id": "w:slagati se",
    "kind": "word",
    "sr": "slagati se",
    "ru": "соглашаться",
    "emoji": "🤝",
    "img": "1f91d",
    "note": "slažem se — согласен"
   },
   {
    "id": "p:Slažem se.",
    "kind": "phrase",
    "sr": "Slažem se.",
    "ru": "Согласен.",
    "emoji": "🤝",
    "img": "1f91d"
   }
  ]
 },
 {
  "id": "L44",
  "n": 44,
  "stage": "A1",
  "title": "Работа: подробнее",
  "cards": [
   {
    "id": "w:plata",
    "kind": "word",
    "sr": "plata",
    "ru": "зарплата",
    "emoji": "💵",
    "img": "1f4b5",
    "note": "⚠️ Не «плата», а зарплата"
   },
   {
    "id": "w:ugovor",
    "kind": "word",
    "sr": "ugovor",
    "ru": "договор",
    "emoji": "📝",
    "img": "1f4dd"
   },
   {
    "id": "w:firma",
    "kind": "word",
    "sr": "firma",
    "ru": "фирма",
    "emoji": "🏢",
    "img": "1f3e2"
   },
   {
    "id": "w:klijent",
    "kind": "word",
    "sr": "klijent",
    "ru": "клиент",
    "emoji": "🤝",
    "img": "1f91d"
   },
   {
    "id": "w:projekat",
    "kind": "word",
    "sr": "projekat",
    "ru": "проект",
    "emoji": "📊",
    "img": "1f4ca"
   },
   {
    "id": "w:rok",
    "kind": "word",
    "sr": "rok",
    "ru": "срок; дедлайн",
    "emoji": "⌛",
    "img": "231b"
   },
   {
    "id": "w:iskustvo",
    "kind": "word",
    "sr": "iskustvo",
    "ru": "опыт",
    "emoji": "🎓",
    "img": "1f393"
   },
   {
    "id": "w:odmor",
    "kind": "word",
    "sr": "odmor",
    "ru": "отпуск; отдых",
    "emoji": "🏖️",
    "img": "1f3d6-fe0f"
   },
   {
    "id": "w:penzija",
    "kind": "word",
    "sr": "penzija",
    "ru": "пенсия",
    "emoji": "🧓",
    "img": "1f9d3"
   },
   {
    "id": "w:intervju",
    "kind": "word",
    "sr": "intervju",
    "ru": "собеседование",
    "emoji": "🎤",
    "img": "1f3a4"
   }
  ]
 },
 {
  "id": "L45",
  "n": 45,
  "stage": "A1",
  "title": "Свободное время",
  "cards": [
   {
    "id": "w:film",
    "kind": "word",
    "sr": "film",
    "ru": "фильм",
    "emoji": "🎬",
    "img": "1f3ac"
   },
   {
    "id": "w:muzika",
    "kind": "word",
    "sr": "muzika",
    "ru": "музыка",
    "emoji": "🎵",
    "img": "1f3b5"
   },
   {
    "id": "w:knjiga",
    "kind": "word",
    "sr": "knjiga",
    "ru": "книга",
    "emoji": "📕",
    "img": "1f4d5"
   },
   {
    "id": "w:sport",
    "kind": "word",
    "sr": "sport",
    "ru": "спорт",
    "emoji": "⚽",
    "img": "26bd"
   },
   {
    "id": "w:utakmica",
    "kind": "word",
    "sr": "utakmica",
    "ru": "матч",
    "emoji": "🏟️",
    "img": "1f3df-fe0f"
   },
   {
    "id": "w:igra",
    "kind": "word",
    "sr": "igra",
    "ru": "игра",
    "emoji": "🎲",
    "img": "1f3b2"
   },
   {
    "id": "w:pesma",
    "kind": "word",
    "sr": "pesma",
    "ru": "песня",
    "emoji": "🎶",
    "img": "1f3b6"
   },
   {
    "id": "w:igrati",
    "kind": "word",
    "sr": "igrati",
    "ru": "играть",
    "emoji": "🎮",
    "img": "1f3ae",
    "note": "igram — я играю"
   },
   {
    "id": "w:plivati",
    "kind": "word",
    "sr": "plivati",
    "ru": "плавать",
    "emoji": "🏊",
    "img": "1f3ca",
    "note": "plivam — я плаваю"
   },
   {
    "id": "w:plesati",
    "kind": "word",
    "sr": "plesati",
    "ru": "танцевать",
    "emoji": "💃",
    "img": "1f483",
    "note": "plešem — я танцую"
   }
  ]
 },
 {
  "id": "L46",
  "n": 46,
  "stage": "A1",
  "title": "Места в городе",
  "cards": [
   {
    "id": "w:banka",
    "kind": "word",
    "sr": "banka",
    "ru": "банк",
    "emoji": "🏦",
    "img": "1f3e6"
   },
   {
    "id": "w:pošta",
    "kind": "word",
    "sr": "pošta",
    "ru": "почта",
    "emoji": "📮",
    "img": "1f4ee"
   },
   {
    "id": "w:policija",
    "kind": "word",
    "sr": "policija",
    "ru": "полиция",
    "emoji": "🚓",
    "img": "1f693"
   },
   {
    "id": "w:opština",
    "kind": "word",
    "sr": "opština",
    "ru": "муниципалитет",
    "emoji": "🏛️",
    "img": "1f3db-fe0f"
   },
   {
    "id": "w:crkva",
    "kind": "word",
    "sr": "crkva",
    "ru": "церковь",
    "emoji": "⛪",
    "img": "26ea"
   },
   {
    "id": "w:park",
    "kind": "word",
    "sr": "park",
    "ru": "парк",
    "emoji": "🌳",
    "img": "1f333"
   },
   {
    "id": "w:muzej",
    "kind": "word",
    "sr": "muzej",
    "ru": "музей",
    "emoji": "🖼️",
    "img": "1f5bc-fe0f"
   },
   {
    "id": "w:pozorište",
    "kind": "word",
    "sr": "pozorište",
    "ru": "театр",
    "emoji": "🎭",
    "img": "1f3ad",
    "note": "⚠️ Не «позор», а театр"
   },
   {
    "id": "w:bioskop",
    "kind": "word",
    "sr": "bioskop",
    "ru": "кинотеатр",
    "emoji": "🍿",
    "img": "1f37f"
   },
   {
    "id": "w:biblioteka",
    "kind": "word",
    "sr": "biblioteka",
    "ru": "библиотека",
    "emoji": "📚",
    "img": "1f4da"
   }
  ]
 },
 {
  "id": "L47",
  "n": 47,
  "stage": "A1",
  "title": "Документы",
  "cards": [
   {
    "id": "w:dokument",
    "kind": "word",
    "sr": "dokument",
    "ru": "документ",
    "emoji": "📄",
    "img": "1f4c4"
   },
   {
    "id": "w:papir",
    "kind": "word",
    "sr": "papir",
    "ru": "бумага",
    "emoji": "📃",
    "img": "1f4c3"
   },
   {
    "id": "w:potpis",
    "kind": "word",
    "sr": "potpis",
    "ru": "подпись",
    "emoji": "✍️",
    "img": "270d-fe0f"
   },
   {
    "id": "w:viza",
    "kind": "word",
    "sr": "viza",
    "ru": "виза",
    "emoji": "🛂",
    "img": "1f6c2"
   },
   {
    "id": "w:boravak",
    "kind": "word",
    "sr": "boravak",
    "ru": "вид на жительство",
    "emoji": "🪪",
    "img": "1faaa",
    "note": "Дословно «пребывание»"
   },
   {
    "id": "w:zahtev",
    "kind": "word",
    "sr": "zahtev",
    "ru": "заявление; запрос",
    "emoji": "📨",
    "img": "1f4e8"
   },
   {
    "id": "w:šalter",
    "kind": "word",
    "sr": "šalter",
    "ru": "окошко (в учреждении)",
    "emoji": "🪟",
    "img": "1fa9f"
   },
   {
    "id": "w:red",
    "kind": "word",
    "sr": "red",
    "ru": "очередь; порядок",
    "emoji": "🧍",
    "img": "1f9cd"
   },
   {
    "id": "w:formular",
    "kind": "word",
    "sr": "formular",
    "ru": "бланк",
    "emoji": "📋",
    "img": "1f4cb"
   },
   {
    "id": "w:pečat",
    "kind": "word",
    "sr": "pečat",
    "ru": "печать",
    "emoji": "🔏",
    "img": "1f50f"
   },
   {
    "id": "p:Ko je poslednji u redu?",
    "kind": "phrase",
    "sr": "Ko je poslednji u redu?",
    "ru": "Кто последний в очереди?",
    "emoji": "🧍",
    "img": "1f9cd"
   }
  ]
 },
 {
  "id": "L48",
  "n": 48,
  "stage": "A1",
  "title": "Через, против, вместо",
  "cards": [
   {
    "id": "w:posle",
    "kind": "word",
    "sr": "posle",
    "ru": "после",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:pre",
    "kind": "word",
    "sr": "pre",
    "ru": "до; перед (по времени)",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:preko",
    "kind": "word",
    "sr": "preko",
    "ru": "через; напротив",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:kroz",
    "kind": "word",
    "sr": "kroz",
    "ru": "сквозь; через",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:protiv",
    "kind": "word",
    "sr": "protiv",
    "ru": "против",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:umesto",
    "kind": "word",
    "sr": "umesto",
    "ru": "вместо",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L49",
  "n": 49,
  "stage": "A1",
  "title": "Лёгкий, тяжёлый, чистый",
  "cards": [
   {
    "id": "w:lak",
    "kind": "word",
    "sr": "lak",
    "ru": "лёгкий",
    "emoji": "🪶",
    "img": "1fab6"
   },
   {
    "id": "w:težak",
    "kind": "word",
    "sr": "težak",
    "ru": "тяжёлый; трудный",
    "emoji": "🏋️",
    "img": "1f3cb-fe0f"
   },
   {
    "id": "w:brz",
    "kind": "word",
    "sr": "brz",
    "ru": "быстрый",
    "emoji": "🐆",
    "img": "1f406"
   },
   {
    "id": "w:spor",
    "kind": "word",
    "sr": "spor",
    "ru": "медленный",
    "emoji": "🐌",
    "img": "1f40c"
   },
   {
    "id": "w:pun",
    "kind": "word",
    "sr": "pun",
    "ru": "полный",
    "emoji": "🔋",
    "img": "1f50b"
   },
   {
    "id": "w:prazan",
    "kind": "word",
    "sr": "prazan",
    "ru": "пустой",
    "emoji": "🪫",
    "img": "1faab"
   },
   {
    "id": "w:čist",
    "kind": "word",
    "sr": "čist",
    "ru": "чистый",
    "emoji": "✨",
    "img": "2728"
   },
   {
    "id": "w:prljav",
    "kind": "word",
    "sr": "prljav",
    "ru": "грязный",
    "emoji": "🧽",
    "img": "1f9fd"
   }
  ]
 },
 {
  "id": "L50",
  "n": 50,
  "stage": "A1",
  "title": "Открыть, взять, начать",
  "cards": [
   {
    "id": "w:otvoriti",
    "kind": "word",
    "sr": "otvoriti",
    "ru": "открыть",
    "emoji": "📂",
    "img": "1f4c2",
    "note": "otvorim — я открою"
   },
   {
    "id": "w:zatvoriti",
    "kind": "word",
    "sr": "zatvoriti",
    "ru": "закрыть",
    "emoji": "📁",
    "img": "1f4c1",
    "note": "zatvorim — я закрою"
   },
   {
    "id": "w:uzeti",
    "kind": "word",
    "sr": "uzeti",
    "ru": "взять",
    "emoji": "🤲",
    "img": "1f932",
    "note": "uzmem — я возьму"
   },
   {
    "id": "w:staviti",
    "kind": "word",
    "sr": "staviti",
    "ru": "положить; поставить",
    "emoji": "📥",
    "img": "1f4e5",
    "note": "stavim — я положу"
   },
   {
    "id": "w:doneti",
    "kind": "word",
    "sr": "doneti",
    "ru": "принести",
    "emoji": "🎁",
    "img": "1f381",
    "note": "donesem — я принесу"
   },
   {
    "id": "w:nositi",
    "kind": "word",
    "sr": "nositi",
    "ru": "нести; носить",
    "emoji": "🎒",
    "img": "1f392",
    "note": "nosim — я несу"
   },
   {
    "id": "w:prodati",
    "kind": "word",
    "sr": "prodati",
    "ru": "продать",
    "emoji": "🏷️",
    "img": "1f3f7-fe0f",
    "note": "prodam — я продам"
   },
   {
    "id": "w:početi",
    "kind": "word",
    "sr": "početi",
    "ru": "начать",
    "emoji": "▶️",
    "img": "25b6-fe0f",
    "note": "počnem — я начну"
   },
   {
    "id": "w:završiti",
    "kind": "word",
    "sr": "završiti",
    "ru": "закончить",
    "emoji": "🏁",
    "img": "1f3c1",
    "note": "završim — я закончу"
   },
   {
    "id": "w:probati",
    "kind": "word",
    "sr": "probati",
    "ru": "попробовать",
    "emoji": "🥄",
    "img": "1f944",
    "note": "probam — я попробую"
   }
  ]
 },
 {
  "id": "L51",
  "n": 51,
  "stage": "A1",
  "title": "Быстро, тихо, вместе",
  "cards": [
   {
    "id": "w:zajedno",
    "kind": "word",
    "sr": "zajedno",
    "ru": "вместе",
    "emoji": "🫂",
    "img": "1fac2"
   },
   {
    "id": "w:brzo",
    "kind": "word",
    "sr": "brzo",
    "ru": "быстро",
    "emoji": "⚡",
    "img": "26a1"
   },
   {
    "id": "w:sporo",
    "kind": "word",
    "sr": "sporo",
    "ru": "медленно",
    "emoji": "🐢",
    "img": "1f422"
   },
   {
    "id": "w:glasno",
    "kind": "word",
    "sr": "glasno",
    "ru": "громко",
    "emoji": "📢",
    "img": "1f4e2"
   },
   {
    "id": "w:tiho",
    "kind": "word",
    "sr": "tiho",
    "ru": "тихо",
    "emoji": "🤫",
    "img": "1f92b"
   },
   {
    "id": "w:blizu",
    "kind": "word",
    "sr": "blizu",
    "ru": "близко",
    "emoji": "📍",
    "img": "1f4cd"
   },
   {
    "id": "w:daleko",
    "kind": "word",
    "sr": "daleko",
    "ru": "далеко",
    "emoji": "🗺️",
    "img": "1f5fa-fe0f"
   }
  ]
 },
 {
  "id": "L52",
  "n": 52,
  "stage": "A1",
  "title": "Важные слова",
  "cards": [
   {
    "id": "w:život",
    "kind": "word",
    "sr": "život",
    "ru": "жизнь",
    "emoji": "🌱",
    "img": "1f331"
   },
   {
    "id": "w:svet",
    "kind": "word",
    "sr": "svet",
    "ru": "мир; свет",
    "emoji": "🌍",
    "img": "1f30d"
   },
   {
    "id": "w:ljubav",
    "kind": "word",
    "sr": "ljubav",
    "ru": "любовь",
    "emoji": "💕",
    "img": "1f495"
   },
   {
    "id": "w:zdravlje",
    "kind": "word",
    "sr": "zdravlje",
    "ru": "здоровье",
    "emoji": "🍏",
    "img": "1f34f"
   },
   {
    "id": "w:sreća",
    "kind": "word",
    "sr": "sreća",
    "ru": "счастье; удача",
    "emoji": "🍀",
    "img": "1f340"
   },
   {
    "id": "w:problem",
    "kind": "word",
    "sr": "problem",
    "ru": "проблема",
    "emoji": "🧩",
    "img": "1f9e9"
   },
   {
    "id": "w:ideja",
    "kind": "word",
    "sr": "ideja",
    "ru": "идея",
    "emoji": "💡",
    "img": "1f4a1"
   },
   {
    "id": "w:istina",
    "kind": "word",
    "sr": "istina",
    "ru": "правда",
    "emoji": "✅",
    "img": "2705"
   },
   {
    "id": "w:razlog",
    "kind": "word",
    "sr": "razlog",
    "ru": "причина",
    "emoji": "🔍",
    "img": "1f50d"
   },
   {
    "id": "w:prilika",
    "kind": "word",
    "sr": "prilika",
    "ru": "возможность; шанс",
    "emoji": "🎟️",
    "img": "1f39f-fe0f"
   }
  ]
 },
 {
  "id": "L53",
  "n": 53,
  "stage": "A1",
  "title": "Только, тоже, именно",
  "cards": [
   {
    "id": "w:samo",
    "kind": "word",
    "sr": "samo",
    "ru": "только",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:takođe",
    "kind": "word",
    "sr": "takođe",
    "ru": "тоже; также",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:baš",
    "kind": "word",
    "sr": "baš",
    "ru": "именно; прям",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:pa",
    "kind": "word",
    "sr": "pa",
    "ru": "потом; ну",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:skoro",
    "kind": "word",
    "sr": "skoro",
    "ru": "почти; недавно",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:tačno",
    "kind": "word",
    "sr": "tačno",
    "ru": "точно; верно",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:otprilike",
    "kind": "word",
    "sr": "otprilike",
    "ru": "примерно",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:sigurno",
    "kind": "word",
    "sr": "sigurno",
    "ru": "наверняка; точно",
    "emoji": null,
    "img": null
   },
   {
    "id": "w:posebno",
    "kind": "word",
    "sr": "posebno",
    "ru": "особенно",
    "emoji": null,
    "img": null
   }
  ]
 },
 {
  "id": "L54",
  "n": 54,
  "stage": "A1",
  "title": "Природа и животные",
  "cards": [
   {
    "id": "w:pas",
    "kind": "word",
    "sr": "pas",
    "ru": "собака",
    "emoji": "🐕",
    "img": "1f415"
   },
   {
    "id": "w:mačka",
    "kind": "word",
    "sr": "mačka",
    "ru": "кошка",
    "emoji": "🐈",
    "img": "1f408"
   },
   {
    "id": "w:ptica",
    "kind": "word",
    "sr": "ptica",
    "ru": "птица",
    "emoji": "🐦",
    "img": "1f426"
   },
   {
    "id": "w:drvo",
    "kind": "word",
    "sr": "drvo",
    "ru": "дерево",
    "emoji": "🌳",
    "img": "1f333"
   },
   {
    "id": "w:cvet",
    "kind": "word",
    "sr": "cvet",
    "ru": "цветок",
    "emoji": "🌼",
    "img": "1f33c"
   },
   {
    "id": "w:šuma",
    "kind": "word",
    "sr": "šuma",
    "ru": "лес",
    "emoji": "🌲",
    "img": "1f332"
   },
   {
    "id": "w:zemlja",
    "kind": "word",
    "sr": "zemlja",
    "ru": "земля; страна",
    "emoji": "🌎",
    "img": "1f30e"
   },
   {
    "id": "w:jezero",
    "kind": "word",
    "sr": "jezero",
    "ru": "озеро",
    "emoji": "🏞️",
    "img": "1f3de-fe0f"
   },
   {
    "id": "w:more",
    "kind": "word",
    "sr": "more",
    "ru": "море",
    "emoji": "🌊",
    "img": "1f30a"
   },
   {
    "id": "w:reka",
    "kind": "word",
    "sr": "reka",
    "ru": "река",
    "emoji": "🏞️",
    "img": "1f3de-fe0f"
   },
   {
    "id": "w:planina",
    "kind": "word",
    "sr": "planina",
    "ru": "гора",
    "emoji": "⛰️",
    "img": "26f0-fe0f"
   },
   {
    "id": "w:selo",
    "kind": "word",
    "sr": "selo",
    "ru": "деревня; село",
    "emoji": "🏡",
    "img": "1f3e1"
   }
  ]
 },
 {
  "id": "L55",
  "n": 55,
  "stage": "A1",
  "title": "Праздники",
  "cards": [
   {
    "id": "w:praznik",
    "kind": "word",
    "sr": "praznik",
    "ru": "праздник",
    "emoji": "🎉",
    "img": "1f389"
   },
   {
    "id": "w:slava",
    "kind": "word",
    "sr": "slava",
    "ru": "слава (семейный праздник)",
    "emoji": "🕯️",
    "img": "1f56f-fe0f",
    "note": "День святого-покровителя семьи"
   },
   {
    "id": "w:Božić",
    "kind": "word",
    "sr": "Božić",
    "ru": "Рождество",
    "emoji": "🎄",
    "img": "1f384"
   },
   {
    "id": "w:Uskrs",
    "kind": "word",
    "sr": "Uskrs",
    "ru": "Пасха",
    "emoji": "🥚",
    "img": "1f95a"
   },
   {
    "id": "w:rođendan",
    "kind": "word",
    "sr": "rođendan",
    "ru": "день рождения",
    "emoji": "🎂",
    "img": "1f382"
   },
   {
    "id": "w:poklon",
    "kind": "word",
    "sr": "poklon",
    "ru": "подарок",
    "emoji": "🎁",
    "img": "1f381"
   },
   {
    "id": "w:gost",
    "kind": "word",
    "sr": "gost",
    "ru": "гость",
    "emoji": "🧳",
    "img": "1f9f3"
   },
   {
    "id": "w:žurka",
    "kind": "word",
    "sr": "žurka",
    "ru": "вечеринка",
    "emoji": "🪩",
    "img": "1faa9"
   },
   {
    "id": "w:čestitati",
    "kind": "word",
    "sr": "čestitati",
    "ru": "поздравлять",
    "emoji": "💐",
    "img": "1f490",
    "note": "čestitam — поздравляю"
   },
   {
    "id": "w:slaviti",
    "kind": "word",
    "sr": "slaviti",
    "ru": "праздновать",
    "emoji": "🥳",
    "img": "1f973",
    "note": "slavim — я праздную"
   },
   {
    "id": "p:Živeli!",
    "kind": "phrase",
    "sr": "Živeli!",
    "ru": "Будем здоровы! (тост)",
    "emoji": "🥂",
    "img": "1f942"
   },
   {
    "id": "p:Srećan rođendan!",
    "kind": "phrase",
    "sr": "Srećan rođendan!",
    "ru": "С днём рождения!",
    "emoji": "🎂",
    "img": "1f382"
   }
  ]
 }
];
export const CARDS = Object.fromEntries(LEVELS.flatMap((l) => l.cards.map((c) => [c.id, { ...c, level: l.id }])));
export const LEVEL = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
