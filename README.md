# Keer Art Gallery — Website

A premium, multi-page website for Keer Art Gallery: original artworks, fine art
prints, and a custom commission builder with live pricing.

Domain: keermathiang.com

## Structure

```
keer-gallery/
├── index.html          Home (hero, featured works, commission preview, process)
├── works.html          Available Works (filterable gallery)
├── commissions.html    Commission builder with live price estimate
├── pricing.html        Pricing tables + payment methods
├── about.html          Gallery story, mission, vision
├── contact.html        Contact form + details
├── privacy.html        Privacy Policy
├── terms.html          Terms & Conditions
├── refund.html         Refund Policy
├── shipping.html       Shipping & Delivery Policy
├── css/
│   └── style.css       All site styling (single shared stylesheet)
├── js/
│   └── script.js       Preloader, scroll reveal, nav, commission builder
└── assets/
    ├── logo-gold.png       Gold lion mark (main, used site-wide)
    ├── logo-white.png      White mark (for dark backgrounds)
    ├── logo-black.png      Black mark (for light backgrounds)
    ├── logo-gold-framed.png  Gold mark on black square
    └── favicon.png         Site favicon
```

## Design

- **Palette:** black, white, and a refined gold accent (#c9a24d) drawn from the logo
- **Typography:** Cormorant Garamond (display serif) + Jost (sans-serif), via Google Fonts
- **Animations:** entrance preloader, scroll-reveal sections, hover micro-interactions,
  live commission price counter, floating logo, smooth nav transitions

## How to use

1. Open `index.html` in any browser — the site runs fully client-side, no build step.
2. To publish on WordPress/WooCommerce, treat these as design references, or host the
   static files directly and connect forms to your email/payment provider.

## Connecting it live (next steps)

The commission and contact forms are front-end demos. To make them functional:
- Wire form submissions to a backend or service (e.g. Formspree, WP Forms, or your host).
- Connect Flutterwave for online checkout; add bank + mobile money details to Pricing.
- Replace placeholder artwork tiles with real product images.
- Update social links and WhatsApp number (currently `https://wa.me/`).

## Notes

- All images are local (no external image dependencies); only Google Fonts loads remotely.
- Fully responsive down to mobile, with an animated hamburger menu.
