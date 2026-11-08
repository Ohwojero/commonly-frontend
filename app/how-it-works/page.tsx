import Link from 'next/link'
import { SiteChrome } from '@/components/site-header'

const steps = [
  { number: '01', title: 'We curate & test', text: 'We research workspace gadgets beyond marketing claims: ergonomic load distribution, tactile switch response, build longevity, and acoustic damping.' },
  { number: '02', title: 'We collate & organize', text: 'The directory remains focused on genuine productivity gains. Each gadget includes verified specs, who it is for, and why you should buy it.' },
  { number: '03', title: 'You upgrade your setup', text: 'Browse collated workspace categories, inspect full technical breakdowns, and purchase safely via official Amazon Prime fulfillment.' }
]

export default function HowItWorksPage() {
  return <SiteChrome><main className="min-h-screen bg-background pt-28"><section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">The Commonlys Method</p><h1 className="mt-5 max-w-4xl font-sans text-5xl font-bold leading-[1.02] tracking-tight text-pretty sm:text-7xl">A methodical collation of workspace hardware.</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">We turn the noisy world of desk gadgets into a curated, high-performance directory you can build your workstation around.</p><div className="mt-16 grid gap-px border border-border bg-border md:grid-cols-3">{steps.map((step) => <article key={step.number} className="bg-background p-7 sm:p-10"><p className="font-sans text-4xl font-bold text-accent">{step.number}</p><h2 className="mt-16 text-xl font-semibold">{step.title}</h2><p className="mt-4 leading-7 text-muted-foreground">{step.text}</p></article>)}</div></section><section className="bg-primary text-primary-foreground"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-end sm:justify-between lg:px-8"><div><p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">The short version</p><h2 className="mt-3 max-w-xl font-sans text-4xl font-bold leading-tight">Elite gadgets. Verified specs. Direct Amazon checkout.</h2></div><Link href="/#shop" className="shrink-0 text-sm underline underline-offset-4">Explore collated gadgets</Link></div></section></main></SiteChrome>
}
