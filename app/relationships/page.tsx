'use client'

import { useEffect, useState, useCallback } from 'react'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
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
  governance?: {
    approved_by?: string
    approved_at?: string
    can_modify?: string[]
  } | null
  memory?: Array<{
    timestamp?: string
    event?: string
    actor?: string
    notes?: string
  }>
}

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Dissolved', value: 'dissolved' },
]

export default function RelationshipsPage() {
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [showAuditLogs, setShowAuditLogs] = useState(false)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 12

  const fetchRelationships = useCallback(async (isLoadMore = false) => {
    try {
      const skip = isLoadMore ? (page + 1) * PAGE_SIZE : 0
      const baseUrl = `/api/relationships?type=mentor_startup&take=${PAGE_SIZE}&skip=${skip}`
      const url = statusFilter ? `${baseUrl}&status=${statusFilter}` : baseUrl
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.success) {
        if (isLoadMore) {
          setRelationships(prev => [...prev, ...data.relationships])
          setPage(p => p + 1)
        } else {
          setRelationships(data.relationships)
          setPage(0)
        }
        setTotal(data.total)
      } else {
        setError(data.error)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [statusFilter, page])

  useEffect(() => {
    setLoading(true)
    fetchRelationships()
  }, [statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    setLoadingMore(true)
    fetchRelationships(true)
  }

  const filteredRelationships = relationships.filter((relationship) => {
    const needle = search.trim().toLowerCase()
    if (!needle) return true
    return [relationship.entityA.name, relationship.entityB.name, relationship.rationale ?? '', relationship.formation]
      .some((value) => value.toLowerCase().includes(needle))
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Relationships"
        subtitle="Historical and active matches in your ecosystem"
        action={
          <div className="flex gap-2">
            <button className="rounded-lg bg-(--teal) px-4 py-2 text-sm font-medium text-(--accent-foreground) hover:opacity-90 transition-opacity">
              Export Memory
            </button>
            <button
              onClick={() => setShowAuditLogs(true)}
              className="rounded-lg bg-(--surface-muted) px-4 py-2 text-sm font-medium text-(--text-muted) hover:bg-(--border) transition-all"
            >
              Audit Logs
            </button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              statusFilter === f.value 
                ? 'bg-(--teal) text-(--accent-foreground)' 
                : 'border border-(--teal) text-(--teal-strong)'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search entities, types, or status..."
          className="app-panel w-full rounded-[1.25rem] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
        />
      </div>

      {loading && <LoadingSpinner label="Loading relationships..." />}
      {error && (
        <EmptyState
          title="Error"
          description={error}
          action={<button onClick={() => fetchRelationships()} className="text-sm font-semibold text-(--teal-strong) underline">Retry</button>}
        />
      )}
      
      {!loading && !error && relationships.length === 0 && (
        <EmptyState
          title="No relationships"
          description="Form your first relationship in a programme."
        />
      )}

      {!loading && relationships.length > 0 && filteredRelationships.length === 0 && (
        <EmptyState title="No relationships found" description="Adjust your search or approve mentor matches." />
      )}

      {!loading && filteredRelationships.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRelationships.map(r => (
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

          {relationships.length < total && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-(--text-muted) font-medium">
                Showing {relationships.length} of {total} relationships
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-(--surface-strong) border border-(--border) rounded-xl text-sm font-semibold text-foreground shadow-sm hover:bg-(--surface-muted) hover:border-(--border-strong) disabled:opacity-50 transition-all"
              >
                {loadingMore ? 'Loading...' : 'Load More Relationships'}
              </button>
            </div>
          )}
        </>
      )}

      {showAuditLogs && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="absolute inset-y-0 right-0 w-full max-w-2xl overflow-auto border-l border-(--border) bg-background p-4 sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mono text-xs uppercase tracking-[0.28em] text-(--teal-strong)">Audit Logs</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Relationship activity and approvals</h2>
                <p className="app-muted mt-2 text-sm">Institutional history across match approvals, briefings, and relationship memory.</p>
              </div>
              <button
                onClick={() => setShowAuditLogs(false)}
                className="rounded-full border border-(--border) px-3 py-1.5 text-sm text-(--text-muted)"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {relationships.length === 0 && (
                <EmptyState title="No audit logs yet" description="Approve a relationship to start building institutional history." />
              )}

              {relationships.map((relationship) => {
                const entries = [
                  ...(relationship.governance?.approved_at
                    ? [{
                        timestamp: relationship.governance.approved_at,
                        event: 'match_approved',
                        actor: relationship.governance.approved_by ?? 'admin',
                        notes: `Approved for ${relationship.entityA.name} and ${relationship.entityB.name}.`,
                      }]
                    : []),
                  ...(relationship.memory ?? []),
                ]

                return (
                  <section key={relationship.id} className="app-panel rounded-[1.75rem] p-4">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-foreground">
                        {relationship.entityA.name} ↔ {relationship.entityB.name}
                      </p>
                      <p className="app-muted mt-1 text-xs">
                        {relationship.type.replace('_', ' ')} · {relationship.formation.replace('_', ' ')}
                      </p>
                    </div>

                    {entries.length === 0 ? (
                      <p className="app-muted text-sm">No audit entries recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {entries.map((entry, index) => (
                          <div key={`${relationship.id}-${index}`} className="rounded-2xl border border-(--border) bg-(--surface) p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium text-foreground">{entry.event ?? 'system_event'}</p>
                              {entry.timestamp && (
                                <p className="mono text-[11px] text-(--text-muted)">
                                  {new Date(entry.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <p className="app-muted mt-1 text-xs uppercase tracking-[0.2em]">
                              {entry.actor ?? 'system'}
                            </p>
                            {entry.notes && <p className="mt-2 text-sm text-foreground">{entry.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
