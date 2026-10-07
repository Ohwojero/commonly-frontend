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

export const subcategoryImages: Record<string, string> = {}

export function getSubcategoryImage(subcategorySlug: string, categoryImage: string): string {
  return subcategoryImages[subcategorySlug] || categoryImage || '/luxury-placeholder.svg'
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
