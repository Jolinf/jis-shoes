# Design logic: JIS SHOES NG

Governed by `system/design-logic.md`. Values: `brand-spec.md`. Research: `refero-reference.md`.

## 1. Concept

The client's own line is "energized in style" (logo and bio), and the logo is gold on black with slanted lettering. The page should feel like a sneaker drop at night: dark, warm, loud headlines, gold lighting up wherever there is something to do. The first version (white, ruled grid, square boxes) read as a wireframe and was replaced on 15 Oct 2026 at Joshua's request.

## 2. Structure

RETAIL template (`system/structure-templates.md`): announcement bar → header → hero → category strip → offerings → gallery (10) + Telegram block → custom request CTA ("Don't see what you want?") → process → contact → footer. About, testimonials, FAQ, location and hours left out: no verified content. No overrides.

## 3. References

- **Primary: Peak Design** (Refero, "gallery wall, half lit"). Taken: full-bleed bands alternating near-black and light, a split dark hero with a large photo, condensed bold caps for every label and button, 8 to 12px rounded photos, borderless cards, one accent colour used sparingly.
- **Secondary: Perk** (Refero, "electric lime, warm parchment"). Taken: one full-bleed accent band carrying giant display type (here the gold "Don't see what you want?" band), and a warm off-white instead of pure white.
- Rejected: Freitag and Nike.com (the first version): achromatic white and ruled grids suit a brand with studio photography; JIS's phone photos on mixed backgrounds looked like a spreadsheet. Raycast and ORYZO: right darkness, but no photography and too technical or too slow (one section per screen).

## 4. Colour logic

- **Dark bands** (`surface-inverse` #0D0D0D): header, hero, gallery, contact, footer. The logo was made for black, and dark grounds make phone photos with messy backgrounds look intentional (the photo becomes the bright object).
- **Bone bands** (`surface` #F3F1EC): offerings and process. Warm, not white, so the light sections feel like paper rather than an empty app screen. White (`surface-raised`) is only for cards sitting on bone.
- **Gold** (#F8B20F) means "act or look here": the primary button on dark bands, the word "shine", the gallery's WhatsApp badges, the "fully boxed" sticker, the style strip and the send-a-picture band. Gold is never text on bone (1.6:1).
- On light and gold grounds the action button flips to an ink pill with a gold label (10.1:1).
- Checked pairs: ink on bone 16.6:1; muted on bone 6.8:1; cream on dark 17.2:1; muted cream on dark 7.8:1; gold on dark 10.5:1; ink on gold 10.1:1.

## 5. Type logic

- **Display: Barlow Condensed 800 italic, uppercase.** Condensed and slanted like the logo's "SHOES.NG", but narrower, so 56px headlines fit 3 words per line on a phone. Sizes jump hard: 56 / 80 / 96px for the H1, 44 / 56px for section titles, 22 to 26px for card names.
- **Labels and buttons: Barlow Condensed 600 caps, 0.08em tracking.** One voice for every eyebrow, nav link and button.
- **Body: Archivo 400/600 at 16 to 17px.** Plain and readable; the display face does the shouting.
- Two families, four weights (design system limit).

## 6. Rhythm

dark (hero) → **gold strip** → bone (offerings) → dark (gallery) → **gold band** (send a picture) → bone (process) → dark (contact, footer). Each switch marks a change of task: see, choose a line, pick a pair, ask for something else, learn how to order, order. The gold breaks keep a long phone scroll from feeling like one block.

## 7. Imagery

- Hero: one large photo (4715_1, runners on a lime cushion: the brightest image in the catalogue) at 4:5, plus a smaller overlapping square (4683_2) with a dark border, so the hero feels composed rather than a single snapshot.
- Offerings: square crops in white cards. Gallery: 4:5 crops on dark, 12px radius.
- Gallery shows 10 slots, never repeating a hero or offering photo. The first 10 (server-rendered): 5 sneakers in 5 colours (purple, pink, red, green, grey and white), dress shoes, boots, women's loafers, slides, crocs.
- A pool of 82 photos rotates through those slots (35 more sneakers, 11 corporate, 4 boots, 6 loafers, 10 slides, 6 crocs; one photo per post, no screenshots or faces; `scripts/picks.json`). Each slot only takes its own style, so the 5-sneakers-plus-one-of-everything mix holds at every moment; a fully random pool would be about 60% sneakers.
- Tiles show only the style ("SNEAKERS", "BOOTS"…), per Joshua, 15 Oct 2026. Each photo's colour-and-type description (never the maker) stays as its alt text for screen readers.

## 8. Signature elements

1. The gold "Every pair fully boxed" sticker, tilted 8°, on the hero photo (a verified fact from the bio).
2. The gold style strip naming every style the client stocks.
3. Oversized italic headlines with the last word in gold ("shine", "order?").

## 9. Interaction and motion

- Every gallery tile is one link: tap opens WhatsApp with that photo's URL in the message. The gold WhatsApp badge sits on the photo's corner (moved off the label so descriptions get the full tile width on small phones).
- **Rotating gallery** (Joshua, 15 Oct 2026: "the display can be 10 photos but the pool can be 50-100"). Every 3 s one random slot cross-fades (0.7 s) to another photo of its style; each slot changes about every 30 s. Safeguards, per `system/ux-standards.md` §3: Pause / Play button beside the title; no rotation (and no button) under reduced motion or data saver; only while the gallery is on screen and the tab visible; no change under the mouse, for 8 s after any touch or click in the gallery, or while a tile has keyboard focus; the next photo is decoded before it fades in; 4:5 frames and a 2-line label reserve keep rows still; the tile's link and label switch only once the new photo is fully shown, so a tap always asks about what the customer saw.
- Offering cards: one "DM for price" button each. Hero and contact: WhatsApp (gold) + Instagram (outline).
- Photos zoom 3 to 4% on hover only with a pointer and only without reduced-motion. No video, no sliding carousel; the gallery rotation above is the only timed change.
- Focus ring: ink on light bands, gold on dark bands (`--ring`).

## 10. UX checks (`system/ux-standards.md`)

- One-thumb path at 390px: hero says what is sold in the first screen; gallery tile → WhatsApp is one tap.
- All buttons and tiles at least 48px tall; buttons stack full width on phones.
- Body 16 to 17px; smallest text 12px (gallery style labels, caps, 7.8:1).
- Gallery filters removed: with 10 pairs, filters add taps without saving any (HIG Simplicity).
- Mobile tested at 320, 360, 390 and 412px: no sideways scroll, nothing outside the screen, every tap target 48px or more, buttons on one line, gallery rows unchanged after swaps.

## 11. Change log

- 15 Oct 2026: first version (Freitag + Nike.com, white, ruled grid, 50 photos with filters).
- 15 Oct 2026: redesign (Peak Design + Perk, dark/bone/gold bands, Barlow Condensed, 10-photo gallery, no filters) at Joshua's request: "looks like a wireframe… background is white, feels basic".
- 15 Oct 2026: gallery rotates from an 82-photo pool; WhatsApp badge moved onto the photo; title and pause button wrap on narrow phones; desktop nav links 48px tall.
