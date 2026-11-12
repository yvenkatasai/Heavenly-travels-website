# Owner-provided pilgrimage content and interaction

The first section after the hero is a large temple gateway. It lists all seven owner-specified temples and locations. The whole card opens a native, keyboard-accessible services dialog containing all seven service categories, the official-availability qualification for darshan assistance, group types and 3–200 capacity, all vehicle types, the stated cities/India reach, customised multi-day tours and local/outstation services. The WhatsApp and responsibility messages are retained.

Immediately after the gateway, five scroll-revealed package cards use the owner's exact package names and inclusions: Tirupati Express, Family Spiritual Tour, South Andhra Temple Circuit, Tirupati and Vellore Pilgrimage, and South India Temple Yatra. Their 26 inclusion items are visible in the cards. Package actions populate the existing editable planner. Kanchipuram remains optional in the Vellore package; it is not silently added to the default route.

The complete-services introduction includes the stated transport/accommodation/sightseeing/personal assistance description. A semantic six-row traveller-needs table retains families from other states, senior citizens, NRI families, corporate groups, wedding/family groups and devotional groups. Group and service enquiries now identify the service requested. Group count is validated from 3 to 200; individual non-group enquiries remain possible.

Flight/hotel requests use appropriate location labels and omit unrelated temple stops and package estimates from the WhatsApp draft. Selecting a temple package restores a temple enquiry context while preserving an existing group-package preference. No test message was sent; link clicks were intercepted in the local browser harness. No payments or bookings are completed automatically.

## Checks and visual review

- Initial content/business run: 67 passed, 0 failed.
- Normal/reduced-motion workflow runs: 69 passed each, 0 failed.
- Final flight/service quote checks: 71 passed, 0 failed.
- All seven temple rows, seven service rows, five exact package names and 26 inclusions checked.
- Group dialog transition, body scroll locking, minimum and maximum group counts, draft contents and package-to-planner behavior checked.
- Overflow and dialog sizing checked at 320, 390, 768 and 1440px; original checks also cover 1024px.
- Desktop temple gateway, services brochure and successive package reveals reviewed. Mobile gateway was compacted to show all seven destinations and its action within a typical 390×844 viewport; shorter screens retain natural page scrolling. Mobile services and group enquiry reviewed.
- Native scrolling is retained; package reveals do not pin or overlap one another. Reduced motion and the pause control display the content statically.

REA retains the completed browser steps; some outer capture output was still being written when complete step objects were extracted. This does not constitute physical-device iOS/Android certification. Superseded release snapshots and pre-change working copies are not retained in the active tree; repository history remains available through Git.
