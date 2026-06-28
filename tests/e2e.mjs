/* ============================================================
   Keer Art Gallery — end-to-end smoke tests (Playwright)
   Verifies the data-driven UI renders and behaves correctly.

   Run:  npm test            (expects a server on BASE_URL)
   Env:  BASE_URL  (default http://localhost:8080)
         KEER_CHROME  (optional explicit Chromium path)
   Exits non-zero on any failure (CI gate).
   ============================================================ */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:8080";
const launchOpts = process.env.KEER_CHROME ? { executablePath: process.env.KEER_CHROME } : {};
const browser = await chromium.launch(launchOpts);
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
// Block external (fonts) so loads are fast & deterministic
await ctx.route("**/*", r => (r.request().url().startsWith(BASE) ? r.continue() : r.abort()));

const checks = [];
const errors = [];
async function check(n, fn) { try { checks.push([n, (await fn()) ? "PASS" : "FAIL"]); } catch (e) { checks.push([n, "ERR " + e.message]); } }
function watch(page, p) {
  page.on("pageerror", e => errors.push(`${p}: ${e.message}`));
  page.on("console", m => { if (m.type() === "error" && !/ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(`${p}: ${m.text()}`); });
}

async function open(p) { const pg = await ctx.newPage(); watch(pg, p); await pg.goto(`${BASE}/${p}`, { waitUntil: "domcontentloaded" }); await pg.waitForTimeout(600); return pg; }

// HOME
let page = await open("index.html");
await check("home: featured cards (3)", async () => (await page.locator("#featuredGrid .artwork-card").count()) === 3);
await check("home: cards link to art pages", async () => /art-.*\.html$/.test(await page.locator("#featuredGrid .artwork-card").first().getAttribute("href")));
await check("home: testimonials render", async () => (await page.locator("#testimonialGrid .testimonial").count()) >= 1);
await check("home: faq teaser renders", async () => (await page.locator("#faqList .faq-item").count()) >= 1);
await check("home: WA float fallback", async () => (await page.locator("a.whatsapp-btn").getAttribute("href")) === "contact.html");
await check("home: dead socials hidden", async () => (await page.locator('footer a:has-text("Instagram")').first().isVisible()) === false);
await check("home: dynamic year", async () => /20\d\d/.test(await page.locator(".footer-copy").first().innerText()));
await page.close();

// WORKS + filter
page = await open("works.html");
await check("works: cards (6)", async () => (await page.locator("#worksGrid .artwork-card").count()) === 6);
await page.locator('.filter-btn:has-text("Originals")').click(); await page.waitForTimeout(250);
await check("works: filter Originals=1 visible", async () => {
  const c = page.locator("#worksGrid .artwork-card"); const n = await c.count(); let v = 0;
  for (let i = 0; i < n; i++) if (await c.nth(i).isVisible()) v++; return v === 1;
});
await page.close();

// ARTWORK DETAIL PAGE
page = await open("art-silence.html");
await check("art: title renders", async () => (await page.locator(".artwork-detail-title").innerText()).includes("Silence"));
await check("art: specs render", async () => (await page.locator(".artwork-detail-specs dd").count()) >= 3);
await check("art: breadcrumb present", async () => await page.locator(".breadcrumb").isVisible());
await check("art: related works (3)", async () => (await page.locator(".related-works .artwork-card").count()) === 3);
await check("art: sold piece -> Commission CTA", async () => (await page.locator('.artwork-detail-actions a:has-text("Commission")').count()) >= 1);
await page.close();

page = await open("art-portrait-charcoal-1.html");
await check("art: available -> Inquire/Buy CTA", async () => (await page.locator('.artwork-detail-actions a:has-text("Inquire")').count()) >= 1);
await check("art: image zoom opens", async () => {
  await page.locator("#artZoomTrigger").click(); await page.waitForTimeout(300);
  return await page.locator(".img-zoom.open").isVisible();
});
await check("art: zoom closes on Esc", async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(250); return !(await page.locator(".img-zoom").evaluate(n => n.classList.contains("open"))); });
await page.close();

// COMMISSION builder pricing
page = await open("commissions.html");
await check("commission: style grid (5)", async () => (await page.locator("#grid-style .option-btn").count()) === 5);
await check("commission: default $100", async () => (await page.locator("#priceDisplay").innerText()).trim() === "$100");
await page.locator('#grid-style .option-btn:has-text("Painting")').click(); await page.waitForTimeout(120);
await page.locator('#grid-size .option-btn:has-text("A2")').click(); await page.waitForTimeout(120);
await check("commission: $300 (Painting+A2)", async () => (await page.locator("#priceDisplay").innerText()).trim() === "$300");
await page.locator('#grid-timeline .option-btn:has-text("Rush")').click(); await page.waitForTimeout(120);
await check("commission: Rush +20% => $360", async () => (await page.locator("#priceDisplay").innerText()).trim() === "$360");
await page.close();

// PRICING + FAQ
page = await open("pricing.html");
await check("pricing: commission table from data", async () => (await page.locator("#commissionPriceTable").innerText()).includes("Painting"));
await check("pricing: payment cards (4)", async () => (await page.locator("#paymentGrid .payment-card").count()) === 4);
await page.close();

page = await open("faq.html");
await check("faq: items (7)", async () => (await page.locator("#faqList .faq-item").count()) === 7);
await page.locator(".faq-q").first().click(); await page.waitForTimeout(400);
await check("faq: opens on click", async () => await page.locator(".faq-item").first().evaluate(n => n.classList.contains("open")));
await page.close();

await browser.close();

const failed = checks.filter(c => c[1] !== "PASS");
for (const [n, r] of checks) console.log(`${r.padEnd(5)} ${n}`);
if (errors.length) { console.log("\nConsole/page errors:"); errors.forEach(e => console.log("  " + e)); }
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length || errors.length) process.exit(1);
process.exit(0);
