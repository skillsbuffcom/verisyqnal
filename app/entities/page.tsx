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
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const fetchEntities = useCallback(async () => {
    try {
      const url = filter ? `/api/entities?type=${filter}` : '/api/entities'
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) setEntities(data.entities)
      else setError(data.error)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    fetchEntities()
    const interval = setInterval(fetchEntities, 30000)
    return () => clearInterval(interval)
  }, [fetchEntities])

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
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {entities.map((e) => (
            <EntityCard key={e.id} {...e} />
          ))}
        </div>
      )}
    </div>
  )
}
