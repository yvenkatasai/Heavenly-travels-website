import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/site/pilgrimage.js', import.meta.url), 'utf8');
const settle = () => new Promise((resolve) => setImmediate(resolve));

function setup() {
  const observers = [];
  const handlers = new Map();
  const media = { matches: false, addEventListener() {} };
  const cards = Array.from({ length: 7 }, () => {
    const image = Object.assign(new EventTarget(), {
      complete: false,
      loading: 'lazy',
      decode: () => Promise.resolve(),
    });
    const classes = new Set();
    return {
      image,
      classList: { add: (value) => classes.add(value), contains: (value) => classes.has(value) },
      querySelectorAll: () => [image],
    };
  });
  const element = { addEventListener() {} };
  vm.runInNewContext(source, {
    document: {
      getElementById: () => element,
      querySelectorAll: (selector) => (selector === '.package-card' ? cards : []),
      querySelector: () => null,
    },
    window: {
      heavenlyMotionAllowed: () => !media.matches,
      addEventListener: (name, fn) => handlers.set(name, fn),
    },
    matchMedia: () => media,
    addEventListener() {},
    IntersectionObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      unobserve() {}
      disconnect() {
        this.disconnected = true;
      }
    },
  });
  return { cards, observers, handlers, media };
}

test('all seven cards wait for their own delayed image before revealing', async () => {
  const { cards, observers } = setup();
  for (const card of cards) {
    assert.ok(card.classList.contains('package-reveal-ready'));
    observers[0].callback([{ target: card, isIntersecting: true }]);
    assert.equal(card.image.loading, 'eager');
    observers[1].callback([{ target: card, isIntersecting: true }]);
    await settle();
    assert.ok(!card.classList.contains('package-revealed'));
    card.image.dispatchEvent(new Event('load'));
    await settle();
    assert.ok(card.classList.contains('package-revealed'));
  }
});

test('an image arriving after its card leaves the screen does not consume the reveal', async () => {
  const { cards, observers } = setup();
  const card = cards[6];
  observers[1].callback([{ target: card, isIntersecting: true }]);
  observers[1].callback([{ target: card, isIntersecting: false }]);
  card.image.dispatchEvent(new Event('load'));
  await settle();
  assert.ok(!card.classList.contains('package-revealed'));
  observers[1].callback([{ target: card, isIntersecting: true }]);
  await settle();
  assert.ok(card.classList.contains('package-revealed'));
});

test('broken images and reduced motion never leave cards waiting indefinitely', async () => {
  const { cards, observers, handlers, media } = setup();
  cards[0].image.decode = () => Promise.reject(new Error('Image unavailable'));
  observers[1].callback([{ target: cards[0], isIntersecting: true }]);
  cards[0].image.dispatchEvent(new Event('error'));
  await settle();
  assert.ok(cards[0].classList.contains('package-revealed'));
  media.matches = true;
  handlers.get('motionchange')();
  assert.ok(cards.every((card) => card.classList.contains('package-revealed')));
  assert.ok(observers.every((observer) => observer.disconnected));
});
