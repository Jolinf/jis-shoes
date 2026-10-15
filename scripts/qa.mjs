// Automated release checks for the static export (system/quality-checklist.md, messaging-cta.md §7).
// Run after `npm run build`:  node scripts/qa.mjs
import { readFileSync, statSync, readdirSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = join(process.cwd(), "out");
const html = readFileSync(join(OUT, "index.html"), "utf8");
const results = [];
const check = (severity, name, ok, detail = "") => results.push({ severity, name, ok, detail });
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

// Links
const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const hrefs = anchors.map((a) => decode(attr(a, "href") || ""));
const wa = hrefs.filter((h) => h.startsWith("https://wa.me/"));
check("critical", "WhatsApp links present", wa.length > 0, `${wa.length} links`);
for (const h of wa) {
  const u = new URL(h);
  const num = u.pathname.slice(1);
  const text = u.searchParams.get("text") || "";
  check("critical", `WhatsApp number is international (${num})`, /^234\d{10}$/.test(num));
  check("critical", "WhatsApp message has text and no unfilled placeholder", text.length > 0 && !/[{}]/.test(text), text.slice(0, 70));
}
const ig = hrefs.filter((h) => h.startsWith("https://ig.me/m/"));
check("high", "Instagram DM links use ig.me/m/<handle>", ig.every((h) => /^https:\/\/ig\.me\/m\/[A-Za-z0-9._]+$/.test(h)), `${ig.length} links`);

// Each product card's button names its product
const items = [...html.matchAll(/<li\b[^>]*>((?:(?!<\/li>)[\s\S])*)<\/li>/g)].map((m) => m[1]);
for (const item of items) {
  const name = (item.match(/<h3[^>]*>([^<]+)<\/h3>/) || [])[1];
  const href = (item.match(/href="(https:\/\/wa\.me\/[^"]+)"/) || [])[1];
  if (!name || !href) continue;
  const text = new URL(decode(href)).searchParams.get("text") || "";
  check("critical", `Card message names "${name}"`, text.toLowerCase().includes(decode(name).toLowerCase()));
}
// Gallery tiles: each WhatsApp link carries the URL of its own photo
const tiles = items.filter((i) => /Ask about this pair on WhatsApp/.test(i) && /wa\.me/.test(i));
const tileOk = tiles.filter((i) => {
  const id = (i.match(/images\/g\/([\d_]+)-/) || [])[1];
  const text = new URL(decode((i.match(/href="(https:\/\/wa\.me\/[^"]+)"/) || [])[1])).searchParams.get("text") || "";
  return id && text.includes(`/images/g/${id}-`) && /^https:\/\//.test(text.split(": ")[1] || "");
});
if (tiles.length) check("critical", "Every gallery tile's message links to its own photo", tileOk.length === tiles.length, `${tileOk.length}/${tiles.length}`);

// Anchors point to sections that exist
for (const h of hrefs.filter((h) => h.startsWith("#"))) {
  check("high", `Anchor ${h} has a target`, html.includes(`id="${h.slice(1)}"`));
}
// External links open safely
for (const a of anchors.filter((a) => /target="_blank"/.test(a))) {
  check("medium", `rel=noopener on ${attr(a, "href")}`, /rel="[^"]*noopener/.test(a));
}

// Banned labels and leftovers
const text = html.replace(/<[^>]+>/g, " ");
check("critical", "No transactional labels (Buy/Pay/Book/Order now)", !/\b(buy|pay|book|order) now\b/i.test(text));
check("critical", "Design-system placeholder colour not shipped", !readdirSync(join(OUT, "_next", "static", "css")).some((f) => readFileSync(join(OUT, "_next", "static", "css", f), "utf8").includes("#1f5c4a")));
check("high", "No placeholder copy", !/lorem ipsum|TODO|placeholder/i.test(text));

// Images
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
let eagerBytes = 0;
for (const i of imgs) {
  const src = attr(i, "src");
  // alt="" is allowed for decorative images (e.g. a logo next to the written business name)
  check("high", `alt attribute on ${src}`, attr(i, "alt") !== undefined);
  check("medium", `width/height on ${src}`, !!attr(i, "width") && !!attr(i, "height"));
  const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const file = join(OUT, (src || "").replace(BASE, ""));
  check("critical", `image file exists: ${src}`, existsSync(file));
  if (existsSync(file) && !/loading="lazy"/.test(i)) eagerBytes += statSync(file).size;
}

// Weight budget: HTML + CSS + JS + eager images under 1 MB
// Counts only the scripts and stylesheets this page references (uncompressed), not every file the build emitted.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const assets = [...html.matchAll(/<(?:script[^>]*\ssrc|link[^>]*rel="stylesheet"[^>]*\shref)="([^"]+)"/g)].map((m) => m[1]);
const assetBytes = [...new Set(assets)].reduce((n, a) => {
  const f = join(OUT, a.replace(BASE_PATH, ""));
  return n + (existsSync(f) ? statSync(f).size : 0);
}, 0);
const total = statSync(join(OUT, "index.html")).size + assetBytes + eagerBytes;
check("high", "Initial load under 1 MB (HTML + referenced CSS/JS + eager images, uncompressed)", total < 1024 * 1024, `${Math.round(total / 1024)} KB`);

// Share preview: absolute URL, not localhost
const og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1] || "";
check("critical", "og:image is an absolute public URL", /^https:\/\//.test(og) && !/localhost/.test(og), og || "missing");
// Share preview tags
for (const p of ["og:title", "og:description", "og:image"]) {
  check("critical", `${p} present`, new RegExp(`property="${p}"`).test(html));
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"} [${r.severity}] ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.some((r) => ["critical", "high"].includes(r.severity)) ? 1 : 0);
