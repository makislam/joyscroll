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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JoyScroll',
  },
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
