'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleSave, incrementProductView, fetchReviews, submitReview, updateReview, deleteReview } from '@/lib/api'
import type { ApiReview, ApiReviewsResponse } from '@/lib/api'
import { useAuth } from '@/lib/auth-store'
import { RelatedProducts } from '@/components/related-products'
import { RegisterGate } from '@/components/register-gate'
import type { Product } from '@/lib/products'

const FALLBACK_IMG = '/luxury-placeholder.svg'

const galleryImages = (product: Product): string[] => {
  return Array.from(new Set([product.image, ...(product.images ?? [])].filter(Boolean))).slice(0, 4)
}

export function ProductGallery({
  product,
  relatedProducts = [],
}: {
  product: Product
  relatedProducts?: Product[]
}) {
  const { user } = useAuth()
  const images = galleryImages(product)
  const [activeImage, setActiveImage] = useState(0)
  const [reviewsData, setReviewsData] = useState<ApiReviewsResponse | null>(null)
  const [myReview, setMyReview] = useState<ApiReview | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [editingReview, setEditingReview] = useState(false)

  useEffect(() => {
    incrementProductView(product.slug).catch(() => {})
    fetchReviews(product.slug).then((data) => {
      setReviewsData(data)
    }).catch(() => {})
  }, [product.slug])

  useEffect(() => {
    if (reviewsData && user) {
      const mine = reviewsData.reviews.find((r) => r.user.id === user.id) ?? null
      setMyReview(mine)
      if (mine && !editingReview) {
        setReviewRating(mine.rating)
        setReviewBody(mine.body ?? '')
      }
    }
  }, [reviewsData, user, editingReview])

  const handleSubmitReview = async () => {
    if (!reviewRating) return
    setReviewSubmitting(true)
    setReviewError('')
    try {
      let data: ApiReviewsResponse
      if (myReview && editingReview) {
        data = await updateReview(myReview.id, reviewRating, reviewBody || undefined)
      } else {
        data = await submitReview(product.slug, reviewRating, reviewBody || undefined)
      }
      setReviewsData(data)
      setEditingReview(false)
    } catch (e: any) {
      setReviewError(e.message || 'Failed to submit review')
    } finally {
      setReviewSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const data = await deleteReview(reviewId)
      setReviewsData(data)
      if (myReview?.id === reviewId) {
        setMyReview(null)
        setReviewRating(0)
        setReviewBody('')
      }
    } catch {}
  }
  const [openSection, setOpenSection] = useState<string | null>('highlights')
  const [zoomPoint, setZoomPoint] = useState({ x: 50, y: 50 })
  const [isZooming, setIsZooming] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  const handleToggleSave = async () => {
    if (!user) {
      window.dispatchEvent(new CustomEvent('commonly:open-auth'))
      return
    }
    if (saveLoading || !product.id) return
    setSaveLoading(true)
    try {
      const res = await toggleSave(product.id)
      setSaved(res.saved)
    } catch {
    } finally {
      setSaveLoading(false)
    }
  }

  // IntersectionObserver to show mobile sticky CTA only when main CTA scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )
    const current = ctaRef.current
    if (current) observer.observe(current)
    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${product.brand} - ${product.name} | Commonly`,
          url: window.location.href,
        })
      } catch {
        // User dismissed native share sheet
      }
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }

  const toRows = (items: string[] | undefined, fallback: string[]) =>
    (items?.length ? items : fallback).map((item) => {
      const [label, ...value] = item.split(':')
      return {
        label: value.length ? label.trim() : 'Details',
        value: (value.length ? value.join(':') : item).trim(),
      }
    })

  const sections = [
    { id: 'highlights', title: 'Top highlights', rows: toRows(product.highlights, [product.description]) },
    {
      id: 'details',
      title: 'Item details',
      rows: toRows(product.itemDetails, [
        `Brand: ${product.brand}`,
        `Category: ${product.category}`,
        `Tags: ${product.tags.join(', ')}`,
      ]),
    },
    {
      id: 'specs',
      title: 'Features & Specs',
      rows: toRows(product.specs, [
        'Materials: Considered clinical & luxury ingredients',
        'Use: Tested for daily regimen suitability',
      ]),
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 sm:px-6 lg:px-8">
        {/* Editorial Breadcrumbs Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3 opacity-50" />
          <Link
            href={`/#${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="capitalize transition-colors hover:text-foreground"
          >
            {product.category}
          </Link>
          <ChevronRight className="size-3 opacity-50" />
          <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.brand}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(380px,.85fr)] lg:gap-12">
          {/* Product Gallery Section */}
          <section className="flex flex-col-reverse gap-3.5 sm:grid sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-4">
            {/* Thumbnails: horizontal scroll on mobile, vertical stack on desktop */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0 scrollbar-none">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`View product image ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                  className={`size-14 sm:size-16 shrink-0 aspect-square overflow-hidden rounded-xl border-2 bg-muted transition-all duration-200 ${
                    activeImage === index
                      ? 'border-primary ring-2 ring-primary/20 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product view ${index + 1}`}
                    className="size-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = FALLBACK_IMG
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Main Image with Zoom */}
            <div
              className="group relative flex min-h-[320px] sm:min-h-[420px] lg:min-h-[500px] cursor-crosshair items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted/40 shadow-xs"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                setZoomPoint({
                  x: ((event.clientX - rect.left) / rect.width) * 100,
                  y: ((event.clientY - rect.top) / rect.height) * 100,
                })
              }}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="size-full object-cover transition-all duration-300"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = FALLBACK_IMG
                }}
              />

              {isZooming && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute size-48 sm:size-60 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/40 shadow-2xl"
                  style={{
                    left: `${zoomPoint.x}%`,
                    top: `${zoomPoint.y}%`,
                    backgroundImage: `url(${images[activeImage]})`,
                    backgroundPosition: `${zoomPoint.x}% ${zoomPoint.y}%`,
                    backgroundSize: '250%',
                  }}
                />
              )}

              {/* Hover Zoom Prompt (desktop only) */}
              <div className="hidden sm:block absolute bottom-4 left-4 rounded-full bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity group-hover:opacity-100">
                Move over image to zoom
              </div>

              {/* Quick Action Overlay: Wishlist */}
              <div className="absolute right-4 top-4">
                <Button
                  variant="secondary"
                  size="icon"
                  disabled={saveLoading}
                  onClick={handleToggleSave}
                  aria-label={saved ? 'Remove from saved' : 'Save product'}
                  className={`size-10 rounded-full shadow-sm backdrop-blur-md transition-all ${
                    saved
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-background/80 text-foreground hover:bg-background'
                  } ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`size-4.5 ${saved ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </section>

          {/* Product Details & Editorial Section */}
          <section className="flex flex-col lg:pt-1">
            {/* Brand, Category & Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-accent">
                {product.brand}
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {product.subcategory || product.category}
              </span>
              {product.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Product Title & Share */}
            <div className="mt-2.5 flex items-start justify-between gap-4">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight tracking-tight text-foreground">
                {product.name}
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                aria-label="Share product"
                className="size-9 rounded-full shrink-0 border-border/80 text-muted-foreground hover:text-foreground relative"
              >
                <Share2 className="size-4" />
                {copied && (
                  <span className="absolute -bottom-8 right-0 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-medium text-background shadow-md whitespace-nowrap animate-in fade-in">
                    Link copied!
                  </span>
                )}
              </Button>
            </div>

            {/* Ratings & Verification Bar */}
            <div className="mt-3.5 flex items-center gap-3 border-b border-border/70 pb-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <div className="flex items-center text-amber-500" aria-label="Rate this product">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setReviewRating(i + 1)
                        if (myReview) setEditingReview(true)
                        document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      aria-label={`Rate ${i + 1} out of 5 stars`}
                      title={`Rate ${i + 1} out of 5`}
                      className="rounded-sm p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Star
                        className={`size-3.5 ${
                          i < Math.floor(reviewsData?.rating ?? 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span>{(reviewsData?.rating ?? 0).toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground/40">•</span>
              <span>{(reviewsData?.reviewCount ?? 0).toLocaleString()} verified ratings</span>
              {product.prime && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Prime Fulfillment
                  </span>
                </>
              )}
            </div>

            {/* Clinical Editorial Verdict Card */}
            <div className="mt-5 rounded-2xl border border-border/70 bg-gradient-to-br from-muted/30 to-muted/10 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="size-3.5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
                    Clinical Editorial Verdict
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Commonly Verified
                </span>
              </div>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground font-sans">
                {product.description}
              </p>
              {product.highlights && product.highlights.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                  {product.highlights.slice(0, 3).map((item, idx) => {
                    const [label] = item.split(':')
                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[11px] font-medium text-foreground shadow-2xs border border-border/40"
                      >
                        <Check className="size-3 text-emerald-600" />
                        {label.trim()}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Accordion Sections: Highlights, Item Details, Specs */}
            <div id="product-specs-section" className="mt-6 divide-y divide-border border-y border-border">
              {sections.map((section) => {
                const isOpen = openSection === section.id
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setOpenSection(isOpen ? null : section.id)}
                    className="block w-full text-left transition-colors hover:bg-muted/15"
                  >
                    <div className="flex items-center justify-between gap-4 py-4 text-sm sm:text-base font-semibold text-foreground tracking-tight">
                      <span>{section.title}</span>
                      <ChevronDown
                        className={`size-4.5 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-foreground' : ''
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <div className="-mt-1 divide-y divide-border/70 border-t border-border/60 pb-3 pr-2 text-xs sm:text-sm">
                        <div className="sr-only">{section.title} details</div>
                        {section.rows.map((row, index) => (
                          <div
                            key={`${row.label}-${index}`}
                            className="grid grid-cols-[minmax(120px,.8fr)_minmax(0,1.5fr)] gap-3 border-border/60 py-2.5 leading-relaxed sm:grid-cols-[minmax(160px,.8fr)_minmax(0,1.5fr)]"
                          >
                            <span className="font-semibold text-foreground/90">{row.label}</span>
                            <span className="text-muted-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Primary Action Area */}
            <div ref={ctaRef} className="mt-6 flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <RegisterGate
                    productSlug={product.slug}
                    affiliateUrl={product.affiliateUrl}
                    buttonLabel="View on Amazon"
                    buttonClassName="w-full inline-flex h-14 sm:h-12 items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.99]"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSaved(!saved)}
                  aria-label={saved ? 'Remove from saved' : 'Save product'}
                  className={`size-14 sm:size-12 rounded-full border-border/80 transition-colors shrink-0 ${
                    saved
                      ? 'text-rose-500 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className={`size-5 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                </Button>
              </div>

              {/* Luxury Fulfillment Trust Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 border border-border/50">
                  <Truck className="size-4 text-foreground shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">Official Prime Fulfillment</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 border border-border/50">
                  <ShieldCheck className="size-4 text-foreground shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">Authentic Brand Guarantee</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2.5 border border-border/50">
                  <RotateCcw className="size-4 text-foreground shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">Amazon 30-Day Returns</span>
                </div>
              </div>

              {/* Amazon Compliance Notice */}
              <p className="mt-1 text-[11px] text-muted-foreground/80 leading-relaxed border border-border/40 rounded-xl bg-muted/20 px-3.5 py-2">
                <strong>Amazon Associates Disclosure:</strong> As an Amazon Associate, Commonly earns from qualifying purchases. Live pricing, stock availability, and Prime delivery are fulfilled securely on Amazon.
              </p>
            </div>
          </section>
        </div>

        {/* Mobile Sticky Bottom Conversion Bar */}
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/80 p-3 sm:hidden transition-transform duration-300 shadow-xl ${
            showStickyBar ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={images[0]}
                alt=""
                className="size-10 rounded-lg object-cover border border-border/60 shrink-0 bg-muted"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = FALLBACK_IMG
                }}
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-accent truncate">
                  {product.brand}
                </p>
                <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
              </div>
            </div>
            <div className="shrink-0">
              <RegisterGate
                productSlug={product.slug}
                affiliateUrl={product.affiliateUrl}
                buttonLabel="View on Amazon"
                buttonClassName="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md active:scale-95"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div id="reviews" className="mx-auto max-w-[1280px] scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="border-t border-border/60 pt-10">
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-foreground mb-6">
            Ratings & Reviews
            {reviewsData && reviewsData.reviewCount > 0 && (
              <span className="ml-3 text-sm font-sans font-normal text-muted-foreground">
                {reviewsData.reviewCount} {reviewsData.reviewCount === 1 ? 'review' : 'reviews'} · {reviewsData.rating.toFixed(1)} avg
              </span>
            )}
          </h2>

          {/* Submit / Edit form */}
          {user ? (
            (!myReview || editingReview) && (
              <div className="mb-8 rounded-2xl border border-border/60 bg-muted/20 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  {editingReview ? 'Edit your review' : 'Leave a review'}
                </p>
                {/* Star selector */}
                <div className="relative z-10 flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-6 transition-colors ${
                          star <= (reviewHover || reviewRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-muted text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                  {reviewRating > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'][reviewRating]}
                    </span>
                  )}
                </div>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Share your experience (optional)"
                  rows={3}
                  className="w-full rounded-xl border border-border/60 bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                {reviewError && <p className="mt-1.5 text-xs text-red-500">{reviewError}</p>}
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!reviewRating || reviewSubmitting}
                    className="rounded-full px-6 text-xs font-bold uppercase tracking-wider h-9"
                  >
                    {reviewSubmitting ? 'Submitting…' : editingReview ? 'Save changes' : 'Submit review'}
                  </Button>
                  {editingReview && (
                    <Button
                      variant="outline"
                      onClick={() => { setEditingReview(false); setReviewRating(myReview!.rating); setReviewBody(myReview!.body ?? '') }}
                      className="rounded-full px-5 text-xs h-9"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="mb-8 rounded-2xl border border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('commonly:open-auth'))}
                className="text-foreground font-medium underline underline-offset-2 hover:text-primary transition-colors"
              >
                Sign in
              </button>{' '}
              to leave a review.
            </div>
          )}

          {/* Review list */}
          {reviewsData && reviewsData.reviews.length > 0 ? (
            <div className="divide-y divide-border/60">
              {reviewsData.reviews.map((review) => {
                const isOwner = user?.id === review.user.id
                const isAdmin = user?.role === 'admin'
                const isMine = isOwner && !editingReview
                return (
                  <div key={review.id} className="py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground uppercase">
                          {(review.user.name || review.user.email).charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {review.user.name || review.user.email.split('@')[0]}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`size-3 ${
                                s <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'
                              }`}
                            />
                          ))}
                        </div>
                        {isMine && (
                          <button
                            onClick={() => { setEditingReview(true); setReviewRating(review.rating); setReviewBody(review.body ?? '') }}
                            className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Edit review"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        )}
                        {(isOwner || isAdmin) && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Delete review"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {review.body && (
                      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed pl-10">
                        {review.body}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </p>
          )}
        </div>
      </div>

      {/* Related Products Recommendations */}
      {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
    </div>
  )
}
