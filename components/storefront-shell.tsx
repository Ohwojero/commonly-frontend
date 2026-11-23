'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SiteHeader, SiteFooter } from '@/components/site-header'
import { ProductCard } from '@/components/product-card'
import { RegisterGate } from '@/components/register-gate'
import { storefrontNavGroups, storefrontNavSlug } from '@/lib/storefront-navigation'
import { products as fallbackProducts, isNotDummyProduct } from '@/lib/products'
import type { Product } from '@/lib/products'

export function StorefrontShell({
  initialProducts,
}: {
  initialProducts?: Product[]
} = {}) {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [preview, setPreview] = useState<Product | null>(null)
  const [activeTabKey, setActiveTabKey] = useState('')
  const [activeGroupSlug, setActiveGroupSlug] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [emailSubscribed, setEmailSubscribed] = useState(false)
  const [allProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts
    return (fallbackProducts as any[]).map((p) => ({
      ...p,
      categorySlug: p.categorySlug || 'personal-edit',
      prime: !!p.affiliateUrl,
      isSpotlight: !!p.isSpotlight,
    }))
  })

  const dynamicFilterTabs = storefrontNavGroups.flatMap((group) => [
    {
      key: `group:${group.slug}`,
      label: `All ${group.label}`,
      groupSlug: group.slug,
      subcategorySlug: '',
    },
    ...group.subNiches.map((sn) => ({
      key: `subniche:${group.slug}:${sn.slug}`,
      label: sn.label,
      groupSlug: group.slug,
      subcategorySlug: sn.slug,
    })),
  ])

  const filteredProducts = allProducts.filter((p) => {
    const activeGroup = storefrontNavGroups.find((group) => group.slug === activeGroupSlug)
    if (activeGroup) {
      const matchCategory =
        activeGroup.catalogSlugs.includes(p.categorySlug || '') ||
        activeGroup.catalogSlugs.includes(p.subcategorySlug || '') ||
        activeGroup.subNiches.some(
          (sn) =>
            sn.slug === p.subcategorySlug ||
            sn.slug === p.categorySlug ||
            sn.items.some((item) => storefrontNavSlug(item) === p.subcategorySlug)
        )
      if (!matchCategory) return false

      if (activeTabKey) {
        const matchingSubNiche = activeGroup.subNiches.find((sn) => sn.slug === activeTabKey)
        if (matchingSubNiche) {
          const directMatch =
            p.subcategorySlug === matchingSubNiche.slug ||
            p.categorySlug === matchingSubNiche.slug ||
            (p.subcategory && p.subcategory.toLowerCase() === matchingSubNiche.label.toLowerCase())

          const itemMatch = matchingSubNiche.items.some((item) => {
            const itemSlug = storefrontNavSlug(item)
            return (
              itemSlug === p.subcategorySlug ||
              itemSlug === p.categorySlug ||
              (p.subcategory && p.subcategory.toLowerCase() === item.toLowerCase())
            )
          })

          return directMatch || itemMatch
        }

        return (
          p.subcategorySlug === activeTabKey ||
          p.categorySlug === activeTabKey
        )
      }
      return true
    }

    const activeTab = dynamicFilterTabs.find((tab) => tab.key === activeTabKey)
    if (!activeTab) return true
    if (activeTab.key.startsWith('group:')) {
      const g = storefrontNavGroups.find((gr) => gr.slug === activeTab.groupSlug)
      return g ? g.catalogSlugs.includes(p.categorySlug || '') : true
    }
    return (
      p.subcategorySlug === activeTab.subcategorySlug ||
      p.categorySlug === activeTab.subcategorySlug
    )
  })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput) return
    setEmailSubscribed(true)
    setEmailInput('')
  }

  const activeGroupName = storefrontNavGroups.find((g) => g.slug === activeGroupSlug)?.label

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <SiteHeader />

      {/* Search Drawer */}
      {searchOpen && (
        <div className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border p-4 shadow-lg animate-in slide-in-from-top-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Search className="size-5 text-muted-foreground shrink-0" />
            <Input
              autoFocus
              placeholder="Search products, brands, or tech categories…"
              className="h-10 flex-1 border-0 bg-transparent text-sm focus-visible:ring-0"
              onChange={(e) => {
                const q = e.target.value.toLowerCase()
                if (!q) {
                  setActiveGroupSlug(null)
                  setActiveTabKey('')
                  return
                }
                const matchGroup = storefrontNavGroups.find((g) =>
                  g.label.toLowerCase().includes(q) || g.items.some((it) => it.toLowerCase().includes(q))
                )
                if (matchGroup) {
                  setActiveGroupSlug(matchGroup.slug)
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>
      )}

      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Controls: Title & Category Pills */}
          <div className="flex flex-col gap-4 py-6 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent mb-2">
                <Sparkles className="size-3" />
                <span>Curated product collection</span>
              </div>
              <h1 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                {activeGroupName || 'Curated Products'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Showing {filteredProducts.length} curated tech &amp; workspace picks
              </p>
            </div>

            {/* Main Category Filter Pills */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveGroupSlug(null)
                  setActiveTabKey('')
                }}
                className={`rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13px] font-black uppercase tracking-wider transition-all shadow-xs ${
                  !activeGroupSlug && !activeTabKey
                    ? 'bg-foreground text-background shadow-md'
                    : 'border-2 border-border/80 bg-background text-foreground hover:border-foreground'
                }`}
              >
                All Products ({allProducts.length})
              </button>
              {storefrontNavGroups.map((group) => {
                const isSelected = activeGroupSlug === group.slug
                return (
                  <button
                    key={group.slug}
                    type="button"
                    onClick={() => {
                      setActiveTabKey('')
                      setActiveGroupSlug((current) => (current === group.slug ? null : group.slug))
                    }}
                    className={`rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13px] font-black uppercase tracking-wider transition-all shadow-xs ${
                      isSelected
                        ? 'bg-foreground text-background shadow-md'
                        : 'border-2 border-border/80 bg-background text-foreground hover:border-foreground'
                    }`}
                  >
                    {group.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sub-niche pills when a category is selected */}
          {activeGroupSlug && (
            <div className="flex flex-wrap items-center gap-2 pt-3.5 pb-2.5 border-b border-border/40">
              <button
                type="button"
                onClick={() => setActiveTabKey('')}
                className={`rounded-full px-3.5 py-1 text-xs font-normal transition-all ${
                  !activeTabKey
                    ? 'bg-accent/15 text-accent font-medium border border-accent/30 shadow-xs'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                }`}
              >
                All {activeGroupName}
              </button>
              {storefrontNavGroups
                .find((g) => g.slug === activeGroupSlug)
                ?.subNiches.map((sn) => {
                  const isSubSelected = activeTabKey === sn.slug
                  return (
                    <button
                      key={sn.slug}
                      type="button"
                      onClick={() => {
                        setActiveTabKey((cur) => (cur === sn.slug ? '' : sn.slug))
                      }}
                      className={`rounded-full px-3.5 py-1 text-xs font-normal transition-all ${
                        isSubSelected
                          ? 'bg-accent/15 text-accent font-medium border border-accent/30 shadow-xs'
                          : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                      }`}
                    >
                      {sn.label}
                    </button>
                  )
                })}
            </div>
          )}

          {/* Products Grid directly */}
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <p className="text-base font-sans text-muted-foreground">
                  No curated products in this view yet.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveGroupSlug(null)
                    setActiveTabKey('')
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
                >
                  View All Products
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product as any}
                  onPreview={setPreview as any}
                />
              ))
            )}
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="mx-auto max-w-7xl px-5 pt-20 lg:px-8">
          <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm text-center">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-accent">
              The Tech Gear Dispatch
            </p>
            <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-bold">
              Curated high-performance tech gear &amp; workspace hardware to your inbox.
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
              Weekly teardowns of smart automotive gear, EV charging systems, ergonomic office setups, and workspace hardware. Zero fluff.
            </p>
            {emailSubscribed ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-6 py-2.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="size-4" />
                You&apos;re on the list! Welcome to Commonlys VIP.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-6 mx-auto flex max-w-md flex-col sm:flex-row gap-2.5"
              >
                <Input
                  required
                  type="email"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="rounded-full bg-background px-5 text-xs"
                />
                <Button
                  type="submit"
                  className="rounded-full px-6 text-xs uppercase tracking-wider shrink-0"
                >
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
            <DialogTitle className="font-sans text-2xl">{preview?.name}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="grid gap-6 sm:grid-cols-2">
              <img
                src={preview.image}
                alt={preview.name}
                className="aspect-square w-full object-cover rounded-xl"
              />
              <div className="flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">
                  {preview.brand}
                </p>
                <p className="mt-3 leading-relaxed text-sm text-muted-foreground">
                  {preview.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {preview.tags?.map((tag) => (
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
                      `https://www.amazon.com/s?k=${encodeURIComponent(
                        `${preview.brand || ''} ${preview.name || ''}`.trim()
                      )}`
                    }
                    buttonLabel="Buy on Amazon"
                    buttonClassName="flex h-12 sm:h-11 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 text-sm sm:text-xs font-bold sm:font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 shadow-md active:scale-[0.99]"
                  />
                  <Link
                    href={`/products/${preview.slug}`}
                    onClick={() => setPreview(null)}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:bg-muted"
                  >
                    <span>Read Full Specs &amp; Details</span>
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
