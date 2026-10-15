"""Download photos from priced product posts in assets/telegram/posts.json, then build review contact sheets.

Photos: assets/telegram/photos/<postid>_<n>.jpg (originals, untouched afterwards).
Sheets: assets/telegram/sheets/sheet_XX.jpg, 40 labelled thumbnails each, for choosing gallery images.
Run: python scripts/download_photos.py
"""
import json
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent / "assets" / "telegram"
PHOTOS = ROOT / "photos"
SHEETS = ROOT / "sheets"
PHOTOS.mkdir(exist_ok=True)
SHEETS.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (TELDEV storefront build)"}

posts = json.loads((ROOT / "posts.json").read_text(encoding="utf-8"))
product_posts = [p for p in posts if "PRICE" in p["text"].upper() and p["photos"]]

files = []
for p in product_posts:
    for n, url in enumerate(p["photos"], 1):
        out = PHOTOS / f"{p['id']}_{n}.jpg"
        if not out.exists():
            try:
                with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                    out.write_bytes(r.read())
                time.sleep(0.15)
            except Exception as e:  # noqa: BLE001
                print("skip", out.name, e, flush=True)
                continue
        files.append(out)
print(f"{len(product_posts)} product posts, {len(files)} photos on disk", flush=True)

COLS, ROWS, T = 8, 5, 220
for s in range(0, len(files), COLS * ROWS):
    sheet = Image.new("RGB", (COLS * T, ROWS * (T + 18)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, f in enumerate(files[s : s + COLS * ROWS]):
        try:
            im = Image.open(f).convert("RGB")
        except Exception:  # noqa: BLE001
            continue
        im.thumbnail((T, T))
        x, y = (i % COLS) * T, (i // COLS) * (T + 18)
        sheet.paste(im, (x + (T - im.width) // 2, y + (T - im.height) // 2))
        draw.text((x + 4, y + T + 2), f.stem, fill="black")
    name = SHEETS / f"sheet_{s // (COLS * ROWS) + 1:02d}.jpg"
    sheet.save(name, quality=80)
print("sheets:", len(list(SHEETS.glob("sheet_*.jpg"))), flush=True)
