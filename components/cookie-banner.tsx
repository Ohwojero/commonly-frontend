'use client'

import { useEffect, useState } from 'react'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a cookie choice
    const consent = localStorage.getItem('commonly_cookie_consent')
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('commonly_cookie_consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('commonly_cookie_consent', 'declined')
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
            <h3 className="font-serif text-base font-semibold tracking-tight text-foreground">
              Cookie &amp; Affiliate Transparency
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              We use essential cookies and Amazon Associates referral tags to maintain your curated favorites, analyze editorial traffic, and facilitate direct checkout on Amazon. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
            </p>
            <div className="mt-2 text-[11px] text-muted-foreground">
              <Link href="/about" className="underline underline-offset-2 hover:text-foreground">
                Read our editorial disclosure &amp; privacy terms
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDecline}
          aria-label="Close cookie banner"
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
          Accept All Cookies
        </Button>
      </div>
    </aside>
  )
}
