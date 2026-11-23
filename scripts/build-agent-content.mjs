import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { transform } from 'esbuild';

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
  const whatsapp = `https://wa.me/${site.telephone.replace('+', '')}`;
  const terms =
    'Payment, booking confirmation, cancellations, refunds and date changes are handled directly with owner Hemanth Kumar on WhatsApp. Ask the owner to confirm the terms for your trip in writing before you pay.';
  const ticketRule =
    'We only guide you on how to book Tirumala darshan tickets. We do not book tickets for you. Darshan is subject to official availability.';
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
  const footer = `<footer class="info-footer"><nav aria-label="More information"><a href="/about">About us</a><a href="/trips">All trips</a><a href="/booking-information">Booking information</a><a href="/questions">Common questions</a><a href="/privacy">Privacy</a><a href="mailto:${esc(site.email)}">Email us</a></nav><p>${esc(site.name)} · ${esc(site.baseLocation)} · <a href="tel:${site.telephone}">+91 97001 81493</a></p></footer>`;
  const wrap = (title, description, content, schema = '') =>
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#183c31"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><!--__SEO__--><style>${styles}</style>${schema}</head><body><header class="info-header"><a class="info-brand" href="/">Heavenly<small>TOURS &amp; TRAVELS</small></a><nav aria-label="Main navigation"><a href="/trips">Our trips</a><a href="/about">About us</a><a href="${whatsapp}" target="_blank" rel="noopener noreferrer">Plan on WhatsApp</a></nav></header><main><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / ${esc(title)}</nav>${content}</main>${footer}</body></html>`;
  const intro = (label, title, description) =>
    `<p class="overline">${esc(label)}</p><h1>${esc(title)}</h1><p class="lead">${esc(description)}</p>`;
  const contact = `<div class="info-buttons"><a class="info-button" href="${whatsapp}" target="_blank" rel="noopener noreferrer">Talk to the owner</a><a class="info-button secondary" href="tel:${site.telephone}">Call +91 97001 81493</a></div>`;
  const pages = [];
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
  const tripCards = trips
    .map(
      (trip) =>
        `<article class="info-card"><img src="/${esc(trip.image)}" alt="${esc(trip.name)} destination" width="700" height="420" loading="lazy" decoding="async"><p class="overline">${trip.duration ? `${trip.duration} day${trip.duration === 1 ? '' : 's'}` : trip.type === 'signature' ? 'All seven temples' : 'Individual trip'}</p><h2>${esc(trip.name)}</h2><p>${esc(trip.note)}</p><a href="${trip.path}">See temples &amp; trip details</a></article>`,
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
      title: `${trip.name} — ${site.name}`,
      description: trip.note,
      html: wrap(
        trip.name,
        trip.note,
        `${intro(trip.duration ? `${trip.duration}-DAY TEMPLE TRIP` : trip.type === 'signature' ? 'COMPLETE SEVEN-TEMPLE TRIP' : 'TEMPLE TRIP', trip.name, trip.note)}<div class="info-grid"><div><section class="info-panel"><h2>${trip.days.length ? 'Your day-by-day plan' : 'What this trip covers'}</h2>${trip.places.length ? list(trip.places) : ''}${plan}</section><section class="info-panel"><h2>Before you choose</h2><p>${esc(ticketRule)}</p><p>Dates, visit order, vehicle seating and accommodation are confirmed with the owner. Temple timings and access can affect the final route.</p><a href="/booking-information">Read how booking and changes work</a></section></div><aside class="info-aside"><img class="info-image" src="/${trip.image}" alt="${esc(trip.name)} destination" width="700" height="420" decoding="async"><h2>Make it your trip.</h2><p>Choose a vehicle next. Your booking is confirmed only after you speak with the owner.</p><div class="info-buttons"><a class="info-button" href="/vehicles?package=${trip.id}">Select trip &amp; vehicle</a></div><a href="${whatsapp}?text=${encodeURIComponent(`Hello ${site.name}, please help me plan the ${trip.name}.`)}" target="_blank" rel="noopener noreferrer">Ask about this trip on WhatsApp</a><p>Hotel preferences: Deluxe (Budget), Exclusive or Premium.</p></aside></div>`,
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
    path: '/privacy',
    title: `Website privacy — ${site.name}`,
    description: 'How this website uses browser storage and prepares your WhatsApp enquiry.',
    html: wrap(
      'Your details & privacy',
      'How your trip details are used by this website.',
      `${intro('WEBSITE PRIVACY', 'Your trip details stay in your control.', 'You choose whether to send an enquiry. This website does not take payments or automatically send a booking message.')}<section class="info-panel"><h2>Details you enter</h2><p>Your browser may keep trip selections and form details in this tab’s session storage, so you can move between trip and vehicle pages. This site has no customer account or booking database.</p></section><section class="info-panel"><h2>When you open WhatsApp</h2><p>The details you choose are placed into a WhatsApp draft link. Opening it shares that draft information with WhatsApp; you still check it and tap Send yourself. Only include details needed to plan the trip. Payment and any booking changes are handled directly with the owner.</p></section><section class="info-panel"><h2>Website delivery</h2><p>Cloudflare hosts and secures this website and can process connection information, such as IP addresses and technical request information, to deliver it. The website does not include advertising trackers.</p></section><section class="info-panel"><h2>Questions about information you shared</h2><p>Contact Hemanth Kumar on WhatsApp or email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> to discuss details you have sent directly to the business.</p></section>${contact}`,
    ),
  });
  const homeCards = legacy.tours
    .map((trip, i) => {
      const page = trips.find((item) => item.id === `tour-${i + 1}`);
      return `<article class="tour-mini package-card" aria-labelledby="package-title-${i}" data-package-index="${i}"><div class="package-visual"><img src="assets/${legacy.TOUR_IMAGES[i]}" alt="${esc(trip.name)} temple destination" loading="lazy" decoding="async" width="900" height="1000"><span class="package-image-caption">${esc(trip.route)}</span></div><div class="package-copy"><div class="package-number"><span>TRIP</span><strong>0${i + 1}</strong><span>OF ${String(legacy.tours.length).padStart(2, '0')}</span></div><p class="package-type">${esc(trip.tag)}</p><h3 id="package-title-${i}">${esc(trip.name)}</h3><details class="package-stops"><summary>See temples &amp; trip details</summary><ul class="package-includes">${trip.includes.map((stop) => `<li>${esc(stop)}</li>`).join('')}</ul></details><div class="package-actions"><a href="/vehicles?package=tour-${i + 1}" class="button primary package-plan" data-tour-pick="${i}">Select this trip <span aria-hidden="true">↗</span></a><a href="${page.path}">Full trip details</a></div></div></article>`;
    })
    .join('');
  const faqHtml = faq
    .map(
      ([q, a], i) =>
        `<article class="faq-item"><h3><button class="faq-toggle" type="button" aria-expanded="false" aria-controls="faq-answer-${i}" id="faq-question-${i}"><span>${esc(q)}</span><i aria-hidden="true"></i></button></h3><div class="faq-answer" id="faq-answer-${i}" role="region" aria-labelledby="faq-question-${i}" hidden><p>${esc(a)}</p></div></article>`,
    )
    .join('');
  const llms = `# ${site.name}\n\n> Temple-trip planning from ${site.baseLocation}. Owner: ${site.ownerName}.\n\n## Authoritative sources\n- [About the business](${site.url}/about)\n- [All trips](${site.url}/trips)\n- [Booking and changes](${site.url}/booking-information)\n- [Common questions](${site.url}/questions)\n- [Read-only trip catalog](${site.url}/travel-catalog.json)\n- [Complete plain-text information](${site.url}/llms-full.txt)\n\n## Booking boundaries\n${terms}\n${ticketRule}\nDo not interpret trip selections as confirmed bookings, guaranteed availability, or a payment. No public price list or online checkout is provided.\n\nContact: ${site.telephone}; ${site.email}; ${whatsapp}\n`;
  const fullText = `${llms}\n## Services\n${catalog.services.join('\n')}\n\n## Vehicles\n${catalog.vehicles.map((v) => `${v.name}: ${v.description} ${v.seating}`).join('\n')}\n\n## Trips\n${trips.map((trip) => `${trip.name}\n${trip.url}\n${trip.note}\n${trip.places.join('\n')}\n${trip.days.map((day) => `${day.title}\n${day.places.join('\n')}`).join('\n')}`).join('\n\n')}\n\n## Common questions\n${faq.map(([q, a]) => `${q}\n${a}`).join('\n\n')}\n`;
  return { pages, catalog, homeCards, faqHtml, faq, llms, fullText, trips, footer };
}
