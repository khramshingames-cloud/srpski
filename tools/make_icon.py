"""Рисует иконку приложения: милое облачко-реплика с личиком на тёплом фоне.

    python tools/make_icon.py  ->  icons/icon-512.png, icon-192.png, icon-180.png

Рисуем в 2048px и уменьшаем — так края гладкие. Всё важное внутри центральных 80%,
чтобы Android-маска (круг/скруглённый квадрат) ничего не обрезала.
"""
import math
import pathlib

from PIL import Image, ImageDraw, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
S = 2048


def hexc(h, a=255):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


def gradient(top, bottom):
    img = Image.new('RGBA', (S, S))
    d = ImageDraw.Draw(img)
    t, b = hexc(top), hexc(bottom)
    for y in range(S):
        k = y / (S - 1)
        d.line([(0, y), (S, y)], fill=tuple(round(t[i] + (b[i] - t[i]) * k) for i in range(4)))
    return img


def heart(d, cx, cy, size, fill):
    r = size * 0.3
    d.ellipse([cx - size * 0.5, cy - size * 0.35, cx - size * 0.5 + 2 * r, cy - size * 0.35 + 2 * r], fill=fill)
    d.ellipse([cx + size * 0.5 - 2 * r, cy - size * 0.35, cx + size * 0.5, cy - size * 0.35 + 2 * r], fill=fill)
    d.polygon([(cx - size * 0.49, cy - size * 0.02), (cx + size * 0.49, cy - size * 0.02), (cx, cy + size * 0.5)], fill=fill)


def sparkle(d, cx, cy, r, fill):
    pts = []
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rr = r if i % 2 == 0 else r * 0.32
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


bg = gradient('#FBE0CF', '#F7F0E6')
img = Image.new('RGBA', (S, S), hexc('#FFFFFF', 0))  # рисунок отдельно от фона

# мягкое пятно света за облачком
glow = Image.new('RGBA', (S, S), hexc('#FFFFFF', 0))
ImageDraw.Draw(glow).ellipse([S * .18, S * .16, S * .86, S * .84], fill=hexc('#FFFFFF', 120))
img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(S * .06)))

# облачко-реплика
x0, y0, x1, y1 = S * .2, S * .25, S * .8, S * .7
rad = S * .19
tail = [(S * .3, y1 - S * .08), (S * .44, y1 - S * .02), (S * .25, S * .81)]

shadow = Image.new('RGBA', (S, S), hexc('#C98F6E', 0))
sd = ImageDraw.Draw(shadow)
sd.rounded_rectangle([x0 + S * .02, y0 + S * .04, x1 - S * .02, y1 + S * .03], rad, fill=hexc('#C98F6E', 55))
sd.polygon([(x, y + S * .025) for x, y in tail], fill=hexc('#C98F6E', 55))
img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(S * .022)))

d = ImageDraw.Draw(img)
bubble = hexc('#7FB49E')
d.rounded_rectangle([x0, y0, x1, y1], rad, fill=bubble)
d.polygon(tail, fill=bubble)
# блик сверху
hl = Image.new('RGBA', (S, S), hexc('#FFFFFF', 0))
hd = ImageDraw.Draw(hl)
hd.ellipse([x0 + S * .07, y0 + S * .05, x0 + S * .17, y0 + S * .1], fill=hexc('#FFFFFF', 95))
hd.ellipse([x0 + S * .195, y0 + S * .055, x0 + S * .225, y0 + S * .085], fill=hexc('#FFFFFF', 95))
img.alpha_composite(hl.filter(ImageFilter.GaussianBlur(S * .004)))
d = ImageDraw.Draw(img)

# личико
ink = hexc('#3A332D')
ey, ew, eh = S * .445, S * .052, S * .066
for ex in (S * .395, S * .605):
    d.ellipse([ex - ew / 2, ey - eh / 2, ex + ew / 2, ey + eh / 2], fill=ink)
    d.ellipse([ex - ew * .05, ey - eh * .38, ex + ew * .3, ey - eh * .05], fill=hexc('#FFFFFF'))
# щёчки
blush = Image.new('RGBA', (S, S), hexc('#F4A39A', 0))
bd = ImageDraw.Draw(blush)
for bx in (S * .33, S * .67):
    bd.ellipse([bx - S * .05, S * .5 - S * .025, bx + S * .05, S * .5 + S * .025], fill=hexc('#F4A39A', 200))
img.alpha_composite(blush.filter(ImageFilter.GaussianBlur(S * .006)))
d = ImageDraw.Draw(img)
# улыбка
d.arc([S * .455, S * .455, S * .545, S * .535], 20, 160, fill=ink, width=int(S * .016))

# сердечко и искорки
heart(d, S * .79, S * .21, S * .13, hexc('#E8866A'))
sparkle(d, S * .19, S * .2, S * .045, hexc('#E7B44F'))
sparkle(d, S * .84, S * .62, S * .03, hexc('#E7B44F'))

def compose(scale):
    full = bg.copy()
    art = img if scale == 1 else img.resize((round(S * scale),) * 2, Image.LANCZOS)
    off = (S - art.width) // 2
    full.alpha_composite(art, (off, off))
    return full.convert('RGB')


out = ROOT / 'icons'
regular = compose(1)
for size in (512, 192, 180):
    regular.resize((size, size), Image.LANCZOS).save(out / f'icon-{size}.png', optimize=True)
# Android обрезает иконку кругом или «каплей»: рисунок уменьшаем в безопасную зону
compose(0.8).resize((512, 512), Image.LANCZOS).save(out / 'icon-maskable-512.png', optimize=True)
print('ok')
