'use client'

import Link from 'next/link'
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { RegisterGate } from '@/components/register-gate'
import { useAuth } from '@/lib/auth-store'
import { storefrontNavGroups, storefrontNavSlug, type StorefrontNavGroup } from '@/lib/storefront-navigation'

function DropdownGroup({ group, onNavigate }: { group: StorefrontNavGroup; onNavigate: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="group relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-1 rounded-md px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-auto md:px-2 md:py-3 lg:px-3 whitespace-nowrap"
      >
        <span>{group.label}</span>
        <ChevronDown className={`size-3 transition-transform md:hidden ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`${open ? 'block' : 'hidden'} relative mt-1 border-border bg-background md:absolute md:left-1/2 md:top-full md:z-[70] md:mt-0 md:w-72 md:-translate-x-1/2 md:rounded-md md:border md:shadow-xl`}>
        <div className="p-3">
          {group.items.map((item) => (
            <Link
              key={item}
              href={`/category/${group.slug}/${storefrontNavSlug(item)}`}
              onClick={onNavigate}
              className="block rounded-sm px-3 py-2.5 text-xs uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener('commonly:open-auth', handler)
    return () => window.removeEventListener('commonly:open-auth', handler)
  }, [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] bg-primary px-4 py-2 text-center text-xs font-medium tracking-wider text-primary-foreground">
        Curated with Care · Independent Luxury &amp; Clinical Editorial · Verified Amazon Prime Fulfillment
      </div>
      <header className="fixed inset-x-0 top-8 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <button className="md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
          <Link href="/" className="shrink-0 font-serif text-2xl tracking-tight">Commonly.</Link>
          <nav
            className={`${open ? 'flex' : 'hidden'} absolute left-0 top-full z-20 max-h-[calc(100vh-7rem)] w-full flex-col gap-1 overflow-y-auto border-b border-border/80 bg-background p-3 shadow-lg md:static md:flex md:max-h-none md:w-auto md:flex-1 md:flex-row md:justify-center md:gap-0.5 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none lg:gap-1.5`}
            aria-label="Main navigation"
          >
            {storefrontNavGroups.map((group) => (
              <DropdownGroup key={group.label} group={group} onNavigate={() => setOpen(false)} />
            ))}
            <div className="mt-3 border-t border-border/60 pt-3 md:hidden">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="px-3 text-xs text-muted-foreground">Signed in as <strong>{user.name || user.email}</strong></p>
                  <button
                    type="button"
                    onClick={() => { setOpen(false); logout() }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-xs font-semibold uppercase tracking-wider"
                  >
                    <LogOut className="size-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setOpen(false); setAuthOpen(true) }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-xs"
                >
                  <User className="size-3.5" />
                  <span>Log In / Register</span>
                </button>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <span className="text-xs text-muted-foreground">{user.name || user.email}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground shadow-xs backdrop-blur-md transition-all hover:border-primary/40 hover:bg-muted"
                >
                  <LogOut className="size-3.5 text-accent" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-foreground shadow-xs backdrop-blur-md transition-all hover:border-primary/40 hover:bg-muted"
              >
                <User className="size-3.5 text-accent" />
                <span>Log in</span>
              </button>
            )}
          </div>
        </div>
      </header>
      <RegisterGate isOpen={authOpen} onClose={() => setAuthOpen(false)} showTrigger={false} initialMode="login" />
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary px-5 py-14 text-primary-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl">Commonly.</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/70">
            Prestige beauty and clinical technology, thoughtfully found. We make the everyday ritual feel extraordinary.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Categories</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            {[
              { label: 'Luxury Skincare', slug: 'luxury-skincare' },
              { label: 'Clinical Tech', slug: 'clinical-tech' },
              { label: 'Salon Hair', slug: 'salon-hair' },
              { label: 'Fragrance & Body', slug: 'fragrance-body' },
            ].map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="hover:text-primary-foreground">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link href="/#shop" className="hover:text-primary-foreground">Shop all picks</Link>
            <Link href="/#categories" className="hover:text-primary-foreground">Luxury categories</Link>
            <Link href="/#guides" className="hover:text-primary-foreground">Clinical guides</Link>
            <Link href="/auth/register" className="hover:text-primary-foreground">Join the community</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">Company</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link href="/about" className="hover:text-primary-foreground">About us</Link>
            <Link href="/how-it-works" className="hover:text-primary-foreground">How it works</Link>
            <Link href="/contact" className="hover:text-primary-foreground">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">High-Ticket Edits</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link href="/category/luxury-skincare/high-end-serums" className="hover:text-primary-foreground">High-End Serums</Link>
            <Link href="/category/salon-hair/styling-drying-tech" className="hover:text-primary-foreground">Styling &amp; Drying Tech</Link>
            <Link href="/category/luxury-skincare/clinical-sun-care" className="hover:text-primary-foreground">Clinical Sun Care</Link>
            <Link href="/category/clinical-tech/led-microcurrent-devices" className="hover:text-primary-foreground">LED &amp; Microcurrent Devices</Link>
            <Link href="/category/fragrance-body/high-end-fragrances" className="hover:text-primary-foreground">High-End Fragrances</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Commonly. All rights reserved.</span>
        <span className="max-w-md text-center leading-relaxed sm:text-right">
          As an Amazon Associate I earn from qualifying purchases. Product prices, ratings, and availability are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply.
        </span>
      </div>
    </footer>
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><SiteHeader />{children}<SiteFooter /></div>
}

export default SiteHeader
