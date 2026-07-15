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
  each keeps its own rooms, quantities, prices, notes and photos. A mid-walkthrough refresh
  keeps your place; opening the app in a fresh tab starts at the home screen.
- **108-item price list** from `Pricing List.csv` (single source of truth), organized into
  5 sections and collapsible groups. Every group has a **No action needed** checkbox so a
  group can be explicitly marked reviewed.
- **Adjustable rooms** — Bathrooms, Bedrooms and Living/Common Areas are added/removed as
  instances ("Bathroom 2: Tub & Shower"); labels renumber automatically.
- **Pricing** — tap any unit price to override it for that project (shown amber). The
  Settings screen (gear icon on the home screen) edits **standard pricing globally**: changes
  roll out to every project immediately, except items already overridden in a project
  (project override always wins). A ✓ next to an edited standard price **adopts it as the new
  default**; every price-list item is searchable, deletable (with restore), and custom items
  are fully editable. Resolution order: project override → global tweak → adopted default →
  CSV price.
- **Add/remove any line item** — every row can be deleted; items can be re-added from the
  full catalog picker or created as custom items (name/unit/cost).
- **Progress** — per-group completion (any quantity > 0, or No-action) rolled up across all
  rooms, shown as a bar plus per-room progress rings.
- **Photos** — camera capture (`<input capture="environment">`), downscaled to ≤1280px JPEG
  before storage, thumbnails with individual delete.
- **Serial number OCR** — each photo is OCR'd on-device with Tesseract.js; serial-number-like
  strings (S/N, SER NO, etc.) are extracted, shown as an editable badge on the thumbnail, and
  included in the export.
- **ZIP export** — from the Summary screen: a styled `estimate.xlsx` (Summary, Line Items,
  Photos sheets — bold headers, borders, currency formats, built with xlsx-js-style) plus
  `photos/photo-NN.jpg`, bundled with JSZip.
- **Responsive** — single-column on phones; ≥900px switches to a two-pane layout (rooms rail
  + room detail).

## Beyond the brief (self-designed features)

- **Walkthrough audit** — the Summary screen lists every group that was never reviewed
  (no quantities, no "no action"), big-ticket Systems & Structure gaps first. Each row
  shows status (reviewed, items entered, no action) and a clickable link that jumps
  straight to that group in the walkthrough. The "No action" checkbox is available
  directly in the audit row. Exporting with gaps open triggers a review-or-export
  warning, so a missed furnace can't slip into an offer silently. The summary audit is
  **read-only by design** — no inline editing — keeping the walkthrough as the single
  source for entering data.
- **Deal analyzer** — a dedicated screen (accessible from Summary) computes key flip
  metrics from optional **purchase price** and **ARV** fields entered at intake: all-in
  cost, gross profit, gross margin, ROI, the **70% Rule** max purchase price, and a
  traffic-light **deal verdict** (Strong / Tight / Pass). Lets the team text a go/no-go
  to the acquisitions lead before leaving the property.
- **Scope-of-work generator** — one-tap shareable text SOW from the Summary screen.
  Formatted room-by-room with quantities, unit costs, line totals, condition ratings and
  notes. Uses the native **Share API** on mobile (text a contractor instantly) with
  clipboard fallback on desktop.
- **Budget guardrail** — set an optional repair budget at intake; the sticky running total
  shows % consumed and shifts amber at 80%, red when over. Budget and usage also appear on
  the Summary screen and in the Excel export.
- **Duplicate project** — one tap on a project card clones its rooms, quantities and price
  overrides (not photos, notes or cover) as a starting point for a similar house.
- **Dimension math** — type `12x14` into any quantity field (or use the L×W button on
  square-footage items) and the area is computed on the spot.
- **Condition grades** — tap 1–5 stars on any group to grade its condition even when no
  repair is needed; grades show on group headers and export as a condition scorecard.
- **Notes** — per-group notes (shown inline under that group's rows in the Excel export)
  plus a project-level general note; a pencil mark flags noted groups.
- **Cover photo** — the first photo taken prompts "use as house photo?"; any photo can be
  made the cover later (or added from camera/gallery), and it appears on the project card.

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
