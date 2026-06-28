/* ============================================================
   KEER ART GALLERY — COMPONENTS
   Renders data-driven sections from js/site-data.js and wires
   every contact / social link site-wide. No need to edit this
   file for normal updates — change js/site-data.js instead.
   ============================================================ */
(function () {
  "use strict";
  var D = window.KEER;
  if (!D) { console.warn("site-data.js not loaded"); return; }

  /* ---------- small helpers ---------- */
  function el(id) { return document.getElementById(id); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function priceText(a) {
    if (a.priceLabel) return a.priceLabel;
    if (a.price == null) return "Price on request";
    return Number.isInteger(a.price) ? "$" + a.price.toLocaleString("en-US") : "$" + a.price.toFixed(2);
  }

  function waNumber() { return (D.contact.whatsapp || "").replace(/\D/g, ""); }

  // Build a link that ALWAYS works: WhatsApp if a number is set, else email.
  function contactLink(message) {
    var n = waNumber();
    var text = encodeURIComponent(message || ("Hello " + D.business.name + "!"));
    if (n) return "https://wa.me/" + n + "?text=" + text;
    return "mailto:" + D.contact.email +
      "?subject=" + encodeURIComponent("Inquiry — " + D.business.name) +
      "&body=" + text;
  }

  /* ============================================================
     1. WIRE CONTACT / SOCIAL / EMAIL LINKS + COPYRIGHT YEAR
     Runs on every page; no per-page HTML edits required.
     ============================================================ */
  function wireLinks() {
    var socialMap = {
      instagram: D.social.instagram,
      facebook: D.social.facebook,
      tiktok: D.social.tiktok
    };
    var hasWA = !!waNumber();

    all("a").forEach(function (a) {
      var text = (a.textContent || "").trim().toLowerCase();
      var href = a.getAttribute("href") || "";

      // --- Social text links ---
      if (Object.prototype.hasOwnProperty.call(socialMap, text)) {
        var url = socialMap[text];
        if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
        else { hideLink(a); }
        return;
      }

      // --- WhatsApp (float button, footer/contact/social links) ---
      if (a.classList.contains("whatsapp-btn") || /\/\/wa\.me/.test(href) || text === "whatsapp") {
        if (hasWA) {
          a.href = contactLink("Hello " + D.business.name + ", I'd like to make an inquiry.");
          a.target = "_blank"; a.rel = "noopener";
        } else if (a.classList.contains("whatsapp-btn")) {
          a.href = "contact.html"; a.removeAttribute("target"); // keep the quick-contact affordance
        } else {
          hideLink(a); // hide dead "WhatsApp" text links until a number is set
        }
        return;
      }

      // --- Sync e-mail addresses from data ---
      if (href.indexOf("mailto:") === 0) {
        if (/info@/.test(href)) a.href = "mailto:" + D.contact.email;
        else if (/gabriel@|business/i.test(href)) a.href = "mailto:" + D.contact.businessEmail;
      }
    });

    // Copyright year (founding–current)
    var y = new Date().getFullYear();
    var span = D.business.foundingYear && D.business.foundingYear < y
      ? D.business.foundingYear + "–" + y : "" + y;
    all(".footer-copy").forEach(function (e) {
      e.innerHTML = e.innerHTML.replace(/©\s*[\d–-]+/, "© " + span);
    });
  }

  function hideLink(a) {
    var li = a.closest("li");
    (li || a).style.display = "none";
  }

  /* ============================================================
     2. ARTWORK CARDS + GALLERY
     ============================================================ */
  function visualStyle(a) {
    var base = "background:linear-gradient(135deg," + a.accent + " 0%," + a.accent + "cc 100%);";
    if (a.image) base += "--art-img:url('" + a.image + "');";
    return base;
  }

  function badgeHTML(a) {
    var html = "";
    if (a.status === "sold") html += '<div class="badge badge-sold">Sold</div>';
    else if (a.status === "reserved") html += '<div class="badge badge-sold">Reserved</div>';
    else html += '<div class="badge badge-available">Available</div>';
    if (a.type === "original" || a.type === "drawing") html += '<div class="badge badge-original">Original</div>';
    return html;
  }

  function cardHTML(a, idx) {
    var label = (a.type === "print" ? "PRINT" : a.type === "drawing" ? "DRAWING" : "ORIGINAL");
    var frameLabel = a.image ? "" : '<span class="artwork-frame-label">' + esc(label) + "</span>";
    var overlay = a.status === "sold"
      ? ""
      : '<div class="artwork-overlay"><button type="button" class="artwork-overlay-btn" data-view="' + esc(a.id) + '">View</button></div>';
    var priceCls = a.status === "sold" ? "artwork-price sold" : "artwork-price";
    return (
      '<div class="artwork-card reveal" data-type="' + esc(a.type) + '" data-status="' + esc(a.status) + '" data-id="' + esc(a.id) + '">' +
        '<div class="artwork-visual" style="' + visualStyle(a) + '">' +
          badgeHTML(a) + frameLabel + overlay +
        "</div>" +
        '<div class="artwork-info">' +
          '<div class="artwork-title">' + esc(a.title) + "</div>" +
          '<div class="artwork-meta">' + esc([a.medium, a.size, a.year].filter(Boolean).join(" · ")) + "</div>" +
          '<div class="artwork-price-row"><span class="' + priceCls + '">' + esc(priceText(a)) + "</span></div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderGrid(container, items) {
    container.innerHTML = items.map(cardHTML).join("");
    all("[data-view]", container).forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(btn.getAttribute("data-view"));
      });
    });
    all(".artwork-card", container).forEach(function (c) {
      c.addEventListener("click", function () { openLightbox(c.getAttribute("data-id")); });
    });
  }

  function renderFeatured() {
    var grid = el("featuredGrid");
    if (!grid) return;
    var featured = D.artworks.filter(function (a) { return a.featured; });
    renderGrid(grid, (featured.length ? featured : D.artworks).slice(0, 3));
  }

  function renderWorks() {
    var grid = el("worksGrid");
    if (!grid) return;
    renderGrid(grid, D.artworks);
  }

  // Filter (keeps the same onclick API used in works.html)
  window.filterWorks = function (btn, type) {
    all(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    all("#worksGrid .artwork-card").forEach(function (card) {
      var show = type === "all" ||
        ((type === "available" || type === "sold") ? card.dataset.status === type : card.dataset.type === type);
      card.style.display = show ? "" : "none";
    });
  };

  /* ---------- Lightbox ---------- */
  function ensureLightbox() {
    if (el("lightbox")) return;
    var box = document.createElement("div");
    box.id = "lightbox";
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML =
      '<div class="lightbox-backdrop" data-close></div>' +
      '<div class="lightbox-panel" role="document">' +
        '<button class="lightbox-close" data-close aria-label="Close">&times;</button>' +
        '<div class="lightbox-visual" id="lbVisual"></div>' +
        '<div class="lightbox-info">' +
          '<div class="eyebrow" id="lbType"></div>' +
          '<h3 class="lightbox-title" id="lbTitle"></h3>' +
          '<p class="lightbox-meta" id="lbMeta"></p>' +
          '<p class="lightbox-desc" id="lbDesc"></p>' +
          '<div class="lightbox-price" id="lbPrice"></div>' +
          '<div class="lightbox-actions" id="lbActions"></div>' +
        "</div>" +
      "</div>";
    document.body.appendChild(box);
    all("[data-close]", box).forEach(function (b) { b.addEventListener("click", closeLightbox); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  function openLightbox(id) {
    var a = D.artworks.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    ensureLightbox();
    var v = el("lbVisual");
    v.setAttribute("style", "background:linear-gradient(135deg," + a.accent + " 0%," + a.accent + "cc 100%);" + (a.image ? "background-image:url('" + a.image + "');background-size:cover;background-position:center;" : ""));
    v.innerHTML = a.image ? "" : '<span class="artwork-frame-label">' + esc(a.title.toUpperCase()) + "</span>";
    el("lbType").textContent = (a.type === "print" ? "Fine Art Print" : a.type === "drawing" ? "Original Drawing" : "Original Artwork");
    el("lbTitle").textContent = a.title;
    el("lbMeta").textContent = [a.medium, a.size, a.year].filter(Boolean).join(" · ");
    el("lbDesc").textContent = a.description || "";
    el("lbPrice").innerHTML = '<span class="' + (a.status === "sold" ? "sold" : "") + '">' + esc(priceText(a)) + "</span>";
    var actions = el("lbActions");
    if (a.status === "sold") {
      actions.innerHTML = '<a href="commissions.html" class="btn btn-gold">Commission Similar</a>';
    } else {
      actions.innerHTML =
        '<a href="' + contactLink("Hello " + D.business.name + ", I'm interested in \"" + a.title + "\" (" + priceText(a) + "). Is it available?") + '" target="_blank" rel="noopener" class="btn btn-gold">Inquire / Buy</a>' +
        '<a href="contact.html" class="btn btn-outline-dark">Contact Gallery</a>';
    }
    var box = el("lightbox");
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    var box = el("lightbox");
    if (!box) return;
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ============================================================
     3. TESTIMONIALS
     ============================================================ */
  function renderTestimonials() {
    var wrap = el("testimonialGrid");
    if (!wrap || !D.testimonials) return;
    wrap.innerHTML = D.testimonials.map(function (t, i) {
      return (
        '<figure class="testimonial reveal reveal-delay-' + ((i % 3) + 1) + '">' +
          '<div class="testimonial-quote-mark">&#8220;</div>' +
          '<blockquote>' + esc(t.quote) + "</blockquote>" +
          '<figcaption><span class="testimonial-name">' + esc(t.name) + "</span><span class=\"testimonial-role\">" + esc(t.role) + "</span></figcaption>" +
        "</figure>"
      );
    }).join("");
  }

  /* ============================================================
     4. FAQ (accordion)
     ============================================================ */
  function renderFaq() {
    var wrap = el("faqList");
    if (!wrap || !D.faqs) return;
    wrap.innerHTML = D.faqs.map(function (f, i) {
      return (
        '<div class="faq-item reveal">' +
          '<button class="faq-q" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
            "<span>" + esc(f.q) + "</span><span class=\"faq-icon\" aria-hidden=\"true\">+</span>" +
          "</button>" +
          '<div class="faq-a" id="faq-a-' + i + '" role="region"><p>' + esc(f.a) + "</p></div>" +
        "</div>"
      );
    }).join("");
    all(".faq-q", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        var ans = btn.nextElementSibling;
        ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
        btn.closest(".faq-item").classList.toggle("open", !open);
      });
    });
  }

  /* ============================================================
     5. COMMISSION BUILDER (data-driven) + PRICING PAGE TABLES
     ============================================================ */
  var C = D.commission;
  var selections = {}; // category -> {value, cost}
  var drawSubject = null; // step 2 "what to draw"

  function optionButtonsHTML(cat, list) {
    return list.map(function (o) {
      return '<button type="button" class="option-btn" data-cat="' + cat + '" data-value="' + esc(o.value) +
        '" data-cost="' + esc(o.cost) + '">' + esc(o.label) +
        (o.note ? "<small>" + esc(o.note) + "</small>" : "") + "</button>";
    }).join("");
  }

  function renderBuilder() {
    var map = { style: "grid-style", size: "grid-size", subjects: "grid-subjects", frame: "grid-frame", timeline: "grid-timeline" };
    var found = false;
    Object.keys(map).forEach(function (cat) {
      var c = el(map[cat]);
      if (!c) return;
      found = true;
      c.innerHTML = optionButtonsHTML(cat, C[cat] || C[cat + "s"] || []);
    });
    if (!found) return;

    all(".option-btn[data-cat]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.dataset.cat;
        all('.option-btn[data-cat="' + cat + '"]').forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        var raw = btn.dataset.cost;
        if (raw === "quote") selections[cat] = { value: btn.dataset.value, quote: true };
        else if (raw === "20%") selections[cat] = { value: btn.dataset.value, modifier: 0.2 };
        else selections[cat] = { value: btn.dataset.value, cost: parseFloat(raw) || 0 };
        updatePrice(); updateSummary();
      });
    });

    // sensible defaults so the estimate is never empty
    selectByValue("style", C.styles[0].value);
    selectByValue("size", C.sizes[0].value);
    selectByValue("subjects", C.subjects[0].value);
    selectByValue("frame", C.frames[0].value);
    selectByValue("timeline", C.timelines[0].value);
    updatePrice(); updateSummary();
  }

  function selectByValue(cat, value) {
    var btn = all('.option-btn[data-cat="' + cat + '"]').filter(function (b) { return b.dataset.value === value; })[0];
    if (btn) btn.click();
  }

  function updatePrice() {
    var total = C.basePrice, modifier = 1, hasQuote = false;
    Object.keys(selections).forEach(function (k) {
      var s = selections[k];
      if (!s) return;
      if (s.quote) hasQuote = true;
      else if (s.modifier) modifier += s.modifier;
      else if (s.cost) total += s.cost;
    });
    total = Math.round(total * modifier);
    var d = el("priceDisplay");
    if (!d) return;
    d.classList.add("bump");
    setTimeout(function () { d.classList.remove("bump"); }, 300);
    if (hasQuote) { d.textContent = "On Request"; d.style.fontSize = "2rem"; }
    else { d.textContent = C.currency + total; d.style.fontSize = "3.4rem"; }
  }

  function updateSummary() {
    ["style", "size", "subjects", "frame", "timeline"].forEach(function (k) {
      var e = el("sel-" + k), s = selections[k];
      if (!e || !s || !s.value) return;
      var suffix = s.quote ? " · quote" : (s.cost > 0 ? " · +$" + s.cost : (s.modifier ? " · +20%" : ""));
      e.textContent = s.value + suffix;
      e.style.color = "var(--black)";
    });
  }

  // expose current selections for the form sender
  window.KEER_getCommission = function () {
    var out = {};
    Object.keys(selections).forEach(function (k) { out[k] = selections[k] && selections[k].value; });
    out.subject = drawSubject;
    out.estimate = el("priceDisplay") ? el("priceDisplay").textContent : "";
    return out;
  };

  function renderPricingTables() {
    var t = el("commissionPriceTable");
    if (t) {
      var rows = "";
      function block(title, list) {
        list.forEach(function (o, i) {
          var cost = o.cost === "quote" ? "Quote" : o.cost === "20%" ? "+20%" : (o.cost === 0 ? "Base" : "+$" + o.cost);
          rows += "<tr><td class=\"price-strong\">" + (i === 0 ? title : "") + "</td><td>" + esc(o.label) + "</td><td>" + cost + "</td></tr>";
        });
      }
      block("Style", C.styles); block("Size", C.sizes); block("Subjects", C.subjects);
      block("Framing", C.frames); block("Timeline", C.timelines.filter(function (x) { return x.cost; }));
      t.innerHTML = "<thead><tr><th>Category</th><th>Option</th><th>Cost</th></tr></thead><tbody>" + rows + "</tbody>";
    }
    var pay = el("paymentGrid");
    if (pay && D.payments) {
      pay.innerHTML = D.payments.methods.map(function (m) {
        return '<div class="payment-card"><div class="payment-card-badge">' + esc(m.badge) + '</div><div class="payment-card-title">' + esc(m.title) + '</div><p class="payment-card-desc">' + esc(m.desc) + "</p></div>";
      }).join("");
    }
  }

  /* ============================================================
     6. FORMS — WhatsApp deep-link + optional Web3Forms email
     ============================================================ */
  function fieldValue(form, names) {
    for (var i = 0; i < names.length; i++) {
      var f = form.querySelector('[name="' + names[i] + '"]');
      if (f && f.value.trim()) return f.value.trim();
    }
    return "";
  }

  function showSuccess(id, msg) {
    var s = el(id);
    if (!s) return;
    if (msg) s.textContent = msg;
    s.classList.add("show");
    s.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(function () { s.classList.remove("show"); }, 9000);
  }

  function postWeb3(payload, onDone) {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); })
      .then(function () { onDone(true); })
      .catch(function () { onDone(false); });
  }

  // Unified submit handler. successId matches existing markup.
  window.submitForm = function (successId, ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var form = (ev && ev.target && ev.target.closest && ev.target.closest("form")) ||
      (el(successId) && el(successId).closest("form")) || document.querySelector("form");
    if (!form) { showSuccess(successId); return false; }

    var name = fieldValue(form, ["name", "fullname", "full_name"]);
    var email = fieldValue(form, ["email"]);
    var phone = fieldValue(form, ["phone", "whatsapp"]);
    var message = fieldValue(form, ["message", "instructions", "details"]);

    // basic validation
    if (!name || !email) {
      showSuccess(successId, "Please add your name and email so we can reply.");
      var s = el(successId); if (s) s.style.borderLeftColor = "#c0392b";
      return false;
    }
    var s2 = el(successId); if (s2) s2.style.borderLeftColor = "";

    var isCommission = successId.toLowerCase().indexOf("commission") > -1;
    var subject = (isCommission ? "Commission request" : "Inquiry") + " — " + name;

    // Build a readable summary (used for both WhatsApp and email)
    var lines = [subject, "", "Name: " + name, "Email: " + email];
    if (phone) lines.push("Phone/WhatsApp: " + phone);
    var typeSel = form.querySelector('select');
    if (typeSel && typeSel.value) lines.push((isCommission ? "Payment: " : "Type: ") + typeSel.value);
    if (isCommission && window.KEER_getCommission) {
      var c = window.KEER_getCommission();
      lines.push("", "Commission details:",
        "  What to draw: " + (c.subject || "—"),
        "  Style: " + (c.style || "—"),
        "  Size: " + (c.size || "—"),
        "  Subjects: " + (c.subjects || "—"),
        "  Framing: " + (c.frame || "—"),
        "  Timeline: " + (c.timeline || "—"),
        "  Estimate: " + (c.estimate || "—"));
      var detailsEl = document.querySelector('[name="details"]');
      var details = detailsEl ? detailsEl.value.trim() : "";
      if (details) lines.push("  Description: " + details);
    }
    if (message) lines.push("", "Message:", message);
    var body = lines.join("\n");

    var key = D.forms && D.forms.web3formsKey;
    if (key) {
      // Email delivery via Web3Forms
      postWeb3({ access_key: key, subject: subject, from_name: name, email: email, message: body }, function (ok) {
        if (ok) { showSuccess(successId); try { form.reset(); } catch (e) {} }
        else { openContactChannel(body); showSuccess(successId, "Opening your messaging app to send this to us…"); }
      });
    } else {
      // No key yet → open WhatsApp (or email) pre-filled
      openContactChannel(body);
      showSuccess(successId, waNumber()
        ? "Opening WhatsApp with your details — just press send. We'll reply shortly."
        : "Opening your email app with your details — just press send. We'll reply shortly.");
    }
    return false;
  };

  function openContactChannel(body) {
    window.open(contactLink(body), "_blank");
  }

  /* ---------- Newsletter ---------- */
  window.submitNewsletter = function (ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    var form = ev && ev.target ? ev.target.closest("form") : null;
    var email = form ? (form.querySelector('[type="email"]') || {}).value : "";
    if (!email) return false;
    var key = D.forms && D.forms.web3formsKey;
    if (key) {
      postWeb3({ access_key: key, subject: "Newsletter signup", email: email, message: "New newsletter subscriber: " + email }, function () {});
    } else {
      window.open("mailto:" + D.contact.email + "?subject=" + encodeURIComponent("Newsletter signup") +
        "&body=" + encodeURIComponent("Please add me to your list: " + email), "_blank");
    }
    var note = el("newsletterNote");
    if (note) { note.textContent = "Thank you — you're on the list."; note.style.color = "var(--gold)"; }
    if (form) try { form.reset(); } catch (e) {}
    return false;
  };

  /* ---------- Photo upload (commission) ---------- */
  window.handlePhotoUpload = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var img = el("previewImg"), name = el("photoName"), preview = el("photoPreview");
        if (img) img.src = e.target.result;
        if (name) name.textContent = "✓ " + input.files[0].name;
        if (preview) preview.style.display = "block";
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  /* keep step-2 "what to draw" working (descriptive, not priced) */
  window.selectOption = function (btn, cat, value) {
    var parent = btn.closest(".option-grid");
    if (parent) all(".option-btn", parent).forEach(function (b) { b.classList.remove("selected"); });
    btn.classList.add("selected");
    if (cat === "subject") drawSubject = value;
  };

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    wireLinks();
    renderFeatured();
    renderWorks();
    renderTestimonials();
    renderFaq();
    renderBuilder();
    renderPricingTables();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
