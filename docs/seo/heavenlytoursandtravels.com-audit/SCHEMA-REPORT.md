# /seo schema

Before fixes: 47 JSON-LD blocks across 24 pages parsed successfully. Existing business, owner and trip information was consistent. See [specialist validation](findings/schema.md) for primary references and semantic checks.

Added homepage WebSite and 23 BreadcrumbLists with absolute URLs, ordered positions and visible navigation parity. All 13 trip trails include Home → Trips → current trip. Regression checks validate canonical relationships. The exact generated nodes are saved in `generated-schema.json`; the build remains the source of truth.

No fabricated street address, coordinates, opening hours, reviews, price, ticket availability or Offer was added. TravelAgency currently describes the known base location; Google LocalBusiness rich-result eligibility is not guaranteed without a confirmed physical address. Existing FAQPage was kept as informational markup with no promised rich-result benefit. The full report explains local validation versus Google indexing/feature eligibility.
