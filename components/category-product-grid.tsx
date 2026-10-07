'use client'

import type { Product } from '@/lib/products'
import { ProductCard } from '@/components/product-card'

export function CategoryProductGrid({ products, title = 'Shop the edit' }: { products: Product[]; title?: string }) {
  return (
    <section className="mt-12 border-t border-border/60 pt-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Curated Selection</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl tracking-tight">{title}</h2>
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{products.length} picks</span>
      </div>
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}
