# Vercel production deployment

Live site: https://heavenly-tours.vercel.app

Latest booking flow: the attached React parallax style presents a suggested five-day itinerary after the regular packages. Service selectors are available inside and below the temple card. Budget/Deluxe/Luxury/Premium preferences lead to a horizontally sliding, floating vehicle rail, followed by a WhatsApp review popup. Normal-motion and reduced-motion browser suites passed 42 checks each; TypeScript strict checking passed. See `../tests/browser/evidence/current-site/REACT-BOOKING-FLOW-QA.md` for current source and verification details. New React assets are bundled locally and receive content-hash query strings to avoid stale browser caches.

The latest content-led update adds the seven-temple gateway directly after the hero, the complete services dialog, five detailed scroll-revealed package cards, the six-segment traveller-needs table and group enquiries for 3–200 members. Package names and inclusions follow the owner's supplied content. Latest validation: 71 normal-mode checks passed; the preceding reduced-motion workflow passed 69 checks. See `../tests/browser/evidence/current-site/PILGRIMAGE-CONTENT-QA.md` for the current scope and evidence.

Project: `heavenly-tours`. The deployment helper records its latest status in the local, ignored `artifacts/deployment/latest.json`. The separate `heavenly-tours-travels` project was left unchanged.

Build with `npm run build` (or `python scripts/build_site.py`). `vercel.json` serves the resulting static `dist` directory. The deployment uploads the built HTML and current site assets; research captures and QA pages are excluded.

The published page prominently displays Heavenly Tours & Travels. A short dark curtain reveal uses the business name and pink brand accent. It runs once per browser session, supports Skip and Escape, clears itself through an independent timeout, and is skipped for reduced motion and direct section links. No video or additional media download is needed for this opening animation.

Verification: 13/13 branding browser checks and 10/10 reduced-motion branding checks passed. The later Dot Field integration passed 23/23 normal-motion and 23/23 reduced-motion checks. Width checks cover 320, 390, 768 and 1440px. Production HTML matches the local build exactly; all 24 shipped assets returned HTTP 200, and the full film returned HTTP 206 for a byte-range request. This supports normal video loading and seeking on the deployed host.

The current hero background adapts the user-provided MIT Dot Field component. It responds to passive touch/pointer gestures without cancelling page scroll. Adaptive dot density and backing pixel ratio keep mobile rendering bounded; the effect stops offscreen, in hidden tabs, during the intro and when motion is paused. Full implementation and local measurements are documented in `../tests/browser/evidence/current-site/DOT-FIELD-QA.md`.

The Vercel CLI's native executable failed to write its existing local config file. Deployment therefore used the official Vercel REST API and the existing authenticated CLI account. `scripts/deploy_vercel.py` reads that login into memory; no token is stored in this repository. It pins the verified project ID and team before uploading. `python scripts/deploy_vercel.py --status` reads the existing deployment status. Running it without `--status` creates a new production deployment after the build.

REA browser captures retain the completed check results but report a provider cleanup timeout. These are documented as partial observations. No physical-device iOS test was performed.
