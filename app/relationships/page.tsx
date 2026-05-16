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
    <div className="p-8">
      <PageHeader title="Relationships" subtitle="All Relationship Objects in your ecosystem" />

      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f.value ? 'bg-[#1A56DB] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search startups, mentors, or rationale"
          className="app-panel w-full rounded-[1.25rem] px-4 py-3 text-sm"
        />
      </div>

      {loading && <LoadingSpinner label="Loading relationships..." />}
      {error && !loading && (
        <EmptyState title="Failed to load" description={error} action={<button onClick={fetchRelationships} className="text-sm text-[#1A56DB] underline">Retry</button>} />
      )}
      {!loading && filteredRelationships.length === 0 && (
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
              <p className="text-sm text-gray-500">
                Showing {relationships.length} of {total} relationships
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all"
              >
                {loadingMore ? 'Loading...' : 'Load More Relationships'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
