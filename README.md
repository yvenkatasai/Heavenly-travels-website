# Heavenly Tours & Travels

A static pilgrimage travel website for exploring temple trips, travel services, package preferences and vehicle options. The site includes a React booking interface compiled into local static assets. It has no application backend, API or database.

**Live site:** [heavenly-tours.vercel.app](https://heavenly-tours.vercel.app)

## Get started

Requirements: Node.js/npm and Python.

```powershell
npm ci
npm run typecheck
npm run build
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4188/. The build runs locally and emits the complete site to `dist/`; it does not depend on a third-party runtime JavaScript CDN.

## What the site does

- Presents pilgrimage packages, temple destinations and travel services.
- Lets visitors review trip and vehicle options and prepare an enquiry.
- Opens a WhatsApp message draft for the visitor to review and send. It does not send a message, take payment or confirm a booking automatically.
- Treats package levels as preferences where final prices or inclusions have not been confirmed.

## How the project is organized

```text
src/
  site/                 Active static pages, styles, browser scripts, data and source media
  booking/              React booking island and Tailwind input
  components/ui/        Reusable React components
  lib/                  Shared TypeScript helpers
scripts/                Build, asset compilation and deployment tools
tests/browser/          Browser scenarios, captures and QA reports
docs/
  business/             Pricing and visitor-journey notes
  design/               Design system and reference research
artifacts/              Generated design explorations and local deployment status
dist/                   Generated production site; do not edit by hand
version.json            Current release/build metadata
AGENTS.md               Workspace instructions automatically discovered by coding agents
```

The active site source is in `src/site/`, without a version-numbered source folder. `version.json` is the single source for the site version.

## Build workflow

`npm run build` calls `scripts/build_site.py`. It:

1. Compiles the React booking island and prefixed Tailwind CSS into `dist/assets/`.
2. Assembles the HTML pages from `src/site/` templates and source modules.
3. Copies the active site media into `dist/assets/`.

The build recreates `dist/` first so deleted or outdated assets cannot remain in the output. It refuses to use source, tooling, docs, tests, dependencies or Git directories as the output location.

Useful commands:

| Command | Purpose |
|---|---|
| `npm run typecheck` | Type-check the React/TypeScript source |
| `npm run build` | Build the complete static site |
| `npm run build:booking` | Build only the React booking island into `dist/assets/` |
| `python -m http.server 4188 --bind 127.0.0.1 --directory dist` | Serve the built site locally |

## Find project information

- [Agent guide](AGENTS.md): repository conventions and coding-agent workflow
- [Deployment guide](docs/DEPLOYMENT.md): Vercel deployment details and verification notes
- [Pricing notes](docs/business/PRICING.md)
- [Visitor journey](docs/business/VISITOR-JOURNEY.md)
- Design system and reference material: `docs/design/`
- Browser QA evidence: `tests/browser/evidence/`
- Generated artwork, prompts and provenance: `artifacts/image-generation/`

Deployment uses the existing local Vercel CLI login via `scripts/deploy_vercel.py`. Do not deploy or alter remote configuration without approval from Vamsi.
