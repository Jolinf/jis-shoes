# QA report: JIS SHOES NG storefront

Date: 15 Oct 2026. Build: Next.js 15.5 static export with `NEXT_PUBLIC_BASE_PATH=/jis-shoes`, `SITE_URL=https://jolinf.github.io/jis-shoes`.

## Status: not ready to publish

Blocking: client confirmation of the redrawn logo; GitHub repo name must match the build settings; WhatsApp journey untested on a phone.

## Automated checks (`scripts/qa.mjs`): 373 of 373 pass

- 53 WhatsApp links, all to `2348025968172`, all with encoded messages, no placeholders.
- 4 offering cards: each message names its own line.
- 50 gallery tiles: each message contains the absolute link to its own photo.
- 2 Instagram DM links (`ig.me/m/jisstoreng`); Telegram link to `t.me/jissneakers`.
- All anchors resolve; all external links `rel="noopener noreferrer"`.
- No transactional labels, no placeholder copy, design-system placeholder colour absent.
- Every image exists with an alt attribute and dimensions (header mark alt="" because the name is written beside it).
- Initial load 764 KB uncompressed (HTML + referenced CSS/JS + eager images), under the 1 MB budget.
- Share preview: og:title, og:description, og:image (absolute URL).

## Browser checks (Chrome, 15 Oct 2026)

| Result | Check |
| --- | --- |
| PASS | No horizontal overflow at 320, 390, 768, 1280px |
| PASS | No link or button under 40px tall at 320, 390, 768px |
| PASS | Style filters: "Corporate" shows 6 pairs; "All" restores 50; `aria-pressed` updates |
| PASS | "All" order interleaves styles (sneakers, corporate, loafers, boots, slides, crocs, then repeats) |
| PASS | Visual review at 390px (hero, offerings, gallery, process, contact, footer) and 1280px |
| PASS | Contrast: all text pairs 4.5:1 or higher (see `brand-spec.md`) |
| NOT RUN | WhatsApp journey on a real phone, including whether the photo link previews in the chat |
| NOT RUN | Keyboard-only and screen reader passes |
| NOT RUN | Lighthouse on throttled mobile |

## Open issues

| ID | Severity | Issue | Resolution |
| --- | --- | --- | --- |
| JIS-1 | Critical (client) | Redrawn logo not yet confirmed | Show client `public/brand/logo.svg` |
| JIS-2 | Critical | Photo links in WhatsApp messages only work once the site is live at `SITE_URL` | Confirm repo name, deploy, then tap-test |
| JIS-3 | High | Pictured pairs may sell out (channel removes unavailable designs) | Refresh picks periodically: crawl, review, `prepare_images.py` |
| JIS-4 | Medium | Gallery alt text is generic ("Sneakers, photo 3 …") | Write per-photo descriptions if the client wants better accessibility |
| JIS-5 | Medium | Mobile page is about 10,000px tall (50 photos in 2 columns) | Client asked for 50; consider "show more" after 20 if analytics show drop-off |
| JIS-6 | Low | Brand logos remain visible inside some photos (boxes, shoes) | Site text names no brands, per client decision |
