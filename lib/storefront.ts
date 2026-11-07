import type { MessagingConfig } from "./messaging";
import galleryData from "./gallery.json";

/**
 * JIS SHOES NG storefront content. Every value traces to clients/jis-shoes-ng/brief.md.
 * Do not add brand names, prices or claims that are not in the brief.
 */

/** Base path when served from a sub-folder (GitHub Pages). */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Public site address, used to put a photo link inside WhatsApp messages. Empty in local builds. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export const business = {
  name: "JIS SHOES NG",
  headline: "Shoes that make your fit shine",
  tagline: "Energized in style",
  intro: "Unisex sneakers, corporate men's shoes, crocs and loafers. Every pair comes fully boxed.",
  delivery: "Nationwide delivery",
  whatsappDisplay: "0802 596 8172",
  telegram: { label: "Telegram", handle: "t.me/jissneakers", url: "https://t.me/jissneakers" },
  socials: [
    { label: "Telegram", handle: "@jissneakers", url: "https://t.me/jissneakers" },
    { label: "Instagram", handle: "@jisstoreng", url: "https://www.instagram.com/jisstoreng/" },
  ],
};

export const messaging: MessagingConfig = {
  primaryChannel: "WHATSAPP",
  whatsappNumber: "2348025968172",
  instagramUsername: "jisstoreng",
  secondaryChannel: "INSTAGRAM_DM",
  verifiedOn: "2026-10-15 (number from Joshua, matches every post caption; confirm with client before launch)",
};

/**
 * Splash screen (design system: structure-templates.md, Splash). `video` is an optional short logo animation
 * (Flow prompt: system/motion-prompts.md), muted, 2 to 3 s, under 400 KB; null = the built-in CSS logo animation.
 */
export const splash = {
  background: "#0d0d0d",
  video: null as { mp4: string; webm?: string } | null,
};

/**
 * Hero films (design system: structure-templates.md, "Hero film"). Each visit plays ONE short film, picked at random
 * (weighted, never the same one twice in a row), with its caption set as real text when the pair lands.
 * Story, prompts and encoding: clients/jis-shoes-ng/hero-film-brief.md. Files per film, in public/film/:
 *   <id>-portrait.mp4, <id>-portrait.webm (optional), <id>-portrait.jpg. Vertical 9:16 only.
 * A film plays only once its id is in `readyFilms`; with none ready, the page opens on the hero as before.
 */
export type FilmSource = { mp4: string; webm?: string; poster: string };
export type HeroFilmConfig = {
  id: string;
  /** What the film shows, read out to screen readers. */
  label: string;
  /** Set in display type under the shoes; real text, never burned into the video. */
  caption: string;
  /** Seconds into the film when the pair has landed and the caption appears. */
  captionAt: number;
  /** Relative chance of being picked (default 1): lead with the best sellers, like a shop window. */
  weight?: number;
  /** 9:16 only: full-screen on portrait screens, in a panel inside the hero on landscape screens. */
  portrait: FilmSource;
};
/** Set `webm` true only when the .webm files exist too (they are smaller; the MP4 is the fallback). */
const film = (id: string, label: string, caption: string, captionAt: number, weight = 1, webm = false): HeroFilmConfig => ({
  id,
  label,
  caption,
  captionAt,
  weight,
  portrait: { mp4: `${base}/film/${id}-portrait.mp4`, webm: webm ? `${base}/film/${id}-portrait.webm` : undefined, poster: `${base}/film/${id}-portrait.jpg` },
});
/** The six planned films. Captions are drafts for the client to approve. */
const heroFilmPlan: HeroFilmConfig[] = [
  film("boots", "Work boots dropping from the night sky and landing hard", "Built to land hard.", 2.2),
  film("runners", "Running sneakers speeding in and skidding to a stop", "Fast never looked this good.", 2.0, 2),
  film("brogues", "Brown brogues set down on a red carpet from a luxury car", "Keep it classy.", 2.4),
  film("crocs", "Crocs bursting out of a pool and landing on the edge", "Comfort makes a splash.", 2.2),
  film("sneakers", "Everyday sneakers rolling in on a skateboard", "Everyday, done right.", 2.0, 2),
  film("loafers", "Women's platform loafers stepping onto a lit runway", "Step up. Stand out.", 2.2),
];
/** Add a film's id here once its files are in public/film/. */
const readyFilms: string[] = [];
export const heroFilms: HeroFilmConfig[] = heroFilmPlan.filter((f) => readyFilms.includes(f.id));

export const logo = {
  full: { src: `${base}/brand/logo.svg`, width: 288, height: 388 },
  mark: { src: `${base}/brand/mark.svg`, width: 232, height: 305 },
  alt: "JIS SHOES NG",
};

export const styles = {
  sneakers: "Sneakers",
  corporate: "Corporate",
  loafers: "Loafers",
  boots: "Boots",
  slides: "Slides & sandals",
  crocs: "Crocs & clogs",
} as const;
export type Style = keyof typeof styles;

export interface Photo {
  id: string;
  style: Style;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  /** Absolute link to the photo for the WhatsApp message, when the site URL is known. */
  shareUrl: string | null;
}

/* Photo descriptions (colour and type only, never a brand: client decision 15 Oct 2026) live in scripts/picks.json. */
type Raw = { id: string; style: Style; use: "gallery" | "pool" | "page"; alt: string; width: number; height: number };
const photos: (Photo & { use: Raw["use"] })[] = (galleryData as Raw[]).map((g) => ({
  id: g.id,
  style: g.style,
  use: g.use,
  src: `${base}/images/g/${g.id}-800.webp`,
  srcSet: `${base}/images/g/${g.id}-480.webp 480w, ${base}/images/g/${g.id}-800.webp 800w`,
  width: g.width,
  height: g.height,
  alt: g.alt,
  shareUrl: siteUrl ? `${siteUrl}/images/g/${g.id}-800.webp` : null,
}));

/** The ten slots as first shown (server-rendered), in the order set in scripts/picks.json. */
export const gallery: Photo[] = photos.filter((p) => p.use === "gallery");

/** Every photo that may rotate into a slot (the first ten included), grouped by style: a slot only takes its own style. */
export const galleryPool: Record<string, Photo[]> = photos
  .filter((p) => p.use === "gallery" || p.use === "pool")
  .reduce<Record<string, Photo[]>>((acc, p) => ({ ...acc, [p.style]: [...(acc[p.style] ?? []), p] }), {});

const byId = (id: string) => photos.find((g) => g.id === id)!;

/** The four lines named in the Telegram and Instagram bios. */
export const offerings = [
  { id: "sneakers", name: "Unisex sneakers", description: "Runners, court sneakers and chunky trainers for men and women.", photo: byId("4404_2"), style: "sneakers" as Style },
  { id: "corporate", name: "Corporate men's shoes", description: "Loafers, derbies and chelsea boots for work and occasions.", photo: byId("4578_1"), style: "corporate" as Style },
  { id: "crocs", name: "Crocs", description: "Clogs and crocs in plain colours and prints.", photo: byId("4624_2"), style: "crocs" as Style },
  { id: "loafers", name: "Loafers", description: "Platform and penny loafers, including women's styles.", photo: byId("4600_1"), style: "loafers" as Style },
];

export const heroPhotos = ["4715_1", "4683_2"].map(byId);

/** Every style in the catalogue, for the strip under the hero. */
export const styleList = Object.values(styles);
