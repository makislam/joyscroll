import './globals.css'
import { Inter, Crimson_Text } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-crimson'
})

export const metadata = {
  title: 'JoyScroll - Discover Psalms',
  description: 'Discover verses from the Psalms in a beautiful, TikTok-like experience',
  keywords: ['psalms', 'bible', 'verses', 'scripture', 'christian', 'faith'],
  authors: [{ name: 'JoyScroll' }],
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#667eea',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JoyScroll',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-tap-highlight': 'no',
    'msapplication-TileColor': '#667eea',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body className="overscroll-none">
        {children}
      </body>
    </html>
  )
}
