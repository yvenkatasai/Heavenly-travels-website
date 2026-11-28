# Progress Log

Live progress log for the Heavenly Tours & Travels website. Update it whenever a task changes project structure or working conventions, completes a piece of work, or leaves a decision an agent needs later. Keep only recent items here; move older completed work, decisions and changelog entries to [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Current status
- **Phase:** Testing
- **Last updated:** 2026-11-28
- **Hosting target:** Cloudflare Workers static assets

## Done (recent)
- [x] Fixed all seven Temple Trips reveals by preloading nearby masked images and waiting for image readiness while the card is onscreen; verified all seven cards at desktop 1440x900 and mobile 390x844 (2026-11-28).
- [x] Added explicit IndexNow preview/submission commands with live ownership/content checks and local deduplication receipts; documented Bing Webmaster Tools setup (2026-11-27). Run submission after deployment, never claim an acknowledgement guarantees indexing.
- [x] Added owner-supplied representative car photos for seven individual vehicle-model choices; preserved originals outside deployed assets and used uncropped optimized WebP derivatives (2026-11-27).
- [x] Replaced generic vehicle classes with the seven supplied vehicle models across both booking pickers, the vehicle FAQ and group-trip copy (2026-11-27).
- [x] Verified the real Google Business Profile, owner-confirmed 24-hour operation and Search Console indexing; added verified Maps/review links and night-stay guidance without fabricating unconfirmed details (2026-11-26).
- [x] Streamlined AGENTS.md and moved archived history to docs/CHANGELOG.md; documented the Node.js version requirement and `npm run test:analytics`; trip and sitemap counts in the checks now derive from `src/booking/data.ts` and `scripts/site-paths.mjs` instead of hardcoded numbers (2026-11-28).
- [x] Moved this progress log out of AGENTS.md into docs/PROGRESS.md so the agent guide stays purely instructional (2026-11-28).

Older completed work is archived in [docs/CHANGELOG.md](docs/CHANGELOG.md).

## In progress
- None.

## Next
- Keep new work within the documented source, tooling, test, documentation and artifact folders.
- Keep the live Cloudflare custom domain and its HTTPS, DNSSEC and canonical redirect configuration intact.
- Run content and production checks after future approved deployments.

## Decisions (current)
| Date | Decision | Reason |
|---|---|---|
| 2026-11-12 | Use `src/site/` for the active site without a release-numbered folder | The source is not an archived version |
| 2026-11-12 | Use `scripts/build_site.mjs` as the sole site assembly entry point | Build automation belongs in `scripts/`; `npm run build` is the standard command |
| 2026-11-12 | Generate booking bundles in `dist/assets/` | Compiled output should not be mixed with editable source |
| 2026-11-12 | Keep QA evidence in `tests/`, design references in `docs/`, and generated explorations in `artifacts/` | Makes each file group easier to locate and understand |
| 2026-11-12 | Deploy static assets with Cloudflare Workers and Wrangler | The site is static and needs no request-time application server |
| 2026-11-12 | Keep third-party MIT and attribution notices | Commercial use does not remove the license notice requirements for adapted or bundled work |
| 2026-11-12 | Use Node.js for the complete build | Avoids requiring a separate Python runtime across developer systems and the deployment build |
| 2026-11-14 | Use Prettier with two-space indentation for editable source and scripts | Keeps formatting consistent and repeatable without touching generated output or evidence |
| 2026-11-27 | Offer the seven supplied vehicle models individually rather than generic vehicle classes | Lets visitors choose and enquire about the specific model shown in its representative photo |

Archived decisions are in [docs/CHANGELOG.md](docs/CHANGELOG.md).

## Open questions
- No project-wide MIT license or private license file was present; third-party notices remain. Add only owner-approved legal terms if a project license is needed.
- The production domain is heavenlytoursandtravels.com; WWW redirects to it with path/query preserved. Publishing to Cloudflare does not authorize a GitHub push.
- In local Playwright checks, Escape dispatched a cancel event but did not close the credits dialog; a pointer click on its close button worked. Confirm expected keyboard dismissal in a real browser before changing dialog behavior.

## Changelog (recent)
- 2026-11-28 - Moved the progress log out of AGENTS.md into docs/PROGRESS.md so the agent guide stays purely instructional. Files: `AGENTS.md`, `docs/PROGRESS.md`, `docs/CHANGELOG.md`.
- 2026-11-28 - Streamlined the agent guide and made its verification notes more accurate: moved archived progress and the full changelog to docs/CHANGELOG.md, documented the Node.js version requirement and `npm run test:analytics`, consolidated duplicate rules, corrected the OS-support wording, and linked the editing and WhatsApp docs. Trip and sitemap counts in the checks now derive from `src/booking/data.ts` and the shared page inventory in `scripts/site-paths.mjs` instead of hardcoded numbers. Files: `AGENTS.md`, `docs/CHANGELOG.md`, `package.json`, `scripts/site-paths.mjs`, `scripts/check-content.mjs`, `scripts/check-production.mjs`.
- 2026-11-28 - Fixed all seven Temple Trips reveals by preloading nearby masked images and waiting for image readiness while the card is onscreen. Added delayed-load, scroll-away, error and reduced-motion regression tests (`npm run test:reveals`). Verified all seven cards at desktop 1440x900 and mobile 390x844 without horizontal overflow. Files: `src/site/pilgrimage.js`, `tests/package-reveal.test.mjs`, `package.json`.
- 2026-11-27 - Replaced generic sedan/SUV/bus categories with the seven supplied vehicle models, applied model-specific representative photos to both booking pickers, and updated the vehicle FAQ and group-trip copy. Files: `src/booking/`, `src/site/`, `tests/browser/check-packages-accommodation.cjs`, `AGENTS.md`.
- 2026-11-27 - Added optimized representative vehicle photos to matching booking choices, retained the supplied originals outside deployed assets, and documented that photos do not confirm fleet availability. Files: `src/booking/`, `src/site/assets/vehicles/`, `src/site/booking.css`, `src/site/compact-layout.css`, `src/site/credits.html`, `scripts/build_site.mjs`, `AGENTS.md`.

Older entries are archived in [docs/CHANGELOG.md](docs/CHANGELOG.md).
