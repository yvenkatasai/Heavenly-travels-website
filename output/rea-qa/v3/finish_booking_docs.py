from pathlib import Path
import json
p=Path('README.md');s=p.read_text(encoding='utf-8');s=s.replace('python build.py\npython -m http.server 4188','npm ci\nnpm run typecheck\npython build.py\npython -m http.server 4188',1);s=s.replace('No Node package installation or external runtime JavaScript dependency is required.','The one-time npm install supplies the React booking island and its build tools. Python builds the static site and bundles the React code locally; no third-party runtime CDN is required.');s+='''
## Five-day itinerary and selected package booking

The owner-supplied React parallax component is integrated at `components/ui/parallax-scroll-feature-section.tsx`. A suggested five-day route appears after the normal packages. Service choices appear inside and below the temple gateway. Budget friendly, Deluxe, Luxury and Premium options lead to a horizontally sliding fleet of floating tiles. Selecting a vehicle opens a native review popup with a WhatsApp draft containing the chosen service, itinerary, package level and vehicle.

React source and typed data: `src/booking`. Native matching styles: `src/v3/booking.css`. The `components.json` and `tsconfig.json` files configure the requested shadcn-compatible aliases and TypeScript structure. Tailwind is prefixed `tw:` without Preflight. See `components/ui/README.md` for build and integration details.

The five-day sequence is a suggested route; timings and arrangements are confirmed by the team. Package levels are preferences because the owner has not supplied tier prices or guaranteed inclusions. No model/seating guarantees, new rates or automatic booking confirmations are invented.
''';p.write_text(s,encoding='utf-8')
p=Path('.vercelignore');s=p.read_text();s+='\nnode_modules\ncomponents\nlib\nscripts\n';p.write_text(s)
p=Path('version.json');meta=json.loads(p.read_text());meta['description']='React parallax five-day itinerary, service/package preferences, horizontal floating vehicle tiles and WhatsApp selection review.';p.write_text(json.dumps(meta,indent=2))
