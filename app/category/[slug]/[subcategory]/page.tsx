import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteChrome } from '@/components/site-header'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { fetchCategory, fetchProducts, formatPrice } from '@/lib/api'
import { apiCategoryToCategory, getSubcategoryImage } from '@/lib/categories'

export const dynamic = 'force-dynamic'

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; subcategory: string }> | { slug: string; subcategory: string }
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const catSlug = decodeURIComponent(resolvedParams?.slug || '').toLowerCase().trim()
  const subSlug = decodeURIComponent(resolvedParams?.subcategory || '').toLowerCase().trim()

  let category
  let heroImage = ''
  let item = subSlug

  try {
    const raw = await fetchCategory(catSlug)
    category = apiCategoryToCategory(raw)
    heroImage = getSubcategoryImage(subSlug, raw.image)

    // Find matching subcategory label
    const match = raw.subcategories.find((s) => s.slug === subSlug)
    if (match) item = match.label
  } catch {
    category = {
      slug: catSlug,
      label: catSlug,
      eyebrow: '',
      title: '',
      description: '',
      image: '',
      tone: 'bg-muted/10',
      items: [],
    }
    heroImage = getSubcategoryImage(subSlug, '')
  }

  // Fetch products filtered by subcategory
  const rawProducts = await fetchProducts({ category: catSlug, subcategory: subSlug }).catch(() => [])
  const subcategoryProducts = rawProducts.map((p) => ({
    ...p,
    price: formatPrice(Number(p.price)),
    rating: Number(p.rating).toFixed(1),
    category: p.subcategory?.category?.label || '',
    categorySlug: p.subcategory?.category?.slug || catSlug,
    subcategory: p.subcategory?.label,
    subcategorySlug: p.subcategory?.slug,
    prime: !!p.affiliateUrl,
  }))

  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <section className="relative min-h-[420px] overflow-hidden sm:min-h-[480px]">
          {heroImage && (
            <img src={heroImage} alt={item} className="absolute inset-0 size-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
          <div className="relative mx-auto max-w-5xl px-5 py-20 text-center lg:py-28">
            <Link
              href={`/category/${catSlug}`}
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-all hover:bg-primary/85 hover:shadow-lg active:scale-[0.98]"
            >
              <ArrowLeft className="arrow-bounce size-4 shrink-0" />
              Back to {category.label}
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {category.label} / {item}
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight text-white sm:text-6xl">
              The {item.toLowerCase()} edit.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
              Explore clinical and luxury products selected for {item.toLowerCase()}, with detailed ingredient breakdowns and verified Amazon fulfillment.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <CategoryProductGrid
            products={subcategoryProducts.length ? subcategoryProducts as any : [] as any}
            title={`Shop ${item}`}
          />
          {!subcategoryProducts.length && (
            <p className="mt-8 text-center text-muted-foreground">New picks for this category are coming soon.</p>
          )}
        </section>
      </main>
    </SiteChrome>
  )
}
