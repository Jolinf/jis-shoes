"use client";

import { useState } from "react";
import { business, gallery, messaging, styles, type Style } from "@/lib/storefront";
import { linkFor, resolveChannel } from "@/lib/messaging";

const wrap = "mx-auto w-full max-w-layout px-4";
type Filter = "all" | Style;

/** Ruled photo grid with style filters. Each tile opens WhatsApp with a link to that photo (system/messaging-cta.md). */
export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const channel = resolveChannel(messaging);
  const counts = gallery.reduce<Record<string, number>>((acc, g) => ({ ...acc, [g.style]: (acc[g.style] ?? 0) + 1 }), {});
  const chips: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: gallery.length },
    ...(Object.keys(styles) as Style[]).filter((s) => counts[s]).map((s) => ({ key: s, label: styles[s], count: counts[s] })),
  ];
  const shown = gallery.filter((g) => filter === "all" || g.style === filter);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="border-t border-ink py-10">
      <div className={wrap}>
        <h2 id="gallery-title" className="display text-[28px] leading-8">Gallery</h2>
        <p className="mt-2 text-[14px] leading-5 text-ink-muted">
          {gallery.length} pairs from our catalogue. Tap a pair to ask about it on WhatsApp.
        </p>
        <div role="group" aria-label="Filter by style" className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={filter === c.key}
              onClick={() => setFilter(c.key)}
              className={`label min-h-[40px] shrink-0 rounded-button border px-4 ${
                filter === c.key ? "border-ink bg-brand-tint text-ink" : "border-line-strong bg-surface text-ink hover:border-ink"
              }`}
            >
              {c.label} <span className="font-normal">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`${wrap} mt-6`}>
      <ul className="grid grid-cols-2 gap-px border border-line bg-line tablet:grid-cols-3 desktop:grid-cols-5" aria-live="polite">
        {shown.map((g) => {
          const href = channel
            ? linkFor(messaging, channel, g.shareUrl ? { kind: "photo", label: g.alt, url: g.shareUrl } : { kind: "product", name: styles[g.style].toLowerCase() })
            : undefined;
          return (
            <li key={g.id} className="bg-surface">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block focus-visible:outline-offset-[-2px]"
                aria-label={`Ask about this pair on WhatsApp: ${g.alt}`}
              >
                <img
                  src={g.src}
                  srcSet={g.srcSet}
                  sizes="(min-width: 1024px) 224px, (min-width: 640px) 33vw, 50vw"
                  width={g.width}
                  height={g.height}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-[4/5] h-auto w-full bg-surface-sunken object-cover"
                />
                <span className="flex min-h-tap items-center justify-between gap-2 px-3">
                  <span className="label truncate text-ink-muted">{styles[g.style]}</span>
                  <span className="label shrink-0 text-ink group-hover:underline">
                    <span className="hidden tablet:inline">Ask&nbsp;</span>→
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      </div>

      <div className={`${wrap} mt-8`}>
        <div className="flex flex-col gap-4 border border-ink p-6 tablet:flex-row tablet:items-center tablet:justify-between">
          <div>
            <p className="display text-xl leading-7">View our entire collection on Telegram</p>
            <p className="mt-1 text-[14px] leading-5 text-ink-muted">New designs are posted on {business.telegram.handle}</p>
          </div>
          <a
            href={business.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the JIS SHOES NG Telegram channel (opens Telegram)"
            className="inline-flex min-h-tap shrink-0 items-center justify-center rounded-button border border-ink px-6 font-display text-[14px] font-bold uppercase italic leading-5 text-ink hover:bg-surface-sunken"
          >
            Open Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
