import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8');
const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site/site.config.json')));
const catalog = JSON.parse(read('travel-catalog.json'));
const sitemap = read('sitemap.xml');
const home = read('index.html');
assert.equal(catalog.trips.length, 13);
assert.equal(new Set(catalog.trips.map((trip) => trip.id)).size, 13);
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

const documents = [
  'index.html',
  'about.html',
  'trips.html',
  'booking-information.html',
  'questions.html',
  'privacy.html',
  'vehicles.html',
];
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
for (const file of documents) {
  const html = read(file);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, file);
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
assert.equal((sitemap.match(/<loc>/g) || []).length, 19);
assert.ok(!sitemap.includes('/vehicles'));
assert.ok(read('about.html').includes(site.email));
assert.ok(read('booking-information.html').includes('Cancellations, refunds &amp; date changes'));
assert.ok(read('vehicles.html').includes('noindex, follow'));
assert.ok(read('llms-full.txt').includes(site.ownerName));
console.log(
  'PASS: 13 trips, 19 indexable URLs, booking links, local assets, JSON-LD, owner facts, static cards/FAQs and enquiry-only boundaries.',
);
