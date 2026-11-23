import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CookieBanner } from '@/components/cookie-banner'
import { OptionalTrackingScripts } from '@/components/optional-tracking-scripts'
import { AuthProvider } from '@/lib/auth-store'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.commonlys.com'),
  title: 'Commonlys. — Curated Product Directory',
  description: 'Independent product curation for everyday technology, smart home, kitchen, automotive, and workspace gear.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Commonlys. — Curated Product Directory',
    description: 'Independent product curation for everyday technology, smart home, kitchen, automotive, and workspace gear.',
    url: 'https://www.commonlys.com',
    siteName: 'Commonlys',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commonlys. — Curated Product Directory',
    description: 'Independent product curation for everyday technology, smart home, kitchen, automotive, and workspace gear.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <CookieBanner />
          <OptionalTrackingScripts />
        </AuthProvider>
      </body>
      
    </html>
  )
}
