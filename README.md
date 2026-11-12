# Heavenly Tours & Travels — 3.0.0

The active site now opens with a seven-temple destination gateway directly after the hero. It opens a complete travel-services brochure, followed by five detailed pilgrimage package cards with scroll reveals. Group enquiries support 3–200 members. The package data, traveller-needs table and service information follow the owner-provided content.

## Run locally

```powershell
npm ci
npm run typecheck
python build.py
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4188/ . The one-time npm install supplies the React booking island and its build tools. Python builds the static site and bundles the React code locally; no third-party runtime CDN is required.

Version 2.0.0 remains in `versions/2.0.0` with its original SHA-256 inventory. Serve it with:

```powershell
python -m http.server 4190 --bind 127.0.0.1 --directory versions/2.0.0/dist
```

Version 1.0.0 remains in `versions/1.0.0`. `versions/manifest.json` identifies all versions. `build_v2.py` retains the earlier root build; use the archived V2 directory for a self-contained V2 build.

## Source and behavior

- `src/v3/page.html`: semantic page, numbered planner and enquiry dialog.
- `src/v3/style.css`: local fonts, gray/pink design variables, responsive layouts and motion preferences.
- `src/v3/app.js`: tours, editable stops, pricing, keyboard tabs, FAQ, media and WhatsApp draft.
- `src/v3/heritage-effects.js`: gentle once-only section reveals, native scrolling, no pinned or overlapping content. `dot-field.js` retains the optional interactive hero background.
- `src/v3/data.js` and `src/tours.js`: existing business routes and prices.
- `build_v3.py`: static HTML build and local asset copy.

Five starting tours, fourteen optional temple stops and four vehicle types are retained. Estimates use the existing vehicle base (₹4,999 / ₹6,499 / ₹7,999 / ₹11,999) plus ₹249 per selected stop. They are starting estimates, not final quotes. Date and vehicle can remain undecided. The enquiry requires a name, pickup place and valid traveller count. WhatsApp opens a draft for the visitor to review and manually send. There is no automatic booking, payment or message.

The mobile shortcut bar leads directly to tour cards, vehicle options or the planner. Large jumps use immediate navigation; short jumps can scroll smoothly. Native selects, date input, details, form validation and dialogs support touch and keyboard use. Body inputs use at least 16px on mobile. The layout supports safe-area insets and 320px-wide screens.

Reduced motion renders the card sequence as a static grid, disables decorative animation and stops thumbnail autoplay. A separate motion toggle is in Privacy & credits. WebGL has a CSS fallback. Effects render only while visible, video thumbnails load when visible, and the full film loads on request. Session storage holds the current trip locally and contains no backend submission.

## Reference and media

Only the requested [REA repository](https://github.com/morluto/rea) was used for reference reverse engineering. No UI/UX Pro Max or other project UI/UX skill was used. Evidence and exact observation limitations are documented in `design-reference/incredibles-rea/RECONSTRUCTION.md`.

The reference’s layout, gray halftone surfaces, pink geometric animations, stacked cards, pointer photos, pricing tabs, FAQ and enquiry drawer were rebuilt with original code. Business copy and interactions are adapted to Heavenly. The background is a procedural approximation of the original fluid solver; open licensed fonts replace the reference’s commercial fonts. This is not a byte-for-byte or complete source recovery.

Existing licensed temple photos keep their attribution in Privacy & credits. Existing AI mountain artwork is reused for motion visuals. The full-HD, 60fps film is smooth camera motion from a still, not real location footage. Its 720px/24fps preview is separately compressed for mobile and lazy loaded. Font licences and media provenance are included in `src/v3/assets`.

## Verification

REA drove Chrome and Edge against the local site. The browser harness covers route totals, stop removal/reset, custom routes, traveller bounds, keyboard tabs, FAQ, enquiry dialog, intercepted WhatsApp content, video pause on close, local fonts, motion preference and width sweeps at 320 / 390 / 768 / 1024 / 1440px. Browser observations retained their completed checks but REA reported a provider cleanup timeout, so captures are explicitly partial. No physical iOS/Android hardware test was performed.

The harness and capture summaries are in `output/rea-qa/v3`; visual captures include desktop/mobile entry, planner and enquiry views. These tests intercept the WhatsApp link and do not send a message.

## Branding and production

Heavenly Tours & Travels is now the main hero heading, with a short branded curtain reveal on the first visit in each session. Skip, Escape and reduced-motion preferences are supported. The live site is https://heavenly-tours.vercel.app . See DEPLOYMENT.md for deployment and verification details.


The hero now uses the user-supplied interactive Dot Field: passive touch waves, bounded spring physics, adaptive density/pixel ratio, offscreen suspension and a static reduced-motion view. Attribution is retained in Privacy & credits and assets/dot-field-NOTICE.txt. Local checks: 23/23 normal motion and 23/23 reduced motion; see output/rea-qa/v3/DOT-FIELD-QA.md.


The latest travel theme adds a newly generated cinematic Tirumala-inspired hills-only hero (no roads), with responsive 309KB desktop / 101KB mobile WebP assets behind the interactive dot canvas. Forest green, ivory and gold replace the earlier pink/gray accents. The generated artwork, exact prompt and provenance are saved in output/imagegen and src/v3/assets/tirumala-hills-generation.json. See output/rea-qa/v3/TRAVEL-THEME-QA.md for verification.


## Five-day itinerary and selected package booking

The owner-supplied React parallax component is integrated at `components/ui/parallax-scroll-feature-section.tsx`. A suggested five-day route appears after the normal packages. Service choices appear inside and below the temple gateway. Budget friendly, Deluxe, Luxury and Premium options lead to a horizontally sliding fleet of floating tiles. Selecting a vehicle opens a native review popup with a WhatsApp draft containing the chosen service, itinerary, package level and vehicle.

React source and typed data: `src/booking`. Native matching styles: `src/v3/booking.css`. The `components.json` and `tsconfig.json` files configure the requested shadcn-compatible aliases and TypeScript structure. Tailwind is prefixed `tw:` without Preflight. See `components/ui/README.md` for build and integration details.

The five-day sequence is a suggested route; timings and arrangements are confirmed by the team. Package levels are preferences because the owner has not supplied tier prices or guaranteed inclusions. No model/seating guarantees, new rates or automatic booking confirmations are invented.
