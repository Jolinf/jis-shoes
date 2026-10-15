/**
 * Shared messaging CTA contract (system/messaging-cta.md).
 * Every messaging button on the page gets its link and label from here.
 */

export type Channel = "WHATSAPP" | "INSTAGRAM_DM";

export interface MessagingConfig {
  primaryChannel: Channel;
  whatsappNumber?: string; // international digits only, e.g. 2347026987717
  instagramUsername?: string; // handle without @
  secondaryChannel?: Channel;
  verifiedOn: string;
}

export type TemplateContext =
  | { kind: "general" }
  | { kind: "product"; name: string; price?: string }
  | { kind: "photo"; label: string; url: string } // a gallery photo; the link lets the seller see the exact pair
  | { kind: "picture" }; // customer will attach their own photo in the chat (wa.me links cannot carry images)

const WHATSAPP_NUMBER = /^[1-9]\d{10,14}$/;
const INSTAGRAM_HANDLE = /^[A-Za-z0-9._]{1,30}$/;

export function messageFor(ctx: TemplateContext): string {
  if (ctx.kind === "general") {
    return "Hi, I found you through your website and I'd like to make an enquiry.";
  }
  if (ctx.kind === "picture") {
    return "Hi, I found you through your website. I'd like to send you a picture of the pair I want.";
  }
  if (ctx.kind === "photo") {
    return `Hi, I saw this pair on your website and I'm interested: ${ctx.url} Please let me know if it's available and how I can place an order.`;
  }
  const item = ctx.price ? `${ctx.name} (${ctx.price})` : ctx.name;
  return `Hi, I saw the ${item} on your website and I'm interested. Please let me know if it's available and how I can place an order.`;
}

export function hasChannel(cfg: MessagingConfig, channel: Channel): boolean {
  if (channel === "WHATSAPP") return !!cfg.whatsappNumber && WHATSAPP_NUMBER.test(cfg.whatsappNumber);
  return !!cfg.instagramUsername && INSTAGRAM_HANDLE.test(cfg.instagramUsername);
}

/** Resolves the channel to use: primary if valid, else a verified secondary, else none (no button). */
export function resolveChannel(cfg: MessagingConfig, preferred?: Channel): Channel | null {
  const order = [preferred ?? cfg.primaryChannel, cfg.primaryChannel, cfg.secondaryChannel].filter(
    (c): c is Channel => !!c,
  );
  return order.find((c) => hasChannel(cfg, c)) ?? null;
}

export function linkFor(cfg: MessagingConfig, channel: Channel, ctx: TemplateContext): string {
  if (channel === "WHATSAPP") {
    return `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(messageFor(ctx))}`;
  }
  // Instagram DM links cannot carry prefilled text.
  return `https://ig.me/m/${cfg.instagramUsername}`;
}

export function labelFor(channel: Channel, ctx: TemplateContext): string {
  if (channel === "WHATSAPP") return ctx.kind === "general" ? "Order on WhatsApp" : ctx.kind === "picture" ? "Send a picture on WhatsApp" : "Ask about this";
  return ctx.kind === "general" ? "Message us on Instagram" : "Ask on Instagram";
}
