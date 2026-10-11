'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { ExternalLink, Eye, EyeOff, Sparkles, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-store'
import { trackAffiliateClick } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CountrySelect } from '@/components/ui/country-select'

export interface RegisterGateProps {
  productSlug?: string
  affiliateUrl?: string
  buttonLabel?: string
  buttonClassName?: string
  isOpen?: boolean
  onClose?: () => void
  showTrigger?: boolean
  initialMode?: 'register' | 'login'
}

export function RegisterGate({
  productSlug,
  affiliateUrl,
  buttonLabel = 'View on Amazon',
  buttonClassName,
  isOpen: controlledOpen,
  onClose: controlledOnClose,
  showTrigger = true,
  initialMode = 'register',
}: RegisterGateProps) {
  const { login, register, user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)
  const [mode, setMode] = useState<'register' | 'login'>(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Consider the user logged-in if we have a token (even while user profile is still loading)
  const isLoggedIn = !!user || !!token

  useEffect(() => {
    setMounted(true)
  }, [])

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [open])

  const handleClose = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose()
    } else {
      setInternalOpen(false)
    }
    setMessage('')
    setMode(initialMode)
    setForm({ name: '', email: '', password: '', location: '' })
  }

  // If already logged in (or has a valid session token), go straight to Amazon
  const handleTriggerClick = () => {
    const hasLocalToken = typeof window !== 'undefined' && !!localStorage.getItem('commonly_token')
    if (isLoggedIn || hasLocalToken) {
      // User is logged in — go straight to Amazon
      const emailForTracking = user?.email
      const url =
        affiliateUrl ||
        `https://www.amazon.com/s?k=${encodeURIComponent(`${productSlug || ''}`.trim())}`
      trackAffiliateClick(productSlug, emailForTracking)
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    // Not logged in — ALWAYS open the REGISTER popup first
    setMode('register')
    if (isControlled && controlledOnClose) return
    setInternalOpen(true)
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      let userEmail = form.email

      if (mode === 'register') {
        await register(form.email, form.password, form.name || undefined, form.location.trim())
        fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eventType: 'register', eventName: 'New user registration', email: form.email, location: form.location.trim(), productSlug }),
        }).catch(() => {})
      } else {
        const role = await login(form.email, form.password)
        fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: 'login', eventName: 'User signed in', email: form.email, productSlug }),
        }).catch(() => {})
        if (role === 'admin') {
          handleClose()
          router.push('/admin/dashboard')
          return
        }
      }

      // Always redirect to Amazon after successful auth if affiliateUrl exists
      const url = affiliateUrl ||
        `https://www.amazon.com/s?k=${encodeURIComponent(`${productSlug || ''}`.trim())}`
      if (productSlug || affiliateUrl) {
        trackAffiliateClick(productSlug, userEmail, form.location ? form.location.trim() : undefined)
        window.open(url, '_blank', 'noopener,noreferrer')
      }
      handleClose()
    } catch (err: any) {
      setMessage(err?.message || 'We could not complete that request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          onClick={handleTriggerClick}
          disabled={authLoading}
          className={
            buttonClassName ||
            'inline-flex h-14 sm:h-11 items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-sm sm:text-xs font-bold sm:font-semibold uppercase tracking-wider text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait'
          }
        >
          <span>{authLoading ? 'Loading...' : buttonLabel}</span>
          {!authLoading && <ExternalLink className="size-4 sm:size-3.5 opacity-80 shrink-0" />}
        </Button>
      )}

      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div className={`relative w-full max-w-md rounded-3xl border border-border/80 p-6 shadow-2xl transition-colors duration-300 sm:p-8 animate-in zoom-in-95 duration-200 ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}>
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${mode === 'register' ? 'text-primary-foreground/80' : 'text-accent'}`}>
                  <Sparkles className="size-3.5" />
                  {affiliateUrl ? 'Prestige Curations' : 'Commonly Account'}
                </p>
                <h2 id="auth-modal-title" className="mt-2 font-serif text-2xl sm:text-3xl">
                  {mode === 'register'
                    ? affiliateUrl
                      ? 'Join before you shop'
                      : 'Create your account'
                    : affiliateUrl
                      ? 'Welcome back'
                      : 'Sign in to Commonly'}
                </h2>
                <p className={`mt-1.5 max-w-[34ch] text-sm leading-relaxed ${mode === 'register' ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {mode === 'register'
                    ? affiliateUrl
                      ? 'Create an account to save your favorite products and keep your curated picks together.'
                      : 'Create an account to save your favorite products and keep your curated picks together.'
                    : affiliateUrl
                      ? 'Sign in to access your saved curations and continue to Amazon.'
                      : 'Sign in to access your saved products and editorial favorites.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="shrink-0 rounded-full border border-border/70 bg-background p-2 text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 flex rounded-full bg-muted/60 p-1">
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 rounded-full py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === 'register'
                    ? 'bg-accent text-accent-foreground shadow-xs'
                    : mode === 'login'
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-primary-foreground/75 hover:text-primary-foreground'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 rounded-full py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === 'login'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : mode === 'register'
                      ? 'text-primary-foreground/75 hover:text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={submit} className="mt-5 grid gap-3">
              {mode === 'register' && (
                <>
                  <Input
                    placeholder="Full Name (optional)"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-xl bg-background"
                    style={{ color: 'var(--foreground)' }}
                  />
                  <CountrySelect
                    required
                    aria-label="Country"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="rounded-xl"
                    style={{ color: 'var(--foreground)' }}
                  />
                </>
              )}

              <Input
                required
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl bg-background"
                style={{ color: 'var(--foreground)' }}
              />

              <div className="relative">
                <Input
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (minimum 6 characters)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="rounded-xl bg-background pr-11"
                  style={{ color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {message && (
                <p className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                {loading
                  ? 'Connecting...'
                  : mode === 'register'
                    ? 'Register & View on Amazon'
                    : 'Log In & View on Amazon'}
              </Button>
            </form>

            {/* Amazon Associates Compliance Notice */}
            <p className={`mt-5 rounded-xl p-3 text-[10px] leading-relaxed ${mode === 'register' ? 'bg-white/10 text-primary-foreground' : 'bg-muted text-foreground'}`}>
              <strong>Amazon Associates Disclosure:</strong> Commonly is an independent editorial curation. As an Amazon Associate, we earn from qualifying purchases at zero extra cost to you.
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
