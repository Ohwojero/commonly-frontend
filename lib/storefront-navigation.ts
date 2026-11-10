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
    label: 'The Everyday Tech Edit',
    slug: 'personal-edit',
    eyebrow: 'Connected Living & Mobility',
    tagline: 'Smart home, vehicle telematics & precision power systems',
    description:
      'Curated smart thermostats, 4K wireless security cameras, video doorbells, connected radar telemetry, precision steam ovens, and portable power stations.',
    summaryPills: ['Smart Thermostats', 'Security Cameras', 'Connected Radar'],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    catalogSlugs: [
      'personal-edit',
      'the-personal-edit',
      'smart-home-security',
      'vehicle-power-precision',
      'smart-thermostats',
      'smart-doorbells',
      'security-cameras',
      'escort-max-360c-mkii-connected-radar',
      'anova-precision-smart-combi-steam-oven',
      'ecoflow-delta-2-1024wh-lifepo4',
    ],
    subNiches: [
      {
        label: 'Smart Home & Security',
        slug: 'smart-home-security',
        items: [
          'Smart Thermostats',
          'Smart Doorbells',
          'Security Cameras',
        ],
      },
      {
        label: 'Vehicle, Power & Culinary',
        slug: 'vehicle-power-precision',
        items: [
          'Escort MAX 360c MKII Connected Radar',
          'Anova Precision Smart Combi Steam Oven',
          'EcoFlow DELTA 2 (1024Wh LiFePO4)',
        ],
      },
    ],
    items: [
      'Smart Thermostats',
      'Smart Doorbells',
      'Security Cameras',
      'Escort MAX 360c MKII Connected Radar',
      'Anova Precision Smart Combi Steam Oven',
      'EcoFlow DELTA 2 (1024Wh LiFePO4)',
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
      'Executive task seating, solid hardwood motorized desk systems, and heavy-duty monitor arm mounts for peak ergonomic posture and sustained cognitive flow.',
    summaryPills: ['Herman Miller Chairs', 'Standing Desks', 'Monitor Arm Mounts'],
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
        ],
      },
      {
        label: 'Peripheral Layouts',
        slug: 'peripheral-layouts',
        items: ['Ergonomic Vertical Mice', 'Smart Portable EV Charging Systems', '4K AI Smart Dash Cams'],
      },
    ],
    items: [
      'Ergonomic Task Chairs (Herman Miller, Steelcase)',
      'Mesh Task Seating',
      'Active Posture Stools',
      'Solid Wood Desk Tops',
      'Motorized Standing Frames',
      'Ergonomic Vertical Mice',
      'Smart Portable EV Charging Systems',
      '4K AI Smart Dash Cams',
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