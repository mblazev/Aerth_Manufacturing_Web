# Going live

Recommended stack, all free except the domain:

| Layer | Choice | Cost |
|---|---|---|
| Hosting | Cloudflare Pages | €0 |
| DNS | Cloudflare | €0 |
| TLS certificate | Cloudflare, automatic | €0 |
| Form delivery | Formspree or Web3Forms free tier | €0 |
| Email at your domain | Cloudflare Email Routing → your Gmail | €0 |
| Analytics (optional) | Cloudflare Web Analytics | €0 |
| Domain | registrar of your choice | €10–40/yr |

Total running cost: the domain, once a year. Nothing else.

---

## Step 0 — decide the address first

This is the only decision that is annoying to change later, because it ends up
on invoices, business cards and in Google's index.

**Option A — subdomain of the company domain.** `parts.vitanovaconsulting.mk`,
or `delovi.vitanovaconsulting.mk` for the Macedonian audience. Costs nothing,
available today, and it inherits whatever trust the company domain already has.
Best if you want the manufacturing work to read as a Vitanova service line.

**Option B — its own domain.** `blazevski.mk`, `blazevski.eu`, or something
part-focused. Better if this is a personal brand that might outlive the current
company structure, and easier to say over the phone. A `.mk` domain signals
local presence to Macedonian customers; a `.eu` or `.com` travels further.

You can also do both: host on one, and point the other at it with a redirect.

Whatever you choose, replace `REPLACE-WITH-YOUR-DOMAIN.com` in `index.html`,
`mk/index.html`, `robots.txt` and `sitemap.xml` before you deploy.

---

## Step 1 — put the files on GitHub (10 minutes, worth it)

You can drag the folder straight into Cloudflare and skip this. Don't. With a
repository you get version history, and every later edit to `config.js` goes
live by itself.

1. Create a free GitHub account if you don't have one.
2. New repository, name it `blazevski-site`, private is fine.
3. Upload the contents of this folder — the files themselves, not the folder,
   so that `index.html` sits at the repository root.

## Step 2 — Cloudflare Pages

1. Sign up at dash.cloudflare.com.
2. **Compute (Workers & Pages) → Create → Pages → Connect to Git**, pick the
   repository.
3. Build settings: **framework preset "None", build command empty, output
   directory `/`**. There is nothing to compile — that is the point.
4. Deploy. You get `blazevski-site.pages.dev` in about thirty seconds.

Check that URL properly before attaching your domain: both languages, the
estimator, the form, and the phone view.

## Step 3 — the domain

**If the domain is new:** register it, then in Cloudflare add the site and
switch the nameservers at the registrar to the two Cloudflare gives you. Wait
for it to go active, usually minutes to a few hours.

**If it's a subdomain of vitanovaconsulting.mk:** you need that domain's DNS on
Cloudflare, or a CNAME record added wherever its DNS lives now, pointing
`parts` at `blazevski-site.pages.dev`. Do not touch its existing records — you
are adding one, not changing the company site.

Then in the Pages project: **Custom domains → Set up a domain**. The certificate
is issued automatically; there is nothing to buy or renew.

## Step 4 — make the form send properly

Until this is done the form opens the visitor's email app, which works but loses
people on phones with no mail account configured.

1. Create a form at formspree.io or web3forms.com.
2. Copy the endpoint into `formEndpoint` in `config.js`.
3. Commit the change. Cloudflare redeploys by itself.
4. Send a test from the English page and one from the Macedonian page.

If spam arrives later, add Cloudflare Turnstile — it is free and invisible.

## Step 5 — email at your own domain

`mario@yourdomain` on a quote reads better than a Gmail address.

1. In Cloudflare: **Email → Email Routing → Get started**.
2. Create `mario@yourdomain` and forward it to your Gmail. Cloudflare adds the
   MX records for you. Free, no mailbox to manage.
3. Put that address in `config.js`.

Receiving is solved at that point. **Sending** from the address is separate:
Cloudflare forwards mail but does not send it. Today the usual trick is Gmail's
"Send mail as" with an SMTP relay. Be aware that Google has announced it is
removing "Send mail as" for non-Google addresses, reportedly from January 2027 —
check the current position before you rely on it. If it goes, the alternatives
are Google Workspace (about $7/user/month), Zoho Mail's free tier (webmail and
their apps only), or Migadu (around €19/year with proper IMAP).

Practical order: set up forwarding now, and decide about sending when you have
enough enquiries for it to matter.

## Step 6 — after launch

- **Google Search Console:** add the property, submit `sitemap.xml`. Both
  languages are in it with hreflang.
- **Google Business Profile:** free, and it is how a Skopje workshop finds you.
  Set the service area rather than a street address if you don't want the
  address public.
- **Analytics, optional:** Cloudflare Web Analytics is cookieless, so it needs
  no consent banner. If you enable it, add one line to `privacy.html` §04
  saying anonymous visit statistics are collected — the notice currently
  promises there is no analytics at all, and that has to stay true.
- **Put the link in the places your buyers already are:** your LinkedIn
  headline, Macedonian restoration and Fiat/Zastava groups on Facebook, the
  Formula Student and drone communities you already belong to.

## Cost sanity check

Cloudflare's free plan carries unlimited bandwidth and unlimited requests for
static files, 500 builds a month, and free certificates on custom domains. This
site is static, so none of those limits are reachable in practice. If the site
ever gets slow or expensive, something is wrong, not popular.

## If Cloudflare is not for you

- **Netlify** — same drag-and-drop simplicity, also reads `_headers`, 100 GB
  bandwidth a month on the free plan.
- **GitHub Pages** — free and reliable, but ignores `_headers`, so you lose the
  security headers.
- **Traditional Macedonian shared hosting** — works, costs money, and is slower
  than a global CDN. Choose it only if you want everything under one local
  invoice.
