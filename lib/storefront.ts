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

const counters: Partial<Record<Style, number>> = {};
const photos: Photo[] = (galleryData as { id: string; style: Style; width: number; height: number }[]).map((g) => {
  counters[g.style] = (counters[g.style] ?? 0) + 1;
  return {
    id: g.id,
    style: g.style,
    src: `${base}/images/g/${g.id}-800.webp`,
    srcSet: `${base}/images/g/${g.id}-480.webp 480w, ${base}/images/g/${g.id}-800.webp 800w`,
    width: g.width,
    height: g.height,
    alt: `${styles[g.style]}, photo ${counters[g.style]} from the JIS SHOES NG catalogue`,
    shareUrl: siteUrl ? `${siteUrl}/images/g/${g.id}-800.webp` : null,
  };
});

/** "All" order: one of each style in turn, so the first rows show the range rather than 30 sneakers. */
function interleave(list: Photo[]): Photo[] {
  const queues = (Object.keys(styles) as Style[]).map((s) => list.filter((p) => p.style === s));
  const out: Photo[] = [];
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const p = q.shift();
      if (p) out.push(p);
    }
  }
  return out;
}
export const gallery: Photo[] = interleave(photos);

const byId = (id: string) => gallery.find((g) => g.id === id)!;

/** The four lines named in the Telegram and Instagram bios. */
export const offerings = [
  { id: "sneakers", name: "Unisex sneakers", description: "Runners, court sneakers and chunky trainers for men and women.", photo: byId("4404_2"), style: "sneakers" as Style },
  { id: "corporate", name: "Corporate men's shoes", description: "Loafers, derbies and chelsea boots for work and occasions.", photo: byId("4578_1"), style: "corporate" as Style },
  { id: "crocs", name: "Crocs", description: "Clogs and crocs in plain colours and prints.", photo: byId("4624_2"), style: "crocs" as Style },
  { id: "loafers", name: "Loafers", description: "Platform and penny loafers, including women's styles.", photo: byId("4600_1"), style: "loafers" as Style },
];

export const heroPhotos = ["4705_1", "4578_1", "4624_2"].map(byId);
