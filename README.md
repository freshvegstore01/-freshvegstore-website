# FreshVegStore — Website + Billing CRM + Bulk Order Invoicing

Plain HTML/CSS/JS site, folder-per-page, ready for GitHub Pages. No build step, no server —
just static files.

## Folder structure

```
freshveg-website/
├── index.html              → home page
├── about/index.html        → About
├── products/index.html     → Products & rates
├── services/index.html     → Services
├── clients/index.html      → Clients
├── gallery/index.html      → Gallery
├── contact/index.html      → Contact form (demo — not wired to send yet)
├── billing/index.html      → POS billing + built-in CRM (customer directory)
├── bulk-order/index.html   → Bulk order form → A4 GST invoice for Factory/Canteen/School/College
└── assets/
    ├── style.css           → shared design system (colors, type, nav, footer, cards)
    ├── invoice.css         → A4 invoice print layout (used by Billing's "A4 Invoice" and Bulk Order)
    ├── app.js              → mobile nav toggle + FVS.* localStorage CRM helper
    └── logo.svg             → placeholder logo — replace with your real logo file
```

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `freshvegstore-website`).
2. Copy everything **inside** this `freshveg-website` folder into the repo root (so `index.html`
   sits at the repo root, not inside a subfolder).
3. Commit and push:
   ```bash
   git init
   git add .
   git commit -m "FreshVegStore website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
4. On GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `root`** → Save.
5. Your site goes live at `https://<your-username>.github.io/<repo-name>/`.

Because every page lives in its own folder with an `index.html`, links like `/about/` work
correctly on GitHub Pages without any extra configuration.

## Things to replace before going live

- **Logo** — `assets/logo.svg` is a placeholder built in your brand colors. Swap in your real
  logo file (keep the filename `logo.svg`, or update the `<img src="...">` references across
  all pages if you rename it).
- **GST number** — the GSTIN used throughout (`03ABCFF1234K1Z5`) is a **demo placeholder**.
  Replace it in `assets/app.js` (`FVS.SHOP.gstin`) and in `billing/index.html`
  (`GST_NUMBER`) with your real registered GSTIN once available. Until then, keep the "demo"
  label so it's clear on invoices.
- **Address / phone** — currently set to VPO Asron, Near SBI Bank, Punjab – 144533 and
  `+91 98159 37394`, pulled from your billing file. Update in `assets/app.js` (`FVS.SHOP`)
  — this single object feeds the header, footer, billing receipts and both invoice types.
- **Gallery photos** — `gallery/index.html` currently shows styled placeholder tiles, not real
  photos (none were uploaded). Drop real photos into `assets/images/` and swap the `.tile` divs
  for `<img>` tags.
- **Product rates** — sample only; update the `PRODUCTS` / `PRODUCT_HINTS` arrays in
  `billing/index.html`, `bulk-order/index.html` and `products/index.html`.
- **Contact form** — currently client-side only (shows a message, doesn't send anywhere).
  Wire it to a form service (e.g. Formspree, Google Forms) or your own backend.

## How the Billing + CRM works

- `billing/index.html` is a point-of-sale screen: pick products, adjust rate/qty, add to the
  bill, apply a coupon, generate a bill.
- Every generated bill prints as a **58mm thermal receipt** by default, or a full **A4 GST
  invoice** via the "Print A4 Invoice" button (same bill data, formal layout with your logo,
  address and GSTIN).
- Every bill with a customer name or phone number is saved to a simple **CRM** (localStorage on
  that device) — visible under the "Customers (CRM)" tab, showing order count, total spent, and
  last order date.

## How Bulk Order works

- `bulk-order/index.html` is a separate form aimed at institutions (Factory / Canteen / School /
  College / Other), collecting organisation details, delivery address, optional GSTIN, and a
  line-item order (item, unit, qty, rate — add as many rows as needed).
- Submitting generates a numbered **A4 tax invoice** (`FVS/BULK/<year>/<n>`) with your logo, GST
  split (CGST + SGST), amount in words, and a signature block — ready to print or "Save as PDF"
  straight from the browser's print dialog.
- Each submission is also saved as a bulk client in the same CRM used by Billing, so repeat
  institutional clients build up an order history over time.

## Data storage note

All CRM/bill/invoice data is stored in the browser's `localStorage` — it's per-device and not
shared between the shop's computer and a phone, and it isn't backed up anywhere. This is fine for
a first version; when you're ready to access it from multiple devices, that data layer
(`FVS.*` functions in `assets/app.js`) is the place to swap in a real backend (e.g. Google
Sheets, Firebase, or a small database) without rewriting the billing/invoice UI.
