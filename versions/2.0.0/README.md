# Heavenly Tours & Travels — version 2.0.0

The active site restores the earlier cinematic design. The clearer package-grid redesign has been preserved exactly as version **1.0.0**, as requested. Smooth, full-HD native video playback is retained in both versions.

## Saved versions

| Version | Design | Files |
| --- | --- | --- |
| 1.0.0 | Preserved user-friendly redesign: visible package/vehicle grids, guided customization and simpler quote form | `versions/1.0.0/` |
| 2.0.0 | Restored cinematic design: immersive hero, editorial sections, package/vehicle carousels and original booking flow | Active workspace and `versions/2.0.0/` |

The version numbers follow the requested labels. Each saved version contains its source, build script, static output, assets and a SHA-256 inventory. `versions/manifest.json` identifies the active version. No Git reset, commit or deployment was performed.

## Preview

Active version 2.0.0:

```powershell
python build.py
python -m http.server 4188 --bind 127.0.0.1 --directory dist
```

Preserved version 1.0.0:

```powershell
python -m http.server 4189 --bind 127.0.0.1 --directory versions/1.0.0/dist
```

Version 2.0.0 restores `page.html`, `app.js` and `cinematic.css` from the snapshot made before the usability redesign. The hero retains the later native-video improvement, with no video/frame-canvas switching. Scroll-linked typography, the portal outline and header styling are restored independently of video playback.

Five tours, four vehicle preferences, editable stops, original pricing constants and the WhatsApp enquiry remain. Opening a WhatsApp draft does not send a message, take payment or confirm a booking. Image attribution remains in the footer.
