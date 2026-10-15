import { business, heroPhotos, logo, offerings } from "@/lib/storefront";
import { CtaButton } from "./CtaButton";

const wrap = "mx-auto w-full max-w-layout px-4";

export function Header() {
  return (
    <header className={`${wrap} flex items-center justify-between gap-4 py-3`}>
      <a href="#hero" className="flex min-h-tap items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center bg-ink p-1.5">
          <img src={logo.mark.src} width={logo.mark.width} height={logo.mark.height} alt="" className="h-full w-auto" />
        </span>
        <span className="display text-[17px] leading-5">{business.name}</span>
        <span className="sr-only">, back to top</span>
      </a>
      <nav aria-label="Page sections" className="hidden tablet:block">
        <ul className="label flex gap-6 text-ink">
          <li><a className="inline-block py-3 hover:underline" href="#offerings">Shop</a></li>
          <li><a className="inline-block py-3 hover:underline" href="#gallery">Gallery</a></li>
          <li><a className="inline-block py-3 hover:underline" href="#contact">Order</a></li>
        </ul>
      </nav>
      <nav aria-label="Page sections" className="tablet:hidden">
        <a className="label inline-flex min-h-tap items-center hover:underline" href="#gallery">Gallery</a>
      </nav>
    </header>
  );
}

function Tile({ photo, className = "" }: { photo: (typeof heroPhotos)[number]; className?: string }) {
  return (
    <img
      src={photo.src.replace("-800.webp", "-480.webp")}
      srcSet={photo.srcSet}
      sizes="(min-width: 1024px) 280px, 50vw"
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  );
}

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className={`${wrap} grid gap-8 pb-10 pt-4 desktop:grid-cols-2 desktop:items-center desktop:gap-12 desktop:pt-8`}>
      <div className="max-w-content">
        <p className="label text-ink-muted">{business.delivery}</p>
        <h1 id="hero-title" className="display mt-3 text-[40px] leading-[42px] tablet:text-[56px] tablet:leading-[56px]">
          <span className="sr-only">{business.name}: </span>
          {business.headline}
        </h1>
        <p className="mt-4 max-w-[34rem] text-ink-muted">{business.intro}</p>
        <div className="mt-6 flex flex-col gap-3 tablet:flex-row">
          <CtaButton ctx={{ kind: "general" }} />
          <CtaButton ctx={{ kind: "general" }} channel="INSTAGRAM_DM" variant="secondary" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px border border-line bg-line">
        <div className="flex aspect-square items-center justify-center bg-ink p-6">
          <img src={logo.full.src} width={logo.full.width} height={logo.full.height} alt={logo.alt} fetchPriority="high" className="h-full w-auto" />
        </div>
        {heroPhotos.map((p) => (
          <Tile key={p.id} photo={p} />
        ))}
      </div>
    </section>
  );
}

export function Offerings() {
  return (
    <section id="offerings" aria-labelledby="offerings-title" className={`${wrap} border-t border-ink py-10`}>
      <h2 id="offerings-title" className="display text-[28px] leading-8">What we sell</h2>
      <p className="mt-2 text-[14px] leading-5 text-ink-muted">Tap DM for price to ask on WhatsApp. Ask for your size in the chat.</p>
      <ul className="mt-6 grid grid-cols-2 gap-px border border-line bg-line desktop:grid-cols-4">
        {offerings.map((o) => (
          <li key={o.id} className="flex flex-col bg-surface">
            <img
              src={o.photo.src}
              srcSet={o.photo.srcSet}
              sizes="(min-width: 1024px) 280px, 50vw"
              width={o.photo.width}
              height={o.photo.height}
              alt={o.photo.alt}
              loading="lazy"
              className="aspect-square h-auto w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-2 p-3 tablet:gap-3 tablet:p-4">
              <h3 className="display text-[15px] leading-5 tablet:text-lg tablet:leading-6">{o.name}</h3>
              <p className="text-[14px] leading-5 text-ink-muted tablet:text-[15px] tablet:leading-[22px]">{o.description}</p>
              <CtaButton ctx={{ kind: "product", name: o.name.toLowerCase() }} label="DM for price" variant="secondary" className="mt-auto w-full !px-2 !text-[12px] tablet:!text-[14px]" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** For pairs not in the gallery: the customer sends their own photo in the chat (WhatsApp links can't attach images). */
export function SendPicture() {
  return (
    <section aria-labelledby="send-picture-title" className={`${wrap} pb-10`}>
      <div className="flex flex-col gap-5 bg-brand-tint p-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:p-8">
        <div className="max-w-content">
          <h2 id="send-picture-title" className="display text-[24px] leading-[30px] text-ink">Don&apos;t see what you want?</h2>
          <p className="mt-2 text-ink">
            Send us a picture of your shoe choice directly on WhatsApp.
          </p>
        </div>
        <CtaButton ctx={{ kind: "picture" }} className="shrink-0 !px-4 !text-[13px] tablet:!px-6 tablet:!text-[14px]" />
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
    <section aria-labelledby="process-title" className={`${wrap} border-t border-ink py-10`}>
      <h2 id="process-title" className="display text-[28px] leading-8">How to order</h2>
      <ol className="mt-6 grid gap-px border border-line bg-line tablet:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="bg-surface p-5">
            <span className="display text-[32px] leading-8 text-ink">{i + 1}</span>
            <h3 className="display mt-3 text-lg leading-6">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-[22px] text-ink-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink text-surface">
      <div className={`${wrap} py-12`}>
        <h2 id="contact-title" className="display text-[28px] leading-8 text-on-brand">Ready to order?</h2>
        <p className="mt-2 max-w-content text-[#b3b3b3]">
          Send us the pair you want on WhatsApp. Price, size and delivery are arranged in the chat.
        </p>
        <div className="mt-6 flex flex-col gap-3 tablet:flex-row">
          <CtaButton ctx={{ kind: "general" }} className="!bg-brand-tint !text-ink hover:!bg-[#ffc533]" />
          <CtaButton ctx={{ kind: "general" }} channel="INSTAGRAM_DM" variant="secondary" className="!border-surface !bg-transparent !text-surface hover:!bg-[#222]" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-[#b3b3b3]">
      <div className={`${wrap} flex flex-col gap-6 border-t border-[#333] py-8 text-[14px] leading-5 tablet:flex-row tablet:items-center tablet:justify-between`}>
        <div className="flex items-center gap-4">
          <img src={logo.full.src} width={logo.full.width} height={logo.full.height} alt={logo.alt} loading="lazy" className="h-20 w-auto" />
          <div>
            <p>{business.delivery}</p>
            <p>WhatsApp {business.whatsappDisplay}</p>
          </div>
        </div>
        <ul className="flex gap-5" aria-label="Social profiles">
          {business.socials.map((s) => (
            <li key={s.label}>
              <a className="inline-block py-3 text-surface hover:underline" href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label} {s.handle}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
