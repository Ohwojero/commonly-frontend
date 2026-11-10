import type { ApiCategory } from '@/lib/api'
import type { Product } from '@/lib/products'

export type Category = {
  slug: string
  label: string
  eyebrow: string
  title: string
  description: string
  image: string
  tone: string
  items: string[] // subcategory labels
}

// ── Image map for subcategory hero images (managed dynamically via API) ──────

export const subcategoryImages: Record<string, string> = {
  'smart-thermostats': 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1400&q=85',
  'smart-doorbells': 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
  'security-cameras': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1400&q=85',
  'escort-max-360c-mkii-connected-radar': 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1400&q=85',
  'anova-precision-smart-combi-steam-oven': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=85',
  'ecoflow-delta-2-1024wh-lifepo4': 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1400&q=85',
  'executive-seating': 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=1400&q=85',
  'aesthetic-desk-systems': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85',
  'peripheral-layouts': 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1400&q=85',
  'ultra-wide-screens': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1400&q=85',
  'enterprise-docking-stations': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1400&q=85',
  'audiophile-headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=85',
  'smart-portable-ev-charging-systems': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=85',
}

export function getSubcategoryImage(subcategorySlug: string, categoryImage: string): string {
  return subcategoryImages[subcategorySlug] || categoryImage || 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85'
}

// ── Convert API category to frontend Category type ────────────────────────

export function apiCategoryToCategory(cat: ApiCategory): Category {
  return {
    slug: cat.slug,
    label: cat.label,
    eyebrow: cat.eyebrow,
    title: cat.title,
    description: cat.description,
    image: cat.image,
    tone: cat.tone,
    items: (cat.subcategories || []).map((s) => s.label),
  }
}

// ── Dynamic Categories Array ─────────────────────────────────────────────

export const categories: Category[] = []

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// ── Slug helpers ──────────────────────────────────────────────────────────

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function getCategoryProducts(category: Category, products: Product[]) {
  const matches = products.filter((product) => {
    const productCat = (product.categorySlug || product.category).toLowerCase()
    return productCat === category.slug || productCat.includes(category.slug)
  })
  return matches.length ? matches.slice(0, 8) : products.slice(0, 4)
}

export default categories
