'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import { fetchProducts, formatPrice, trackAffiliateClick, type ApiProduct } from '@/lib/api'
import { useAuth } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SiteHeader, SiteFooter } from '@/components/site-header'
import { ProductCard } from '@/components/product-card'
import { RegisterGate } from '@/components/register-gate'
import { storefrontNavGroups, storefrontNavSlug } from '@/lib/storefront-navigation'

// Map ApiProduct to frontend-friendly display shape
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

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/40 bg-card overflow-hidden">
      <div className="aspect-[4/5] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-5 w-full bg-muted rounded" />
        <div className="h-3 w-16 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded-full mt-4" />
      </div>
    </div>
  )
}

export function StorefrontShell() {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [preview, setPreview] = useState<ReturnType<typeof toDisplayProduct> | null>(null)
  const [activeTabKey, setActiveTabKey] = useState('')
  const [activeGroupSlug, setActiveGroupSlug] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailSubscribed, setEmailSubscribed] = useState(false)
  const [allProducts, setAllProducts] = useState<ReturnType<typeof toDisplayProduct>[]>([])
  const [loading, setLoading] = useState(true)
  const [heroProductIndex, setHeroProductIndex] = useState(0)
  const [heroSlideDirection, setHeroSlideDirection] = useState<'next' | 'previous'>('next')
  const [heroPaused, setHeroPaused] = useState(false)

  useEffect(() => {
    fetchProducts({ sort: 'views' }).catch(() => [])
      .then((productsData) => {
        setAllProducts(productsData.map(toDisplayProduct))
      })
      .finally(() => setLoading(false))
  }, [])

  const dynamicFilterTabs = storefrontNavGroups.flatMap((group) =>
    group.items.map((item) => ({
        key: `subcategory:${group.slug}:${storefrontNavSlug(item)}`,
        label: item,
        subcategorySlug: storefrontNavSlug(item),
    }))
  )

  const filteredProducts = allProducts.filter((p) => {
    const activeGroup = storefrontNavGroups.find((group) => group.slug === activeGroupSlug)
    if (activeGroup) return activeGroup.catalogSlugs.includes(p.categorySlug)
    const activeTab = dynamicFilterTabs.find((tab) => tab.key === activeTabKey)
    if (!activeTab) return true
    return p.subcategorySlug === activeTab.subcategorySlug
  })

  const categoryCards = storefrontNavGroups.map((group) => {
    const products = allProducts.filter((product) => group.catalogSlugs.includes(product.categorySlug))
    return { group, products, featuredProduct: products[0] }
  })

  // Spotlight: prefer isSpotlight product, then first product
  const spotlight = allProducts.find((p) => p.isSpotlight) ?? allProducts[0]
  const heroProducts = spotlight
    ? [spotlight, ...allProducts.filter((product) => product.slug !== spotlight.slug)]
    : []
  const heroProduct = heroProducts[heroProductIndex % Math.max(heroProducts.length, 1)]

  useEffect(() => {
    setHeroProductIndex(0)
  }, [spotlight?.slug])

  useEffect(() => {
    if (heroPaused || heroProducts.length < 2) return
    const interval = window.setInterval(() => {
      setHeroSlideDirection('next')
      setHeroProductIndex((index) => (index + 1) % heroProducts.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [heroPaused, heroProducts.length])

  const changeHeroProduct = (direction: 'next' | 'previous') => {
    setHeroSlideDirection(direction)
    setHeroProductIndex((index) =>
      (index + (direction === 'next' ? 1 : heroProducts.length - 1)) % heroProducts.length
    )
  }

  // Dynamic unique brands from loaded products
  const uniqueBrands = Array.from(new Set(allProducts.map((p) => p.brand))).filter(Boolean)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setEmailSubscribed(true)
      setEmailInput('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {searchOpen && (
        <div className="border-b bg-card px-5 py-4">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <Search className="size-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search luxury skincare, salon hair tools, clinical devices..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <X />
            </Button>
          </div>
        </div>
      )}

      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8 lg:pb-16">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-2xl">
            <video
              className="absolute inset-0 size-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85"
              aria-label="Luxurious cream texture being applied"
            >
              <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/4812195/4812195-hd_1920_1080_25fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/50 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/55 sm:to-black/25" />

            <div className="relative z-10 grid min-h-[480px] items-center gap-8 px-5 py-10 sm:min-h-[580px] sm:px-12 sm:py-16 lg:min-h-[640px] lg:grid-cols-[1.1fr_.9fr] lg:gap-12 lg:px-16 lg:py-20">
              <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-rose-200 backdrop-blur-md">
                <Sparkles className="size-3 text-rose-300 sm:size-3.5 shrink-0" />
                <span>The Prestige Beauty &amp; Clinical Edit</span>
              </div>

              <h1 className="mt-4 sm:mt-6 max-w-3xl font-serif text-3xl sm:text-5xl lg:text-7xl leading-[1.08] sm:leading-[1.05] tracking-tight text-white">
                Where clinical science <br className="hidden sm:inline" />
                meets <span className="font-serif italic font-normal text-rose-300">quiet luxury.</span>
              </h1>

              <p className="mt-3.5 sm:mt-6 max-w-xl text-xs sm:text-base lg:text-lg leading-relaxed sm:leading-8 text-white/85">
                An independent editorial curation of molecular skincare, professional salon tech, and FDA-cleared clinical devices. Verified for transformative results, fulfilled directly by Amazon Prime.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="#shop"
                  className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-xs font-semibold uppercase tracking-widest text-black shadow-lg transition-all hover:bg-white/90 hover:shadow-xl active:scale-[0.98]"
                >
                  <span>Explore The Edit</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="#featured-product"
                  className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98] text-center"
                >
                  <span>Featured Clinical Device</span>
                </Link>
              </div>

              <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-6 border-t border-white/15 pt-5 sm:pt-6 text-xs text-white/80">
                <span className="flex items-center gap-2 text-[11px] sm:text-xs">
                  <CheckCircle2 className="size-3.5 sm:size-4 text-rose-300 shrink-0" />
                  Dermatologist &amp; FDA Cleared
                </span>
                <span className="flex items-center gap-2 text-[11px] sm:text-xs">
                  <Truck className="size-3.5 sm:size-4 text-rose-300 shrink-0" />
                  Direct Amazon Prime Delivery
                </span>
                <span className="flex items-center gap-2 text-[11px] sm:text-xs">
                  <ShieldCheck className="size-3.5 sm:size-4 text-rose-300 shrink-0" />
                  100% Independent Editorial Curation
                </span>
              </div>
              </div>

              {heroProduct && (
                <div
                  id="featured-product"
                  className="w-full max-w-md justify-self-center overflow-hidden rounded-xl border border-white/25 bg-black/25 p-3 shadow-2xl backdrop-blur-sm lg:justify-self-end"
                  onMouseEnter={() => setHeroPaused(true)}
                  onMouseLeave={() => setHeroPaused(false)}
                >
                  <Link
                    key={heroProduct.slug}
                    href={`/products/${heroProduct.slug}`}
                    className={`group block motion-reduce:animate-none animate-in fade-in duration-500 ${heroSlideDirection === 'next' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white/95">
                      <img
                        src={heroProduct.image}
                        alt={heroProduct.name}
                        className="size-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(event) => { (event.target as HTMLImageElement).src = '/luxury-placeholder.svg' }}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                        {heroProduct.isSpotlight ? 'Featured Pick' : 'From the Edit'}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-4 px-1 pb-1 pt-4 text-white">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">{heroProduct.brand}</p>
                        <h2 className="mt-1 line-clamp-2 font-serif text-xl leading-tight sm:text-2xl">{heroProduct.name}</h2>
                      </div>
                      <ArrowRight className="mb-1 size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => changeHeroProduct('previous')}
                      aria-label="Previous featured product"
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5" aria-label={`Product ${heroProductIndex + 1} of ${heroProducts.length}`}>
                      {heroProducts.map((product, index) => (
                        <button
                          key={product.slug}
                          type="button"
                          onClick={() => {
                            setHeroSlideDirection(index > heroProductIndex ? 'next' : 'previous')
                            setHeroProductIndex(index)
                          }}
                          aria-label={`Show ${product.name}`}
                          aria-current={index === heroProductIndex ? 'true' : undefined}
                          className={`h-1.5 rounded-full transition-all ${index === heroProductIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => changeHeroProduct('next')}
                      aria-label="Next featured product"
                      className="grid size-9 shrink-0 place-items-center rounded-full border border-white/35 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  <Link
                    href={`/products/${heroProduct.slug}`}
                    className="mt-3 flex h-10 items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-white/85"
                  >
                    View product <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4 Value Pillars Strip */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-accent/40">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-accent">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold">Medical-Grade Actives</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                High-potency molecular compounds, patented TFC8 peptides, and barrier-repair science.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-accent/40">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-accent">
                <Zap className="size-5" />
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold">Salon-Grade Tech</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Precision acoustic motors and Coanda aerodynamic airflow engineered to protect hair keratin.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-accent/40">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-accent">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold">FDA-Cleared Devices</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Medical red &amp; near-infrared LED wavelengths and bi-phasic microcurrent facial contouring.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all hover:border-accent/40">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/5 text-accent">
                <Truck className="size-5" />
              </div>
              <h3 className="mt-3 font-serif text-base font-semibold">Amazon Prime Assurance</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Official brand storefront links with live transparent pricing and trusted Prime buyer protection.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Curated Prestige Collections</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl">Shop by Category</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Explore considered skincare, treatment technology, salon hair tools, and fragrance and body care.
              </p>
            </div>
            <p className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {loading ? 'Loading collection' : `${allProducts.length} curated picks`}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map(({ group, products, featuredProduct }, index) => {
              const selected = activeGroupSlug === group.slug
              return (
                <article key={group.slug} className={`group overflow-hidden rounded-xl border bg-card transition-colors ${selected ? 'border-accent ring-1 ring-accent/30' : 'border-border/80 hover:border-accent/50'}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={featuredProduct?.image || '/luxury-placeholder.svg'}
                      alt={featuredProduct?.name || group.label}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      onError={(event) => { (event.target as HTMLImageElement).src = '/luxury-placeholder.svg' }}
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                      {loading ? 'Loading' : products.length ? `${products.length} picks` : 'New collection'}
                    </span>
                    <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-transform group-hover:translate-x-0.5">
                      <span className="sr-only">Collection {index + 1}</span>
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                  <div className="flex min-h-48 flex-col p-5">
                    <div>
                      <h3 className="mt-2 font-serif text-2xl">{group.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
                    </div>
                    <Button
                      type="button"
                      variant={selected ? 'default' : 'outline'}
                      className="mt-5 w-full justify-between text-xs uppercase tracking-wider"
                      onClick={() => {
                        setActiveTabKey('')
                        setActiveGroupSlug((current) => current === group.slug ? null : group.slug)
                        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {selected ? 'Showing this edit' : 'View curated picks'}
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Dynamic Brand Marquee Ticker */}
          {uniqueBrands.length > 0 && (
            <div className="relative mt-10 overflow-hidden rounded-2xl border border-border/40 bg-secondary/40 py-3.5">
              <div className="marquee flex gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {[...uniqueBrands, ...uniqueBrands, ...uniqueBrands].map((brand, idx) => (
                  <span key={idx} className="flex items-center gap-8">
                    <span>★ {brand}</span>
                    <span>·</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Curated Products Section */}
        <section id="shop" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 border-t border-border/60">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Prestige Curated Selection</p>
              <h2 className="mt-2 font-serif text-3xl sm:text-5xl">Currently Considered</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                High-ticket, award-winning skincare, hair technology, and clinical devices verified for clinical efficacy.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {dynamicFilterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveGroupSlug(null)
                    setActiveTabKey((current) => current === tab.key ? '' : tab.key)
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTabKey === tab.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border/80 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-8 text-xs uppercase tracking-widest font-semibold text-muted-foreground">
            {loading
              ? 'Loading picks...'
              : activeTabKey
                ? `Showing ${filteredProducts.length} verified picks in ${dynamicFilterTabs.find((tab) => tab.key === activeTabKey)?.label}`
                : `Showing ${filteredProducts.length} verified picks`}
          </p>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : filteredProducts.length === 0 ? (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-base font-serif text-muted-foreground">No curated products in this category yet.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.slug} product={product as any} onPreview={setPreview as any} />
                  ))
                )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm text-center">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-accent">The Private Edit</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Curated luxury directly to your inbox.</h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
              Receive weekly breakdowns of clinical device patents, luxury formulation drops, and Amazon Prime price alerts. Zero spam, ever.
            </p>
            {emailSubscribed ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-6 py-2.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="size-4" />
                You&apos;re on the list! Welcome to Commonly VIP.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-6 mx-auto flex max-w-md flex-col sm:flex-row gap-2.5">
                <Input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="rounded-full bg-background px-5 text-xs"
                />
                <Button type="submit" className="rounded-full px-6 text-xs uppercase tracking-wider shrink-0">
                  Join The Edit
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* Quick View Dialog */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="grid gap-6 sm:grid-cols-2">
              <img src={preview.image} alt={preview.name} className="aspect-square w-full object-cover rounded-xl" />
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">{preview.brand}</p>
                <p className="mt-3 leading-relaxed text-sm text-muted-foreground">{preview.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {preview.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-2.5 pt-2">
                  <RegisterGate
                    productSlug={preview.slug}
                    affiliateUrl={
                      preview.affiliateUrl ||
                      `https://www.amazon.com/s?k=${encodeURIComponent(`${preview.brand || ''} ${preview.name || ''}`.trim())}`
                    }
                    buttonLabel="View on Amazon"
                    buttonClassName="flex h-14 sm:h-11 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 text-sm sm:text-xs font-bold sm:font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 shadow-md active:scale-[0.99]"
                  />
                  <Link
                    href={`/products/${preview.slug}`}
                    onClick={() => setPreview(null)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-muted"
                  >
                    <span>Full Editorial &amp; Specs</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
