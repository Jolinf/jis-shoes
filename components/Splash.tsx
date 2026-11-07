"use client";

import { useEffect, useRef, useState } from "react";
import { logo, splash } from "@/lib/storefront";

/** Counted from when the page started loading, not from when this script ran. */
const MIN_MS = 3000;
const MAX_MS = 5000;
const FADE_MS = 450;

/**
 * Splash screen (design system: structure-templates.md, ux-standards.md "Splash").
 * - Covers the page while it loads: shown at least 3 s, gone by 5 s at the latest, sooner on tap or key press.
 * - Once per tab session, and never under reduced motion (the gate script in app/layout.tsx adds `no-splash`).
 * - If the script never runs, a CSS fallback fades it out at 3.2 s, so the page can never get stuck behind it.
 * - Hidden from screen readers: the page underneath is complete and readable the whole time.
 */
export function Splash() {
  const [phase, setPhase] = useState<"on" | "leaving" | "gone">("on");
  const leaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-splash")) {
      setPhase("gone");
      return;
    }
    try {
      sessionStorage.setItem("splash-seen", "1");
    } catch {}
    let done = false;
    const leave = () => {
      if (done) return;
      done = true;
      setPhase("leaving");
      window.setTimeout(() => {
        setPhase("gone");
        root.classList.add("splash-done");
        window.dispatchEvent(new Event("splash-done"));
      }, FADE_MS);
    };
    leaveRef.current = leave;
    const ready = () => window.setTimeout(leave, Math.max(0, MIN_MS - performance.now()));
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    const cap = window.setTimeout(leave, Math.max(0, MAX_MS - performance.now()));
    const onKey = () => leave();
    window.addEventListener("keydown", onKey, { once: true });
    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("load", ready);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (phase === "gone") return null;
  return (
    <div
      aria-hidden="true"
      onPointerDown={() => leaveRef.current()}
      className={`splash fixed inset-0 z-[100] flex items-center justify-center transition-opacity ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}
      style={{ background: splash.background, transitionDuration: `${FADE_MS}ms` }}
    >
      {splash.video ? (
        <video autoPlay muted playsInline preload="auto" poster={logo.full.src} className="h-[min(60vh,420px)] w-auto">
          {splash.video.webm && <source src={splash.video.webm} type="video/webm" />}
          <source src={splash.video.mp4} type="video/mp4" />
        </video>
      ) : (
        <div className="splash-logo flex flex-col items-center">
          <img src={logo.full.src} width={logo.full.width} height={logo.full.height} alt="" className="h-[min(38vh,260px)] w-auto" />
          <span className="splash-line mt-6 block h-[3px] w-24 origin-left rounded-full bg-brand-tint" />
        </div>
      )}
    </div>
  );
}
