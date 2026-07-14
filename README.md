# Spark Group — Repair Estimator

Mobile-first, offline-first repair cost estimator PWA for the Spark Group acquisition team.
Walk a property, log repairs room by room against the standard price list, capture photos of
data plates, and export the estimate as a ZIP (Excel breakdown + photos).

## Run it

The whole app is **one self-contained `index.html`** — vanilla JS, no build step, no server
logic. Serve the folder over http(s) (service workers don't register from `file://`):

```
python3 -m http.server 8000
# or: npx serve .
```

Open the URL on your phone and use **Add to Home Screen** to install it as a standalone app.
After the first load it works with zero signal.

## Features

- **Multiple projects** — create, rename via property details, switch, and delete projects;
  each keeps its own rooms, quantities, prices, notes and photos. The app reopens exactly
  where you left off.
- **108-item price list** from `Pricing List.csv` (single source of truth), organized into
  5 sections and collapsible groups. Every group has a **No action needed** checkbox so a
  group can be explicitly marked reviewed.
- **Adjustable rooms** — Bathrooms, Bedrooms and Living/Common Areas are added/removed as
  instances ("Bathroom 2: Tub & Shower"); labels renumber automatically.
- **Pricing** — tap any unit price to override it for that project (shown amber). The
  Settings screen (gear icon on the home screen) edits **standard pricing globally**: changes
  roll out to every project immediately, except items already overridden in a project
  (project override always wins). Resolution order: project override → global override →
  CSV default.
- **Add/remove any line item** — every row can be deleted; items can be re-added from the
  full catalog picker or created as custom items (name/unit/cost).
- **Progress** — per-group completion (any quantity > 0, or No-action) rolled up across all
  rooms, shown as a bar plus per-room progress rings.
- **Photos** — camera capture (`<input capture="environment">`), downscaled to ≤1280px JPEG
  before storage, thumbnails with individual delete.
- **Serial number OCR** — each photo is OCR'd on-device with Tesseract.js; serial-number-like
  strings (S/N, SER NO, etc.) are extracted, shown as an editable badge on the thumbnail, and
  included in the export.
- **ZIP export** — from the Summary screen: `estimate.xlsx` (Summary, Line Items, Photos
  sheets, built with SheetJS) plus `photos/photo-NN.jpg`, bundled with JSZip.
- **Responsive** — single-column on phones; ≥900px switches to a two-pane layout (rooms rail
  + room detail).

## Offline behavior

`service-worker.js` precaches the app shell and the CDN libraries (JSZip, SheetJS,
Tesseract.js) on install; everything else fetched at runtime (Tesseract worker/core/language
data on the first photo) is cached as it loads. Practical rule: **first load and the first
OCR'd photo need a connection; everything afterwards works fully offline.** Data lives in
`localStorage` — clearing site data wipes projects.

## Files

```
index.html          the entire app (CSS, fonts, logo, catalog, JS — all inline)
service-worker.js   offline cache (separate file by browser requirement)
manifest.json       PWA install metadata
assets/icons/       home-screen icons (from Spark Group - Logo.png)
Pricing List.csv    price list source of truth (embedded into index.html at authoring time)
Spark Group - Logo.png  brand source asset
```

## Updating prices in the CSV

`Pricing List.csv` is embedded into `index.html` as the `CATALOG` constant at authoring time
(the app never fetches the CSV at runtime, so it stays single-file/offline). If the CSV
changes, regenerate the constant and replace the `const CATALOG = [...]` block in
`index.html`. Day-to-day price adjustments don't need that — use the in-app Settings screen.
