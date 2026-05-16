'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RelationshipStatus } from '@/lib/types'

type Programme = {
  id: string
  name: string
  cohort: string | null
  status: string | null
  geography: string[]
  owner: string | null
}

const GEO_OPTIONS = ['MY', 'SG', 'ID', 'TH']

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', cohort: '', owner: '', geography: [] as string[], status: 'active' })
  const [saving, setSaving] = useState(false)

  async function fetchProgrammes() {
    try {
      const res = await fetch('/api/programmes')
      const data = await res.json()
      if (data.success) setProgrammes(data.programmes)
      else setError(data.error)
    } catch (e) { setError(String(e)) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProgrammes() }, [])

  const filteredProgrammes = programmes.filter((programme) => {
    const needle = search.trim().toLowerCase()
    if (!needle) return true
    return [programme.name, programme.cohort ?? '', programme.owner ?? '', programme.geography.join(' ')]
      .some((value) => value.toLowerCase().includes(needle))
  })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/programmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) { setShowModal(false); fetchProgrammes() }
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Programmes"
        subtitle="Innovation accelerators and cohorts"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            New Programme
          </button>
        }
      />

      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search programmes, cohorts, owners, or geographies"
          className="app-panel w-full rounded-[1.25rem] px-4 py-3 text-sm"
        />
      </div>

      {loading && <LoadingSpinner label="Loading programmes..." />}
      {error && !loading && (
        <EmptyState title="Failed to load" description={error} action={<button onClick={fetchProgrammes} className="text-sm text-[#1A56DB] underline">Retry</button>} />
      )}
      {!loading && !error && programmes.length === 0 && (
        <EmptyState title="No programmes yet" description="Create your first programme." action={<button onClick={() => setShowModal(true)} className="text-sm text-[#1A56DB] underline">New Programme</button>} />
      )}
      {!loading && programmes.length > 0 && filteredProgrammes.length === 0 && (
        <EmptyState title="No matching programmes" description="Try a different search term." />
      )}
      {!loading && filteredProgrammes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProgrammes.map((p) => (
            <Link key={p.id} href={`/programmes/${p.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                {p.status && <StatusBadge status={p.status as RelationshipStatus} />}
              </div>
              {p.cohort && <p className="text-sm text-gray-500">{p.cohort}</p>}
              {p.owner && <p className="text-xs text-gray-400 mt-1">{p.owner}</p>}
              {p.geography.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {p.geography.map(g => <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{g}</span>)}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold mb-4">New Programme</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              {[
                { key: 'name', label: 'Programme Name', placeholder: 'MAGIC Accelerate Cohort 8', required: true },
                { key: 'cohort', label: 'Cohort', placeholder: 'Cohort 8' },
                { key: 'owner', label: 'Owner', placeholder: 'Cradle Fund' },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                  <input
                    required={required}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Geography</label>
                <div className="flex gap-2">
                  {GEO_OPTIONS.map(g => (
                    <label key={g} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.geography.includes(g)}
                        onChange={(e) => setForm({ ...form, geography: e.target.checked ? [...form.geography, g] : form.geography.filter(x => x !== g) })}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#1A56DB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
