import fs from 'node:fs';
import assert from 'node:assert/strict';
const baseline = JSON.parse(fs.readFileSync(new URL('./preserved-copy.json', import.meta.url)));
let count = 0;
for (const [pathname, blocks] of Object.entries(baseline)) {
  const html = fs.readFileSync(new URL(`../../../dist/${pathname}.html`, import.meta.url), 'utf8');
  for (const block of blocks) {
    if (block.includes('content-updated')) continue;
    assert.ok(html.includes(block), `Existing copy changed: ${pathname}: ${block}`);
    count++;
  }
}
console.log(`PASS: ${count} existing text blocks preserved across six pages.`);
