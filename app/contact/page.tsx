"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { SiteChrome } from '@/components/site-header'

const contactEmail = 'ohwojerogodstime@gmail.com'
const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://web.facebook.com/profile.php?id=61596183110269',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.3 1.6-4.3 4.5v2.1H7v3.2h2.9V21h3.6Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ohwojero_godstime/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.7" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@ohwojerogodstime',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.6 8.3a7.1 7.1 0 0 1-4.4-1.5v7.1a5.7 5.7 0 1 1-5.7-5.7c.4 0 .8 0 1.1.1v3.2a2.6 2.6 0 1 0 1.5 2.4V2.8h3.1c.2 2 1.5 3.6 3.4 4.1.3.1.7.2 1 .2v3.1Z" />
      </svg>
    ),
  },
]

export default function ContactPage() {
  const [emailOpened, setEmailOpened] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const senderEmail = String(formData.get('email') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const subject = `Contact message from ${name}`
    const body = `Name: ${name}\nEmail: ${senderEmail}\n\n${message}`
    const params = new URLSearchParams({ subject, body })

    window.location.href = `mailto:${contactEmail}?${params.toString()}`
    setEmailOpened(true)
  }

  return (
    <SiteChrome>
      <main className="min-h-screen bg-background pt-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Get in touch</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl">
              Let&apos;s talk about the good stuff.
            </h1>
            <p className="mt-7 max-w-md leading-7 text-muted-foreground">
              Have a product question, a partnership idea, or a thoughtful recommendation? We&apos;d love to hear from you.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Send an email"
                className="inline-flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
              >
                <Mail className="size-6" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/2349020266783"
                target="_blank"
                rel="noreferrer"
                aria-label="Open WhatsApp"
                className="inline-flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.48 15.01L2.2 22l5.12-1.34A9.9 9.9 0 1 0 12.04 2Zm0 17.98a8.04 8.04 0 0 1-4.1-1.12l-.3-.18-3.04.8.81-2.97-.2-.31a8.08 8.08 0 1 1 6.83 3.78Zm4.43-6.05c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.69 2.58 4.09 3.62.57.25 1.01.4 1.36.52.57.18 1.09.16 1.5.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </a>
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${label}`}
                  className="inline-flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-secondary text-secondary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-md [&_svg]:size-6"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="border border-border bg-card p-6 sm:p-10">
            <h2 className="font-serif text-3xl">Send a note</h2>
            {emailOpened ? (
              <div className="mt-10 border-l-2 border-accent pl-5">
                <p className="font-medium">Your email app should open with your message addressed to {contactEmail}.</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Review it and press Send in your email app. If it didn&apos;t open, email us directly at{' '}
                  <a className="underline underline-offset-4" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>
                  .
                </p>
                <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
                  Return home
                </Link>
              </div>
            ) : (
              <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Name
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="h-11 border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Email
                  <input
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    className="h-11 border border-input bg-background px-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="resize-none border border-input bg-background p-3 font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </SiteChrome>
  )
}
