import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';
import { prepareAgentContent } from './build-agent-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'site');
const site = JSON.parse(fs.readFileSync(path.join(source, 'site.config.json'), 'utf8'));
const siteOrigin = new URL(site.url).origin;
if (site.url !== siteOrigin || !site.url.startsWith('https://')) {
  throw new Error('site.config.json must use an HTTPS origin without a trailing slash.');
}
const version = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
const outputArgument = process.argv.indexOf('--output');
const outputName = outputArgument === -1 ? 'dist' : process.argv[outputArgument + 1];
if (!outputName || outputName.startsWith('--')) {
  throw new Error('Provide a directory after --output.');
}
const output = path.resolve(root, outputName);

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return (
    relative === '' ||
    (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`))
  );
}

if (!isWithin(root, output) || output === root) {
  throw new Error('Build output must stay inside this project.');
}

const protectedPaths = [
  'src',
  'scripts',
  'docs',
  'tests',
  'artifacts',
  'node_modules',
  '.git',
  '.wrangler',
].map((name) => path.join(root, name));
if (protectedPaths.some((directory) => isWithin(directory, output))) {
  throw new Error('Build output cannot replace source, tooling, docs, tests, or dependencies.');
}
const protectedRootFiles = new Set([
  '.gitignore',
  'AGENTS.md',
  'components.json',
  'package-lock.json',
  'package.json',
  'README.md',
  'tsconfig.json',
  'version.json',
  'wrangler.jsonc',
]);
if (path.dirname(output) === root && protectedRootFiles.has(path.basename(output).toLowerCase())) {
  throw new Error('Build output cannot replace project configuration or documentation.');
}
if (fs.existsSync(output) && !fs.statSync(output).isDirectory()) {
  throw new Error('Build output must be a directory.');
}

// The build recreates its output, so all source and protected paths must be rejected above.
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

const bookingBuild = spawnSync(
  process.execPath,
  [path.join(root, 'scripts', 'build-booking.mjs')],
  {
    cwd: root,
    env: { ...process.env, SITE_BUILD_OUTPUT: output },
    stdio: 'inherit',
  },
);
if (bookingBuild.status !== 0) {
  throw new Error(`Booking build failed with exit code ${bookingBuild.status ?? 'unknown'}.`);
}

const agentContent = await prepareAgentContent(source, site);
let page = fs.readFileSync(path.join(source, 'page.html'), 'utf8');
let vehiclePage = fs.readFileSync(path.join(source, 'vehicles.html'), 'utf8');
const sourceFiles = [
  ['CSS', 'style.css'],
  ['THEME', 'travel-theme.css'],
  ['HERITAGE', 'heritage.css'],
  ['PILGRIMAGE_CSS', 'pilgrimage.css'],
  ['BOOKING_CSS', 'booking.css'],
  ['FINAL_FLOW_CSS', 'final-flow.css'],
  ['COMPACT_CSS', 'compact-layout.css'],
  ['HIERARCHY_CSS', 'package-hierarchy.css'],
  ['DIRECT_FLOW_CSS', 'direct-package-flow.css'],
  ['SIMPLE_CLOSING_CSS', 'simple-closing.css'],
  ['MOBILE_NAV_CSS', 'mobile-nav.css'],
  ['COMPLETE_PACKAGE_CSS', 'complete-package.css'],
  ['HERO_FIT_CSS', 'hero-fit.css'],
  ['MOBILE_NAV_JS', 'mobile-nav.js'],
  ['PILGRIMAGE_JS', 'pilgrimage.js'],
  ['APP', 'app.js'],
  ['EFFECTS', 'heritage-effects.js'],
  ['DATA', 'data.js'],
  ['INTRO', 'intro.js'],
  ['DOT_FIELD', 'dot-field.js'],
];

for (const [token, filename] of sourceFiles) {
  const content =
    token === 'APP'
      ? (
          await build({
            entryPoints: [path.join(source, filename)],
            bundle: true,
            write: false,
            format: 'iife',
            target: 'es2022',
          })
        ).outputFiles[0].text
      : fs.readFileSync(path.join(source, filename), 'utf8');
  page = page.replaceAll(`/*__${token}__*/`, content);
  vehiclePage = vehiclePage.replaceAll(`/*__${token}__*/`, content);
}

const tours = fs.readFileSync(path.join(source, 'tours.js'), 'utf8');
const credits = fs.readFileSync(path.join(source, 'credits.html'), 'utf8');
page = page.replace('/*__TOURS__*/', tours).replace('{{CREDITS}}', credits);
page = page
  .replace('<!--__HOME_CARDS__-->', agentContent.homeCards)
  .replace('<!--__FAQ_HTML__-->', agentContent.faqHtml);

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
}
function addMetadata(html, pathname, title, description, index) {
  const url = siteOrigin + pathname;
  const meta = (name, value, property = false) =>
    `<meta ${property ? 'property' : 'name'}="${name}" content="${escapeAttribute(value)}" />`;
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" type="application/json" href="${siteOrigin}/travel-catalog.json" title="Temple trip catalog" />`,
    meta('robots', index ? 'index, follow, max-image-preview:large' : 'noindex, follow'),
    meta('og:type', 'website', true),
    meta('og:site_name', site.name, true),
    meta('og:title', title, true),
    meta('og:description', description, true),
    meta('og:url', url, true),
    meta('og:locale', 'en_IN', true),
    meta('og:image', siteOrigin + site.image, true),
    meta('og:image:alt', site.imageAlt, true),
    meta('twitter:card', 'summary_large_image'),
    meta('twitter:title', title),
    meta('twitter:description', description),
    meta('twitter:image', siteOrigin + site.image),
    meta('twitter:image:alt', site.imageAlt),
  ];
  if (index) {
    const business = {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      '@id': `${siteOrigin}/#business`,
      name: site.name,
      url: `${siteOrigin}/`,
      description: site.description,
      telephone: site.telephone,
      email: site.email,
      location: { '@type': 'Place', name: site.baseLocation },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'trip planning and booking',
        telephone: site.telephone,
        email: site.email,
        url: `${siteOrigin}/booking-information`,
      },
      image: siteOrigin + site.image,
      areaServed: site.areaServed,
    };
    // JSON-LD is non-executable data; escape markup before inserting it into HTML.
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(business).replaceAll('<', '\\u003c')}</script>`,
    );
  }
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttribute(title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, meta('description', description))
    .replace('<!--__SEO__-->', tags.join('\n'));
}
page = addMetadata(page, '/', site.title, site.description, true);
vehiclePage = addMetadata(
  vehiclePage,
  '/vehicles',
  `Choose your vehicle — ${site.name}`,
  'Choose an AC car, SUV, Tempo Traveller, mini bus or bus for your selected temple trip.',
  false,
);
for (const asset of ['booking-flow.js', 'booking-tailwind.css']) {
  const digest = createHash('sha256')
    .update(fs.readFileSync(path.join(output, 'assets', asset)))
    .digest('hex')
    .slice(0, 12);
  for (const html of ['page', 'vehiclePage']) {
    const value = html === 'page' ? page : vehiclePage;
    const updated = value.replaceAll(`assets/${asset}"`, `assets/${asset}?v=${digest}"`);
    if (html === 'page') page = updated;
    else vehiclePage = updated;
  }
}

if (
  page.includes('/*__') ||
  page.includes('{{') ||
  vehiclePage.includes('/*__') ||
  page.includes('<!--__') ||
  vehiclePage.includes('<!--__')
) {
  throw new Error('Build templates contain unresolved placeholders.');
}

async function extractRuntime(html) {
  for (const [tag, loader] of [
    ['style', 'css'],
    ['script', 'js'],
  ]) {
    const pattern = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
    for (const match of [...html.matchAll(pattern)]) {
      // Inline styles used document-relative URLs; external styles must keep the same asset root.
      const input =
        loader === 'css' ? match[1].replace(/url\((['"]?)assets\//g, 'url($1/assets/') : match[1];
      const { code } = await transform(input, {
        loader,
        minify: true,
        target: ['es2020', 'safari14'],
        legalComments: 'inline',
      });
      const digest = createHash('sha256').update(code).digest('hex').slice(0, 12);
      const name = `site-${digest}.${loader}`;
      fs.writeFileSync(path.join(output, 'assets', name), code);
      html = html.replace(
        match[0],
        loader === 'css'
          ? `<link rel="stylesheet" href="/assets/${name}" />`
          : `<script src="/assets/${name}" defer></script>`,
      );
    }
  }
  return html;
}
page = await extractRuntime(page);
vehiclePage = await extractRuntime(vehiclePage);

fs.writeFileSync(path.join(output, 'index.html'), page);
fs.writeFileSync(path.join(output, 'vehicles.html'), vehiclePage);
for (const document of agentContent.pages) {
  const file = path.join(output, `${document.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    await extractRuntime(
      addMetadata(document.html, document.path, document.title, document.description, true),
    ),
  );
}
fs.writeFileSync(
  path.join(output, 'travel-catalog.json'),
  JSON.stringify(agentContent.catalog, null, 2) + '\n',
);
fs.writeFileSync(path.join(output, 'llms.txt'), agentContent.llms);
fs.writeFileSync(path.join(output, 'llms-full.txt'), agentContent.fullText);
fs.writeFileSync(
  path.join(output, '404.html'),
  await extractRuntime(fs.readFileSync(path.join(source, '404.html'), 'utf8')),
);
fs.writeFileSync(
  path.join(output, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
);
fs.writeFileSync(
  path.join(output, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', ...agentContent.pages.map((page) => page.path)].map((pathname) => `  <url><loc>${siteOrigin}${pathname}</loc></url>`).join('\n')}\n</urlset>\n`,
);
fs.cpSync(path.join(source, 'assets'), path.join(output, 'assets'), { recursive: true });
fs.copyFileSync(path.join(source, '_headers'), path.join(output, '_headers'));
console.log(
  `Heavenly ${version} built: ${output} (${new Intl.NumberFormat('en-US').format(Buffer.byteLength(page))} HTML bytes)`,
);
