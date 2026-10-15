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
