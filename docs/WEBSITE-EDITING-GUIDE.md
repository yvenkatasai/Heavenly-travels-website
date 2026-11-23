# How these website changes work

This guide explains the actual files used, so you can repeat the work yourself.

1. Open the project folder `heavenly-github-publish` in your editor. Open `AGENTS.md` first: it explains which files are source and which are generated.
2. Open `src/site/site.config.json` to change the public business email, name, owner or base location. This is one shared set of business facts; the build uses it for page metadata, About information and the catalog.
3. Open `src/booking/data.ts` to edit trip names, temple stops, day plans, vehicles or accommodation preferences. Keep each existing trip `id`: vehicle selection uses that ID. The homepage's original visual trip descriptions are in `src/site/tours.js`; keep these matching the booking data if you change a trip.
4. Open `src/site/faqs.json` to edit questions and answers. Each entry is a pair: question first, answer second. Keep valid JSON: double quotes around text, commas between entries. This feeds the homepage and the Common questions page.
5. Open `scripts/build-agent-content.mjs` to change the layout or explanatory text of About, booking information, privacy or trip details. It is a generator: it reads the trip data and builds all related pages automatically. You do not need to type thirteen separate pages.
6. Open `src/site/information.css` to change those pages' appearance. It uses the existing local heritage fonts and forest/cream colors. The mobile fix uses a single column with `minmax(0, 1fr)` and wrapping email links so long text cannot widen the screen.
7. The compact homepage footer links are in `src/site/page.html`; their spacing is in `src/site/simple-closing.css`. Existing homepage FAQ click behavior is in `src/site/app.js`. Its job is now to open the already-built answers rather than create the text.
8. `scripts/build_site.mjs` assembles everything into `dist`, adds metadata/schema, extracts minified CSS/JavaScript, and generates `robots.txt` and `sitemap.xml`. Never edit `dist` manually: the next build replaces it.
9. In PowerShell, run the commands below from the project folder. `.cmd` avoids the PowerShell `npm.ps1` script-policy problem; there is no need to relax your system's security policy.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:content
npm.cmd run dev
```

The last command starts a local preview. Open the address it prints, check mobile and desktop, click a trip, verify the selected trip reaches the vehicle page, and open FAQ answers. Stop the preview with Ctrl+C. Do not send a real WhatsApp message during testing.

10. When you want to publish, `npm.cmd run deploy` builds and uploads to the existing Cloudflare Worker. This changes the live site; it does not push anything to GitHub. Then run `npm.cmd run verify:production` to check the real domain, HTTPS, redirects, content pages and media.

The WWW redirect is a Cloudflare zone rule named “Canonical WWW to primary HTTPS domain.” It sends visitors to the main HTTPS domain while keeping the page path and query string. DNSSEC, HTTPS and TLS settings are separate from page source; routine text edits do not require changing them.

Read `docs/AAO-IMPLEMENTATION.md` for the PDF coverage, eight-point audit and the remaining external account/learning activities. The JSON feed and discovery files make information accessible; they do not guarantee search indexing or AI recommendations.
