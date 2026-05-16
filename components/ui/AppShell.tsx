'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar, navItems } from '@/components/ui/Sidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showSidebar = pathname !== '/'
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (!showSidebar) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-(--border) bg-(--background)/92 backdrop-blur">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-(--teal-strong) uppercase hover:opacity-80 transition-opacity lg:hidden">
              Verisyqnal
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileNavOpen((open) => !open)}
                className="inline-flex items-center justify-center rounded-full border border-(--border) p-2 text-foreground hover:border-(--teal) hover:text-(--teal-strong) transition-colors lg:hidden"
                aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {mobileNavOpen && (
            <nav className="space-y-1 border-t border-(--border) px-4 py-3">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                      active
                        ? 'bg-(--surface-muted) text-foreground'
                        : 'text-(--text-muted)'
                    }`}
                  >
                    <span className="rounded-xl bg-(--surface-muted) p-2">
                      <Icon size={16} />
                    </span>
                    <span>{label}</span>
                  </Link>
                )
              })}
            </nav>
          )}
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
