"use client";

import { useEffect, useRef, useState } from "react";
import { business, heroFilms, logo, type HeroFilmConfig } from "@/lib/storefront";

/** After the film ends, the caption holds this long before the page moves on (full-screen only, and only if untouched). */
const HOLD_MS = 1800;
const LAST_KEY = "hero-film-last";

/*
 * Hero films (design system: structure-templates.md and ux-standards.md, "Hero film").
 * One 9:16 film per visit, picked at random by weight, never the same one twice in a row on a device.
 * - Portrait screens (phones, upright tablets): full-screen before the header  -> <HeroFilm />
 * - Landscape screens (desktops, laptops, sideways tablets): in a tall panel inside the hero -> <HeroMedia />
 * CSS decides which shell shows at first paint (portrait:/landscape:), so nothing jumps; only the visible one plays.
 */

let picked: HeroFilmConfig | null | undefined;
/** One pick per page load, shared by both layouts. */
function pickFilm(): HeroFilmConfig | null {
  if (picked !== undefined) return picked;
  if (!heroFilms.length) return (picked = null);
  let last: string | null = null;
  try {
    last = localStorage.getItem(LAST_KEY);
  } catch {}
  const pool = heroFilms.length > 1 ? heroFilms.filter((f) => f.id !== last) : heroFilms;
  const total = pool.reduce((n, f) => n + (f.weight ?? 1), 0);
  let r = Math.random() * total;
  picked = pool.find((f) => (r -= f.weight ?? 1) < 0) ?? pool[0];
  try {
    localStorage.setItem(LAST_KEY, picked.id);
  } catch {}
  return picked;
}

/** The film for this visit, if this layout is the one on screen; null before mount and in the other orientation. */
function useFilmFor(orientation: "portrait" | "landscape") {
  const [film, setFilm] = useState<HeroFilmConfig | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape)");
    const update = () => setFilm((mq.matches ? "landscape" : "portrait") === orientation ? pickFilm() : null);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [orientation]);
  return film;
}

/** Full-screen film before the header, on portrait screens. */
export function HeroFilm() {
  const film = useFilmFor("portrait");
  if (!heroFilms.length) return null;
  return (
    <section aria-label={film?.label ?? `${business.name} film`} className="band-dark relative h-[100svh] min-h-[480px] w-full overflow-hidden landscape:hidden">
      {film && <Player key={film.id} film={film} mode="screen" />}
      <img src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} alt={business.name} className="absolute left-4 top-4 z-10 h-12 w-auto tablet:left-6 tablet:top-6" />
    </section>
  );
}

/** Hero media column: the film in a tall panel on landscape screens; the photo composition (children) otherwise. */
export function HeroMedia({ children }: { children: React.ReactNode }) {
  const film = useFilmFor("landscape");
  if (!heroFilms.length) return <>{children}</>;
  return (
    <>
      <div className="landscape:hidden">{children}</div>
      <div className="relative mx-auto hidden aspect-[9/16] h-[min(78vh,680px)] max-w-full overflow-hidden rounded-md bg-surface-inverse-raised landscape:block">
        {film && <Player key={film.id} film={film} mode="panel" />}
      </div>
    </>
  );
}

function Player({ film, mode }: { film: HeroFilmConfig; mode: "screen" | "panel" }) {
  const video = useRef<HTMLVideoElement>(null);
  const touched = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [motion, setMotion] = useState(true);
  const [captionOn, setCaptionOn] = useState(false);
  const src = film.portrait;

  useEffect(() => {
    const v = video.current;
    if (!v) return;

    // No film for people who asked for less motion or less data: the poster (the film's last frame) and caption stand in.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      setMotion(false);
      setCaptionOn(true);
      return;
    }

    // Any sign the visitor has taken charge cancels the automatic move to the next section.
    const mark = () => (touched.current = true);
    const opts = { passive: true } as const;
    window.addEventListener("wheel", mark, opts);
    window.addEventListener("touchmove", mark, opts);
    window.addEventListener("keydown", mark);

    v.src = src.webm && v.canPlayType("video/webm") ? src.webm : src.mp4;

    // Start after the splash, so the arrival isn't hidden behind it.
    const start = () => v.play().then(() => setPlaying(true), () => setCaptionOn(true));
    const root = document.documentElement;
    if (root.classList.contains("no-splash") || root.classList.contains("splash-done")) start();
    else window.addEventListener("splash-done", start, { once: true });

    // The caption arrives with the pair.
    const onTime = () => v.currentTime >= film.captionAt && setCaptionOn(true);
    let hold = 0;
    const onEnd = () => {
      setPlaying(false);
      setCaptionOn(true);
      if (mode !== "screen") return; // In the panel the hero text and buttons are already on screen: nothing to move to.
      hold = window.setTimeout(() => {
        if (touched.current || window.scrollY > 40 || document.hidden) return;
        // Land on the header, so the logo and menu are the first thing seen after the film.
        document.getElementById("site-header")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, HOLD_MS);
    };
    // A missing WebM falls back to the MP4; if that fails too, the poster and caption still show.
    const onError = () => {
      if (src.webm && v.src.endsWith(".webm")) {
        v.src = src.mp4;
        v.play().then(() => setPlaying(true), () => setCaptionOn(true));
        return;
      }
      setCaptionOn(true);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    v.addEventListener("error", onError);
    return () => {
      window.clearTimeout(hold);
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
      window.removeEventListener("keydown", mark);
      window.removeEventListener("splash-done", start);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
      v.removeEventListener("error", onError);
    };
  }, [film, mode, src]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    touched.current = true;
    if (v.paused) v.play().then(() => setPlaying(true), () => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  const screen = mode === "screen";
  return (
    <>
      <video
        ref={video}
        muted
        playsInline
        preload="none"
        poster={src.poster}
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Shade top and bottom so the logo, caption and controls read on any frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.45),transparent_22%,transparent_55%,rgba(0,0,0,0.75))]" />

      {/* Caption: real text in the brand's display type, under the shoes, arriving as they land */}
      <p
        className={`display absolute text-center text-ink-inverse transition-[opacity,transform] duration-700 [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] motion-reduce:transition-none ${
          screen
            ? "inset-x-4 bottom-[104px] text-[44px] leading-[42px] tablet:bottom-[120px] tablet:text-[64px] tablet:leading-[60px]"
            : "inset-x-4 bottom-[76px] text-[36px] leading-[34px]"
        } ${captionOn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
      >
        {film.caption}
      </p>

      <div className={`absolute inset-x-0 bottom-0 flex items-end gap-3 px-4 ${screen ? "justify-between pb-[max(20px,env(safe-area-inset-bottom))] tablet:px-6" : "justify-end pb-4"}`}>
        {screen && (
          <a href="#site-header" className="label inline-flex min-h-tap items-center gap-2 rounded-button bg-brand-tint px-5 !text-[15px] text-ink hover:bg-[#ffc533]">
            Skip to the shop
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 12.5 2.5 7l1.1-1.1L8 10.3l4.4-4.4L13.5 7z" /></svg>
          </a>
        )}
        {motion && (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause film" : "Play film"}
            className="label inline-flex min-h-tap min-w-tap items-center justify-center gap-2 rounded-button border border-ink-inverse-muted bg-black/40 px-4 !text-[14px] text-ink-inverse"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              {playing ? <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" /> : <path d="M4 2.5v11l9-5.5z" />}
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
