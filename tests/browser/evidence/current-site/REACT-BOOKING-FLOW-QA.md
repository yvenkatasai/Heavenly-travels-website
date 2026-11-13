# Attached React style and package-to-vehicle flow

The owner confirmed a new five-day itinerary, rather than another rendering of the five existing packages. The new itinerary appears after those normal packages. Its route is explicitly suggested, with timings, hotels, availability and darshan arrangements confirmed by the business before booking.

The supplied React component is adapted at `src/components/ui/parallax-scroll-feature-section.tsx`: alternating sections, scroll-linked content movement, image opacity and a left-to-right clip reveal. Per-row components own the hooks. The source is integrated as a compiled React island, with TypeScript, Framer Motion, lucide-react, shared UI and utility folders, shadcn-compatible aliases and prefixed Tailwind utilities without Preflight. No runtime CDN is used.

Service selectors inside and below the gateway share the same state and synchronize with the original enquiry form. The four package preferences are Budget friendly package, Deluxe package, Luxury packages and Premium packages. Selecting a package level moves the visitor to a native horizontal, scroll-snapping vehicle rail. Its five floating Motion tiles represent Sedan, SUV, Tempo Traveller, Mini Bus and Bus. Arrows and touch scrolling are available.

Selecting a vehicle opens a native review dialog with the chosen service, package, vehicle and itinerary. The requested WhatsApp button creates a draft containing those choices plus optional name, date, location and traveller count. A selection dock remains after closing the dialog. Group counts are checked from 3 to 200. No message, payment or booking confirmation happens automatically.

The owner has not provided rates or guaranteed amenities for the four tiers, so the UI presents them as planning preferences and requests confirmation of final inclusions and price. Vehicle illustrations are representative, with actual model/seating/availability disclosed for confirmation.

## Verification

- TypeScript strict check passed.
- Initial browser run: 38 passed, 0 failed.
- Final normal-motion run: 42 passed, 0 failed.
- Final reduced-motion run: 42 passed, 0 failed.
- Checked service-selector synchronization, control hit testing above the card overlay, five-day selection, package-to-vehicle navigation, vehicle review, group limits, correct WhatsApp destination/content/newlines, horizontal arrows and disabled end state, 320/390/768/1440px overflow, existing route/stop prices and motion pause behavior.
- Desktop/mobile fleet and review-popup screenshots were reviewed. The suggested itinerary, clip-reveal styling and inside/below service controls were reviewed.
- Link clicks were intercepted during tests; no WhatsApp message was sent.

Runtime source: `src/booking/main.tsx` and `src/booking/data.ts`. Visual styles: `src/site/booking.css`. Build: `scripts/build-booking.mjs`, called by `scripts/build_site.mjs`. Generated JS/CSS URLs receive content hashes so updates do not reuse stale cached bundles. Dependency notices are generated into `dist/assets`.

REA retains the completed browser steps; complete step objects were extracted from retained output when the outer capture was still being written. No physical iPhone/Android certification or universal frame-rate guarantee is claimed.
