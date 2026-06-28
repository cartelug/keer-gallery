/* ============================================================
   KEER ART GALLERY — Core UI behaviour
   (Data, galleries, forms and the commission builder live in
    js/components.js, driven by js/site-data.js)
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- PRELOADER (once per session, motion-aware) ---------- */
  (function preloader() {
    var pre = document.querySelector(".preloader");
    if (!pre) return;
    var seen = false;
    try { seen = sessionStorage.getItem("keerSeen") === "1"; } catch (e) {}

    function reveal() {
      pre.classList.add("loaded");
      document.body.classList.add("loaded-anim");
      try { sessionStorage.setItem("keerSeen", "1"); } catch (e) {}
    }

    if (seen || reduceMotion) {
      // Skip the full intro on repeat visits / reduced motion
      pre.style.transition = "none";
      reveal();
    } else {
      window.addEventListener("load", function () { setTimeout(reveal, 1700); });
      // Safety: never trap the user if `load` is slow
      setTimeout(reveal, 4000);
    }
  })();

  /* ---------- NAV SCROLL STATE ---------- */
  var nav = document.querySelector(".nav");
  function handleScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ---------- MOBILE MENU ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.querySelector(".mobile-menu");
  function setMenu(open) {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var first = mobileMenu.querySelector("a"); if (first) first.focus(); }
  }
  if (hamburger) {
    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.setAttribute("aria-controls", "mobileMenu");
    hamburger.addEventListener("click", function () { setMenu(!mobileMenu.classList.contains("open")); });
    hamburger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMenu(!mobileMenu.classList.contains("open")); }
    });
  }
  if (mobileMenu) {
    mobileMenu.setAttribute("id", "mobileMenu");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (!mobileMenu || !mobileMenu.classList.contains("open")) return;
    if (e.key === "Escape") { setMenu(false); if (hamburger) hamburger.focus(); return; }
    if (e.key === "Tab") {
      // focus trap within the open menu
      var links = mobileMenu.querySelectorAll("a");
      if (!links.length) return;
      var first = links[0], last = links[links.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- SCROLL REVEAL (covers injected content) ---------- */
  function setupReveal() {
    var els = document.querySelectorAll(".reveal, .reveal-scale");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  // Run after components.js has injected its content.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupReveal);
  else setupReveal();
})();
