'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, GitBranch, Network } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/entities', label: 'Entities', icon: Users },
  { href: '/programmes', label: 'Programmes', icon: Briefcase },
  { href: '/relationships', label: 'Relationships', icon: GitBranch },
  { href: '/graph', label: 'Graph', icon: Network },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full w-64 bg-[#0F172A] text-white">
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-bold tracking-tight">Verisyqnal</h1>
        <p className="text-xs text-slate-400 mt-0.5">Ecosystem Infrastructure</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'border-l-2 border-[#1A56DB] bg-white/5 text-[#1A56DB] pl-[10px]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
