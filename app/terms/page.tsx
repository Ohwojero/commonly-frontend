import Link from 'next/link'
import { SiteChrome } from '@/components/site-header'

export default function TermsPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <article className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Terms</p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight sm:text-5xl">Terms of use</h1>
          <p className="mt-4 text-sm text-muted-foreground">Effective date: November 23, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">Directory information</h2>
              <p className="mt-2">
                Commonlys provides product discovery and informational listings. Product
                descriptions, specifications, prices, and availability may change or may contain
                errors. Confirm details on the retailer&apos;s product page before making a purchase.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Purchases and third-party services</h2>
              <p className="mt-2">
                Commonlys is not the seller of products linked from this site. Retailers control
                checkout, payment, fulfillment, warranties, shipping, and returns, and their terms
                apply to your transaction. Commonlys is not responsible for third-party sites or
                services.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Affiliate links</h2>
              <p className="mt-2">
                Some links may be affiliate links. Commonlys may earn a commission from qualifying
                purchases at no additional cost to you. See the{' '}
                <Link href="/affiliate-disclosure" className="text-foreground underline underline-offset-4">
                  affiliate disclosure
                </Link>
                .
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Accounts and contact</h2>
              <p className="mt-2">
                You are responsible for keeping your account credentials secure and for activity
                performed through your account. For account questions or to report an issue, email{' '}
                <a className="text-foreground underline underline-offset-4" href="mailto:ohwojerogodstime@gmail.com">
                  ohwojerogodstime@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </SiteChrome>
  )
}
