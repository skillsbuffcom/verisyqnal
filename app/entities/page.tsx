'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { EntityCard } from '@/components/ui/EntityCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EntityType } from '@/lib/types'

type Entity = {
  id: string
  type: EntityType
  name: string
  tags: string[]
  geography: string | null
  stage: string | null
}

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Startup', value: 'startup' },
  { label: 'Mentor', value: 'mentor' },
  { label: 'Partner', value: 'partner' },
  { label: 'Programme', value: 'programme' },
]

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const PAGE_SIZE = 12

  const fetchEntities = useCallback(async (isLoadMore = false) => {
    try {
      const skip = isLoadMore ? (page + 1) * PAGE_SIZE : 0
      const baseUrl = `/api/entities?take=${PAGE_SIZE}&skip=${skip}`
      const url = filter ? `${baseUrl}&type=${filter}` : baseUrl
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.success) {
        if (isLoadMore) {
          setEntities(prev => [...prev, ...data.entities])
          setPage(p => p + 1)
        } else {
          setEntities(data.entities)
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
  }, [filter, page])

  useEffect(() => {
    setLoading(true)
    fetchEntities()
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    setLoadingMore(true)
    fetchEntities(true)
  }

  const filteredEntities = entities.filter((e) => {
    const s = search.toLowerCase()
    return (
      e.name.toLowerCase().includes(s) ||
      e.tags.some((t) => t.toLowerCase().includes(s)) ||
      (e.stage?.toLowerCase().includes(s) ?? false) ||
      (e.geography?.toLowerCase().includes(s) ?? false)
    )
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Entities"
        subtitle="Startups, mentors, and partners in the ecosystem"
        action={
          <Link
            href="/entities/new"
            className="block w-full sm:w-auto rounded-lg bg-(--teal) px-4 py-2 text-center text-sm font-medium text-(--accent-foreground) hover:opacity-90 transition-opacity"
          >
            Add Entity
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f.value
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
          placeholder="Search name, tags, stage, or geography"
          className="app-panel w-full rounded-[1.25rem] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
        />
      </div>

      {loading && <LoadingSpinner label="Loading entities..." />}
      {error && !loading && (
        <EmptyState
          title="Failed to load"
          description={error}
          action={
            <button onClick={() => fetchEntities()} className="text-sm font-semibold text-(--teal-strong) underline">
              Retry
            </button>
          }
        />
      )}
      {!loading && !error && entities.length === 0 && (
        <EmptyState
          title="No entities yet"
          description="Add your first startup or mentor."
          action={
            <Link href="/entities/new" className="text-sm font-semibold text-(--teal-strong) underline">
              Add Entity
            </Link>
          }
        />
      )}
      
      {!loading && !error && entities.length > 0 && filteredEntities.length === 0 && (
        <EmptyState title="No matches found" description="Try adjusting your search criteria." />
      )}

      {!loading && filteredEntities.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEntities.map((e) => (
              <EntityCard key={e.id} {...e} />
            ))}
          </div>

          {entities.length < total && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-(--text-muted) font-medium">
                Showing {entities.length} of {total} entities
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-(--surface-strong) border border-(--border) rounded-xl text-sm font-semibold text-foreground shadow-sm hover:bg-(--surface-muted) hover:border-(--border-strong) disabled:opacity-50 transition-all"
              >
                {loadingMore ? 'Loading...' : 'Load More Entities'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
