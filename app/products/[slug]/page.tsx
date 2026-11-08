import { notFound } from 'next/navigation'
import { fetchProduct, fetchProducts, formatPrice } from '@/lib/api'
import { getProduct, products } from '@/lib/products'
import { ProductGallery } from '@/components/product-gallery'
import { SiteChrome } from '@/components/site-header'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug || '').trim()

  let product: any = null
  let rawApiProduct: any = null

  // 1. Try fetching from NestJS API first
  try {
    const raw = await fetchProduct(decodedSlug)
    if (raw && (raw.id || raw.name)) {
      rawApiProduct = raw
      product = {
        ...raw,
        id: raw.id,
        price: formatPrice(Number(raw.price || 0)),
        rating: Number(raw.rating || 0).toFixed(1),
        reviewCount: raw.reviewCount ?? 0,
        images: raw.images || [],
        category: raw.subcategory?.category?.label || raw.subcategory?.label || 'Curated Picks',
        categorySlug: raw.subcategory?.category?.slug || '',
        subcategory: raw.subcategory?.label,
        subcategorySlug: raw.subcategory?.slug,
        prime: !!raw.affiliateUrl,
      }
    }
  } catch {
    // API is offline or product not found in DB; continue to static fallback
  }

  // 2. If not found in API, check static fallback catalog in lib/products.ts
  if (!product) {
    const staticItem =
      getProduct(decodedSlug) ||
      products.find((p) => p.slug.toLowerCase() === decodedSlug.toLowerCase())

    if (staticItem) {
      product = staticItem
    }
  }

  // If still not found anywhere, show 404
  if (!product) {
    notFound()
  }

  // 3. Source related products (safely isolated so it can never trigger a 404)
  let relatedProducts: any[] = []
  try {
    const allProducts = await fetchProducts().catch(() => [])
    if (allProducts && allProducts.length > 0) {
      const otherProducts = allProducts.filter((p) => p.slug !== product.slug)
      const currentCatSlug = product.categorySlug || rawApiProduct?.subcategory?.category?.slug || ''
      const currentSubcatSlug = product.subcategorySlug || rawApiProduct?.subcategory?.slug || ''

      const sameCategory = otherProducts.filter((p) => {
        const catSlug = p.subcategory?.category?.slug || ''
        const subSlug = p.subcategory?.slug || ''
        return (
          (currentCatSlug && catSlug === currentCatSlug) ||
          (currentSubcatSlug && subSlug === currentSubcatSlug)
        )
      })

      const differentCategory = otherProducts.filter(
        (p) => !sameCategory.some((sc) => sc.slug === p.slug)
      )

      relatedProducts = [...sameCategory, ...differentCategory]
        .slice(0, 8)
        .map((p) => ({
          ...p,
          id: p.id,
          price: formatPrice(Number(p.price || 0)),
          rating: Number(p.rating || 0).toFixed(1),
          reviewCount: p.reviewCount ?? 0,
          images: p.images || [],
          category: p.subcategory?.category?.label || p.subcategory?.label || '',
          categorySlug: p.subcategory?.category?.slug || '',
          subcategory: p.subcategory?.label,
          subcategorySlug: p.subcategory?.slug,
          prime: !!p.affiliateUrl,
        }))
    }
  } catch {
    // Silently fall back to static related items
  }

  // If API returned no related products, use static products
  if (relatedProducts.length === 0) {
    const staticOthers = products.filter((p) => p.slug !== product.slug)
    const sameCat = staticOthers.filter(
      (p) =>
        (product.categorySlug && p.categorySlug === product.categorySlug) ||
        (product.subcategorySlug && p.subcategorySlug === product.subcategorySlug)
    )
    const diffCat = staticOthers.filter((p) => !sameCat.some((sc) => sc.slug === p.slug))
    relatedProducts = [...sameCat, ...diffCat].slice(0, 8)
  }

  return (
    <SiteChrome>
      <ProductGallery product={product} relatedProducts={relatedProducts} />
    </SiteChrome>
  )
}
