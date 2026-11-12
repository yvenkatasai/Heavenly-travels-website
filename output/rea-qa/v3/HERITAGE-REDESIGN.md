# Unified Heavenly heritage layout

The previous page combined a pinned card sequence, agency-style media bento, large catchphrase interlude and separate rounded panels. Those sections were replaced with a single editorial travel-agency layout.

The flow is now: uninterrupted hills hero, short Tirupati introduction, visible five-tour gallery, temple photograph with four planning steps, integrated trip/vehicle planner, FAQs and a connected closing/footer. Shared container widths, spacing, fine dividers and the forest/ivory/gold palette connect the sections. No section overlaps or scroll-pinned content are intended.

Typography: locally served Cormorant Garamond for headings and the wordmark, DM Sans for paragraphs and controls. Google Fonts open font licences and sources are retained in `src/v3/assets/fonts`. The temple-arch monogram is an original inline SVG. No history, longevity, awards or religious affiliation claims were invented.

The hero keeps the generated hills image and optional interactive Dot Field, now visually quieter. The previous continuous agency-effects renderer is replaced with small once-only section reveals; there is no continuous page animation loop outside the hero's existing field. Reduced motion and the pause control reveal content statically. Package prices, custom stops, vehicles, date preferences and the manually sent WhatsApp enquiry are preserved.

Source changes: `src/v3/page.html`, `heritage.css`, `heritage-effects.js`, small navigation/tour updates in `app.js`, and font assets. The pre-change source is saved in `output/pre-heritage-unification` without altering the archived V1/V2 versions.

## Verification

- Final normal-motion checks: 52 passed, 0 failed.
- Final reduced-motion checks: 52 passed, 0 failed.
- No page errors captured.
- Widths: 320, 390, 768, 1024 and 1440px. Existing document/drawer overflow checks passed; explicit section-order, visible grid and business-name fit checks passed at 320/390/768/1440px.
- Pricing, stop editing/reset, custom route validation, traveller bounds, WhatsApp draft content, film close/pause, tabs and FAQ behavior passed.
- Additional checks confirm that the footer call to action accepts pointer events, FAQ expansion markers are visible and the header Vehicles shortcut opens the vehicle options.
- Desktop page progression, mobile hero, gallery, planner and enquiry drawer screenshots were reviewed.

The REA provider retained complete step objects while the outer reduced-motion capture was still being written; `read_partial_steps.py` extracted those retained step objects for the results. Provider teardown behavior does not imply physical-device testing. No physical iOS/Android certification or universal frame-rate guarantee is claimed.
