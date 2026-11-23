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

The production custom domain is `https://heavenlytoursandtravels.com`. Cloudflare's enabled Single Redirect rule “Canonical WWW to primary HTTPS domain” returns 301 from `https://www.heavenlytoursandtravels.com/*` to `https://heavenlytoursandtravels.com/${1}`, preserving the query string. It is a zone rule, not part of the Worker upload. The backup workers.dev hostname sends `X-Robots-Tag: noindex, follow`.

After an approved upload, run `npm.cmd run verify:production`. Before uploading, run `npm.cmd run verify:content` after the build. On Windows use `npm.cmd` and `npx.cmd` if PowerShell blocks the `.ps1` wrappers; changing the execution policy is unnecessary.

## Public business and discovery content

Edit public business facts in `src/site/site.config.json`, FAQ answers in `src/site/faqs.json`, and canonical trip data in `src/booking/data.ts`. `scripts/build-agent-content.mjs` generates the information pages, thirteen trip detail pages, `travel-catalog.json`, `llms.txt` and `llms-full.txt`. The main build adds metadata, schema, robots instructions and a nineteen-URL sitemap. All are public facts; never add private customer information or authentication material.

Vehicle selection is noindex and unknown URLs return the branded HTTP 404 page. The catalog is read-only custom JSON, not a merchant checkout feed or an implemented commerce protocol. No public prices or online payments are enabled. See `AAO-IMPLEMENTATION.md` for audit scope and `WEBSITE-EDITING-GUIDE.md` for the editing walkthrough.

Do not deploy or change remote configuration without approval from Vamsi.

## Static assets and caching

Cloudflare serves the HTML, CSS, JavaScript, images, fonts and videos from `dist/` as Worker static assets. The build extracts and minifies page styles and scripts into content-hashed files, preserving script order with `defer` and root-relative font URLs. The booking bundle and stylesheet receive content-hash query strings. Generated `_headers` allows browsers to cache assets for one day; HTML keeps Cloudflare's default revalidation so visitors receive updated bundle references. Give changed media a new filename to avoid stale browser caches. Unknown paths return 404 rather than the homepage.

The approved full-resolution hero masters remain in `src/site/assets/`. The homepage uses lighter `tirumala-hero-mobile-fast.webp` (720 × 1279) and `tirumala-hero-desktop-fast.webp` (1672 × 941) derivatives. Mobile decorative dots render a still texture while idle and animate on touch.

## Licensing

There is no project-wide MIT license. Commercial use does not remove third-party license conditions: the supplied MIT components and bundled dependency licenses, font licenses, and image attribution/license notices are retained with the project and build output.

## Domain security configuration

The Cloudflare zone for `heavenlytoursandtravels.com` uses Always Use HTTPS, minimum TLS 1.2, TLS 1.3, and DNSSEC. HTTP requests to the apex and www redirect to their HTTPS equivalent. These zone settings are managed separately from Wrangler static-asset deployments. Do not disable DNSSEC or change nameservers to troubleshoot an ISP retaining pre-migration records. Verify authoritative delegation and DS records before considering any DNS changes.

Browser security headers are authored in `src/site/_headers` and copied to the build. The CSP permits local runtime assets and inline styles required by React/Motion, but does not allow inline scripts, remote scripts, plugins or frames. Other headers prevent MIME sniffing and framing, limit referrer data and unused browser permissions, and remember HTTPS for one day without preloading or applying HSTS to all subdomains. Test through Wrangler rather than a plain file server to exercise these headers. The original curtain timing is retained.
