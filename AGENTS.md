# Agent Guide

Read this guide before making repository changes. Keep changes scoped, preserve existing behavior, and update this file's progress log when a task changes project structure or working conventions.

## Project at a glance

Heavenly Tours & Travels is a static pilgrimage travel website hosted on Vercel at https://heavenly-tours.vercel.app. It uses HTML, CSS and JavaScript, with a compiled React booking flow. There is no application backend, API or database.

Visitors can explore trips and services, choose package and vehicle preferences, and prepare a WhatsApp enquiry. WhatsApp opens a draft for the visitor to review and send; the site does not submit bookings or payments automatically.

## Start here

```powershell
npm ci
npm run typecheck
npm run build
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4188/. The production site is built locally and served from `dist/`. No remote JavaScript runtime CDN is used.

## Where things belong

| Location | Purpose |
|---|---|
| `src/site/` | Active page templates, styles, browser scripts, trip data and source media |
| `src/booking/` | React booking island and Tailwind input |
| `src/components/ui/` | Reusable React interface components |
| `src/lib/` | Shared TypeScript helpers |
| `scripts/` | Site build, asset compilation and deployment tools |
| `tests/browser/evidence/` | Browser scenarios, captured results and QA reports |
| `docs/` | Deployment, business, design and reference documentation |
| `artifacts/` | Generated design explorations and local deployment status |
| `dist/` | Generated static site; never edit by hand |
| `version.json` | Single source for the current site version and build metadata |

The active site lives in `src/site/`; do not create release-numbered copies of its source.

## Build and verification

- `npm run typecheck` checks the React/TypeScript source.
- `npm run build` runs `scripts/build_site.py`, compiles the booking island, and assembles the static pages and assets.
- Build output defaults to `dist/`. The build recreates that directory to prevent stale assets and rejects protected source, tooling, documentation, test, dependency and Git paths.
- `npm run build:booking` compiles the booking island independently into `dist/assets/`.
- Serve `dist/` locally for manual browser checks. Tests must intercept WhatsApp links; never send real messages.

For code or build changes, run typecheck and build. For behavior changes, run the relevant browser checks when available.

## Working rules

1. Make the smallest complete change; follow the existing patterns and update directly related documentation.
2. Keep editable runtime code in `src/`; generated bundles belong in `dist/`.
3. Preserve accessibility, responsive behavior, keyboard/touch support and reduced-motion behavior.
4. Preserve media attribution, licence notices and generation provenance.
5. Keep secrets out of the repository. Deployment credentials come from the existing local Vercel CLI login.
6. Do not deploy or change remote configuration without Vamsi's approval.
7. Do not remove files just because they look old; first confirm whether they are referenced, required evidence or licensed provenance.

## More information

- [Project overview and architecture](README.md)
- [Deployment workflow](docs/DEPLOYMENT.md)
- [Pricing notes](docs/business/PRICING.md)
- [Visitor journey](docs/business/VISITOR-JOURNEY.md)
- Design references and system: `docs/design/`
- Browser QA evidence: `tests/browser/evidence/`

## Progress log

### Current status
- **Phase:** Testing
- **Last updated:** 2026-11-12
- **Live URL:** https://heavenly-tours.vercel.app

### Done
- [x] Reorganized the repository around the active static-site architecture.
- [x] Removed duplicate and unused legacy site/build files.
- [x] Made builds clean and source-safe; confirmed the active build and typecheck pass.
- [x] Reorganized this guide and the README for people and coding agents.
- [x] Renamed the guide to `AGENTS.md` so VS Code/Copilot can auto-discover its workspace instructions.
- [x] Removed the unnecessary TypeScript `baseUrl` setting and verified path aliases still typecheck.
- [x] Smoke-tested the local site on desktop and mobile, including package selection, vehicle booking, trip planning, service enquiries, dialogs, and navigation.

### In progress
- None.

### Next
- Keep new work within the documented source, tooling, test, documentation and artifact folders.
- Rebuild `dist/` after reviewing its existing tracked local changes; avoid overwriting them.

### Decisions
| Date | Decision | Reason |
|---|---|---|
| 2026-11-12 | Use `src/site/` for the active site without a release-numbered folder | The source is not an archived version |
| 2026-11-12 | Use `scripts/build_site.py` as the sole site assembly entry point | Build automation belongs in `scripts/`; `npm run build` is the standard command |
| 2026-11-12 | Generate booking bundles in `dist/assets/` | Compiled output should not be mixed with editable source |
| 2026-11-12 | Keep QA evidence in `tests/`, design references in `docs/`, and generated explorations in `artifacts/` | Makes each file group easier to locate and understand |

### Open questions
- A fresh build was not run because `dist/` already contains tracked local changes and deletions.

### Changelog
- 2026-11-12 - Reorganized the repository around the active static-site architecture, moved project files to purpose-based folders, and removed confirmed obsolete source/build artifacts.
- 2026-11-12 - Reordered and rewrote `agent.md` and `README.md` to explain the current project, layout, build workflow and deployment boundaries.
- 2026-11-12 - Renamed `agent.md` to `AGENTS.md` for automatic workspace instruction discovery. Files: `AGENTS.md`, `README.md`.
- 2026-11-12 - Removed redundant `baseUrl` from `tsconfig.json`; retained the `@/*` mapping relative to the config file. Files: `tsconfig.json`, `agent.md`.
- 2026-11-12 - Tested the local site’s package, vehicle, trip-planning, service enquiry, dialog, and mobile-navigation flows; no runtime or failed-request errors found. Files: `AGENTS.md`.
- 2026-11-12 - Stopped ignoring `AGENTS.md` so the guide linked from the README can be committed and shared. Files: `.gitignore`, `AGENTS.md`.
