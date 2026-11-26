# Content, local, search experience and agent-readiness review

Reviewed 25 November 2026. Read-only supporting work for `/seo audit`; main requested command findings are in `geo.md`. Source files inspected: `search-answers.json`, `site.config.json`, `build-agent-content.mjs` and relevant generated/public pages. Bundled skill Python/Chromium tools were not run by this specialist; browser behavior belongs to the parent agent's checks.

## Content and local business

The site has specific, owner-confirmed business facts and a real enquiry process. The approved questions match actual customer concerns. There is no public price list or made-up instant booking promise. The About page is short (roughly 179 main-content whitespace-separated tokens in a simple markup-stripped extraction), but length alone is not a defect: it covers who the business is, what it offers, location, contact and confirmation responsibility. Do not pad it to the skill's generic 400/800-word floors.

The new guides range roughly 285–333 main-content tokens with unique purposes: trip comparison, Tirumala/family planning, self-drive/driver rentals, and coverage of actual temple routes. These are not city-name-swapped doorway pages. Individual trip pages can be much shorter (one-day route roughly 115 tokens), but list specific destinations and have clear next steps; useful factual detail should come from the owner rather than invented timings, durations or inclusions.

Local business classification from visible evidence: a travel service based in Tirupati / Renigunta, serving a broader region. A customer-facing street office, map coordinates and hours are unverified. Treat it as service-area-style evidence for this audit rather than inventing a brick-and-mortar storefront. Do not add a map pin, postal code, 24-hour hours or full address without confirmation. GBP verification was previously reported pending; this review did not verify its current status or a public profile. Name, phone and email agree on the sampled public pages. Keep the public business name unchanged rather than keyword-stuffing it for GBP.

## Search experience (qualitative only)

The owner confirmed both driver-operated and self-drive rentals. The dedicated rental guide distinguishes them and avoids implying buses are self-drive. It offers separate WhatsApp draft links. Temple guides distinguish the seven-temple regional circuit from temples located in Tirupati city; this helps avoid a misleading interpretation of the offer.

Customer needs grounded in the owner's supplied questions:

| Visitor need | Current evidence | Useful follow-up |
|---|---|---|
| Know package/total cost | short quote explanation, required preferences, owner WhatsApp | retain transparent quote process; do not publish guessed prices |
| Confirm included temples | route lists and complete-trip answer | preserve full raw-HTML stop lists and day labels |
| Choose suitable car | five vehicle types and seating confirmation | real vehicle photos/specs only when owner supplies them |
| Arrange a short trip | one-day/family route links | state already-booked-darshan condition before vehicle selection |
| Trust a local provider | owner/contact/base and direct confirmation | verified GBP link and real first-hand evidence when available |

A search-engine result review was not completed with a reliable localized top-ten SERP sample, so no numerical SXO consensus, persona or competitive rank score is assigned. A limited branded web search did not supply a verified profile result; that does not establish that profiles or mentions are absent. No promotional posts were made.

## Agent-readiness evidence

- Public guide content and approved answers are available in raw HTML, with H1/H2 headings and genuine anchor links. No JavaScript requirement was found for those answers.
- robots.txt returned 200 and allows crawling. Unverified bot-token access results are in `geo.md`.
- A genuinely nonexistent URL returned 404, avoiding a catch-all success page.
- `/llms.txt`, `/llms-full.txt` and `/travel-catalog.json` exist; guides are represented in JSON but not all in the plain-text copy.
- `/ai-catalog.json`, `/.well-known/ai-catalog.json` and a `.md` variant of the guide returned 404. These are optional discovery proposals, not required Google SEO fixes. The site has no public API, agent service or checkout needing OAuth metadata, A2A/UCP descriptors, so those should not be added just to tick a box.
- No Content-Signal training preference was published. Choosing a policy belongs to the owner; do not silently change training permissions.
- WebMCP was not requested and is optional. It must not be used to send WhatsApp messages or confirm bookings automatically. Preserve the visitor-reviewed draft flow.
- Earlier parent-captured Lighthouse baseline was Agentic Browsing **3/3**, Lighthouse 13.6.0, 25 November 2026. This review did not rerun it. Accessibility-tree workflow, mobile focus/scroll behavior and rendered-content parity were not measured by this specialist; do not claim they passed here.

## Priorities and validation

1. Medium: root technical reviewer should ensure homepage day-wise trip entry points and summaries exist in raw HTML or link clearly to static trip pages. This matters to people and crawlers; it should not require replacing the React booking UI. Check all five day routes and matching rendered/static metadata.
2. Medium: add verified official TTD onward links near ticket guidance (details and failure checks in `geo.md`).
3. Low: update optional llms files from the same approved source, without promoting this as a citation mechanism.
4. Owner follow-up: confirm public GBP URL/status, actual public office/hours if any, real photographs and real reviews before adding them. Success is accurate, usable information; no guaranteed traffic uplift.

No content rewrites of the five owner-approved answers, source mutations, schema changes, deployment, new dependencies, paid calls or social posts were performed by this specialist.
