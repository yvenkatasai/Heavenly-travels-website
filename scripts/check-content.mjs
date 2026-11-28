import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { expectedSitemapUrls, loadTrips, staticPages } from './site-paths.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site/site.config.json')));
const catalog = JSON.parse(read('travel-catalog.json'));
const sitemap = read('sitemap.xml');
const home = read('index.html');
const packages = await loadTrips();
assert.deepEqual(
  catalog.trips.map((trip) => trip.id).sort(),
  packages.map((trip) => trip.id).sort(),
);
assert.equal(catalog.business.owner, site.ownerName);
assert.equal(catalog.business.email, site.email);
assert.deepEqual(catalog.booking.groupSize, { minimum: 2, maximum: 200 });
assert.equal(catalog.booking.paymentOnWebsite, false);
assert.equal(catalog.booking.humanConfirmationRequired, true);
assert.ok(catalog.booking.tirumalaTicketPolicy.includes('We do not book tickets'));
assert.ok(
  !/"(?:price|priceCurrency|aggregateRating|reviewRating)"|InStock/.test(JSON.stringify(catalog)),
);
assert.equal((home.match(/data-package-index=/g) || []).length, 7);
assert.equal((home.match(/class="faq-item"/g) || []).length, 8);

const documents = [...staticPages];
for (const trip of catalog.trips) {
  const pathname = new URL(trip.url).pathname;
  const file = `${pathname.slice(1)}.html`;
  const html = read(file);
  assert.ok(sitemap.includes(`<loc>${trip.url}</loc>`), trip.name);
  assert.ok(html.includes(`/vehicles?package=${trip.id}`), trip.name);
  assert.ok(html.includes('We do not book tickets for you'), trip.name);
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  const schema = schemas.find((data) => data['@type']?.includes('TouristTrip'));
  assert.ok(schema, `Missing trip schema: ${trip.name}`);
  assert.deepEqual(
    schema.itinerary.itemListElement.map((item) => item.item.name),
    [...trip.stops, ...trip.days.flatMap((day) => day.places)],
  );
  documents.push(file);
}
const uniqueTitles = new Set();
const uniqueDescriptions = new Set();
for (const file of documents) {
  const html = read(file);
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
  assert.ok(title && !uniqueTitles.has(title), `Missing or duplicate title: ${file}`);
  assert.ok(
    description && !uniqueDescriptions.has(description),
    `Missing or duplicate description: ${file}`,
  );
  uniqueTitles.add(title);
  uniqueDescriptions.add(description);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, file);
  const schemas = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1]));
  if (file !== 'vehicles.html') {
    const business = schemas.find((schema) => schema['@type'] === 'TravelAgency');
    assert.deepEqual(business?.sameAs, [site.googleMapsUrl], file);
    assert.deepEqual(business.openingHoursSpecification, site.openingHoursSpecification, file);
    assert.ok(html.includes(site.openingHoursLabel), `Hours must be visible: ${file}`);
    assert.ok(!business.aggregateRating && !business.review, 'Do not invent business ratings');
  }
  if (file === 'index.html') {
    const website = schemas.find((schema) => schema['@type'] === 'WebSite');
    assert.equal(website?.name, site.name);
    assert.equal(website?.url, `${site.url}/`);
  } else if (file !== 'vehicles.html') {
    const breadcrumb = schemas.find((schema) => schema['@type'] === 'BreadcrumbList');
    assert.ok(breadcrumb, `Missing breadcrumbs: ${file}`);
    const trail = breadcrumb.itemListElement;
    assert.deepEqual(
      trail.map((item) => item.position),
      trail.map((_, i) => i + 1),
    );
    assert.equal(trail[0].item, `${site.url}/`);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.equal(trail.at(-1).item, canonical);
    if (file.startsWith('trips/')) {
      assert.equal(trail[1].item, `${site.url}/trips`);
      assert.ok(html.includes('<a href="/trips">Trips</a>'));
    }
  }
  assert.ok(!html.includes('<!--__'), `Unresolved placeholder: ${file}`);
  assert.ok(!/<script>([\s\S]*?)<\/script>/.test(html), `Inline executable script: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|mailto:|tel:|#|data:)/.test(target)) continue;
    const url = new URL(target, `${site.url}/${file}`);
    let local = path.join(dist, decodeURIComponent(url.pathname));
    if (url.pathname === '/') local = path.join(dist, 'index.html');
    assert.ok(
      fs.existsSync(local) || fs.existsSync(`${local}.html`),
      `Broken local link ${target} in ${file}`,
    );
  }
}
for (const name of ['cormorant-garamond.woff2', 'dm-sans.woff2'])
  assert.ok(fs.existsSync(path.join(dist, 'assets/fonts', name)));
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(
  sitemapUrls.sort(),
  [...expectedSitemapUrls(site.url, catalog.trips.map((trip) => trip.url))].sort(),
);
assert.ok(read('about.html').includes(site.email));
assert.ok(read('booking-information.html').includes('Cancellations, refunds &amp; date changes'));
assert.ok(read('vehicles.html').includes('noindex, follow'));
assert.ok(read('llms-full.txt').includes(site.ownerName));
assert.ok(read('tirupati-car-rentals.html').includes('Self-drive car rentals'));
assert.ok(read('tirupati-tour-packages.html').includes('What is the package cost?'));
assert.ok(read('tirumala-tour-packages.html').includes('What is the Tirumala package cost?'));
assert.ok(read('tirupati-temples.html').includes('How many temples are covered?'));
assert.ok(home.includes('id="day-packages"'));
assert.ok(!home.includes('Preparing one-to-five-day trips'));
for (const trip of catalog.trips.filter((trip) => trip.durationDays)) {
  assert.ok(
    home.includes(`href="${new URL(trip.url).pathname}"`),
    `Day trip needs a raw-HTML link: ${trip.name}`,
  );
  const html = read(`${new URL(trip.url).pathname.slice(1)}.html`);
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)?.[1];
  assert.ok(description.length > 100, `Day trip needs a useful route description: ${trip.name}`);
}
for (const file of ['booking-information.html', 'tirumala-tour-packages.html']) {
  assert.ok(read(file).includes('https://ttdevasthanams.ap.gov.in/'), file);
  assert.ok(read(file).includes('https://www.tirumala.org/'), file);
}
assert.ok(read('llms.txt').includes('/tirupati-car-rentals'));
assert.ok(read('about.html').includes(`href="${site.googleMapsUrl}"`));
assert.ok(read('about.html').includes(`href="${site.googleReviewUrl}"`));
for (const area of site.localServiceAreas) assert.ok(read('about.html').includes(area));
for (const slug of ['three', 'four', 'five']) {
  const html = read(`trips/${slug}-day-trip.html`);
  assert.equal((html.match(/id="stay-plan"/g) || []).length, 1);
  if (slug !== 'three') assert.ok(html.includes('Day 2: Night stay at Tiruvannamalai.'));
  else assert.ok(!html.includes('Day 2: Night stay at Tiruvannamalai.'));
}
for (const [file, section] of [
  ['tirupati-tour-packages.html', 'compare-trips'],
  ['tirumala-tour-packages.html', 'family-checklist'],
  ['tirupati-car-rentals.html', 'rental-checklist'],
  ['tirupati-temples.html', 'temple-locations'],
  ['trips/south-indian-package.html', 'south-india-planning'],
  ['booking-information.html', 'quote-checklist'],
]) {
  const html = read(file);
  assert.equal((html.match(new RegExp(`id="${section}"`, 'g')) || []).length, 1, file);
  for (const [, href] of html.matchAll(/href="(\/[^"?]*#[^"]+)"/g)) {
    const [pathname, fragment] = href.split('#');
    const target = read(pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`);
    assert.ok(target.includes(`id="${fragment}"`), `Broken planning link: ${file} ${href}`);
  }
}
const reviewedDates = JSON.parse(fs.readFileSync(path.join(root, 'src/site/content-dates.json')));
for (const [pathname, date] of Object.entries(reviewedDates)) {
  const html = read(pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`);
  assert.ok(html.includes(`<time datetime="${date}">`), pathname);
  assert.ok(html.includes(`"dateModified":"${date}"`), pathname);
}
const { key: indexNowKey } = JSON.parse(fs.readFileSync(path.join(root, 'src/site/indexnow.json')));
assert.match(indexNowKey, /^[a-zA-Z0-9-]{8,128}$/);
assert.equal(read(`${indexNowKey}.txt`).trim(), indexNowKey);
assert.ok(read('index.html').includes(site.title.replaceAll('&', '&amp;')));
console.log(
  `PASS: ${catalog.trips.length} trips, ${sitemapUrls.length} indexable URLs, approved answers, honest content dates, booking links, local assets and schema.`,
);
