# Pasqua → Heavenly: REA reconstruction record

Reference: https://pasqua.it/. The supplied Google share URL was inaccessible through web lookup; the named official website was resolved. Repository: https://github.com/morluto/rea, cloned beside the project at `../rea-tools`, HEAD `fe677f6cf9853fb12490dfb8ef23ccae3a551049`.

Investigation used REA's `capture-browser-scenario` CLI, version 6.8.0, with Node 24.22.1. The repository's `.agents/skills/reverse-engineer-anything/SKILL.md` was read. UI/UX Pro Max output was not used for implementation after the user's correction. No Sites hosting operations or global MCP registration were performed.

## Observed evidence

`reference-scenario.json` captured the initial 1440×900 viewport, DOM, accessibility and network metadata. `reference-enter-scenario.json` declared a click on `.room-cta.enabled`, followed by a wait and new snapshots. All declared entry actions completed.

- `reference-0.png`: grainy full-screen film entry, two-line title contrasting serif/sans-serif and rounded entry CTA.
- `entered-3.png`: room with an arch framing a distant landscape, large display title, global navigation and chapter controls at the bottom corners.
- `artifact-0.txt`, `entered-dom-3.html`: rendered DOM, Nuxt script URLs, room controls, navigation, menu, Vimeo MP4 and chapter structure.
- `observed-reference.css`: styles extracted from the REA-captured DOM. Type families include Acid Grotesk and Wulkan Display. Header transitions use .75 seconds with `cubic-bezier(.215,.61,.355,1)`; menu-button inset masks use .75 seconds with `cubic-bezier(.77,0,.175,1)`.

The rebuild adapts these observed patterns with original mountain media, accessible HTML, and alternate fonts (DM Sans / Italiana). Proprietary fonts, wine content, room artwork and reference videos were not copied into the frontend.

## Mapping

| Pasqua observation | Heavenly implementation |
| --- | --- |
| Full-screen film and grain | Landscape motion edit, poster fallback, grain layer |
| Architectural arch and depth | Expanding portal outline and scroll-linked mountain frames |
| Mixed display typography | Large sans-serif title and contrasting serif line |
| Corner chapter controls | Direct story and tour chapter links |
| Rounded controls and inset transitions | Masked menu reveal, circular navigation and gallery controls |
| Discovery before products | Pilgrimage story and landscape interlude before tour planning |
| Product exploration | Five existing packages, four vehicle choices and editable itinerary |

## Verification

Desktop and mobile scenarios are in `../../output/rea-qa/`. All declared desktop/mobile actions completed, with no captured JavaScript page errors. Captured-DOM checks confirmed package changes, totals, pickup/drop-off text, flexible dates and the calendar. A separate harness reports 28/28 functional/layout assertions, including overflow and content-fit checks at 320, 390, 768 and 1440 pixels. Desktop hero/packages and mobile hero/calendar screenshots were visually inspected.

## Coverage and limitations

REA returned `cleanup_incomplete`, with requested states retained inside `partial_observation`; this is not a clean tool success. Follow-up Windows checks found no Chrome/Edge processes with Playwright profile command lines. Profile/transport cleanup was not independently verified. Large raw captures remain local and Git-ignored; derived screenshots, scenarios, assertions and notes remain reviewable.

The entry and entered homepage were observed. This adapts captured frontend patterns; it is not an exhaustive recreation or parity claim for every Pasqua route, WebGL shader, animation timeline or hidden state. A later isolated bundle-request probe failed before collecting useful script evidence and was not treated as recovered application source. The complete original source and GPU scene were not recovered.

The built-in image tool generated 30 distinct images, one call per asset. No video-generation model was available. FFmpeg created three explicitly identified still-based camera-motion edits and extracted 96 frames from each. The final images, clips, all 288 frames and prompt manifests are saved within the project's mountain asset directory.
