'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Eye, Heart, Star } from 'lucide-react'
import type { Product } from '@/lib/products'
import { toggleSave } from '@/lib/api'
import { useAuth } from '@/lib/auth-store'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RegisterGate } from '@/components/register-gate'

interface ProductCardProps {
  product: Product
  onPreview?: (product: Product) => void
}

export function ProductCard({ product, onPreview }: ProductCardProps) {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Show auth modal via a custom event (picked up by SiteHeader)
      window.dispatchEvent(new CustomEvent('commonly:open-auth'))
      return
    }

    if (saveLoading || !product.id) return
    setSaveLoading(true)
    try {
      const result = await toggleSave(product.id)
      setSaved(result.saved)
    } catch {
      // silently fail
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <Card className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      {/* Visual / Media Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        <Link href={`/products/${product.slug}`} className="block size-full" aria-label={`View ${product.name} details`}>
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).src = '/luxury-placeholder.svg' }}
          />
        </Link>

        {/* Top Badges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
          {(product.tags?.[0] || product.category) && (
            <Badge
              variant="secondary"
              className="border-0 bg-background/95 text-[11px] font-medium tracking-wide shadow-sm backdrop-blur-md"
            >
              {product.tags?.[0] || product.category}
            </Badge>
          )}
          {product.prime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#131921]/90 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md border border-[#FF9900]/30 tracking-wider uppercase">
              <span className="size-1.5 rounded-full bg-[#FF9900]" />
              Amazon Prime
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        {onPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPreview(product)
            }}
            className="absolute inset-x-4 bottom-4 rounded-full bg-primary/95 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-primary group-hover:opacity-100"
          >
            Quick View
          </button>
        )}
      </div>

      {/* Product Information */}
      <CardContent className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {product.brand}
            </p>
            <Link
              href={`/products/${product.slug}#reviews`}
              aria-label={`View reviews for ${product.name}`}
              className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground/75">({product.reviewCount?.toLocaleString() ?? 0})</span>
            </Link>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="mt-2 line-clamp-2 font-serif text-lg leading-snug tracking-tight text-foreground transition-colors hover:text-accent">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs text-muted-foreground/80">
            {product.subcategory || product.category}
          </p>

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified In Stock
            </span>
            <span className="text-muted-foreground/70">Live Amazon Pricing</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          <RegisterGate
            productSlug={product.slug}
            affiliateUrl={
              product.affiliateUrl ||
              `https://www.amazon.com/s?k=${encodeURIComponent(`${product.brand || ''} ${product.name || ''}`.trim())}`
            }
            buttonLabel="View on Amazon"
            buttonClassName="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
          />
        </div>
      </CardContent>

      {/* Card Footer: Save & View Count */}
      <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-5 py-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saveLoading}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            saved ? 'text-rose-500 font-semibold' : 'text-muted-foreground hover:text-rose-500'
          } ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart className={`size-3.5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </button>

        <Link
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-accent"
        >
          <span>Read review</span>
          <ArrowRight className="size-3" />
        </Link>

        <span
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
          title={`${product.views} people viewed this product`}
        >
          <Eye className="size-3" aria-hidden="true" />
          {product.views}
        </span>
      </div>
    </Card>
  )
}
