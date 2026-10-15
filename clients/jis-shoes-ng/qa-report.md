# QA report: JIS SHOES NG storefront

Date: 15 Oct 2026 (redesign build). Build: Next.js 15.5 static export with `NEXT_PUBLIC_BASE_PATH=/jis-shoes`, `SITE_URL=https://jolinf.github.io/jis-shoes`.

## Status: not ready to publish

Blocking: client confirmation of the redrawn logo; GitHub repo name must match the build settings; WhatsApp journey untested on a phone.

## Automated checks (`scripts/qa.mjs`): 136 of 136 pass

- WhatsApp links all to `2348025968172`, all with encoded messages, no placeholders.
- 4 offering cards: each message names its own line.
- 10 gallery tiles: each message contains the absolute link to its own photo. Gallery at most 10, no photo repeated in hero or offerings (new checks).
- `clients/jis-shoes-ng/design-logic.md` exists (new check).
- Instagram DM links (`ig.me/m/jisstoreng`); Telegram link to `t.me/jissneakers`.
- All anchors resolve; all external links `rel="noopener noreferrer"`.
- No transactional labels, no placeholder copy, design-system placeholder colour absent.
- Every image exists with alt text and dimensions; gallery and offering alt text now describes colour and type.
- Initial load 708 KB uncompressed (HTML + referenced CSS/JS + eager images), under the 1 MB budget.
- Share preview: og:title, og:description, og:image (absolute URL).

## Browser checks (headless Chromium, 15 Oct 2026, redesign)

| Result | Check |
| --- | --- |
| PASS | 320, 360, 390, 412, 768, 1024, 1280px: no sideways scroll, no element outside the screen, every link and button at least 44px (48px by design), no button label wrapping |
| PASS | Gallery rotation at 390px: 3 slots changed in 10 s; every tile keeps its style; no duplicates on screen; tile positions and heights identical before and after swaps |
| PASS | Each tile's WhatsApp link matches the photo on screen (0 mismatches) |
| PASS | Pause: no change in 9 s after pressing "Pause photos" |
| PASS | Reduced motion: no rotation in 8 s and no pause button |
| PASS | Gallery tiles show the style only; layout re-checked at 320 to 1280px after the change |
| PASS | Gallery title and pause button: one line at 390px; button drops under the title at 320px instead of squeezing it |
| PASS | Visual review at 390px and 1280px: all bands, hero composition, sticker, strip, gallery, gold band, process, contact, footer |
| PASS | Contrast: every text pair on light, dark and gold bands 4.5:1 or higher (`brand-spec.md`) |
| PASS | Buttons and tiles at least 48px tall; buttons full width on phones |
| PASS | Mobile page height down from about 10,000px to about 6,000px (10-photo gallery) |
| PASS | Process cards on phones (number beside text), checked at 320px |
| NOT RUN | Rotation on a real Android phone over mobile data (data use, smoothness) |
| NOT RUN | 200% text zoom (`ux-standards.md`) |
| NOT RUN | WhatsApp journey on a real phone, including whether the photo link previews in the chat |
| NOT RUN | Keyboard-only and screen reader passes |
| NOT RUN | Lighthouse on throttled mobile |

## Open issues

| ID | Severity | Issue | Resolution |
| --- | --- | --- | --- |
| JIS-1 | Critical (client) | Redrawn logo not yet confirmed | Show client `public/brand/logo.svg` |
| JIS-2 | Critical | Photo links in WhatsApp messages only work once the site is live at `SITE_URL` | Confirm repo name, deploy, then tap-test |
| JIS-3 | High | Pictured pairs may sell out (channel removes unavailable designs); with 82 photos in rotation, more of them can be out of stock | Refresh picks periodically: crawl, review, `prepare_images.py` |
| JIS-8 | Low | Photo descriptions were written from thumbnails | Client to spot-check `scripts/picks.json` |
| JIS-6 | Low | Brand logos remain visible inside some photos (boxes, shoes) | Site text names no brands, per client decision |
| JIS-7 | Low | Gold `#F8B20F` is sampled from the avatar, not supplied by the client | Ask for the logo file or colour code |

Closed: JIS-4 (generic alt text, now descriptive), JIS-5 (page length, gallery cut to 10).
