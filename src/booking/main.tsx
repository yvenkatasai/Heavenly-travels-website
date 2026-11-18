import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, CarFront, MessageCircle, X } from 'lucide-react';
import { useDecorativeMotion } from '@/components/ui/parallax-scroll-feature-section';
import { useMomentumRail } from '@/components/ui/use-momentum-rail';
import SlideCommit from '@/components/ui/SlideCommit';
import SplitNav from '@/components/ui/split-nav';
import {
  SERVICES,
  SERVICE_LABELS,
  ACCOMMODATIONS,
  PACKAGES,
  DAY_PACKAGES,
  FLEET,
  type VehicleId,
  type TravelPackage,
} from './data';

const KEY = 'heavenly-journey-selection-v3';
type Customer = { name: string; people: string; date: string; pickup: string };
type Selection = {
  service: string;
  packageId: string;
  vehicle: VehicleId | null;
  preference: string;
  accommodation: string;
  customer: Customer;
};
const TRAVEL_STYLES: Record<string, string> = {
  'Budget friendly package': 'Budget-friendly',
  'Deluxe package': 'Deluxe',
  'Luxury packages': 'Luxury',
  'Premium packages': 'Premium',
};
function load(): Selection {
  let saved: Partial<Selection> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem(KEY) || '{}');
  } catch {}
  let legacy = window.HeavenlyTrip?.get();
  if (!legacy) {
    try {
      const old = JSON.parse(sessionStorage.getItem('heavenly-v3-trip') || '{}');
      legacy = { ...old, ...old.fields, service: old.fields?.['service-request'] };
    } catch {}
  }
  const query = new URLSearchParams(location.search).get('package');
  return {
    service: SERVICES.includes(saved.service as (typeof SERVICES)[number])
      ? saved.service!
      : legacy?.service || SERVICES[0],
    packageId: query && PACKAGES.some((p) => p.id === query) ? query : saved.packageId || '',
    vehicle:
      (!query || query === saved.packageId) && FLEET.some((v) => v.id === saved.vehicle)
        ? saved.vehicle!
        : null,
    preference: Object.keys(TRAVEL_STYLES).includes(saved.preference || '')
      ? saved.preference!
      : '',
    accommodation: ACCOMMODATIONS.some((value) => value === saved.accommodation)
      ? saved.accommodation!
      : ACCOMMODATIONS.some((value) => value === legacy?.accommodation)
        ? legacy!.accommodation
        : '',
    customer: saved.customer || {
      name: legacy?.name || '',
      people: legacy?.people || '4',
      date: legacy?.date || '',
      pickup: legacy?.pickup || '',
    },
  };
}
function persist(s: Selection) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}
function jump(id: string) {
  const target = document.getElementById(id);
  const fold = target?.closest('details');
  if (fold) fold.open = true;
  target?.scrollIntoView({ behavior: 'instant' });
}
function PackagePlan({ item }: { item: TravelPackage }) {
  return (
    <>
      {item.places.length > 0 && (
        <ul>
          {item.places.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
      {item.days.map((d) => (
        <div className="day-plan" key={d.title}>
          <h4>{d.title}</h4>
          <ul>
            {d.places.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
function DayRail() {
  const scroller = useRef<HTMLDivElement>(null),
    track = useRef<HTMLUListElement>(null),
    [index, setIndex] = useState(0);
  const { goTo } = useMomentumRail(scroller, track, setIndex);
  const [details, setDetails] = useState<TravelPackage | null>(null),
    [overflow, setOverflow] = useState(false),
    dialog = useRef<HTMLDialogElement>(null),
    content = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  function openDetails(item: TravelPackage, button: HTMLElement) {
    trigger.current = button;
    setDetails(item);
  }
  function closeDetails() {
    setDetails(null);
    document.body.classList.toggle(
      'modal-open',
      !!document.querySelector('dialog[open]:not(#day-package-details)'),
    );
    trigger.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (details && !el.open) {
      el.showModal();
      document.body.classList.add('modal-open');
      if (content.current) content.current.scrollTop = 0;
    } else if (!details && el.open) el.close();
  }, [details]);
  useEffect(() => {
    const el = content.current;
    if (!el || !details) return;
    const measure = () => setOverflow(el.scrollHeight > el.clientHeight + 2);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const frame = requestAnimationFrame(measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [details]);
  return (
    <section
      id="day-packages"
      className="day-packages"
      aria-labelledby="day-category day-packages-title"
    >
      <div className="package-chapter flow-container">
        <span className="chapter-number" aria-hidden="true">
          03
        </span>
        <p id="day-category" className="chapter-name">
          Day-wise Trips
        </p>
        <span className="chapter-note">1–5 days · Choose your days</span>
      </div>
      <header className="flow-section-heading flow-container">
        <div>
          <p className="flow-eyebrow">CHOOSE YOUR DAYS</p>
          <h2 id="day-packages-title">
            How many days
            <br />
            <em>do you have?</em>
          </h2>
        </div>
        <div>
          <p>Swipe to see trips. Tap View trip plan for details.</p>
          <div className="fleet-arrows">
            <button
              type="button"
              aria-label="Previous day trip"
              aria-disabled={index === 0}
              onClick={() => goTo(index - 1)}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next day trip"
              aria-disabled={index === DAY_PACKAGES.length - 1}
              onClick={() => goTo(index + 1)}
            >
              <ArrowRight size={18} />
            </button>
            <span>{index + 1} / 5 · SWIPE TO EXPLORE</span>
          </div>
        </div>
      </header>
      <div
        ref={scroller}
        className="momentum-rail"
        tabIndex={0}
        role="region"
        aria-label="One to five day trips. Use arrow keys to browse."
      >
        <ul ref={track} className="momentum-track">
          {DAY_PACKAGES.map((item, i) => (
            <li key={item.id} className="momentum-card" data-current={index === i}>
              <div className="momentum-card-tilt">
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  width="700"
                  height="850"
                  draggable={false}
                />
                <div className="momentum-card-shade" />
                <span className="momentum-duration">
                  0{item.duration} {item.duration === 1 ? 'DAY' : 'DAYS'}
                </span>
                <div className="momentum-card-copy">
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                  <button
                    className="day-view-details"
                    type="button"
                    data-day-details={item.id}
                    aria-haspopup="dialog"
                    aria-controls="day-package-details"
                    aria-label={`View trip plan for ${item.name}`}
                    onClick={(event) => openDetails(item, event.currentTarget)}
                  >
                    View trip plan
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="day-rail-dots" aria-label="Choose a duration">
        {DAY_PACKAGES.map((p, i) => (
          <button
            type="button"
            key={p.id}
            aria-label={`Show ${p.name}`}
            aria-pressed={index === i}
            onClick={() => goTo(i)}
          >
            <span />
            {i + 1}
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        id="day-package-details"
        className="day-package-dialog"
        aria-labelledby="day-details-title"
        aria-describedby="day-details-note"
        onClose={closeDetails}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              setDetails(null);
          }
        }}
      >
        <button
          type="button"
          className="day-details-close"
          aria-label="Close trip plan"
          onClick={() => setDetails(null)}
        >
          <X size={20} />
        </button>
        <header className="day-dialog-header">
          <p className="flow-eyebrow">
            DAY-WISE TRIP · {details?.duration} {details?.duration === 1 ? 'DAY' : 'DAYS'}
          </p>
          <h2 id="day-details-title">{details?.name}</h2>
          <p id="day-details-note">{details?.note}</p>
        </header>
        {overflow && <p className="day-dialog-scroll-hint">Scroll here to see all days.</p>}
        <div
          ref={content}
          className="day-dialog-content"
          tabIndex={0}
          role="region"
          aria-label="Trip plan. Scroll to see all days."
        >
          {details && <PackagePlan item={details} />}
          {details?.id === 'days-2' && (
            <p className="day-order-note">
              The two-day order is arranged around your darshan slot.
            </p>
          )}
        </div>
        <footer className="day-dialog-footer">
          <p>We guide you on how to book darshan tickets. We do not book tickets.</p>
          {details && (
            <a
              className="flow-button"
              data-day-select={details.id}
              href={'vehicles.html?package=' + details.id}
            >
              Select trip &amp; choose vehicle
            </a>
          )}
          <button type="button" className="day-dialog-back" onClick={() => setDetails(null)}>
            Back to trips
          </button>
        </footer>
      </dialog>
    </section>
  );
}
function VehicleArt({ kind }: { kind: string }) {
  const isBus = kind === 'bus' || kind === 'minibus',
    van = kind === 'van',
    suv = kind === 'suv';
  return (
    <svg viewBox="0 0 360 180" role="img" aria-label="Representative vehicle illustration">
      <ellipse cx="180" cy="150" rx="143" ry="10" fill="#153c3012" />
      <path
        d={
          isBus
            ? 'M35 131V53Q35 34 56 34H291Q311 34 315 54L328 105V135H35Z'
            : van
              ? 'M38 131V68Q38 49 61 45L235 43Q258 44 270 69L295 100Q316 105 319 121V136H38Z'
              : suv
                ? 'M34 131L43 97 95 82 119 48H237L272 83 316 102 326 135H34Z'
                : 'M29 130L36 110 90 91 126 61H224L265 94 310 104 329 136H29Z'
        }
        fill="#d8c7a1"
        stroke="#234b3c"
        strokeWidth="2"
      />
      {isBus ? (
        <>
          <path d="M51 49H289L302 85H51Z" fill="#ecf2e9" stroke="#234b3c" strokeWidth="1.5" />
          {[88, 126, 164, 202, 240, 278].map((x) => (
            <path key={x} d={`M${x} 49V85`} stroke="#234b3c" />
          ))}
        </>
      ) : (
        <>
          <path
            d={
              van
                ? 'M60 59H233L251 88H55Z'
                : suv
                  ? 'M127 60H229L254 88H105Z'
                  : 'M133 71H219L244 96H105Z'
            }
            fill="#ecf2e9"
            stroke="#234b3c"
            strokeWidth="1.5"
          />
          <path d="M175 60V96" stroke="#234b3c" strokeWidth="1.5" />
        </>
      )}
      <path d="M43 112H311M182 101V129" stroke="#234b3c" strokeWidth="1.2" />
      <rect x="278" y="111" width="25" height="7" rx="2" fill="#faf4d7" />
      <path d="M46 120H62" stroke="#f7faf0" strokeWidth="4" />
      {[88, 275].map((x) => (
        <g key={x}>
          <circle cx={x} cy="135" r="24" fill="#1a362c" />
          <circle cx={x} cy="135" r="12" fill="#c4ccbf" />
          <circle cx={x} cy="135" r="5" fill="#456253" />
        </g>
      ))}
    </svg>
  );
}

function App() {
  const vehiclePage =
    location.pathname.replace(/\/$/, '').endsWith('/vehicles.html') ||
    location.pathname.endsWith('/vehicles');
  const [state, setState] = useState(load),
    [review, setReview] = useState(false),
    [notice, setNotice] = useState(''),
    [canBack, setCanBack] = useState(false),
    [canNext, setCanNext] = useState(true);
  const rail = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    form = useRef<HTMLFormElement>(null),
    returnFocus = useRef<HTMLElement | null>(null),
    allowed = useDecorativeMotion();
  const selected = PACKAGES.find((p) => p.id === state.packageId),
    vehicle = FLEET.find((v) => v.id === state.vehicle),
    group = state.service === 'Group package';
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  useEffect(() => persist(state), [state]);
  useEffect(() => {
    if (!vehiclePage && location.hash) requestAnimationFrame(() => jump(location.hash.slice(1)));
  }, []);
  // Keep details entered on the vehicle page when returning to another package.
  useEffect(() => {
    if (vehiclePage) return;
    const fields = {
      name: state.customer.name,
      people: state.customer.people,
      pickup: state.customer.pickup,
    };
    Object.entries(fields).forEach(([id, value]) => {
      const input = document.getElementById(id) as HTMLInputElement | null;
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    window.HeavenlyTrip?.setService(state.service);
  }, []);
  useEffect(() => {
    const handler = (e: Event) => {
      const service = (e as CustomEvent<string>).detail;
      if (SERVICES.includes(service as (typeof SERVICES)[number]))
        setState((s) => ({ ...s, service }));
    };
    window.addEventListener('heavenly:service', handler);
    return () => window.removeEventListener('heavenly:service', handler);
  }, []);
  useEffect(() => {
    const saveBeforeNavigation = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLElement>(
        'a[href*="vehicles.html"],[data-tour-pick],#header-vehicles,#quick-vehicles',
      );
      if (!a) return;
      const snapshot = window.HeavenlyTrip?.get();
      persist({
        ...state,
        service: ['Temple tour', 'Group package', 'Custom multi-day South India tour'].includes(
          state.service,
        )
          ? state.service
          : 'Temple tour',
        customer: snapshot
          ? {
              name: snapshot.name,
              people: snapshot.people,
              date: snapshot.date,
              pickup: snapshot.pickup,
            }
          : state.customer,
      });
    };
    document.addEventListener('click', saveBeforeNavigation, true);
    return () => document.removeEventListener('click', saveBeforeNavigation, true);
  }, [state]);
  useEffect(() => {
    if (group && Number(state.customer.people) < 2)
      setState((s) => ({ ...s, customer: { ...s.customer, people: '2' } }));
  }, [group]);
  useEffect(() => {
    const el = dialog.current;
    if (review && el && !el.open) {
      returnFocus.current = document.activeElement as HTMLElement;
      el.showModal();
      document.body.classList.add('modal-open');
    } else if (!review && el?.open) el.close();
  }, [review]);
  useEffect(() => {
    document.body.classList.toggle('has-booking-selection', vehiclePage && !!selected && !!vehicle);
    return () => document.body.classList.remove('has-booking-selection');
  }, [vehiclePage, selected, vehicle]);
  const closeReview = () => {
    setReview(false);
    document.body.classList.remove('modal-open');
    returnFocus.current?.focus({ preventScroll: true });
  };
  function measure() {
    const el = rail.current;
    if (el) {
      setCanBack(el.scrollLeft > 3);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 3);
    }
  }
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [vehiclePage, selected]);
  const slide = (direction: number) =>
    rail.current?.scrollBy({
      left: direction * (rail.current.clientWidth * 0.78),
      behavior: allowed ? 'smooth' : 'instant',
    });
  function chooseVehicle(id: VehicleId) {
    if (!selected) return;
    setState((s) => ({ ...s, vehicle: id }));
    setReview(true);
    setNotice('Vehicle selected. Check your trip and open WhatsApp.');
  }
  function openDraft() {
    if (!selected || !vehicle || !form.current?.reportValidity()) return false;
    if (!ACCOMMODATIONS.some((value) => value === state.accommodation)) return false;
    const c = state.customer;
    const lines = [
      'Hello Heavenly Tours & Travels, I would like to book the following trip.',
      c.name.trim() ? `Name: ${c.name.trim()}` : '',
      `Service: ${SERVICE_LABELS[state.service] || state.service}`,
      `Selected trip: ${selected.name}`,
      state.preference
        ? `Travel style: ${TRAVEL_STYLES[state.preference] || state.preference}`
        : '',
      `Selected vehicle: ${vehicle.name}`,
      `Accommodation: ${state.accommodation}`,
      `People: ${c.people}`,
      `Travel date: ${c.date || 'Not decided yet'}`,
      c.pickup.trim() ? `Pickup: ${c.pickup.trim()}` : '',
      selected.note,
      'TRIP PLAN',
      ...selected.places,
      ...selected.days.flatMap((d) => [d.title, ...d.places]),
      'Please confirm the temples, hotel needs, vehicle, seats and available dates. I understand that you guide me on ticket booking and do not book darshan tickets.',
    ];
    const a = document.createElement('a');
    a.href =
      'https://wa.me/919700181493?text=' + encodeURIComponent(lines.filter(Boolean).join('\n'));
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.append(a);
    a.click();
    a.remove();
    setNotice('WhatsApp opened. Check your message and tap Send.');
    return true;
  }
  const categoryNav = document.getElementById('package-split-nav');
  if (!vehiclePage)
    return (
      <MotionConfig reducedMotion="user">
        <div className="booking-flow">
          {categoryNav && createPortal(<SplitNav />, categoryNav)}
          <DayRail />
        </div>
      </MotionConfig>
    );
  if (!selected)
    return (
      <div className="booking-flow flow-container vehicle-empty">
        <p className="flow-eyebrow">CHOOSE A TRIP FIRST</p>
        <h1>Choose your trip first.</h1>
        <p>
          Choose the seven-temple trip, another temple trip, or a 1–5 day trip. Then choose your
          vehicle here.
        </p>
        <a className="flow-button" href="index.html#pilgrimage">
          Choose a trip <ArrowRight size={18} />
        </a>
      </div>
    );
  return (
    <MotionConfig reducedMotion="user">
      <div className="booking-flow">
        <section className="selected-journey flow-container">
          <nav aria-label="Booking steps">
            <a href="index.html#pilgrimage">01 Trip ✓</a>
            <span aria-current="step">02 Vehicle</span>
            <span>03 WhatsApp</span>
          </nav>
          <div className="selected-journey-content">
            <div>
              <p className="flow-eyebrow">YOUR SELECTED TRIP</p>
              <h1>{selected.name}</h1>
              <p>{selected.note}</p>
              <a href="index.html#pilgrimage" className="flow-text-button">
                Change trip <ArrowLeft size={15} />
              </a>
            </div>
            <details className="selected-itinerary">
              <summary>View your trip plan</summary>
              <PackagePlan item={selected} />
            </details>
          </div>
        </section>
        <section id="vehicle-selection" className="flow-fleet" aria-labelledby="fleet-title">
          <header className="flow-section-heading flow-container">
            <div>
              <p className="flow-eyebrow">02 · VEHICLE SELECTION</p>
              <h2 id="fleet-title">
                Choose your
                <br />
                <em>vehicle.</em>
              </h2>
            </div>
            <div>
              <p>Choose your vehicle. We’ll confirm seating and availability.</p>
              <div className="fleet-arrows">
                <button
                  type="button"
                  onClick={() => slide(-1)}
                  disabled={!canBack}
                  aria-label="Previous vehicle"
                >
                  <ArrowLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => slide(1)}
                  disabled={!canNext}
                  aria-label="Next vehicle"
                >
                  <ArrowRight size={19} />
                </button>
                <span>SWIPE OR USE THE ARROWS</span>
              </div>
            </div>
          </header>
          <div
            ref={rail}
            className="floating-vehicle-rail"
            onScroll={measure}
            aria-label="Five vehicle options"
          >
            {FLEET.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                className={
                  'floating-vehicle-tile ' + (state.vehicle === item.id ? 'is-selected' : '')
                }
                data-vehicle={item.id}
                aria-pressed={state.vehicle === item.id}
                onClick={() => chooseVehicle(item.id)}
                whileHover={allowed ? { y: -8, rotate: i % 2 === 0 ? -0.8 : 0.8 } : undefined}
                whileTap={allowed ? { scale: 0.98 } : undefined}
              >
                <span className="vehicle-tile-top">
                  <span>0{i + 1} / PRIVATE TRAVEL</span>
                  <span className="vehicle-tile-check">
                    {state.vehicle === item.id ? <Check size={16} /> : <CarFront size={17} />}
                  </span>
                </span>
                <VehicleArt kind={item.kind} />
                <span className="vehicle-tile-tag">{item.tag}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="vehicle-tile-action">
                  {state.vehicle === item.id ? 'Vehicle selected' : 'Select this vehicle'}
                  <ArrowRight size={17} />
                </span>
              </motion.button>
            ))}
          </div>
        </section>
        {vehicle && (
          <aside className="booking-selection-dock" aria-label="Your trip and vehicle">
            <div>
              <span>{selected.name}</span>
              <strong>{vehicle.name}</strong>
            </div>
            <button className="flow-button" type="button" onClick={() => setReview(true)}>
              Review & book <MessageCircle size={17} />
            </button>
          </aside>
        )}
        <dialog
          ref={dialog}
          id="booking-review"
          className="booking-review"
          aria-labelledby="booking-review-title"
          onClose={closeReview}
        >
          <button
            type="button"
            className="booking-review-close"
            onClick={() => setReview(false)}
            aria-label="Close trip review"
          >
            <X size={21} />
          </button>
          <form
            ref={form}
            onSubmit={(e) => {
              e.preventDefault();
              openDraft();
            }}
          >
            <p className="flow-eyebrow">03 · YOUR TRIP, READY TO SHARE</p>
            <h2 id="booking-review-title">Review your trip.</h2>
            <div className="booking-review-summary">
              <div>
                <span>Trip</span>
                <strong>{selected.name}</strong>
              </div>
              <div>
                <span>Vehicle</span>
                <strong>{vehicle?.name}</strong>
              </div>
            </div>
            <div className="booking-review-fields">
              <label>
                Your name <span>(optional)</span>
                <input
                  autoComplete="name"
                  maxLength={100}
                  value={state.customer.name}
                  onChange={(e) =>
                    setState((s) => ({ ...s, customer: { ...s.customer, name: e.target.value } }))
                  }
                />
              </label>
              <label>
                People <span>({group ? '2' : '1'}–200)</span>
                <input
                  type="number"
                  min={group ? 2 : 1}
                  max={200}
                  required
                  value={state.customer.people}
                  onChange={(e) =>
                    setState((s) => ({ ...s, customer: { ...s.customer, people: e.target.value } }))
                  }
                />
              </label>
            </div>
            <div className="booking-review-fields">
              <label className="accommodation-choice">
                Accommodation type <span>(required)</span>
                <select
                  id="booking-accommodation"
                  required
                  value={state.accommodation}
                  onChange={(e) => setState((s) => ({ ...s, accommodation: e.target.value }))}
                  aria-describedby="booking-accommodation-note"
                >
                  <option value="" disabled>
                    Choose accommodation
                  </option>
                  {ACCOMMODATIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <small id="booking-accommodation-note">
                  Our team will confirm hotel options and availability.
                </small>
              </label>
            </div>
            <details className="booking-extra">
              <summary>Date, pickup & travel style</summary>
              <div className="booking-review-fields">
                <label>
                  Travel date <span>(optional)</span>
                  <input
                    type="date"
                    min={today}
                    value={state.customer.date}
                    onChange={(e) =>
                      setState((s) => ({ ...s, customer: { ...s.customer, date: e.target.value } }))
                    }
                  />
                </label>
                <label>
                  Pickup place <span>(optional)</span>
                  <input
                    maxLength={160}
                    value={state.customer.pickup}
                    onChange={(e) =>
                      setState((s) => ({
                        ...s,
                        customer: { ...s.customer, pickup: e.target.value },
                      }))
                    }
                  />
                </label>
                <label className="comfort-preference">
                  Travel style <span>(optional)</span>
                  <select
                    value={state.preference}
                    onChange={(e) => setState((s) => ({ ...s, preference: e.target.value }))}
                  >
                    <option value="">Help me choose</option>
                    {Object.entries(TRAVEL_STYLES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </details>
            <SlideCommit key={state.vehicle} onConfirm={openDraft} disabled={!vehicle} />
            <p className="booking-confirmation-note">
              Check your message in WhatsApp, then tap Send. No payment is taken here.
            </p>
          </form>
        </dialog>
        <div role="status" className="sr-only" aria-live="polite">
          {notice}
        </div>
      </div>
    </MotionConfig>
  );
}
const root = document.getElementById('booking-flow-root');
if (root) createRoot(root).render(<App />);
