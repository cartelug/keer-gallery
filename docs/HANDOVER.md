# Keer Art Gallery — Design, Completion & Handover Plan

**Domain:** keermathiang.com · **Owner:** Gabriel · **Status:** Ready for content + go‑live
**Last updated:** 2026‑06‑28

This single document is the full plan from design through the moment the site is
handed to Keer. It explains what the site is, what was built, how to run it, and —
most importantly — the short list of things **only you can provide** to take it live.

---

## 1. What this website is

A premium, fully‑responsive marketing + catalogue site for an art gallery that sells:

- **Original artworks** (one‑of‑a‑kind pieces)
- **Fine‑art prints** (multiple sizes)
- **Custom commissions** via an interactive builder with live price estimates

It is a **static website** — plain HTML, CSS and JavaScript. There is no server to
maintain, no database, and no build step. That makes it cheap to host, fast, secure,
and easy to hand over.

---

## 2. Design system

| Element | Choice |
|---|---|
| **Palette** | True black `#0a0a0a`, white, warm off‑whites, and a refined gold accent `#c9a24d` drawn from the logo |
| **Type** | *Cormorant Garamond* (display serif) + *Jost* (sans‑serif), via Google Fonts |
| **Voice** | Confident, collectible, personal — “gallery”, not “shop” |
| **Motion** | Entrance preloader (once per visit), scroll‑reveal, hover micro‑interactions, live price counter — all disabled automatically for visitors who prefer reduced motion |
| **Layout** | 1320px max content width, generous whitespace, editorial grids |

All colours, spacing and type live as CSS variables at the top of `css/style.css`
(`:root { … }`), so the whole site can be re‑skinned from one place.

---

## 3. What was completed in this pass

The site was already beautifully designed. This pass closed the gap between
“looks finished” and “**is** finished and ready to hand over”:

**Made it maintainable**
- Added a single source of truth — **`js/site-data.js`** — for all business info,
  contact details, social links, prices, artworks, FAQs and testimonials.
- Built **`js/components.js`** to render the galleries, lightbox, FAQ, testimonials,
  commission builder and pricing tables from that data, and to auto‑wire every
  WhatsApp / social / email link and the copyright year on every page.

**Made it work**
- Contact + commission forms now actually **send** — they open WhatsApp (or email)
  pre‑filled, and can deliver straight to your inbox once a free key is added.
- Fixed the commission builder (category bug, the “what to draw” step now flows
  into the request) and made it data‑driven so prices never drift from the
  Pricing page.
- Added an **artwork lightbox** (quick‑view with Inquire/Buy), working filters,
  and an FAQ accordion.

**Made it findable & shareable**
- Per‑page SEO: Open Graph + Twitter cards, canonical URLs, `ArtGallery` and
  `FAQPage` structured data (JSON‑LD), plus `sitemap.xml` and `robots.txt`.
- PWA basics: `site.webmanifest`, theme colour, apple‑touch‑icon.

**Made it solid & inclusive**
- Accessibility: skip link, ARIA on the menu, labelled & required form fields,
  visible focus styles, keyboard support, reduced‑motion handling.
- Performance: fonts preconnect/preload instead of a render‑blocking import;
  preloader only plays once per session.
- Added a branded **404 page**, a new **FAQ page**, testimonials, a trust strip,
  and a newsletter sign‑up.

---

## 4. File structure

```
keer-gallery/
├── index.html            Home
├── works.html            Available Works (data‑driven gallery + filters)
├── commissions.html      Commission builder (live pricing)
├── pricing.html          Pricing tables + payment methods
├── about.html            Gallery story, mission, vision
├── faq.html              Frequently asked questions
├── contact.html          Contact form + details
├── privacy.html / terms.html / refund.html / shipping.html   Legal
├── 404.html              Friendly “not found” page
├── sitemap.xml · robots.txt · site.webmanifest                SEO / PWA
├── css/style.css         All styling (CSS variables at the top)
├── js/
│   ├── site-data.js      ← ★ THE ONLY FILE YOU EDIT for normal updates
│   ├── components.js     Renders sections + wires links (no need to edit)
│   └── script.js         Core UI (preloader, nav, menu, reveal)
└── assets/
    ├── logo-gold.png / logo-white.png / logo-black.png / logo-gold-framed.png
    ├── favicon.png
    └── works/            ← drop artwork photos here (see its README)
```

---

## 5. How to update the site (no coding needed)

**Everything below is edited in one file: `js/site-data.js`.** Open it in any text
editor. Change the text between the quotes; keep the quotes and commas.

### 5.1 Contact details & WhatsApp
```js
contact: {
  email: "info@keermathiang.com",
  businessEmail: "gabriel@keermathiang.com",
  whatsapp: "256700123456",     // full international format, digits only
  phoneDisplay: "+256 700 123 456"
}
```
The moment a WhatsApp number is set, every “WhatsApp” link, the floating green
button, the artwork **Inquire/Buy** buttons, and both forms start sending to it.

### 5.2 Social links
```js
social: {
  instagram: "https://instagram.com/keerartgallery",
  facebook:  "https://facebook.com/keerartgallery",
  tiktok:    "https://tiktok.com/@keerartgallery"
}
```
Empty links are hidden automatically, so there are never dead “#” links.

### 5.3 Add or edit an artwork
Copy one block in the `artworks: [ … ]` list, paste it, and edit it:
```js
{
  id: "sunset-study",
  title: "Sunset Study",
  type: "original",          // original | print | drawing
  medium: "Acrylic",
  size: "24×30 in",
  year: 2026,
  price: 850,                 // a number, or null for “Price on request”
  status: "available",        // available | sold | reserved
  featured: true,             // show on the home page
  image: "assets/works/sunset-study.jpg",   // "" shows a placeholder
  accent: "#E2DED5",
  description: "A warm acrylic study of dusk over the lake."
}
```
Then drop the photo into `assets/works/`. Mark a piece sold by changing
`status` to `"sold"`. See `assets/works/README.md` for photo tips.

### 5.4 Prices (commission builder + pricing page)
Edit the numbers under `commission:`. The live builder **and** the Pricing page
table update together — they can never disagree.

### 5.5 FAQs & testimonials
Edit the `faqs` and `testimonials` lists. They appear on the FAQ page, the home
page, and (for FAQs) in Google’s structured data.

---

## 6. Make the forms land in your inbox (optional, ~2 minutes)

By default, forms open WhatsApp/email pre‑filled — which already works. To also
receive a clean email copy of every submission:

1. Go to **https://web3forms.com**, enter your email, copy the **Access Key**.
2. Paste it into `js/site-data.js`:
   ```js
   forms: { web3formsKey: "your-access-key-here" }
   ```
That’s it — no account, no cost, no backend. Contact, commission and newsletter
forms will email you automatically.

---

## 7. Publishing the site (go‑live)

The site is static, so any static host works. Recommended options:

| Host | Why | Notes |
|---|---|---|
| **Netlify** (recommended) | Free, drag‑and‑drop, custom domain + free SSL, instant deploys | `404.html` works automatically |
| **Cloudflare Pages** | Free, very fast globally, great in Africa/Europe | Connect this GitHub repo |
| **GitHub Pages** | Free, lives next to the code | `404.html` works automatically |
| **Any cPanel / shared host** | Upload files via FTP to `public_html` | Classic option |

**Domain:** point `keermathiang.com` (and `www`) at your chosen host per their
docs, and enable HTTPS (one click on Netlify/Cloudflare/Pages).

After go‑live:
- Submit `https://keermathiang.com/sitemap.xml` in **Google Search Console**.
- Test a social share at the [Facebook Sharing Debugger] and [Twitter Card Validator]
  to confirm the preview image looks right.

[Facebook Sharing Debugger]: https://developers.facebook.com/tools/debug/
[Twitter Card Validator]: https://cards-dev.twitter.com/validator

---

## 8. ✅ Handover checklist — what only Keer can provide

Structurally the site lacks nothing. To switch it fully “on”, fill these in
(`js/site-data.js` unless noted). Each takes a minute:

- [ ] **WhatsApp number** → `contact.whatsapp`
- [ ] **Instagram / Facebook / TikTok links** → `social`
- [ ] **Real artwork photos** → drop into `assets/works/`, set each `image:`
- [ ] **Confirm prices** are current → `artworks` + `commission`
- [ ] **(Optional) Web3Forms key** so forms email you → `forms.web3formsKey`
- [ ] **(Optional) Bank / Mobile Money details** to share with buyers on request
- [ ] **(Recommended) A proper share image** 1200×630 → save as
      `assets/og-image.png` and update the `og:image` / `twitter:image` tags
      (currently the framed logo is used — fine, but a photo converts better)
- [ ] **Choose a host & connect the domain** (Section 7), enable HTTPS
- [ ] **Submit the sitemap** to Google Search Console

When the top three boxes are ticked, the site is fully live and selling.

---

## 9. Testing your changes locally

Because it’s static, just open `index.html` in a browser. For an exact preview of
how links/paths behave when hosted, run a tiny local server from the project folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Always test on a phone screen too (your browser’s device‑preview is enough).

---

## 10. Roadmap — nice‑to‑haves beyond handover

These are intentionally **not** required for launch, listed so nothing is forgotten:

- **Online checkout**: embed Flutterwave payment buttons / links per artwork
  (the data model already holds prices and IDs).
- **Per‑artwork pages** for deeper SEO (currently a quick‑view lightbox).
- **Blog / “Studio notes”** for SEO and storytelling.
- **Google Analytics or Plausible** (the Privacy page already discloses analytics).
- **Multi‑currency display** (USD ↔ UGX) for local buyers.
- **Image optimisation** to WebP for even faster loading.

---

## 11. Quick reference

- **Update anything** → `js/site-data.js`
- **Restyle** → CSS variables at the top of `css/style.css`
- **Add a page** → copy `faq.html`, change the content, link it in the nav/footer
- **Questions about the build** → it’s all commented in `site-data.js` and `components.js`

The site is complete, tested across desktop and mobile, and waiting only for your
photos and contact details. Welcome to Keer Art Gallery, online.
