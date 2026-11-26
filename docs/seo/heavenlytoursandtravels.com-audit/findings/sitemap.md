# Sitemap review

25 November 2026. Live `/robots.txt` returned200 and declared the actual working `/sitemap.xml`. Windows XML parsing succeeded with24 entries. Size:2,192bytes. Every entry is unique, HTTPS, apex-hosted, canonical, indexable and returned200. There is no sitemap index, cross-host URL, query token, redirected entry, noindex utility page, `<priority>` or `<changefreq>`.

The six currently mapped `<lastmod>` dates are25 November2026, matching the approved content update; other pages omit the optional date. Do not replace missing dates with build time. All24 pages were discoverable through raw HTML navigation within two links from the homepage. No public page linked from the crawl was missing from the sitemap, excluding intentional utility/data/assets routes.

No sitemap fix is needed. Keep the existing Search Console submission URL. A submitted sitemap supports discovery but does not prove Google indexed its pages.

The bundled `sitemap_discovery.py` was not executed because its optional isolated runtime is not set up in this Codex environment; equivalent live HTTP, XML and per-URL checks were performed, with all24 URLs checked rather than a sample. Evidence: `artifacts/deployment/claude-seo-technical/crawl.json`.

Reference: [Google Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
