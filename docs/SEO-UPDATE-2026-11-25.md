# Search content update — 25 November 2026

The owner approved all five factual answers on 25 November. The answers use the owner's real questions about package costs, Tirumala costs, temple coverage, number of temples and vehicle types. Quotes remain private and are confirmed on WhatsApp. Both driver-operated and self-drive rentals were confirmed by the owner.

Published to Cloudflare Worker `heavenly-tours-travels`, version `21002f84-da0c-47cd-811b-dfe6e3d9b785`. Live production checks passed: HTTPS, WWW redirect, real 404, security headers, hero image, all 13 trip pages and all 24 sitemap URLs. All five approved answers were found in the live raw HTML. GitHub was not changed during this update.

## Edit this yourself

1. Open `src/site/search-answers.json`. Each object has a `question` and an `answer`. Change the words inside double quotes. Keep commas between objects. These are the approved public answers; the file under `docs/business/` records the review draft.
2. Open `scripts/build-agent-content.mjs` to find where each answer appears. Search for `directAnswer`. It builds real HTML, so the answers can be read without JavaScript. The new pages are `/tirupati-tour-packages`, `/tirumala-tour-packages`, `/tirupati-car-rentals` and `/tirupati-temples`; the coverage answer also appears on the complete seven-temple trip page.
3. Open `src/site/site.config.json` to change the homepage search title and description. Other page titles and descriptions are next to their page definitions in the generator. Describe what each page actually offers; avoid repeating the same description everywhere.
4. Open `src/site/content-dates.json` only when you actually review or change that page's content. The build uses these dates for the visible update label, structured data and sitemap. An ordinary rebuild does not invent a newer date.
5. The homepage's links to these guides are in `src/site/page.html`. Their appearance follows the existing cream, green and local-font design, using `information.css` and `simple-closing.css`.
6. Run the following in PowerShell from the project folder:

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:content
npm.cmd run test:whatsapp
node --test tests/analytics-consent.test.mjs
```

`build` creates `dist`, the finished files Cloudflare serves. Never edit `dist` directly. `verify:content` checks 24 indexable URLs, unique titles/descriptions, trip links, approved answers, local assets and dates. WhatsApp tests do not send messages.

7. Preview with `npm.cmd run dev`. Check phone and desktop layouts. Publish with `npm.cmd run deploy`, then run `npm.cmd run verify:production`. Publishing to Cloudflare and pushing to GitHub are separate operations.

## Analytics privacy

`src/site/analytics.js` waits for permission before loading Google's tag. It counts page visits and clicks to call or open WhatsApp; these are enquiries, not completed bookings. It excludes customer form values, WhatsApp drafts and query strings. `analytics.css` styles the choice panel. Footer Cookie choices lets visitors withdraw consent. The GA web stream is G-B8LNCNQ6VS; enhanced measurement was switched off and checked after reloading its settings on 25 November.

The `whatsapp_click` and `phone_click` events are saved as key events, counted once per session without a monetary value. Google had not reported incoming stream data when the goals were created; report processing and real visitor conversions are not proven by setup alone. Browser testing confirmed no Google script before consent, the expected tag after consent, working opt-out and no console errors on the deployed rental guide. Four consent/privacy unit tests and 19 WhatsApp-formatting tests passed; dependency audit reported zero vulnerabilities.

Cloudflare Web Analytics automatic injection was disabled because its beacon conflicted with the site's CSP and the new explicit consent flow. The CSP was not opened to that extra script. The mobile PageSpeed baseline before this deployment was 87 performance, 96 accessibility, 92 best practices and 100 SEO (simulated Moto G Power, slow 4G; no real-user data). Report: https://pagespeed.web.dev/analysis/https-heavenlytoursandtravels-com/2jvhiymtuumqmhppwhrt6j?form_factor=mobile. These scores are not a post-deployment performance claim. The card reveal keeps movement but no longer dims readable card text to 40% opacity; other contrast findings remain for a separate measured pass.

## What this does and does not prove

The guides answer real questions and connect visitors to the matching trips. They do not guarantee first position, indexing, traffic or an AI citation. The existing Search Console sitemap address remains the same; it will contain the new URLs after deployment. Google Business Profile verification remains an owner-managed external step.

Cloudflare's AI blocking and crawler protection were disabled when checked on 25 November; no protection was weakened for this update. A successful request using a crawler's name is only an access check, not proof that the real crawler indexed the site.

No LinkedIn, Medium or Reddit posts were published. Those need the intended account, community rules and owner-approved wording. Do not use hidden promotion or invented reviews. Outstanding launch account checks, real-device testing and monitoring must not be represented as finished by this content update.
