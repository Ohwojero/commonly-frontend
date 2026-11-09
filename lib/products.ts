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
  // ── THE PERSONAL EDIT ──
  {
    id: 'prod-1',
    slug: 'vantrue-n4-pro-4k-dash-cam',
    name: 'N4 Pro 3-Channel 4K AI Dash Cam with Starvis 2',
    brand: 'Vantrue',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: '4K AI Smart Dash Cams',
    subcategorySlug: 'automotive-smart-tech',
    price: '$379.99',
    rating: '4.9',
    reviewCount: 840,
    views: 2100,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=85',
    description: 'Front 4K + Cabin 1080P + Rear 1080P triple recording powered by Sony STARVIS 2 IMX678 sensor with 5GHz Wi-Fi, GPS tracking, and 24/7 buffered parking mode.',
    tags: ['4K UHD', 'Sony Starvis 2', 'Automotive AI'],
    affiliateUrl: 'https://www.amazon.com/dp/B0C3GWZPVK',
    prime: true,
    isSpotlight: true,
    highlights: ['Sony STARVIS 2 IMX678 Image Sensor', '3-Channel Simultaneous 4K Recording', '5GHz Wi-Fi App & Voice Control'],
    itemDetails: ['Resolution: 4K (3840x2160) + 1080P + 1080P', 'Night Vision: NightPix Dual Sensor'],
    specs: ['Storage: MicroSD up to 512GB', 'Power: Supercapacitor 12V/24V'],
  },
  {
    id: 'prod-2',
    slug: 'schumacher-level-2-portable-ev-charger',
    name: 'Level 1 & Level 2 Smart Portable EV Charging System',
    brand: 'Schumacher',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart Portable EV Charging Systems',
    subcategorySlug: 'ev-charging-power',
    price: '$289.99',
    rating: '4.8',
    reviewCount: 620,
    views: 1850,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=85',
    description: 'Universal Level 1 & 2 dual-voltage portable electric vehicle charger. Up to 3x faster charging with 16A 240V output, NEMA 6-20 plug with 5-15 adapter, and weather-sealed IP66 construction.',
    tags: ['EV Charging', 'Dual Voltage', 'IP66 Weatherproof'],
    affiliateUrl: 'https://www.amazon.com/dp/B08XJ8P86R',
    prime: true,
    isSpotlight: false,
    highlights: ['Dual Voltage 120V / 240V Flexibility', 'Universal J1772 Connector with Tesla compatibility', 'Over-current, Surge & Thermal Safety Architecture'],
    itemDetails: ['Cable Length: 28 Feet', 'Power: Up to 3.8 kW / 16A'],
    specs: ['Rating: NEMA Type 6 / IP66', 'Weight: 8.5 lbs'],
  },
  {
    id: 'prod-3',
    slug: 'fellow-stagg-ekg-pro-studio',
    name: 'Stagg EKG Pro Studio Smart Precision Kettle',
    brand: 'Fellow',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Connected Smart Espresso Machines',
    subcategorySlug: 'smart-culinary-coffee',
    price: '$225.00',
    rating: '4.9',
    reviewCount: 1420,
    views: 2400,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?auto=format&fit=crop&w=1000&q=85',
    description: 'The pinnacle of pour-over extraction. Full-color LCD screen, precise degree-by-degree temperature control, WiFi schedule updates, and balanced fluted gooseneck spout.',
    tags: ['Smart Kitchen', 'Specialty Coffee', 'PID Temperature'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BFJZKHYZ',
    prime: true,
    isSpotlight: false,
    highlights: ['To-the-Degree PID Temperature Control', 'High-Res Full Color LCD Screen', 'WiFi Firmware Updates via Fellow App'],
    itemDetails: ['Capacity: 0.9 Liters', 'Body: 304 18/8 Stainless Steel & Glass Base'],
    specs: ['Power: 1200W Fast-Heat Element', 'Range: 104°F - 212°F (40°C - 100°C)'],
  },

  // ── AUTOMOTIVE SMART TECH — 4.5% Commission ──
  {
    id: 'prod-4',
    slug: 'rove-r2-4k-dual-dash-cam',
    name: 'ROVE R2-4K Dual Dash Cam — Front & Rear 4K + WiFi GPS',
    brand: 'ROVE',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: '4K AI Smart Dash Cams',
    subcategorySlug: '4k-ai-smart-dash-cams',
    price: '$149.99',
    rating: '4.8',
    reviewCount: 18400,
    views: 3800,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=85',
    description: 'Amazon\'s #1 bestselling dash cam. True 4K front + 1080p rear simultaneous recording with built-in WiFi, GPS speed logging, supercapacitor design, and voice controls.',
    tags: ['Amazon #1 Bestseller', '4K Dual Channel', 'Supercapacitor'],
    affiliateUrl: 'https://www.amazon.com/dp/B07M63H81H',
    prime: true,
    isSpotlight: true,
    highlights: ['Amazon #1 Bestseller in Dash Cams', '4K front + 1080p rear simultaneous recording', 'Supercapacitor — no failure in extreme heat'],
    itemDetails: ['Front: 4K UHD @ 30fps', 'Rear: 1080P @ 30fps'],
    specs: ['WiFi: Built-in', 'GPS: Built-in speed & location logger', 'Voice Control: Yes'],
  },
  {
    id: 'prod-5',
    slug: 'chargepoint-home-flex-50a',
    name: 'ChargePoint Home Flex Level 2 EV Charger — 50A WiFi',
    brand: 'ChargePoint',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart Portable EV Charging Systems',
    subcategorySlug: 'smart-portable-ev-charging-systems',
    price: '$549.00',
    rating: '4.8',
    reviewCount: 9200,
    views: 2200,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=1000&q=85',
    description: 'The gold standard home EV charger. Dynamically adjustable 16–50A output, 23-ft cable, NEMA 4X weatherproof rating, smart WiFi scheduling, and real-time energy tracking via the ChargePoint app.',
    tags: ['Level 2 EV Charger', 'WiFi Smart', 'NEMA 4X'],
    affiliateUrl: 'https://www.amazon.com/dp/B07RNYNMXG',
    prime: true,
    isSpotlight: false,
    highlights: ['Adjustable 16A–50A — 25 miles of range per hour', 'WiFi app scheduling & real-time energy tracking', 'NEMA 4X — indoor & outdoor rated'],
    itemDetails: ['Amperage: Up to 50A', 'Cord: 23 ft', 'Cert: UL Listed, ENERGY STAR, NEMA 4X'],
    specs: ['Compatibility: All J1772 EVs & PHEVs', 'App: ChargePoint iOS & Android'],
  },
  {
    id: 'prod-6',
    slug: 'carlinkit-5-wireless-carplay-adapter',
    name: 'Carlinkit 5.0 Wireless CarPlay & Android Auto Adapter',
    brand: 'Carlinkit',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Wireless CarPlay & Android Auto Adapters',
    subcategorySlug: 'wireless-carplay-android-auto-adapters',
    price: '$79.99',
    rating: '4.7',
    reviewCount: 12600,
    views: 2900,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=85',
    description: 'Convert any factory wired CarPlay or Android Auto head unit to fully wireless in seconds. Plug-in dongle with 5GHz WiFi + Bluetooth 5.0, connects in under 5 seconds, zero lag.',
    tags: ['Wireless CarPlay', 'Android Auto', 'Plug & Play'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BQWXMFC3',
    prime: true,
    isSpotlight: false,
    highlights: ['Works with all factory wired CarPlay & Android Auto', '5GHz WiFi + BT 5.0 — connects in under 5 seconds', 'No app or account needed — true plug & play'],
    itemDetails: ['Model: CPC200-CP2A (5.0)', 'Chip: Snapdragon 665'],
    specs: ['WiFi: 5GHz dual-band', 'Bluetooth: 5.0', 'Fits: 2016+ factory CarPlay/AA vehicles'],
  },

  // ── PRECISION CULINARY TECH — 4.5% Commission ──
  {
    id: 'prod-7',
    slug: 'anova-precision-cooker-3-wifi',
    name: 'Anova Culinary Precision Cooker 3.0 — WiFi Smart Sous Vide',
    brand: 'Anova',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart WiFi Sous-Vide Circulators',
    subcategorySlug: 'smart-wifi-sous-vide-circulators',
    price: '$199.00',
    rating: '4.8',
    reviewCount: 7400,
    views: 2600,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=85',
    description: 'The world\'s #1 sous vide cooker. Dual-band WiFi, IPX7 waterproof, 1200W fast heating, and the Anova app with 1,000+ guided recipes for precision cooking every time.',
    tags: ['Sous Vide', 'WiFi Smart', 'Precision Cooking'],
    affiliateUrl: 'https://www.amazon.com/dp/B08HQ1FXWG',
    prime: true,
    isSpotlight: false,
    highlights: ['Dual-band WiFi + Bluetooth app control', 'IPX7 fully waterproof rated', '1200W fast-heat to target temp in minutes'],
    itemDetails: ['Model: Precision Cooker 3.0', 'Connectivity: WiFi + Bluetooth'],
    specs: ['Power: 1200W', 'Temp Range: 32°F–197°F', 'Clamp: Fits pots up to 8.75" deep'],
  },
  {
    id: 'prod-8',
    slug: 'fanttik-x8-apex-smart-tire-inflator',
    name: 'Fanttik X8 Apex Smart Cordless Tire Inflator',
    brand: 'Fanttik',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: '4K AI Smart Dash Cams',
    subcategorySlug: '4k-ai-smart-dash-cams',
    price: '$89.99',
    rating: '4.8',
    reviewCount: 5100,
    views: 1750,
    image: 'https://images.unsplash.com/photo-1558618047-f4e70f20ed45?auto=format&fit=crop&w=1000&q=85',
    description: 'Professional-grade cordless tire inflator with digital precision pressure sensing, auto-shutoff at target PSI, 2× faster inflation, and USB-C fast charging.',
    tags: ['Smart Tire Inflator', 'Auto-Shutoff', 'Cordless'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BZ4BJVT3',
    prime: true,
    isSpotlight: false,
    highlights: ['Auto-shutoff at exact target PSI — no over-inflation', '2× faster than standard portable inflators', 'USB-C fast charge — 10 min = 4 car tires'],
    itemDetails: ['Max Pressure: 160 PSI', 'Display: Digital LCD'],
    specs: ['Noise: ≤75dB', 'Compatible: Car, bike, motorcycle, sports balls', 'Charge: USB-C'],
  },
  {
    id: 'prod-9',
    slug: 'wallbox-pulsar-plus-ev-charger',
    name: 'Wallbox Pulsar Plus 48A Level 2 EV Charger',
    brand: 'Wallbox',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Smart Portable EV Charging Systems',
    subcategorySlug: 'smart-portable-ev-charging-systems',
    price: '$299.00',
    rating: '4.7',
    reviewCount: 3800,
    views: 1900,
    image: 'https://images.unsplash.com/photo-1558618047-f4e70f20ed45?auto=format&fit=crop&w=1000&q=85',
    description: 'The most compact 48A Level 2 smart EV charger on the market. Bluetooth + WiFi with the myWallbox app for charge scheduling, tracking, and remote control.',
    tags: ['Compact EV Charger', 'Smart App', '48A'],
    affiliateUrl: 'https://www.amazon.com/dp/B08L5XKYTL',
    prime: true,
    isSpotlight: false,
    highlights: ['Most compact 48A charger available', 'Bluetooth + WiFi dual connectivity', 'Eco-Smart dynamic power sharing'],
    itemDetails: ['Amperage: 48A', 'Connector: J1772', 'Cord: 25 ft'],
    specs: ['Output: Up to 11.5kW', 'App: myWallbox iOS & Android'],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export default products
