# Bing discovery and indexing

## What changed on 27 November 2026

The homepage, robots.txt and sitemap returned HTTP 200, and the page text was already present in the HTML. Cloudflare's Bot Fight Mode and AI crawler protection were disabled; no custom firewall ruleset was listed. This does not prove that Bing has crawled or indexed the site. DNS contains Google ownership verification, but no Bing ownership record was found; Bing ownership could still be verified through another method.

The homepage title now starts with the business name and Tirupati to distinguish it from similarly named agencies. Existing service guides, trip pages, reviewed answers and booking behavior remain unchanged. No competitor prices or business claims were copied.

IndexNow support notifies participating search engines, including Bing, about new or changed public pages. An HTTP 200 means received; HTTP 202 means received with ownership validation pending. Neither means indexed or ranked.

## Files explained for a beginner

### Verified deployment result

- Cloudflare version: `94d069bf-c503-4445-a457-17016955b886`, deployed to both business hostnames.
- TypeScript, build, content verification, 3 IndexNow tests, 19 WhatsApp formatter tests, formatting and the deployment dry run passed.
- All 12 production checks passed, including every sitemap URL, redirects, security headers, the public ownership key and HTML responses to crawler-name test requests.
- IndexNow acknowledged all 24 canonical URLs with HTTP **202**: received, ownership validation pending. This is not evidence of indexing or ranking. The acknowledgement is recorded in ignored `artifacts/deployment/indexnow-receipt.json`.
- Bing Webmaster Tools account setup was initially blocked by the browser connection. It was completed on 28 November 2026 as recorded below.
- That deployment was not pushed to GitHub at the time.

### Bing account setup completed on 28 November 2026

- Added and verified `https://heavenlytoursandtravels.com/` in the business Google account's Bing Webmaster Tools.
- Added the DNS-only CNAME `f7032fe58f4449ce6534aec74946f48d.heavenlytoursandtravels.com` pointing to `verify.bing.com` in Cloudflare. Retain it for ownership verification; it does not change the website's hosting or require a rebuild.
- Bing confirmed the sitemap was successfully submitted for processing. Its immediate status was **Processing**, not a completed crawl.
- Homepage URL Inspection showed **Discovered but not crawled** with an older DNS connection failure. The subsequent **Live URL** test passed: **URL can be indexed by Bing**.
- Requested homepage indexing; Bing confirmed **URL submitted successfully. We will review the URL for indexation.** This does not mean the homepage is already indexed or ranked.
- The live test also reported six image-alt notices. These did not block the live indexability test and were not changed as part of account setup.

1. `src/site/site.config.json` contains the homepage title. This is the title search engines may display; they can choose a different one.
2. `src/site/indexnow.json` holds the public ownership key. This is served openly, unlike your private Cloudflare login credentials.
3. `scripts/build_site.mjs` copies that key into the finished website as a root text file and adds the website's Tirupati alternate name to structured data.
4. `scripts/indexnow.mjs` reads the finished sitemap, selects new/changed pages, checks their live content and sends a notification. It rejects external, private booking and noncanonical URLs. Successful receipts are stored locally under ignored `artifacts/deployment/`.
5. `tests/indexnow.test.mjs`, `scripts/check-content.mjs` and `scripts/check-production.mjs` check the submission rules, generated key and live access. Requests using crawler names diagnose response behavior; they do not prove access from a genuine crawler's IP address.

## Repeat after a real website change

Open PowerShell in this project on the HDD. Use `.cmd` on Windows if script execution is disabled.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:content
npm.cmd run test:indexnow
npx.cmd wrangler deploy --dry-run
npx.cmd wrangler deploy
npm.cmd run verify:production
npm.cmd run indexnow:check
npm.cmd run indexnow:submit
```

The check command previews URLs without sending anything. Submit only after deployment. It checks the live ownership file, sitemap and page hashes first. It does not repeatedly retry errors or notify unchanged pages. Keep the local receipt; deleting it makes the next run treat all pages as new. Page deletions need a deliberate separate notification; this helper handles current sitemap pages only. Submission is explicit, not automatically triggered by ordinary builds or deploys.

## Bing Webmaster Tools account step

1. Open https://www.bing.com/webmasters/ and sign in to the business owner's account.
2. Add `https://heavenlytoursandtravels.com/`. Import its verified Google Search Console property if offered, or use the exact ownership record Bing provides. Never invent a verification code.
3. Submit `https://heavenlytoursandtravels.com/sitemap.xml` in Sitemaps.
4. Inspect the homepage and the Tirupati/Tirumala tour and car-rental service pages in URL Inspection. Request indexing where offered and record any crawl or exclusion reason.
5. Review Search Performance, IndexNow and crawl/indexing reports as Bing processes the site. Bing provides no guaranteed indexing date or rank.

## Building visibility beyond the code

- Keep the business name, phone, website and real service location consistent on Google Business Profile, Bing Places and legitimate travel directories.
- Ask actual customers for honest reviews; do not buy reviews, backlinks or automated mentions.
- Add permissioned real fleet and trip photographs, exact vehicle capacities and actual booking conditions when available. Competitors' details are not evidence of this business's services.
- Review query impressions and indexed URLs before adding content. Improve relevant existing guides rather than creating near-identical keyword pages.

Sources: https://www.indexnow.org/documentation and https://www.bing.com/webmasters/help/why-is-my-site-not-in-the-index-2141dfab
