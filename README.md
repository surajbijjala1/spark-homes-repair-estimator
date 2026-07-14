# Spark Homes — Repair Estimator

Offline-first repair cost estimator PWA for field use by Spark Homes acquisition teams. Walk a
property, log repairs room by room against a built-in price list, and get a running cost
estimate — no signal required after the first load.

## What this is

A zero-build static app: plain HTML/CSS/JS, React loaded via CDN, no bundler or transpile step.
State lives in `localStorage` on the device — there's no backend and no sync between devices.

## Run locally

```
npm run dev
```

This runs `npx serve .` and prints a local URL. Service workers require an http(s) origin, so
opening `index.html` directly via `file://` won't register offline support (the app will still
render, just without the offline cache).

## Install as a PWA

Open the served URL in Chrome or Safari on your phone and use "Add to Home Screen" — the app
installs standalone (no browser chrome) using the icons and colors in `manifest.json`.

## How data persists

Everything (property details, rooms, line items, photos) is saved to `localStorage` under the
`spark_homes_projects` key on every change. Clearing browser data / site data wipes it. Only one
active project is kept at a time.

## Architecture

- `index.html` — entry point: loads the design tokens, fonts, React via CDN, then the app scripts
  in dependency order, then `js/main.js` to mount and register the service worker.
- `tokens/*.css`, `styles.css` — the Spark Homes design system (colors, type, spacing).
- `js/priceList.js` — the default repair price list (75+ items / 7 room types / 19 groups) and
  project/room factory functions.
- `js/appState.js` — `localStorage` persistence, totals, and progress calculations.
- `js/RoomManager.js`, `js/SectionView.js`, `js/PhotoCapture.js` — UI components.
- `js/EstimatorApp.js` — the app shell/router (home → intake → rooms → room detail → photos →
  totals).
- `service-worker.js` — cache-first app-shell strategy so the app works with zero signal after
  the first load.

## Known trade-off

React and ReactDOM are loaded from `unpkg.com` rather than vendored locally. The service worker
caches them after the first successful load, so the app works fully offline on every visit after
that — but the very first load needs a network connection. If you'd rather have zero network
dependency even on first load, vendor `react.production.min.js` and
`react-dom.production.min.js` locally and update the `<script>` tags in `index.html` plus the
`APP_SHELL` list in `service-worker.js`.

## Not yet built

The desktop/web shell (`EstimatorWeb.js` equivalent) — the mobile shell here (`EstimatorApp.js`)
was the requested scope. It reuses the same `RoomManager`/`SectionView`/`PhotoCapture`/
`appState`/`priceList` files, so adding it is a small follow-up: a new `EstimatorWeb.js` shell
plus a second entry point.
