'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  getCookieConsent,
} from '@/lib/cookie-consent'

export function OptionalTrackingScripts() {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const updateConsent = () => setAccepted(getCookieConsent() === 'accepted')
    updateConsent()
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, updateConsent)
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, updateConsent)
  }, [])

  useEffect(() => {
    if (!accepted || process.env.NODE_ENV !== 'production') return
    if (document.getElementById('commonlys-skimlinks')) return

    const script = document.createElement('script')
    script.id = 'commonlys-skimlinks'
    script.src = 'https://s.skimresources.com/js/309805X1798173.skimlinks.js'
    script.async = true
    document.body.appendChild(script)
  }, [accepted])

  return accepted && process.env.NODE_ENV === 'production' ? <Analytics /> : null
}
