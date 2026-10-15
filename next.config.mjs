/** Static export: the storefront is one page with no server.
 *  NEXT_PUBLIC_BASE_PATH: set when the site lives in a sub-folder (GitHub Pages: "/<repo>"). Leave unset for a custom domain.
 *  SITE_URL: the public address; used for share previews and for photo links inside WhatsApp messages. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  poweredByHeader: false,
  outputFileTracingRoot: import.meta.dirname,
  env: { NEXT_PUBLIC_SITE_URL: (process.env.SITE_URL || "").replace(/\/$/, "") },
};

export default nextConfig;
