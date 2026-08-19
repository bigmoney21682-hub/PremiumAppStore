# Premium App Store

A black-and-gold storefront for the PWAs. Tap an icon, get a detail sheet with
screenshots, a description, an **Open App** button (new tab) and a **Share**
sheet. Static HTML/CSS/JS — no build step, no framework, no tracking.

```
index.html      markup
styles.css      the whole look
apps.js         THE CATALOG — the only file you edit to add or change an app
app.js          grid, detail sheet, share sheet, QR encoder
sw.js           offline cache so the storefront works on a plane
manifest.webmanifest
assets/icons/       one icon per app
assets/screenshots/ three screenshots per app
```

## Where the screenshots go

Each app has a folder named after its `slug`. Drop three images in, named
`1`, `2`, `3`:

```
assets/screenshots/smart-nav/1.png
assets/screenshots/smart-nav/2.png
assets/screenshots/smart-nav/3.png
```

The folders are already created for all nine apps:

| App                   | Folder                                  |
|-----------------------|-----------------------------------------|
| Smart Nav             | `assets/screenshots/smart-nav/`         |
| The Weather           | `assets/screenshots/the-weather/`       |
| MyTube                | `assets/screenshots/mytube/`            |
| 3d Print Master       | `assets/screenshots/3d-print-master/`   |
| Parts Agent           | `assets/screenshots/parts-agent/`       |
| MRI Acoustic Analyzer | `assets/screenshots/mri-acoustic-analyzer/` |
| PCB Analyzer          | `assets/screenshots/pcb-analyzer/`      |
| Schematic Analyzer    | `assets/screenshots/schematic-analyzer/`|
| Image Analysis        | `assets/screenshots/image-analysis/`    |

Notes:

- **`.png`, `.jpg`, and `.webp` all work** — the page tries them in that order.
- Until a file is there, the slot shows a placeholder printing the exact path it
  wants, so you never have to guess. Nothing breaks with zero screenshots.
- **Tall phone screenshots look best** (the slot is a 9:19.5 portrait card), but
  any aspect ratio works — images are center-cropped to fill.
- Tap a screenshot to blow it up full-screen.

## Adding a new app

1. Put an icon at `assets/icons/<slug>.png` (or `.svg`). Square, 512×512 is ideal.
2. Make the folder `assets/screenshots/<slug>/`.
3. Add an entry to the right category in `apps.js`:

```js
{
  slug: 'my-app',                       // must match the folders above
  name: 'My App',
  tagline: 'One line that sells it.',
  url: 'https://example.com',
  icon: 'assets/icons/my-app.png',
  description: 'A paragraph for the About section.',
  note: 'Optional — shows in a gold-bordered callout.'
}
```

To add a whole category, copy one of the `{ category, blurb, apps: [...] }`
blocks. Order on the page follows order in the file.

## Apps that aren't public yet

MRI Acoustic Analyzer and PCB Analyzer currently run only on a private network,
so they are listed with `soon: true` and `url: null`. They show greyed out with a
gold **SOON** badge, and their sheet has no working Open or Share button — which
also keeps the private address out of this repo.

When one of them gets a public address, give it that `url` and delete the
`soon` flag. Nothing else changes.

## Running it

Any static server:

```bash
python3 -m http.server 8791     # then open http://127.0.0.1:8791
```

Opening `index.html` directly with `file://` mostly works, but the service
worker and clipboard API need `http://` or `https://`.

## Details worth knowing

- **Deep links** — every app has its own address: `…/#smart-nav` opens straight
  to that app's sheet. Back button and Escape close it.
- **Share sheet** — Copy Link, Mail, Message, WhatsApp, X, Facebook, Reddit, and
  a QR code. On phones a **More…** entry hands off to the real OS share sheet.
- **QR codes** are generated in-page with no library and no network call. The
  encoder was verified module-for-module against a reference implementation
  across QR versions 1–10.
- **Installable** — the storefront is itself a PWA; "Add to Home Screen" gives
  you a gold star icon that opens the whole catalog.
