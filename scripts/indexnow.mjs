import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const digest = (text) => createHash('sha256').update(text).digest('hex');

export function sitemapUrls(xml, origin) {
  const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
  assert.ok(urls.length > 0 && urls.length <= 10000, 'Sitemap must contain 1–10,000 URLs.');
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, origin, `Off-site sitemap URL: ${value}`);
    assert.equal(url.protocol, 'https:');
    assert.ok(!url.search && !url.hash && !url.username && !url.password);
    assert.ok(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(url.pathname));
    assert.ok(!['/vehicles', '/404'].includes(url.pathname), 'Booking/404 URLs are not indexable.');
  }
  return urls;
}

export function changedPages(pages, previous = {}) {
  return pages.filter((page) => previous[page.url] !== page.hash);
}

export function requireAccepted(status) {
  assert.ok(
    [200, 202].includes(status),
    `IndexNow returned HTTP ${status}; no receipt saved. Do not retry repeatedly.`,
  );
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(
    args.every((arg) => arg === '--submit'),
    'Use --submit to notify Bing; omit it for a dry run.',
  );
  const site = JSON.parse(fs.readFileSync(path.join(root, 'src/site/site.config.json')));
  const { key } = JSON.parse(fs.readFileSync(path.join(root, 'src/site/indexnow.json')));
  assert.match(key, /^[a-zA-Z0-9-]{8,128}$/);
  const origin = new URL(site.url).origin;
  assert.equal(origin, site.url);
  const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
  const urls = sitemapUrls(sitemap, origin);
  const pages = urls.map((url) => {
    const pathname = new URL(url).pathname;
    const file = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`;
    const html = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
    assert.ok(html.includes(`rel="canonical" href="${url}"`), `Missing canonical: ${url}`);
    assert.ok(!/content="[^\"]*noindex/i.test(html), `Noindex page: ${url}`);
    return { url, hash: digest(html) };
  });
  const stateFile = path.join(root, 'artifacts/deployment/indexnow-receipt.json');
  const previous = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile)) : {};
  const changed = changedPages(pages, previous.origin === origin ? previous.hashes : {});
  console.log(`${changed.length} new/changed canonical pages (${pages.length} in sitemap).`);
  for (const page of changed) console.log(page.url);
  if (!args.includes('--submit')) {
    console.log('Dry run only. Nothing was sent. Run indexnow:submit after deploying these files.');
    return;
  }
  if (!changed.length) return;
  const request = (url) => fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(25000) });
  const keyLocation = `${origin}/${key}.txt`;
  const keyResponse = await request(keyLocation);
  assert.equal(keyResponse.status, 200, 'Deploy the ownership key before submitting.');
  assert.equal((await keyResponse.text()).trim(), key, 'Live ownership key mismatch.');
  const liveSitemap = await request(`${origin}/sitemap.xml`);
  assert.equal(liveSitemap.status, 200);
  assert.deepEqual(
    sitemapUrls(await liveSitemap.text(), origin),
    urls,
    'Deploy this sitemap first.',
  );
  // Only report pages that are already live. Stop on redirects, challenges or stale deployments.
  for (let start = 0; start < changed.length; start += 4) {
    await Promise.all(
      changed.slice(start, start + 4).map(async (page) => {
        const response = await request(page.url);
        assert.equal(response.status, 200, `Live URL unavailable: ${page.url}`);
        assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'));
        assert.equal(
          digest(await response.text()),
          page.hash,
          `Live page differs from this build: ${page.url}`,
        );
      }),
    );
  }
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(origin).host,
      key,
      keyLocation,
      urlList: changed.map((p) => p.url),
    }),
    signal: AbortSignal.timeout(30000),
    redirect: 'error',
  });
  requireAccepted(response.status);
  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(
    stateFile,
    JSON.stringify(
      {
        origin,
        submittedAt: new Date().toISOString(),
        status: response.status,
        submittedUrls: changed.map((p) => p.url),
        hashes: Object.fromEntries(pages.map((p) => [p.url, p.hash])),
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `IndexNow HTTP ${response.status}: URLs received${response.status === 202 ? ', ownership validation pending' : ''}. This does not confirm indexing or ranking.`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
