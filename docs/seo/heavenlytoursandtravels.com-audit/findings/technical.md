# Technical SEO specialist review

Date: 25 November 2026 (India). Target: https://heavenlytoursandtravels.com. Workflow: installed `seo-technical` v2.6.2 and supporting sitemap/performance instructions. This is a read-only baseline; implementation is owned by the primary agent.

## Scope and evidence

Fetched all 24 sitemap pages over public HTTPS, with one-second spacing, and ten public alias/error/fallback requests. Parsed the sitemap with Windows' XML parser. Raw crawl evidence is in `artifacts/deployment/claude-seo-technical/crawl.json`; a compact summary is in `summary.json`. No authenticated Search Console inspection, field INP measurement, browser rendering, paid API or third-party Python script was run by this specialist. Browser testing remains the primary agent's responsibility.

## Result

No critical indexing block found. Every sitemap page returned 200, had one H1, one correct self-canonical, index/follow robots and distinct title/description. All public pages are reachable within two raw-HTML links from the homepage. The site is static-generated content with a React interaction island, not a client-only SPA.

| Category | Measured evidence | Result |
|---|---|---|
| Crawlability | robots 200, sitemap declaration matches working XML, 24/24 pages 200, max depth2 | Pass |
| Indexability | 24 correct self-canonicals, unique titles/descriptions, no unexpected noindex | Pass |
| Security | HTTPS requests successful; HTTP301; CSP/HSTS/nosniff/XFO/referrer/permissions present | Pass for these checks; no blanket security certification |
| URL structure | Descriptive canonical paths; WWW301 preserves path/query; extension/slash aliases307 to canonical | Pass; aliases use Cloudflare default temporary normalization |
| Mobile | Viewport and responsive source present; mobile/desktop Googlebot-named requests return equivalent metadata and seven-temple content | Partial: no rendered mobile viewport testing by this specialist |
| Core Web Vitals | Earlier supplied Lighthouse lab result only | Not measured as field CWV; INP unknown |
| Structured data | Raw JSON-LD present on public pages | Separate schema specialist validates semantics |
| JavaScript rendering | Trip detail pages are raw HTML; homepage day rail only CSR | Medium improvement below |
| IndexNow | Not configured in source | Optional opportunity; Google does not use IndexNow |

No numerical technical score is assigned to unmeasured mobile rendering, field CWV or search indexation. HTTP success with a Googlebot user-agent name is an access test, not verification of the real Googlebot or proof of indexing.

## Findings to fix

### T1 — Medium: homepage day-trip entry point depends on JavaScript

Observation: `src/site/page.html` contains only a loading paragraph inside `#booking-flow-root`. The five day cards, `id="day-packages"`, their descriptions and details buttons are created by `src/booking/main.tsx`. A raw fetch has links to `#day-packages` without that target. The complete and seven individual cards already have build-time HTML. All five day detail pages are present and reachable through `/trips`, so this is not a whole-site indexing failure.

Recommended change: build a useful static day-trip preview or server-render the island from the existing canonical `DAY_PACKAGES` data. Include the five names, actual route summaries and crawlable links to the matching static detail pages. Keep the existing React rail and dialogs after JavaScript loads; avoid duplicate IDs and visible duplicate sections.

Dependency: use the existing trip catalog mapping; do not hand-copy itineraries or add new prices.

Failure check: fetch homepage without executing JavaScript and require `id="day-packages"`, all five day-trip names and links. In a browser, require exactly one day section and working View trip plan/vehicle flow after mount.

Leading indicator: static day-route links remain in build content checks and Search Console begins reporting the intended day-detail URLs. Indexing is not guaranteed.

### T2 — Medium: day-trip descriptions are only short notes

The live descriptions are:
- One day: `Darshan ticket already booked.`
- Two days: `Tirumala, Tirupati local temples and Srikalahasti.`
- Three days: `Tirumala, Vellore and the temples around Tirupati.`
- Four days: `Temple visits with a night in Tiruvannamalai.`
- Five days: `A five-day temple trip with Kanchipuram and Thiruthani.`

Observation: these 30–55-character notes do not explain travel coordination or the trip selection action. A character limit is a display heuristic, not a Google ranking requirement.

Recommended change: provide distinct factual descriptions describing real covered stops and a WhatsApp quotation action. Preserve the one-day requirement that darshan tickets are already booked. Do not add invented duration timing, rates, availability or guarantees.

Dependency: confirmed trip data from `src/booking/data.ts` and `build-agent-content.mjs` page metadata.

Failure check: raw day-detail page descriptions are distinct, nonempty and explain their own route. Avoid checking exact 120-word minima or padding useful pages to arbitrary word counts.

Leading indicator: Search Console snippets/search appearance can be reviewed after Google recrawls; Google may rewrite descriptions.

### T3 — Low: avoid internal links to redirecting HTML aliases

Source `src/site/app.js` uses `location.assign('vehicles.html')` and `vehicles.html?package=...`. Cloudflare normalizes these with307 to `/vehicles`. Public static links already use `/vehicles`.

Recommended change: update the JavaScript navigation target to canonical `/vehicles` URLs, preserving query IDs. This saves a redirect for people choosing a vehicle. It is not an indexing emergency because the vehicle utility is deliberately noindex.

Failure check: selecting each package navigates directly to `/vehicles?package=<correct-id>` with its selection preserved. No actual WhatsApp messages should be sent.

## Correct existing behavior to preserve

- robots: `User-agent: *`, `Allow: /`, the correct apex sitemap address.
- Missing arbitrary page returns real404, noindex.
- `/vehicles?package=days-3` returns200, canonical `/vehicles`, robots noindex/follow; deliberately absent from sitemap.
- Worker fallback returns200 with `X-Robots-Tag: noindex, follow` and apex canonical.
- Public pages are small (about6–54KB raw HTML), far below Google's HTML fetch ceiling.
- All sampled images have alt attributes; empty alt on purely decorative images is correct.
- `history.pushState` appears only for user-clicked same-page anchor navigation; no evidence of Back-button hijacking.
- Curtain fallback2550ms and reduced-motion/return/deep-link bypass are existing user-approved behavior. Do not shorten curtain timing to chase a score.

## Primary references

- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): keep content and crawlable links accessible.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): list intended canonical URLs and use truthful modification dates.
- [Cloudflare HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/): default extension/slash normalization uses307. Do not misclassify this documented behavior as a broken page.
