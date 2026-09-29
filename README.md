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

## Before launch — placeholders to replace

Search the HTML for `PLACEHOLDER`. The list:

| Where | What |
|---|---|
| `index.html`, `about.html` | Stat figures (1.2B requests, 600+ publishers, 40+ GEOs, 96% on-time) |
| `index.html` | Client logo wall — six placeholder wordmarks |
| `index.html` | Client quote in the dark testimonial band |
| `about.html` | Leadership section is deliberately unnamed — add people and photos |
| `careers.html` | Open roles — link each to your ATS |
| `contact.html`, footer | Registered office address |
| `privacy.html`, `terms.html` | Have counsel review before publishing |

Emails referenced: `hello@`, `partners@`, `publishers@`, `careers@`,
`compliance@`, `privacy@` — create these or change them.

## Making the contact form live

`contact.html` posts nothing until you give the form an `action`. Add your
endpoint and the JS steps aside automatically:

```html
<form class="form" data-form action="https://your-endpoint" method="post">
```

Works with Formspree, Basin, a serverless function, or a CRM webhook
(HubSpot, Pipedrive). Field names are already set: `name`, `company`, `email`,
`telegram`, `side`, `vertical`, `geos`, `budget`, `message`.

## Brand tokens

Everything visual is driven by custom properties at the top of
`assets/css/site.css`:

```css
--flame:      #f6851b;   /* primary orange       */
--flame-deep: #cd6116;   /* hover / link on white */
--ink:        #131110;   /* near-black text      */
--paper:      #ffffff;
--paper-warm: #faf7f3;   /* alternating sections */
```

Type: **Archivo** (display), **Plus Jakarta Sans** (body), **IBM Plex Mono**
(labels and data), loaded from Google Fonts. Swap the `--display` / `--body` /
`--mono` variables and the `<link>` in each page's `<head>` to change them.

## The hero board

The "Network activity" panel on the homepage shows illustrative figures that
drift slightly to read as live. Rows are marked `data-board` / `data-metric` in
`index.html`; point them at your platform API to make them real, or delete the
`data-board` attribute to freeze them.

## Analytics and consent

Nothing is tracked out of the box — no GA, no pixels, no cookies. Add your tags
before `</body>`, and wire a consent banner if you deploy anything that sets
cookies (the privacy policy already references cookie controls).

## Accessibility notes

Skip link, visible focus states, labelled form controls, `aria-current` on the
active nav item, and `prefers-reduced-motion` respected. Keep those if you
extend the markup.
