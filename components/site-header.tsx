'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, LogOut, Menu, User, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { RegisterGate } from '@/components/register-gate'
import { useAuth } from '@/lib/auth-store'
import {
  storefrontNavGroups,
  storefrontNavSlug,
  type StorefrontNavGroup,
} from '@/lib/storefront-navigation'

function DropdownGroup({
  group,
  onNavigate,
  pathname,
  clickedHref,
  onItemClick,
}: {
  group: StorefrontNavGroup
  onNavigate: () => void
  pathname: string
  clickedHref: string | null
  onItemClick: (href: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const [selectedSubNiche, setSelectedSubNiche] = useState<string | null>(null)

  const toggleSub = (subLabel: string) => {
    setMobileExpanded((prev) => ({ ...prev, [subLabel]: !prev[subLabel] }))
  }

  const handleSubNicheClick = (subLabel: string) => {
    toggleSub(subLabel)
    setSelectedSubNiche((prev) => (prev === subLabel ? null : subLabel))
  }

  const isFourCols = group.subNiches.length >= 4
  const colsWidthClass = isFourCols
    ? 'md:w-[780px] lg:w-[840px] md:grid-cols-4'
    : 'md:w-[640px] lg:w-[700px] md:grid-cols-3'

  const isPersonalEdit = group.slug === 'personal-edit'
  const desktopPositionClass = isPersonalEdit
    ? 'md:left-0 md:translate-x-0'
    : 'md:left-1/2 md:-translate-x-1/2'

  const normalize = (path?: string | null) =>
    path ? decodeURIComponent(path).toLowerCase().replace(/\/+$/, '') : ''

  const currentPath = normalize(pathname)
  const activeClicked = normalize(clickedHref)

  const isLinkActive = (href: string) => {
    const norm = normalize(href)
    if (!norm) return false
    if (activeClicked) {
      return activeClicked === norm
    }
    return currentPath === norm
  }

  const groupHref = `/category/${group.slug}`
  const isGroupActive =
    isLinkActive(groupHref) ||
    currentPath.startsWith(normalize(groupHref) + '/') ||
    (activeClicked ? activeClicked.startsWith(normalize(groupHref)) : false)

  const handleLinkSelect = (href: string) => {
    onItemClick(href)
    onNavigate()
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between gap-1.5 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-auto md:px-3 md:py-2.5 lg:px-4 whitespace-nowrap ${
          isGroupActive
            ? 'bg-muted text-foreground font-bold shadow-2xs'
            : 'text-foreground/90 hover:bg-muted/70 hover:text-accent'
        }`}
      >
        <span className="flex items-center gap-1.5">
          {group.label}
          {isGroupActive && (
            <span className="inline-block size-1.5 rounded-full bg-accent" />
          )}
        </span>
        <ChevronDown
          className={`size-3 transition-transform md:size-3.5 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu (Flyout Mega-Menu on Desktop / Collapsible on Mobile) */}
      <div
        className={`${
          open ? 'block' : 'hidden'
        } relative mt-1 border-border bg-background md:absolute md:top-full md:z-[70] md:mt-1 md:rounded-2xl md:border md:bg-background/98 md:p-5 lg:p-6 md:shadow-2xl md:backdrop-blur-xl max-w-[calc(100vw-2rem)] ${desktopPositionClass} ${colsWidthClass}`}
      >
        {/* Editorial Header (Desktop) */}
        <div className="hidden border-b border-border/60 pb-2.5 mb-3.5 md:col-span-full md:flex md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
              {group.eyebrow || 'Curated Edit'}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{group.tagline}</p>
          </div>
          <Link
            href={groupHref}
            onClick={() => handleLinkSelect(groupHref)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${
              isLinkActive(groupHref)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border/80 bg-background/80 text-foreground hover:border-accent/40 hover:bg-muted hover:text-accent'
            }`}
          >
            <span>Explore Entire Edit</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Sub-niches & child items */}
        <div
          className={`grid gap-4 p-1 md:col-span-full md:gap-5 lg:gap-6 md:p-0 ${
            isFourCols ? 'md:grid-cols-4' : 'md:grid-cols-3'
          }`}
        >
          {group.subNiches.map((subNiche) => {
            const isExpanded = !!mobileExpanded[subNiche.label]
            const subNicheHref = `/category/${group.slug}/${subNiche.slug}`
            const isSubActive =
              selectedSubNiche === subNiche.label ||
              (selectedSubNiche === null && isLinkActive(subNicheHref))

            return (
              <div key={subNiche.label} className="flex flex-col gap-2">
                <div className="border-b border-border/40 pb-1.5">
                  <button
                    type="button"
                    onClick={() => handleSubNicheClick(subNiche.label)}
                    className={`inline-flex w-full items-center justify-between gap-1.5 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      isSubActive
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'text-foreground hover:bg-muted/70 hover:text-accent'
                    }`}
                  >
                    <span>{subNiche.label}</span>
                    <ChevronDown
                      className={`size-3.5 transition-transform md:hidden ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>

                <ul
                  className={`flex flex-col gap-1 pl-0.5 md:flex ${
                    isExpanded ? 'flex' : 'hidden'
                  }`}
                >
                  {subNiche.items.map((item) => {
                    const itemHref = `/category/${group.slug}/${storefrontNavSlug(item)}`
                    const isItemActive = isLinkActive(itemHref)

                    return (
                      <li key={item}>
                        <Link
                          href={itemHref}
                          onClick={() => handleLinkSelect(itemHref)}
                          className={`group/item flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all duration-150 ${
                            isItemActive
                              ? 'bg-primary text-primary-foreground font-medium shadow-xs ring-1 ring-primary/20'
                              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                          }`}
                        >
                          <span className="truncate">{item}</span>
                          {isItemActive && (
                            <span className="size-1.5 rounded-full bg-accent shrink-0 ml-1.5" />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Mobile quick link */}
        <div className="mt-3 border-t border-border/60 pt-2.5 md:hidden">
          <Link
            href={groupHref}
            onClick={() => handleLinkSelect(groupHref)}
            className={`flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              isLinkActive(groupHref)
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-accent hover:bg-muted'
            }`}
          >
            <span>View all {group.label}</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const [clickedHref, setClickedHref] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setClickedHref(null)
  }, [pathname])

  useEffect(() => {
    const handler = () => setAuthOpen(true)
    window.addEventListener('commonly:open-auth', handler)
    return () => window.removeEventListener('commonly:open-auth', handler)
  }, [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] bg-primary px-4 py-2 text-center text-xs font-medium tracking-wider text-primary-foreground">
        Curated with Care · Peak Workspace Tech &amp; Quiet Luxury Rituals · Amazon Prime Verified
      </div>
      <header className="fixed inset-x-0 top-8 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <button
            className="md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <Link href="/" className="shrink-0 font-serif text-2xl tracking-tight">
            Commonly.
          </Link>
          <nav
            className={`${
              open ? 'flex' : 'hidden'
            } absolute left-0 top-full z-20 max-h-[calc(100vh-7rem)] w-full flex-col gap-1 overflow-y-auto border-b border-border/80 bg-background p-3 shadow-lg md:static md:flex md:max-h-none md:w-auto md:flex-1 md:flex-row md:justify-center md:gap-1 md:overflow-visible md:border-0 md:bg-transparent md:p-0 md:shadow-none lg:gap-2`}
            aria-label="Main navigation"
          >
            {storefrontNavGroups.map((group) => (
              <DropdownGroup
                key={group.label}
                group={group}
                onNavigate={() => setOpen(false)}
                pathname={pathname || ''}
                clickedHref={clickedHref}
                onItemClick={(href) => setClickedHref(href)}
              />
            ))}
            <div className="mt-3 border-t border-border/60 pt-3 md:hidden">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="px-3 text-xs text-muted-foreground">
                    Signed in as <strong>{user.name || user.email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border py-2.5 text-xs font-semibold uppercase tracking-wider"
                  >
                    <LogOut className="size-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setAuthOpen(true)
                  }}
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
                <span className="text-xs text-muted-foreground">
                  {user.name || user.email}
                </span>
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
      <RegisterGate
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        showTrigger={false}
        initialMode="login"
      />
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-primary px-5 py-14 text-primary-foreground lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl">
            Commonly.
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-primary-foreground/75">
            Where peak productivity infrastructure meets quiet luxury self-care. An independent
            curation of elite software engineer workspaces, clinical skincare, and premium
            workspace tech.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            The Edits
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            {storefrontNavGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/category/${group.slug}`}
                className="hover:text-primary-foreground"
              >
                {group.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Explore
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link href="/#shop" className="hover:text-primary-foreground">
              Shop all picks
            </Link>
            <Link href="/#categories" className="hover:text-primary-foreground">
              Curated Grid
            </Link>
            <Link href="/#featured-product" className="hover:text-primary-foreground">
              Spotlight pick
            </Link>
            <Link href="/auth/register" className="hover:text-primary-foreground">
              Join the community
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Company
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link href="/about" className="hover:text-primary-foreground">
              About us
            </Link>
            <Link href="/how-it-works" className="hover:text-primary-foreground">
              How it works
            </Link>
            <Link href="/contact" className="hover:text-primary-foreground">
              Contact
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Curated Niches
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/80">
            <Link
              href="/category/personal-edit/luxury-skincare"
              className="hover:text-primary-foreground"
            >
              Luxury Skincare
            </Link>
            <Link
              href="/category/personal-edit/clinical-tech"
              className="hover:text-primary-foreground"
            >
              Clinical Tech
            </Link>
            <Link
              href="/category/studio-edit/productivity-displays"
              className="hover:text-primary-foreground"
            >
              Productivity Displays
            </Link>
            <Link
              href="/category/studio-edit/acoustic-audio"
              className="hover:text-primary-foreground"
            >
              Acoustic &amp; Audio
            </Link>
            <Link
              href="/category/ergonomic-edit/executive-seating"
              className="hover:text-primary-foreground"
            >
              Executive Seating
            </Link>
            <Link
              href="/category/ergonomic-edit/aesthetic-desk-systems"
              className="hover:text-primary-foreground"
            >
              Aesthetic Desk Systems
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-3 border-t border-primary-foreground/20 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Commonly. All rights reserved.</span>
        <span className="max-w-md text-center leading-relaxed sm:text-right">
          As an Amazon Associate I earn from qualifying purchases. Product prices, ratings, and
          availability are subject to change. Any price and availability information displayed on
          Amazon at the time of purchase will apply.
        </span>
      </div>
    </footer>
  )
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}

export default SiteHeader
