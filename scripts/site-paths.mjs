// Shared page inventory so content and production checks agree without hardcoded counts.
// Trip data comes from src/booking/data.ts (PACKAGES), the same source the build uses,
// so adding or removing a trip updates the checks automatically.
import fs from 'node:fs';
import { transform } from 'esbuild';

// Pages assembled for every build, in check order. `vehicles.html` is noindex and stays out of the sitemap.
export const staticPages = [
  'index.html',
  'about.html',
  'trips.html',
  'booking-information.html',
  'questions.html',
  'privacy.html',
  'vehicles.html',
  'terms.html',
  'tirupati-tour-packages.html',
  'tirumala-tour-packages.html',
  'tirupati-car-rentals.html',
  'tirupati-temples.html',
];
export const noindexPages = new Set(['vehicles.html']);

export async function loadTrips() {
  const source = fs.readFileSync(new URL('../src/booking/data.ts', import.meta.url), 'utf8');
  const { code } = await transform(source, {
    loader: 'ts',
    format: 'esm',
    target: 'es2020',
  });
  const data = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
  return data.PACKAGES;
}

export function expectedSitemapUrls(siteUrl, tripUrls) {
  return new Set([
    ...tripUrls,
    ...staticPages
      .filter((file) => !noindexPages.has(file))
      .map((file) =>
        file === 'index.html' ? `${siteUrl}/` : `${siteUrl}/${file.replace(/\.html$/, '')}`,
      ),
  ]);
}
