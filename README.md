# JIS SHOES NG storefront

Single-page, mobile-first storefront for JIS SHOES NG (footwear, Nigeria), built by TELDEV Technologies on the TELDEV Storefront design system. Customers browse 50 pairs and start a WhatsApp or Instagram conversation; there is no cart or checkout. The full catalogue stays on Telegram (t.me/jissneakers).

## Where things are

- `clients/jis-shoes-ng/`: brief, brand analysis, Refero reference, brand spec, layout manifest, QA report.
- `lib/storefront.ts`: page content (name, lines, contact details). Only add facts that are in `brief.md`. No brand names or prices (client decisions).
- `lib/gallery.json`: the 50 gallery photos (generated); `scripts/picks.json` chooses them.
- `lib/messaging.ts`: shared messaging contract. Gallery taps send a WhatsApp message with a link to that photo.
- `components/`: sections, filterable gallery, CTA button. `app/globals.css`: design tokens.
- `public/brand/`: redrawn logo (`logo.svg`, `mark.svg`) and icons, built by `scripts/build_logo.py` from `assets/brand/instagram-avatar-1080.jpg`.
- `assets/telegram/`: crawled posts (`posts.json`) and original photos (untouched).

## Commands

```
npm install --include=dev     # NODE_ENV is set to production on this machine
python scripts/crawl_telegram.py 30      # refresh posts.json from t.me/s/jissneakers
python scripts/download_photos.py        # download photos + review contact sheets
python scripts/prepare_images.py         # web images from scripts/picks.json
python scripts/build_logo.py             # logo SVGs and icons
npm run dev
# build for GitHub Pages (PowerShell):
$env:NEXT_PUBLIC_BASE_PATH="/jis-shoes"; $env:SITE_URL="https://jolinf.github.io/jis-shoes"; npm run build
npm run qa
```

`SITE_URL` must be the real public address: gallery WhatsApp messages contain links to photos under it. `.github/workflows/pages.yml` must use the same values as the GitHub repo name.
