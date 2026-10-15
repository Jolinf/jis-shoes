# Layout manifest: JIS SHOES NG

- page_type: single_page
- primary_goal: start a WhatsApp order enquiry about a specific pair
- primary_channel: WHATSAPP `2348025968172`; secondary INSTAGRAM_DM `jisstoreng`
- full collection: Telegram `t.me/jissneakers`

| # | Section ID | Level | Decision | Variant | Content source | Missing data | Actions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | header | page element | include | logo plate + anchors | redrawn logo | logo confirmation | `#offerings`, `#gallery`, `#contact` |
| 1 | hero | REQUIRED | include | split: text + 2x2 product tiles | bio lines, tagline, 4 gallery photos | — | WhatsApp (general), Instagram DM |
| 2 | offerings | REQUIRED | include | product-grid of 4 categories | bio categories: sneakers, corporate, crocs, loafers | prices | one "DM for price" button per card, WhatsApp with the line in the message (Joshua, 15 Oct 2026) |
| 3 | gallery | CONDITIONAL | include | ruled grid, style filters | 50 Telegram photos | stock status | each tile: WhatsApp with photo link |
| 3b | (gallery end) | standard | include | full-collection block | — | — | Telegram channel link |
| 3c | contact (send-picture variant) | requested | include | compact-cta on gold band | Joshua, 15 Oct 2026: "Don't see what you want? Send us a picture of your shoe choice directly" | — | WhatsApp (picture template; customer attaches photo in chat) |
| 4 | process | CONDITIONAL | include | numbered-steps (3) | caption "send screenshot to us on WhatsApp", bio "nationwide delivery", "fully boxed" | — | — |
| 5 | about / testimonials / location / hours / faq | — | exclude | — | no verified content | — | — |
| 6 | contact | REQUIRED | include | action-list on ink band | WhatsApp, Instagram | — | WhatsApp, Instagram DM |
| 7 | footer | REQUIRED | include | standard | logo, socials, WhatsApp number | — | external links |

## CTA placement

- Primary (ink pill, gold label): hero, contact.
- Per-item: offering cards (secondary pill), every gallery tile (tap target).
- Sticky bar: not used.

## Responsive

- Mobile: 2-column gallery, 1-column offerings, hero tiles below text.
- `bp-tablet` 640px: 3-column gallery, 2-column offerings.
- `bp-desktop` 1024px: 5-column gallery, 4-column offerings, hero split side by side.

## Overrides

- Gallery filtering is client-side (style chips). Defined and tested per layout rules 8.4.
