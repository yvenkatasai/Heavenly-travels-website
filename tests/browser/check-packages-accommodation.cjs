const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');

const root = path.resolve(__dirname, '../..');
const dist = path.join(root, 'dist');
const names = [
  'Express Package',
  'Govindham Package',
  'Divine Pilgrimage Package',
  'Wholesome Pilgrim Package',
  'South Indian Package',
  'Jyotirlingas Package',
  'Pancha Bhoota Lingas Package',
];
const accommodation = ['Deluxe (Budget)', 'Exclusive', 'Premium'];
const report = [];
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const filename = path.resolve(
    dist,
    '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname),
  );
  if (!filename.startsWith(dist + path.sep) || !fs.existsSync(filename)) {
    res.writeHead(404).end();
    return;
  }
  res.setHeader('Content-Type', mime[path.extname(filename)] || 'application/octet-stream');
  fs.createReadStream(filename).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.HEAVENLY_TEST_URL || `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    headless: true,
  });
  try {
    for (const width of [320, 390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
      });
      await context.addInitScript(() => {
        window.testDrafts = [];
        const click = HTMLAnchorElement.prototype.click;
        HTMLAnchorElement.prototype.click = function (...args) {
          if (new URL(this.href).hostname === 'wa.me') {
            window.testDrafts.push(this.href);
            return;
          }
          return click.apply(this, args);
        };
      });
      await context.route('**/wa.me/**', (route) => route.abort());
      const page = await context.newPage();
      const dragToWhatsApp = async () => {
        const handle = page.locator('.slide-commit-handle');
        await handle.scrollIntoViewIfNeeded();
        const start = await handle.boundingBox();
        const track = await page.locator('.slide-commit').boundingBox();
        await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
        await page.mouse.down();
        await page.mouse.move(track.x + track.width - 10, start.y + start.height / 2, {
          steps: 12,
        });
        await page.mouse.up();
      };
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(base);
      await page.waitForSelector('[data-tour-pick="6"]');
      assert.deepEqual(
        await page.locator('[data-package-index] .package-copy > h3').allTextContents(),
        names,
      );
      assert.equal(await page.locator('.momentum-card').count(), 5, 'Day-wise trips stay separate');
      for (const [index, count] of [
        [4, 10],
        [5, 12],
        [6, 5],
      ]) {
        const card = page.locator(`[data-package-index="${index}"]`);
        await card.locator('summary').click();
        assert.equal(await card.locator('.package-includes li').count(), count);
      }
      const south = await page.locator('[data-package-index="4"]').innerText();
      for (const stop of ['Kanyakumari', 'Chidambaram', 'Thanjavur', 'Trivandrum'])
        assert(south.includes(stop));
      assert(
        await page
          .locator('[data-package-index="5"] img')
          .evaluate((i) => i.complete && i.naturalWidth > 0),
      );
      assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)));
      await page.locator('#build-custom-plan').click();
      for (const [index, count] of [
        [4, 10],
        [5, 12],
        [6, 5],
      ]) {
        await page.locator('#tour-select').selectOption(String(index));
        assert.equal(await page.locator('#stops-options input:checked').count(), count);
      }
      for (let index = 0; index < names.length; index++) {
        await page.goto(base);
        await page.locator(`[data-tour-pick="${index}"]`).click();
        await page.waitForURL(`**/vehicles.html?package=tour-${index + 1}`);
        await page.waitForSelector('.selected-journey h1');
        assert.equal(await page.locator('.selected-journey h1').textContent(), names[index]);
        await page.locator('[data-vehicle="sedan"]').click();
        await page.waitForSelector('#booking-review[open]');
        const select = page.locator('#booking-accommodation');
        assert.equal(await select.getAttribute('required'), '');
        assert.deepEqual(
          await select.locator('option:not([value=""])').allTextContents(),
          accommodation,
        );
        if (index === 0) {
          assert.equal(await select.inputValue(), '');
          await page.locator('.slide-commit-alternative').click();
          assert.equal(
            await page.evaluate(() => window.testDrafts.length),
            0,
            'No WhatsApp draft without accommodation',
          );
          assert.equal(await select.evaluate((el) => el.checkValidity()), false);
          await dragToWhatsApp();
          assert.equal(
            await page.evaluate(() => window.testDrafts.length),
            0,
            'Slide also requires accommodation',
          );
        }
        const choice = accommodation[index % accommodation.length];
        await select.selectOption(choice);
        if (index === 6) await dragToWhatsApp();
        else await page.locator('.slide-commit-alternative').click();
        const message = await page.evaluate(() =>
          new URL(window.testDrafts.at(-1)).searchParams.get('text'),
        );
        assert(message.includes(`Selected trip: ${names[index]}`));
        assert(message.includes('Selected vehicle: Sedan'));
        assert(message.includes(`Accommodation: ${choice}`));
        if (index === 4)
          for (const stop of ['Kanyakumari', 'Chidambaram', 'Thanjavur', 'Trivandrum'])
            assert(message.includes(stop));
        if (index === 5)
          for (const stop of ['Somnath', 'Kedarnath', 'Vaidyanath', 'Nageshwar', 'Grishneshwar'])
            assert(message.includes(stop));
        if (index === 6)
          for (const stop of ['Earth', 'Water', 'Fire', 'Air', 'Space'])
            assert(message.includes(stop));
      }
      await page.reload();
      await page.locator('.booking-selection-dock .flow-button').click();
      assert.equal(
        await page.locator('#booking-accommodation').inputValue(),
        accommodation[0],
        'Accommodation preference survives reload',
      );
      await page.goto(base);
      await page.locator('[data-contact]').first().click();
      await page.locator('#name').fill('Test traveller');
      await page.locator('#pickup').fill('Tirupati');
      await page.locator('.form-submit').click();
      assert.equal(await page.evaluate(() => window.testDrafts.length), 0);
      assert.equal(
        await page.locator('#accommodation').evaluate((el) => el.checkValidity()),
        false,
      );
      await page.locator('#accommodation').selectOption('Premium');
      await page.locator('.form-submit').click();
      const enquiry = await page.evaluate(() =>
        new URL(window.testDrafts.at(-1)).searchParams.get('text'),
      );
      assert(enquiry.includes('Accommodation: Premium'));
      assert.deepEqual(errors, []);
      report.push({
        width,
        packages: 7,
        jyotirlingas: 12,
        panchaBhoota: 5,
        accommodationRequired: true,
        bothWhatsAppFlows: true,
      });
      console.log(
        width,
        'package routes, temple counts, all accommodation choices and both WhatsApp handoffs passed',
      );
      await context.close();
    }
    const output = path.join(root, 'tests/browser/evidence/packages-accommodation-results.json');
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  } finally {
    await Promise.race([browser.close(), new Promise((resolve) => setTimeout(resolve, 1000))]);
    server.close();
  }
})()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    server.close();
    process.exit(1);
  });
