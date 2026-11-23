# Editing the WhatsApp enquiry message

Both enquiry forms now use the same formatter. This change only prepares a draft: the visitor still checks it in WhatsApp and taps Send. No message is sent automatically.

## What I opened and why

1. `src/booking/main.tsx` contained the vehicle-review form's old message. Its `openDraft()` function previously put all details into one uninterrupted list. It now passes the selected trip, vehicle, date, accommodation and customer details to the shared formatter. The seven-temple trip supplies its two approved included extras.
2. `src/site/app.js` contained a separate message for the homepage enquiry dialog. It now passes the same kind of information to the formatter, with departure/destination labels for flights and hotel destination/preferred hotel labels for hotel enquiries. Optional phone, drop-off and notes appear only when supplied.
3. `src/lib/whatsapp-message.ts` is the new shared formatter. Edit this file to change headings, blank lines, labels, date appearance or the final sentence in both forms. A section is omitted when it has no content. Dates use UTC calendar components so a selected date cannot change when opened in another timezone. Numbered temple stops restart under each day of a day-wise trip.
4. `scripts/build_site.mjs` now bundles the homepage's shared import locally with esbuild. The React booking build already supports imports. The production site still loads local, minified scripts under its existing security policy.
5. `tests/whatsapp-message.test.mjs` checks all thirteen trips plus dates, sections, optional fields, service enquiries, removed ticket lines and URL encoding. Test data uses an example customer; tests never send messages.

## How to change it yourself

Open `src/lib/whatsapp-message.ts`. For example, the text `TRIP DETAILS` controls that bold section heading. The `section()` helper puts a heading between WhatsApp's single asterisks, and the final `.join('\n\n')` adds an empty line between sections. Keep the double newline; removing it makes the message crowded again.

The final sentence is at the end of `formatWhatsAppEnquiry()`. Change it there once to update both forms. The two darshan-ticket disclaimer lines requested for removal are not included in these enquiry drafts.

Trip names and temple lists remain in their existing source data. Changing a heading here does not change package contents or the website's FAQs. The destination WhatsApp number is in `whatsAppEnquiryUrl()`; only change it to a confirmed business number.

From PowerShell in the project folder, run:

```powershell
npm.cmd run test:whatsapp
npm.cmd run typecheck
npm.cmd run build
npm.cmd run verify:content
```

These check the message, types and generated website. To preview the forms, run `npm.cmd run dev` and open the address it prints. Select a trip and vehicle, then review the fields. Do not send a real WhatsApp enquiry as a test. Stop the preview with Ctrl+C.

After approving a live release, run `npm.cmd run deploy`, then `npm.cmd run verify:production`. Deployment uploads the website to Cloudflare; it does not push code to GitHub. Never edit the generated files in `dist` directly.
