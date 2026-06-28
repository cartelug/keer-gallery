/* ============================================================
   Prerender per-artwork pages from js/site-data.js
   Generates art-<id>.html at the project root with correct,
   static social/SEO meta (so WhatsApp/Facebook previews work),
   while the page body still renders from site-data via components.js.

   Run:  npm run build:art       (or: node tools/prerender.mjs)
   Re-run after adding/editing artworks. Safe & idempotent.
   ============================================================ */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOMAIN = "https://keermathiang.com";

// Load site data (the file assigns window.KEER = {...})
const code = fs.readFileSync(path.join(ROOT, "js/site-data.js"), "utf8");
const win = {};
new Function("window", code)(win);
const D = win.KEER;
if (!D || !Array.isArray(D.artworks)) { console.error("Could not read artworks from site-data.js"); process.exit(1); }

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap";
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const typeLabel = a => a.type === "print" ? "Fine Art Print" : a.type === "drawing" ? "Original Drawing" : "Original Artwork";
const priceText = a => a.priceLabel ? a.priceLabel : a.price == null ? "Price on request" : Number.isInteger(a.price) ? "$" + a.price.toLocaleString("en-US") : "$" + a.price.toFixed(2);

function navAndMenu() {
  return `<nav class="nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo"><img src="assets/logo-gold.png" alt="Keer Art Gallery"><span class="nav-logo-text">Keer</span></a>
    <div class="nav-links">
      <a href="index.html">Home</a>
      <a href="works.html" class="active">Available Works</a>
      <a href="commissions.html">Commissions</a>
      <a href="pricing.html">Pricing</a>
      <a href="about.html">About</a>
      <a href="contact.html" class="nav-cta">Contact</a>
    </div>
    <div class="hamburger" aria-label="Menu"><span></span><span></span><span></span></div>
  </div>
</nav>
<div class="mobile-menu">
  <a href="index.html">Home</a><a href="works.html">Available Works</a><a href="commissions.html">Commissions</a><a href="pricing.html">Pricing</a><a href="about.html">About</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a>
</div>`;
}

function footer() {
  return `<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand"><img src="assets/logo-gold.png" alt="Keer Art Gallery"><div class="footer-brand-name">Keer Art Gallery</div><p class="footer-brand-desc">Original and commissioned artworks for collectors, homes, and creative spaces.</p></div>
      <div class="footer-col"><div class="footer-col-title">Gallery</div><ul><li><a href="index.html">Home</a></li><li><a href="works.html">Available Works</a></li><li><a href="commissions.html">Commissions</a></li><li><a href="pricing.html">Pricing &amp; Payments</a></li><li><a href="about.html">About</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li></ul></div>
      <div class="footer-col"><div class="footer-col-title">Legal</div><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms &amp; Conditions</a></li><li><a href="refund.html">Refund Policy</a></li><li><a href="shipping.html">Shipping Policy</a></li></ul></div>
      <div class="footer-col"><div class="footer-col-title">Connect</div><ul><li><a href="#">Instagram</a></li><li><a href="#">Facebook</a></li><li><a href="#">TikTok</a></li><li><a href="https://wa.me/" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="mailto:info@keermathiang.com">info@keermathiang.com</a></li></ul></div>
    </div>
    <div class="footer-bottom"><div class="footer-copy">© 2024 Keer Art Gallery. All rights reserved.</div><div class="footer-email"><a href="mailto:gabriel@keermathiang.com">gabriel@keermathiang.com</a></div></div>
  </div>
</footer>
<a href="https://wa.me/" class="whatsapp-btn" title="Chat on WhatsApp" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>`;
}

function pageFor(a) {
  const url = `${DOMAIN}/art-${a.id}.html`;
  const desc = (a.description || `${a.title} — ${typeLabel(a)} by Keer Art Gallery.`).slice(0, 180);
  const ogImage = a.image ? `${DOMAIN}/${a.image}` : `${DOMAIN}/assets/logo-gold-framed.png`;
  const ld = {
    "@context": "https://schema.org", "@type": "VisualArtwork",
    name: a.title, artMedium: a.medium, artform: typeLabel(a),
    image: ogImage, url, description: desc,
    creator: { "@type": "Organization", name: "Keer Art Gallery" }
  };
  if (a.size) ld.size = a.size;
  if (a.year) ld.dateCreated = String(a.year);
  if (typeof a.price === "number") {
    ld.offers = { "@type": "Offer", price: String(a.price), priceCurrency: "USD", url, availability: a.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock" };
  }
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.title)} — Keer Art Gallery</title>
<meta name="description" content="${esc(desc)}">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="stylesheet" href="css/style.css">
<!-- keer-head -->
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0a0a0a">
<meta name="author" content="Keer Art Gallery">
<link rel="apple-touch-icon" href="assets/logo-gold-framed.png">
<link rel="manifest" href="site.webmanifest">
<meta property="og:type" content="product">
<meta property="og:site_name" content="Keer Art Gallery">
<meta property="og:title" content="${esc(a.title)} — Keer Art Gallery">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:alt" content="${esc(a.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.title)} — Keer Art Gallery">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="${FONTS}">
<link rel="stylesheet" href="${FONTS}">
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>
</head>
<body class="solid-nav">
<a class="skip-link" href="#main">Skip to content</a>
<div class="preloader"><img src="assets/logo-gold.png" alt="Keer Art Gallery" class="preloader-logo"><div class="preloader-name">Keer Art Gallery</div><div class="preloader-bar"></div></div>
${navAndMenu()}
<main id="main">
<section class="section" style="padding-top:150px;">
  <div class="container">
    <div id="artworkDetail" data-art-id="${esc(a.id)}"></div>
  </div>
</section>
</main>
${footer()}
<script src="js/site-data.js"></script>
<script src="js/components.js"></script>
<script src="js/script.js"></script>
</body>
</html>
`;
}

// Clean old generated pages, then write fresh
for (const f of fs.readdirSync(ROOT)) {
  if (/^art-.*\.html$/.test(f)) fs.unlinkSync(path.join(ROOT, f));
}
let n = 0;
for (const a of D.artworks) { fs.writeFileSync(path.join(ROOT, `art-${a.id}.html`), pageFor(a)); n++; }

// Regenerate sitemap including artwork pages
const staticUrls = [
  ["/", "1.0", "weekly"], ["/works.html", "0.9", "weekly"], ["/commissions.html", "0.9", "monthly"],
  ["/pricing.html", "0.8", "monthly"], ["/about.html", "0.6", "yearly"], ["/faq.html", "0.6", "monthly"],
  ["/contact.html", "0.7", "yearly"], ["/privacy.html", "0.3", "yearly"], ["/terms.html", "0.3", "yearly"],
  ["/refund.html", "0.3", "yearly"], ["/shipping.html", "0.3", "yearly"]
];
const artUrls = D.artworks.map(a => [`/art-${a.id}.html`, "0.7", "monthly"]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.concat(artUrls).map(([loc, pr, cf]) => `  <url><loc>${DOMAIN}${loc}</loc><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

console.log(`Prerendered ${n} artwork page(s) + sitemap (${staticUrls.length + artUrls.length} urls).`);
