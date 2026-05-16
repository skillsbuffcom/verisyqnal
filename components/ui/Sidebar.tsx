'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Briefcase, GitBranch, Network, Home } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export const navItems = [
  { href: '/', label: 'Return to Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/entities', label: 'Entities', icon: Users },
  { href: '/programmes', label: 'Programmes', icon: Briefcase },
  { href: '/relationships', label: 'Relationships', icon: GitBranch },
  { href: '/graph', label: 'Graph', icon: Network },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-(--border) bg-[#071311]/92 px-4 py-6 text-white backdrop-blur-xl lg:flex">
      <Link href="/" className="block rounded-4xl border border-white/10 bg-white/5 px-6 py-6 shadow-2xl hover:border-white/20 transition-all group/logo">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2dd4bf] group-hover/logo:text-white transition-colors">Verisyqnal</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight leading-tight">Control plane for relationships</h1>
        <p className="mt-3 text-xs text-white/50 leading-relaxed font-medium">Programmable infrastructure for accelerators, funders, and ecosystem operators.</p>
      </Link>

      <nav className="flex-1 space-y-1.5 px-2 py-8">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 group ${
                active
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-white/5'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`rounded-xl p-2 transition-colors ${active ? 'bg-(--teal-soft) text-(--teal)' : 'bg-white/5 group-hover:bg-white/10'}`}>
                <Icon size={18} />
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-4 rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <p className="mono text-[10px] uppercase tracking-[0.28em] text-white/60 font-bold">Settings</p>
          <ThemeToggle />
        </div>
        <div>
          <p className="mono text-[11px] uppercase tracking-widest text-white/50 font-bold">Platform Thesis</p>
          <p className="mt-2 text-xs text-white/70 leading-relaxed">Turn one-off introductions into institutional memory.</p>
        </div>
      </div>
    </div>
  )
}
