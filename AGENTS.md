# Agent Guide

Read this guide before making repository changes. Keep changes scoped, preserve existing behavior, and update the progress log in [docs/PROGRESS.md](docs/PROGRESS.md) when a task changes project structure or working conventions. Older history is archived in [docs/CHANGELOG.md](docs/CHANGELOG.md); keep this guide lean.

## Project at a glance

Heavenly Tours & Travels is a static pilgrimage travel website deployed as assets on Cloudflare Workers. It uses HTML, CSS and JavaScript, with a compiled React booking flow. There is no application backend, API or database.

Visitors can explore trips and services, choose trip and vehicle preferences, and prepare a WhatsApp enquiry. WhatsApp opens a draft for the visitor to review and send; the site does not submit bookings or payments automatically.

## Start here

Requires Node.js ^20.19.0 or >=22.12.0 (see `package.json` engines).

```sh
npm ci
npm run typecheck
npm run dev
```

`npm run dev` builds the site and serves it through Wrangler's local Worker runtime; run `npm run build` on its own to produce `dist/` without serving. No remote JavaScript runtime CDN is used. The Node.js build is designed to be portable across Windows, macOS and Linux; it has been validated on Windows.

## Where things belong

| Location | Purpose |
|---|---|
| `src/site/` | Active page templates, styles, browser scripts, trip data and source media |
| `src/booking/` | React booking island and Tailwind input |
| `src/components/ui/` | Reusable React interface components |
| `src/lib/` | Shared TypeScript helpers |
| `scripts/` | Site build, asset compilation, content generation, verification and indexing tools |
| `tests/` | Unit tests (WhatsApp messages, analytics consent, IndexNow, card reveals) |
| `tests/browser/` | Browser check scenarios and scripts; captured evidence lives in `tests/browser/evidence/` |
| `wrangler.jsonc` | Cloudflare Workers static-asset deployment configuration |
| `docs/` | Deployment, business, design, editing and reference documentation |
| `artifacts/` | Generated design explorations and local deployment status |
| `dist/` | Generated static site; never edit by hand |
| `version.json` | Single source for the current site version and build metadata |

The active site lives in `src/site/`; do not create release-numbered copies of its source.

## Build and verification

- `npm run typecheck` checks the React/TypeScript source.
- `npm run build` runs the Node.js build scripts, compiles the booking island, and assembles the static pages and assets. Output goes to `dist/`, which the build recreates to prevent stale assets; it rejects protected source, tooling, documentation, test, dependency and Git paths.
- `npm run build:booking` compiles the booking island independently into `dist/assets/`.
- `npm run verify:content` checks the built trip catalog, all public content URLs (currently 24), schema itineraries, website/breadcrumb entities, initial day-trip HTML, booking IDs, IndexNow ownership and local links without sending enquiries.
- `npm run test:whatsapp` checks shared enquiry formatting, all routes (currently 13), dates, optional fields and URL encoding without sending messages.
- `npm run test:analytics` checks the consent-gated Analytics behavior and that form values, WhatsApp draft URLs and query strings are never sent to Analytics.
- `npm run test:reveals` checks the Temple Trips card reveals, including delayed loads, scroll-away and reduced-motion cases.
- `npm run test:indexnow` checks the IndexNow key file, URL list and submission payload locally; `npm run indexnow:check` previews a submission and `npm run indexnow:submit` sends it only after an approved deployment.
- `npm run verify:production` performs read-only checks against the configured production domain after deployment.
- `npm run dev` builds and serves the site through Wrangler's local Worker runtime.
- `npm run deploy` builds and deploys the static assets to Cloudflare Workers. Do not run deployment without Vamsi's approval.
- Tests must intercept WhatsApp links; never send real messages or submit personal data to external services.

For code or build changes, run typecheck and build. For behavior changes, run the relevant unit and browser checks when available. Trip and page counts in the checks are derived from `src/booking/data.ts` (`PACKAGES`) and the page inventory in `scripts/site-paths.mjs`; when adding or removing trips or pages, update those sources together with the numbers in this guide.

## Security and privacy boundaries

- Treat this as a public static frontend: there is no server-side authorization, database, or private API.
- Keep only non-sensitive trip-planning preferences in `sessionStorage`; never store credentials, payment details, or identity documents.
- WhatsApp links may only open a prefilled draft for the visitor to review and send. Encode enquiry text in the URL; never send messages automatically.
- Keep visitor-controlled text out of `innerHTML` and executable contexts. Prefer `textContent` and DOM APIs; validate/allowlist values used in URLs and encode query parameters.
- External links opened in a new tab must use `rel="noopener noreferrer"`. Keep runtime assets local except the owner-approved Google Analytics tag, loaded only after opt-in consent. Never send form values, WhatsApp draft URLs or query strings to Analytics; keep enhanced measurement disabled.
- Keep secrets out of source, generated assets, browser storage, and test evidence. Use local Wrangler authentication for deployment.

## Working rules

1. Make the smallest complete change; follow the existing patterns and update directly related documentation.
2. Keep editable runtime code in `src/`; generated bundles belong in `dist/`.
3. Preserve accessibility, responsive behavior, keyboard/touch support and reduced-motion behavior.
4. Preserve media attribution, licence notices and generation provenance; commercial use does not remove their terms.
5. Do not remove files just because they look old; first confirm whether they are referenced, required evidence or licensed provenance.
6. Format editable source with Prettier (`npm run format`); check it with `npm run format:check`.
7. Use two-space indentation and LF line endings. Keep HTML inside template literals multiline and indented.
8. Add comments only to explain non-obvious intent, constraints, invariants, or side effects; do not narrate obvious code.
9. Keep generated output, browser evidence, reference captures, and asset metadata out of formatting changes.

Secrets, deployment approval and WhatsApp test boundaries are stated once, in the sections above.

## More information

- [Project overview and architecture](README.md)
- [Cloudflare deployment workflow](docs/DEPLOYMENT.md)
- [Website editing guide](docs/WEBSITE-EDITING-GUIDE.md)
- [WhatsApp message formatting](docs/WHATSAPP-MESSAGES.md)
- [Bing Webmaster Tools and IndexNow setup](docs/seo/BING-SETUP.md)
- [Pricing notes](docs/business/PRICING.md)
- [Visitor journey](docs/business/VISITOR-JOURNEY.md)
- Design references and system: `docs/design/`
- Browser QA evidence: `tests/browser/evidence/`
- Live progress log: [docs/PROGRESS.md](docs/PROGRESS.md)
- Full project history: [docs/CHANGELOG.md](docs/CHANGELOG.md)

## Progress tracking

The live progress log lives in [docs/PROGRESS.md](docs/PROGRESS.md), not in this guide. When a task changes project structure or working conventions, completes a piece of work, or leaves a decision agents need later:

- Update the status, Done, In progress, Next, Decisions and Changelog sections in `docs/PROGRESS.md`.
- Record what changed and why, the files touched, and how the change was verified.
- Keep only recent items in `docs/PROGRESS.md`; move older completed work, decisions and changelog entries to [docs/CHANGELOG.md](docs/CHANGELOG.md).
- Never record secrets, credentials or enquiry details in the log.
