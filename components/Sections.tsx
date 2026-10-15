import { business, heroPhotos, logo, offerings, styleList } from "@/lib/storefront";
import { CtaButton } from "./CtaButton";
import { PlatformIcon } from "./Icons";

/* Design logic for every choice below: clients/jis-shoes-ng/design-logic.md */
const wrap = "mx-auto w-full max-w-layout px-4 tablet:px-6";

function Eyebrow({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "gold" | "ink" }) {
  const color = { muted: "text-ink-muted", gold: "text-brand-tint", ink: "text-ink" }[tone];
  return <p className={`label ${color}`}>{children}</p>;
}

export function Header() {
  return (
    <header className="band-dark">
      <p className="label bg-black px-4 py-2 text-center !text-[13px] text-brand-tint">
        {business.delivery} <span aria-hidden="true" className="px-1">•</span> WhatsApp {business.whatsappDisplay}
      </p>
      <div className={`${wrap} flex items-center justify-between gap-4 py-2`}>
        <a href="#hero" className="flex min-h-tap items-center gap-3">
          <img src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} alt="" className="h-10 w-auto" />
          <span className="display text-[22px] leading-6">{business.name}</span>
          <span className="sr-only">, back to top</span>
        </a>
        <nav aria-label="Page sections" className="hidden tablet:block">
          <ul className="label flex gap-7">
            <li><a className="inline-flex min-h-tap items-center text-ink-inverse-muted hover:text-ink-inverse" href="#offerings">Shop</a></li>
            <li><a className="inline-flex min-h-tap items-center text-ink-inverse-muted hover:text-ink-inverse" href="#gallery">Gallery</a></li>
            <li><a className="inline-flex min-h-tap items-center text-ink-inverse-muted hover:text-ink-inverse" href="#contact">Order</a></li>
          </ul>
        </nav>
        <nav aria-label="Page sections" className="tablet:hidden">
          <a className="label inline-flex min-h-tap items-center px-1 text-ink-inverse-muted hover:text-ink-inverse" href="#gallery">Gallery</a>
        </nav>
      </div>
    </header>
  );
}

export function Hero() {
  const [main, second] = heroPhotos;
  return (
    <section id="hero" aria-labelledby="hero-title" className="band-dark overflow-hidden">
      <div className={`${wrap} grid gap-10 pb-14 pt-8 desktop:grid-cols-[1.05fr_1fr] desktop:items-center desktop:gap-14 desktop:pb-20 desktop:pt-12`}>
        <div>
          <Eyebrow tone="gold">{business.tagline}</Eyebrow>
          <h1 id="hero-title" className="display mt-4 text-[56px] leading-[52px] tablet:text-[80px] tablet:leading-[72px] desktop:text-[96px] desktop:leading-[86px]">
            <span className="sr-only">{business.name}: </span>
            Shoes that make your fit <span className="text-brand-tint">shine</span>
          </h1>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[26px] text-ink-inverse-muted">{business.intro}</p>
          <div className="mt-8 flex flex-col gap-3 tablet:flex-row">
            <CtaButton ctx={{ kind: "general" }} variant="gold" />
            <CtaButton ctx={{ kind: "general" }} channel="INSTAGRAM_DM" variant="outline-inverse" />
          </div>
        </div>

        <div className="relative pb-10 pl-10 tablet:mx-auto tablet:max-w-[520px] desktop:max-w-none">
          <img
            src={main.src}
            srcSet={main.srcSet}
            sizes="(min-width: 1024px) 480px, 90vw"
            width={main.width}
            height={main.height}
            alt={main.alt}
            fetchPriority="high"
            className="aspect-[4/5] w-full rounded-md bg-surface-inverse-raised object-cover"
          />
          <img
            src={second.src.replace("-800.webp", "-480.webp")}
            width={second.width}
            height={second.height}
            alt={second.alt}
            className="absolute bottom-0 left-0 aspect-square w-[42%] rounded-md border-[6px] border-surface-inverse bg-surface-inverse-raised object-cover"
          />
          <p className="display absolute -right-1 -top-4 flex h-28 w-28 rotate-[8deg] items-center justify-center rounded-full bg-brand-tint p-3 text-center text-[19px] leading-[19px] text-ink tablet:h-32 tablet:w-32 tablet:text-[22px] tablet:leading-[22px]">
            Every pair fully boxed
          </p>
        </div>
      </div>
    </section>
  );
}

/** Gold strip naming every style: a factual divider between the dark hero and the light shop band. */
export function StyleStrip() {
  return (
    <div className="bg-brand-tint py-4">
      <ul aria-label="Styles we stock" className={`${wrap} display flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[22px] leading-7 text-ink tablet:text-[26px] tablet:leading-8`}>
        {styleList.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden="true" className="text-[14px]">✦</span>}
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Offerings() {
  return (
    <section id="offerings" aria-labelledby="offerings-title" className="band-light py-14 desktop:py-20">
      <div className={wrap}>
        <Eyebrow>Shop by style</Eyebrow>
        <h2 id="offerings-title" className="display mt-2 text-[44px] leading-[42px] tablet:text-[56px] tablet:leading-[52px]">What we sell</h2>
        <p className="mt-3 max-w-content text-ink-muted">Tap DM for price to ask on WhatsApp. Ask for your size in the chat.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 tablet:gap-4 desktop:grid-cols-4 desktop:gap-6">
          {offerings.map((o) => (
            <li key={o.id} className="group flex flex-col rounded-md bg-surface-raised p-2 tablet:p-3">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={o.photo.src}
                  srcSet={o.photo.srcSet}
                  sizes="(min-width: 1024px) 260px, 45vw"
                  width={o.photo.width}
                  height={o.photo.height}
                  alt={o.photo.alt}
                  loading="lazy"
                  className="aspect-square h-auto w-full bg-surface-sunken object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5 px-1 pb-1 pt-3 tablet:gap-2">
                <h3 className="display text-[22px] leading-6 tablet:text-[26px] tablet:leading-7">{o.name}</h3>
                <p className="text-[14px] leading-5 text-ink-muted tablet:text-[15px] tablet:leading-[22px]">{o.description}</p>
                <CtaButton ctx={{ kind: "product", name: o.name.toLowerCase() }} label="DM for price" variant="secondary" icon={false} className="mt-auto w-full !px-2" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** For pairs not in the gallery: the customer sends their own photo in the chat (WhatsApp links can't attach images). */
export function SendPicture() {
  return (
    <section aria-labelledby="send-picture-title" className="bg-brand-tint py-14 [--ring:#121212] desktop:py-16">
      <div className={`${wrap} flex flex-col gap-6 desktop:flex-row desktop:items-end desktop:justify-between`}>
        <div>
          <h2 id="send-picture-title" className="display text-[48px] leading-[46px] text-ink tablet:text-[64px] tablet:leading-[58px]">
            Don&apos;t see what you want?
          </h2>
          <p className="mt-3 max-w-content text-[17px] leading-[26px] text-ink">Send us a picture of your shoe choice directly on WhatsApp.</p>
        </div>
        <CtaButton ctx={{ kind: "picture" }} className="shrink-0 self-start desktop:self-auto" />
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    { title: "Pick a pair", text: "Browse the gallery here, or the full collection on our Telegram channel." },
    { title: "Message us on WhatsApp", text: "Tap a pair and WhatsApp opens with a link to that exact photo. Ask for your size and price in the chat." },
    { title: "Fully boxed, delivered", text: "Every pair comes fully boxed, with nationwide delivery." },
  ];
  return (
    <section aria-labelledby="process-title" className="band-light py-14 desktop:py-20">
      <div className={wrap}>
        <Eyebrow>Three steps</Eyebrow>
        <h2 id="process-title" className="display mt-2 text-[44px] leading-[42px] tablet:text-[56px] tablet:leading-[52px]">How to order</h2>
        <ol className="mt-8 grid gap-3 tablet:grid-cols-3 tablet:gap-4">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[auto_1fr] gap-x-5 rounded-md bg-surface-raised p-5 tablet:block tablet:p-6">
              <span aria-hidden="true" className="display row-span-2 block text-[52px] leading-[48px] text-transparent [-webkit-text-stroke:1.5px_#121212] tablet:text-[64px] tablet:leading-[56px]">
                0{i + 1}
              </span>
              <h3 className="display text-[24px] leading-7 tablet:mt-4 tablet:text-[26px]">{s.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[22px] text-ink-muted tablet:mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="band-dark py-16 desktop:py-24">
      <div className={`${wrap} grid gap-10 desktop:grid-cols-[1fr_auto] desktop:items-center`}>
        <div>
          <Eyebrow tone="gold">{business.delivery}</Eyebrow>
          <h2 id="contact-title" className="display mt-3 text-[56px] leading-[52px] tablet:text-[80px] tablet:leading-[72px]">
            Ready to <span className="text-brand-tint">order?</span>
          </h2>
          <p className="mt-4 max-w-content text-[17px] leading-[26px] text-ink-inverse-muted">
            Send us the pair you want on WhatsApp. Price, size and delivery are arranged in the chat.
          </p>
          <div className="mt-8 flex flex-col gap-3 tablet:flex-row">
            <CtaButton ctx={{ kind: "general" }} variant="gold" />
            <CtaButton ctx={{ kind: "general" }} channel="INSTAGRAM_DM" variant="outline-inverse" />
          </div>
        </div>
        <img src={logo.full.src} width={logo.full.width} height={logo.full.height} alt="" loading="lazy" className="hidden h-72 w-auto desktop:block" />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-black text-ink-inverse-muted [--ring:#f8b20f]">
      <div className={`${wrap} flex flex-col gap-6 border-t border-line-inverse py-8 text-[14px] leading-5 tablet:flex-row tablet:items-center tablet:justify-between`}>
        <div className="flex items-center gap-4">
          <img src={logo.full.src} width={logo.full.width} height={logo.full.height} alt={logo.alt} loading="lazy" className="h-20 w-auto" />
          <div>
            <p className="text-ink-inverse">{business.delivery}</p>
            <p>WhatsApp {business.whatsappDisplay}</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-6" aria-label="Social profiles">
          {business.socials.map((s) => (
            <li key={s.label}>
              <a className="inline-flex min-h-tap items-center gap-2 text-ink-inverse hover:text-brand-tint" href={s.url} target="_blank" rel="noopener noreferrer">
                <span className="text-white"><PlatformIcon name={s.label === "Telegram" ? "telegram" : "instagram"} /></span>
                {s.label} {s.handle}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
