# Interactive hero Dot Field

Adapted directly from the user-pasted MIT Dot Field component by Dorian Baffier / Kokonut UI. The original seeded Perlin noise, coarse tone interpolation, spring coupling, compression, swipe force and shockwave helpers are retained in generated native JavaScript. The page does not require React or a new runtime library.

The hero's former WebGL surface is replaced, leaving one 2D canvas in the hero. Dot count and backing pixel ratio are capped by viewport and device capability. Slow render work reduces density automatically. Physics uses the original fixed 1/120-second step with a bounded catch-up budget. A maximum of two simultaneous shockwaves is retained on mobile.

Pointer handlers are passive and never prevent scrolling or zooming. Controls do not trigger background shockwaves. Motion stops when the hero is offscreen, the tab is hidden, decorative motion is paused, or the opening curtains cover the hero. Reduced-motion users receive a static seeded field. Dot contrast fades behind text and at the edges.

## Browser checks

- Normal motion: 23 passed, 0 failed.
- Reduced motion: 23 passed, 0 failed.
- No page errors captured.
- Mobile-sized field: 989 dots in the test browser.
- Observed work: approximately 1.6ms average and 5.9ms maximum per rendered frame during the interaction test. These are local headless-browser measurements, not a guarantee for every physical phone.
- Checked: canvas initialization, business heading, 2D context, dot/pixel budget, tap shockwave, passive touch events, control exclusion, bounded queue, finite physics under repeated taps, pause/resume, offscreen sleep and width sweeps at 320/390/768/1440px.

REA retained completed check results but returned its known provider cleanup timeout. Captures remain partial observations. No physical iPhone/Android certification is claimed.

`prepare_dot_field.mjs` records the one-time conversion from the user attachment. `src/v3/dot-field.js` is the shipped standalone artifact; its lifecycle integration source is also kept in `src/v3/dot-field-runtime.js`.
