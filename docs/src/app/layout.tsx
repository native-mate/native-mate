import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'native-mate — React Native UI Components',
  description:
    'Production-grade React Native components. Copy, paste, own. Built for New Architecture with Reanimated 3.',
  keywords: ['react native', 'ui components', 'expo', 'reanimated', 'typescript'],
  openGraph: {
    title: 'native-mate',
    description: 'Production-grade React Native UI components. No npm install.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ background: '#070709' }}>
      <body style={{ background: '#070709' }}>{children}</body>
    </html>
  )
}
