export type StorefrontNavGroup = {
  label: string
  slug: string
  items: string[]
  description: string
  catalogSlugs: string[]
}

export const storefrontNavGroups: StorefrontNavGroup[] = [
  {
    label: 'Luxury Skincare',
    slug: 'luxury-skincare',
    items: ['Anti-Aging Matrices', 'High-End Serums', 'Clinical Sun Care', 'Hyperpigmentation'],
    description: 'Clinical actives, concentrated treatments, and daily protection for a considered routine.',
    catalogSlugs: ['face', 'creams'],
  },
  {
    label: 'Clinical Tech',
    slug: 'clinical-tech',
    items: ['LED & Microcurrent Devices', 'At-Home Laser Systems', 'Advanced Skin Tightening'],
    description: 'At-home devices and treatment technology selected for precision and consistent use.',
    catalogSlugs: ['treatments'],
  },
  {
    label: 'Salon Hair',
    slug: 'salon-hair',
    items: ['Styling & Drying Tech', 'Molecular Bond Repair', 'Premium Scalp & Growth'],
    description: 'Professional styling tools, bond care, and scalp-focused essentials.',
    catalogSlugs: ['hair'],
  },
  {
    label: 'Fragrance & Body',
    slug: 'fragrance-body',
    items: ['High-End Fragrances', 'Luxury Body Oils'],
    description: 'Expressive fragrance and elevated body care for the everyday ritual.',
    catalogSlugs: ['body'],
  },
]

export const storefrontNavSlug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')