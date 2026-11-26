# GEO review — 25 November 2026

Scope: live public pages on heavenlytoursandtravels.com, the approved answer source and static page generator. This is a read-only specialist review for `/seo audit` and `/seo geo`, using the installed AgriciDaniel claude-seo 2.6.2 instructions. No paid visibility tool, authenticated Search Console report or actual AI citation measurement was available to this specialist. No prediction of rankings or citation rate is made.

## What was observed

- `/robots.txt` returned 200 with `User-agent: *`, `Allow: /` and the correct HTTPS sitemap address.
- The four new service/temple guides each returned 200, contained one H1 and included their approved factual answers in raw HTML. They do not require JavaScript for this content.
- Five approved answer blocks address the owner's actual questions. Their short length is appropriate for these visitors; adding words only to meet a skill heuristic would make the site harder to use.
- `/about` identifies Hemanth Kumar, the business name, Tirupati / Renigunta base, Gmail address and WhatsApp contact. Booking boundaries are consistent across the sampled guides, About, Questions and the one-day trip.
- The public trip catalog includes four travel-guide URLs and the confirmed driver-operated/self-drive service. `/llms.txt` and `/llms-full.txt` have not yet incorporated those new guide links and approved answers.
- The sampled guides, Questions and trip pages have no external official TTD reference link near the darshan-guidance statement.

## Crawler access: separate purposes

Tests requested `/tirupati-tour-packages` with each listed user-agent token on 25 November. Every request returned HTTP 200, contained “What is the package cost?” and had no `cf-mitigated` response header. These are **unverified user-agent access tests from this audit's network**, not proof that the real crawler fetched, indexed or cited the website. Actual verified crawler access requires IP/signature validation and logs.

| Purpose | Token | robots rule | Test |
|---|---|---|---|
| Google Search, including eligible AI search surfaces | Googlebot | wildcard allow | 200 + answer |
| ChatGPT search | OAI-SearchBot | wildcard allow | 200 + answer |
| Claude search | Claude-SearchBot | wildcard allow | 200 + answer |
| Perplexity search | PerplexityBot | wildcard allow | 200 + answer |
| Apple search | Applebot | wildcard allow | 200 + answer |
| OpenAI training | GPTBot | wildcard allow | 200 + answer |
| Anthropic training | ClaudeBot | wildcard allow | 200 + answer |
| Google's separate training/grounding control | Google-Extended | wildcard allow | 200 + answer |
| Apple training opt-out token; not an independent crawler | Applebot-Extended | wildcard allow | 200 response to token only |
| User-requested retrieval; robots may not apply | ChatGPT-User | wildcard allow | 200 + answer |
| Anthropic user-requested retrieval | Claude-User | wildcard allow | 200 + answer |

No new training preference should be chosen for the owner. There is no need to add redundant Allow groups or disable security protections merely because this skill lists more bot names.

## Recommendations

### Medium: provide an official source beside ticket guidance

Observation: the site correctly says it guides customers but does not book darshan tickets, yet gives no official onward link. A pilgrim should be able to find the official source without another search or depending entirely on a commercial intermediary.

Suggested implementation in `scripts/build-agent-content.mjs`: add a compact “Official Tirumala information” link to `https://www.tirumala.org/`, and an “Official TTD booking portal” link to `https://ttdevasthanams.ap.gov.in/` near the ticket-guidance section on the Tirumala guide and booking information page. The official tirumala.org page links its Online Services / Darshan to the government booking portal; both were verified on 25 November. Do not imply partnership, official authorization, guaranteed availability or booking on the travel business's behalf.

Dependency: none; no owner-specific invented information required. Failure test: links fail, point to a third-party seller, or the page now implies the agency books tickets. Leading indicator: link remains valid during content reviews and fewer customers ask where official tickets are booked. A new outbound link alone does not prove a ranking gain.

### Low: keep the optional plain-text guide consistent

Observation: the trip catalog already knows the four guides, while llms files omit them. Add the guide links and approved answers to the generated plain-text information to avoid two stale representations of the business.

Dependency: use the existing `search-answers.json` and generated page definitions, rather than duplicate answer text. Failure test: a future answer change updates HTML but leaves the plain-text copy different. Leading indicator: one content check compares the answer text and canonical guide links. **This is consistency work, not a Google ranking or citation lever**; Google says it ignores llms.txt for visibility/rankings.

### Owner-managed follow-up: genuine business evidence

No verified social-profile URLs, public GBP URL, real customer reviews or original trip photographs were supplied to this review. Their absence from the website is not proof the business has none. Once supplied, add only genuine profile links and owner-approved original trip evidence. Do not fabricate a Google rating, qualifications, years in business, office address or testimonials, and do not manufacture Wikipedia/Reddit mentions.

## Measurement and sources

Observed access: 11/11 token requests succeeded. Approved answers: 5/5 present in static public content across the relevant pages. Platform citation/ranking scores: **not measured**. A composite GEO score would mask the unmeasured authority and real-indexation inputs, so none is assigned here.

- [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO, snippet/index eligibility, truthful visible structured data; no special AI markup is needed and serving/indexing is not guaranteed.
- [Google AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): no special content length, AI rewrites or llms.txt requirement.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): OAI-SearchBot and GPTBot are independent controls; ChatGPT-User is user-triggered.
- [Anthropic crawler documentation](https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler): search, training and user retrieval have distinct bots.
- [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): PerplexityBot supports search and is not a foundation-model training crawler.
- [Official TTD information](https://www.tirumala.org/) and [official booking portal](https://ttdevasthanams.ap.gov.in/), checked 25 November 2026.
