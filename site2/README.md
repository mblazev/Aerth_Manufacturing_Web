# Mario Blazevski — site package

Static site, two languages, with a live price estimator. No framework, no build
step, nothing to install. Upload the folder and it runs.

```
index.html          English site
mk/index.html       Macedonian site
config.js           ← the only file you have to edit
assets/site.css     styles, shared by both languages
assets/site.js      behaviour, shared by both languages
terms.html          terms of supply
privacy.html        privacy notice
404.html            not-found page
doc.css             styles for the sub-pages
og.png, mk/og.png   link-preview images (LinkedIn, WhatsApp, Viber)
make-og.py          regenerates those images if you change the headline
apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest
favicon.svg  robots.txt  sitemap.xml  _headers
images/             three work photos go here
```

---

## 1. Edit config.js

Everything configurable lives in `config.js`, shared by every page in both
languages. Leave a value as `""` and the site hides that element rather than
showing a placeholder.

| Value | Note |
|---|---|
| `email` | Now set to `blazevskimario1@gmail.com` from your CV. A business address on your own domain reads better on a quote — switch it when the domain has mail. |
| `whatsapp` | Now set to your Polish number, `48788285332`. Delete the value if you would rather not publish a personal number. A North Macedonian number would convert better on the Macedonian page. |
| `viber`, `linkedin` | Optional. Same rules. |
| `formEndpoint` | See section 4. Empty = the form opens a pre-filled email and still works. |
| `quoteDays` | Default 2. Appears six times per language. |
| `capacity` | Top-bar availability line. Keep it current — a stale one is worse than none. |
| `company`, `companyId` | Invoicing entity and registration/VAT number. |

Then replace `REPLACE-WITH-YOUR-DOMAIN.com` in `index.html`, `mk/index.html`,
`robots.txt` and `sitemap.xml`.

## 2. Tune the estimator — do this before launch

The estimator is the strongest thing on the site and the easiest to get wrong.
Its whole model sits in `config.js` under `pricing`:

| Value | Default | What it means |
|---|---|---|
| `ratePerHour` | 6 | € per printing hour — wear, power, your attention |
| `setupFee` | 8 | € once per order — slicing, plate prep, packing |
| `margin` | 1.6 | multiplier on cost, roughly a 37% gross margin |
| `throughput` | 11 | cm³ of filament per hour, conservative for a P2S |
| `occupancy` | 0.30 | how much of its bounding box a typical part fills |
| `wallShare` | 0.45 | share of material in perimeters rather than infill |
| `minUnit` / `minPrice` | 4 / 10 | floors per part and per order |
| `materials` | — | density and **your real €/kg** for each filament |

**How to tune it:** print one part you've already priced by hand. Note the actual
filament grams and hours from the slicer. Put its bounding box into the
estimator and adjust `ratePerHour` and `margin` until the estimate lands on the
price you would have charged. Check it again after ten jobs. The estimate shows a
±25% band, so it only has to be roughly right — but if it is systematically low,
every enquiry starts with you raising the price, which is the worst possible
opening.

What the current defaults produce:

| Part | Estimate |
|---|---|
| Small clip, 30×20×10, PETG | €10–15 |
| Knob, 40×40×25, ABS | €14–22 |
| Bracket, 120×80×40, PETG | €59–90 |
| Drone bracket, 100×60×30, PA-CF, structural | €40–60 |
| Ten clips | €34–53 |

Those sit inside the price bands printed elsewhere on the page (€10–60 trim,
€40–150 brackets), so if you change one, change the other. The bands appear in
the services rows (search `data-price`), in the first FAQ answer, and in the FAQ
structured data at the bottom of `index.html`.

Above `askDirect` (default €800) the estimator stops quoting confidently and
tells the visitor to contact you. Above the 256 mm build volume it says the part
needs splitting. Both are honest, and both start a conversation.

## 2a. Check it in a browser before you publish — 3 minutes

I could not render the pages inside my sandbox (the container blocks browser
downloads), so these are the four checks worth doing yourself. Open
`index.html` by double-clicking it; everything works from the file system.

1. **Narrow the window to about 360px.** The header should stay one row, the
   estimator inputs should stack, and nothing should scroll sideways except the
   materials table, which is meant to.
2. **Press Tab from the top.** A "Skip to content" link appears first, then
   every link and field gets a visible blue focus ring.
3. **Submit the form empty.** You should get three red inline messages, not a
   browser popup. Then fill it properly and confirm the email opens.
4. **Print preview (Ctrl+P).** You should get a clean two-page capability sheet
   with no navigation, no form, and all FAQ answers open.

Check the same four on `mk/index.html`.

## 3. The Macedonian version

`mk/index.html` is a full translation, not a machine pass: the FAQ, the materials
guide and the estimator are all in Macedonian, with a language switch in the
header and correct `hreflang` tags on both pages.

**Read it once before publishing.** I write good Macedonian but a native check on
trade vocabulary costs you ten minutes and is worth it — particularly the
materials table and the terms in the FAQ. The two legal pages are English only,
and both are labelled `(EN)` where the Macedonian page links to them.

## 4. Making the form send

Right now, "Send request" opens the visitor's email app with everything filled
in. It needs no backend, but it loses people whose phone has no mail app set up.

1. Sign up at [formspree.io](https://formspree.io) or [web3forms.com](https://web3forms.com).
2. Create a form, copy the endpoint, paste it into `formEndpoint`.
3. Send a test from both languages and confirm it lands.

With an endpoint set, the file-upload field appears and a "Request received"
panel replaces the form on success.

## 5. Photos

`images/`, 1200×900, JPG, named exactly `work-drone.jpg`, `work-fiat.jpg`,
`work-fsae.jpg`. Both languages use the same files. Until a file exists the site
draws a hatched plate, so a missing photo never looks broken. Add `og.png`
(1200×630) in the root for link previews.

## 6. Hosting

Full step-by-step with the domain, form, email and post-launch checklist is in
**DEPLOY.md**. Short version below.

Cloudflare Pages or Netlify: drag the folder in, attach the domain, done —
`_headers` is picked up automatically. GitHub Pages and cPanel work too; they
ignore `_headers` harmlessly.

After going live: submit `sitemap.xml` to Google Search Console, and create a
free Google Business Profile for the North Macedonia location.

## 7. Optional: self-host the fonts

Both pages load Archivo and Spline Sans Mono from Google, which means visitors'
IP addresses reach Google. It's disclosed in the privacy notice, but self-hosting
is faster and cleaner: download both families as woff2 from `gwfh.mranftl.com`,
put them in `fonts/`, replace the two `<link>` tags on every page with the
generated `@font-face` CSS, and delete the Google Fonts paragraph from
`privacy.html` §04.

## 8. Regenerating the preview image

`og.png` is what people see when your link is pasted into LinkedIn, WhatsApp or
Viber. It is generated by `make-og.py`, which draws the same bracket as the hero.
If you change the headline, edit the strings at the bottom of that file and run
`python3 make-og.py`. The headline auto-shrinks to fit, so you can't push text
into the drawing. Both the English and Macedonian versions are built in one run.

## 9. What this version adds

- **A live price estimator.** Dimensions, strength, material, quantity → a price
  band with filament mass and machine time, plus a button that carries those
  numbers into the quote form. It converts far better than a static price range,
  and it screens out jobs that were never going to fit.
- **A materials guide.** The comparison you'd talk a client through anyway: seven
  filaments, service temperature, character, UV behaviour, where each belongs.
  It's the strongest proof of expertise on the page and it earns search traffic
  from people typing "PETG or ASA outdoors".
- **The Macedonian site** with a language switch and hreflang.
- **A new FAQ answer** — "Will a printed part really hold up?" — which is the
  actual objection behind most enquiries that never get sent.
- **Shared CSS and JS files**, so the two languages can't drift apart.
- **Estimator presets.** Most visitors do not know their part in millimetres, so
  five chips — clip, knob, bracket, enclosure, drone arm mount — fill in typical
  dimensions, strength and material in one tap. Editing any field clears the
  preset, so nobody sends a number they didn't choose.
- **Real link-preview images** for both languages, plus touch icons and a web
  manifest.
- **Two contrast fixes.** The small mono labels (3.4:1) and the photo-placeholder
  text (2.7:1) failed WCAG AA. Both now pass at 4.6:1 or better.
- **Small-screen fixes** the earlier build would have shown at 360px: the header
  overflowing, two estimator selects squeezed side by side, and the drawing title
  block cramped into three columns.
- **The restoration project is now named correctly** — Zastava 750 "Fićo" rather
  than Fiat 600. In this market that name does more work than the Italian one,
  and the English page keeps "the Yugoslav-built Fiat 600" alongside it for
  anyone outside the region.

## 10. Two things from your CV to settle

**Which spelling of your surname?** The CV says *Blazhevski*; the site, your
email address and the company paperwork say *Blazevski*. Pick one and use it
everywhere — site, LinkedIn, invoices, domain. Two spellings across your public
material makes you look like two different people to a client who searches for
you, and it is the kind of thing a procurement officer notices.

**The CV has a copy-paste error.** The Automobile Federation entry repeats the
helicopter airworthiness bullet word for word ("Ensured rotary-wing airworthiness
and compliance (ICAO/EASA)…"). It should describe the technical commission work.
Worth fixing before the CV goes anywhere else.

## 11. Still worth doing

- **Photograph the first five jobs you deliver.** Five real parts on a bench beat
  every word on this page.
- **Two real client quotes**, and the testimonials section comes back.
- **Check the estimator against reality** after ten jobs, then adjust `margin`.
