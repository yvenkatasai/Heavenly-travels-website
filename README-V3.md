# Heavenly Tours & Travels — 3.0.0

The active site reconstructs the observed Incredibles visual language for Heavenly’s temple travel business. The latest usability revision replaces long editorial copy with short instructions and adds direct Tours, Vehicles and Plan trip shortcuts on mobile.

## Run locally

```powershell
python build.py
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4188/ . No Node package installation or external runtime JavaScript dependency is required.

Version 2.0.0 remains in `versions/2.0.0` with its original SHA-256 inventory. Serve it with:

```powershell
python -m http.server 4190 --bind 127.0.0.1 --directory versions/2.0.0/dist
```

Version 1.0.0 remains in `versions/1.0.0`. `versions/manifest.json` identifies all versions. `build_v2.py` retains the earlier root build; use the archived V2 directory for a self-contained V2 build.

## Source and behavior

- `src/v3/page.html`: semantic page, numbered planner and enquiry dialog.
- `src/v3/style.css`: local fonts, gray/pink design variables, responsive layouts and motion preferences.
- `src/v3/app.js`: tours, editable stops, pricing, keyboard tabs, FAQ, media and WhatsApp draft.
- `src/v3/effects.js`: original WebGL halftone fields, scroll card stack, title reveals and photo trails. No scroll hijacking.
- `src/v3/data.js` and `src/tours.js`: existing business routes and prices.
- `build_v3.py`: static HTML build and local asset copy.

The homepage leads from the hero to the scroll-mask seven-place pilgrimage, five individual tour cards and a one-to-five-day Momentum Rail. Every package opens a dedicated vehicles.html page with five horizontally sliding vehicle tiles. Selecting a vehicle opens a review dialog. Slide to WhatsApp or use the accessible tap alternative to open a manual draft with the selected package, full itinerary and vehicle. All prices, per-stop fees, base amounts and estimated totals have been removed from active pages, data and drafts. The optional custom-route planner remains. There is no automatic booking, payment or message.

The mobile shortcut bar leads directly to tour cards, vehicle options or the planner. Large jumps use immediate navigation; short jumps can scroll smoothly. Native selects, date input, details, form validation and dialogs support touch and keyboard use. Body inputs use at least 16px on mobile. The layout supports safe-area insets and 320px-wide screens.

Reduced motion removes the scroll mask, card stacking and cover-flow transforms while preserving native horizontal browsing and all package details. A separate motion toggle is in Privacy & credits. WebGL has a CSS fallback. Effects render only while visible, video thumbnails load when visible, and the full film loads on request. Session storage holds the current trip locally and contains no backend submission.

## Reference and media

Only the requested [REA repository](https://github.com/morluto/rea) was used for reference reverse engineering. No UI/UX Pro Max or other project UI/UX skill was used. Evidence and exact observation limitations are documented in `design-reference/incredibles-rea/RECONSTRUCTION.md`.

The reference’s layout, gray halftone surfaces, pink geometric animations, stacked cards, pointer photos, planning tabs, FAQ and enquiry drawer were rebuilt with original code. Business copy and interactions are adapted to Heavenly. The background is a procedural approximation of the original fluid solver; open licensed fonts replace the reference’s commercial fonts. This is not a byte-for-byte or complete source recovery.

Existing licensed temple photos keep their attribution in Privacy & credits. Existing AI mountain artwork is reused for motion visuals. The full-HD, 60fps film is smooth camera motion from a still, not real location footage. Its 720px/24fps preview is separately compressed for mobile and lazy loaded. Font licences and media provenance are included in `src/v3/assets`.

## Verification

REA drove Chrome and Edge against the local site. The browser harness covers route totals, stop removal/reset, custom routes, traveller bounds, keyboard tabs, FAQ, enquiry dialog, intercepted WhatsApp content, video pause on close, local fonts, motion preference and width sweeps at 320 / 390 / 768 / 1024 / 1440px. Browser observations retained their completed checks but REA reported a provider cleanup timeout, so captures are explicitly partial. No physical iOS/Android hardware test was performed.

The harness and capture summaries are in `output/rea-qa/v3`; visual captures include desktop/mobile entry, planner and enquiry views. These tests intercept the WhatsApp link and do not send a message.


Latest journey validation: 69 browser checks passed in normal motion and 69 in reduced motion. Verified signature/individual/day package navigation, all five day plans, group bounds, floating fleet arrows, slide and tap WhatsApp drafts, and 320/390/768/1440px layouts. Reports: output/rea-qa/v3/final-browser-no-preference.json and final-browser-reduce.json. The browser dependency used for local checks comes from the installed REA package. Earlier REA captures retain intermediate failures from before the planner-selector fix; the final reports supersede those captures. No physical iOS/Android device test was performed.

Compact layout revision: reduced hero, tour, day-rail and fleet dimensions; removed overlapping sticky tour layouts, signature destination arrows and duplicate service controls. Secondary service, itinerary, audience, optional booking and custom-route details are now collapsible. Dialogs use fit-content height with a viewport cap. Validation: 44 compact-flow checks and 12 contact/custom-route checks passed across 320/390/768/1024/1440px widths, including short screens. Pricing remains removed.


Package hierarchy revision: explicit Complete Package (7 temples), Individual Packages (5 routes), Day-wise Packages (1–5 days), Travel Assistance and Custom Packages. A three-choice navigation leads directly to the package categories. Numbered chapter dividers, quiet background changes and locally served Cinzel category labels distinguish the sections. Cormorant Garamond titles use stronger weights and readable DM Sans body sizes. Cinzel label subset is 16.7 KB with OFL and source records in assets/fonts. Validation: 33 category/font/navigation checks plus 56 compact-layout and enquiry checks passed.

Direct package flow revision: integrated the user-supplied Split Nav by Dorian Baffier / Kokonut UI, retaining the spring, split-cap, scrub and keyboard behavior, adapting Next links to native anchors and motion/react to the existing Framer Motion dependency. All category choices remain visible. Day-wise cards each have an explicit View itinerary button opening that exact package in a compact native dialog. The detached details section is removed. The dialog has a keyboard-scrollable plan, conditional overflow hint, a pinned Select package & choose vehicle action, and focus restoration. MIT license and attribution are bundled with the site. Current validation report: output/rea-qa/v3/split-direct-day-results.json.
Validation for Split Nav and direct day details: 147 browser checks passed across normal/reduced motion and 320/390/768/1024/1440px layouts, with no runtime errors. Separate real-pointer scrub, keyboard scrolling and final-day visibility checks passed. The fixed dialog footer keeps the vehicle-selection action reachable while the itinerary scrolls. No WhatsApp message was sent during testing.

Plain-language and closing revision: Choose your package, View trip plan, People and Pickup place replace harder wording across cards, dialogs, forms and WhatsApp text. Visible service labels are simple while canonical stored service values remain unchanged. Plan Your Own Trip sits immediately after packages. The old assistance/customer table, large group promotion and decorative film block are replaced with four actionable services: hotels, flights, pickup and groups. Six common questions lead to a concise WhatsApp/call closing panel. The optional hills film remains available in the footer. Validation: 47 wording/service/closing checks plus all 147 package navigation and WhatsApp flow checks passed; TypeScript passed; no runtime errors.

Floating shortcuts revision: preserved the three actions and floating position, replacing symbols and the large green CTA with original temple/car/calendar SVGs, serif labels and a fine antique-gold ivory frame. Current selection follows manual scrolling through packages, custom planning and the private-vehicle panel, and shows Vehicles on the dedicated fleet page. It uses one passive scroll listener with requestAnimationFrame batching, no idle animation loop and no added libraries. It respects safe-area insets and modal/booking-dock priority. All 51 targeted checks passed, including the reported 754x668 viewport, 320px touch targets, label contrast, automatic selection, cross-page links and booking review.

Complete-package clarity revision: removed the confusing inline service selector and unused React component. The complete package is explicitly named Complete 7-Temple Package, all seven temple names remain, and the only main selection action sits under the temple list with its vehicle-selection next step. Free extras are labelled as included based on the business owner's request, without naming unconfirmed benefits. The exact free-service list has been requested from the owner; hotel stays, flights or tickets have not been invented as free inclusions. The package description carries the same wording into the vehicle page and manual WhatsApp message. All 27 focused layout/selection/handoff checks passed at 320/390/754/1024/1440px; TypeScript passed.

The owner clarified that the free extras should be a short list such as pickup and drop. The complete package now shows two brief benefits: pickup/drop for the trip and help planning temple visits. The same wording appears in the complete-package details and its description carried to the vehicle page and WhatsApp. Hotel stays, flights and darshan tickets are not advertised as free. The placeholder asking the team to explain the unspecified extras has been replaced.
