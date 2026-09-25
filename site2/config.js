/* =============================================================
   THE ONLY FILE YOU EDIT.
   Shared by every page in both languages. Leave a value as ""
   and the site hides that element instead of showing something
   broken.
   ============================================================= */
window.SITE = {

  /* ---------- contact ---------- */

  // Taken from your CV. A business address on your own domain
  // (mario@yourdomain) looks better on a quote than a gmail one — switch it
  // once the domain has mail set up.
  email: "blazevskimario1@gmail.com",

  // Your Polish number from the CV, formatted for WhatsApp. Delete it if you
  // would rather not publish a personal number — the button then disappears.
  // A North Macedonian number would convert better on the Macedonian page.
  whatsapp: "48788285332",

  // Same format. Empty = hidden.
  viber: "",

  // Full https:// URL. Empty = hidden.
  linkedin: "",

  /* ---------- behaviour ---------- */

  // Form backend, e.g. "https://formspree.io/f/xxxxxxx".
  // Empty = the form opens a pre-filled email. It still works.
  formEndpoint: "",

  // Business days to return a quote. Appears in six places.
  quoteDays: "2",

  // Availability line in the top bar. Keep it current.
  // "Accepting new work" / "Booked until March". Empty = hidden.
  capacity: "Accepting new work",

  /* ---------- company ---------- */

  company: "Vitanova Consulting doo",
  companyId: "",            // registration or VAT number. Empty = hidden.

  /* =============================================================
     ESTIMATOR MODEL
     These numbers drive the live price estimate on the site.
     Print one real part, note what it actually cost you in
     filament and hours, then tune ratePerHour and margin until
     the estimator agrees with your own quote. Check it again
     after ten jobs.
     ============================================================= */
  pricing: {

    ratePerHour: 6,      // € per printing hour: machine wear, power, your attention
    setupFee: 8,         // € once per order: slicing, plate prep, packing
    margin: 1.6,         // multiplier on cost. 1.6 = a 37% gross margin
    minUnit: 4,          // € floor per part, however tiny
    minPrice: 10,        // € floor per order
    throughput: 11,      // cm³ of filament per hour, conservative for a P2S
    occupancy: 0.30,     // how much of the bounding box a typical part fills
    wallShare: 0.45,     // share of material in perimeters rather than infill
    buildVolume: 256,    // mm — warns above this
    askDirect: 800,      // € above which the site says "just ask me directly"

    // Density in g/cm³ and your real filament cost in € per kg.
    // Delete a material to remove it from the estimator entirely.
    materials: {
      PLA:    { density: 1.24, pricePerKg: 22 },
      PETG:   { density: 1.27, pricePerKg: 24 },
      ABS:    { density: 1.04, pricePerKg: 24 },
      ASA:    { density: 1.07, pricePerKg: 30 },
      PC:     { density: 1.20, pricePerKg: 45 },
      TPU:    { density: 1.21, pricePerKg: 38 },
      "PA-CF":{ density: 1.15, pricePerKg: 65 }
    }
  }
};
