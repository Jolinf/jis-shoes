import { messaging } from "@/lib/storefront";
import { type Channel, type TemplateContext, labelFor, linkFor, resolveChannel } from "@/lib/messaging";
import { PlatformIcon } from "./Icons";

interface Props {
  ctx: TemplateContext;
  channel?: Channel;
  /** primary/secondary on light bands; gold/outline-inverse on dark bands. */
  variant?: "primary" | "secondary" | "gold" | "outline-inverse";
  label?: string;
  /** Show the platform mark before the label (off on small card buttons). */
  icon?: boolean;
  className?: string;
}

const base =
  "label inline-flex min-h-tap items-center justify-center gap-2 rounded-button px-6 !text-[16px] !leading-5 transition-colors";
const styles = {
  primary: "bg-brand text-on-brand hover:bg-[#2a2a2a]",
  secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-surface",
  gold: "bg-brand-tint text-ink hover:bg-[#ffc533]",
  "outline-inverse": "border border-ink-inverse-muted bg-transparent text-ink-inverse hover:border-ink-inverse hover:bg-surface-inverse-raised",
};


/** A messaging button built from the shared contract. Renders nothing when no verified channel exists. */
export function CtaButton({ ctx, channel, variant = "primary", label, icon = true, className = "" }: Props) {
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
      {icon && (
        // Platform marks only in black or white (design system README, Iconography)
        <span className={variant === "primary" ? "text-white" : variant === "secondary" || variant === "gold" ? "text-black" : "text-white"}>
          <PlatformIcon name={resolved === "WHATSAPP" ? "whatsapp" : "instagram"} />
        </span>
      )}
      {text}
    </a>
  );
}
