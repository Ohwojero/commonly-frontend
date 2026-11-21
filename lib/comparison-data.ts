export interface ComparisonContender {
  name: string
  brand: string
  slug?: string
  price: string
  rating: string
  reviewCount: number
  image: string
  affiliateUrl: string
  badge?: string
  isWinner?: boolean
  specs: Record<string, string>
  pros: string[]
  cons: string[]
  verdict: string
}

export interface ComparisonGuide {
  id: string
  title: string
  subtitle: string
  eyebrow: string
  relatedCategorySlugs: string[]
  relatedProductSlugs: string[]
  specDefinitions: { key: string; label: string }[]
  contenders: ComparisonContender[]
  bottomLine: string
}

export const comparisonGuides: ComparisonGuide[] = []

export function getComparisonGuideForProduct(slug: string): ComparisonGuide | undefined {
  const normalized = slug.toLowerCase().trim()
  return comparisonGuides.find(
    (g) =>
      g.relatedProductSlugs.includes(normalized) ||
      g.contenders.some((c) => c.slug?.toLowerCase() === normalized)
  )
}

export function getComparisonGuideForCategory(catSlug: string): ComparisonGuide | undefined {
  const normalized = catSlug.toLowerCase().trim()
  return comparisonGuides.find((g) => g.relatedCategorySlugs.includes(normalized))
}
