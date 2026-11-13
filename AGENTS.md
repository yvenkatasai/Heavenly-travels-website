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
- `npm run dev` builds and serves the site through Wrangler's local Worker runtime.
- `npm run deploy` builds and deploys the static assets to Cloudflare Workers. Do not run deployment without Vamsi's approval.
- Tests must intercept WhatsApp links; never send real messages.

For code or build changes, run typecheck and build. For behavior changes, run the relevant browser checks when available.

## Working rules

1. Make the smallest complete change; follow the existing patterns and update directly related documentation.
2. Keep editable runtime code in `src/`; generated bundles belong in `dist/`.
3. Preserve accessibility, responsive behavior, keyboard/touch support and reduced-motion behavior.
4. Preserve media attribution, licence notices and generation provenance.
5. Keep secrets out of the repository. Use Wrangler's local Cloudflare login for deployment.
6. Preserve third-party license and attribution notices; commercial use does not remove their terms.
7. Do not deploy or change remote configuration without Vamsi's approval.
8. Do not remove files just because they look old; first confirm whether they are referenced, required evidence or licensed provenance.

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
- **Last updated:** 2026-11-13
- **Hosting target:** Cloudflare Workers static assets

### Done
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

### In progress
- None.

### Next
- Keep new work within the documented source, tooling, test, documentation and artifact folders.
- Configure the Cloudflare account and custom domain, then deploy after approval.
- Run the browser checks against the production domain after deployment.

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

### Open questions
- No project-wide MIT license or private license file was present; third-party notices remain. Add only owner-approved legal terms if a project license is needed.
- A production deployment and custom domain were not configured; they require Vamsi's Cloudflare account and approval.
- The portable Node.js build was validated on Windows; it was not run on macOS or Linux in this environment.

### Changelog
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
