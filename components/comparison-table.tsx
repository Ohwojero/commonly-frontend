'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  X,
  Star,
  Award,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { RegisterGate } from '@/components/register-gate'
import { type ComparisonGuide } from '@/lib/comparison-data'

export function ComparisonTable({
  guide,
  highlightedSlug,
}: {
  guide: ComparisonGuide
  highlightedSlug?: string
}) {
  const [showProsCons, setShowProsCons] = useState(true)

  if (!guide || !guide.contenders?.length) return null

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-border/80 bg-card p-4 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-accent">
          <Sparkles className="size-3.5" />
          {guide.eyebrow}
        </span>
        <h2 className="mt-3 font-sans text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          {guide.title}
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {guide.subtitle}
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full border-collapse text-left text-xs sm:text-sm min-w-[640px]">
          {/* Table Header: Contender Cards */}
          <thead>
            <tr>
              <th className="w-1/4 p-3 font-semibold uppercase tracking-wider text-muted-foreground text-xs align-bottom">
                Key Specifications
              </th>
              {guide.contenders.map((contender, idx) => {
                const isTarget =
                  (highlightedSlug && contender.slug === highlightedSlug) || contender.isWinner

                return (
                  <th
                    key={idx}
                    className={`w-1/4 p-3.5 align-top transition-colors ${
                      isTarget
                        ? 'rounded-t-2xl bg-accent/5 border-t-2 border-x-2 border-accent/40 shadow-xs'
                        : 'border-t border-x border-border/40'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Badge */}
                      {contender.badge && (
                        <span
                          className={`mb-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            contender.isWinner
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {contender.isWinner && <Award className="size-3" />}
                          {contender.badge}
                        </span>
                      )}

                      {/* Image Thumbnail */}
                      <div className="relative mb-3 size-24 sm:size-28 overflow-hidden rounded-xl bg-muted/60 p-2 border border-border/50">
                        <img
                          src={contender.image}
                          alt={contender.name}
                          className="size-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/luxury-placeholder.svg'
                          }}
                        />
                      </div>

                      {/* Brand & Title */}
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                        {contender.brand}
                      </p>
                      <h3 className="mt-1 font-sans text-xs sm:text-sm font-bold text-foreground line-clamp-2 min-h-[2.5rem]">
                        {contender.slug ? (
                          <Link
                            href={`/products/${contender.slug}`}
                            className="hover:text-accent transition-colors underline-offset-2 hover:underline"
                          >
                            {contender.name}
                          </Link>
                        ) : (
                          contender.name
                        )}
                      </h3>

                      {/* Price & Rating */}
                      <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="font-sans text-base sm:text-lg font-bold text-foreground">
                          {contender.price}
                        </span>
                        <div className="flex items-center text-amber-500 text-xs font-semibold">
                          <Star className="size-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                          {contender.rating}
                        </div>
                      </div>

                      {/* Buy on Amazon CTA */}
                      <div className="mt-3.5 w-full">
                        <RegisterGate
                          productSlug={contender.slug || contender.name}
                          affiliateUrl={contender.affiliateUrl}
                          buttonLabel={
                            contender.isWinner ? 'Buy Top Pick on Amazon' : 'View on Amazon'
                          }
                          buttonClassName={`w-full h-8 sm:h-9 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all shadow-xs ${
                            contender.isWinner
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/70'
                          }`}
                        />
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Spec Rows */}
          <tbody className="divide-y divide-border/50">
            {guide.specDefinitions.map((spec, sIdx) => (
              <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-muted/15' : 'bg-transparent'}>
                <td className="p-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider border-r border-border/40">
                  {spec.label}
                </td>
                {guide.contenders.map((contender, cIdx) => {
                  const val = contender.specs[spec.key] ?? '—'
                  const isTarget =
                    (highlightedSlug && contender.slug === highlightedSlug) || contender.isWinner

                  return (
                    <td
                      key={cIdx}
                      className={`p-3 text-center align-middle font-medium ${
                        isTarget
                          ? 'bg-accent/5 font-semibold text-foreground border-x-2 border-accent/40'
                          : 'border-x border-border/40 text-foreground/80'
                      }`}
                    >
                      {val}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pros & Cons Section Toggle */}
      <div className="mt-6 border-t border-border/60 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
            Strengths &amp; Trade-Offs Breakdown
          </h4>
          <button
            type="button"
            onClick={() => setShowProsCons((prev) => !prev)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            {showProsCons ? 'Collapse' : 'Expand'}
            {showProsCons ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
          </button>
        </div>

        {showProsCons && (
          <div className="grid gap-4 sm:grid-cols-3">
            {guide.contenders.map((contender, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-2xl p-4.5 border ${
                  contender.isWinner
                    ? 'border-accent/40 bg-accent/5'
                    : 'border-border/70 bg-muted/20'
                }`}
              >
                <div>
                  <p className="font-sans text-xs sm:text-sm font-bold text-foreground">
                    {contender.name}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase font-bold text-accent tracking-widest">
                    {contender.price}
                  </p>

                  {/* Pros */}
                  <div className="mt-3.5 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Why We Like It:
                    </p>
                    {contender.pros.map((pro, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs leading-snug">
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{pro}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cons */}
                  <div className="mt-3.5 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                      Keep in Mind:
                    </p>
                    {contender.cons.map((con, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2 text-xs leading-snug">
                        <X className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Verdict: </span>
                  {contender.verdict}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Line Summary Banner */}
      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0 mt-0.5">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm sm:text-base font-bold text-foreground">
              The Editor&apos;s Bottom Line
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-2xl">
              {guide.bottomLine}
            </p>
          </div>
        </div>

        {guide.contenders.find((c) => c.isWinner) && (
          <RegisterGate
            productSlug={
              guide.contenders.find((c) => c.isWinner)?.slug ||
              guide.contenders.find((c) => c.isWinner)?.name ||
              ''
            }
            affiliateUrl={guide.contenders.find((c) => c.isWinner)?.affiliateUrl || '#'}
            buttonLabel="Shop Top Pick on Amazon"
            buttonClassName="shrink-0 h-10 rounded-full bg-primary px-6 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 shadow-md transition-all whitespace-nowrap"
          />
        )}
      </div>
    </section>
  )
}
