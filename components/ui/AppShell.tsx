'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/ui/Sidebar'

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showSidebar = pathname !== '/'

  if (!showSidebar) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
