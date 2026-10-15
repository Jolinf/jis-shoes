"""Make web images for the gallery from the client's Telegram photos listed in scripts/picks.json.

Originals in assets/telegram/photos/ are untouched. Outputs:
- public/images/g/<id>-480.webp and -800.webp (gallery, native aspect ratio)
- public/images/og-image.jpg (1200x630 share preview, four picks side by side)
- lib/gallery.json (id, style, size, source post) read by the page
Run: python scripts/prepare_images.py
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "telegram" / "photos"
OUT = ROOT / "public" / "images" / "g"
OUT.mkdir(parents=True, exist_ok=True)
picks = json.loads((ROOT / "scripts" / "picks.json").read_text(encoding="utf-8"))
posts = {p["id"]: p for p in json.loads((ROOT / "assets" / "telegram" / "posts.json").read_text(encoding="utf-8"))}

items = []
for style, ids in picks.items():
    if style.startswith("_"):
        continue
    for pid in ids:
        im = Image.open(SRC / f"{pid}.jpg").convert("RGB")
        for name in (480, 800):
            w = min(name, im.width)  # never upscale; small originals still get both file names
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(OUT / f"{pid}-{name}.webp", "WEBP", quality=78, method=6)
        post_id = int(pid.split("_")[0])
        items.append({
            "id": pid,
            "style": style,
            "width": 800,
            "height": round(im.height * 800 / im.width),
            "post": f"https://t.me/jissneakers/{post_id}",
            "posted": (posts.get(post_id) or {}).get("date", "")[:10],
        })
        print(pid, style, im.size, flush=True)

(ROOT / "lib" / "gallery.json").write_text(json.dumps(items, indent=1), encoding="utf-8")

# Share preview: four picks across a 1200x630 canvas
og_ids = ["4705_1", "4578_1", "4624_2", "4600_1"]
canvas = Image.new("RGB", (1200, 630), (17, 17, 17))
for k, pid in enumerate(og_ids):
    im = Image.open(SRC / f"{pid}.jpg").convert("RGB")
    s = max(300 / im.width, 630 / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    left, top = (im.width - 300) // 2, (im.height - 630) // 2
    canvas.paste(im.crop((left, top, left + 300, top + 630)), (k * 300, 0))
canvas.save(ROOT / "public" / "images" / "og-image.jpg", "JPEG", quality=82, optimize=True, progressive=True)
print("gallery items:", len(items))
