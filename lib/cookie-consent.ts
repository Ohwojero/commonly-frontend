export type CookieConsent = 'accepted' | 'declined'

export const COOKIE_CONSENT_KEY = 'commonlys_cookie_consent'
export const COOKIE_CONSENT_CHANGED_EVENT = 'commonlys:cookie-consent-changed'
export const COOKIE_CONSENT_SETTINGS_EVENT = 'commonlys:manage-cookie-consent'

export function getCookieConsent(): CookieConsent | null {
  const consent =
    localStorage.getItem(COOKIE_CONSENT_KEY) ||
    localStorage.getItem('commonly_cookie_consent')

  return consent === 'accepted' || consent === 'declined' ? consent : null
}

export function saveCookieConsent(consent: CookieConsent): void {
  const previousConsent = getCookieConsent()
  localStorage.setItem(COOKIE_CONSENT_KEY, consent)
  localStorage.removeItem('commonly_cookie_consent')
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGED_EVENT))

  if (previousConsent === 'accepted' && consent === 'declined') {
    window.location.reload()
  }
}
