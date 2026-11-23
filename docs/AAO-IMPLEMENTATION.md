# AAO Learning Kit: website implementation and audit

Reviewed 23 November 2026. Source: the owner's 11-page AAO Learning Kit, October 2026. This is a website implementation record, not a course certificate or a claim that an AI platform recommends this business.

## What changed

The business now has a factual entity home at `/about`, a static `/trips` index, thirteen individual trip pages, `/booking-information`, `/questions` and `/privacy`. All nineteen public content URLs are in the sitemap. The existing visual homepage, curtain timing, package selection and WhatsApp handoff remain.

Trip data comes from `src/booking/data.ts`. A build-time generator creates readable HTML, TouristTrip/Service structured data, a read-only JSON catalog and two plain-text discovery files. Seven homepage trip cards and eight FAQ answers are also present in HTML before JavaScript executes. The homepage links to the new pages in a compact footer navigation; the new information is not another large homepage section.

Owner-approved facts: Heavenly Tours & Travels; Hemanth Kumar; Tirupati / Renigunta, Andhra Pradesh, India; +91 97001 81493; heavenlytoursandtravels1@gmail.com. Groups: 2–200. Hotel preferences: Deluxe (Budget), Exclusive and Premium. Tirumala tickets: guidance only, never booking on the customer's behalf. Payment, confirmation, cancellations, refunds and date changes are agreed directly with the owner on WhatsApp.

There are no published prices, guaranteed inventory, invented reviews, office hours, street address, fixed refund promises or instant reservations. The JSON feed is a custom catalog, not a UCP, ACP or MCP implementation.

## Coverage of every part of the PDF

| PDF pages | Topic / activity | Website work or disposition |
|---|---|---|
| 1–2 | SEO → AEO → GEO → AAO; clear facts and trust | Canonicals, crawlable content, business identity, contact details, structured data and explicit booking boundaries implemented. PDF marketing statistics were not copied into customer content. |
| 3, week 1 | Foundation course, reading, compare five brands on three AI platforms | Technical foundations implemented. Courses and multi-platform brand comparison require learner participation; not represented as completed. Reproducible prompt sheet below. |
| 3, week 2 | Entity clarity, corroboration, one-page methodology | About page and matching catalog identity implemented. Methodology and protocol summary below. Independent corroboration remains external. |
| 3, week 3 | Read and explain commerce protocols | Five-protocol summary and actual integration decision below. No fictitious payment endpoints. |
| 3, week 4 | Real-business audit, improvements and social case study | Eight-point audit completed below; site improvements implemented; factual case-study draft in `docs/AAO-CASE-STUDY.md`. Not posted to social media. |
| 4–5 | AAO articles and perspectives | Website requirements translated into identity, readable trip facts, schema and policy clarity. Reading links remain learning resources, not website widgets or proof of endorsement. |
| 5–6 | UCP, ACP, Shopify, MCP and protocol comparisons | Official protocol references checked. Retain owner-confirmed enquiry model. A checkout integration requires a separate commercial/backend project. |
| 6–7 | Free / paid courses | No enrolment, purchase, exam or certificate claimed. Learn via Semrush Academy, HubSpot Academy, iPullRank, Udemy or Coursera using the kit's resource list. |
| 7–8 | Videos, podcasts and search terms | Retained as owner learning actions. No copyrighted video copying or unrelated embeds added to the travel site. |
| 9 | Practical tools and eight audit questions | Crawl/schema/content/release checks implemented; audit below. No paid monitoring subscription or merchant account created. |
| 10 | Jobs and profile skills | Career advice is not a travel-site feature. Case study can support an honest portfolio; do not claim unearned certificates, protocol integrations or feed-management experience. No applications/profile edits made. |
| 11 | Glossary and ongoing tests | Plain-language definitions and a repeatable manual measurement procedure below. No scheduled monitoring created without a recurring-task request. |

## Eight-point audit

The kit uses 0 = missing, 1 = partial, 2 = done. Unmeasured items remain unmeasured; N/A is not counted as a success. Do not turn this mixed audit into a misleading overall percentage.

| # | Kit check | Result and evidence |
|---|---|---|
| 1 | Correct description in ChatGPT, Perplexity and Gemini | **Unmeasured.** Public facts now consistent across About, HTML, JSON-LD and catalog; actual model answers must still be tested. |
| 2 | Clear factual About / entity home | **2.** `/about`: owner, business, base location, contact and services. No guessed office address or working hours. |
| 3 | Plain-text prices, stock and delivery | **N/A for direct checkout; discovery implemented.** Thirteen routes/stops/day plans are static HTML. Owner explicitly requested no public prices. Vehicle/room/date availability is confirmed on WhatsApp. No stock feed or guaranteed delivery date is asserted. |
| 4 | Valid product / offer schema | **Adapted to services.** TravelAgency entity, thirteen TouristTrip/Service objects with Place itineraries, trip ItemList and visible FAQ data. JSON parses and trip IDs/stops are checked locally. Schema.org's live URL validator tested the Jyotirlingas trip: one TouristTrip/Service item, zero errors and zero warnings. Product/Offer prices and stock are deliberately absent. Google rich-result eligibility is not claimed. |
| 5 | Clear refund / return / warranty rules | **1.** Owner's real process published at `/booking-information`. Fixed cancellation/refund/date-change rules do not exist on the website; owner supplies terms in WhatsApp. This does not meet autonomous purchase needs. |
| 6 | Consistent independent reviews / press | **Unverified.** Focused public searches did not confirm matching independent evidence. This is not proof that none exists. No fake reviews, rating schema or unrelated business profiles added. |
| 7 | Agent purchase channel | **N/A under current enquiry model; not implemented.** Read-only catalog is available, but no instant checkout, autonomous payment, UCP/ACP channel, Shopify store or Merchant Center registration is claimed. |
| 8 | Chosen in an unbranded blind test | **Unmeasured.** Use procedure below. Being crawlable does not establish recommendation or selection. |

## One-page methodology, in plain language

Search visibility starts with facts a reader can find and verify. Give the business one stable name, domain and contact identity. Describe actual trips and stops in ordinary HTML. Make each trip link to the existing vehicle selector using its real booking ID. Tell people precisely where automated selection stops and the owner takes over.

For this business, an assistant can help discover and compare trips. It cannot know a live vehicle, room, temple ticket or price is available. A selected card is a preference, not a reservation. The visitor checks a WhatsApp draft and sends it; Hemanth Kumar agrees payment and confirmation. Publishing that boundary is more reliable than pretending to offer autonomous checkout.

Machine-readable facts should agree with customer-facing facts. Generate HTML, schema and the catalog from the same trip data, and run checks after changes. Use proper service/trip types; never add zero prices, fake stock, invented ratings or a generic refund guarantee just to fill a field. `llms.txt` is an additional discovery aid, not a guarantee that any assistant reads or ranks it.

Trust beyond the website needs real evidence. If the owner has a verified business profile or genuine independent coverage, confirm it belongs to this exact business before linking it. Obtain honest reviews from real customers. Keep name, contact and location consistent. Sitemap publication does not mean Google has indexed the pages.

Measure actual outcomes separately from technical completion. Save the full prompt, platform/model, date, location context, answer, citations and whether the business was mentioned or selected. Compare the same prompts later. Do not promise ranking, recommendations or sales from markup alone.

## Protocols: one sentence each and this site's decision

| Protocol | Meaning | Current site |
|---|---|---|
| [UCP](https://ucp.dev/) | Commerce building blocks let platforms, agents and businesses exchange discovery, checkout and related operations. | No commerce backend or live inventory; not enabled. |
| [ACP](https://www.agenticcommerce.dev/) | An open standard connects buyers, agents and businesses through programmatic commerce and checkout flows. | Owner handles payment and confirmation manually; not enabled. Protocol implementation alone would not guarantee platform listing. |
| [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) | Connects AI applications to external tools, data and workflows. | Public JSON catalog is readable data, not an MCP server. |
| [A2A](https://a2a-protocol.org/latest/) | Lets separate agent applications communicate and coordinate tasks. | No hosted autonomous business agent exists; not needed for a static enquiry site. |
| [AP2](https://ap2-protocol.org/) | Supports authorized, verifiable agent payment interactions. | No website payments; not enabled. |

Supporting schema references: [TouristTrip](https://schema.org/TouristTrip), [Service](https://schema.org/Service), [TravelAgency](https://schema.org/TravelAgency). Schema validity is separate from Google feature eligibility. A published base locality is not a verified street address.

Future autonomous checkout would need owner-approved prices, actual inventory, written transaction rules, a secure backend, a payment provider, platform eligibility checks and consent handling. That would change the business flow and must not be inferred from this learning PDF.

## Measurement worksheet and owner follow-up

1. In separate fresh ChatGPT, Perplexity and Gemini sessions, ask: “What does Heavenly Tours & Travels at heavenlytoursandtravels.com offer, where is it based, and how do bookings and Tirumala tickets work? Cite your sources.” Record inaccurate statements as failures even if the brand is mentioned.
2. Blind prompt: “Compare five travel agencies for a private Tirupati temple trip for a family of four. I need vehicle and hotel planning, clear booking terms and ticket guidance. Give sources and explain your choice. Do not contact anyone or book.” Do not name Heavenly in this test.
3. Day-wise prompt: “Find a three-day temple trip starting in Tirupati. Show stops, transport options, hotel preferences and how confirmation works. Do not assume prices or availability.”
4. Record: date; platform/model; prompt verbatim; geographic context; five brands named; citations; factual accuracy; whether Heavenly was selected; exact reason. Repeat the same prompts after a few weeks if you choose. No test has been run or recommendation achieved merely by preparing this worksheet.
5. In the owner's Search Console account, verify the domain and submit `https://heavenlytoursandtravels.com/sitemap.xml`; use URL Inspection on About and a trip page. Account ownership verification is still required.
6. Confirm any existing Google Business Profile and independent listing URLs with the owner before adding `sameAs`. Do not create duplicate profiles or reviews.
7. If public fixed refund/payment rules are later approved, update the page and FAQs together. Until then, ask the owner for written terms before payment.
8. Courses, podcast viewing, profile edits and social publication remain learner/account actions. The case-study draft can be posted only after the owner reviews the facts and explicitly requests publication.

## Glossary for a beginner

SEO: help search engines find and understand pages. AEO: make clear answers available. GEO: improve the information generative tools can cite. AAO: help assistants assess and choose a business using reliable facts. AI agent: software that can plan and use tools toward a task. Agentic commerce: agents participate in product/service discovery and transactions. Zero-click search: a search ends without a result click. AI Overview / AI Mode: Google search experiences that provide AI-generated information. Entity home: the authoritative page describing this exact business. Schema: labeled, machine-readable facts about page content. Blind test: an unbranded request used to measure which businesses an assistant chooses. UCP, ACP, MCP, A2A and AP2 are explained in the table above.

## Release checks

Run `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd run verify:content`, and `npm.cmd run verify:production` after an approved deployment. Browser-check the homepage FAQ, package-to-vehicle navigation and mobile information-page layout. No live WhatsApp message, booking or payment should be sent in testing.

23 November release: typecheck, build, content checks, formatting, Wrangler dry run and live production checks passed. The first immediate post-deploy request for the complete trip briefly returned 404; subsequent ordinary HTTPS requests and the complete production suite passed after the upload propagated. Live desktop About and local mobile About/trip pages were inspected; the long-email mobile overflow was corrected. The existing homepage FAQ and Express-to-vehicle handoff worked, accommodation options appeared, and the people input was verified with minimum 2. No messages were sent. Live schema evidence is saved in the local `artifacts/deployment/aao-review/schema-validator.txt`; screenshots accompany the release evidence. Performance timings and global network availability were not measured by these checks.
