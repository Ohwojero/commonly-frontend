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

export const products: Product[] = []
export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
export default products
