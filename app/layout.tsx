import type { Metadata, Viewport } from "next";
// Fonts ship with the site (no build-time download from Google).
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-800-italic.css";
import "@fontsource/archivo/latin-400.css";
import "@fontsource/archivo/latin-600.css";
import "./globals.css";

const description = "Unisex sneakers, corporate men's shoes, crocs and loafers. Fully boxed, nationwide delivery. Order on WhatsApp.";

// Set SITE_URL at build time so share previews get absolute URLs.
const siteUrl = process.env.SITE_URL;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "JIS SHOES NG | Sneakers, corporate shoes, crocs and loafers",
  description,
  openGraph: {
    title: "JIS SHOES NG | Energized in style",
    description,
    type: "website",
    images: [{ url: siteUrl ? `${siteUrl.replace(/\/$/, "")}/images/og-image.jpg` : "/images/og-image.jpg", width: 1200, height: 630, alt: "Four pairs from JIS SHOES NG" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: "48x48" },
      { url: `${basePath}/brand/icon-192.png`, type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: `${basePath}/brand/apple-touch-icon.png`, sizes: "180x180" }],
  },
};

export const viewport: Viewport = { themeColor: "#0d0d0d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. Grammarly) add attributes to <html>/<body> before React loads.
    // It only silences attribute differences on these two tags, not in the page content.
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
