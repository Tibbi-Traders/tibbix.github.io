# Tibbi Traders - Static HTML/CSS/JS Site

This folder contains a Hostinger-compatible static site that mirrors the Next.js layout
and catalog flow, without Google Sheets or server-side code.

## Quick start (local preview)
From this folder:
```bash
python -m http.server 8000
# open http://localhost:8000
```

## Configure contact details
Edit `assets/js/app.js` and update:
- `contactEmail`
- `contactPhone`
- `whatsapp`
- `address`
- `serviceArea`

## Quote request email
Static hosting cannot send email by itself. Use a form endpoint (e.g., Formspree):
1) Create a Formspree form and copy the endpoint URL.
2) Update `quoteEndpoint` in `assets/js/app.js`.

If `quoteEndpoint` is left as `https://formspree.io/f/REPLACE_ME`, the quote form falls
back to opening the user's email client via `mailto:`.

## Product data
Product data lives in `assets/data/products.json`.
- Update products, categories, and images there.
- Images should be placed in `assets/images/`.

## Deployment (Hostinger)
1) Upload the contents of this folder to Hostinger `public_html`.
2) Ensure `index.html` is at the root of `public_html`.
