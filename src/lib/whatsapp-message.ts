export type EnquiryMessage = {
  service?: string;
  trip?: string;
  date?: string;
  flexibleDate?: boolean;
  people: string;
  pickup?: string;
  pickupLabel?: string;
  dropoff?: string;
  dropoffLabel?: string;
  vehicle?: string;
  travelStyle?: string;
  accommodation?: string;
  places?: string[];
  days?: { title: string; places: string[] }[];
  completeSevenTemples?: boolean;
  includedExtras?: string[];
  name?: string;
  phone?: string;
  notes?: string;
};

export function formatTravelDate(value = '', flexible = false): string {
  if (flexible) return 'Flexible / to be discussed';
  if (!value.trim()) return 'Not decided yet';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value.trim();
  // Calendar components in UTC keep a selected date identical in every timezone.
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value)
    return 'Not decided yet';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatWhatsAppEnquiry(input: EnquiryMessage): string {
  const field = (label: string, value?: string) =>
    value?.trim() ? `${label}: ${value.trim()}` : '';
  const section = (heading: string, lines: (string | undefined)[]) => {
    const content = lines.filter((line) => line?.trim());
    return content.length ? `*${heading}*\n${content.join('\n')}` : '';
  };
  const numbered = (places: string[]) => places.map((place, i) => `${i + 1}. ${place}`);
  const days = (input.days || []).map((day) => [day.title, ...numbered(day.places)].join('\n'));
  const plan = [input.places?.length ? numbered(input.places).join('\n') : '', ...days]
    .filter(Boolean)
    .join('\n\n');
  return [
    `Hello Heavenly Tours & Travels,\nPlease help me ${input.trip ? 'plan this trip' : 'arrange this service'} and share a quote.`,
    section(input.trip ? 'TRIP DETAILS' : 'SERVICE DETAILS', [
      input.service !== 'Temple trip' || !input.trip ? field('Service', input.service) : '',
      field('Trip', input.trip),
      `Travel date: ${formatTravelDate(input.date, input.flexibleDate)}`,
      field('Travellers', `${input.people} people`),
      field(input.pickupLabel || 'Pickup', input.pickup),
      field(input.dropoffLabel || 'Drop-off', input.dropoff),
    ]),
    section('TRAVEL PREFERENCES', [
      field('Vehicle', input.vehicle),
      field('Travel style', input.travelStyle),
      field('Accommodation', input.accommodation),
    ]),
    plan
      ? `*${input.completeSevenTemples ? 'TEMPLES COVERED — ALL 7 INCLUDED' : 'TEMPLES COVERED'}*\n${plan}`
      : '',
    section('INCLUDED EXTRAS', input.includedExtras || []),
    section('CUSTOMER DETAILS', [field('Name', input.name), field('Phone', input.phone)]),
    section('ADDITIONAL REQUESTS', [input.notes?.trim()]),
    'Please confirm availability, the total quote, hotel options and pickup arrangements.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function whatsAppEnquiryUrl(message: string): string {
  return `https://wa.me/919700181493?text=${encodeURIComponent(message)}`;
}
