import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source = fs.readFileSync(new URL('../src/site/analytics.js', import.meta.url), 'utf8');
function setup(saved) {
  class Element {
    children = [];
    listeners = {};
    append(...nodes) {
      this.children.push(...nodes);
    }
    setAttribute() {}
    addEventListener(name, fn) {
      this.listeners[name] = fn;
    }
    querySelector() {
      return this.children.flatMap((n) => n.children).find((n) => n.tag === 'button');
    }
    closest() {
      return this.href ? this : null;
    }
    focus() {}
  }
  const create = (tag) => Object.assign(new Element(), { tag });
  const head = create('head'),
    body = create('body'),
    settings = create('button');
  const listeners = {},
    storage = new Map(saved ? [['heavenly-analytics-consent-v1', JSON.stringify(saved)]] : []);
  const cookieWrites = [];
  const document = {
    head,
    body,
    title: 'Tirupati trips',
    referrer: 'https://example.com/private?email=secret',
    querySelector: (selector) =>
      selector.startsWith('meta')
        ? { content: 'G-TEST123' }
        : { href: 'https://heavenlytoursandtravels.com/trips' },
    querySelectorAll: () => [settings],
    createElement: create,
    addEventListener: (name, fn) => {
      listeners[name] = fn;
    },
    get cookie() {
      return '_ga=123; _ga_TEST123=456; other=keep';
    },
    set cookie(value) {
      cookieWrites.push(value);
    },
  };
  const window = {};
  vm.runInNewContext(source, {
    document,
    window,
    Element,
    URL,
    Date,
    location: {
      origin: 'https://heavenlytoursandtravels.com',
      hostname: 'heavenlytoursandtravels.com',
    },
    localStorage: { getItem: (k) => storage.get(k), setItem: (k, v) => storage.set(k, v) },
  });
  const banner = body.children[0],
    buttons = banner.children[1].children;
  return {
    window,
    head,
    banner,
    buttons,
    cookieWrites,
    settings,
    click: (href) => listeners.click({ target: Object.assign(create('a'), { href }) }),
    queue: () => Array.from(window.dataLayer || [], (args) => Array.from(args)),
  };
}

test('no Google script or events before consent, or after declining', () => {
  const app = setup();
  assert.equal(app.head.children.length, 0);
  app.click('https://wa.me/919700181493?text=private');
  assert.equal(app.queue().length, 0);
  app.buttons[1].onclick();
  assert.equal(app.head.children.length, 0);
  assert.equal(app.banner.hidden, true);
  app.settings.listeners.click();
  assert.equal(app.banner.hidden, false);
});

test('consented contact events exclude enquiry URLs, query strings and referrer paths', () => {
  const app = setup();
  app.buttons[0].onclick();
  assert.equal(app.head.children.length, 1);
  app.click('https://wa.me/919700181493?text=private-customer-name');
  app.click('tel:+919700181493');
  app.click('https://example.com/unrelated');
  const events = app.queue().filter((args) => args[0] === 'event');
  assert.deepEqual(
    events.map((args) => args[1]),
    ['page_view', 'whatsapp_click', 'phone_click'],
  );
  const serialized = JSON.stringify(app.queue());
  assert.ok(!/private|secret|wa\.me|\?/.test(serialized));
  assert.ok(serialized.includes('https://example.com'));
  assert.ok(serialized.includes('https://heavenlytoursandtravels.com/trips'));
});

test('withdrawing consent stops events and clears Analytics cookies only', () => {
  const app = setup({ choice: 'accepted', at: Date.now() });
  assert.equal(app.head.children.length, 1);
  app.buttons[1].onclick();
  const count = app.queue().length;
  app.click('https://wa.me/919700181493?text=private');
  assert.equal(app.queue().length, count);
  assert.equal(app.window['ga-disable-G-TEST123'], true);
  assert.equal(app.cookieWrites.length, 6);
  assert.ok(app.cookieWrites.every((value) => value.startsWith('_ga')));
});

test('expired consent asks again without loading Google', () => {
  const app = setup({ choice: 'accepted', at: Date.now() - 181 * 86400000 });
  assert.equal(app.head.children.length, 0);
  assert.equal(app.banner.hidden, false);
});
