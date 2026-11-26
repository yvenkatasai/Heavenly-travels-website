# Performance specialist baseline

25 November2026. No new browser/Lighthouse run was performed by this specialist. The primary agent supplied the earlier25 November mobile PageSpeed result: performance87, accessibility96, best practices92, SEO100, LCP3.2s, CLS0, TBT10ms, Moto G Power simulation on slow4G, Lighthouse13.6.0. CrUX showed no data; field INP is unknown. Do not translate TBT10ms into an INP pass or label lab scores a field CWV pass.

Existing report: https://pagespeed.web.dev/analysis/https-heavenlytoursandtravels-com/2jvhiymtuumqmhppwhrt6j?form_factor=mobile

Verified source/network facts:
- Hero has responsive mobile/desktop WebP preloads, a picture source, explicit dimensions and high fetch priority; originals are retained but not used as the active hero.
- Mobile active hero157,396bytes, desktop209,160bytes (supplied prior measurements); existing code loads local fonts with preload and swap.
- React booking bundle is427,537bytes uncompressed on disk, minified and deferred; not a blocking remote CDN runtime.
- Homepage references three stylesheets. Sampled hashed CSS/JS return200, expected MIME and one-day public caching. HTML returns must-revalidate rather than stale long-lived caching.
- Large showreel is about11.5MB on disk but video preload is none and poster/film are deferred until visitor opens it. Do not treat every asset in dist as initial transfer.
- No app backend, database or request-time SSR exists; the site serves Cloudflare static assets.

Opportunities:
1. Medium: use build-time/static rendering for homepage day cards to reduce content dependency on deferred427KB React JS. Keep interactive enhancement and test no duplicate section. This also helps non-JS reading (technical findingT1).
2. Low/medium: consider longer browser caching only for genuinely content-addressed assets after a deliberate versioning strategy. Do not make unversioned image URLs immutable or change all assets blindly. One-day caching is safe current behavior, not a severe failure.
3. Medium: inspect measured LCP subparts in a new mobile PageSpeed run before changing loading strategy. Existing hero is already preloaded. Preserve user-approved curtain timing; no measured proof yet that shortening or removing it is appropriate.

The earlier report's blocked Cloudflare beacon was corrected by the primary agent before this specialist review. A new report is required before claiming better best-practices/performance scores.

Failure checks: mobile live PSI or browser throttling on the new deployment, unchanged curtain timing, no horizontal overflow or layout shifts, no missing hero, and field CrUX once sufficient real traffic exists. Performance outcomes must be measured, not forecast numerically.

Reference: [Web Vitals](https://web.dev/articles/vitals), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
