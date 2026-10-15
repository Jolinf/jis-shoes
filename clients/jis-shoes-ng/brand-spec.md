# Brand spec: JIS SHOES NG

Status: provisional (logo redrawn from the client's Instagram image; palette and type are TELDEV recommendations). Direction: dark, bone and gold bands (Peak Design + Perk, see `refero-reference.md`). Why each value exists: `design-logic.md`.

## Colour system

| Role | Token | Hex | Contrast |
| --- | --- | --- | --- |
| Button on light/gold bands | `brand` | `#121212` | |
| Its label | `on-brand` | `#F8B20F` (logo gold, sampled estimate) | 10.1:1 on `brand` |
| Gold: button on dark bands, accents, strip, band | `brand-tint` | `#F8B20F` | `ink` on it 10.1:1 |
| Light band background | `surface` | `#F3F1EC` (bone) | |
| Cards on bone | `surface-raised` | `#FFFFFF` | |
| Photo placeholder (light) | `surface-sunken` | `#E8E5DE` | |
| Text on light | `ink` | `#121212` | 16.6:1 on bone |
| Muted text on light | `ink-muted` | `#57534C` | 6.8:1 on bone, 7.6:1 on white |
| Hairline (light) | `line` | `#D9D5CC` | decorative only |
| Control borders (light) | `line-strong` | `#7A756C` | 4.1:1 on bone |
| Dark band background | `surface-inverse` | `#0D0D0D` | |
| Panels on dark | `surface-inverse-raised` | `#1A1A1A` | |
| Text on dark | `ink-inverse` | `#F3F1EC` | 17.2:1 |
| Muted text on dark | `ink-inverse-muted` | `#A8A49B` | 7.8:1 (7.0:1 on raised) |
| Hairline (dark) | `line-inverse` | `#2E2E2E` | decorative only |
| Error | `danger` | `#B42318` | |

Gold on bone is 1.6:1, so gold is never text or a button fill on light bands.

## Typography

- Display: **Barlow Condensed** 800 italic, uppercase (echoes the slanted "SHOES.NG" in the logo).
- Labels, nav, buttons: **Barlow Condensed** 600, uppercase, 0.08em tracking.
- Body: **Archivo** 400/600.
- Fallbacks: `"Arial Narrow", system-ui, sans-serif`; `system-ui, sans-serif`. Bundled with @fontsource.

## Imagery

- 88 client photos from Telegram (`scripts/picks.json`): 82 for the gallery (10 shown at a time, rotating), 6 for hero and offering cards. Native colours, no edits.
- Gallery 4:5, offerings 1:1, hero 4:5 + overlapping square; radius 12px (cards, photos), 6px (photo inside a card).
- No stock or generated images, no faces.

## Components

- **Gold button** (dark bands): gold pill, black WhatsApp mark, ink label.
- **Ink button** (light and gold bands): ink pill, white mark, gold label.
- **Outline buttons:** cream outline on dark (Instagram, Telegram); ink outline on bone ("DM for price", no mark).
- **Gallery tile:** photo, style eyebrow, colour-and-type label, gold WhatsApp badge; the whole tile is one link.
- **Sticker:** gold circle, tilted 8°, display type, on the hero photo.
- **Style strip:** gold band, display type, ✦ separators.

## Radii

`radius-sm` 6px, `radius-md` 12px, `radius-button` 999px.

## Outstanding decisions

- Blocking: client confirms the redrawn logo.
- Provisional: palette, fonts, stock of pictured pairs.
