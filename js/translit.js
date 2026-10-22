// Латиница <-> кириллица. Сербская азбука однозначна (кроме редких слов вроде «nadživeti»).

const DIGRAPHS = { lj: 'љ', nj: 'њ', 'dž': 'џ' };
const SINGLE = {
  a: 'а', b: 'б', c: 'ц', 'č': 'ч', 'ć': 'ћ', d: 'д', 'đ': 'ђ', e: 'е', f: 'ф', g: 'г', h: 'х',
  i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', 'š': 'ш',
  t: 'т', u: 'у', v: 'в', z: 'з', 'ž': 'ж',
};
const TO_LAT = {};
for (const [k, v] of Object.entries({ ...SINGLE, ...DIGRAPHS })) TO_LAT[v] = k;

const upperFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Разбивает слово на буквы сербской азбуки: «ljubav» -> [lj, u, b, a, v]
export function letters(word) {
  const out = [];
  for (let i = 0; i < word.length; i++) {
    const two = word.slice(i, i + 2);
    if (DIGRAPHS[two.toLowerCase()]) { out.push(two); i++; } else out.push(word[i]);
  }
  return out;
}

export function toCyr(text) {
  return letters(text).map((ch) => {
    const low = ch.toLowerCase();
    const c = DIGRAPHS[low] || SINGLE[low];
    if (!c) return ch;
    return ch[0] !== ch[0].toLowerCase() ? c.toUpperCase() : c;
  }).join('');
}

export function toLat(text) {
  return [...text].map((ch) => {
    const low = ch.toLowerCase();
    const l = TO_LAT[low];
    if (!l) return ch;
    return ch !== low ? upperFirst(l) : l;
  }).join('');
}

// Для сравнения ответов: латиница, нижний регистр, без знаков препинания
export function norm(text) {
  return toLat(text).toLowerCase().replace(/[.,!?¿¡;:"«»—-]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Имя аудиофайла для текста: «Dobar dan!» -> dobar_dan, «čaj» -> chaj
export function audioKey(text) {
  return toLat(text).toLowerCase()
    .replace(/dž/g, 'dzh').replace(/č/g, 'ch').replace(/ć/g, 'cj').replace(/š/g, 'sh').replace(/ž/g, 'zh').replace(/đ/g, 'dj')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function stripDiacritics(text) {
  return text.replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj');
}
