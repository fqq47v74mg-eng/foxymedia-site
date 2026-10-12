# FoxyMedia — corporate website

Static site for **foxymedia.io**. Plain HTML, one CSS file, one JS file. No build
step, no framework, no dependencies — upload the folder and it runs.

## Contents

```
index.html          Home
about.html          About us
services.html       Solutions (+ commercial models, FAQ)
verticals.html      13 verticals + GEO coverage
advertisers.html    For advertisers (+ tracking spec, onboarding)
publishers.html     For publishers (+ deal types, traffic rules)
careers.html        Careers + open roles
contact.html        Contact form + direct lines
privacy.html        Privacy policy template
terms.html          Terms of service template
robots.txt, sitemap.xml
assets/css/site.css   All styles, design tokens at the top
assets/js/site.js     Mobile nav, live board, form handling
assets/img/           logo.svg, favicon.svg, og-cover.png
```

## Deploy

Any static host works — Cloudflare Pages, Netlify, Vercel, S3 + CloudFront, or
plain nginx/Apache. Upload the contents of this folder to the web root.

```bash
# quick local preview
python3 -m http.server 8080
```

Set the canonical domain in each page's `<link rel="canonical">` and in
`sitemap.xml` if you host it anywhere other than `https://foxymedia.io`.

## Contact form

`contact.html` posts to Formspree (`https://formspree.io/f/xwkgpvnq`, shared
with foxypartners.com) via `assets/js/site.js`, with a `_subject` of
"FoxyMedia website enquiry" and a `source=foxymedia.io` field so the two sites'
leads can be told apart. Swap the `action` attribute to point at another
endpoint or CRM webhook.

## Before launch — things to confirm

| Where | What |
|---|---|
| `index.html` | Numbers band (40+ GEOs, 13 verticals, 14 languages, Net-15) — confirm these stay accurate |
| `about.html` | Team section lists functions only, no names — by design |
| `publishers.html` | Payout wording now reads "paid within 15 days of each cycle closing" — confirm it matches your publisher terms |
| `advertisers.html` | "Unexplained rejections are treated as approved" is a contractual promise — make sure IOs say the same |
| `verticals.html` | Regulated-category copy (FX, insurance, pharma, legal, iGaming) — worth a compliance read before launch |
| `careers.html` | Open roles — link each to your ATS (they currently go to the contact form) |
| `contact.html`, footer | Registered office address |
