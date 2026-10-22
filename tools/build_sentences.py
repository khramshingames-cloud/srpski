"""Собирает примеры-предложения для режима Насти из tools/sentences/*.json в js/sentences.js.

    python tools/build_sentences.py

Каждый элемент: {"w": слово, "sr": фраза, "ru": перевод, "form": как слово стоит во фразе}.
Проверяет, что form действительно есть во фразе и что все слова курса покрыты.
"""
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = sorted((ROOT / 'tools' / 'sentences').glob('*.json'))
words = json.loads(subprocess.check_output(
    ['node', '--input-type=module', '-e',
     "const m = await import('./js/data.js'); console.log(JSON.stringify(Object.values(m.ITEMS).filter(i => i.kind === 'word').map(i => i.sr)))"],
    cwd=ROOT, text=True, encoding='utf-8'))

out, problems = {}, []
for f in src:
    for e in json.loads(f.read_text(encoding='utf-8')):
        w, sr, ru, form = e['w'], e['sr'].strip(), e['ru'].strip(), e['form']
        if form not in sr:
            problems.append(f'{f.name}: «{form}» не найдено в «{sr}»')
            continue
        if w in out:
            problems.append(f'{f.name}: «{w}» встречается дважды')
        out[w] = {'sr': sr, 'ru': ru, 'form': form}

missing = [w for w in words if w not in out]
extra = [w for w in out if w not in words]
sents = [v['sr'] for v in out.values()]
dups = {s for s in sents if sents.count(s) > 1}

lines = ['// Примеры-предложения для режима Насти: каждое слово курса внутри живой фразы.',
         '// Генерируется tools/build_sentences.py из tools/sentences/*.json — правьте JSON, не этот файл.',
         'export const EXAMPLES = {']
for w in words:
    if w in out:
        lines.append(f'  {json.dumps(w, ensure_ascii=False)}: {json.dumps(out[w], ensure_ascii=False)},')
lines.append('};')
(ROOT / 'js' / 'sentences.js').write_text('\n'.join(lines) + '\n', encoding='utf-8')

print(f'sentences: {len(out)} / {len(words)} words')
for p in problems:
    print('PROBLEM', p)
if missing:
    print('MISSING', ', '.join(missing))
if extra:
    print('NOT IN COURSE', ', '.join(extra))
if dups:
    print('DUPLICATE SENTENCES', ' | '.join(dups))
