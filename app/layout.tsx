import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CookieBanner } from '@/components/cookie-banner'
import { AuthProvider } from '@/lib/auth-store'

export const metadata: Metadata = {
  title: 'Commonlys. — Curated Workspace & High-Performance Tech Gear',
  description: 'An independent curation of verified high-performance everyday tech, smart automotive gear, and workspace architecture on Amazon.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
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
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <script type="text/javascript" src="https://s.skimresources.com/js/309805X1798173.skimlinks.js"></script>
        </AuthProvider>
      </body>
      
    </html>
  )
}
