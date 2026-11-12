# Heavenly Tours & Travels

A cinematic pilgrimage frontend rebuilt using REA observations of Pasqua Wines. Heavenly's five packages, four vehicles, editable temple stops, pricing model, calendar and WhatsApp enquiry flow are retained.

## Build and preview

```powershell
python build.py
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4188. Building requires Python's standard library only. Google Fonts is optional; serif/sans-serif fallbacks are included. Deploy `dist/` with its `assets/` directory beside `index.html`.

## Experience

The homepage explains private temple travel and leads directly to five visible tour packages. A persistent four-step bar guides visitors through **Choose a package → Customize stops → Choose a vehicle → Get your quote**. All four vehicle types are visible together. A dedicated stop editor shows an itemized estimate, extra temples, reset and route-help options. The booking summary is expandable on mobile to keep the form close at hand.

Visitors can filter packages, compare route coverage, build their own route, keep travel details while browsing and ask the team to recommend a vehicle. Plain-language FAQs explain pricing, darshan availability and when a trip is actually confirmed. No payment, automatic booking or automatic message sending occurs. Existing contact: +91 97001 81493.

The hero now uses continuous native video playback: a gentle 20-second, full-HD loop at 60 fps for desktop and 30 fps for mobile, without scroll seeking or a frame-canvas handoff. The mobile encode has a 3 Mbps cap. Motion pauses offscreen, in a hidden tab, and with the pause button. Reduced-motion/data-saving preferences use the poster. The 30-image gallery is optional and follows the planning flow.

See `UX-SYSTEM.md` for the information architecture, interaction rules and media decisions.

## Main files

- `src/page.html`: structure, booking form and landscape collection.
- `src/journey.css`: revised responsive styling and interaction states.
- `src/cinematic.js`: native video lifecycle, menu and optional gallery.
- `src/app.js` / `src/tours.js`: itinerary, pricing, selection and quote behavior.
- `build.py`: embeds application CSS/JS and original temple images; copies mountain media separately.

The previous working source is backed up in `output/pre-pasqua-backup/`. Pre-existing changes in `src/site.css` and the PageFlip files were retained. The rebuilt page loads `journey.css` and does not load PageFlip. The preceding cinematic version is preserved in `output/pre-journey-refinement/`.

## Media

`src/assets/mountains/` retains 30 independently generated landscapes, three original 8-second clips and their 288 extracted frames. It also contains the new 20-second smooth hero films and a full-HD poster. `manifest.json` retains the image prompts; `smooth-hero-manifest.json` describes the revised hero. `output/mountain-contact-sheet.jpg` previews the collection.

The landscapes are AI artwork inspired by Tirumala and the Eastern Ghats, not verified location photographs. The films are FFmpeg camera-motion edits of those images, not text-to-video model output. No video-generation model was available in this session. Original temple-photo attribution is retained in the credits.

To regenerate the motion clips and frames:

```powershell
python -m pip install pillow imageio-ffmpeg opencv-python numpy
python generate_smooth_hero.py
python build.py
```

## REA evidence and checks

See `design-reference/pasqua-rea/RECONSTRUCTION.md` for observations and limitations. REA 6.8.0 ran through its CLI with supported Node 24.22.1. No global agent registration was changed.

The current journey tests and screenshots are in `output/rea-qa/journey-v2/`: 65/65 release checks passed. A separate 3.312-second mobile playback sample decoded 99 frames with zero dropped frames; the WhatsApp draft-format check also passed. See `verification-summary.json` for the final record. `qa_journey.py` prepares real desktop/mobile flow scenarios plus functional and mobile playback harnesses. The preceding version's tests remain in the parent directory as historical records. JavaScript syntax checks and the Python build are also required.

REA returned `cleanup_incomplete` after capturing the requested states; its evidence is explicitly retained as partial. These are successful interaction/assertion observations, not a clean REA process exit. Follow-up process checks found no browser command lines containing Playwright profiles.

`qa_journey.py` copies the test harnesses temporarily into `dist/`. Remove `dist/journey-qa.html` and `dist/playback-qa.html` after QA. They are not production pages.

This is a local rebuild. Existing hosting identity was preserved. No deployment or GitHub push was performed.
