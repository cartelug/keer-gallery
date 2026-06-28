# Keer Art Gallery — Website

A premium, multi‑page website for Keer Art Gallery: original artworks, fine‑art
prints, and a custom commission builder with live pricing. Static HTML/CSS/JS —
no build step, hostable anywhere.

**Domain:** keermathiang.com

> **Owner / editor?** Start with **[`docs/HANDOVER.md`](docs/HANDOVER.md)** — it shows
> how to update everything by editing one file. For the full engineering & design
> roadmap, see **[`docs/PROJECT-PLAN.md`](docs/PROJECT-PLAN.md)**.

## Edit everything in one place

All content — contact details, WhatsApp number, social links, prices, artworks,
FAQs and testimonials — lives in **`js/site-data.js`**. Change it there and it
updates across the whole site automatically. No other files need editing for
day‑to‑day updates.

## Structure

```
keer-gallery/
├── index.html            Home (hero, trust, featured works, commission, testimonials, FAQ, newsletter)
├── works.html            Available Works (data‑driven gallery + filters + lightbox)
├── commissions.html      Commission builder with live price estimate
├── pricing.html          Pricing tables + payment methods (from data)
├── about.html            Gallery story, mission, vision
├── faq.html              Frequently asked questions
├── contact.html          Contact form + details
├── privacy / terms / refund / shipping .html    Legal
├── 404.html              Friendly not‑found page
├── sitemap.xml · robots.txt · site.webmanifest  SEO / PWA
├── css/style.css         All styling (design tokens at the top)
├── js/
│   ├── site-data.js      ★ Single source of truth — edit this
│   ├── components.js     Renders sections + wires links (no edit needed)
│   └── script.js         Core UI (preloader, nav, menu, scroll reveal)
├── assets/
│   ├── logo-*.png · favicon.png
│   └── works/            Drop artwork photos here (see its README)
└── docs/
    ├── HANDOVER.md       How to run, update, publish, and the go‑live checklist
    └── PROJECT-PLAN.md   Full front‑end engineering & design plan (phases → handover)
```

## Design

- **Palette:** black, white, and a refined gold accent (`#c9a24d`) from the logo
- **Type:** Cormorant Garamond (display serif) + Jost (sans), via Google Fonts
- **Motion:** preloader (once per session), scroll‑reveal, hover micro‑interactions,
  live commission price counter — all disabled under `prefers-reduced-motion`
- **Built in:** data‑driven galleries, artwork lightbox, FAQ accordion, working
  forms (WhatsApp + email), full SEO (OG/Twitter/JSON‑LD), PWA manifest,
  accessibility (skip link, ARIA, labels, focus, keyboard), sitemap & robots

## Run it locally

It’s static — open `index.html` in a browser. For an exact preview of hosted
behaviour, serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Forms

Forms work out of the box: they open WhatsApp (or email) pre‑filled. To also
receive submissions by email, paste a free key from https://web3forms.com into
`forms.web3formsKey` in `js/site-data.js`. See `docs/HANDOVER.md`.

## Going live

Host the static files on Netlify, Cloudflare Pages, GitHub Pages, or any web host,
then point `keermathiang.com` at it and enable HTTPS. Full steps and the go‑live
checklist are in `docs/HANDOVER.md`.
