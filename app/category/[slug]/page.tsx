import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SiteChrome } from '@/components/site-header'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { fetchCategory, fetchProducts, formatPrice } from '@/lib/api'
import { apiCategoryToCategory } from '@/lib/categories'

export const dynamic = 'force-dynamic'

const toSlug = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolvedParams = params instanceof Promise ? await params : params
  const slug = decodeURIComponent(resolvedParams?.slug || '').toLowerCase().trim()

  let category
  try {
    const raw = await fetchCategory(slug)
    category = apiCategoryToCategory(raw)
  } catch {
    // Fallback if category not found
    category = {
      slug,
      label: slug,
      eyebrow: '',
      title: 'Curated picks',
      description: '',
      image: '',
      tone: 'bg-muted/10',
      items: [],
    }
  }

  // Fetch products for this category
  const rawProducts = await fetchProducts({ category: slug }).catch(() => [])
  const categoryProducts = rawProducts.map((p) => ({
    ...p,
    price: formatPrice(Number(p.price)),
    rating: Number(p.rating).toFixed(1),
    reviewCount: p.reviewCount ?? 0,
    category: p.subcategory?.category?.label || '',
    categorySlug: p.subcategory?.category?.slug || slug,
    subcategory: p.subcategory?.label,
    subcategorySlug: p.subcategory?.slug,
    prime: !!p.affiliateUrl,
  }))

  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <section className={`border-b ${category.tone || 'bg-muted/10'}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8 lg:py-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {category.eyebrow}
              </p>
              <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-foreground">
                {category.title}
              </h1>
              <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <Link
                    key={item}
                    href={`/category/${category.slug}/${toSlug(item)}`}
                    className="rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-primary hover:bg-muted"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            {category.image && (
              <div className="overflow-hidden rounded-2xl shadow-sm">
                <img
                  src={category.image}
                  alt={`${category.label} editorial feature`}
                  className="aspect-[5/4] size-full object-cover"
                />
              </div>
            )}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="flex items-end justify-between gap-6 border-b border-border/60 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Curated for you
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl tracking-tight">
                Explore the {category.label} edit
              </h2>
            </div>
            <Link
              href="/"
              className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent sm:flex hover:underline"
            >
              View homepage <ArrowRight className="size-3.5" />
            </Link>
          </div>
          {categoryProducts.length ? (
            <CategoryProductGrid products={categoryProducts as any} title={`Shop ${category.label}`} />
          ) : (
            <p className="mt-8 text-muted-foreground">New picks are coming soon.</p>
          )}
        </section>
      </main>
    </SiteChrome>
  )
}
