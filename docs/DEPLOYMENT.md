# Cloudflare Workers deployment

The site is a static build served as assets by an assets-only Cloudflare Worker. Wrangler reads `wrangler.jsonc` and deploys the contents of `dist/`; there is no application API or server-side booking flow.

## Prerequisites

- Node.js `^20.19.0` or `>=22.12.0` and npm
- A Cloudflare account with Workers enabled
- Wrangler authentication for that account

The same Node-based build works on Windows, macOS and Linux.

## Preview locally

```sh
npm ci
npm run typecheck
npm run dev
```

`npm run dev` builds the site and starts Wrangler's local Worker preview. The preview does not contact the live site or send enquiries.

## Deploy

Authenticate once with the Cloudflare account that owns the Worker:

```sh
npx wrangler login
```

Then build and deploy:

```sh
npm run deploy
```

The Worker is named `heavenly-tours-travels`. `workers_dev` is enabled for its Cloudflare-provided `workers.dev` address. To serve a custom domain, attach a domain that is active in the same Cloudflare account through the Workers dashboard. No account IDs, zone IDs or credentials are committed here.

Do not deploy or change remote configuration without approval from Vamsi.

## Static assets and caching

Cloudflare serves the HTML, CSS, JavaScript, images, fonts and videos from `dist/` as Worker static assets. Cloudflare handles edge caching. The booking bundle and stylesheet receive content-hash query strings during the build so changed bundles do not reuse stale browser cache entries. Unknown paths return 404 rather than the homepage.

## Licensing

There is no project-wide MIT license. Commercial use does not remove third-party license conditions: the supplied MIT components and bundled dependency licenses, font licenses, and image attribution/license notices are retained with the project and build output.
