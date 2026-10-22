"""Генерирует mp3 для всех слов, фраз и примеров нейро-голосами Microsoft (edge-tts).

    pip install edge-tts
    python tools/gen_audio.py            # только недостающие файлы
    python tools/gen_audio.py --force dobar_dan jabuka   # перегенерировать конкретные

Результат: audio/f/<key>.mp3 (Sophie), audio/m/<key>.mp3 (Nicholas), audio/list.json.
"""
import asyncio
import json
import pathlib
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
VOICES = {'f': 'sr-RS-SophieNeural', 'm': 'sr-RS-NicholasNeural'}
RATE = '-10%'  # чуть медленнее — для учащихся

LAT2CYR_DI = {'lj': 'љ', 'nj': 'њ', 'dž': 'џ'}
LAT2CYR = dict(zip('abcčćdđefghijklmnoprsštuvzž', 'абцчћдђефгхијклмнопрсштувзж'))


def to_cyr(text: str) -> str:
    # Сербские голоса надёжнее читают кириллицу
    out, i = [], 0
    while i < len(text):
        two = text[i:i + 2]
        if two.lower() in LAT2CYR_DI:
            c = LAT2CYR_DI[two.lower()]
            out.append(c.upper() if two[0].isupper() else c)
            i += 2
            continue
        ch = text[i]
        c = LAT2CYR.get(ch.lower())
        out.append((c.upper() if ch.isupper() else c) if c else ch)
        i += 1
    return ''.join(out)


async def main():
    force = set(sys.argv[2:]) if len(sys.argv) > 1 and sys.argv[1] == '--force' else set()
    texts = json.loads(subprocess.check_output(['node', str(ROOT / 'tools' / 'texts.mjs')], text=True, encoding='utf-8'))
    sem = asyncio.Semaphore(8)
    made = 0

    async def one(folder, voice, key, text):
        nonlocal made
        path = ROOT / 'audio' / folder / f'{key}.mp3'
        if path.exists() and key not in force:
            return
        path.parent.mkdir(parents=True, exist_ok=True)
        async with sem:
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(to_cyr(text), voice, rate=RATE).save(str(path))
                    made += 1
                    return
                except Exception as e:  # сеть иногда отваливается
                    if attempt == 2:
                        print('FAIL', key, e)
                    await asyncio.sleep(1)

    await asyncio.gather(*(one(f, v, k, t) for f, v in VOICES.items() for k, t in texts.items()))
    (ROOT / 'audio' / 'list.json').write_text(json.dumps(sorted(texts)), encoding='utf-8')
    print(f'texts: {len(texts)}, generated now: {made}')


asyncio.run(main())
