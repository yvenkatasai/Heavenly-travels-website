import fs from 'node:fs';
import assert from 'node:assert/strict';
const baseline = JSON.parse(fs.readFileSync(new URL('./preserved-copy.json', import.meta.url)));
const { travelPlanningContent } = await import('../../../scripts/travel-planning-content.mjs');
for (const [pathname, blocks] of Object.entries(baseline)) {
  const response = await fetch(`https://heavenlytoursandtravels.com/${pathname}`, {
    signal: AbortSignal.timeout(30000),
  });
  assert.equal(response.status, 200, pathname);
  const html = await response.text();
  const id = travelPlanningContent[`/${pathname}`].match(/id="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${id}"`), pathname);
  for (const block of blocks) {
    if (!block.includes('content-updated')) assert.ok(html.includes(block), pathname);
  }
  assert.ok(html.includes('<time datetime="2026-11-26">'), pathname);
  console.log(`PASS LIVE: ${pathname}: addition, original copy and actual review date.`);
}
