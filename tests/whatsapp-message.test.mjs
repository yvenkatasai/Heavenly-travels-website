import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { transform } from 'esbuild';

async function importTs(relative) {
  const { code } = await transform(await fs.readFile(new URL(relative, import.meta.url), 'utf8'), {
    loader: 'ts',
    format: 'esm',
  });
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const { formatTravelDate, formatWhatsAppEnquiry, whatsAppEnquiryUrl } = await importTs(
  '../src/lib/whatsapp-message.ts',
);
const { PACKAGES } = await importTs('../src/booking/data.ts');
const base = { people: '4', date: '2026-11-25', accommodation: 'Exclusive' };

test('complete trip preserves sections, all seven temples and approved ending', () => {
  const trip = PACKAGES.find((trip) => trip.id === 'seven-temple');
  const message = formatWhatsAppEnquiry({
    ...base,
    service: 'Temple trip',
    trip: trip.name,
    name: 'Example customer',
    pickup: 'RENIGUNTA AIRPORT',
    vehicle: 'Sedan',
    travelStyle: 'Budget-friendly',
    places: trip.places,
    completeSevenTemples: true,
    includedExtras: ['Pickup and drop for this trip.', 'Help planning temple visits.'],
  });
  assert.ok(
    message.includes(
      '\n\n*TRIP DETAILS*\nTrip: Complete 7-Temple Trip\nTravel date: 25 Nov 2026\nTravellers: 4 people\nPickup: RENIGUNTA AIRPORT',
    ),
  );
  assert.ok(
    message.includes(
      '\n\n*TRAVEL PREFERENCES*\nVehicle: Sedan\nTravel style: Budget-friendly\nAccommodation: Exclusive',
    ),
  );
  assert.ok(message.includes('*TEMPLES COVERED — ALL 7 INCLUDED*'));
  assert.ok(message.includes('7. Sri Arunachaleswarar Temple — Tiruvannamalai'));
  assert.ok(
    message.includes(
      '\n\n*INCLUDED EXTRAS*\nPickup and drop for this trip.\nHelp planning temple visits.',
    ),
  );
  assert.ok(message.includes('\n\n*CUSTOMER DETAILS*\nName: Example customer'));
  assert.ok(
    message.endsWith(
      'Please confirm availability, the total quote, hotel options and pickup arrangements.',
    ),
  );
  assert.ok(!message.includes('Darshan tickets: guidance only.'));
  assert.ok(!message.includes('do not book darshan tickets'));
});

for (const trip of PACKAGES) {
  test(`${trip.name}: every stop and day is included without description duplication`, () => {
    const message = formatWhatsAppEnquiry({
      ...base,
      trip: trip.name,
      places: trip.places,
      days: trip.days,
    });
    for (const stop of [...trip.places, ...trip.days.flatMap((day) => day.places)])
      assert.ok(message.includes(stop), stop);
    for (const day of trip.days) assert.ok(message.includes(`${day.title}\n1. ${day.places[0]}`));
    if (trip.days.length > 1) assert.ok(message.includes(`\n\n${trip.days[1].title}\n`));
    assert.ok(!message.includes(trip.note));
    assert.ok(!message.includes('*INCLUDED EXTRAS*'));
  });
}

test('calendar dates, flexible dates and undecided dates are readable', () => {
  assert.equal(formatTravelDate('2026-11-25'), '25 Nov 2026');
  assert.equal(formatTravelDate('2026-01-01'), '1 Jan 2026');
  assert.equal(formatTravelDate('2028-02-29'), '29 Feb 2028');
  assert.equal(formatTravelDate('2026-02-30'), 'Not decided yet');
  assert.equal(formatTravelDate(), 'Not decided yet');
  assert.equal(formatTravelDate('2026-11-25', true), 'Flexible / to be discussed');
});

test('custom routes retain optional customer details and multiline requests', () => {
  const message = formatWhatsAppEnquiry({
    ...base,
    trip: 'Custom temple route',
    flexibleDate: true,
    vehicle: 'Please help me choose',
    name: ' Family & Friends ',
    phone: '+91 00000 00000',
    places: ['Sri Kalahasteeswara Temple', 'Kanipakam'],
    pickup: 'Station',
    dropoff: 'Hotel',
    notes: 'Older travellers\nPlease allow rest breaks.',
  });
  assert.ok(message.includes('Travel date: Flexible / to be discussed'));
  assert.ok(message.includes('Drop-off: Hotel'));
  assert.ok(message.includes('Name: Family & Friends\nPhone: +91 00000 00000'));
  assert.ok(message.includes('*ADDITIONAL REQUESTS*\nOlder travellers\nPlease allow rest breaks.'));
});

for (const service of ['Flight tickets', 'Hotel stays']) {
  test(`${service}: relevant locations and no temple section`, () => {
    const flight = service === 'Flight tickets';
    const message = formatWhatsAppEnquiry({
      ...base,
      service,
      pickupLabel: flight ? 'Departure' : 'Hotel destination',
      pickup: 'Chennai',
      dropoffLabel: flight ? 'Destination' : 'Preferred hotel',
      dropoff: flight ? 'Hyderabad' : 'Please help me choose',
    });
    assert.ok(message.includes(`*SERVICE DETAILS*\nService: ${service}`));
    assert.ok(message.includes(`${flight ? 'Departure' : 'Hotel destination'}: Chennai`));
    assert.ok(!message.includes('*TEMPLES COVERED'));
    assert.ok(!message.includes('*CUSTOMER DETAILS*'));
    assert.ok(!message.includes('undefined'));
  });
}

test('WhatsApp URL round-trips formatting and Unicode without sending anything', () => {
  const message = formatWhatsAppEnquiry({
    ...base,
    trip: 'Temple trip',
    name: 'శ్రీ కుటుంబం & friends + family',
    notes: 'Pickup #2? 100% ready',
  });
  const url = new URL(whatsAppEnquiryUrl(message));
  assert.equal(url.origin + url.pathname, 'https://wa.me/919700181493');
  assert.equal(url.searchParams.get('text'), message);
  assert.ok(!url.hash);
  assert.ok(message.includes('\n\n*TRAVEL PREFERENCES*'));
});
