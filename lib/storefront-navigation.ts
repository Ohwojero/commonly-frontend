export type StorefrontSubNiche = {
  label: string
  slug: string
  items: string[]
}

export type StorefrontNavGroup = {
  label: string
  slug: string
  eyebrow?: string
  tagline: string
  description: string
  subNiches: StorefrontSubNiche[]
  items: string[]
  catalogSlugs: string[]
  image: string
  summaryPills: string[]
}

export const storefrontNavGroups: StorefrontNavGroup[] = [
  {
    label: 'The Personal Edit',
    slug: 'personal-edit',
    eyebrow: 'Mobility & Smart Tech',
    tagline: 'Intelligent personal gear, smart automotive & everyday tech',
    description:
      'High-fidelity 4K vision AI dash cams, portable EV smart charging systems, precision culinary tech, and artisan handcrafted docks.',
    summaryPills: ['4K Dash Cams', 'EV Chargers', 'Smart Kitchen Tech'],
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
    catalogSlugs: [
      'personal-edit',
      'the-personal-edit',
      'automotive-smart-tech',
      'ev-charging-power',
      'smart-culinary-coffee',
      'artisan-tech-docks',
      'dash-cams',
      'ev-chargers',
      'kitchen-tech',
      'docks',
    ],
    subNiches: [
      {
        label: 'Smart Automotive Tech',
        slug: 'automotive-smart-tech',
        items: [
          '4K AI Smart Dash Cams',
          'Wireless CarPlay & Android Auto Adapters',
          'Smart Vehicle Telematics & HUDs',
        ],
      },
      {
        label: 'Smart EV Charging & Power',
        slug: 'ev-charging-power',
        items: [
          'Smart Portable EV Charging Systems',
          'High-Wattage Pure Sine Inverters',
          'Level 2 Smart EV Charging Cables',
        ],
      },
      {
        label: 'Precision Culinary Tech',
        slug: 'smart-culinary-coffee',
        items: [
          'Connected Smart Espresso Machines',
          'Precision Wireless Smart Thermometers',
          'Smart WiFi Sous-Vide Circulators',
        ],
      },
      {
        label: 'Artisan Tech Docks',
        slug: 'artisan-tech-docks',
        items: [
          'Solid Walnut MagSafe Charging Docks',
          'Handcrafted Hardwood Laptop Risers',
          'Artisan Mechanical Desk Trays',
        ],
      },
    ],
    items: [
      '4K AI Smart Dash Cams',
      'Wireless CarPlay & Android Auto Adapters',
      'Smart Vehicle Telematics & HUDs',
      'Smart Portable EV Charging Systems',
      'High-Wattage Pure Sine Inverters',
      'Level 2 Smart EV Charging Cables',
      'Connected Smart Espresso Machines',
      'Precision Wireless Smart Thermometers',
      'Smart WiFi Sous-Vide Circulators',
      'Solid Walnut MagSafe Charging Docks',
      'Handcrafted Hardwood Laptop Risers',
      'Artisan Mechanical Desk Trays',
    ],
  },
  {
    label: 'The Studio Edit',
    slug: 'studio-edit',
    eyebrow: 'Compute & Sound',
    tagline: 'Peak developer productivity & acoustic precision',
    description:
      'Audiophile spatial monitoring, ultra-wide productivity displays, and high-throughput Thunderbolt infrastructure.',
    summaryPills: ['Monitors', 'Audio Monitors', 'Thunderbolt Infrastructure'],
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=85',
    catalogSlugs: [
      'studio-edit',
      'the-studio-edit',
      'acoustic-audio',
      'productivity-displays',
      'thunderbolt-hubs-compute',
      'audio',
      'displays',
      'compute',
    ],
    subNiches: [
      {
        label: 'Acoustic & Audio',
        slug: 'acoustic-audio',
        items: ['Audiophile Headphones', 'Spatial Audio', 'Desktop Monitors (Speakers)'],
      },
      {
        label: 'Productivity Displays',
        slug: 'productivity-displays',
        items: ['Ultra-Wide Screens', 'Vertical Coding Displays', 'Heavy-Duty Arm Mounts'],
      },
      {
        label: 'Thunderbolt Hubs & Compute',
        slug: 'thunderbolt-hubs-compute',
        items: ['Enterprise Docking Stations', 'External SSD Hubs', 'Developer Cable Matrices'],
      },
    ],
    items: [
      'Audiophile Headphones',
      'Spatial Audio',
      'Desktop Monitors (Speakers)',
      'Ultra-Wide Screens',
      'Vertical Coding Displays',
      'Heavy-Duty Arm Mounts',
      'Enterprise Docking Stations',
      'External SSD Hubs',
      'Developer Cable Matrices',
    ],
  },
  {
    label: 'The Ergonomic Edit',
    slug: 'ergonomic-edit',
    eyebrow: 'Posture & Tactile',
    tagline: 'Engineered seating, standing desks & tactile layouts',
    description:
      'Executive task seating, solid hardwood motorized desk systems, and smart EV charging & portable power for sustained, mobile-ready cognitive flow.',
    summaryPills: ['Herman Miller Chairs', 'Standing Desks', 'EV Charging Systems'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85',
    catalogSlugs: [
      'ergonomic-edit',
      'the-ergonomic-edit',
      'executive-seating',
      'aesthetic-desk-systems',
      'peripheral-layouts',
      'seating',
      'desks',
      'peripherals',
    ],
    subNiches: [
      {
        label: 'Executive Seating',
        slug: 'executive-seating',
        items: [
          'Ergonomic Task Chairs (Herman Miller, Steelcase)',
          'Mesh Task Seating',
          'Active Posture Stools',
        ],
      },
      {
        label: 'Aesthetic Desk Systems',
        slug: 'aesthetic-desk-systems',
        items: [
          'Solid Wood Desk Tops',
          'Motorized Standing Frames',
          '4K AI Smart Dash Cams',
        ],
      },
      {
        label: 'Peripheral Layouts',
        slug: 'peripheral-layouts',
        items: ['Smart Portable EV Charging Systems', 'Ergonomic Vertical Mice'],
      },
    ],
    items: [
      'Ergonomic Task Chairs (Herman Miller, Steelcase)',
      'Mesh Task Seating',
      'Active Posture Stools',
      'Solid Wood Desk Tops',
      'Motorized Standing Frames',
      '4K AI Smart Dash Cams',
      'Smart Portable EV Charging Systems',
      'Ergonomic Vertical Mice',
    ],
  },
]

export const storefrontNavSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export function getNavGroupBySlug(slug: string): StorefrontNavGroup | undefined {
  const normalized = slug.toLowerCase().trim()
  return storefrontNavGroups.find((g) => {
    if (g.slug === normalized) return true
    if (`the-${g.slug}` === normalized) return true
    if (g.label.toLowerCase() === normalized) return true
    if (g.catalogSlugs.includes(normalized)) return true
    if (g.subNiches?.some((sn) => sn.slug === normalized || sn.label.toLowerCase() === normalized))
      return true
    return false
  })
}

export function resolveCatalogSlugs(slug: string): string[] {
  const group = getNavGroupBySlug(slug)
  return group ? group.catalogSlugs : [slug.toLowerCase().trim()]
}