import assert from 'node:assert/strict';
import test from 'node:test';
import { changedPages, requireAccepted, sitemapUrls } from '../scripts/indexnow.mjs';

const origin = 'https://heavenlytoursandtravels.com';
const xml = (...paths) =>
  `<urlset>${paths.map((p) => `<url><loc>${p}</loc></url>`).join('')}</urlset>`;
test('only canonical HTTPS content URLs enter the submission', () => {
  assert.deepEqual(
    sitemapUrls(xml(`${origin}/`, `${origin}/trips/express`, `${origin}/`), origin),
    [`${origin}/`, `${origin}/trips/express`],
  );
  for (const url of [
    'https://example.com/',
    `${origin}/vehicles`,
    `${origin}/404`,
    `${origin}/?name=private`,
    `${origin}/#booking`,
    `${origin}/../vehicles`,
    `${origin}/assets/photo.webp`,
  ]) {
    assert.throws(() => sitemapUrls(xml(url), origin));
  }
  assert.throws(() => sitemapUrls('<urlset/>', origin));
});
test('unchanged pages are not repeatedly submitted', () => {
  const pages = [
    { url: `${origin}/`, hash: 'new' },
    { url: `${origin}/about`, hash: 'same' },
  ];
  assert.deepEqual(changedPages(pages, { [`${origin}/`]: 'old', [`${origin}/about`]: 'same' }), [
    pages[0],
  ]);
  assert.equal(
    changedPages(pages, Object.fromEntries(pages.map((p) => [p.url, p.hash]))).length,
    0,
  );
});
test('errors and throttling never count as successful submissions', () => {
  for (const status of [200, 202]) assert.doesNotThrow(() => requireAccepted(status));
  for (const status of [301, 400, 403, 422, 429, 500]) assert.throws(() => requireAccepted(status));
});
