// ── Product types ─────────────────────────────────────────────────────────
// These types mirror what the NestJS API returns (mapped for frontend display)

export type Product = {
  id: string
  slug: string
  name: string
  brand: string
  category: string        // derived from subcategory.category.label
  subcategory?: string    // subcategory.label
  subcategorySlug?: string
  categorySlug?: string
  price: string           // formatted as "$XXX.XX"
  rating: string          // formatted as "X.X"
  reviewCount: number
  views: number
  image: string
  images?: string[]
  description: string
  tags: string[]
  affiliateUrl?: string
  prime?: boolean
  isSpotlight?: boolean
  highlights?: string[]
  itemDetails?: string[]
  specs?: string[]
  asin?: string
}

// ── Format helpers ─────────────────────────────────────────────────────────

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value)

export const products: Product[] = [
  // ── THE EVERYDAY TECH EDIT (The 6 Curated Essentials) ──
  {
    id: 'prod-1',
    slug: 'ecobee-smart-thermostat-premium',
    name: 'ecobee Smart Thermostat Premium with SmartSensor & Air Quality Monitor',
    brand: 'ecobee',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart Thermostats',
    subcategorySlug: 'smart-thermostats',
    price: '$249.99',
    rating: '4.8',
    reviewCount: 7850,
    views: 3100,
    image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1000&q=85',
    description: 'Transform home energy efficiency with high-precision radar occupancy sensing, built-in indoor air quality monitoring, and an included SmartSensor to eliminate hot or cold spots across living zones.',
    tags: ['Smart Thermostat', 'Air Quality', 'ENERGY STAR'],
    affiliateUrl: 'https://www.amazon.com/dp/B09XXS4MV7',
    prime: true,
    isSpotlight: true,
    highlights: ['Built-in Air Quality Monitor & Smoke Alarm Detection', 'SmartSensor included to balance hot and cold spots', 'Works with Apple HomeKit, Alexa, Google Assistant'],
    itemDetails: ['Screen: 4-inch Glass Touch Display (540x540)', 'C-Wire Required: Power Extender Kit Included in Box'],
    specs: ['Sensory Array: Radar Occupancy, VOC & CO2 Air Quality, Humidity', 'Connectivity: Dual-Band Wi-Fi 2.4/5GHz + Bluetooth'],
  },
  {
    id: 'prod-2',
    slug: 'ring-video-doorbell-pro-2',
    name: 'Ring Video Doorbell Pro 2 — 1536p HD Head-to-Toe Video with 3D Motion Detection',
    brand: 'Ring',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart Doorbells',
    subcategorySlug: 'smart-doorbells',
    price: '$249.99',
    rating: '4.7',
    reviewCount: 14200,
    views: 3450,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=85',
    description: 'Premium wired doorbell camera featuring 1536p HD Head-to-Toe video that lets you see packages on your doorstep. Powered by 3D Motion Detection with radar-guided Bird\'s Eye View tracking.',
    tags: ['Video Doorbell', 'Head-to-Toe HD', '3D Radar Detection'],
    affiliateUrl: 'https://www.amazon.com/dp/B086Q54K53',
    prime: true,
    isSpotlight: false,
    highlights: ['Head-to-Toe 1536p HD Video with color night vision', '3D Motion Detection with Bird\'s Eye View radar mapping', 'Two-way talk with Audio+ noise cancellation'],
    itemDetails: ['Power: Hardwired (16-24 VAC doorbell transformer)', 'Field of View: 150° Horizontal, 150° Vertical'],
    specs: ['Resolution: 1536p HD Video', 'Audio: Two-Way Audio with Audio+'],
  },
  {
    id: 'prod-3',
    slug: 'eufycam-s330-4k-solar-security-system',
    name: 'eufy Security eufyCam S330 (eufyCam 3) 4K Wireless Solar Security System (2-Cam Kit)',
    brand: 'eufy Security',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Security Cameras',
    subcategorySlug: 'security-cameras',
    price: '$469.99',
    rating: '4.8',
    reviewCount: 3950,
    views: 2900,
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1000&q=85',
    description: '4K Ultra HD wireless security camera kit with integrated Forever Power solar panels requiring just 2 hours of direct sunlight per day. Local BionicMind AI facial recognition filters out family from strangers with zero monthly fees.',
    tags: ['4K Solar Security', 'BionicMind AI', 'Zero Monthly Fees'],
    affiliateUrl: 'https://www.amazon.com/dp/B0B1L4GZQJ',
    prime: true,
    isSpotlight: false,
    highlights: ['4K Ultra HD detail with Forever Power solar panel', 'BionicMind AI facial recognition filters non-threats', 'Expandable local storage up to 16TB — zero monthly fees'],
    itemDetails: ['Included: 2x eufyCam S330 Cameras + 1x HomeBase 3', 'Battery: 13,000mAh with Integrated Solar Panel'],
    specs: ['Weather Resistance: IP67 Waterproof', 'Storage: 16GB EMMC on HomeBase 3, Expandable via 2.5" HDD/SSD'],
  },
  {
    id: 'prod-4',
    slug: 'escort-max-360c-mkii-radar',
    name: 'Escort MAX 360c MKII Connected Laser Radar Detector',
    brand: 'Escort',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Escort MAX 360c MKII Connected Radar',
    subcategorySlug: 'escort-max-360c-mkii-connected-radar',
    price: '$699.95',
    rating: '4.8',
    reviewCount: 3120,
    views: 2200,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=85',
    description: 'The benchmark in vehicle situational intelligence. 360° directional arrow threat detection, dual-antenna BlackFin DSP processor, AutoLearn AI false alert filtering, and live shared radar telemetry via connected cloud Wi-Fi.',
    tags: ['360 Telematics', 'AutoLearn AI', 'Connected Radar'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BH32N66L',
    prime: true,
    isSpotlight: false,
    highlights: ['360° Directional Arrows pinpoint threat source instantly', 'AutoLearn AI uses GPS to eliminate false alerts over time', 'Built-in Wi-Fi connects to Escort Live community alerts'],
    itemDetails: ['Processor: BlackFin 547 DSP', 'Display: Multi-Color OLED Graphic'],
    specs: ['Radar Coverage: X, K, Ka, SuperWide, Laser', 'GPS: TrueLock & Speed Camera Database'],
  },
  {
    id: 'prod-5',
    slug: 'anova-precision-oven-combi-steam',
    name: 'Anova Precision Smart Combi Steam Oven with WiFi & App Control',
    brand: 'Anova',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Anova Precision Smart Combi Steam Oven',
    subcategorySlug: 'anova-precision-smart-combi-steam-oven',
    price: '$699.99',
    rating: '4.8',
    reviewCount: 1650,
    views: 2400,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=85',
    description: 'Professional combi steam cooking brought to the countertop. Sous-vide without the bag via precision temperature and wet-bulb humidity sensors. Dual-band WiFi with mobile app multi-stage cook recipes.',
    tags: ['Combi Steam', 'Bagless Sous-Vide', 'WiFi Smart'],
    affiliateUrl: 'https://www.amazon.com/dp/B08HR9KMSZ',
    prime: true,
    isSpotlight: false,
    highlights: ['Bagless sous-vide mode with wet-bulb humidity control', 'Continuous steam injection from external 1.3L water tank', 'Multipoint food probe with app graph monitoring'],
    itemDetails: ['Capacity: 1.2 cu ft (fits a 12lb turkey)', 'Connectivity: Wi-Fi 2.4 GHz iOS/Android App'],
    specs: ['Temp Range: 77°F–482°F (25°C–250°C)', 'Heating: 5 Independent Heating Elements'],
  },
  {
    id: 'prod-6',
    slug: 'ecoflow-delta-2-power-station',
    name: 'EcoFlow DELTA 2 Smart Portable Power Station — 1024Wh LiFePO4 1800W',
    brand: 'EcoFlow',
    category: 'The Everyday Tech Edit',
    categorySlug: 'personal-edit',
    subcategory: 'EcoFlow DELTA 2 (1024Wh LiFePO4)',
    subcategorySlug: 'ecoflow-delta-2-1024wh-lifepo4',
    price: '$699.00',
    rating: '4.8',
    reviewCount: 6890,
    views: 3150,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=85',
    description: 'High-output 1024Wh LiFePO4 smart portable energy system. 1800W pure sine wave AC output (2700W surge) to power 90% of home appliances and studio workstations. 0-80% ultra-fast X-Stream charging in just 50 minutes with full app telemetry.',
    tags: ['LiFePO4 Battery', '1800W Pure Sine', 'X-Stream Fast Charge'],
    affiliateUrl: 'https://www.amazon.com/dp/B0B9X3R7PN',
    prime: true,
    isSpotlight: false,
    highlights: ['LiFePO4 Chemistry: 3,000+ full cycles to 80% capacity', '1800W AC output powers 15 devices simultaneously', '0 to 80% recharge in 50 minutes via AC wall outlet'],
    itemDetails: ['Capacity: 1024Wh (Expandable to 3040Wh)', 'Outputs: 6x AC Outlets, 2x USB-C 100W PD'],
    specs: ['Solar Input: Up to 500W (11-60V)', 'App Control: Wi-Fi & Bluetooth App Monitoring'],
  },

  // ── THE STUDIO EDIT ──
  {
    id: 'prod-7',
    slug: 'dell-ultrasharp-40-curved-5k',
    name: 'Dell UltraSharp 40" Curved WUHD 5K Monitor (U4025QW)',
    brand: 'Dell',
    category: 'The Studio Edit',
    categorySlug: 'studio-edit',
    subcategory: 'Ultra-Wide Screens',
    subcategorySlug: 'ultra-wide-screens',
    price: '$1,799.99',
    rating: '4.9',
    reviewCount: 180,
    views: 2150,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85',
    description: 'The premier panoramic coding display featuring 5120 x 2160 WUHD resolution, IPS Black technology for 2000:1 contrast, and 120Hz smooth scrolling.',
    tags: ['Ultra-Wide', 'Coding Display', 'IPS Black 120Hz'],
    affiliateUrl: 'https://www.amazon.com/dp/B0CT41S99V',
    prime: true,
    isSpotlight: false,
    highlights: ['5120x2160 WUHD Resolution', 'IPS Black 2000:1 Contrast', '120Hz Refresh Rate with Ambient Light Sensor'],
    itemDetails: ['Screen Size: 40 Inches', 'Aspect Ratio: 21:9'],
    specs: ['Panel Type: IPS Black', 'Connectivity: Thunderbolt 4 (140W PD)'],
  },
  {
    id: 'prod-8',
    slug: 'caldigit-ts4-thunderbolt-4-dock',
    name: 'TS4 Thunderbolt 4 18-Port Enterprise Dock',
    brand: 'CalDigit',
    category: 'The Studio Edit',
    categorySlug: 'studio-edit',
    subcategory: 'Enterprise Docking Stations',
    subcategorySlug: 'enterprise-docking-stations',
    price: '$399.95',
    rating: '4.8',
    reviewCount: 650,
    views: 2450,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=85',
    description: 'The industry benchmark for developer workstations. 18 ports of extreme connectivity with 98W Power Delivery, UHS-II SD cards, and 2.5 Gigabit Ethernet.',
    tags: ['Thunderbolt 4', 'Developer Setup', '98W Power Delivery'],
    affiliateUrl: 'https://www.amazon.com/dp/B09GK8PTB7',
    prime: true,
    isSpotlight: false,
    highlights: ['18 Ports of expansion', '98W Host Power Delivery', '2.5GbE Ethernet'],
    itemDetails: ['Color: Space Gray Aluminum', 'Model: TS4-US-AMZ'],
    specs: ['Interface: Thunderbolt 4', 'Max Resolution: Up to Single 8K or Dual 6K 60Hz'],
  },

  // ── THE ERGONOMIC EDIT ──
  {
    id: 'prod-9',
    slug: 'herman-miller-aeron-chair',
    name: 'Aeron Ergonomic Task Chair (Graphite)',
    brand: 'Herman Miller',
    category: 'The Ergonomic Edit',
    categorySlug: 'ergonomic-edit',
    subcategory: 'Executive Seating',
    subcategorySlug: 'executive-seating',
    price: '$1,805.00',
    rating: '4.9',
    reviewCount: 890,
    views: 3100,
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=1000&q=85',
    description: 'The defining icon of ergonomic seating. Pellicle 8Z breathable elastomer suspension distributes weight evenly, while PostureFit SL supports the sacrum and spine.',
    tags: ['Ergonomic Icon', 'Herman Miller', 'PostureFit SL'],
    affiliateUrl: 'https://www.amazon.com/dp/B0735BPB58',
    prime: true,
    isSpotlight: false,
    highlights: ['Pellicle 8Z zone-calibrated suspension', 'Fully adjustable arms & PostureFit SL', 'Engineered in the USA'],
    itemDetails: ['Color: Graphite Frame & Mesh', 'Size: Size B (Medium)'],
    specs: ['Weight Capacity: 350 lbs', 'Warranty: 12-Year Official Coverage'],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export const LEGACY_DUMMY_SLUGS = new Set([
  'omnilux-contour-face',
  'eltamd-uv-clear-spf-46',
  'supergoop-unseen-sunscreen',
  'nuface-trinity-plus',
  'augustinus-bader-the-rich-cream',
  'baccarat-rouge-540-extrait',
  'vantrue-n4-pro-4k-dash-cam',
  'schumacher-level-2-portable-ev-charger',
  'fellow-stagg-ekg-pro-studio',
  'garmin-dash-cam-67w',
  '70mai-a800s-4k-dual-dash-cam',
  'blink-ev-charger-level2-48a',
  'wallbox-pulsar-plus-ev-charger',
  'breville-barista-express-impress',
  'anker-solix-c300-portable-power-station',
  'carlinkit-5-wireless-carplay-adapter',
  'fanttik-x8-apex-smart-tire-inflator',
  'rove-r2-4k-dual-dash-cam',
  'anova-precision-cooker-3-wifi',
  'keychron-q1-pro-wireless-custom',
  'logitech-mx-master-3s',
  'tesla-universal-wall-connector',
  'blackvue-dr970x-2ch-plus-4k',
  'breville-barista-touch-impress',
  'chargepoint-home-flex-50a',
])

export function isNotDummyProduct(slug?: string): boolean {
  return !slug || !LEGACY_DUMMY_SLUGS.has(slug)
}

export default products
