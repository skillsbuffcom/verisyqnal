'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    { label: 'Total Entities', value: stats.entities, color: 'bg-blue-50 text-[#1A56DB]' },
    { label: 'Active Relationships', value: stats.relationships, color: 'bg-green-50 text-[#0E9F6E]' },
    { label: 'Programmes Running', value: stats.programmes, color: 'bg-orange-50 text-orange-600' },
    { label: 'Matches Made', value: stats.matches, color: 'bg-purple-50 text-purple-600' },
  ]

  if (loading) return <div className="p-8"><LoadingSpinner label="Loading ecosystem data..." /></div>

  return (
    <div className="p-8">
      <PageHeader title="Dashboard" subtitle="Verisyqnal — Programmable Ecosystem Infrastructure" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-5 ${color.split(' ')[0]} border border-gray-100`}>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className={`text-sm font-medium mt-1 ${color.split(' ')[1]}`}>{label}</p>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Relationships</h2>
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
        className="flex items-center justify-center w-full py-4 bg-[#0F172A] text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-colors"
      >
        View Ecosystem Graph →
      </Link>
    </div>
  )
}
