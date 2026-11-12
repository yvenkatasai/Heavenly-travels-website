# Reusable React components

`parallax-scroll-feature-section.tsx` adapts the supplied React/Framer Motion component: alternating rows, scroll-linked image opacity/clip reveal and upward content motion. Each row owns its hooks, so changing the data does not violate hook ordering. Reduced motion and the existing Pause control disable decorative movement.

The `src/components/ui` directory and `@/components/ui` alias keep reusable UI separate from booking data. `components.json` records the shadcn-compatible aliases. Tailwind utilities are prefixed `tw:` and Preflight is omitted, so the existing static site's controls and typography are not reset.

The website remains a static Python build with a compiled React booking island. `src/booking/main.tsx` mounts the five-day route, package-level choices and horizontal vehicle rail, and uses portals for service controls in and below the temple gateway. The vehicle rail uses native horizontal scroll snapping, desktop arrows and floating Motion tiles rather than the vertical vehicle layout superseded by the user's latest instruction.

```powershell
npm ci
npm run typecheck
npm run build
```

The build produces locally served `dist/assets/booking-flow.js`, its dependency licence comments and prefixed Tailwind CSS. No remote runtime scripts are required. `src/site/booking.css` contains the site's matching visual styles.

Package tiers are preferences, not invented price/amenity guarantees. The five-day route is marked as a suggested itinerary for confirmation. No message or booking is submitted automatically.
