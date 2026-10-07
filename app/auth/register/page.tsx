'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CountrySelect } from '@/components/ui/country-select'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-store'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.email, form.password, form.name || undefined, form.location.trim())
      setSubmitted(true)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-serif text-2xl">Commonly.</Link>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">Join the common room</p>
          <h1 className="mt-4 max-w-md font-serif text-6xl leading-[.95]">Good things are better shared.</h1>
          <p className="mt-6 max-w-sm leading-7 text-primary-foreground/70">
            Save your favorite finds, follow thoughtful guides, and get the occasional note from us.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/50">© 2026 Commonly.</p>
      </div>

      <div className="flex flex-col p-6 sm:p-10 lg:justify-center lg:px-20">
        <div className="mb-8 rounded-xl bg-primary p-5 text-primary-foreground lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/75">Join the Commonly community</p>
          <p className="mt-2 font-serif text-2xl">Good things are better shared.</p>
          <p className="mt-2 text-sm leading-6 text-primary-foreground/85">
            Save your favorite finds and keep thoughtful recommendations close.
          </p>
        </div>
        <Link href="/" className="mb-16 flex items-center gap-2 text-sm lg:mb-20">
          <ArrowLeft className="size-4" /> Back home
        </Link>
        <div className="max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Join Commonly</p>
          <h2 className="mt-3 font-serif text-4xl">Create your account</h2>
          <div className="mt-4 rounded-lg bg-primary p-4 text-primary-foreground">
            <p className="text-sm leading-6">
              Create an account to save your favorite products and keep your curated picks together.
            </p>
            <p className="mt-3 text-xs leading-5 text-primary-foreground">
              <strong>Amazon Associates Disclosure:</strong> Commonly is an independent editorial curation. As an Amazon Associate, we earn from qualifying purchases at zero extra cost to you.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 border border-border bg-secondary p-6">
              <div className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-5" />
              </div>
              <h3 className="mt-5 font-serif text-2xl">You&apos;re in.</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your account is ready. We&apos;ll keep the good stuff coming.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Country</Label>
                <CountrySelect
                  id="location"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="6+ characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pr-11"
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
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">{error}</p>
              )}

              <Button type="submit" size="lg" className="mt-3" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'} <ArrowRight data-icon="inline-end" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">By joining, you agree to our terms and privacy policy.</p>
            </form>
          )}

          <p className="mt-8 text-sm text-muted-foreground">
            Already a member?{' '}
            <button
              type="button"
              onClick={() => router.push('/?login=1')}
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}
