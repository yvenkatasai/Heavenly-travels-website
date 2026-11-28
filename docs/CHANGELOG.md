# Project History

Full progress log and changelog for the Heavenly Tours & Travels website, moved from `AGENTS.md` on 2026-11-28 to keep the agent guide lean. New entries continue in `AGENTS.md`; only older or superseded records live here.

## Archived completed work

- Applied the approved desktop valley and mobile temple hero images with uncropped proportional fitting and responsive image preloads.
- Reorganized the repository around the active static-site architecture.
- Removed duplicate and unused legacy site/build files.
- Made builds clean and source-safe; confirmed the active build and typecheck pass.
- Reorganized the agent guide and the README for people and coding agents.
- Renamed the guide to `AGENTS.md` so VS Code/Copilot can auto-discover its workspace instructions.
- Removed the unnecessary TypeScript `baseUrl` setting and verified path aliases still typecheck.
- Smoke-tested the local site on desktop and mobile, including package selection, vehicle booking, trip planning, service enquiries, dialogs, and navigation.
- Added an assets-only Cloudflare Worker configuration and portable Node.js build.
- Removed the obsolete hosting configuration and deployment helper.
- Preserved third-party MIT, font and image attribution notices for commercial distribution.
- Deferred the video poster and full film until the visitor opens the video.
- Verified dependency restore, production build, typecheck, local Worker routes and Wrangler deployment dry run.
- Improved the optional trip-details disclosure to 15px/600 (16px on mobile) with a 48px minimum touch target; verified browser styles and keyboard operation.
- Centered the initial day-wise carousel choices on desktop and retained the centered first card and horizontal scrolling on mobile.
- Added a matching custom-trip card after the five individual trips; it opens the existing planner with all itinerary stops selected and editable.
- Replaced customer-facing “package(s)” wording with “trip(s)” across the booking and trip-selection flow.
- Removed the extra custom-planner disclosure, kept the large custom-trip card as the entry point, added a collage of the first four trip images, and renamed the card “Customize your trip.”
- Added Prettier and editor settings, formatted editable source and scripts, and documented indentation and comment conventions.
- Reviewed the static frontend, WhatsApp handoff, storage, external links, Cloudflare config, and dependencies; no actionable security vulnerabilities were identified.
- Verified the hero update with TypeScript, the production build, and browser checks at 360/390/1440/1920px; correct image selection, full-image fitting and no horizontal overflow passed.

## Archived decisions

| Date | Decision | Reason |
|---|---|---|
| 2026-11-12 | Center the initial three day-wise cards on desktop while keeping one centered card on mobile | Makes the first visible choices balanced without changing carousel navigation |
| 2026-11-13 | Put custom-trip planning after the five individual trips and preselect every itinerary stop | Makes the custom option easier to find and lets visitors remove stops they do not want |
| 2026-11-14 | Build the custom-trip card collage from the first four trip images in CSS | Reuses existing licensed assets without adding a generated image file |
| 2026-11-14 | Keep security guidance aligned with the public static-site and visitor-reviewed WhatsApp flow | The site has no backend, authentication, payment processing, or automatic message sending |

## Archived open questions

- None. Open questions remain in `AGENTS.md` until resolved or obsolete.

## Full changelog

- 2026-11-28 - Moved the progress log out of AGENTS.md into docs/PROGRESS.md so the agent guide stays purely instructional; AGENTS.md now links to it and states what must be logged. Files: `AGENTS.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md`.
- 2026-11-28 - Streamlined `AGENTS.md` and made its verification notes more accurate: moved archived progress and the full changelog to docs/CHANGELOG.md, documented the Node.js version requirement and `npm run test:analytics`, consolidated duplicate rules, corrected the OS-support wording, and linked the editing and WhatsApp docs. Trip and sitemap counts in the checks now derive from `src/booking/data.ts` and the shared page inventory in `scripts/site-paths.mjs` instead of hardcoded numbers. Files: `AGENTS.md`, `docs/CHANGELOG.md`, `package.json`, `scripts/site-paths.mjs`, `scripts/check-content.mjs`, `scripts/check-production.mjs`.
- 2026-11-28 - Fixed all seven Temple Trips reveals by preloading nearby masked images and waiting for image readiness while the card is onscreen. Added delayed-load, scroll-away, error and reduced-motion regression tests (`npm run test:reveals`). Verified all seven cards at desktop 1440x900 and mobile 390x844 without horizontal overflow. Files: `src/site/pilgrimage.js`, `tests/package-reveal.test.mjs`, `package.json`.
- 2026-11-27 - Replaced generic sedan/SUV/bus categories with the seven supplied vehicle models, applied model-specific representative photos to both booking pickers, and updated the vehicle FAQ and group-trip copy. Files: `src/booking/`, `src/site/`, `tests/browser/check-packages-accommodation.cjs`, `AGENTS.md`.
- 2026-11-27 - Added optimized representative vehicle photos to matching booking choices, retained the supplied originals outside deployed assets, and documented that photos do not confirm fleet availability. Files: `src/booking/`, `src/site/assets/vehicles/`, `src/site/booking.css`, `src/site/compact-layout.css`, `src/site/credits.html`, `scripts/build_site.mjs`, `AGENTS.md`.
- 2026-11-26 - Rechecked the actual Google Business Profile and owner confirmation of 24-hour operation. Added matching visible/schema hours, About service areas and canonical-data-based night-stay guidance for three-to-five-day trips. Missing fleet specifications and first-hand photos remain unverified and are not fabricated. Beginner explanation: docs/business/BUSINESS-DETAILS-REVIEW-2026-11-26.md.
- 2026-11-26 - Checked the owner's real Google Search Console and verified Business Profile. Main guides and previously excluded trip URLs are indexed on fresh inspection; requested South Indian trip indexing successfully. Added verified Maps/review links and TravelAgency sameAs locally with regression checks. Publication currently needs restored Cloudflare authentication. Owner checklist and beginner explanation: docs/seo/RANKING-NEXT-STEPS-2026-11-26.md.
- 2026-11-26 - Compared the first three Google web results for ten owner-selected phrases. Added six factual planning sections through scripts/travel-planning-content.mjs, responsive definition-list comparisons and quote/rental checklists. Preserved existing page text and approved answers; unconfirmed fleet/fee terms remain questions for the owner. Research and beginner walkthrough: docs/seo/keyword-gap-research-2026-11-26/.
- 2026-11-26 - Applied installed Claude SEO audit/technical/schema/GEO workflows: added initial HTML day-trip cards, factual day-route metadata, WebSite and matching BreadcrumbList schema, official TTD references, readable small labels, direct canonical vehicle links and synchronized discovery text. Extended regression/production checks; preserved curtain timing, approved answers and visitor-reviewed WhatsApp. Audit and beginner explanation: docs/seo/heavenlytoursandtravels.com-audit/.
- 2026-11-23 - Both enquiry forms now use src/lib/whatsapp-message.ts for bold section headings, whitespace, readable dates and complete numbered plans. Removed the requested ticket disclaimer from enquiry drafts; included extras are supplied only for the complete seven-temple trip. The homepage app is bundled with esbuild to share the TypeScript formatter. Added nineteen message tests and docs/WHATSAPP-MESSAGES.md with a beginner editing walkthrough. No automatic sending or payments added.
- 2026-11-23 - Applied the AAO kit's website requirements: factual About, thirteen static trip pages, trip index, booking/changes, questions and privacy pages; build-time homepage cards/FAQ; Service/TouristTrip schema; JSON/plain-text catalog; sitemap and content checks. Owner-approved business facts live in site.config.json, FAQs in faqs.json, trips in booking/data.ts. New pages use information.css and scripts/build-agent-content.mjs. Preserved no public prices, original curtain and manual WhatsApp confirmation; all people inputs now use 2–200. See docs/AAO-IMPLEMENTATION.md for honest audit and external learning/account tasks, and docs/WEBSITE-EDITING-GUIDE.md for beginner steps.
- 2026-11-23 - Centralized public site metadata in src/site/site.config.json; added canonical/social tags, factual travel-agency JSON-LD, robots.txt and sitemap generation, noindex booking/backup URLs, and a branded HTTP 404 page. Added npm run verify:production for read-only domain, redirect, security, crawl and media checks. Cloudflare's WWW-to-apex redirect preserves path/query strings.
- 2026-11-23 - Added editable src/site/_headers for CSP, clickjacking and MIME protection, referrer/permission restrictions, HTTPS persistence and asset caching. Preserved the original curtain timing, made hero decoding asynchronous and gave homepage booking downloads low priority. Verify behavior through Wrangler so production headers are exercised.
- 2026-11-23 - Extracted minified, content-hashed styles and deferred scripts during the build; added one-day static-asset caching, lighter hero derivatives, and touch-triggered mobile dot animation. The floating navigation owns its vehicle-button handler. Original hero masters and media attribution are preserved. Files: scripts/build_site.mjs, src/site/page.html, src/site/assets/, src/site/app.js, src/site/dot-field.js, docs/DEPLOYMENT.md.
- 2026-11-18 - Added Jyotirlingas and Pancha Bhoota Lingas packages; renamed the first five, extended the South Indian route, and required accommodation preferences in both WhatsApp enquiry flows. Added route/content/validation browser checks and Somnath photo attribution. Files: src/site/, src/booking/, tests/browser/, docs/business/TRIP-CATALOG.md.
- 2026-11-14 - Fixed the enquiry dialog's Edit your route action to reveal the current custom-planner panel after the obsolete details wrapper was removed. Files: `src/site/app.js`, `dist/index.html`.
- 2026-11-14 - Reviewed the static frontend and added site-specific security/privacy boundaries for browser storage, safe DOM and URL handling, external links, Cloudflare deployment, and WhatsApp tests. No actionable vulnerabilities found. Files: `AGENTS.md`.
- 2026-11-14 - Added Prettier scripts and editor configuration, formatted editable source and scripts, clarified embedded markup, and documented when to add comments. Files: `.editorconfig`, `.prettierignore`, `.prettierrc.json`, `package.json`, `package-lock.json`, `src/`, `scripts/`, `AGENTS.md`.
- 2026-11-14 - Removed the duplicate custom-planner disclosure, retained the large custom-trip card as its entry point, added a four-image trip collage, and changed its title to “Customize your trip.” Files: `src/site/app.js`, `src/site/page.html`, `src/site/pilgrimage.css`, `AGENTS.md`.
- 2026-11-13 - Applied the owner's supplied temple-and-ghat-road image only to the desktop hero and adjusted its focal position to retain the temple on wide screens. The mobile portrait is unchanged. Files: `src/site/page.html`, `src/site/hero-fit.css`, `src/site/assets/`, `artifacts/image-generation/`, `dist/`.
- 2026-11-13 - Corrected desktop hero letterboxing with edge-to-edge cover fitting anchored to the road at the bottom; retained the mobile portrait's contain fitting. Files: `src/site/hero-fit.css`, `dist/index.html`.
- 2026-11-13 - Added approved desktop and portrait mobile hero backgrounds, preserved full-image visibility, and positioned mobile copy above the temple and road. Files: `src/site/page.html`, `src/site/hero-fit.css`, `src/site/assets/`, `scripts/build_site.mjs`, `artifacts/image-generation/`.
- 2026-11-12 - Reorganized the repository around the active static-site architecture, moved project files to purpose-based folders, and removed confirmed obsolete source/build artifacts.
- 2026-11-12 - Reordered and rewrote `agent.md` and `README.md` to explain the current project, layout, build workflow and deployment boundaries.
- 2026-11-12 - Renamed `agent.md` to `AGENTS.md` for automatic workspace instruction discovery. Files: `AGENTS.md`, `README.md`.
- 2026-11-12 - Removed redundant `baseUrl` from `tsconfig.json`; retained the `@/*` mapping relative to the config file. Files: `tsconfig.json`, `agent.md`.
- 2026-11-12 - Tested the local site’s package, vehicle, trip-planning, service enquiry, dialog, and mobile-navigation flows; no runtime or failed-request errors found. Files: `AGENTS.md`.
- 2026-11-12 - Stopped ignoring `AGENTS.md` so the guide linked from the README can be committed and shared. Files: `.gitignore`, `AGENTS.md`.
- 2026-11-12 - Migrated deployment configuration and documentation to Cloudflare Workers, replaced the Python build with a portable Node.js build, removed obsolete hosting tooling, and retained required third-party notices. Files: `wrangler.jsonc`, `package.json`, `package-lock.json`, `scripts/`, `docs/DEPLOYMENT.md`, `README.md`, `AGENTS.md`, `version.json`, `.gitignore`, `tests/browser/evidence/current-site/`.
- 2026-11-12 - Excluded Wrangler's local state and deferred the unneeded video poster and film until the visitor opens the video. Files: `.gitignore`, `src/site/page.html`, `src/site/app.js`, `AGENTS.md`.
- 2026-11-12 - Corrected the disclosure style cascade so the larger, bolder date, pickup and package-type label applies on desktop and mobile; verified touch target and keyboard operation. Files: `src/site/package-hierarchy.css`, `dist/vehicles.html`, `AGENTS.md`.
- 2026-11-12 - Centered the initial visible day-wise package cards on desktop while preserving the mobile carousel position and horizontal scrolling. Files: `src/site/direct-package-flow.css`, `AGENTS.md`.
- 2026-11-13 - Added a custom-trip card after the five individual trips, moved the existing planner below it, preselected all itinerary stops, and updated customer-facing terminology. Files: `src/site/page.html`, `src/site/app.js`, `src/site/pilgrimage.css`, `src/site/vehicles.html`, `src/site/mobile-nav.js`, `src/components/ui/split-nav.tsx`, `src/booking/main.tsx`, `src/booking/data.ts`, `AGENTS.md`.
- 2026-11-13 - Clarified that the custom planner selects all itinerary stops, including non-temple destinations. Files: `src/site/app.js`, `src/site/page.html`, `AGENTS.md`.
