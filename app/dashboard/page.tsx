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
        const [eRes, rRes, pRes] = await Promise.all([
          fetch('/api/entities').then(r => r.json()),
          fetch('/api/relationships').then(r => r.json()),
          fetch('/api/programmes').then(r => r.json()),
        ])
        const rels: Relationship[] = rRes.relationships ?? []
        const matches = rels.filter(r => r.formation === 'ai_matched').length
        setStats({
          entities: eRes.entities?.length ?? 0,
          relationships: rels.length,
          programmes: pRes.programmes?.length ?? 0,
          matches,
        })
        setRecent(rels.filter(r => r.type === 'mentor_startup').slice(0, 3))
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
    <div className="p-8">
      <PageHeader title="Dashboard" subtitle="Verisyqnal — Programmable Ecosystem Infrastructure" />

      <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="app-panel rounded-[2rem] p-6">
          <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal-strong)]">Potential Signal</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.05em]">
            A control plane for ecosystem relationships, not another operations dashboard.
          </h2>
          <p className="app-muted mt-4 max-w-2xl text-sm leading-7">
            This workspace is designed to prove that mentor matching, approval workflows, briefing generation, and
            ecosystem memory can live in one structured system.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/demo" className="rounded-full bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-slate-950">
              Open Demo Narrative
            </Link>
            <Link href="/about-relationship-object" className="rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm">
              View Relationship Object
            </Link>
          </div>
        </section>

        <section className="app-panel rounded-[2rem] p-5">
          <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal-strong)]">Pitch Flow</p>
          <div className="mt-4 space-y-3">
            {demoFlow.map(({ label, href, icon: Icon }, index) => (
              <Link key={label} href={href} className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-[var(--teal-soft)] p-2 text-[var(--teal-strong)]">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Step 0{index + 1}</p>
                    <p className="text-sm font-medium">{label}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-[var(--text-muted)]" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value }) => (
          <div key={label} className="app-panel metric-glow rounded-[1.75rem] p-5">
            <p className="mono text-3xl font-semibold text-[var(--foreground)]">{value}</p>
            <p className="app-muted mt-2 text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mb-8">
          <h2 className="mono mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Recent Relationships</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        className="flex w-full items-center justify-center gap-2 rounded-[1.75rem] bg-[var(--foreground)] py-4 text-lg font-semibold text-[var(--background)]"
      >
        View Ecosystem Graph
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
