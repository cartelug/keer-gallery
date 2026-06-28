# Keer Art Gallery — Front‑End Engineering & Design Plan

**Author:** Senior Front‑End Engineer · **Domain:** keermathiang.com
**Status:** Phase 1 shipped & verified (20/20 functional checks) · **Updated:** 2026‑06‑28

This is the complete plan to take Keer Art Gallery from “great‑looking template”
to a **production, conversion‑ready, accessible, fast, sellable** product — and to
hand it to Keer with nothing missing. It is written as an engineering plan: phases,
deliverables, acceptance criteria, budgets, and the exact decisions/assets needed.

---

## 0. Executive summary

- **Where we started:** a beautiful but static, hard‑coded, demo‑only marketing site.
  Forms didn’t send; every WhatsApp/social link was dead; artworks were CSS
  placeholders; no SEO/PWA/a11y; content duplicated across 10 files.
- **Where we are now (Phase 1, done):** a single‑source‑of‑truth data layer, a
  data‑driven gallery + lightbox, working forms (WhatsApp + email), full
  SEO/Open‑Graph/JSON‑LD, PWA manifest, WCAG‑minded a11y, reduced‑motion,
  FAQ + testimonials + trust + newsletter, 404, sitemap/robots — verified in a
  real browser (Chromium) with 20/20 interactive checks passing.
- **Where we’re going:** real imagery, online payments (Flutterwave), analytics +
  conversion optimisation, automated quality gates, and a clean launch — each phase
  independently shippable.

**North‑star metric:** qualified enquiries & sales per 100 visitors (commission
requests + artwork purchases). Every phase ladders up to that.

---

## 1. Goals & success criteria

| Lens | Goal | Measure / target |
|---|---|---|
| Business | Turn visits into enquiries & sales | ≥ 4% visitor→enquiry; WhatsApp/email/checkout all working |
| Brand | Feel like a premium gallery | Consistent gold/black system, real artwork, no placeholders at launch |
| UX | Effortless on any device | ≤ 2 taps to enquire from any artwork; mobile‑first |
| Performance | Fast on Ugandan mobile networks | Lighthouse ≥ 90 all categories; LCP < 2.5s on 4G; CLS < 0.1 |
| Accessibility | Usable by everyone | WCAG 2.2 AA; full keyboard; visible focus; SR‑tested |
| SEO | Found for “art gallery / commission Uganda” | Indexed, rich results valid, sitemap submitted |
| Maintainability | Owner edits without a developer | All content changes in one file; documented |

---

## 2. Discovery & audit (findings → resolution)

| # | Finding | Severity | Resolution | Phase |
|---|---|---|---|---|
| 1 | Content duplicated across 10 HTML files | High (maintainability) | `js/site-data.js` single source of truth | ✅ 1 |
| 2 | Forms were demo‑only | High | WhatsApp deep‑link + Web3Forms email | ✅ 1 |
| 3 | 55 dead links (`wa.me/`, `#`) | High | Auto‑wired from data; empties hidden | ✅ 1 |
| 4 | Artworks were gradients, no image system | High | Data‑driven cards w/ graceful placeholders | ✅ 1 |
| 5 | Commission builder bug + drift vs Pricing | Med | Rebuilt data‑driven; single price source | ✅ 1 |
| 6 | No SEO/OG/JSON‑LD/sitemap/robots | High | Added across all pages | ✅ 1 |
| 7 | No PWA/manifest/app icons | Med | `site.webmanifest`, theme, touch icon | ✅ 1 |
| 8 | A11y gaps (labels, ARIA, focus, motion) | High | Skip link, ARIA, labels, focus, reduced‑motion | ✅ 1 |
| 9 | Preloader blocks every load; render‑blocking font import | Med | Once/session preloader; preconnect+preload fonts | ✅ 1 |
| 10 | `© 2024`, no 404, no FAQ | Low | Dynamic year, 404 page, FAQ page | ✅ 1 |
| 11 | **No real photography** | High | Image pipeline + drop‑in slots | ⏳ 2 |
| 12 | **No online checkout** | High | Flutterwave integration | ⏳ 4 |
| 13 | No analytics/measurement | Med | Plausible/GA4 + events | ⏳ 5 |
| 14 | No automated tests/CI | Med | Playwright + HTML/link/Lighthouse CI | ⏳ 6 |

---

## 3. Design system

**Foundations (already tokenised in `css/style.css :root`)**
- **Colour:** `--black #0a0a0a`, `--true-black #000`, off‑whites, `--gold #c9a24d`
  (+ light/dark variants). Roles: gold = accent/CTA, black = canvas, white = surface.
- **Type:** Cormorant Garamond (display) + Jost (UI). Proposed modular scale (1.25):
  0.7 · 0.8 · 1 · 1.25 · 1.563 · 1.953 · 2.441 · 3.052 rem.
- **Spacing:** 8‑pt base; section rhythm 120/80px (desktop/mobile).
- **Motion:** `--ease` curves; entrance, reveal, hover; **all** gated by
  `prefers-reduced-motion`.
- **Elevation:** soft gold‑tinted shadows for hover lift only.

**Component inventory (built ✅ / planned ⏳)**
Nav + scrolled state ✅ · Mobile menu ✅ · Hero ✅ · Buttons (gold/outline/light) ✅ ·
Artwork card ✅ · Artwork lightbox ✅ · Filter bar ✅ · Commission builder ✅ ·
Pricing tables ✅ · Payment cards ✅ · Forms (validated) ✅ · FAQ accordion ✅ ·
Testimonials ✅ · Trust strip ✅ · Newsletter ✅ · Footer ✅ · WhatsApp float ✅ ·
404 ✅ · Toast/inline form status ✅ · ⏳ Image gallery w/ zoom · ⏳ Cart/checkout ·
⏳ Cookie/consent banner · ⏳ Breadcrumbs · ⏳ Per‑artwork page template.

**Deliverable:** a one‑page living style guide (`/styleguide.html`) rendering every
component from tokens (Phase 3) so brand stays consistent as content grows.

---

## 4. Information architecture & journeys

```
Home ─┬─ Available Works ─→ (Artwork quick‑view) ─→ Inquire/Buy
      ├─ Commissions (builder) ─→ Quote ─→ Submit ─→ WhatsApp/Email/Checkout
      ├─ Pricing & Payments
      ├─ About · FAQ
      └─ Contact            Legal: Privacy · Terms · Refund · Shipping
```
**Primary journeys & success state**
1. *Browse → buy a print:* Works → quick‑view → Inquire/Buy → payment.
2. *Commission a portrait:* Commissions → upload + options → live price → submit.
3. *Just ask:* any page → WhatsApp float / Contact → reply < 24h.

Each journey is ≤ 3 steps and reachable from every page (nav + float + footer).

---

## 5. Code architecture

**Current (Phase 1) — intentionally build‑free, host‑anywhere**
```
js/site-data.js   data (owner edits)         ← single source of truth
js/components.js  render + wire + behaviour  ← galleries, lightbox, forms, builder
js/script.js      foundational UI            ← preloader, nav, menu, reveal
css/style.css     tokens + components
```
Rendering is progressive: HTML ships the shell; `components.js` hydrates data
sections; everything degrades to a `<noscript>`/contact fallback.

**Target (as needs grow, optional)**
- Keep zero‑build for the owner, but add an **optional build** (Vite) for:
  image optimisation (responsive `srcset`/WebP/AVIF), CSS/JS minification +
  hashing, and a tiny templating step to remove nav/footer duplication.
- Component contracts documented; data validated at load (dev‑only console warnings
  for malformed artwork entries).

---

## 6. Phased roadmap

> Each phase is independently shippable and reversible. ✅ = done, ⏳ = planned.

### Phase 1 — Foundation & completion ✅ (shipped, verified)
Data layer, data‑driven galleries + lightbox, working forms, SEO/OG/JSON‑LD,
PWA, a11y baseline, reduced‑motion, FAQ/testimonials/trust/newsletter, 404,
sitemap/robots, handover docs. **Acceptance:** 20/20 browser checks pass; no
console errors; all links resolve. **Met.**

### Phase 2 — Real content & media pipeline ⏳
- Drop‑in artwork photos (`assets/works/`) wired via `image:` (slots ready).
- Responsive images: `srcset`/`sizes`, lazy‑loading, blur‑up placeholder, WebP/AVIF.
- Proper 1200×630 `og-image` per key page; real testimonials; final copy proofread.
- **Acceptance:** every artwork has a real image; CLS < 0.1; images lazy‑load.

### Phase 3 — Conversion, trust & polish 🟡 (core shipped)
- ✅ Per‑artwork pages (`art-<id>.html`, prerendered; static OG + `VisualArtwork`/`Offer` JSON‑LD; body from data).
- ✅ Sticky “Inquire” bar on mobile; ✅ breadcrumbs; ✅ related works; ✅ image zoom.
- ✅ `/styleguide.html` living design system; ✅ empty / `<noscript>` states.
- ⏳ Cookie/consent banner (only if analytics added); micro‑interactions audit.
- **Acceptance:** ≤ 2 taps to enquire from any artwork ✅; styleguide complete ✅.

### Phase 4 — Commerce & payments ⏳
- **Flutterwave** inline checkout (cards + Mobile Money) per print/original.
- Commission deposits (50%) as a payable link; order reference + confirmation page.
- Optional lightweight cart for multi‑print orders.
- **Acceptance:** test‑mode purchase completes end‑to‑end; receipts/refs issued.

### Phase 5 — Measurement & growth ⏳
- Privacy‑friendly analytics (Plausible) or GA4 + consent.
- Event tracking: enquire click, WhatsApp open, builder completion, checkout.
- Newsletter wired to a real list (Mailchimp/Buttondown); basic A/B on hero CTA.
- **Acceptance:** funnel visible end‑to‑end; key events firing.

### Phase 6 — Quality automation & launch 🟡 (started)
- ✅ Playwright e2e suite (`tests/e2e.mjs`, 25 checks) + ✅ **GitHub Actions CI**
  (syntax check, prerender‑drift gate, e2e). ⏳ HTML validate, link check, Lighthouse CI.
- ⏳ Pre‑commit format/lint; PR preview deploys (Netlify/Cloudflare/Pages).
- ⏳ Domain + HTTPS; sitemap submitted; social cards validated; backups.
- **Acceptance:** green CI ✅; Lighthouse ≥ 90×4 ⏳; live on keermathiang.com ⏳.

---

## 7. Performance budget & strategy

| Metric | Budget |
|---|---|
| LCP (4G mobile) | < 2.5 s |
| CLS | < 0.1 |
| INP | < 200 ms |
| Total JS (gzip) | < 60 KB |
| Image per view | ≤ 250 KB (responsive, lazy) |
| Lighthouse (P/A/BP/SEO) | ≥ 90 each |

Tactics: preconnect+preload fonts (done), `font-display:swap`, lazy images +
explicit dimensions (no layout shift), defer non‑critical JS, compress/responsive
images, cache‑bust hashed assets (Phase 6), no blocking third parties.

---

## 8. Accessibility — WCAG 2.2 AA

Done: skip link, semantic landmarks (`#main`), ARIA on menu, labelled+required
fields, visible focus, keyboard + Esc handling, reduced‑motion, alt text.
Planned: contrast audit (gold‑on‑white text fixed to AA), focus trap in lightbox &
mobile menu, `aria-live` for form status, screen‑reader pass (NVDA/VoiceOver),
`:focus-visible` polish, prefers‑contrast support. **Acceptance:** axe = 0 criticals;
full keyboard journey for all 3 primary tasks.

---

## 9. SEO & content

Done: titles/descriptions, canonicals, Open Graph + Twitter, `ArtGallery` +
`FAQPage` JSON‑LD, sitemap.xml, robots.txt, semantic headings.
Planned: per‑artwork `Product`/`VisualArtwork` + `Offer` schema, `BreadcrumbList`,
image alt strategy, local SEO (Google Business Profile, `LocalBusiness` address),
content cadence (studio notes/blog), internal linking, og‑image per page.

---

## 10. Analytics & CRO (Phase 5)
Funnel: view → artwork view → inquire/checkout start → complete. Track WhatsApp
opens, builder completion rate, form submits, checkout. Experiments: hero CTA
copy, price presentation, testimonial placement. Privacy‑first (Plausible) to keep
the Privacy Policy honest and avoid heavy consent UX.

---

## 11. Commerce & payments (Phase 4)
Flutterwave (primary): inline modal, cards + MTN/Airtel Mobile Money, USD/UGX.
Per‑item “Buy” → prefilled amount + reference (name + artwork id, already modelled).
Commission deposit = 50% payable link. Confirmation page + email receipt
(Web3Forms or Flutterwave webhook on a tiny serverless function if we add a build).
Fallbacks preserved: bank transfer + WhatsApp for high‑value originals.

---

## 12. Quality & testing (Phase 6)
- **e2e:** Playwright suite (the 20 checks already written) in CI on every push.
- **Static:** HTML validation, link checker, `eslint`/`stylelint`, Prettier.
- **Perf/a11y:** Lighthouse CI + axe with failing budgets.
- **Visual:** screenshot diffs on key pages.
- **Preview:** PR deploy previews before merge.

---

## 13. Security & privacy
Static = minimal surface. HTTPS everywhere; no secrets in client (Web3Forms key is
public‑safe by design; payment keys use Flutterwave’s public key + hosted modal).
Privacy Policy already discloses photo handling + analytics; add consent banner
only if/when analytics ships. CSP + security headers at the host (Phase 6).

---

## 14. Launch runbook (Phase 6)
1. Final content freeze + proofread. 2. Real images in, og‑images set.
3. Lighthouse ≥ 90×4, axe clean, links pass. 4. Connect domain + HTTPS.
5. Deploy. 6. Submit sitemap (Search Console), validate social cards, set up GBP.
7. Smoke‑test all 3 journeys on a real phone. 8. Announce.

---

## 15. Post‑launch & governance
Owner updates via `site-data.js` (documented). Monthly: check enquiries, refresh
featured works, review analytics. Quarterly: dependency/security review, content
refresh. Roadmap backlog kept in this doc.

---

## 16. Risks & mitigations
| Risk | Mitigation |
|---|---|
| No photos at launch | Graceful placeholders ship now; pipeline ready Phase 2 |
| Owner can’t code | One documented data file; no build required |
| Payment complexity | Phase it; WhatsApp/bank works day one |
| Slow networks (UG) | Strict perf budget; responsive/lazy images |
| Link rot (socials/WA) | Auto‑wired + hidden when empty |

---

## 17. What I need from Keer (unblocks Phases 2–6)
1. **WhatsApp number** + confirm emails.
2. **Social profile links** (IG/FB/TikTok).
3. **Artwork photos** + final titles/sizes/prices/status.
4. **Flutterwave account** (public key) for checkout; bank + Mobile Money details.
5. **Analytics preference** (Plausible vs GA4) + newsletter tool.
6. **Hosting choice** (Netlify/Cloudflare/Pages) + domain DNS access.
7. **Brand assets:** a hero/feature photo + a 1200×630 share image (or I’ll craft from the logo).

---

## 18. Definition of Done (handover acceptance)
- [ ] All artworks have real images; no placeholders on customer‑facing pages.
- [ ] WhatsApp, email, and at least one online payment path all work.
- [ ] Lighthouse ≥ 90 (P/A/BP/SEO) on Home, Works, Commissions.
- [ ] axe: zero critical issues; full keyboard journeys.
- [ ] Live on keermathiang.com over HTTPS; sitemap submitted; social cards valid.
- [ ] Owner can add/edit an artwork unaided using `HANDOVER.md`.
- [ ] CI green (Phase 6).

---

### Appendix A — verification (this build)
Chromium (Playwright) · **25/25** interactive checks PASS (Phase 1 + per‑artwork
pages) · no runtime console errors:
featured/works/testimonials/FAQ render; lightbox open/CTA/Esc‑close; filters; live
pricing ($100 base → $300 Painting+A2 → $360 Rush → “On Request” custom); pricing
tables + payment cards from data; FAQ accordion; WhatsApp/social fallbacks; dynamic
year. Desktop + mobile screenshots captured.
