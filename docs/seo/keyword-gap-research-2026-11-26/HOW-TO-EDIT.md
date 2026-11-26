# How these additions work

1. **Find the original pages.** `scripts/build-agent-content.mjs` builds the static travel guides and trip-detail pages. Editing `dist/` would be temporary: the next build replaces it.
2. **Keep the new material together.** `scripts/travel-planning-content.mjs` contains six small HTML additions, keyed by their public URL. Change the wording here when you have confirmed business details. The main generator imports them and inserts each once into its existing page.
3. **Keep facts separate from questions.** The rental and quotation lists ask the customer to confirm terms. Do not change “ask about the deposit” into a deposit promise without the owner's actual policy. Competitor research cannot confirm our fleet or fees.
4. **Make comparisons readable on a phone.** `src/site/information.css` adds `.info-comparison`: two columns on desktop, one column on mobile. It reuses the existing fonts, colours and spacing and adds no JavaScript or external downloads.
5. **Use honest update dates.** `src/site/content-dates.json` changes only the six pages with new content to 26 November 2026. The build uses those dates in visible text, schema and the sitemap. Don't change dates merely to look recent.
6. **Check before publishing.** Run `npm.cmd run typecheck`, `npm.cmd run build`, then `npm.cmd run verify:content`. The content check now verifies the six sections appear once and their planning links point to actual anchors. Production checks use the configured review date instead of a hard-coded old date.
7. **Preserve the old text.** `preserved-copy.json` stores the original paragraphs, headings and list items from the six pages. `verify-preserved-copy.mjs` checks that every original block except its changed review date remains after building. Run it with `node docs/seo/keyword-gap-research-2026-11-26/verify-preserved-copy.mjs`.
8. **Publish only the finished files.** The existing `npm.cmd run deploy` command builds and uploads `dist/` to the existing Cloudflare Worker. This does not push GitHub. After a deployment, run `npm.cmd run verify:production` and open the affected pages on desktop and mobile.

The homepage, curtain timing, booking forms, approved five answers and WhatsApp draft formatter were not edited for this task. Read `FINDINGS.md` for the priority list and `GOOGLE-RESULTS.md` for all thirty observed positions.
