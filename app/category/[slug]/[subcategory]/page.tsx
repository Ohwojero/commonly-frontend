import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteChrome } from '@/components/site-header'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { fetchCategory, fetchProducts, formatPrice } from '@/lib/api'
import { apiCategoryToCategory, getSubcategoryImage } from '@/lib/categories'
import { resolveCatalogSlugs, getNavGroupBySlug } from '@/lib/storefront-navigation'

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
  const navGroup = getNavGroupBySlug(catSlug)
  const catalogSlugs = resolveCatalogSlugs(catSlug)

  let category: ReturnType<typeof apiCategoryToCategory>
  let heroImage = ''
  let item = subSlug

  try {
    const candidateSlugs = Array.from(new Set([catSlug, ...catalogSlugs]))
    const fetchedCategories = (
      await Promise.all(
        candidateSlugs.map((slugToFetch) => fetchCategory(slugToFetch).catch(() => null))
      )
    ).filter(Boolean) as any[]

    const raw = fetchedCategories[0] || (await fetchCategory(catalogSlugs[0]))
    category = apiCategoryToCategory(raw)

    // Search all candidate categories for this subcategory
    let foundSub: { label: string; image?: string; slug: string } | undefined
    for (const cat of fetchedCategories) {
      const match = cat.subcategories?.find((s: any) => s.slug === subSlug)
      if (match) {
        foundSub = match
        break
      }
    }

    if (foundSub) {
      item = foundSub.label
      heroImage = foundSub.image || getSubcategoryImage(subSlug, raw.image)
    } else {
      if (navGroup) {
        const navItemMatch = navGroup.items.find((i) => toSlug(i) === subSlug)
        if (navItemMatch) item = navItemMatch
      }
      heroImage = getSubcategoryImage(subSlug, raw.image)
    }
  } catch {
    category = {
      slug: catSlug,
      label: navGroup?.label || catSlug,
      eyebrow: '',
      title: '',
      description: '',
      image: '',
      tone: 'bg-muted/10',
      items: navGroup?.items || [],
      subcategories: [],
    }
    heroImage = getSubcategoryImage(subSlug, '')
    if (navGroup) {
      const navItemMatch = navGroup.items.find((i) => toSlug(i) === subSlug)
      if (navItemMatch) item = navItemMatch
    }
  }

  // Fetch products filtered by subcategory across all catalogSlugs
  const rawProductsArrays = await Promise.all(
    catalogSlugs.map((cSlug) => fetchProducts({ category: cSlug, subcategory: subSlug }).catch(() => []))
  )
  const seenIds = new Set<string>()
  let rawProducts = rawProductsArrays.flat().filter((p) => {
    if (seenIds.has(p.id)) return false
    seenIds.add(p.id)
    return true
  })

  // If none found with category filter, fetch by subcategory alone as fallback
  if (!rawProducts.length) {
    rawProducts = await fetchProducts({ subcategory: subSlug }).catch(() => [])
  }

  const subcategoryProducts = rawProducts.map((p) => ({
    ...p,
    price: formatPrice(Number(p.price)),
    rating: Number(p.rating).toFixed(1),
    category: p.subcategory?.category?.label || category.label || '',
    categorySlug: p.subcategory?.category?.slug || catSlug,
    subcategory: p.subcategory?.label || item,
    subcategorySlug: p.subcategory?.slug || subSlug,
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
