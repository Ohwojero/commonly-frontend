'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4 border-t border-border/60 pt-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent">Keep exploring</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">You may also like</h2>
        </div>
        <Link href="/#shop" className="hidden items-center gap-2 text-xs uppercase tracking-widest font-semibold text-accent sm:flex">
          View all picks <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item.slug} product={item} />
        ))}
      </div>
    </section>
  )
}
