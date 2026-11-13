# Heavenly Tours & Travels

A static pilgrimage travel website for exploring temple trips, travel services, package preferences and vehicle options. The site includes a React booking interface compiled into local static assets. It has no application backend, API or database.

## Get started

Requirements: Node.js and npm. The build is supported on Windows, macOS and Linux.

```sh
npm ci
npm run typecheck
npm run build
npm run dev
```

Wrangler serves the built site locally. The build emits the complete static site to `dist/` and does not depend on a third-party runtime JavaScript CDN.

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
wrangler.jsonc          Cloudflare Workers static-assets configuration
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

`npm run build` calls the Node.js build scripts. It:

1. Compiles the React booking island and prefixed Tailwind CSS into `dist/assets/`.
2. Assembles the HTML pages from `src/site/` templates and source modules.
3. Copies the active site media into `dist/assets/`.

The build recreates `dist/` first so deleted or outdated assets cannot remain in the output. It refuses to use source, tooling, docs, tests, dependencies or Git directories as the output location.
`wrangler.jsonc` configures an assets-only Cloudflare Worker that serves `dist/`.

Useful commands:

| Command | Purpose |
|---|---|
| `npm run typecheck` | Type-check the React/TypeScript source |
| `npm run build` | Build the complete static site |
| `npm run build:booking` | Build only the React booking island into `dist/assets/` |
| `npm run dev` | Build and run the local Cloudflare Worker preview |
| `npm run deploy` | Build and deploy the Worker using your Wrangler login |

## Find project information

- [Agent guide](AGENTS.md): repository conventions and coding-agent workflow
- [Deployment guide](docs/DEPLOYMENT.md): Cloudflare Workers setup and deployment
- [Pricing notes](docs/business/PRICING.md)
- [Visitor journey](docs/business/VISITOR-JOURNEY.md)
- Design system and reference material: `docs/design/`
- Browser QA evidence: `tests/browser/evidence/`
- Generated artwork, prompts and provenance: `artifacts/image-generation/`

Authenticate with `npx wrangler login` before deploying. Do not deploy or alter remote configuration without approval from Vamsi.

## Licensing

The project has no project-wide MIT license. This change does not apply an open-source license to the site's original code. Third-party components, fonts and images keep their own licenses and required notices; those notices are not removed for commercial use.
