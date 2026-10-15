# Brand spec: JIS SHOES NG

Status: provisional (logo redrawn from the client's Instagram image; palette and type are TELDEV recommendations). Direction: white catalogue with a black logo plate and one gold accent (Freitag + Nike.com, see `refero-reference.md`).

## Colour system

| Role | Token | Hex | Contrast |
| --- | --- | --- | --- |
| CTA fill | `brand` | `#111111` | |
| CTA label, accent | `on-brand` | `#F8B20F` (logo gold, sampled estimate) | 10.2:1 on `brand` |
| Accent ground (active filter chip) | `brand-tint` | `#F8B20F` | `ink` on it 10.2:1 |
| Main background | `surface` | `#FFFFFF` | |
| Card background | `surface-raised` | `#F4F4F2` | `ink-muted` 5.9:1 |
| Photo backdrop | `surface-sunken` | `#F1F1F1` | |
| Primary text | `ink` | `#111111` | 18.9:1 on white |
| Muted text | `ink-muted` | `#5E5E5E` | 6.5:1 on white |
| Grid rules (decorative) | `line` | `#CACACA` | decorative only |
| Control borders | `line-strong` | `#767676` | 4.5:1 on white |
| Error | `danger` | `#B42318` | 6.6:1 |

Gold on white is 1.85:1, so gold never appears as text or a fill on white. The contact band and header plate are `ink` with white or gold on top.

## Typography

- Display: **Montserrat** 700 italic, uppercase (matches "SHOES.NG" in the logo).
- Body: **Archivo** 400/600 (stand-in for Freitag's Akkurat).
- Fallbacks: `"Arial Black", system-ui, sans-serif` for display; `system-ui, sans-serif` for body.

## Imagery

- Gallery: 50 client photos from Telegram (`scripts/picks.json`), native colours, no edits; shown in a ruled grid, 4:5 cells, cropped to fill, no radius.
- No stock or generated images. No people's faces.

## Components

- **Primary button:** `brand` pill, `on-brand` label, uppercase Montserrat italic. WhatsApp only.
- **Secondary button:** white pill, 1px `ink` border, `ink` label (Instagram, Telegram).
- **Logo plate:** `ink` rectangle with the gold logo, top-left of the header.
- **Gallery tile:** photo + small uppercase style label; the whole tile opens WhatsApp with a link to the photo.
- **Filter chips:** pills; active chip `brand-tint` fill with `ink` text; inactive white with `line-strong` border.

## Radii

`radius-sm` 0px, `radius-md` 0px (Nike/Freitag square photos), `radius-button` 999px.

## Outstanding decisions

- Blocking: client confirms the redrawn logo.
- Provisional: palette, fonts, stock of pictured pairs.
