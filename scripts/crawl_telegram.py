"""Crawl the public preview of the JIS SHOES NG Telegram channel (t.me/s/jissneakers).

Writes assets/telegram/posts.json: one entry per post with id, date, text and photo URLs.
Read-only, paged with ?before=<id>, one request per second.
Run: python scripts/crawl_telegram.py [max_pages]
"""
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

CHANNEL = "jissneakers"
OUT = Path(__file__).resolve().parent.parent / "assets" / "telegram" / "posts.json"
MAX_PAGES = int(sys.argv[1]) if len(sys.argv) > 1 else 60
UA = {"User-Agent": "Mozilla/5.0 (TELDEV storefront build; contact via client)"}


def fetch(before=None):
    url = f"https://t.me/s/{CHANNEL}" + (f"?before={before}" if before else "")
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def text_of(fragment):
    fragment = re.sub(r"<br\s*/?>", "\n", fragment)
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def parse(page):
    posts = []
    for block in re.split(r'(?=<div class="tgme_widget_message_wrap)', page)[1:]:
        m = re.search(rf'data-post="{CHANNEL}/(\d+)"', block)
        if not m:
            continue
        t = re.search(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', block, re.S)
        d = re.search(r'<time[^>]*datetime="([^"]+)"', block)
        photos = re.findall(r"tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)", block)
        posts.append({
            "id": int(m.group(1)),
            "date": d.group(1) if d else None,
            "text": text_of(t.group(1)) if t else "",
            "photos": photos,
            "has_video": "tgme_widget_message_video" in block,
        })
    return posts


def main():
    all_posts, before = {}, None
    for page_no in range(MAX_PAGES):
        posts = parse(fetch(before))
        if not posts:
            break
        for p in posts:
            all_posts[p["id"]] = p
        before = min(p["id"] for p in posts)
        print(f"page {page_no + 1}: {len(posts)} posts, oldest id {before}, total {len(all_posts)}", flush=True)
        if before <= 1:
            break
        time.sleep(1)
    ordered = sorted(all_posts.values(), key=lambda p: p["id"], reverse=True)
    OUT.write_text(json.dumps(ordered, indent=1, ensure_ascii=False), encoding="utf-8")
    n_photos = sum(len(p["photos"]) for p in ordered)
    print(f"saved {len(ordered)} posts, {n_photos} photos -> {OUT}")


if __name__ == "__main__":
    main()
