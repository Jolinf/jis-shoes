# Layout manifest: JIS SHOES NG

- template: RETAIL (`system/structure-templates.md`)
- page_type: single_page
- primary_goal: start a WhatsApp order enquiry about a specific pair
- primary_channel: WHATSAPP `2348025968172`; secondary INSTAGRAM_DM `jisstoreng`
- full collection: Telegram `t.me/jissneakers`
- design: `design-logic.md`

| # | Section ID | Level | Decision | Variant | Content source | Missing data | Actions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0a | announcement bar | optional element | include | one line, black | "Nationwide delivery", WhatsApp number | — | — |
| 0b | header | page element | include | mark + name, anchors | redrawn logo | logo confirmation | `#offerings`, `#gallery`, `#contact` |
| 1 | hero | REQUIRED | include | split: text + photo pair + sticker (dark band) | tagline, bio lines, "fully boxed" | — | WhatsApp (general), Instagram DM |
| 1b | category strip | optional element | include | gold band | the six styles in the gallery picks | — | — |
| 2 | offerings | REQUIRED | include | product-grid of 4 lines (bone band) | bio categories | prices | one "DM for price" button per card (Joshua, 15 Oct 2026) |
| 3 | gallery | CONDITIONAL | include | 10 slots rotating from an 82-photo pool, slot keeps its style (dark band) | Telegram photos, all six styles (`scripts/picks.json`) | stock status | each tile: WhatsApp with the shown photo's link; Pause / Play button |
| 3b | (gallery end) | standard | include | full-collection block | — | — | Telegram channel link |
| 3c | custom request CTA | optional element | include | gold band | Joshua, 15 Oct 2026 | — | WhatsApp (picture template; customer attaches photo in chat) |
| 4 | process | CONDITIONAL | include | numbered-steps (3), bone band | caption "send screenshot to us on WhatsApp", "nationwide delivery", "fully boxed" | — | — |
| 5 | about / testimonials / faq / location / hours | — | exclude | — | no verified content | — | — |
| 6 | contact | REQUIRED | include | dark band, logo on desktop | WhatsApp, Instagram | — | WhatsApp, Instagram DM |
| 7 | footer | REQUIRED | include | standard, black | logo, socials, WhatsApp number | — | external links |

## CTA placement

- Primary: gold pill on dark bands (hero, contact); ink pill on the gold band (send a picture).
- Per-item: offering cards (outline pill), every gallery tile (whole tile).
- Sticky bar: not used.

## Responsive

- Mobile: 2-column offerings and gallery; hero photo below text; buttons full width, stacked.
- `bp-tablet` 640px: buttons side by side; process in 3 columns.
- `bp-desktop` 1024px: hero split side by side; 4-column offerings; 5-column gallery (2 rows).

## Overrides

None. (Round 1 had client-side style filters; removed with the 10-photo gallery.)
