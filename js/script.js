/* ============================================
   KEER ART GALLERY — Site JavaScript
   ============================================ */

/* ---------- PRELOADER ---------- */
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  setTimeout(() => {
    if (preloader) preloader.classList.add('loaded');
    document.body.classList.add('loaded-anim');
  }, 1900);
});

/* ---------- NAV SCROLL STATE ---------- */
const nav = document.querySelector('.nav');
function handleScroll() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ---------- MOBILE MENU ---------- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
function toggleMenu() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
}
if (hamburger) hamburger.addEventListener('click', toggleMenu);
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ---------- ARTWORK FILTER (works page) ---------- */
function filterWorks(btn, type) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#worksGrid .artwork-card').forEach(card => {
    let show = false;
    if (type === 'all') show = true;
    else if (type === 'available' || type === 'sold') show = card.dataset.status === type;
    else show = card.dataset.type === type;
    card.style.display = show ? '' : 'none';
  });
}

/* ---------- COMMISSION BUILDER ---------- */
const BASE_PRICE = 100;
const selections = {
  style: { value: null, cost: 0 },
  size: { value: null, cost: 0 },
  subjects: { value: null, cost: 0 },
  frame: { value: null, cost: 0 },
  timeline: { value: 'Standard', cost: 0, modifier: 0 }
};

function selectOption(btn, category, value, cost) {
  const parent = btn.closest('.option-grid');
  parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  if (cost === 'quote') selections[category] = { value, cost: 0, quote: true };
  else if (cost === '20%') selections[category] = { value, cost: 0, modifier: 0.2 };
  else selections[category] = { value, cost: parseInt(cost) || 0 };

  updatePrice();
  updateSummary();
}

function updatePrice() {
  let total = BASE_PRICE;
  let hasQuote = false;
  let modifier = 1;
  for (const sel of Object.values(selections)) {
    if (!sel) continue;
    if (sel.quote) { hasQuote = true; continue; }
    if (sel.modifier) { modifier += sel.modifier; continue; }
    if (sel.cost) total += sel.cost;
  }
  total = Math.round(total * modifier);
  const display = document.getElementById('priceDisplay');
  if (!display) return;
  display.classList.add('bump');
  setTimeout(() => display.classList.remove('bump'), 300);
  if (hasQuote) { display.textContent = 'On Request'; display.style.fontSize = '2rem'; }
  else { display.textContent = '$' + total; display.style.fontSize = '3.4rem'; }
}

function updateSummary() {
  for (const [key, sel] of Object.entries(selections)) {
    const el = document.getElementById('sel-' + key);
    if (el && sel && sel.value) {
      let suffix = sel.quote ? ' · quote' : sel.cost > 0 ? ' · +$' + sel.cost : '';
      el.textContent = sel.value + suffix;
      el.style.color = 'var(--black)';
    }
  }
}

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById('previewImg');
      const name = document.getElementById('photoName');
      const preview = document.getElementById('photoPreview');
      if (img) img.src = e.target.result;
      if (name) name.textContent = '\u2713 ' + input.files[0].name;
      if (preview) preview.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* ---------- FORM SUBMISSIONS (demo) ---------- */
function submitForm(successId) {
  const success = document.getElementById(successId);
  if (success) {
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => success.classList.remove('show'), 8000);
  }
  return false;
}

/* init builder defaults on commissions page */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('priceDisplay')) updatePrice();
});
