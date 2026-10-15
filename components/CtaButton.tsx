import { messaging } from "@/lib/storefront";
import { type Channel, type TemplateContext, labelFor, linkFor, resolveChannel } from "@/lib/messaging";

interface Props {
  ctx: TemplateContext;
  channel?: Channel;
  variant?: "primary" | "secondary";
  label?: string;
  className?: string;
}

const base =
  "inline-flex min-h-tap items-center justify-center gap-2 rounded-button px-6 font-display text-[14px] font-bold uppercase italic leading-5 tracking-[0.02em] transition-colors";
const styles = {
  primary: "bg-brand text-on-brand hover:bg-[#2a2a2a]",
  secondary: "border border-ink bg-surface text-ink hover:bg-surface-sunken",
};

/** A messaging button built from the shared contract. Renders nothing when no verified channel exists. */
export function CtaButton({ ctx, channel, variant = "primary", label, className = "" }: Props) {
  const resolved = resolveChannel(messaging, channel);
  if (!resolved) return null;
  const text = label ?? labelFor(resolved, ctx);
  const subject =
    ctx.kind === "product" ? `: ${ctx.name}` : ctx.kind === "photo" ? `: ${ctx.label}` : ctx.kind === "picture" ? ", to send a picture of the pair you want" : "";
  return (
    <a
      href={linkFor(messaging, resolved, ctx)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${text}${subject} (opens ${resolved === "WHATSAPP" ? "WhatsApp" : "Instagram"})`}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {text}
    </a>
  );
}
