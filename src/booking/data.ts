export const SERVICES = [
  'Temple tour',
  'Group package',
  'Domestic / international flights',
  'Hotel & accommodation',
  'Airport / railway pickup & drop',
  'Local sightseeing / outstation travel',
  'Custom multi-day South India tour',
] as const;
export const SERVICE_LABELS: Record<string, string> = {
  'Temple tour': 'Temple trip',
  'Group package': 'Group trip',
  'Domestic / international flights': 'Flight tickets',
  'Hotel & accommodation': 'Hotel stays',
  'Airport / railway pickup & drop': 'Airport / station pickup',
  'Local sightseeing / outstation travel': 'Local visits / travel to other cities',
  'Custom multi-day South India tour': 'Trip with your own temple stops',
};
export const ACCOMMODATIONS = ['Deluxe (Budget)', 'Exclusive', 'Premium'] as const;
export const PACKAGES: TravelPackage[] = [
  {
    id: 'seven-temple',
    name: 'Complete 7-Temple Trip',
    type: 'signature',
    image: 'assets/tirumala.webp',
    note: 'All seven temples are included. Free extras: pickup and drop for your trip, plus help planning your temple visits.',
    places: [
      'Sri Venkateswara Temple — Tirumala',
      'Sri Padmavathi Ammavari Temple — Tiruchanur',
      'Sri Kalahasteeswara Temple — Srikalahasti',
      'Sri Varasiddhi Vinayaka Temple — Kanipakam',
      'Sri Lakshmi Narayani Golden Temple — Vellore',
      'Sri Kamakshi Amman Temple — Kanchipuram',
      'Sri Arunachaleswarar Temple — Tiruvannamalai',
    ],
    days: [],
  },
  {
    id: 'tour-1',
    name: 'Express Package',
    type: 'tour',
    image: 'assets/tirumala.webp',
    note: 'Pickup in Tirupati, travel to Tirumala, nearby temple visits if time allows, and a return drop.',
    places: [
      'Tirupati arrival and pickup',
      'Travel to Tirumala',
      'Nearby temple visits, if time allows',
      'Return drop',
      'Good for a short visit',
    ],
    days: [],
  },
  {
    id: 'tour-2',
    name: 'Govindham Package',
    type: 'tour',
    image: 'assets/padmavathi.webp',
    note: 'Visit Tirupati, Tirumala and nearby temples with your family. We help with hotels and travel.',
    places: [
      'Tirupati and Tirumala',
      'Padmavathi Temple',
      'Govindaraja Swamy Temple',
      'Kapila Theertham',
      'Help with hotels, pickup and drop',
    ],
    days: [],
  },
  {
    id: 'tour-3',
    name: 'Divine Pilgrimage Package',
    type: 'tour',
    image: 'assets/srikalahasti.webp',
    note: 'Visit Tirumala, Srikalahasti, Kanipakam and Tiruchanur, with local temple visits arranged around your route.',
    places: ['Tirumala', 'Srikalahasti', 'Kanipakam', 'Tiruchanur', 'Local temple visits'],
    days: [],
  },
  {
    id: 'tour-4',
    name: 'Wholesome Pilgrim Package',
    type: 'tour',
    image: 'assets/vellore.webp',
    note: 'Connect Tirupati, Tirumala and Srikalahasti with the Golden Temple in Vellore. Kanchipuram can be added on request.',
    places: [
      'Tirupati',
      'Tirumala',
      'Srikalahasti',
      'Golden Temple, Vellore',
      'Optional Kanchipuram',
    ],
    days: [],
  },
  {
    id: 'tour-5',
    name: 'South Indian Package',
    type: 'tour',
    image: 'assets/srirangam.webp',
    note: 'Visit South India from Tirupati to Rameswaram, Kanyakumari and Trivandrum, including Chidambaram and Thanjavur. Our team will help plan the days you need.',
    places: [
      'Tirupati',
      'Kanchipuram',
      'Tiruvannamalai',
      'Srirangam',
      'Madurai',
      'Rameswaram',
      'Kanyakumari',
      'Chidambaram',
      'Thanjavur (Tanjore)',
      'Trivandrum (Thiruvananthapuram)',
    ],
    days: [],
  },
  {
    id: 'tour-6',
    name: 'Jyotirlingas Package',
    type: 'tour',
    image: 'assets/somnath.webp',
    note: 'Visit the 12 Jyotirlinga shrines across India. Our team will confirm dates, travel arrangements and your preferred Vaidyanath and Nageshwar locations.',
    places: [
      'Somnath — Prabhas Patan, Gujarat',
      'Mallikarjuna — Srisailam, Andhra Pradesh',
      'Mahakaleshwar — Ujjain, Madhya Pradesh',
      'Omkareshwar — Khandwa, Madhya Pradesh',
      'Kedarnath — Uttarakhand',
      'Bhimashankar — Maharashtra',
      'Kashi Vishwanath — Varanasi, Uttar Pradesh',
      'Trimbakeshwar — Nashik, Maharashtra',
      'Vaidyanath — Deoghar, Jharkhand or Parli Vaijnath, Maharashtra',
      'Nageshwar — Dwarka, Gujarat or Aundha Nagnath, Maharashtra',
      'Rameshwaram — Rameswaram, Tamil Nadu',
      'Grishneshwar — Chhatrapati Sambhajinagar, Maharashtra',
    ],
    days: [],
  },
  {
    id: 'tour-7',
    name: 'Pancha Bhoota Lingas Package',
    type: 'tour',
    image: 'assets/srikalahasti.webp',
    note: 'Visit all five Pancha Bhoota temples: Earth, Water, Fire, Air and Space. We help plan the route and travel arrangements.',
    places: [
      'Earth (Prithvi) — Ekambareswarar Temple, Kanchipuram, Tamil Nadu; a sand lingam',
      'Water (Jala) — Jambukeshwarar Temple, Thiruvanaikaval, Trichy, Tamil Nadu; a spring beneath the lingam',
      'Fire (Agni) — Arunachaleswarar Temple, Tiruvannamalai, Tamil Nadu; Shiva worshipped as fire',
      'Air (Vayu) — Sri Kalahasteeswara Temple, Srikalahasti, Andhra Pradesh; associated with the flickering sanctum lamp',
      'Space (Akasha) — Thillai Nataraja Temple, Chidambaram, Tamil Nadu; the Chidambara Rahasya and Lord Nataraja',
    ],
    days: [],
  },
  {
    id: 'days-1',
    name: 'One-day trip',
    type: 'days',
    duration: 1,
    image: 'assets/padmavathi.webp',
    note: 'Darshan ticket already booked.',
    places: ['Padmavathi Temple', 'Varahaswamy Temple', 'Govindaraja Temple', 'Tirumala darshan'],
    days: [],
  },
  {
    id: 'days-2',
    name: 'Two-day trip',
    type: 'days',
    duration: 2,
    image: 'assets/srikalahasti.webp',
    note: 'Tirumala, Tirupati local temples and Srikalahasti.',
    places: [
      'Tirumala darshan',
      'Varahaswamy darshan',
      'Tirupati local temples: Padmavathi, Govindaraja, Kapileswar and ISKCON',
      'Sri Kalahasti Shiva Temple',
    ],
    days: [],
  },
  {
    id: 'days-3',
    name: 'Three-day trip',
    type: 'days',
    duration: 3,
    image: 'assets/tirumala.webp',
    note: 'Tirumala, Vellore and the temples around Tirupati.',
    places: [],
    days: [
      {
        title: 'Day 1',
        places: ['Tirumala darshan', 'Varahaswamy darshan', 'Tirumala sightseeing'],
      },
      {
        title: 'Day 2',
        places: [
          'Golden Temple, Vellore',
          'Kanipakam Ganesh Temple',
          'Srinivasamangapuram Temple',
          'Vakulamatha Temple',
        ],
      },
      {
        title: 'Day 3',
        places: [
          'Tirupati local temples: Padmavathi, Govindaraja, Kapileswar and ISKCON',
          'Sri Kalahasti Shiva Temple',
        ],
      },
    ],
  },
  {
    id: 'days-4',
    name: 'Four-day trip',
    type: 'days',
    duration: 4,
    image: 'assets/vellore.webp',
    note: 'Temple visits with a night in Tiruvannamalai.',
    places: [],
    days: [
      {
        title: 'Day 1',
        places: ['Tirumala darshan', 'Tirumala sightseeing'],
      },
      {
        title: 'Day 2',
        places: ['Arunachaleswarar Temple, Tiruvannamalai', 'Night stay at Tiruvannamalai'],
      },
      {
        title: 'Day 3',
        places: [
          'Golden Temple, Vellore',
          'Kanipakam Ganesh Temple',
          'Srinivasamangapuram Temple',
          'Vakulamatha Temple',
        ],
      },
      {
        title: 'Day 4',
        places: [
          'Tirupati local temples: Padmavathi, Govindaraja, Kapileswar and ISKCON',
          'Sri Kalahasti Shiva Temple',
        ],
      },
    ],
  },
  {
    id: 'days-5',
    name: 'Five-day trip',
    type: 'days',
    duration: 5,
    image: 'assets/hilltop.webp',
    note: 'A five-day temple trip with Kanchipuram and Thiruthani.',
    places: [],
    days: [
      {
        title: 'Day 1',
        places: ['Tirumala darshan', 'Tirumala sightseeing'],
      },
      {
        title: 'Day 2',
        places: ['Arunachaleswarar Temple, Tiruvannamalai', 'Night stay at Tiruvannamalai'],
      },
      {
        title: 'Day 3',
        places: [
          'Golden Temple, Vellore',
          'Kanipakam Ganesh Temple',
          'Srinivasamangapuram Temple',
          'Vakulamatha Temple',
        ],
      },
      {
        title: 'Day 4',
        places: [
          'Tirupati local temples: Padmavathi, Govindaraja, Kapileswar and ISKCON',
          'Sri Kalahasti Shiva Temple',
        ],
      },
      {
        title: 'Day 5',
        places: ['Kanchipuram temples — 3 temples', 'Thiruthani Temple'],
      },
    ],
  },
];
export const FLEET = [
  {
    id: 'maruti-s-cross',
    name: 'Maruti S-Cross',
    tag: 'More room',
    description: 'A roomy option for families and additional luggage.',
    photos: [{ src: '/assets/vehicles/maruti-s-cross.webp', label: 'Maruti S-Cross' }],
  },
  {
    id: 'innova-crysta',
    name: 'Innova Crysta',
    tag: 'More room',
    description: 'A roomy option for families and additional luggage.',
    photos: [{ src: '/assets/vehicles/innova.webp', label: 'Innova Crysta' }],
  },
  {
    id: 'innova',
    name: 'Innova',
    tag: 'More room',
    description: 'A roomy option for families and additional luggage.',
    photos: [{ src: '/assets/vehicles/innova.webp', label: 'Innova' }],
  },
  {
    id: 'ertiga',
    name: 'Ertiga',
    tag: 'More room',
    description: 'A roomy option for families and additional luggage.',
    photos: [{ src: '/assets/vehicles/ertiga.webp', label: 'Ertiga' }],
  },
  {
    id: 'tempo-traveller',
    name: 'Tempo Traveller',
    tag: 'Travel together',
    description: 'For families and groups travelling together.',
    photos: [{ src: '/assets/vehicles/tempo-traveller.webp', label: 'Tempo Traveller' }],
  },
  {
    id: 'toyota-etios',
    name: 'Toyota Etios',
    tag: 'Small groups',
    description: 'A comfortable car for a small group.',
    photos: [{ src: '/assets/vehicles/toyota-etios.webp', label: 'Toyota Etios' }],
  },
  {
    id: 'swift-dzire',
    name: 'Swift Dzire',
    tag: 'Small groups',
    description: 'A comfortable car for a small group.',
    photos: [{ src: '/assets/vehicles/swift-dzire.webp', label: 'Swift Dzire' }],
  },
] as const;

export type TravelPackage = {
  id: string;
  name: string;
  type: string;
  image: string;
  note: string;
  duration?: number;
  places: string[];
  days: { title: string; places: string[] }[];
};
export const DAY_PACKAGES = PACKAGES.filter((p) => p.type === 'days');
export type VehicleId = (typeof FLEET)[number]['id'];
export interface LegacySnapshot {
  service: string;
  vehicle: string;
  tour: string;
  tourName: string;
  people: string;
  date: string;
  pickup: string;
  name: string;
  accommodation: string;
}
export interface LegacyBridge {
  get: () => LegacySnapshot;
  setService: (value: string) => void;
  setVehicle: (index: number) => void;
  setFiveDay: () => void;
}
declare global {
  interface Window {
    HeavenlyTrip?: LegacyBridge;
    heavenlyMotionAllowed?: () => boolean;
  }
}
