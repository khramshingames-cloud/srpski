// Печатает JSON { key: текст } со всем, что приложение озвучивает.
// Используется в gen_audio.py.
import { LEVELS } from '../js/levels.js';
import { audioKey } from '../js/translit.js';

const EXTRA = ['Dobar dan, kako si?']; // кнопка проверки голоса в настройках

const out = {};
for (const t of [...LEVELS.flatMap((L) => L.cards.map((c) => c.sr)), ...EXTRA]) out[audioKey(t)] ||= t;
console.log(JSON.stringify(out));
