import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/ui/AppShell'
import { THEME_STORAGE_KEY } from '@/lib/theme'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Verisyqnal',
  description: 'Programmable infrastructure for innovation ecosystems',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('${THEME_STORAGE_KEY}');var theme=stored==='dark'||stored==='light'?stored:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='light';}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
