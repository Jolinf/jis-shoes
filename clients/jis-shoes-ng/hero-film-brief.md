# Hero film brief: JIS SHOES NG

Method, settings and encoding: TELDEV Storefront design system, `system/motion-prompts.md` §3 and §4. Behaviour on the page: `components/HeroFilm.tsx`. Films and captions are set in `lib/storefront.ts` (`heroFilmPlan`, `readyFilms`).

## The idea (Joshua, 26 Oct 2026)

A shop window, not a website: six short films, one pair each, about 5 seconds. Every visit shows ONE of them, picked at random, so each visitor gets a different window display. Each pair arrives in its own world and lands centre-frame; as it lands, its caption appears under it.

How the page handles it:

- Pick: random, weighted (sneakers and runners shown twice as often, as the biggest sellers), never the same film twice in a row on the same phone.
- Caption: real text in the site's display type (Barlow Condensed italic), fading in at the moment the pair lands. Not generated into the video: Flow garbles lettering, and real text stays sharp, editable and readable by screen readers.
- After the film: the last frame and caption hold for 1.8 s, then the page moves to the header if the visitor hasn't touched anything.
- Skip, Pause, reduced motion, data saver, splash timing: as in the design system (`ux-standards.md` §3).
- Only the chosen film downloads (about 1 MB on a phone).

## The six films

| id | Pair (photo from Joshua) | Arrival | Caption (draft, for client approval) | Caption at | Weight |
| --- | --- | --- | --- | --- | --- |
| boots | Wheat leather work boots | Drop from the night sky and crush the ground | Built to land hard. | 2.2 s | 1 |
| runners | Running sneakers | Speed in along a wet street, skid to a stop | Fast never looked this good. | 2.0 s | 2 |
| brogues | Brown brogues | Set down on a red carpet from a chauffeur-driven luxury car | Keep it classy. | 2.4 s | 1 |
| crocs | Colourful crocs | Burst out of a pool, land on the edge | Comfort makes a splash. | 2.2 s | 1 |
| sneakers | Everyday low-top sneakers | Roll in on a skateboard, hop off | Everyday, done right. | 2.0 s | 2 |
| loafers | Women's black platform loafers | Step down onto a gold-lit runway | Step up. Stand out. | 2.2 s | 1 |

"Caption at" = the second the pair has landed in the final cut. Adjust it in `lib/storefront.ts` after editing each film.

Client decision: no brand names anywhere. Prompts describe each pair by colour and type and the car by its look, never by make.

## Style block (paste at the end of every prompt)

```
Style: premium cinematic sneaker commercial at night. Dark studio and city-street world, deep near-black backgrounds (#0D0D0D), warm golden rim light (#F8B20F) on the shoes, high contrast, 35mm film look, shallow depth of field, crisp leather, suede and stitching detail. The pair keeps its exact design, colours and materials from the reference image. No people's faces (feet, legs or hands only). No text, captions, watermarks or added logos. Vertical 9:16 framing. The shoes finish in the centre of the upper half of the frame; the lower third stays dark and uncluttered for a caption. The last second holds still on the shoes.
```

## Prompts (Flow: Ingredients to Video, 9:16, Veo 3.1 Fast for drafts; ingredient 1 = that pair's photo)

Each clip comes out at about 8 seconds: cut it to the best 5 (arrival plus about 2 s of hold).

**boots**

```
A pair of wheat-coloured leather work boots falls from a dark night sky in slow motion, tumbling once, then slams heel-first onto wet black asphalt. On impact the ground cracks outward in a ring, dust and small stones burst up and hang in the air, and a ripple of golden light runs across the ground. Low-angle camera at ground level with a slight push-in as they land; the boots end upright, side by side, facing the camera, then hold still. [STYLE BLOCK]
```

**runners**

```
A pair of running sneakers races into frame from the right along a rain-slicked street at night, so fast they leave streaks of motion blur and golden light trails, then skid sideways to a sharp stop, throwing a fan of water spray that glitters in the light. The camera tracks low and fast alongside them, then settles as they stop, sharp and still, facing the camera. [STYLE BLOCK]
```

**brogues**

```
The rear door of a long black chauffeur-driven luxury car with a polished chrome grille swings open at night onto a red carpet. A pair of polished brown leather brogues is set down gently on the carpet, toes pointing at the camera; a gloved hand withdraws. Soft golden light spills from the car interior and camera flashes pop softly in the blurred background. Slow, elegant push-in at shoe height, ending on the brogues, still. [STYLE BLOCK]
```

**crocs**

```
A pair of colourful clog-style crocs bursts up through the surface of a dark swimming pool at night, rising in a crown of water droplets that sparkle gold, flips once in the air and lands upright on the wet tiled pool edge with a small bounce. Camera at the pool edge, slow motion on the splash, real speed on the landing, ending with the crocs centred and still. [STYLE BLOCK]
```

**sneakers**

```
A pair of everyday low-top sneakers rides into frame on a moving skateboard along an empty city street at night, street lights streaking gold overhead; the skateboard stops at the kerb and the sneakers hop off onto the pavement and settle side by side. The camera tracks at ground level from the side, then swings round to face them as they land, and holds. [STYLE BLOCK]
```

**loafers**

```
A pair of women's black patent platform loafers steps down, one after the other, onto a long glossy black runway lit by a row of warm golden lights that switch on one by one towards the camera. Only the lower legs are visible, then they step out of frame and the loafers are left standing alone, perfectly placed, catching the gold light. Low camera at the end of the runway, slow push-in, ending still on the loafers. [STYLE BLOCK]
```

Note on loafers: the shoes are worn, then left standing, so the feet leave the frame before the hold. If Flow keeps the legs in the final frame, use the prompt with "A pair of women's black patent platform loafers slides down the runway on its own and stops..." instead.

## One format: vertical 9:16 (Joshua, 26 Oct 2026)

No 16:9 versions. Phones and upright tablets show the film full-screen; laptops, desktops and sideways screens show the same vertical film in a tall panel inside the hero, beside the headline and WhatsApp button (no full-screen takeover, no auto-scroll there).

## Before each film goes live

- [ ] Photo from Joshua: one clean shot of the pair (background removed if possible).
- [ ] Encode per `motion-prompts.md` §4 as `public/film/<id>-portrait.mp4` + `.jpg` (WebM optional; if added, pass `webm = true` for that film).
- [ ] Set its "caption at" to the landing second in the final cut.
- [ ] Add its id to `readyFilms`. Films can go live one at a time; with one ready, every visitor sees that one.
- [ ] Client approves the captions.
- [ ] Rebuild, run `npm run qa`, watch it on a real Android phone on mobile data.
