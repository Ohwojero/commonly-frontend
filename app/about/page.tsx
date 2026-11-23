import Link from 'next/link'
import { SiteChrome } from '@/components/site-header'

export default function AboutPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">About Commonlys</p>
          <h1 className="mt-5 max-w-4xl font-sans text-5xl font-bold leading-[1.02] tracking-tight text-pretty sm:text-7xl">
            A considered product directory for modern workspaces and everyday life.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
            Commonlys is an independent directory that organizes technology, ergonomic equipment,
            smart-home products, and kitchen tools into focused collections. We aim to make browsing
            clearer; product availability, specifications, and purchase terms should always be
            confirmed with the retailer.
          </p>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <div className="bg-secondary p-7">
              <p className="font-sans text-3xl font-bold">01</p>
              <h2 className="mt-10 text-lg font-semibold">Useful categories</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Browse focused collections for work, connected living, mobility, and home.
              </p>
            </div>
            <div className="bg-primary p-7 text-primary-foreground">
              <p className="font-sans text-3xl font-bold">02</p>
              <h2 className="mt-10 text-lg font-semibold">Product information</h2>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/70">
                Listings present available product descriptions and details to help with discovery.
              </p>
            </div>
            <div className="bg-secondary p-7">
              <p className="font-sans text-3xl font-bold">03</p>
              <h2 className="mt-10 text-lg font-semibold">Clear retailer links</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Retailer pages provide current pricing, availability, delivery, and return terms.
              </p>
            </div>
          </div>
        </section>
        <section className="border-y bg-secondary">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our point of view</p>
              <h2 className="mt-4 font-sans text-4xl font-bold">Good discovery starts with useful organization.</h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              Commonlys may earn a commission when visitors use some retailer links. This does not
              change the price paid by the customer. Read our{' '}
              <Link href="/affiliate-disclosure" className="underline underline-offset-4">
                affiliate disclosure
              </Link>{' '}
              for details.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <Link href="/#shop" className="text-sm font-medium underline underline-offset-4">
            Explore the product directory
          </Link>
        </div>
      </main>
    </SiteChrome>
  )
}
