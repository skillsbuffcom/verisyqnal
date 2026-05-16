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
    <div className="sticky top-0 flex h-screen w-72 shrink-0 flex-col border-r border-[var(--border)] bg-[#071311]/92 px-4 py-4 text-white backdrop-blur-xl">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8ef0df]">Verisyqnal</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">Control plane for relationships</h1>
        <p className="mt-2 text-sm text-slate-400">Programmable infrastructure for accelerators, funders, and ecosystem operators.</p>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? 'bg-[linear-gradient(135deg,rgba(45,212,191,0.18),rgba(255,255,255,0.04))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`rounded-xl p-2 ${active ? 'bg-white/10 text-[#8ef0df]' : 'bg-white/5'}`}>
                <Icon size={16} />
              </span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <p className="mono text-[11px] uppercase tracking-[0.28em] text-[#8ef0df]">Platform Thesis</p>
        <p className="mt-2 text-sm text-slate-300">Turn one-off introductions into institutional memory.</p>
      </div>
    </div>
  )
}
