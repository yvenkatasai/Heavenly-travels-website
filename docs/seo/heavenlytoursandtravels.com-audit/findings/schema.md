# Schema review — 25 November 2026

Workflow: installed `seo-schema` skill, upstream AgriciDaniel/claude-seo v2.6.2, pinned commit `468ed5b0d9e3249394783710e54abb02837e326b`.

This is a read-only baseline before this audit's fixes. The reviewer fetched every URL in the live sitemap using Node's HTTP client and parsed all JSON-LD from the initial HTML. No browser, customer submission or paid API was used. Raw evidence is in the ignored local file `artifacts/deployment/seo-audit-2026-11-25/schema-live.json`. This review is syntax plus primary-vocabulary and source-data checking, not a claimed Rich Results Test or full Schema Markup Validator run.

## Measured baseline

- All **24/24** sitemap URLs returned HTTP 200.
- All **47/47** JSON-LD blocks parsed without syntax errors.
- Detected: 24 TravelAgency nodes, 6 WebPage nodes, 13 TouristTrip nodes (also typed Service), one further rental Service, one Person, one ItemList and one FAQPage. Multi-type nodes count under each type.
- No Microdata or RDFa detected, avoiding competing implementations.
- The same `https://heavenlytoursandtravels.com/#business` identifier, name, telephone and email appear consistently across all pages.
- The About page's Person identifies Hemanth Kumar as Owner and links `worksFor` to the business. No invented credentials or social profiles.
- All thirteen trip routes have a TouristTrip/Service entity, the provider reference, numbered Place stops and the actual vehicle-selection URL as the enquiry channel. Schema.org supports TouristTrip as a Trip subtype, ItemList/Place itinerary values, and Organization/Person provider values. No need to replace valid trip markup with Product/Offer or invent prices. [TouristTrip](https://schema.org/TouristTrip), [itinerary](https://schema.org/itinerary), [provider](https://schema.org/provider).
- No fake review, rating, price, availability or booking guarantee was found in the examined schemas. Dates were present only where content dates were explicitly recorded; do not add dates merely to make pages seem fresh.

## Findings and proposed changes

| Priority | Finding | Exact implementation | Dependency and falsification check |
|---|---|---|---|
| Medium | Homepage has no WebSite node to state the preferred site name. | In `scripts/build_site.mjs`, add one homepage-only WebSite with `@id` `https://heavenlytoursandtravels.com/#website`, `name` `Heavenly Tours & Travels`, `url` the canonical homepage, and publisher reference to `#business`. Do not add SearchAction because the site has no working site search. | Depends only on existing config facts. Rebuild and assert exactly one WebSite on homepage with matching name and canonical URL; other pages must not introduce conflicting WebSite nodes. Check rendered and raw markup agree. |
| Medium | Visible inner-page breadcrumbs have no BreadcrumbList; trip pages currently omit the Trips parent. | Generate BreadcrumbList in initial HTML for the 23 indexable inner pages. Ordinary path: Home → current page. Trip detail: Home → Trips → current trip. Update the visible trip breadcrumb to the same path, with a real `/trips` link. Use absolute URLs, consecutive integer positions and the displayed page names. | Depends on canonical page and path metadata. Assert each inner page has one list with at least two items; all parent targets return 200; final URL equals canonical; visible breadcrumb links match schema. Failure would be wrong hierarchy, duplicate lists, non-existent parent or a canonical conflict. |
| Low | WebPage nodes exist only for six manually dated pages; other pages have no explicit page entity. | Optional semantic consistency: add WebPage identity/name/url and `isPartOf`/publisher references on every indexable page, using AboutPage or CollectionPage only where appropriate. Keep `dateModified` conditional on a real content date. | Not a rich-result or indexing blocker. Test one stable page `@id`, links to WebSite/business, no fake dates. Avoid overcomplicating the existing implementation merely to inflate a schema count. |
| Owner input / eligibility limitation | TravelAgency is a valid LocalBusiness subtype, but current schema has only `location.name`, not a confirmed physical PostalAddress. | Retain the approved Tirupati / Renigunta wording. Do not invent street, postcode, coordinates or opening hours. A confirmed public physical address can later be added, consistently with the visible contact information and Business Profile. Partial geographic facts may be described truthfully, but must not be reported as verified Google LocalBusiness rich-result eligibility. | Google lists physical `address` and `name` as required for that feature. Missing address is an eligibility limitation, not invalid JSON-LD or proof the site cannot rank. Owner confirmation is the dependency. |
| Info | Existing FAQPage is not a reason to promise FAQ rich results or AI citations. | Keep truthful visible FAQ content and existing matching markup. Do not add QAPage: this is an owner-written FAQ, not community answers to a single question. | No removal is required merely to chase a score. Check FAQ questions and answers continue to match visible content. |

Google recommends WebSite markup on the canonical homepage with `name` and `url`; site names are not supported by the Rich Results Test, so use Schema Markup Validator and URL Inspection for that check. The markup states a preference and does not guarantee Google's displayed name. [Google site names](https://developers.google.com/search/docs/appearance/site-names).

BreadcrumbList needs at least two ListItems and a path that reflects how users reach the page. Its required item fields are name and integer position, plus URL except where the final item's URL may be omitted. [Google breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

TravelAgency is an appropriate specific business type. Google LocalBusiness feature eligibility requires a physical address; no assertion of eligibility is made with the presently confirmed location facts. [Schema.org TravelAgency](https://schema.org/TravelAgency), [Google LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).

## Ready-to-use examples

Homepage addition, using existing verified facts:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://heavenlytoursandtravels.com/#website",
  "name": "Heavenly Tours & Travels",
  "url": "https://heavenlytoursandtravels.com/",
  "publisher": { "@id": "https://heavenlytoursandtravels.com/#business" }
}
```

Complete-trip breadcrumb addition, paired with the same visible trail:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://heavenlytoursandtravels.com/trips/complete-7-temple-trip#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://heavenlytoursandtravels.com/" },
    { "@type": "ListItem", "position": 2, "name": "Trips", "item": "https://heavenlytoursandtravels.com/trips" },
    { "@type": "ListItem", "position": 3, "name": "Complete 7-Temple Trip", "item": "https://heavenlytoursandtravels.com/trips/complete-7-temple-trip" }
  ]
}
```

## Regression checks for the implementation owner

1. Run TypeScript, build and content checks. Extend the content check to parse every schema block, preserve the approved business identity, verify 13 trip itineraries, and validate homepage WebSite and inner-page BreadcrumbList structures.
2. Fetch the deployed sitemap's full set again and repeat those assertions on raw live HTML. Ensure noindex vehicle selection and 404 pages are not added to the sitemap to inflate coverage.
3. Root agent may use the browser for Google Rich Results Test on a representative breadcrumb page and Schema Markup Validator for WebSite/TouristTrip. This reviewer did not run either UI and does not claim their results.
4. Monitor Search Console after Google recrawls. Missing search appearance immediately after deployment is not proof the implementation failed; schema cannot guarantee indexing, rankings or a rich-result display.
