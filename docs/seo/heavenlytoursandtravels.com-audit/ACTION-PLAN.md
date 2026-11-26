# SEO action plan — 26 November 2026

## Completed, deployed and verified live

1. Build the five day-trip cards into initial HTML from the canonical trip data. This unblocks useful navigation without JavaScript and more direct crawling. React interaction remains available.
2. Improve the five day-trip descriptions with true route details. No rate or availability promises.
3. Add homepage WebSite schema and 23 BreadcrumbLists matching visible trails. All trip breadcrumbs lead through Trips.
4. Add verified official TTD references beside guidance. Keep the owner’s ticket-guidance-only boundary.
5. Improve measured faint labels and accessible names for repeated detail links.
6. Use `/vehicles` directly while preserving package IDs. Synchronize optional plain-text discovery files.
7. Extend content and production checks so these fixes cannot silently disappear.

Dependencies were completed in order: factual trip records, visible navigation and schema, build/browser checks, then deployment. Final version is `b7b3f795-dd66-4f35-aab6-0b473015615e`, including the React dialog's direct vehicle link. See the full report for live verification and the measured 90/100/100/100 mobile Lighthouse result from the preceding SEO deployment.

## Remaining external or data-dependent work

| Action | Why it remains | Failure/monitoring check |
|---|---|---|
| Finish Google Business Profile verification | Owner-managed verification, last reported pending | Verify the real listing is public and matches the site's business name/phone/location |
| Supply a real public business address/hours only if appropriate | Not confirmed; cannot invent details for LocalBusiness eligibility | Compare approved details to the actual listing before updating site/schema |
| Observe Search Console indexation and query traffic | Crawl access is not proof of Google indexing or ranking | Inspect canonical URLs and indexing reasons after recrawl; compare impressions/clicks over time |
| Collect field Core Web Vitals | No CrUX data; field INP unknown | Check PHONE 75th percentile LCP/INP/CLS once real traffic is sufficient |
| Continue measured performance work | Lab LCP 2.7s remains above the good target; curtain timing is an explicit constraint | Compare repeatable traces/runs and preserve selection flow; do not claim improvement from one varying score |
| Obtain first-hand business photos or real customer feedback when available | Authority evidence must come from real operations | Publish only consented, accurate material; do not generate fake reviews or credentials |

No paid SEO tools, credential expansion, social publishing or GitHub push was performed by this audit. Optional Python helpers require the skill's explicit `/seo setup` workflow; the native audit did not depend on that environment.
