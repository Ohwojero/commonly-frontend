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
    eyebrow: 'Ritual & Care',
    tagline: 'Quiet luxury self-care & clinical science',
    description:
      'Clinical skincare, precision treatment tech, molecular bond repair, and fine fragrance for elevated daily rituals.',
    summaryPills: ['Skincare', 'Hair Tech', 'Devices'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85',
    catalogSlugs: [
      'personal-edit',
      'the-personal-edit',
      'luxury-skincare',
      'clinical-tech',
      'salon-hair',
      'fragrance-body',
      'face',
      'treatments',
      'hair',
      'body',
      'creams',
    ],
    subNiches: [
      {
        label: 'Luxury Skincare',
        slug: 'luxury-skincare',
        items: ['High-End Serums', 'Anti-Aging Matrices', 'Clinical Sun Care'],
      },
      {
        label: 'Clinical Tech',
        slug: 'clinical-tech',
        items: ['LED & Microcurrent Devices', 'At-Home Laser Systems'],
      },
      {
        label: 'Salon Hair',
        slug: 'salon-hair',
        items: ['Styling & Drying Tech', 'Molecular Bond Repair'],
      },
      {
        label: 'Fragrance & Body',
        slug: 'fragrance-body',
        items: ['High-End Fragrances', 'Luxury Body Oils'],
      },
    ],
    items: [
      'High-End Serums',
      'Anti-Aging Matrices',
      'Clinical Sun Care',
      'LED & Microcurrent Devices',
      'At-Home Laser Systems',
      'Styling & Drying Tech',
      'Molecular Bond Repair',
      'High-End Fragrances',
      'Luxury Body Oils',
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
      'Executive task seating, solid hardwood motorized desk systems, and custom mechanical layouts for sustained cognitive flow.',
    summaryPills: ['Herman Miller Chairs', 'Standing Desks', 'Mechanical Keyboards'],
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
          'Minimalist Leather Desk Pads',
        ],
      },
      {
        label: 'Peripheral Layouts',
        slug: 'peripheral-layouts',
        items: ['Custom Mechanical Keyboards', 'Ergonomic Vertical Mice'],
      },
    ],
    items: [
      'Ergonomic Task Chairs (Herman Miller, Steelcase)',
      'Mesh Task Seating',
      'Active Posture Stools',
      'Solid Wood Desk Tops',
      'Motorized Standing Frames',
      'Minimalist Leather Desk Pads',
      'Custom Mechanical Keyboards',
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