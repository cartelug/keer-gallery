/* ============================================================
   KEER ART GALLERY — SITE DATA  (single source of truth)
   ============================================================

   ▸ THIS IS THE ONLY FILE YOU NEED TO EDIT FOR DAY-TO-DAY UPDATES.
     Change contact details, social links, prices and artworks here
     and they update everywhere on the website automatically.

   ▸ Quick start for Keer:
       1. Fill in `contact.whatsapp` with your WhatsApp number.
       2. Add your Instagram / Facebook / TikTok links under `social`.
       3. (Optional) Paste a free Web3Forms key under `forms.web3formsKey`
          so contact + commission forms email you. Get one in 30 seconds
          at https://web3forms.com  — no account, no cost.
       4. Add artworks to the `artworks` list below and drop the photos
          into  assets/works/  (see the notes above that list).

   ▸ Nothing here requires coding knowledge — just edit the text
     between the quotes. Keep the quotes and commas in place.
   ============================================================ */

window.KEER = {

  /* ---------- BUSINESS IDENTITY ---------- */
  business: {
    name: "Keer Art Gallery",
    shortName: "Keer",
    tagline: "Original and commissioned artworks for collectors, homes, and creative spaces.",
    domain: "keermathiang.com",
    url: "https://keermathiang.com",
    location: "Kampala, Uganda",
    foundingYear: 2024,
    owner: "Gabriel"
  },

  /* ---------- CONTACT ---------- */
  contact: {
    email: "info@keermathiang.com",
    businessEmail: "gabriel@keermathiang.com",

    // WhatsApp number in FULL international format, digits only.
    // No "+", no spaces, no dashes.  Example for Uganda: "256700123456"
    // Leave empty ("") until you have it — links will fall back to email.
    whatsapp: "",

    // Optional human-friendly phone shown on the contact page (e.g. "+256 700 123 456")
    phoneDisplay: ""
  },

  /* ---------- SOCIAL LINKS ----------
     Paste the FULL link to each profile. Leave empty ("") to hide it. */
  social: {
    instagram: "",   // e.g. "https://instagram.com/keerartgallery"
    facebook:  "",   // e.g. "https://facebook.com/keerartgallery"
    tiktok:    ""    // e.g. "https://tiktok.com/@keerartgallery"
  },

  /* ---------- FORM DELIVERY ----------
     Paste a free access key from https://web3forms.com to receive
     contact + commission submissions by email. When empty, forms
     gracefully fall back to opening WhatsApp / email for the visitor. */
  forms: {
    web3formsKey: ""
  },

  /* ---------- PAYMENTS (shown on the Pricing page) ---------- */
  payments: {
    depositPercent: 50,
    methods: [
      { badge: "Primary",  title: "Flutterwave",   desc: "Visa, Mastercard, and Uganda Mobile Money. The main online gateway for purchases worldwide." },
      { badge: "Backup",   title: "Bank Transfer",  desc: "For high-value originals and large commissions. Bank details provided on request." },
      { badge: "Local",    title: "Mobile Money",   desc: "MTN or Airtel for Uganda-based buyers. Quick and convenient for local purchases." },
      { badge: "Optional", title: "PayPal",         desc: "Available for international clients on request. Please contact us before paying via PayPal." }
    ]
  },

  /* ============================================================
     ARTWORKS  —  your catalogue
     ------------------------------------------------------------
     To add a piece, copy one { ... } block, paste it, and edit it.

       title    : name of the artwork
       type      : "original" | "print" | "drawing"
       medium    : e.g. "Charcoal", "Fine Art Print", "Pencil"
       size      : e.g. "28×30 in"
       year      : year created
       price     : a NUMBER (e.g. 1999 or 49.99). Use null for "Price on request".
       status    : "available" | "sold" | "reserved"
       featured  : true to show it on the home page (keep to ~3 pieces)
       image     : path to the photo, e.g. "assets/works/portrait-1.jpg".
                   Leave "" to show an elegant placeholder until you add it.
       accent    : placeholder tint (any hex colour) — only used when image is "".
       description: a sentence shown in the artwork pop-up.
     ============================================================ */
  artworks: [
    {
      id: "portrait-charcoal-1",
      title: "Portrait in Charcoal No. 1",
      type: "original",
      medium: "Charcoal",
      size: "28×30 in",
      year: 2024,
      price: 1999,
      status: "available",
      featured: true,
      image: "",
      accent: "#E2DED5",
      description: "A commanding charcoal portrait — depth, restraint, and presence in every stroke. A statement original to anchor a room."
    },
    {
      id: "faces-of-home-large",
      title: "Faces of Home — Large",
      type: "print",
      medium: "Fine Art Print",
      size: "20×29 in",
      year: 2024,
      price: 59.99,
      status: "available",
      featured: true,
      image: "",
      accent: "#DDD9D0",
      description: "A large fine-art print celebrating family and belonging. Carefully produced for lasting colour and detail."
    },
    {
      id: "faces-of-home-medium",
      title: "Faces of Home — Medium",
      type: "print",
      medium: "Fine Art Print",
      size: "18×26 in",
      year: 2024,
      price: 49.99,
      status: "available",
      featured: false,
      image: "",
      accent: "#D6D2C9",
      description: "The medium format of Faces of Home — ideal for a hallway, study, or gallery wall."
    },
    {
      id: "the-wait",
      title: "The Wait",
      type: "print",
      medium: "Fine Art Print",
      size: "10×14.5 in",
      year: 2024,
      price: 24.99,
      status: "available",
      featured: false,
      image: "",
      accent: "#CFCBC2",
      description: "A quiet, intimate print — a study of patience and stillness."
    },
    {
      id: "roots",
      title: "Roots",
      type: "print",
      medium: "Fine Art Print",
      size: "9×13 in",
      year: 2023,
      price: 19.99,
      status: "available",
      featured: false,
      image: "",
      accent: "#C9C5BC",
      description: "A small, collectible print exploring heritage and origin — a perfect first piece."
    },
    {
      id: "silence",
      title: "Silence",
      type: "drawing",
      medium: "Pencil",
      size: "12×16 in",
      year: 2023,
      price: null,
      priceLabel: "Sold",
      status: "sold",
      featured: true,
      image: "",
      accent: "#BEBAB1",
      description: "An original pencil drawing — sold. A testament to the demand for Keer's intimate, detailed work."
    }
  ],

  /* ============================================================
     COMMISSION PRICING  —  drives the live builder & pricing table
     Change a number here and both the builder and the pricing
     page update together.
     ============================================================ */
  commission: {
    basePrice: 100,
    currency: "$",
    styles: [
      { value: "Pencil",   label: "Pencil Drawing",  cost: 0,  note: "Base price" },
      { value: "Charcoal", label: "Charcoal",        cost: 20, note: "+$20" },
      { value: "Colored",  label: "Colored Drawing", cost: 40, note: "+$40" },
      { value: "Digital",  label: "Digital Artwork", cost: 50, note: "+$50" },
      { value: "Painting", label: "Painting",        cost: 80, note: "+$80" }
    ],
    sizes: [
      { value: "A4", label: "A4", cost: 0,   note: "Personal · Base" },
      { value: "A3", label: "A3", cost: 50,  note: "Home · +$50" },
      { value: "A2", label: "A2", cost: 120, note: "Large · +$120" },
      { value: "A1", label: "A1", cost: 200, note: "Statement · +$200" },
      { value: "Custom", label: "Custom Size", cost: "quote", note: "Quote required" }
    ],
    subjects: [
      { value: "1 person",  label: "1 person",  cost: 0,  note: "Base price" },
      { value: "2 people",  label: "2 people",  cost: 30, note: "+$30" },
      { value: "3 people",  label: "3 people",  cost: 60, note: "+$60" },
      { value: "4+ people", label: "4+ people", cost: "quote", note: "Custom quote" }
    ],
    frames: [
      { value: "No frame",      label: "No Frame",       cost: 0,  note: "$0" },
      { value: "Simple black",  label: "Simple Black",   cost: 30, note: "+$30" },
      { value: "Simple white",  label: "Simple White",   cost: 30, note: "+$30" },
      { value: "Premium black", label: "Premium Black",  cost: 60, note: "+$60" },
      { value: "Premium white", label: "Premium White",  cost: 60, note: "+$60" }
    ],
    timelines: [
      { value: "Standard", label: "Standard",         cost: 0,     note: "No extra cost" },
      { value: "By date",  label: "By Specific Date",  cost: 0,     note: "To be reviewed" },
      { value: "Rush",     label: "Rush Order",        cost: "20%", note: "+20%" }
    ]
  },

  /* ============================================================
     TESTIMONIALS  (shown on the home page)
     Add, edit, or remove freely.
     ============================================================ */
  testimonials: [
    { quote: "The commissioned portrait of my parents brought my mother to tears. The detail and care were beyond anything I expected.", name: "Achai D.", role: "Commission client · Kampala" },
    { quote: "Professional from the first message to delivery. The framing was immaculate and it arrived perfectly protected.", name: "Brian O.", role: "Print collector · Entebbe" },
    { quote: "A genuine original that transformed our reception area. Guests ask about it constantly.", name: "Lumi Interiors", role: "Business client" }
  ],

  /* ============================================================
     FREQUENTLY ASKED QUESTIONS  (shown on the FAQ page)
     ============================================================ */
  faqs: [
    { q: "How do I commission a custom artwork?", a: "Use the Commission builder to upload your photo, choose your style, size, subjects, framing and timeline, then submit your details. You'll receive a confirmed quote within 24–48 hours, and work begins once a 50% deposit is paid." },
    { q: "How long does a commission take?", a: "Most commissions are completed within 1–3 weeks depending on size, medium and complexity. Rush orders are available for an additional 20% where the schedule allows." },
    { q: "What payment methods do you accept?", a: "Flutterwave (Visa, Mastercard, Mobile Money), bank transfer, MTN/Airtel Mobile Money, and PayPal for international clients on request. Commissions begin with a 50% deposit; the balance is due before delivery." },
    { q: "Do you ship outside Uganda?", a: "Yes. We offer pickup, local delivery in Kampala, national delivery across Uganda, and international shipping. Delivery costs and timelines are confirmed before payment." },
    { q: "Will my reference photo be kept private?", a: "Absolutely. Photos you upload are used only to create your artwork, are never shared with third parties, and are deleted once your commission is complete." },
    { q: "Can I return a print or original?", a: "Original artworks and custom commissions are non-refundable once work has begun, as each is unique. Prints damaged in transit are replaced free of charge — see our Refund and Shipping policies for details." },
    { q: "Do you offer framing?", a: "Yes — simple and premium framing in black or white is available as an option in the commission builder, and on request for prints and originals." }
  ]
};
