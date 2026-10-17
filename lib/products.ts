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
    slug: 'augustinus-bader-the-rich-cream',
    name: 'The Rich Cream with TFC8®',
    brand: 'Augustinus Bader',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'High-End Serums',
    subcategorySlug: 'high-end-serums',
    price: '$290.00',
    rating: '4.9',
    reviewCount: 318,
    views: 1420,
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1000&q=85',
    description: 'An intensely luxurious, deeply nourishing cream powered by patented TFC8 technology to support cellular renewal and barrier integrity.',
    tags: ['TFC8 Science', 'Award Winner', 'Clinical Hydration'],
    affiliateUrl: 'https://www.amazon.com/dp/B07P41S88D',
    prime: true,
    isSpotlight: false,
    highlights: ['Proprietary TFC8 trigger factor complex', 'Rich emollient balm texture', 'Diminishes redness and fine lines'],
    itemDetails: ['Size: 50ml / 1.7 fl oz', 'Packaging: Recyclable luxury glass jar'],
    specs: ['Use: Morning and evening', 'Dermatologist verified'],
  },
  {
    id: 'prod-2',
    slug: 'omnilux-contour-face-led',
    name: 'Contour Face LED Light Therapy Mask',
    brand: 'Omnilux',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'LED & Microcurrent Devices',
    subcategorySlug: 'led-microcurrent-devices',
    price: '$395.00',
    rating: '4.9',
    reviewCount: 420,
    views: 1850,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1000&q=85',
    description: 'The gold-standard medical grade flexible silicone LED mask utilizing clinically proven red (633nm) and near-infrared (830nm) wavelengths.',
    tags: ['Medical Grade', 'FDA Cleared', 'Collagen Stimulator'],
    affiliateUrl: 'https://www.amazon.com/dp/B08XJ8P86R',
    prime: true,
    isSpotlight: true,
    highlights: ['Dual matrix Red (633nm) & Near-Infrared (830nm)', 'Medical CE & FDA cleared', 'Flexible silicone ergonomic fit'],
    itemDetails: ['Technology: 132 Medical-Grade LEDs (633nm + 830nm)', 'Power: Rechargeable controller with USB-C'],
    specs: ['Optical output: 30mW/cm²', '10-minute auto timer'],
  },
  {
    id: 'prod-3',
    slug: 'eltamd-uv-clear-spf-46',
    name: 'UV Clear Broad-Spectrum SPF 46',
    brand: 'EltaMD',
    category: 'The Personal Edit',
    categorySlug: 'personal-edit',
    subcategory: 'Clinical Sun Care',
    subcategorySlug: 'clinical-sun-care',
    price: '$43.00',
    rating: '4.8',
    reviewCount: 1540,
    views: 1210,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=85',
    description: 'Oil-free transparent sunscreen formulated with high-purity niacinamide to calm blemish-prone skin while providing broad UVA/UVB defense.',
    tags: ['Dermatologist Standard', 'Niacinamide Actives', 'Non-Comedogenic'],
    affiliateUrl: 'https://www.amazon.com/dp/B002MSN3QQ',
    prime: true,
    isSpotlight: false,
    highlights: ['Transparent Zinc Oxide 9.0%', 'Calming 5.0% Niacinamide', 'Weightless residue-free finish'],
    itemDetails: ['Size: 1.7 oz airless pump', 'Formula: Oil-free & fragrance-free'],
    specs: ['Finish: Sheer silky matte', 'Broad spectrum UVA/UVB'],
  },

  // ── THE STUDIO EDIT ──
  {
    id: 'prod-4',
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
  {
    id: 'prod-5',
    slug: 'dell-ultrasharp-40-curved-5k',
    name: 'UltraSharp 40" Curved WUHD 5K Monitor (U4025QW)',
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
    isSpotlight: true,
    highlights: ['5120x2160 WUHD Resolution', 'IPS Black 2000:1 Contrast', '120Hz Refresh Rate with Ambient Light Sensor'],
    itemDetails: ['Screen Size: 40 Inches', 'Aspect Ratio: 21:9'],
    specs: ['Panel Type: IPS Black', 'Connectivity: Thunderbolt 4 (140W PD)'],
  },
  {
    id: 'prod-6',
    slug: 'sennheiser-hd-800-s',
    name: 'HD 800 S Reference Audiophile Headphones',
    brand: 'Sennheiser',
    category: 'The Studio Edit',
    categorySlug: 'studio-edit',
    subcategory: 'Audiophile Headphones',
    subcategorySlug: 'audiophile-headphones',
    price: '$1,799.00',
    rating: '4.9',
    reviewCount: 310,
    views: 1820,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    description: 'Engineered for absolute acoustic fidelity. 56mm Ring Radiator transducer technology delivering unmatched soundstage width and spatial separation.',
    tags: ['Open-Back', 'Audiophile', 'Spatial Acoustic'],
    affiliateUrl: 'https://www.amazon.com/dp/B00PXLX2JU',
    prime: true,
    isSpotlight: false,
    highlights: ['56mm Ring Radiator Dynamic Transducers', 'Acoustic absorber system', 'Handcrafted in Germany'],
    itemDetails: ['Impedance: 300 Ohms', 'Frequency Response: 4 - 51,000 Hz'],
    specs: ['Weight: 330g', 'Cable: 4.4mm Pentaconn & 6.35mm'],
  },

  // ── THE ERGONOMIC EDIT ──
  {
    id: 'prod-7',
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
    isSpotlight: true,
    highlights: ['Pellicle 8Z zone-calibrated suspension', 'Fully adjustable arms & PostureFit SL', 'Engineered in the USA'],
    itemDetails: ['Color: Graphite Frame & Mesh', 'Size: Size B (Medium)'],
    specs: ['Weight Capacity: 350 lbs', 'Warranty: 12-Year Official Coverage'],
  },
  {
    id: 'prod-8',
    slug: 'keychron-q1-pro-wireless-custom',
    name: 'Keychron Q1 Pro QMK/VIA Wireless Custom Keyboard',
    brand: 'Keychron',
    category: 'The Ergonomic Edit',
    categorySlug: 'ergonomic-edit',
    subcategory: 'Peripheral Layouts',
    subcategorySlug: 'peripheral-layouts',
    price: '$219.99',
    rating: '4.8',
    reviewCount: 410,
    views: 1420,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85',
    description: 'A full CNC machined 75% aluminum mechanical keyboard with double-gasket acoustic mounting, hot-swappable switches, and fully programmable QMK/VIA open firmware.',
    tags: ['Mechanical Keyboard', 'Double Gasket', 'QMK/VIA'],
    affiliateUrl: 'https://www.amazon.com/dp/B0BS5V43W6',
    prime: true,
    isSpotlight: false,
    highlights: ['6063 Aluminum CNC Body', 'Double Gasket Mount Sound Absorption', 'Bluetooth 5.1 & Type-C Wired'],
    itemDetails: ['Layout: 75%', 'Keycaps: KSA Profile Double-Shot PBT'],
    specs: ['Hot-swappable: 3-pin & 5-pin MX', 'Battery: 4000mAh'],
  },
  {
    id: 'prod-9',
    slug: 'logitech-mx-master-3s',
    name: 'MX Master 3S Ergonomic Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'The Ergonomic Edit',
    categorySlug: 'ergonomic-edit',
    subcategory: 'Peripheral Layouts',
    subcategorySlug: 'peripheral-layouts',
    price: '$99.99',
    rating: '4.9',
    reviewCount: 2200,
    views: 2900,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=85',
    description: 'Ergonomically sculpted silhouette designed to support the palm and wrist in an ideal neutral posture. Features MagSpeed electromagnetic scrolling and quiet clicks.',
    tags: ['Ergonomic Mouse', 'Quiet Clicks', '8K DPI Sensor'],
    affiliateUrl: 'https://www.amazon.com/dp/B09HM94VDS',
    prime: true,
    isSpotlight: false,
    highlights: ['8000 DPI Darkfield sensor', 'Quiet click switches', 'MagSpeed electromagnetic wheel'],
    itemDetails: ['Connection: Bluetooth Low Energy & Logi Bolt', 'Battery: Rechargeable USB-C fast charge'],
    specs: ['Battery: Up to 70 days per charge', 'Customizable buttons: 7'],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export default products
