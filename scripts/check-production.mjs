import assert from 'node:assert/strict';
import fs from 'node:fs';

const site = JSON.parse(fs.readFileSync(new URL('../src/site/site.config.json', import.meta.url)));
const origin = site.url;
let failures = 0;
async function check(label, operation) {
  try {
    await operation();
    console.log(`PASS ${label}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${label}: ${error.message}`);
  }
}
const request = (url) => fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });

await check('HTTPS homepage, canonical URL and browser security headers', async () => {
  const response = await request(`${origin}/`);
  assert.equal(response.status, 200);
  for (const header of [
    'content-security-policy',
    'strict-transport-security',
    'x-content-type-options',
    'x-frame-options',
    'referrer-policy',
    'permissions-policy',
  ]) {
    assert.ok(response.headers.get(header), `Missing ${header}`);
  }
  const html = await response.text();
  assert.ok(html.includes(`rel="canonical" href="${origin}/"`));
  const data = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  assert.equal(data.telephone, site.telephone);
  assert.equal(data.url, `${origin}/`);
  assert.ok(html.includes('fetchpriority="low"'));
});
await check('HTTP upgrades to HTTPS', async () => {
  const response = await request(origin.replace('https:', 'http:') + '/');
  assert.ok([301, 308].includes(response.status));
  assert.equal(response.headers.get('location'), `${origin}/`);
});
await check('WWW redirect preserves the selected package and path', async () => {
  const response = await request(
    origin.replace('https://', 'https://www.') + '/vehicles?package=days-3',
  );
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), `${origin}/vehicles?package=days-3`);
});
await check('Vehicle selection is available and not indexed', async () => {
  const response = await request(`${origin}/vehicles?package=days-3`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.ok(html.includes('content="noindex, follow"'));
  assert.ok(html.includes('booking-flow-root'));
});
await check('Crawler instructions and sitemap agree on the main domain', async () => {
  const robots = await request(`${origin}/robots.txt`);
  const sitemap = await request(`${origin}/sitemap.xml`);
  assert.equal(robots.status, 200);
  assert.equal(sitemap.status, 200);
  assert.ok((await robots.text()).includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok((await sitemap.text()).includes(`<loc>${origin}/</loc>`));
});
await check('Missing pages return the helpful 404 instead of a soft 200', async () => {
  const response = await request(`${origin}/configuration-check-missing-page`);
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.ok(html.includes('PAGE NOT FOUND'));
  assert.ok(html.includes('Explore trips'));
});
await check('Mobile hero image has the correct type and cache policy', async () => {
  const response = await request(origin + '/assets/tirumala-hero-mobile-fast.webp');
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type').includes('image/webp'));
  assert.ok(response.headers.get('cache-control').includes('max-age=86400'));
  assert.ok((await response.arrayBuffer()).byteLength > 10000);
});
await check('Public business details and all 13 trip pages are available', async () => {
  const response = await request(`${origin}/travel-catalog.json`);
  assert.equal(response.status, 200);
  const catalog = await response.json();
  assert.equal(catalog.trips.length, 13);
  assert.equal(catalog.business.owner, site.ownerName);
  assert.equal(catalog.business.email, site.email);
  assert.equal(catalog.booking.paymentOnWebsite, false);
  const about = await request(`${origin}/about`);
  assert.equal(about.status, 200);
  assert.ok((await about.text()).includes(site.email));
  for (const trip of catalog.trips) {
    const page = await request(trip.url);
    assert.equal(page.status, 200, trip.url);
    const html = await page.text();
    assert.ok(html.includes('TouristTrip'), trip.url);
    assert.ok(html.includes(`/vehicles?package=${trip.id}`), trip.url);
    assert.ok(html.includes('We do not book tickets for you'), trip.url);
  }
});
await check('Booking rules, readable FAQs and agent information are available', async () => {
  for (const path of [
    '/booking-information',
    '/questions',
    '/privacy',
    '/llms.txt',
    '/llms-full.txt',
  ]) {
    const response = await request(origin + path);
    assert.equal(response.status, 200, path);
    assert.ok((await response.text()).includes(site.ownerName), path);
  }
});
process.exitCode = failures ? 1 : 0;
