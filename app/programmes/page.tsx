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
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Programmes"
        subtitle="Innovation accelerators and cohorts"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-(--teal) text-(--accent-foreground) rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
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
          className="app-panel w-full rounded-[1.25rem] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
        />
      </div>

      {loading && <LoadingSpinner label="Loading programmes..." />}
      {error && !loading && (
        <EmptyState title="Failed to load" description={error} action={<button onClick={fetchProgrammes} className="text-sm text-(--teal-strong) font-semibold underline">Retry</button>} />
      )}
      {!loading && !error && programmes.length === 0 && (
        <EmptyState title="No programmes yet" description="Create your first programme." action={<button onClick={() => setShowModal(true)} className="text-sm text-(--teal-strong) font-semibold underline">New Programme</button>} />
      )}
      {!loading && programmes.length > 0 && filteredProgrammes.length === 0 && (
        <EmptyState title="No matching programmes" description="Try a different search term." />
      )}
      {!loading && filteredProgrammes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProgrammes.map((p) => (
            <Link key={p.id} href={`/programmes/${p.id}`} className="app-panel app-ring block rounded-2xl p-5 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                {p.status && <StatusBadge status={p.status as RelationshipStatus} />}
              </div>
              {p.cohort && <p className="text-sm text-(--text-muted) font-medium">{p.cohort}</p>}
              {p.owner && <p className="text-xs text-(--text-muted) opacity-60 mt-1 uppercase tracking-wider font-mono">{p.owner}</p>}
              {p.geography.length > 0 && (
                <div className="flex gap-1 mt-3">
                  {p.geography.map(g => (
                    <span key={g} className="text-[10px] bg-(--surface-muted) text-(--text-muted) px-2 py-0.5 rounded-full font-bold">
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="app-panel-strong rounded-3xl p-8 w-full max-w-md shadow-2xl border border-(--border-strong)">
            <h2 className="text-2xl font-semibold mb-6 tracking-tight">New Programme</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { key: 'name', label: 'Programme Name', placeholder: 'MAGIC Accelerate Cohort 8', required: true },
                { key: 'cohort', label: 'Cohort', placeholder: 'Cohort 8' },
                { key: 'owner', label: 'Owner', placeholder: 'Cradle Fund' },
              ].map(({ key, label, placeholder, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-(--text-muted) uppercase tracking-widest mb-1.5 ml-1">{label}</label>
                  <input
                    required={required}
                    className="w-full bg-(--surface-muted) border border-(--border) rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-(--text-muted) uppercase tracking-widest mb-1.5 ml-1">Geography</label>
                <div className="flex flex-wrap gap-3 p-1">
                  {GEO_OPTIONS.map(g => (
                    <label key={g} className="flex items-center gap-2 text-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-(--border) text-(--teal) focus:ring-(--teal-soft)"
                        checked={form.geography.includes(g)}
                        onChange={(e) => setForm({ ...form, geography: e.target.checked ? [...form.geography, g] : form.geography.filter(x => x !== g) })}
                      />
                      <span className="group-hover:text-(--teal) transition-colors">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-(--text-muted) uppercase tracking-widest mb-1.5 ml-1">Status</label>
                <select 
                  className="w-full bg-(--surface-muted) border border-(--border) rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all" 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-(--text-muted) hover:bg-(--surface-muted) transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="flex-1 py-3 bg-(--teal) text-(--accent-foreground) rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {saving ? 'Creating...' : 'Create Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
