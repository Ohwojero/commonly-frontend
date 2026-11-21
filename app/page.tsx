import { StorefrontShell } from '@/components/storefront-shell'
import { fetchProducts, formatPrice, type ApiProduct } from '@/lib/api'
import { products as fallbackProducts, isNotDummyProduct } from '@/lib/products'

function toDisplayProduct(p: ApiProduct) {
  return {
    ...p,
    price: formatPrice(Number(p.price)),
    rating: Number(p.rating).toFixed(1),
    category: p.subcategory?.category?.label || p.subcategory?.label || '',
    categorySlug: p.subcategory?.category?.slug || '',
    subcategory: p.subcategory?.label,
    subcategorySlug: p.subcategory?.slug,
    prime: !!p.affiliateUrl,
    isSpotlight: !!p.isSpotlight,
  }
}

export const revalidate = 60

export default async function Page() {
  const fallbackMapped = (fallbackProducts as any[]).filter((p) => isNotDummyProduct(p.slug)).map((p) => ({
    ...p,
    categorySlug: p.categorySlug || 'personal-edit',
    prime: !!p.affiliateUrl,
    isSpotlight: !!p.isSpotlight,
  }))
  let initialProducts: any[] = fallbackMapped

  try {
    const productsData = await fetchProducts({ sort: 'views' }).catch(() => [])
    if (productsData && productsData.length > 0) {
      const valid = productsData.filter((p) => isNotDummyProduct(p.slug)).map(toDisplayProduct)
      if (valid.length > 0) {
        const map = new Map<string, any>()
        for (const p of fallbackMapped) map.set(p.slug, p)
        for (const p of valid) map.set(p.slug, p)
        initialProducts = Array.from(map.values())
      }
    }
  } catch {
    // API not reachable during SSR; initialProducts already has fallback
  }

  return <StorefrontShell initialProducts={initialProducts} />
}
