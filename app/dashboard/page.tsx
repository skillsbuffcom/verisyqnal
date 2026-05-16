'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, Film, Network, Upload } from 'lucide-react'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { PageHeader } from '@/components/ui/PageHeader'
import { RelationshipType, RelationshipStatus } from '@/lib/types'

type Relationship = {
  id: string
  entityA: { name: string }
  entityB: { name: string }
  type: RelationshipType
  status: RelationshipStatus
  formation: string
  confidence: number | null
  rationale: string | null
  alignmentFactors: string[]
}

type Stats = { entities: number; relationships: number; programmes: number; matches: number }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ entities: 0, relationships: 0, programmes: 0, matches: 0 })
  const [recent, setRecent] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, recentRes] = await Promise.all([
          fetch('/api/stats').then(r => r.json()),
          fetch('/api/relationships?type=mentor_startup&limit=3').then(r => r.json()),
        ])
        
        if (statsRes.success) {
          setStats(statsRes.stats)
        }
        
        if (recentRes.success) {
          setRecent(recentRes.relationships ?? [])
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Entities', value: stats.entities },
    { label: 'Active Relationships', value: stats.relationships },
    { label: 'Programmes Running', value: stats.programmes },
    { label: 'AI Matches Approved', value: stats.matches },
  ]

  const demoFlow = [
    { label: 'Upload pitch deck', href: '/entities/new', icon: Upload },
    { label: 'Run matching', href: '/programmes', icon: Bot },
    { label: 'Review briefings', href: '/programmes', icon: Film },
    { label: 'Open ecosystem graph', href: '/graph', icon: Network },
  ]

  if (loading) return <div className="p-8"><LoadingSpinner label="Loading ecosystem data..." /></div>

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title="Dashboard" subtitle="Verisyqnal — Programmable Ecosystem Infrastructure" />

      <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="col-span-full mb-4 lg:col-span-1 lg:mb-0">
          <div className="app-panel metric-glow rounded-4xl p-8 border border-(--border-strong) relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-(--teal-soft) rounded-full blur-3xl opacity-20 pointer-events-none" />
            <p className="mono text-[10px] uppercase tracking-[0.28em] text-(--teal-strong) font-bold">Ecosystem Control</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-tighter leading-[1.1]">Relationship Objects</h1>
            <p className="app-muted mt-5 text-sm leading-7 max-w-sm">
              Your ecosystem is now programmable. Every match, every mentor, and every 
              ecosystem memory can live in one structured system.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className="rounded-full bg-(--teal) px-6 py-2.5 text-sm font-bold text-(--accent-foreground) hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Open Demo Narrative
              </Link>
              <Link href="/about-relationship-object" className="rounded-full border border-(--border-strong) px-6 py-2.5 text-sm font-semibold hover:bg-(--surface-muted) transition-colors">
                View Relationship Object
              </Link>
            </div>
          </div>
        </section>

        <section className="app-panel rounded-4xl p-6">
          <p className="mono text-[10px] uppercase tracking-[0.28em] text-(--teal-strong) font-bold">Pitch Flow</p>
          <div className="mt-5 space-y-3">
            {demoFlow.map(({ label, href, icon: Icon }, index) => (
              <Link key={label} href={href} className="flex items-center justify-between rounded-4xl border border-(--border) bg-(--surface-muted) px-5 py-3.5 hover:border-(--teal) transition-all group">
                <div className="flex items-center gap-4">
                  <span className="rounded-xl bg-(--teal-soft) p-2.5 text-(--teal-strong) group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="mono text-[10px] uppercase tracking-[0.24em] text-(--text-muted) font-bold">Step 0{index + 1}</p>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-(--text-muted) group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value }) => (
          <div key={label} className="app-panel metric-glow rounded-4xl p-6 border-b-4 border-b-(--teal-soft)">
            <p className="mono text-4xl font-bold text-foreground tracking-tight">{value}</p>
            <p className="app-muted mt-2 text-xs font-bold uppercase tracking-widest opacity-60 text-(--text-muted)">{label}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mb-8">
          <h2 className="mono mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-(--text-muted) ml-2">Recent Relationships</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map(r => (
              <RelationshipCard
                key={r.id}
                entityAName={r.entityA.name}
                entityBName={r.entityB.name}
                type={r.type}
                status={r.status}
                formation={r.formation}
                confidence={r.confidence}
                rationale={r.rationale}
                alignmentFactors={r.alignmentFactors}
              />
            ))}
          </div>
        </div>
      )}

      <Link
        href="/graph"
        className="flex w-full items-center justify-center gap-3 rounded-4xl bg-(--teal) py-5 text-lg font-bold text-(--accent-foreground) hover:opacity-90 transition-all hover:scale-[1.005] active:scale-[0.995]"
      >
        View Ecosystem Graph
        <ArrowRight size={20} />
      </Link>
    </div>
  )
}
