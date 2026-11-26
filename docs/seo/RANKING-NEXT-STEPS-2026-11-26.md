# What to do next for the ten target searches

Checked 26 November 2026. This is a practical action list, not a promise of a top position.

## What I checked and completed

- Signed into the existing business Google account; no account access was expanded.
- Google Business Profile Manager reports the business as verified. The public category is Travel agency / Travel Agent, with the correct website. One Google review was visible.
- The profile editor marks both the phone number and SMS chat entry as **Not approved**. The public listing has no phone number. I did not resubmit the same rejected information or submit an unsupported appeal.
- Search Console's sitemap report shows **Success**, 24 discovered pages and last read 25 November 2026.
- Fresh URL inspections report **URL is on Google** for the four main guides: `/tirupati-tour-packages`, `/tirumala-tour-packages`, `/tirupati-car-rentals`, `/tirupati-temples`.
- Fresh inspections also report the Express, three-day and four-day trip pages as indexed. The aggregate exclusions report was older, so those entries are not current failures.
- The South Indian trip was **Discovered – currently not indexed**, with no last crawl. I requested indexing and Google confirmed **Indexing requested**, added to the priority crawl queue. Acceptance is not confirmation that the page is now indexed.
- Five noindex examples were vehicle-selection query URLs, which are intentionally excluded. They should stay excluded; the public trip pages carry the searchable information.
- Performance baseline: the selected three-month report contains only 22–24 November data, 3 clicks and 5 impressions. Its one visible query is the business name (2 clicks, 3 impressions). This sample is too small to assess the ten target phrases. Average position 1.8 in that report does not mean the ten target phrases rank at 1.8.
- Core Web Vitals has insufficient field data. The previous mobile Lighthouse result is a lab measurement, not a field pass.
- Retrieved the real Maps listing and the owner dashboard's review link. Added visible links on About and linked the TravelAgency JSON-LD entity to Maps with `sameAs`. No review score or rating schema was fabricated.

## Your steps, in priority order

### 1. Resolve the rejected phone and chat information

Open the Business Profile with `heavenlytoursandtravels1@gmail.com` → Edit profile → Contact. Review the rejected phone entry for **+91 97001 81493**. Follow any additional verification option Google offers. For a rejected edit in India, use [Google Business Profile contact support](https://support.google.com/business/gethelp) and select the relevant rejected phone/business-information issue. Explain that the same business number is published on the website. Supply genuine ownership/business evidence if Google asks for it. Do not create a second listing or repeatedly submit different spellings of the same rejected entry.

Suggested factual explanation (review before sending):

> I manage the verified Heavenly tours and travels profile in Tirupati / Renigunta. Our business phone +91 97001 81493 was marked Not approved. This is the number customers use to contact owner Hemanth Kumar, and it is published at https://heavenlytoursandtravels.com/about. Please tell me what verification or supporting evidence is needed to approve the correct phone number.

The SMS chat entry was rejected too. If you want WhatsApp rather than SMS, ask support about the appropriate supported chat option after the phone issue is resolved. Do not assume a rejected `sms:` entry creates a WhatsApp button.

Reference: [Google edit statuses](https://support.google.com/business/answer/3038311), [appeal instructions including outside UK/EEA](https://support.google.com/business/answer/13597551).

### 2. Confirm accurate business details

The listing currently shows 24-hour opening. Keep that only if customers can actually reach the business then. Check the real map pin/address, customer-visit arrangements and service area. Keep the genuine business name; do not add a string of search keywords to it. Travel agency is already a relevant primary category. Add secondary categories only for services actually provided and available in Google's picker.

Use the same name, phone, website and real location across the website and business-controlled profiles. Do not invent an office address, geographic coordinates or operating hours for schema.

### 3. Add real operational photos

Start with a manageable set, for example 8–12 clear photos of your actual vehicles, interiors, luggage space, team and real trip operations. Use customer photos only with permission. Add them to Google Business Profile and supply originals for the website. This quantity is a suggested task size, not a Google ranking requirement. Generated hero artwork is not evidence of an actual fleet or completed trip.

### 4. Ask every genuine completed customer for an honest review

Your review link: **https://g.page/r/Ca8QT3BzowjIEAI/review**.

Suggested message to send yourself after a completed trip:

> Thank you for travelling with Heavenly Tours & Travels. If you have a moment, please share your honest experience on Google: https://g.page/r/Ca8QT3BzowjIEAI/review. Your feedback helps us improve and helps other travellers plan.

Ask consistently, without rewards, keyword scripts, fake accounts or screening out unhappy customers. Reply helpfully to reviews. I have not sent any review requests or replies.

Reference: [Google review-link guidance and incentive prohibition](https://support.google.com/business/answer/16816815).

### 5. Supply the factual details competitors cannot establish

Write down actual car models, passenger seats excluding the driver, luggage capacity and AC availability. For each offered arrangement confirm fuel, driver charges, tolls, parking, permits, waiting/extra distance, hotel nights and meals. For self-drive, confirm licence/ID, deposit, fuel, distance and return conditions. For longer temple routes, supply a real sample day-by-day plan and overnight towns. Keep prices private if that remains your policy.

The website already offers a checklist while these details are unconfirmed. Researching another operator cannot make their vehicle capacity or rental policy true for your business.

### 6. Publish useful first-hand travel information

Start with the questions your real callers ask: how to choose a trip, which temples it covers, how pickup works and how much driving is involved. Share a real trip example, actual photos, practical notes and clearly confirmed conditions. Add material to the existing relevant guide instead of creating ten near-duplicate pages. Link to official TTD information for current darshan rules and retain guidance-only wording.

Do not change dates without actually updating content, add fake reviews or fill pages with repeated keywords.

### 7. Earn genuine local references

Ask hotels, transport partners and other businesses you truly work with to list your business and link to the appropriate page when useful to their customers. Keep details consistent on genuine profiles you control. Avoid purchased ranking links, bulk directory submissions or hidden promotion. I will not contact partners on your behalf without an explicit request.

### 8. Check results once a week

Open Search Console → Performance → Search results. Use 28 days and compare with the previous 28 days when enough data exists. Filter the ten phrases below, and also look for relevant variations such as “Tirumala car package” and “South India temple tour”. Record impressions, clicks, CTR and average position by query and landing page. Some queries are omitted for privacy; absence from the table is not proof of zero demand.

Use impressions to see whether Google is showing the page, clicks/CTR to assess the search result, and actual calls/WhatsApp enquiries to assess business outcomes. Analytics contact clicks are interest, not confirmed bookings. Inspect the South Indian URL again after Google has had time to crawl; don't repeat the same indexing request daily. No recurring automation was created.

## Which page targets which searches

| Existing page | Target phrases |
| --- | --- |
| `/tirupati-tour-packages` and homepage identity | Tirupati travels; Tirupati tour packages |
| `/tirupati-temples` | Tirupati temples |
| `/tirupati-car-rentals` | Tirupati car packages; Tirupati car travels; Tirupati car rentals |
| `/tirumala-tour-packages` | Tirumala cars package; Tirumala family package; Tirumala temple package |
| `/trips/south-indian-package` | South Indian package, focused on the actual South India temple trip |

Start by measuring the service-specific searches. Broad phrases can have mixed intent: “Tirupati travels” includes a bus operator of that name, and “South Indian package” includes general leisure holidays. We should not invent new services to match those results.

## Technical edits explained for a beginner

1. Opened `src/site/site.config.json`: this stores shared business settings. Added the verified Maps URL and real review URL so links have one editable source.
2. Opened `scripts/build_site.mjs`: this generates metadata and structured data. Added `sameAs` to the existing TravelAgency entity so software can connect the website with the real Google listing. This is an identity relationship, not a direct ranking boost.
3. Opened `scripts/build-agent-content.mjs`: this generates About and other static pages. Added an About section with Maps and neutral review links, preserving the existing business description.
4. Updated `/about` in `src/site/content-dates.json` because its content actually changed.
5. Extended `scripts/check-content.mjs` to check the public links, consistent business identity and absence of fabricated rating fields. Built and checked the finished site before deployment.

No iframe map, review widget, new tracker or external runtime download is required. The existing curtain timing and enquiry flow remain unchanged. No private documents were uploaded and no appeal was submitted.

### Publication status

The first publication attempt was blocked: Wrangler rejected its login with Cloudflare error 10001, the browser OAuth refresh failed, and the connected API returned an authentication error. No production settings were changed during that failed attempt. This was an authentication issue, not a DNS or security configuration issue.

**Resolved later on 26 November:** Cloudflare authentication succeeded again. The Maps/review links were published with the confirmed business-hours and practical trip-details update, version `b812fa80-8eeb-410e-8e8e-41c76a05fc98`. The preceding paragraph records the earlier failed attempt; it is no longer a publication blocker.

## Expectations

Google says local results depend on relevance, distance and prominence, and there is no way to pay for a better organic local position. Crawling/indexing can take days or weeks, and ranking is a separate process. Use a 30-day review as a measurement checkpoint, not a promise of first place. [Google local ranking guidance](https://support.google.com/business/answer/7091), [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
