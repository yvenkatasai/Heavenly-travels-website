# Package catalog and accommodation choices

Updated 18 November 2026 from the business owner's instructions.

The separate Complete 7-Temple Trip and the existing one-to-five-day trips remain unchanged. The individual package list contains:

1. **Express Package** — Tirupati pickup, Tirumala travel, local temples if time permits, and return drop.
2. **Govindham Package** — Tirupati, Tirumala, Padmavathi Temple, Govindaraja Swamy Temple and Kapila Theertham, with hotel/travel assistance.
3. **Divine Pilgrimage Package** — Tirumala, Srikalahasti, Kanipakam, Tiruchanur and local temples.
4. **Wholesome Pilgrim Package** — Tirupati, Tirumala, Srikalahasti and Golden Temple, Vellore; optional Kanchipuram.
5. **South Indian Package** — Tirupati, Kanchipuram, Tiruvannamalai, Srirangam, Madurai, Rameswaram, Kanyakumari, Chidambaram, Thanjavur (Tanjore) and Trivandrum (Thiruvananthapuram).
6. **Jyotirlingas Package** — Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameshwaram and Grishneshwar. The owner listed Deoghar/Parli and Dwarka/Aundha as alternatives; visitors are asked to confirm their preferred shrine locations with the team. Each is one entry in the twelve-shrine list, not a promise to visit every alternative.
7. **Pancha Bhoota Lingas Package** — Earth: Ekambareswarar, Kanchipuram; Water: Jambukeshwarar, Thiruvanaikaval; Fire: Arunachaleswarar, Tiruvannamalai; Air: Sri Kalahasteeswara, Srikalahasti; Space: Thillai Nataraja, Chidambaram.

No fixed durations, prices, hotel guarantees or ticket-booking promises have been introduced for the new routes. Travel dates and arrangements are confirmed by the team.

## Accommodation step

Both the vehicle-page review and homepage enquiry form require an explicit accommodation preference before opening a WhatsApp draft:

- Deluxe (Budget)
- Exclusive
- Premium

There is no preselected tier for a new visitor. The choice is included as `Accommodation: ...` in the message. It is a preference for the team to discuss, not a confirmed hotel reservation. The visitor still reviews and sends the WhatsApp message manually.

## Files to edit next time

- `src/site/tours.js`: homepage package names, descriptions and details.
- `src/booking/data.ts`: vehicle-page package data and accommodation options.
- `src/site/data.js`: custom-planner stops, route indexes and card photos. Keep existing stop indexes stable when adding new stops.
- `src/site/page.html` and `src/site/app.js`: visible category counts and homepage enquiry form/message.
- `src/booking/main.tsx`: vehicle review form and WhatsApp draft.
- `src/site/booking.css`: shared accommodation field styling.

Check package names and contents in both catalogs when changing them; the browser test checks they stay aligned.

## Content and photo provenance

The owner supplied the destination lists. The Pancha Bhoota temple/element mapping was checked against [The Art of Living](https://www.artofliving.org/in-en/mahashivratri/pancha-bhoota-sthalams), and the Jyotirlinga list against [the referenced overview](https://en.wikipedia.org/wiki/Jyotirlinga). The listed shrine alternatives are preserved rather than silently choosing a tradition.

The Jyotirlingas card uses [Somnath Temple, Somnath by Kuldeep S](https://commons.wikimedia.org/wiki/File:Somnath_Temple,_Somnath.jpg), resized and converted to WebP under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The image credit appears in the site's credits, and `src/site/assets/somnath-attribution.json` records its provenance. The Pancha Bhoota card reuses the existing credited Srikalahasti image.
