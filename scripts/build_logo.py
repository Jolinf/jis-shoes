"""Rebuild the JIS SHOES NG logo as clean SVG from the client's Instagram profile image.

Source: assets/brand/instagram-avatar-1080.jpg (gold logo over an orange-tinted photo).
- Mark ("jis" script + shoe-sole print): colour-keyed from the image and traced with potrace.
- "SHOES.NG" and "......energized in style": set in Montserrat Bold/SemiBold Italic outlines
  (closest match; the original font is unconfirmed) and fitted to the measured positions.
Outputs public/brand/logo.svg (full), public/brand/mark.svg (mark only) and favicons.
Run: python scripts/build_logo.py   (needs: pillow, potracer, fonttools; Montserrat from scripts/_logo/node_modules)
"""
from pathlib import Path

import potrace
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "brand" / "instagram-avatar-1080.jpg"
FONTS = ROOT / "scripts" / "_logo" / "node_modules" / "@fontsource" / "montserrat" / "files"
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)
GOLD = "#F8B20F"  # sampled average of logo pixels (248,178,15); estimate from a JPEG
UP = 4  # trace at 4x for smooth curves

# 1. Colour-key the logo
im = Image.open(SRC).convert("RGB")
mask = Image.new("L", im.size, 0)
P, M = im.load(), mask.load()
for y in range(im.height):
    for x in range(im.width):
        r, g, b = P[x, y]
        d = ((r - 248) ** 2 * 0.5 + (g - 178) ** 2 + (b - 15) ** 2 * 0.6) ** 0.5
        M[x, y] = 255 if d < 70 else 0 if d > 110 else int(255 * (110 - d) / 40)

# 2. Find the three bands: mark, SHOES.NG, tagline (row profile inside the logo bbox)
bin_mask = mask.point(lambda v: 255 if v > 128 else 0)
x0, y0, x1, y1 = bin_mask.getbbox()
rows = [sum(1 for x in range(x0, x1) if bin_mask.getpixel((x, y))) for y in range(y0, y1 + 1)]
bands, start = [], None
for i, c in enumerate(rows):
    if c and start is None:
        start = i
    if not c and start is not None:
        if i - start > 2:
            bands.append((y0 + start, y0 + i))
        start = None
if start is not None:
    bands.append((y0 + start, y1))
mark_band, shoes_band, tag_band = bands[0], bands[-2], bands[-1]
# merge any gaps inside the mark (the i-dots, sole parts) into one band
mark_band = (bands[0][0], bands[-3][1])
print("bands", bands, "->", mark_band, shoes_band, tag_band)


def hbox(band):
    cols = [x for x in range(x0, x1 + 1) if any(bin_mask.getpixel((x, y)) for y in range(*band))]
    return min(cols), band[0], max(cols) + 1, band[1]


mb, sb, tb = hbox(mark_band), hbox(shoes_band), hbox(tag_band)
print("mark", mb, "shoes", sb, "tag", tb)

# 3. Trace the mark
crop = mask.crop((mb[0] - 4, mb[1] - 4, mb[2] + 4, mb[3] + 4))
big = crop.resize((crop.width * UP, crop.height * UP), Image.LANCZOS).filter(ImageFilter.GaussianBlur(UP * 0.6))
# potrace traces dark pixels, so the logo goes in black on white
bitmap = potrace.Bitmap(Image.eval(big, lambda v: 0 if v > 128 else 255).convert("1"))
plist = bitmap.trace(turdsize=8 * UP, alphamax=1.0, opticurve=True, opttolerance=0.2)
ox, oy = mb[0] - 4, mb[1] - 4


def pt(p):
    return f"{ox + p.x / UP:.2f},{oy + p.y / UP:.2f}"


mark_d = []
for curve in plist:
    seg = [f"M{pt(curve.start_point)}"]
    for s in curve.segments:
        if s.is_corner:
            seg.append(f"L{pt(s.c)}L{pt(s.end_point)}")
        else:
            seg.append(f"C{pt(s.c1)} {pt(s.c2)} {pt(s.end_point)}")
    mark_d.append("".join(seg) + "Z")
mark_path = "".join(mark_d)


# 4. Text as outlines fitted to the measured boxes
def text_path(text, font_file, box, track=False):
    font = TTFont(str(FONTS / font_file))
    gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    upm = font["head"].unitsPerEm
    # measure ink bounds at unit scale
    from fontTools.pens.boundsPen import BoundsPen
    xs, xmin, xmax, ymin, ymax = 0, None, None, None, None
    for ch in text:
        g = cmap[ord(ch)]
        bp = BoundsPen(gs)
        gs[g].draw(TransformPen(bp, (1, 0, 0, 1, xs, 0)))
        if bp.bounds:
            a, b, c, d = bp.bounds
            xmin = a if xmin is None else min(xmin, a)
            xmax = c if xmax is None else max(xmax, c)
            ymin = b if ymin is None else min(ymin, b)
            ymax = d if ymax is None else max(ymax, d)
        xs += hmtx[g][0]
    bw, bh = box[2] - box[0], box[3] - box[1]
    s = bh / (ymax - ymin) if track else min(bw / (xmax - xmin), bh / (ymax - ymin))
    gap = max(0.0, (bw - (xmax - xmin) * s) / (len(text) - 1)) if track else 0.0
    tx = box[0] - xmin * s if track else box[0] + (bw - (xmax - xmin) * s) / 2 - xmin * s
    ty = box[3] + ymin * s  # baseline so ink bottom sits on box bottom
    pen = SVGPathPen(gs)
    xs = 0
    for i, ch in enumerate(text):
        g = cmap[ord(ch)]
        gs[g].draw(TransformPen(pen, (s, 0, 0, -s, tx + xs * s + i * gap, ty)))
        xs += hmtx[g][0]
    return pen.getCommands()


shoes_path = text_path("SHOES.NG", "montserrat-latin-700-italic.woff", sb)
tag_path = text_path("......energized in style", "montserrat-latin-600-italic.woff", tb, track=True)


def svg(view, paths, fill=GOLD, title="JIS SHOES NG"):
    vx, vy, vw, vh = view
    body = "".join(f'<path d="{d}"/>' for d in paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {vw:.1f} {vh:.1f}" role="img">'
            f"<title>{title}</title><g fill=\"{fill}\" fill-rule=\"evenodd\">{body}</g></svg>")


pad = 6
full_view = (min(mb[0], sb[0], tb[0]) - pad, mb[1] - pad,
             max(mb[2], sb[2], tb[2]) - min(mb[0], sb[0], tb[0]) + 2 * pad, tb[3] - mb[1] + 2 * pad)
mark_view = (mb[0] - pad, mb[1] - pad, mb[2] - mb[0] + 2 * pad, mb[3] - mb[1] + 2 * pad)
(OUT / "logo.svg").write_text(svg(full_view, [mark_path, shoes_path, tag_path]), encoding="utf-8")
(OUT / "mark.svg").write_text(svg(mark_view, [mark_path]), encoding="utf-8")
print("wrote logo.svg, mark.svg", "view", [round(v) for v in full_view])

# 5. Favicons: gold mark on the ink plate, from the high-res mask
INK = (17, 17, 17)
gold_rgb = tuple(int(GOLD[i:i + 2], 16) for i in (1, 3, 5))
mark_mask = mask.crop(mb).resize(((mb[2] - mb[0]) * 4, (mb[3] - mb[1]) * 4), Image.LANCZOS)


def icon(size, pad):
    canvas = Image.new("RGB", (size, size), INK)
    inner = int(size * (1 - 2 * pad))
    m = mark_mask.copy()
    m.thumbnail((inner, inner), Image.LANCZOS)
    layer = Image.new("RGB", m.size, gold_rgb)
    canvas.paste(layer, ((size - m.width) // 2, (size - m.height) // 2), m)
    return canvas


icon(192, 0.1).save(OUT / "icon-192.png", optimize=True)
icon(180, 0.14).save(OUT / "apple-touch-icon.png", optimize=True)
icon(48, 0.06).save(ROOT / "app" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote icons")
