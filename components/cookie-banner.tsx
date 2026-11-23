'use client'

import { useEffect, useState } from 'react'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  COOKIE_CONSENT_SETTINGS_EVENT,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    if (!getCookieConsent()) {
      timer = setTimeout(() => setVisible(true), 1200)
    }

    const openSettings = () => setVisible(true)
    window.addEventListener(COOKIE_CONSENT_SETTINGS_EVENT, openSettings)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener(COOKIE_CONSENT_SETTINGS_EVENT, openSettings)
    }
  }, [])

  const handleAccept = () => {
    saveCookieConsent('accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    saveCookieConsent('declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-[999] mx-auto max-w-2xl rounded-2xl border border-border/80 bg-background/95 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-5 sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-accent">
            <Cookie className="size-4.5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-semibold tracking-tight text-foreground">
              Privacy &amp; Cookie Choices
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Essential account storage works by default. If you accept, we record product-link clicks and load Vercel Analytics and Skimlinks. Amazon links work either way.
            </p>
            <div className="mt-2 flex gap-4 text-[11px] text-muted-foreground">
              <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
                Privacy notice
              </Link>
              <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-foreground">
                Affiliate disclosure
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDecline}
          aria-label="Choose essential-only settings"
          className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-border/60 pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDecline}
          className="rounded-full text-xs font-medium"
        >
          Essential Only
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleAccept}
          className="rounded-full text-xs font-semibold uppercase tracking-wider px-5"
        >
          Accept Optional
        </Button>
      </div>
    </aside>
  )
}
