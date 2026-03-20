import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JanInsight - Real-time Constituency Intelligence',
  description: 'AI Co-Pilot for Indian Governance. Real-time constituency intelligence with booth-level heatmaps and sentiment analysis.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a1f35',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
