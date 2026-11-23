import { SiteChrome } from '@/components/site-header'

export default function AffiliateDisclosurePage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <article className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Transparency</p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight sm:text-5xl">Affiliate disclosure</h1>
          <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
            <p className="rounded-2xl border bg-muted/30 p-5 text-base font-medium text-foreground">
              As an Amazon Associate I earn from qualifying purchases.
            </p>
            <p>
              Some links on Commonlys are affiliate links. If you use one and make a qualifying
              purchase, Commonlys may receive a commission at no additional cost to you. Affiliate
              relationships do not change the price you pay.
            </p>
            <p>
              Commonlys does not sell or fulfill the products listed here. Retailers control current
              prices, availability, shipping, returns, and checkout. Please review the retailer&apos;s
              listing and policies before purchasing.
            </p>
            <p>
              For questions about this disclosure, contact{' '}
              <a className="text-foreground underline underline-offset-4" href="mailto:ohwojerogodstime@gmail.com">
                ohwojerogodstime@gmail.com
              </a>
              .
            </p>
          </div>
        </article>
      </main>
    </SiteChrome>
  )
}
