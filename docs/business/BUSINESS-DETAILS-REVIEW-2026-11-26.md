# Business details and practical trip information

## Evidence used

Reviewed the existing Google Business Profile in the owner's Chrome business account and the owner's trip records on 26 November 2026. The owner replied “everything is real” to a question that explicitly included whether the business genuinely opens 24 hours. This confirms the existing opening schedule and offerings; it does not supply numerical vehicle specifications or new rental conditions.

The live profile editor shows:

- Business name: Heavenly tours and travels.
- Primary category: Travel Agent.
- Website: https://heavenlytoursandtravels.com/.
- Business location: Renigunta, Tirupati, Andhra Pradesh 517501.
- Main hours: open 24 hours on all seven days.
- Service areas: Telangana, Tamil Nadu, Andhra Pradesh, Chennai, Gudur, Nellore, Tirupati, Srikalahasti, Renigunta, Nayudupeta and Venkatagiri.
- Phone and SMS chat edits remain rejected. The preferred +91 97001 81493 has already been submitted for review; no duplicate request or new phone edit was made in this task.

Category, website, confirmed hours and location did not require remote changes. The Google business location uses postal code 517501 while its Renigunta service-area label uses 517520; a service-area label is not a second office address. The website continues to state the confirmed city-level base and link to the actual Maps listing, rather than inventing a street address or coordinates.

## Changes made

- Added the confirmed 24-hour schedule to shared site settings, visible information-page footers, homepage contact information and the TravelAgency structured data. Uses Google's documented all-day representation, opens 00:00 / closes 23:59.
- Added About-page hours and named local service areas using the actual profile entries. Existing India/South India temple-route coverage remains unchanged.
- Added practical stay-planning information to the three-, four- and five-day trip pages using the owner's canonical routes.
- Four- and five-day routes explicitly identify the owner-listed Day 2 night stay in Tiruvannamalai. No such stay is added to the three-day route.
- Other hotel towns, hotel names, rooms, meals and charges remain part of the owner's written confirmation. No fixed hotel inventory or driving time was invented.
- Five-day travel guidance identifies the actual final Kanchipuram/Thiruthani stops and asks visitors to confirm their onward journey around the final drop.
- Retained the five owner-approved customer-call answers, existing trip lists and private quotation process. Existing quote and self-drive checklists remain available.
- The previously prepared Maps/review links and consistent business identity relationship are included in the build being published with this update.

## Fleet and first-hand evidence limits

Confirmed categories are sedan, SUV, Tempo Traveller, mini bus and bus, plus driver-operated and self-drive car rental availability. The records still contain no actual model list, numerical passenger-seat counts, luggage measurements or self-drive deposit/fuel/distance/return policy. These are not inferred from competitors. The existing customer-facing information explains that these details must be confirmed for the selected arrangement.

The media credits explicitly identify vehicle pictures as illustrations, temple photographs as licensed third-party photographs, and hero landscapes/films as generated artwork. No newly supplied first-hand photographs or completed-trip records were available. Those files were not relabelled as business evidence, and no fictional customer experience was published.

Actual fleet specifications, rental conditions, hotel allocations and new documentary photos remain data-dependent work. A general confirmation cannot supply missing values.

## Beginner explanation of the files

Published to the existing Cloudflare custom domain on 26 November 2026, version `b812fa80-8eeb-410e-8e8e-41c76a05fc98`. TypeScript, build, content and preserved-copy checks passed. Mobile About, homepage and three-to-five-day trip pages fit 360px without horizontal overflow. GitHub was not pushed during this task.

1. `src/site/site.config.json` stores the hours and service areas once. Change this source when real business information changes.
2. `scripts/build_site.mjs` uses those hours in the TravelAgency JSON-LD that search engines read. It also inserts the shared hours label in the homepage template.
3. `scripts/build-agent-content.mjs` generates the About section and information-page footer, and inserts the route-specific stay notes.
4. `scripts/travel-planning-content.mjs` contains the stay-note helper. It reads the night-stay stop already present in `src/booking/data.ts` instead of maintaining a conflicting second itinerary.
5. `src/site/page.html` contains a hours placeholder in the existing footer. The hero, curtain timing and booking flow were not redesigned.
6. `src/site/content-dates.json` records actual updated pages; the existing manual date system is preserved.
7. `scripts/check-content.mjs` checks that visible hours match schema and that a Tiruvannamalai night is not accidentally added to the three-day trip.
8. Run `npm.cmd run typecheck`, `npm.cmd run build`, and `npm.cmd run verify:content`. Build output in `dist/` is generated; never edit it directly. Deployment is separate from a GitHub push.
