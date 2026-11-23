'use client'

import Link from 'next/link'
import { SiteChrome } from '@/components/site-header'
import { COOKIE_CONSENT_SETTINGS_EVENT } from '@/lib/cookie-consent'

export default function PrivacyPolicyPage() {
  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <article className="mx-auto max-w-3xl px-5 py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Privacy</p>
          <h1 className="mt-4 font-sans text-4xl font-bold tracking-tight sm:text-5xl">Privacy notice</h1>
          <p className="mt-4 text-sm text-muted-foreground">Effective date: November 23, 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">Information we handle</h2>
              <p className="mt-2">
                If you create an account, Commonlys processes the email address and password you
                submit, and any name or location you choose to provide. Sign-in and registration
                activity may be logged for account and service administration. When you use an
                affiliate link after accepting optional tracking, our click event records the
                product slug; it does not include your email address or location.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Browser storage and optional services</h2>
              <p className="mt-2">
                Account sessions and your privacy choice are stored in your browser. Essential
                account storage is used to provide sign-in features. If you accept optional
                tracking, Vercel Analytics and Skimlinks may load to provide site analytics and
                affiliate attribution. You can choose essential-only or change your choice using
                the cookie settings control in the footer.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(COOKIE_CONSENT_SETTINGS_EVENT))}
                className="mt-3 font-medium text-foreground underline underline-offset-4"
              >
                Open cookie settings
              </button>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Retailer links</h2>
              <p className="mt-2">
                Retailer sites, including Amazon, have their own privacy policies and may collect
                information when you follow a link or shop with them. Their practices are outside
                Commonlys&apos; control. Read our{' '}
                <Link href="/affiliate-disclosure" className="text-foreground underline underline-offset-4">
                  affiliate disclosure
                </Link>{' '}
                for information about commissions.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Use, retention, and requests</h2>
              <p className="mt-2">
                Information is used to operate accounts, maintain service and security records, and
                understand product-link activity. It is retained as needed for those purposes and
                applicable obligations. To ask about, correct, or request deletion of account
                information, contact{' '}
                <a className="text-foreground underline underline-offset-4" href="mailto:ohwojerogodstime@gmail.com">
                  ohwojerogodstime@gmail.com
                </a>
                . We may need to verify your request before acting on it.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground">Contact</h2>
              <p className="mt-2">
                Questions about this notice can be sent to{' '}
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
