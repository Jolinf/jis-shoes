"use client";

import { useEffect, useRef, useState } from "react";
import { business, gallery, galleryPool, messaging, styles, type Photo } from "@/lib/storefront";
import { linkFor, resolveChannel } from "@/lib/messaging";
import { PlatformIcon } from "./Icons";

const wrap = "mx-auto w-full max-w-layout px-4 tablet:px-6";
const SIZES = "(min-width: 1024px) 210px, 45vw";
/** One slot changes every 3 s, so each slot changes roughly every 30 s. */
const INTERVAL = 3000;
const FADE = 700;
/** After a touch or click anywhere in the gallery, nothing changes for this long. */
const HOLD_AFTER_TOUCH = 8000;

/**
 * Ten slots on a dark band (design system: 10 on display). Photos rotate in from a pool of the
 * client's catalogue; each slot keeps its style, so the mix stays varied. Safeguards (design-logic.md §9):
 * a pause button, no rotation under reduced motion or data saver, off-screen or in a background tab,
 * and nothing changes under a finger, pointer or keyboard focus. Every tile opens WhatsApp with a link
 * to the photo it is showing (system/messaging-cta.md).
 */
export function Gallery() {
  const channel = resolveChannel(messaging);
  const [slots, setSlots] = useState<Photo[]>(gallery);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const slotsRef = useRef(slots);
  const visible = useRef(false);
  const holdUntil = useRef(0);
  const focusInside = useRef(false);
  const hovered = useRef<number | null>(null);
  const lastSlot = useRef(-1);
  const busy = useRef(false);
  slotsRef.current = slots;

  // Rotation only for people who have not asked for less motion or less data.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setEnabled(!reduce && !saveData);
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || paused) return;
    const id = window.setInterval(() => {
      if (busy.current || !visible.current || document.hidden || focusInside.current || Date.now() < holdUntil.current) return;
      const current = slotsRef.current;
      const shown = new Set(current.map((p) => p.id));
      const choices = current
        .map((p, i) => ({ i, options: (galleryPool[p.style] ?? []).filter((q) => !shown.has(q.id)) }))
        .filter((c) => c.i !== hovered.current && c.i !== lastSlot.current && c.options.length > 0);
      if (!choices.length) return;
      const { i, options } = choices[Math.floor(Math.random() * choices.length)];
      const next = options[Math.floor(Math.random() * options.length)];
      busy.current = true;
      // Load the photo first, so the swap is a clean fade rather than a blank tile.
      const img = new Image();
      img.sizes = SIZES;
      img.srcset = next.srcSet;
      img.src = next.src;
      const done = () => {
        busy.current = false;
        if (focusInside.current || Date.now() < holdUntil.current || hovered.current === i) return;
        lastSlot.current = i;
        setSlots((s) => s.map((p, k) => (k === i ? next : p)));
      };
      img.decode().then(done, done);
    }, INTERVAL);
    return () => window.clearInterval(id);
  }, [enabled, paused]);

  const hold = () => (holdUntil.current = Date.now() + HOLD_AFTER_TOUCH);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-labelledby="gallery-title"
      className="band-dark py-14 desktop:py-20"
      onPointerDown={hold}
      // Keyboard focus only: a tapped tile or the pause button keeps focus afterwards and must not freeze the gallery.
      onFocus={(e) => (focusInside.current = (e.target as Element).matches(":focus-visible"))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusInside.current = false;
      }}
    >
      <div className={wrap}>
        <p className="label text-brand-tint">From our catalogue</p>
        {/* Wraps the button under the title on narrow phones instead of squeezing the title onto two lines */}
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <h2 id="gallery-title" className="display text-[44px] leading-[42px] tablet:text-[56px] tablet:leading-[52px]">Pick a pair</h2>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-hidden={!enabled}
            tabIndex={enabled ? 0 : -1}
            className={`label inline-flex min-h-tap shrink-0 items-center gap-2 rounded-button border border-ink-inverse-muted px-4 !text-[14px] text-ink-inverse hover:border-ink-inverse ${enabled ? "" : "invisible"}`}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              {paused ? <path d="M4 2.5v11l9-5.5z" /> : <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" />}
            </svg>
            {paused ? "Play photos" : "Pause photos"}
          </button>
        </div>
        <p className="mt-3 max-w-content text-ink-inverse-muted">
          A changing selection from our catalogue. Tap a pair to ask about it on WhatsApp.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 tablet:gap-x-4 desktop:grid-cols-5 desktop:gap-x-5 desktop:gap-y-8">
          {slots.map((photo, i) => (
            <li
              key={i}
              onPointerEnter={(e) => e.pointerType === "mouse" && (hovered.current = i)}
              onPointerLeave={() => hovered.current === i && (hovered.current = null)}
            >
              <Tile photo={photo} channel={channel} />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col gap-5 rounded-md border border-line-inverse bg-surface-inverse-raised p-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:p-8">
          <div>
            <p className="display text-[30px] leading-8 tablet:text-[36px] tablet:leading-9">View our entire collection on Telegram</p>
            <p className="mt-2 text-[15px] leading-[22px] text-ink-inverse-muted">New designs are posted on {business.telegram.handle}</p>
          </div>
          <a
            href={business.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the JIS SHOES NG Telegram channel (opens Telegram)"
            className="label inline-flex min-h-tap shrink-0 items-center justify-center gap-2 self-start rounded-button border border-ink-inverse-muted px-6 !text-[16px] text-ink-inverse hover:border-ink-inverse tablet:self-auto"
          >
            <span className="text-white"><PlatformIcon name="telegram" /></span>
            Open Telegram
          </a>
        </div>
      </div>
    </section>
  );
}

type Layer = { photo: Photo; on: boolean };

/**
 * One slot. A new photo fades in over the old one inside a fixed 4:5 frame, so nothing around it moves.
 * The link and label switch to the new photo only once it is fully shown.
 */
function Tile({ photo, channel }: { photo: Photo; channel: ReturnType<typeof resolveChannel> }) {
  const [layers, setLayers] = useState<Layer[]>([{ photo, on: true }]);

  useEffect(() => {
    setLayers((ls) => (ls[ls.length - 1].photo.id === photo.id ? ls : [ls[ls.length - 1], { photo, on: false }]));
  }, [photo]);

  useEffect(() => {
    const top = layers[layers.length - 1];
    if (!top.on) {
      // Two frames: the new photo is painted at opacity 0 first, so the fade actually runs.
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setLayers((ls) => ls.map((l, k) => (k === ls.length - 1 ? { ...l, on: true } : l))));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    if (layers.length > 1) {
      const t = window.setTimeout(() => setLayers((ls) => ls.slice(-1)), FADE);
      return () => window.clearTimeout(t);
    }
  }, [layers]);

  // The bottom layer is the photo fully on screen; a fading-in photo takes over only when the fade ends.
  const settled = layers[0].photo;
  const href = channel
    ? linkFor(messaging, channel, settled.shareUrl ? { kind: "photo", label: settled.alt, url: settled.shareUrl } : { kind: "product", name: settled.alt.toLowerCase() })
    : undefined;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block rounded-md" aria-label={`Ask about this pair on WhatsApp: ${settled.alt}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-inverse-raised">
        <div className="absolute inset-0 transition-transform duration-300 motion-safe:group-hover:scale-[1.04]">
          {layers.map((l) => (
            <img
              key={l.photo.id}
              src={l.photo.src}
              srcSet={l.photo.srcSet}
              sizes={SIZES}
              width={l.photo.width}
              height={l.photo.height}
              alt={l.photo.id === settled.id ? settled.alt : ""}
              loading="lazy"
              style={{ transitionDuration: `${FADE}ms` }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity ${l.on ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        {/* WhatsApp badge sits on the photo, so the label below gets the full tile width on small phones */}
        <span aria-hidden="true" className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-tint text-black shadow-[0_0_0_3px_rgba(13,13,13,0.35)] transition-transform group-hover:scale-110">
          <PlatformIcon name="whatsapp" size={16} />
        </span>
      </div>
      {/* Style only on screen (Joshua, 15 Oct 2026); the colour-and-type description stays as alt text for screen readers */}
      <span className="label mt-3 block truncate !text-[14px] text-ink-inverse">{styles[settled.style]}</span>
    </a>
  );
}
