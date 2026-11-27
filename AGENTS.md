# Agent Guide

Read this guide before making repository changes. Keep changes scoped, preserve existing behavior, and update this file's progress log when a task changes project structure or working conventions.

## Project at a glance

Heavenly Tours & Travels is a static pilgrimage travel website deployed as assets on Cloudflare Workers. It uses HTML, CSS and JavaScript, with a compiled React booking flow. There is no application backend, API or database.

Visitors can explore trips and services, choose package and vehicle preferences, and prepare a WhatsApp enquiry. WhatsApp opens a draft for the visitor to review and send; the site does not submit bookings or payments automatically.

## Start here

```sh
npm ci
npm run typecheck
npm run build
npm run dev
```

Wrangler runs the local preview. The production site is built into `dist/`; no remote JavaScript runtime CDN is used. Node.js builds are supported on Windows, macOS and Linux.

## Where things belong

| Location | Purpose |
|---|---|
| `src/site/` | Active page templates, styles, browser scripts, trip data and source media |
| `src/booking/` | React booking island and Tailwind input |
| `src/components/ui/` | Reusable React interface components |
| `src/lib/` | Shared TypeScript helpers |
| `scripts/` | Site build, asset compilation and deployment tools |
| `wrangler.jsonc` | Cloudflare Workers static-asset deployment configuration |
| `tests/browser/evidence/` | Browser scenarios, captured results and QA reports |
| `docs/` | Deployment, business, design and reference documentation |
| `artifacts/` | Generated design explorations and local deployment status |
| `dist/` | Generated static site; never edit by hand |
| `version.json` | Single source for the current site version and build metadata |

The active site lives in `src/site/`; do not create release-numbered copies of its source.

## Build and verification

- `npm run typecheck` checks the React/TypeScript source.
- `npm run build` runs the Node.js build scripts, compiles the booking island, and assembles the static pages and assets.
- Build output defaults to `dist/`. The build recreates that directory to prevent stale assets and rejects protected source, tooling, documentation, test, dependency and Git paths.
- `npm run build:booking` compiles the booking island independently into `dist/assets/`.
- `npm run verify:content` checks the built trip catalog, twenty-four public content URLs, schema itineraries, website/breadcrumb entities, initial day-trip HTML, booking IDs and local links without sending enquiries.
- `npm run verify:production` performs read-only checks against the configured production domain after deployment.
- `npm run test:whatsapp` checks shared enquiry formatting, all thirteen routes, dates, optional fields and URL encoding without sending messages.
- `npm run dev` builds and serves the site through Wrangler's local Worker runtime.
- `npm run deploy` builds and deploys the static assets to Cloudflare Workers. Do not run deployment without Vamsi's approval.
- Tests must intercept WhatsApp links; never send real messages.

For code or build changes, run typecheck and build. For behavior changes, run the relevant browser checks when available.

## Security and privacy boundaries

- Treat this as a public static frontend: there is no server-side authorization, database, or private API.
- Keep only non-sensitive trip-planning preferences in `sessionStorage`; never store credentials, payment details, or identity documents.
- WhatsApp links may only open a prefilled draft for the visitor to review and send. Encode enquiry text in the URL; never send messages automatically.
- Keep visitor-controlled text out of `innerHTML` and executable contexts. Prefer `textContent` and DOM APIs; validate/allowlist values used in URLs and encode query parameters.
- External links opened in a new tab must use `rel="noopener noreferrer"`. Keep runtime assets local except the owner-approved Google Analytics tag, loaded only after opt-in consent. Never send form values, WhatsApp draft URLs or query strings to Analytics; keep enhanced measurement disabled.
- Keep secrets out of source, generated assets, browser storage, and test evidence. Use local Wrangler authentication for deployment.
- Tests must intercept WhatsApp links and must never send real messages or submit personal data to external services.

## Working rules

1. Make the smallest complete change; follow the existing patterns and update directly related documentation.
2. Keep editable runtime code in `src/`; generated bundles belong in `dist/`.
3. Preserve accessibility, responsive behavior, keyboard/touch support and reduced-motion behavior.
4. Preserve media attribution, licence notices and generation provenance.
5. Keep secrets out of the repository. Use Wrangler's local Cloudflare login for deployment.
6. Preserve third-party license and attribution notices; commercial use does not remove their terms.
7. Do not deploy or change remote configuration without Vamsi's approval.
8. Do not remove files just because they look old; first confirm whether they are referenced, required evidence or licensed provenance.
9. Format editable source with Prettier (`npm run format`); check it with `npm run format:check`.
10. Use two-space indentation and LF line endings. Keep HTML inside template literals multiline and indented.
11. Add comments only to explain non-obvious intent, constraints, invariants, or side effects; do not narrate obvious code.
12. Keep generated output, browser evidence, reference captures, and asset metadata out of formatting changes.

## More information

- [Project overview and architecture](README.md)
- [Cloudflare deployment workflow](docs/DEPLOYMENT.md)
- [Pricing notes](docs/business/PRICING.md)
- [Visitor journey](docs/business/VISITOR-JOURNEY.md)
- Design references and system: `docs/design/`
- Browser QA evidence: `tests/browser/evidence/`

## Progress log

### Current status
- **Phase:** Testing
- **Last updated:** 2026-11-27
- **Hosting target:** Cloudflare Workers static assets

### Done
- [x] Added five owner-approved short answers, four static travel guides, unique metadata checks and manually reviewed modification dates (2026-11-25). Source: search-answers.json, content-dates.json and build-agent-content.mjs. Added consent-gated Analytics with contact-method events and privacy tests; automatic outbound/form measurement is disabled in GA.
- [x] Applied the approved desktop valley and mobile temple hero images with uncropped proportional fitting and responsive image preloads.
- [x] Verified the hero update with TypeScript, the production build, and browser checks at 360/390/1440/1920px; correct image selection, full-image fitting and no horizontal overflow passed.
- [x] Reorganized the repository around the active static-site architecture.
- [x] Removed duplicate and unused legacy site/build files.
- [x] Made builds clean and source-safe; confirmed the active build and typecheck pass.
- [x] Reorganized this guide and the README for people and coding agents.
- [x] Renamed the guide to `AGENTS.md` so VS Code/Copilot can auto-discover its workspace instructions.
- [x] Removed the unnecessary TypeScript `baseUrl` setting and verified path aliases still typecheck.
- [x] Smoke-tested the local site on desktop and mobile, including package selection, vehicle booking, trip planning, service enquiries, dialogs, and navigation.
- [x] Added an assets-only Cloudflare Worker configuration and portable Node.js build.
- [x] Removed the obsolete hosting configuration and deployment helper.
- [x] Preserved third-party MIT, font and image attribution notices for commercial distribution.
- [x] Deferred the video poster and full film until the visitor opens the video.
- [x] Verified dependency restore, production build, typecheck, local Worker routes and Wrangler deployment dry run.
- [x] Improved the optional trip-details disclosure to 15px/600 (16px on mobile) with a 48px minimum touch target; verified browser styles and keyboard operation.
- [x] Centered the initial day-wise carousel choices on desktop and retained the centered first card and horizontal scrolling on mobile.
- [x] Added a matching custom-trip card after the five individual trips; it opens the existing planner with all itinerary stops selected and editable.
- [x] Replaced customer-facing “package(s)” wording with “trip(s)” across the booking and trip-selection flow.
- [x] Removed the extra custom-planner disclosure, kept the large custom-trip card as the entry point, added a collage of the first four trip images, and renamed the card “Customize your trip.”
- [x] Added Prettier and editor settings, formatted editable source and scripts, and documented indentation and comment conventions.
- [x] Reviewed the static frontend, WhatsApp handoff, storage, external links, Cloudflare config, and dependencies; no actionable security vulnerabilities were identified.
- [x] Added owner-supplied representative car photos for seven individual vehicle-model choices; preserved originals outside deployed assets and used uncropped optimized WebP derivatives.

### In progress
- None.

### Next
- Keep new work within the documented source, tooling, test, documentation and artifact folders.
- Keep the live Cloudflare custom domain and its HTTPS, DNSSEC and canonical redirect configuration intact.
- Run content and production checks after future approved deployments.

### Decisions
| Date | Decision | Reason |
|---|---|---|
| 2026-11-12 | Use `src/site/` for the active site without a release-numbered folder | The source is not an archived version |
| 2026-11-12 | Use `scripts/build_site.mjs` as the sole site assembly entry point | Build automation belongs in `scripts/`; `npm run build` is the standard command |
| 2026-11-12 | Generate booking bundles in `dist/assets/` | Compiled output should not be mixed with editable source |
| 2026-11-12 | Keep QA evidence in `tests/`, design references in `docs/`, and generated explorations in `artifacts/` | Makes each file group easier to locate and understand |
| 2026-11-12 | Deploy static assets with Cloudflare Workers and Wrangler | The site is static and needs no request-time application server |
| 2026-11-12 | Keep third-party MIT and attribution notices | Commercial use does not remove the license notice requirements for adapted or bundled work |
| 2026-11-12 | Use Node.js for the complete build | Avoids requiring a separate Python runtime across developer systems and the deployment build |
| 2026-11-12 | Center the initial three day-wise cards on desktop while keeping one centered card on mobile | Makes the first visible choices balanced without changing carousel navigation |
| 2026-11-13 | Put custom-trip planning after the five individual trips and preselect every itinerary stop | Makes the custom option easier to find and lets visitors remove stops they do not want |
| 2026-11-14 | Build the custom-trip card collage from the first four trip images in CSS | Reuses existing licensed assets without adding a generated image file |
| 2026-11-14 | Use Prettier with two-space indentation for editable source and scripts | Keeps formatting consistent and repeatable without touching generated output or evidence |
| 2026-11-14 | Keep security guidance aligned with the public static-site and visitor-reviewed WhatsApp flow | The site has no backend, authentication, payment processing, or automatic message sending |
| 2026-11-27 | Offer the seven supplied vehicle models individually rather than generic vehicle classes | Lets visitors choose and enquire about the specific model shown in its representative photo |

### Open questions
- No project-wide MIT license or private license file was present; third-party notices remain. Add only owner-approved legal terms if a project license is needed.
- The production domain is heavenlytoursandtravels.com; WWW redirects to it with path/query preserved. Publishing to Cloudflare does not authorize a GitHub push.
- The portable Node.js build was validated on Windows; it was not run on macOS or Linux in this environment.
- In local Playwright checks, Escape dispatched a cancel event but did not close the credits dialog; a pointer click on its close button worked. Confirm expected keyboard dismissal in a real browser before changing dialog behavior.

### Changelog
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
