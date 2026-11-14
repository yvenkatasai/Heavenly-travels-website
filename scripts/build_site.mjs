import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src', 'site');
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
  const content = fs.readFileSync(path.join(source, filename), 'utf8');
  page = page.replaceAll(`/*__${token}__*/`, content);
  vehiclePage = vehiclePage.replaceAll(`/*__${token}__*/`, content);
}

const tours = fs.readFileSync(path.join(source, 'tours.js'), 'utf8');
const credits = fs.readFileSync(path.join(source, 'credits.html'), 'utf8');
page = page.replace('/*__TOURS__*/', tours).replace('{{CREDITS}}', credits);
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

if (page.includes('/*__') || page.includes('{{') || vehiclePage.includes('/*__')) {
  throw new Error('Build templates contain unresolved placeholders.');
}

fs.writeFileSync(path.join(output, 'index.html'), page);
fs.writeFileSync(path.join(output, 'vehicles.html'), vehiclePage);
fs.cpSync(path.join(source, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log(
  `Heavenly ${version} built: ${output} (${new Intl.NumberFormat('en-US').format(Buffer.byteLength(page))} HTML bytes)`,
);
