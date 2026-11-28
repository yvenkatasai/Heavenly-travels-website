import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { transform } from 'esbuild';
import { travelPlanningContent, tripStayDetails } from './travel-planning-content.mjs';

const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const slug = (name) =>
  name
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const jsonld = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
const list = (items) =>
  `<ul class="info-list">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;

export async function prepareAgentContent(source, site) {
  const { code } = await transform(
    fs.readFileSync(path.join(source, '../booking/data.ts'), 'utf8'),
    { loader: 'ts', format: 'esm', target: 'es2020' },
  );
  const data = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  const faq = JSON.parse(fs.readFileSync(path.join(source, 'faqs.json'), 'utf8'));
  // Wording reviewed and approved by the business on 25 November 2026.
  const searchAnswers = JSON.parse(
    fs.readFileSync(path.join(source, 'search-answers.json'), 'utf8'),
  );
  if (
    searchAnswers.length !== 5 ||
    searchAnswers.some(
      ({ answer }) => answer.split(/\s+/).length < 40 || answer.split(/\s+/).length > 50,
    )
  )
    throw new Error('Keep the five owner-approved answers within 40–50 words.');
  const directAnswer = (index) =>
    `<section class="info-panel direct-answer"><h2>${esc(searchAnswers[index].question)}</h2><p>${esc(searchAnswers[index].answer)}</p></section>`;
  const legacy = vm.runInNewContext(
    `${fs.readFileSync(path.join(source, 'tours.js'), 'utf8')}\n${fs.readFileSync(path.join(source, 'data.js'), 'utf8')}\n({tours, TOUR_IMAGES})`,
    {},
    { timeout: 1000 },
  );
  const trips = data.PACKAGES.map((trip) => ({
    ...trip,
    path: `/trips/${slug(trip.name)}`,
    url: `${site.url}/trips/${slug(trip.name)}`,
    bookingUrl: `${site.url}/vehicles?package=${trip.id}`,
  }));
  const dayDescriptions = {
    'days-1':
      'One-day Tirupati and Tirumala trip for visitors with darshan tickets already booked. Visit Padmavathi, Varahaswamy and Govindaraju temples. Ask for a quote.',
    'days-2':
      'Plan two days covering Tirumala, Varahaswamy, four Tirupati local temples and Srikalahasti. Choose your vehicle and ask the owner for a quotation.',
    'days-3':
      'Explore Tirumala, Vellore, Kanipakam, Srinivasamangapuram, Vakulamatha and Tirupati local temples over three days, with Srikalahasti. Ask for a quote.',
    'days-4':
      'Plan four days with Tirumala, a night in Tiruvannamalai, Vellore, Kanipakam, Tirupati local temples and Srikalahasti. Discuss hotels and a quotation.',
    'days-5':
      'Choose a five-day temple trip through Tirumala, Tiruvannamalai, Vellore and Tirupati, with Kanchipuram and Thiruthani. Ask about vehicles and hotels.',
  };
  const whatsapp = `https://wa.me/${site.telephone.replace('+', '')}`;
  const phoneDisplay = /^(\+91)(\d{5})(\d{5})$/.test(site.telephone)
    ? site.telephone.replace(/^(\+91)(\d{5})(\d{5})$/, '$1 $2 $3')
    : site.telephone;
  // Draft opener matches the page being viewed, so the owner knows the context.
  const pageOpener = (title) => {
    const trip = trips.find((item) => title.startsWith(item.name));
    if (trip) return `Hello Heavenly Tours & Travels, I am looking at the ${trip.name}.`;
    if (/car rentals/i.test(title))
      return 'Hello Heavenly Tours & Travels, I would like to arrange a car with a driver from Tirupati.';
    return 'Hello Heavenly Tours & Travels, I have a question about planning a temple trip.';
  };
  const terms =
    'Payment, booking confirmation, cancellations, refunds and date changes are handled directly with owner Hemanth Kumar on WhatsApp. Ask the owner to confirm the terms for your trip in writing before you pay.';
  const ticketRule =
    'We only guide you on how to book Tirumala darshan tickets. We do not book tickets for you. Darshan is subject to official availability.';
  const officialTtd =
    '<p class="official-temple-links">Check current darshan information with <a href="https://www.tirumala.org/" target="_blank" rel="noopener noreferrer">Tirumala Tirupati Devasthanams (TTD)</a>. Use <a href="https://ttdevasthanams.ap.gov.in/" target="_blank" rel="noopener noreferrer">TTD’s official online services</a> to check ticket availability and book directly. We provide guidance only.</p>';
  const styles = fs.readFileSync(path.join(source, 'information.css'), 'utf8');
  const catalog = {
    schemaVersion: '1.0',
    business: {
      name: site.name,
      url: site.url,
      owner: site.ownerName,
      email: site.email,
      telephone: site.telephone,
      baseLocation: site.baseLocation,
      areaServed: site.areaServed,
    },
    booking: {
      mode: 'whatsapp_enquiry',
      whatsapp,
      humanConfirmationRequired: true,
      paymentOnWebsite: false,
      priceAndAvailability:
        'Confirm directly with the owner for your dates, route, group and vehicle.',
      terms,
      tirumalaTicketPolicy: ticketRule,
      groupSize: { minimum: 2, maximum: 200 },
    },
    accommodationTypes: data.ACCOMMODATIONS,
    services: data.SERVICES.map((name) => data.SERVICE_LABELS[name] || name),
    vehicles: data.FLEET.map(({ id, name, description }) => ({
      id,
      name,
      description,
      seating: 'Confirm with the owner; no guaranteed seat count is published.',
    })),
    trips: trips.map(({ id, name, type, note, duration, places, days, url, bookingUrl }) => ({
      id,
      name,
      type,
      description: note,
      ...(duration ? { durationDays: duration } : {}),
      stops: places,
      days,
      url,
      bookingUrl,
      availability: 'Confirm with owner; selecting this trip does not reserve it.',
    })),
    faq: faq.map(([question, answer]) => ({ question, answer })),
  };
  const footer = `<footer class="info-footer"><nav aria-label="More information"><a href="/about">About us</a><a href="/trips">All trips</a><a href="/booking-information">Booking information</a><a href="/questions">Common questions</a><a href="/privacy">Privacy</a><a href="/terms">Website terms</a><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><button type="button" data-cookie-settings>Cookie choices</button></nav><p>${esc(site.name)} · ${esc(site.baseLocation)} · <a href="tel:${site.telephone}">${esc(phoneDisplay)}</a></p></footer>`;
  const hoursFooter = footer.replace('</footer>', `<p>${esc(site.openingHoursLabel)}</p></footer>`);
  const wrap = (title, description, content, schema = '') =>
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#183c31"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><!--__SEO__--><style>${styles}</style>${schema}</head><body><header class="info-header"><a class="info-brand" href="/">Heavenly<small>TOURS &amp; TRAVELS</small></a><nav aria-label="Main navigation"><a href="/trips">Our trips</a><a href="/about">About us</a><a href="${whatsapp}?text=${encodeURIComponent(pageOpener(title))}" target="_blank" rel="noopener noreferrer">Plan on WhatsApp</a></nav></header><main><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / ${trips.some((trip) => trip.name === title) ? '<a href="/trips">Trips</a> / ' : ''}<span aria-current="page">${esc(title)}</span></nav>${content}</main>${hoursFooter}</body></html>`;
  const intro = (label, title, description) =>
    `<p class="overline">${esc(label)}</p><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p>`;
  const contact = `<div class="info-buttons"><a class="info-button" href="${whatsapp}" target="_blank" rel="noopener noreferrer">Talk to the owner</a><a class="info-button secondary" href="tel:${site.telephone}">Call ${esc(phoneDisplay)}</a></div>`;
  const pages = [];
  const serviceTopics = `<nav class="info-topics" aria-label="Travel planning guides"><a href="/tirupati-tour-packages">Tirupati tour packages</a><a href="/tirumala-tour-packages">Tirumala family trips</a><a href="/tirupati-car-rentals">Tirupati car rentals</a><a href="/tirupati-temples">Temple guide</a><a href="/trips/south-indian-package">South India temple tours</a></nav>`;
  const tripLinks = (ids) =>
    `<div class="info-cards">${ids
      .map((id) => {
        const trip = trips.find((trip) => trip.id === id);
        if (!trip) throw new Error(`Unknown guide trip: ${id}`);
        return `<article class="info-card"><h3>${esc(trip.name)}</h3><p>${esc(trip.note)}</p><a href="${trip.path}" aria-label="Read stops and trip details for ${esc(trip.name)}">Read stops and trip details</a></article>`;
      })
      .join('')}</div>`;
  const guides = [
    {
      path: '/tirupati-tour-packages',
      title: `Tirupati Tour Packages & Temple Trips | ${site.name}`,
      description:
        'Compare Tirupati temple tour packages, family trips and one-to-five-day plans. Choose your route and vehicle, then request an owner-confirmed quotation.',
      html: wrap(
        'Tirupati tour packages',
        'Temple trips, family travel and custom routes from Tirupati / Renigunta.',
        `${intro('TIRUPATI TRAVEL PLANNING', 'Tirupati tour packages.', 'Compare real trip options from our Tirupati / Renigunta team. Read the stops, choose a vehicle and ask the owner to confirm your arrangements.')}${directAnswer(0)}<section class="info-panel"><h2>Choose a trip that fits your visit</h2><p>For a short visit, read the Express Package. Families can compare the Govindham Package with the complete seven-temple trip. Longer routes include Vellore and the South India temple tour. The stops are listed on each trip page.</p>${tripLinks(['tour-1', 'tour-2', 'seven-temple'])}<a href="/trips">Compare all 13 trips and day-wise plans</a></section><section class="info-panel"><h2>What to share for a quotation</h2>${list(['Your travel date or flexible dates', 'Arrival and pickup place', 'Number of travellers and luggage needs', 'Preferred trip and vehicle', 'Deluxe (Budget), Exclusive or Premium accommodation preference'])}<p>The owner confirms what the quote covers and any additional arrangements. Selecting a trip on the website does not reserve a vehicle or room.</p></section>${contact}${serviceTopics}`,
      ),
    },
    {
      path: '/tirumala-tour-packages',
      title: `Tirumala Tour & Family Packages | ${site.name}`,
      description:
        'Plan a Tirumala temple trip or family package from Tirupati. Compare temple stops, transport and hotel preferences, with ticket guidance and WhatsApp quotations.',
      html: wrap(
        'Tirumala temple trips and family packages',
        'Plan transport, temple visits and hotel preferences for your Tirumala visit.',
        `${intro('TIRUMALA TRIP PLANNING', 'Tirumala trips for your family.', 'Choose a Tirupati and Tirumala route, tell us your pickup place and discuss comfortable arrangements for your family.')}${directAnswer(1)}<section class="info-panel"><h2>Compare Tirumala trip options</h2>${tripLinks(['tour-2', 'days-1', 'seven-temple'])}<p>The one-day trip is intended for travellers who have already booked their darshan ticket. The complete trip includes all seven temples on its page; it is a wider route beyond Tirumala.</p></section><section class="info-panel"><h2>Family travel and vehicle planning</h2><p>Tell the owner about older travellers, children, walking needs, rest breaks and luggage. Choose a car, SUV or larger group vehicle as a preference; seating and availability are confirmed directly.</p><p>Hotel preferences are Deluxe (Budget), Exclusive and Premium. Ask the owner to confirm the property and arrangements for your dates.</p><p>${esc(ticketRule)}</p></section>${contact}${serviceTopics}`,
      ),
    },
    {
      path: '/tirupati-car-rentals',
      title: `Tirupati Car Rentals & Car Travels | ${site.name}`,
      description:
        'Tirupati car rentals with a driver and self-drive options. Compare cars and group vehicles for temple trips, airport pickup and travel from Tirupati / Renigunta.',
      html: wrap(
        'Tirupati car rentals and car travels',
        'Driver-operated and self-drive car rental options from Tirupati / Renigunta.',
        `${intro('CARS & GROUP TRANSPORT', 'Tirupati car rentals.', 'Arrange a car with a driver or ask for a self-drive rental. Share your dates and travel needs so the owner can confirm the available options.')}${directAnswer(4)}<div class="info-grid"><div><section class="info-panel"><h2>Cars with a driver</h2><p>Ask about Tirupati car travel, Tirumala transport, airport or railway station pickup, local visits and outstation travel. Share the route, pickup and drop-off points, date and number of travellers.</p><a href="${whatsapp}?text=${encodeURIComponent('Hello Heavenly Tours & Travels, please help me arrange a car with a driver from Tirupati. I would like to discuss dates, route and a quotation.')}" target="_blank" rel="noopener noreferrer">Ask about a car with a driver</a></section><section class="info-panel"><h2>Self-drive car rentals</h2><p>Self-drive car options are also available. Confirm the car, rental period, pickup and return arrangements, and rental terms directly with the owner before booking. This website does not publish a fixed rental rate or guarantee vehicle availability.</p><a href="${whatsapp}?text=${encodeURIComponent('Hello Heavenly Tours & Travels, please share self-drive car rental options in Tirupati. I would like to discuss dates, pickup, return and rental terms.')}" target="_blank" rel="noopener noreferrer">Ask about a self-drive car</a></section></div><aside class="info-aside"><h2>Vehicle options</h2>${list(catalog.vehicles.map((v) => `${v.name} — ${v.description}`))}<p>For larger families and groups, ask about a Tempo Traveller, mini bus or bus. The owner confirms seats, luggage space and availability. Self-drive availability applies to cars; confirm the specific vehicle.</p></aside></div><section class="info-panel"><h2>Combine transport with a temple trip</h2><p>For a Tirumala car package or a multi-temple route, compare the listed trips first. Then select a vehicle and hotel preference. The owner will confirm the full travel arrangements and quotation on WhatsApp.</p><a href="/trips">See temple trips and covered stops</a></section>${contact}${serviceTopics}`,
        jsonld({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Tirupati car rentals and car travel',
          serviceType: 'Driver-operated and self-drive car rental',
          areaServed: ['Tirupati', 'Renigunta'],
          provider: { '@id': `${site.url}/#business` },
          url: `${site.url}/tirupati-car-rentals`,
        }),
      ),
    },
    {
      path: '/tirupati-temples',
      title: `Tirupati Temples & Seven-Temple Tour Guide | ${site.name}`,
      description:
        'Read the temples covered by Heavenly trips around Tirupati and Tirumala, and compare the complete seven-temple route with individual and day-wise plans.',
      html: wrap(
        'Tirupati temples and trip coverage',
        'Check the actual temple stops before choosing a trip.',
        `${intro('TEMPLE VISIT GUIDE', 'Know which temples your trip covers.', 'Use the trip lists to compare visits around Tirupati and Tirumala with longer routes through South India.')}${directAnswer(3)}<section class="info-panel"><h2>Temple visits around Tirupati and Tirumala</h2>${list(['Sri Venkateswara Temple — Tirumala', 'Varahaswamy Temple — Tirumala', 'Sri Padmavathi Ammavari Temple — Tiruchanur', 'Govindaraja Swamy Temple — Tirupati', 'Kapila Theertham — Tirupati', 'ISKCON Temple — Tirupati'])}<p>These stops appear in different family and day-wise trips. They are not automatically included in every trip. Open the selected trip page to check its exact stops.</p></section><section class="info-panel"><h2>The complete seven-temple route</h2>${list(trips.find((trip) => trip.id === 'seven-temple').places)}<p>This is a wider route that also includes Srikalahasti, Kanipakam, Vellore, Kanchipuram and Tiruvannamalai. It is not a list of seven temples located within Tirupati city.</p><a href="/trips/complete-7-temple-trip">See the complete seven-temple trip and included extras</a></section><section class="info-panel"><h2>Before you travel</h2><p>Confirm your dates, covered stops, visit order, transport and accommodation with the owner. Temple timings and access can affect the final plan.</p><p>${esc(ticketRule)}</p></section>${contact}${serviceTopics}`,
      ),
    },
  ];
  for (const guide of guides) {
    guide.html = guide.html.replace(
      '<nav class="info-topics"',
      `${travelPlanningContent[guide.path]}<nav class="info-topics"`,
    );
  }
  pages.push(...guides);
  catalog.travelGuides = guides.map(({ path, title, description }) => ({
    title,
    description,
    url: site.url + path,
  }));
  catalog.services.push('Driver-operated and self-drive car rentals');
  pages.push({
    path: '/about',
    title: `About us — ${site.name}`,
    description: `Meet owner ${site.ownerName} and learn about our temple trips from Tirupati and Renigunta.`,
    html: wrap(
      'About Heavenly Tours & Travels',
      site.description,
      `${intro('OUR BUSINESS', 'Temple trips, with a local team.', `${site.name} is a travel agency based in Tirupati / Renigunta, Andhra Pradesh. Owner ${site.ownerName} is your direct contact for planning and confirming a trip.`)}<div class="info-grid"><div><section class="info-panel"><h2>What we help with</h2>${list(catalog.services)}<p>Choose from ${trips.length} complete, individual and day-wise trips, or ask for a route of your own. We help families, older travellers and groups of 2–200 people.</p><a href="/trips">See all trips and temple stops</a></section><section class="info-panel"><h2>Talk directly with Hemanth Kumar</h2><p>Trip details, payment, confirmation and any later changes are agreed directly on WhatsApp.</p>${contact}</section></div><aside class="info-aside"><h2>Business details</h2><dl><dt>Business</dt><dd>${esc(site.name)}</dd><dt>Owner</dt><dd>${esc(site.ownerName)}</dd><dt>Based in</dt><dd>${esc(site.baseLocation)}</dd><dt>Email</dt><dd><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></dd></dl><p>${esc(ticketRule)}</p></aside></div>`,
      jsonld({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${site.url}/about#owner`,
        name: site.ownerName,
        jobTitle: 'Owner',
        worksFor: { '@id': `${site.url}/#business` },
      }),
    ),
  });
  const about = pages.find((page) => page.path === '/about');
  about.html = about.html.replace(
    '</main>',
    `<section class="info-panel" id="google-business"><h2>Find our business online</h2><p>Visit our Google listing and Instagram profile. If you have travelled with us, you can share your honest experience to help other travellers.</p><div class="info-buttons"><a class="info-button" href="${esc(site.googleMapsUrl)}" target="_blank" rel="noopener noreferrer">View our Google listing</a><a class="info-button secondary" href="${esc(site.googleReviewUrl)}" target="_blank" rel="noopener noreferrer">Share your experience on Google</a><a class="info-button secondary" href="${esc(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">Visit our Instagram</a></div></section></main>`,
  );
  about.html = about.html.replace(
    '</main>',
    `<section class="info-panel" id="service-area"><h2>Hours and service areas</h2><p>${esc(site.openingHoursLabel)}. Our team is based in ${esc(site.baseLocation)}.</p><p>Local service areas include ${esc(site.localServiceAreas.join(', '))}. We also arrange the listed temple routes across South India and India.</p><p>Share your pickup and final drop locations before booking. The owner confirms transport, rooms and availability for your dates.</p></section></main>`,
  );
  const tripCards = trips
    .map(
      (trip) =>
        `<article class="info-card"><img src="/${esc(trip.image)}" alt="${esc(trip.imageAlt)}" width="700" height="420" loading="lazy" decoding="async"><p class="overline">${trip.duration ? `${trip.duration} day${trip.duration === 1 ? '' : 's'}` : trip.type === 'signature' ? 'All seven temples' : 'Individual trip'}</p><h2>${esc(trip.name)}</h2><p>${esc(trip.note)}</p><a href="${trip.path}">See temples &amp; trip details</a></article>`,
    )
    .join('');
  pages.push({
    path: '/trips',
    title: `Temple trips — ${site.name}`,
    description:
      'Compare complete, individual and one-to-five-day temple trips. Read the stops and choose a vehicle.',
    html: wrap(
      'Find your temple trip',
      'Compare our temple trips and ask the owner to confirm your dates and arrangements.',
      `${intro('OUR TRIPS', 'Find your temple trip.', 'Read the temple stops, choose a trip, then pick your vehicle. Your selections are an enquiry; the owner confirms the arrangements.')}<div class="info-cards">${tripCards}</div><div class="info-note">${esc(ticketRule)}</div>`,
      jsonld({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Heavenly temple trips',
        itemListElement: trips.map((trip, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: trip.name,
          url: trip.url,
        })),
      }),
    ),
  });
  for (const trip of trips) {
    const stops = [...trip.places, ...trip.days.flatMap((day) => day.places)];
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['TouristTrip', 'Service'],
      '@id': `${trip.url}#trip`,
      name: trip.name,
      description: trip.note,
      url: trip.url,
      image: `${site.url}/${trip.image}`,
      provider: { '@id': `${site.url}/#business` },
      serviceType: 'Temple trip planning and transport',
      areaServed: site.areaServed,
      itinerary: {
        '@type': 'ItemList',
        itemListElement: stops.map((name, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'Place', name },
        })),
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: trip.bookingUrl,
        servicePhone: { '@type': 'ContactPoint', telephone: site.telephone },
      },
    };
    const plan = trip.days
      .map(
        (day) =>
          `<section class="info-panel"><h3>${esc(day.title)}</h3>${list(day.places)}</section>`,
      )
      .join('');
    pages.push({
      path: trip.path,
      title:
        trip.id === 'tour-5'
          ? `South India Temple Tour Package | ${site.name}`
          : trip.id === 'tour-2'
            ? `Tirupati & Tirumala Family Package | ${site.name}`
            : `${trip.name} — ${site.name}`,
      description: dayDescriptions[trip.id] || trip.note,
      html: wrap(
        trip.name,
        trip.note,
        `${intro(trip.duration ? `${trip.duration}-DAY TEMPLE TRIP` : trip.type === 'signature' ? 'COMPLETE SEVEN-TEMPLE TRIP' : 'TEMPLE TRIP', trip.name, trip.note)}${trip.id === 'seven-temple' ? directAnswer(2) : ''}<div class="info-grid"><div><section class="info-panel"><h2>${trip.days.length ? 'Your day-by-day plan' : 'What this trip covers'}</h2>${trip.places.length ? list(trip.places) : ''}${plan}</section><section class="info-panel"><h2>Before you choose</h2><p>${esc(ticketRule)}</p><p>Dates, visit order, vehicle seating and accommodation are confirmed with the owner. Temple timings and access can affect the final route.</p><a href="/booking-information">Read how booking and changes work</a></section></div><aside class="info-aside"><img class="info-image" src="/${trip.image}" alt="${esc(trip.imageAlt)}" width="700" height="420" decoding="async"><h2>Make it your trip.</h2><p>Choose a vehicle next. Your booking is confirmed only after you speak with the owner.</p><div class="info-buttons"><a class="info-button" href="/vehicles?package=${trip.id}">Select trip &amp; vehicle</a></div><a href="${whatsapp}?text=${encodeURIComponent(`Hello ${site.name}, please help me plan the ${trip.name}.`)}" target="_blank" rel="noopener noreferrer">Ask about this trip on WhatsApp</a><p>Hotel preferences: Deluxe (Budget), Exclusive or Premium.</p></aside></div>${trip.id === 'tour-5' ? serviceTopics : ''}`,
        jsonld(schema),
      ),
    });
  }
  pages.push({
    path: '/booking-information',
    title: `Booking, payment and changes — ${site.name}`,
    description:
      'How to request a trip and arrange payment, confirmation, cancellation, refunds and date changes directly with the owner.',
    html: wrap(
      'How booking works',
      terms,
      `${intro('BOOKING INFORMATION', 'Plan first. Confirm with the owner.', 'This website helps you choose a trip, vehicle and hotel preference. It does not take payment or reserve a vehicle or room.')}<div class="info-grid"><div><section class="info-panel"><h2>Three simple steps</h2><ol class="info-list"><li>Choose your trip and vehicle. Add your date, pickup place, group size and accommodation preference.</li><li>Open the WhatsApp draft, check the details, and send it when you are ready.</li><li>Agree the arrangements, payment and booking confirmation directly with owner Hemanth Kumar.</li></ol></section><section class="info-panel"><h2>Payment &amp; confirmation</h2><p>No payment is taken on this website. The owner handles payment instructions and confirms your booking directly on WhatsApp. Selecting a trip or vehicle is not a confirmed reservation.</p></section><section class="info-panel"><h2>Cancellations, refunds &amp; date changes</h2><p>${esc(terms)}</p><p>The website does not promise a fixed refund amount, cancellation period or free date change.</p></section><section class="info-panel"><h2>Darshan tickets</h2><p>${esc(ticketRule)}</p></section></div><aside class="info-aside"><h2>Speak to the owner</h2><p>${esc(site.ownerName)} · ${esc(site.baseLocation)}</p>${contact}<a href="mailto:${esc(site.email)}">${esc(site.email)}</a></aside></div>`,
    ),
  });
  for (const pathname of ['/trips/south-indian-package', '/booking-information']) {
    const page = pages.find((page) => page.path === pathname);
    page.html = page.html.replace('</main>', `${travelPlanningContent[pathname]}</main>`);
  }
  for (const trip of trips) {
    const details = tripStayDetails(trip);
    if (details) {
      const page = pages.find((page) => page.path === trip.path);
      page.html = page.html.replace('</main>', `${details}</main>`);
    }
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  pages.push({
    path: '/questions',
    title: `Common questions — ${site.name}`,
    description:
      'Answers about temple trips, ticket guidance, vehicles, booking, payment and changes.',
    html: wrap(
      'Common questions',
      'Simple answers to help you plan your temple trip.',
      `${intro('BEFORE YOU TRAVEL', 'Common questions.', 'Read the basics here, or speak directly with the owner about your trip.')}<div class="info-faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>${contact}`,
      jsonld(faqSchema),
    ),
  });
  pages.push({
    path: '/terms',
    title: `Website terms — ${site.name}`,
    description:
      'How to use our trip information and request arrangements directly with the owner.',
    html: wrap(
      'Website terms',
      'How website enquiries and trip information work.',
      `${intro('USING THIS WEBSITE', 'Information first. Confirm your arrangements.', 'This website helps you explore trips and prepare a WhatsApp enquiry. It does not accept payment or automatically reserve tickets, vehicles or accommodation.')}<section class="info-panel"><h2>Your trip enquiry</h2><p>Choosing a trip, vehicle or hotel preference is a request for information. Check your WhatsApp draft before you send it. Owner ${esc(site.ownerName)} confirms availability, the quotation, arrangements and booking directly with you.</p></section><section class="info-panel"><h2>Trip information</h2><p>Temple timing, access and travel conditions can affect the final route. Ask the owner to confirm the stops, date, vehicle seating, accommodation and any included extras for your specific trip.</p><p>${esc(ticketRule)}</p></section><section class="info-panel"><h2>Payment, cancellations and changes</h2><p>${esc(terms)}</p><a href="/booking-information">Read booking information</a></section><section class="info-panel"><h2>Privacy and contact</h2><p>Only share information needed for your enquiry. Do not enter card details or identity documents into website fields.</p><a href="/privacy">Read how your information is used</a><p>Questions: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p></section>${contact}`,
    ),
  });
  pages.push({
    path: '/privacy',
    title: `Website privacy — ${site.name}`,
    description: 'How this website uses browser storage and prepares your WhatsApp enquiry.',
    html: wrap(
      'Your details & privacy',
      'How your trip details are used by this website.',
      `${intro('WEBSITE PRIVACY', 'Your trip details stay in your control.', 'You choose whether to send an enquiry. This website does not take payments or automatically send a booking message.')}<section class="info-panel"><h2>Details you enter</h2><p>Your browser may keep trip selections and form details in this tab’s session storage, so you can move between trip and vehicle pages. This site has no customer account or booking database.</p></section><section class="info-panel"><h2>When you open WhatsApp</h2><p>The details you choose are placed into a WhatsApp draft link. Opening it shares that draft information with WhatsApp; you still check it and tap Send yourself. Only include details needed to plan the trip. Payment and any booking changes are handled directly with the owner.</p></section><section class="info-panel"><h2>Optional Google Analytics</h2><p>Analytics is off until you choose Allow cookies. If you allow it, Google Analytics measures page visits and clicks to call us or open WhatsApp. These clicks show interest, not a confirmed booking or a sent message. Google may process online identifiers, device and usage information. We do not send your name, phone number, pickup place, trip notes or WhatsApp draft contents to Analytics. Automatic outbound-link and form measurement is disabled.</p><p>Advertising consent and Google signals stay off. Analytics cookies are configured to expire after 30 days. Your browser stores your analytics choice for up to 180 days. Use Cookie choices to change your mind; choosing Reject optional cookies stops our tracking and removes this site's Analytics cookies. You can also clear your browser's site storage.</p><p><button type="button" data-cookie-settings>Change cookie choices</button> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy policy</a></p></section><section class="info-panel"><h2>Website delivery</h2><p>Cloudflare hosts and secures this website and can process connection information, such as IP addresses and technical request information, to deliver it. The website does not use advertising trackers.</p></section><section class="info-panel"><h2>Questions about information you shared</h2><p>Contact Hemanth Kumar on WhatsApp or email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> to discuss access to or deletion of details you have sent directly to the business.</p></section>${contact}`,
    ),
  });
  const homeCards = legacy.tours
    .map((trip, i) => {
      const page = trips.find((item) => item.id === `tour-${i + 1}`);
      return `<article class="tour-mini package-card" aria-labelledby="package-title-${i}" data-package-index="${i}"><div class="package-visual"><img src="assets/${legacy.TOUR_IMAGES[i]}" alt="${esc(page.imageAlt)}" loading="lazy" decoding="async" width="900" height="1000"><span class="package-image-caption">${esc(trip.route)}</span></div><div class="package-copy"><div class="package-number"><span>TRIP</span><strong>0${i + 1}</strong><span>OF ${String(legacy.tours.length).padStart(2, '0')}</span></div><p class="package-type">${esc(trip.tag)}</p><h3 id="package-title-${i}">${esc(trip.name)}</h3><details class="package-stops"><summary>See temples &amp; trip details</summary><ul class="package-includes">${trip.includes.map((stop) => `<li>${esc(stop)}</li>`).join('')}</ul></details><div class="package-actions"><a href="/vehicles?package=tour-${i + 1}" class="button primary package-plan" data-tour-pick="${i}">Select this trip <span aria-hidden="true">↗</span></a><div class="package-links"><a href="${page.path}" aria-label="Full trip details for ${esc(trip.name)}">Full trip details</a><a href="${whatsapp}?text=${encodeURIComponent(`Hello ${site.name}, please help me plan the ${trip.name}.`)}" target="_blank" rel="noopener noreferrer" aria-label="Enquire about ${esc(trip.name)} on WhatsApp">Enquire on WhatsApp</a></div></div></div></article>`;
    })
    .join('');
  // Useful initial HTML stays available while React loads or when JavaScript is unavailable.
  const dayCards = `<div class="booking-flow"><section id="day-packages" class="day-packages" aria-labelledby="day-category day-packages-title"><div class="package-chapter flow-container"><span class="chapter-number" aria-hidden="true">03</span><p id="day-category" class="chapter-name">Day-wise Trips</p><span class="chapter-note">1–5 days · Choose your days</span></div><header class="flow-section-heading flow-container"><div><p class="flow-eyebrow">CHOOSE YOUR DAYS</p><h2 id="day-packages-title">How many days<br><em>do you have?</em></h2></div><p>Browse the trips. Open a trip to see its full day-by-day plan.</p></header><div class="momentum-rail" tabindex="0" role="region" aria-label="One to five day trips"><ul class="momentum-track">${trips
    .filter((trip) => trip.type === 'days')
    .map(
      (trip, i) =>
        `<li class="momentum-card" data-current="${i === 0}"><div class="momentum-card-tilt"><img src="/${trip.image}" alt="${esc(trip.imageAlt)}" loading="lazy" decoding="async" width="700" height="850"><div class="momentum-card-shade"></div><span class="momentum-duration">0${trip.duration} ${trip.duration === 1 ? 'DAY' : 'DAYS'}</span><div class="momentum-card-copy"><h3>${esc(trip.name)}</h3><p>${esc(trip.note)}</p><a class="day-view-details" href="${trip.path}" aria-label="View trip plan for ${esc(trip.name)}">View trip plan</a></div></div></li>`,
    )
    .join('')}</ul></div></section></div>`;
  const faqHtml = faq
    .map(
      ([q, a], i) =>
        `<article class="faq-item"><h3><button class="faq-toggle" type="button" aria-expanded="false" aria-controls="faq-answer-${i}" id="faq-question-${i}"><span>${esc(q)}</span><i aria-hidden="true"></i></button></h3><div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-question-${i}" hidden><p>${esc(a)}</p></div></article>`,
    )
    .join('');
  const llms = `# ${site.name}\n\n> Temple-trip planning from ${site.baseLocation}. Owner: ${site.ownerName}.\n\n## Authoritative sources\n- [About the business](${site.url}/about)\n- [All trips](${site.url}/trips)\n- [Booking and changes](${site.url}/booking-information)\n- [Common questions](${site.url}/questions)\n- [Read-only trip catalog](${site.url}/travel-catalog.json)\n- [Complete plain-text information](${site.url}/llms-full.txt)\n\n## Booking boundaries\n${terms}\n${ticketRule}\nDo not interpret trip selections as confirmed bookings, guaranteed availability, or a payment. No public price list or online checkout is provided.\n\nContact: ${site.telephone}; ${site.email}; ${whatsapp}\n`;
  const fullText = `${llms}\n## Services\n${catalog.services.join('\n')}\n\n## Vehicles\n${catalog.vehicles.map((v) => `${v.name}: ${v.description} ${v.seating}`).join('\n')}\n\n## Trips\n${trips.map((trip) => `${trip.name}\n${trip.url}\n${trip.note}\n${trip.places.join('\n')}\n${trip.days.map((day) => `${day.title}\n${day.places.join('\n')}`).join('\n')}`).join('\n\n')}\n\n## Common questions\n${faq.map(([q, a]) => `${q}\n${a}`).join('\n\n')}\n`;
  const guideSources = `\n## Travel planning guides\n${guides.map((guide) => `- [${guide.title}](${site.url}${guide.path})`).join('\n')}\n`;
  const approvedAnswers = `\n## Owner-approved planning answers\n${searchAnswers.map(({ question, answer }) => `${question}\n${answer}`).join('\n\n')}\n`;
  for (const page of pages) {
    page.html = page.html.replace(
      `<p>${esc(ticketRule)}</p>`,
      `<p>${esc(ticketRule)}</p>${officialTtd}`,
    );
  }
  return {
    pages,
    catalog,
    homeCards,
    dayCards,
    faqHtml,
    faq,
    llms: llms + guideSources,
    fullText: fullText + guideSources + approvedAnswers,
    trips,
    footer: hoursFooter,
  };
}
