# Tirumala-inspired cinematic hero options
Three AI-generated artistic compositions: sunrise, misty daylight and evening. Each combines hills, a winding ghat road and temple architecture. These are generated illustrations, not location photographs or exact geographic reconstructions. They have not replaced the live website background.

## Approved hero backgrounds — 13 November 2026

The desktop hero now uses the owner's selected morning hills and ghat-road image (`src/site/assets/tirumala-morning-valley-hero.webp`). Mobile uses a separate generated 9:16 composition with visible temple architecture (`src/site/assets/tirumala-morning-valley-portrait-temple.webp`); its original PNG is retained here as `tirumala-mobile-temple-cinematic.png`.

The mobile image was edited with the built-in image generation tool from the preceding portrait valley artwork. Prompt direction: retain the portrait format, broad wooded hills and winding ghat road; add a recognisable white-and-gold temple precinct on the right, keep the left centre clear for heading text, and use cinematic morning light with layered mist. These are artistic AI-generated compositions, not exact-location photographs.

Mobile uses proportional contain fitting so the entire portrait remains visible, with text above the temple and road. Desktop uses edge-to-edge cover fitting anchored at the bottom to retain the ghat road and remove side bars on wide screens. Existing trip selection, custom-trip planning and booking behavior are preserved.

Desktop selection update: the owner supplied `tirumala-desktop-temple-approved.png` for desktop only. It is served as `src/site/assets/tirumala-morning-valley-desktop-approved.webp`, with a 35% vertical focal position to keep the temple and winding road visible across standard and wide desktop screens. This supersedes the preceding desktop valley selection; the mobile portrait remains unchanged.

Release verification: the production build and TypeScript checks pass. Browser checks at 1440x1000 and 1920x800 confirm the selected desktop image fills the hero, with its temple and winding road visible. The 360px and 390px mobile layouts continue to use the existing portrait temple image.
