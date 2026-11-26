// Additions answer planning questions without turning another operator's terms into ours.
const quoteLink =
  '<p><a href="/booking-information#quote-checklist">Check what your quote includes before booking</a></p>';

export const travelPlanningContent = {
  '/tirupati-tour-packages': `<section class="info-panel" id="compare-trips">
    <h2>Which trip should I choose?</h2>
    <dl class="info-comparison">
      <div><dt>A short visit</dt><dd><a href="/trips/express-package">Express Package</a>: arrival pickup, Tirumala transport and return drop; local visits depend on available time.</dd></div>
      <div><dt>A family temple trip</dt><dd><a href="/trips/govindham-package">Govindham Package</a>: Tirupati, Tirumala, Padmavathi Temple, Govindaraja Swamy Temple and Kapila Theertham.</dd></div>
      <div><dt>All seven temples</dt><dd><a href="/trips/complete-7-temple-trip">Complete 7-Temple Trip</a>: all seven listed stops, including Vellore, Kanchipuram and Tiruvannamalai. Ask the owner to plan the number of days.</dd></div>
      <div><dt>A fixed number of days</dt><dd><a href="/#day-packages">One-to-five-day plans</a>: open each trip for its stops and day-by-day route. The one-day plan requires an already-booked darshan ticket.</dd></div>
    </dl>
    <p>Share both your arrival and return times. Confirm the pickup point, final drop, hotel nights and temple visit order before agreeing your plan.</p>
    ${quoteLink}
  </section>`,
  '/tirumala-tour-packages': `<section class="info-panel" id="family-checklist">
    <h2>What should I confirm for my family?</h2>
    <ul class="info-list"><li>Adults, children and older travellers, plus luggage and any walking or rest needs.</li><li>Your darshan date and reporting time, arrival time, pickup point and return journey.</li><li>The confirmed car model, passenger seats and luggage space.</li><li>Whether a hotel is needed, the number of rooms and nights, bed needs and meal arrangements.</li></ul>
    <p>AC cars, SUVs and larger group vehicles can be requested. A vehicle category or hotel preference is a request; the owner confirms the actual arrangements.</p>
    <p><a href="/tirupati-car-rentals#rental-checklist">Compare car and rental choices</a></p>${quoteLink}
  </section>`,
  '/tirupati-car-rentals': `<section class="info-panel" id="rental-checklist">
    <h2>Car with a driver or self-drive?</h2>
    <dl class="info-comparison">
      <div><dt>Car with a driver</dt><dd>Share the temple route or pickup and drop points, travel dates, passenger count and bags. Ask which car model is available and how the trip is charged.</dd></div>
      <div><dt>Self-drive car</dt><dd>Share pickup and return dates and times. Ask about the driving licence and ID requirements, deposit, fuel policy, distance limit, extra-distance charges, late return and damage terms.</dd></div>
      <div><dt>A family or larger group</dt><dd>Ask about a sedan, SUV, Tempo Traveller, mini bus or bus. Confirm passenger seats separately from the driver seat, luggage space and whether the same vehicle can cover every stop.</dd></div>
    </dl>
    <p>Specific models, seating, rental limits and charges vary with the confirmed arrangement. Ask the owner for these details in writing before booking; this checklist does not set rental terms.</p>
    ${quoteLink}
  </section>`,
  '/tirupati-temples': `<section class="info-panel" id="temple-locations">
    <h2>Which temples are in Tirumala and Tirupati?</h2>
    <dl class="info-comparison">
      <div><dt>Sri Venkateswara Temple</dt><dd>Tirumala, in the hills above Tirupati. Dedicated to Lord Venkateswara.</dd></div>
      <div><dt>Sri Padmavathi Ammavari Temple</dt><dd>Tiruchanur, near Tirupati. Dedicated to Goddess Padmavathi.</dd></div>
      <div><dt>Sri Govindaraja Swamy Temple</dt><dd>In Tirupati city. Dedicated to Lord Govindaraja Swamy.</dd></div>
      <div><dt>Kapila Theertham</dt><dd>At the foot of the Tirumala hills in Tirupati. The temple is dedicated to Lord Shiva.</dd></div>
    </dl>
    <p>Tirumala and Tirupati city are different stops. The wider seven-temple trip also travels beyond this local area; choose the route by its listed stops, not only its name.</p>
    <p>Temple location reference: <a href="https://tirupati.ap.gov.in/religious-tourism/" target="_blank" rel="noopener noreferrer">Tirupati District religious tourism guide</a>. Check current darshan information with <a href="https://www.tirumala.org/" target="_blank" rel="noopener noreferrer">TTD</a>; travel time and entry arrangements must be confirmed for your date.</p>
  </section>`,
  '/trips/south-indian-package': `<section class="info-panel" id="south-india-planning">
    <h2>Plan your South India temple route</h2>
    <p>This is a pilgrimage trip covering the destinations listed above. It is a separate choice from the five-day trip; do not assume every stop on this wider route fits into five days.</p>
    <p>Tell the owner your starting city, available days and must-visit temples. Agree the travel order, overnight towns, hotel nights, daily driving and final drop before booking. Ask for a day-by-day plan for your dates.</p>
    <p><a href="/trips/five-day-trip">Compare the separate five-day trip</a> · <a href="/tirupati-temples">Read the temple guide</a></p>${quoteLink}
  </section>`,
  '/booking-information': `<section class="info-panel" id="quote-checklist">
    <h2>What should my total quote include?</h2>
    <p>Ask the owner for one written quote for your group and dates. Confirm whether it is the total for the group or an amount per person, and which items are included or charged separately.</p>
    <ul class="info-list"><li><strong>Transport:</strong> car model, passenger seats, luggage space, fuel, driver charges, tolls, parking and permits.</li><li><strong>Time and distance:</strong> included hours and kilometres, waiting time, extra distance, late-night travel and pickup or drop outside the agreed route.</li><li><strong>Stay and meals:</strong> hotel name, room type, rooms and nights, meals and any extra beds.</li><li><strong>Trip plan:</strong> every agreed temple, pickup point and time, return drop and any included extras.</li><li><strong>Booking terms:</strong> payment instructions, confirmation, cancellation, refund and date-change rules.</li></ul>
    <p>These are questions to confirm, not a promise that every item is included. Free pickup and drop for the trip, plus help planning temple visits, apply to the complete seven-temple trip as listed on its page.</p>
    <p><a href="/tirupati-car-rentals#rental-checklist">Booking a self-drive car? Check the rental questions too.</a></p>
  </section>`,
};

export function tripStayDetails(trip) {
  if (!['days-3', 'days-4', 'days-5'].includes(trip.id)) return '';
  const overnight = trip.days.flatMap((day) =>
    day.places
      .filter((place) => place.startsWith('Night stay at '))
      .map((place) => `${day.title}: ${place}.`),
  );
  const finalVisit =
    trip.id === 'days-5'
      ? 'The final day covers three Kanchipuram temples and Thiruthani. Confirm your final drop and onward travel time before booking a return train or flight.'
      : 'Share your return train or flight details so the owner can confirm the last temple visit and final drop.';
  return `<section class="info-panel" id="stay-plan"><h2>Night stays and travel details</h2>
    ${overnight.length ? `<p>${overnight.join(' ')}</p>` : '<p>This route lists the visits for each day. Ask the owner to confirm the hotel town for each overnight stop.</p>'}
    <p>Confirm the other night stops, hotel names, room types, meals and charges in your written quote. Choosing Deluxe (Budget), Exclusive or Premium is a preference, not a confirmed room.</p>
    <p>${finalVisit}</p>
    <p>On the first day, plan transport around your booked Tirumala darshan reporting time. Share your arrival time, pickup place, luggage and any rest needs before the route is confirmed.</p>
    <p>Hotel availability, temple access and travel conditions can change the visit order. The owner confirms the plan for your dates.</p>${quoteLink}</section>`;
}
