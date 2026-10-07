import { notFound } from 'next/navigation'
import { fetchProduct, fetchProducts, formatPrice } from '@/lib/api'
import { ProductGallery } from '@/components/product-gallery'
import { SiteChrome } from '@/components/site-header'

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let product
  let relatedProducts: any[] = []

  try {
    const raw = await fetchProduct(slug)
    // Map API product to frontend Product shape
    product = {
      ...raw,
      id: raw.id,
      price: formatPrice(Number(raw.price)),
      rating: Number(raw.rating).toFixed(1),
      reviewCount: raw.reviewCount ?? 0,
      images: raw.images || [],
      category: raw.subcategory?.category?.label || raw.subcategory?.label || '',
      categorySlug: raw.subcategory?.category?.slug || '',
      subcategory: raw.subcategory?.label,
      subcategorySlug: raw.subcategory?.slug,
      prime: !!raw.affiliateUrl,
    }

    const allProducts = await fetchProducts().catch(() => [])
    relatedProducts = allProducts
      .filter((p) => p.slug !== slug)
      .slice(0, 4)
      .map((p) => ({
        ...p,
        id: p.id,
        price: formatPrice(Number(p.price)),
        rating: Number(p.rating).toFixed(1),
        reviewCount: p.reviewCount ?? 0,
        images: p.images || [],
        category: p.subcategory?.category?.label || '',
        categorySlug: p.subcategory?.category?.slug || '',
        subcategory: p.subcategory?.label,
        subcategorySlug: p.subcategory?.slug,
        prime: !!p.affiliateUrl,
      }))
  } catch {
    notFound()
  }

  return (
    <SiteChrome>
      <ProductGallery product={product as any} relatedProducts={relatedProducts as any} />
    </SiteChrome>
  )
}
