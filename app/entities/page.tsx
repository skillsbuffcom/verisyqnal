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

  return (
    <div className="p-8">
      <PageHeader
        title="Entities"
        subtitle="Startups, mentors, partners, and programmes in your ecosystem"
        action={
          <Link
            href="/entities/new"
            className="px-4 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add Entity
          </Link>
        }
      />

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors select-none cursor-default ${
              filter === f.value
                ? 'bg-[#1A56DB] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Loading entities..." />}
      {error && !loading && (
        <EmptyState
          title="Failed to load"
          description={error}
          action={
            <button onClick={fetchEntities} className="text-sm text-[#1A56DB] underline">
              Retry
            </button>
          }
        />
      )}
      {!loading && !error && entities.length === 0 && (
        <EmptyState
          title="No entities yet"
          description="Add your first entity to get started."
          action={
            <Link href="/entities/new" className="text-sm text-[#1A56DB] underline">
              Add Entity
            </Link>
          }
        />
      )}
      {!loading && entities.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {entities.map((e) => (
              <EntityCard key={e.id} {...e} />
            ))}
          </div>

          {entities.length < total && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {entities.length} of {total} entities
              </p>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all"
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
