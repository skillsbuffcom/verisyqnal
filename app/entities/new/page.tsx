'use client'

import { useState, useRef, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DemoModeToggle } from '@/components/ui/DemoModeToggle'
import { DEMO_MODE_HEADER } from '@/lib/demo-mode'
import { StartupProfile } from '@/lib/types'

type Tab = 'upload' | 'mentor'

export default function NewEntityPage() {
  const [tab, setTab] = useState<Tab>('upload')
  const [demoMode, setDemoMode] = useState(false)
  return (
    <div className="p-8 max-w-2xl">
      <PageHeader
        title="Add Entity"
        subtitle="Upload a pitch deck or add a mentor manually"
        action={<DemoModeToggle onChange={setDemoMode} />}
      />
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(['upload', 'mentor'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'upload' ? 'Upload Pitch Deck' : 'Add Mentor Manually'}
          </button>
        ))}
      </div>
      {tab === 'upload' ? <UploadTab demoMode={demoMode} /> : <MentorTab />}
    </div>
  )
}

function UploadTab({ demoMode }: { demoMode: boolean }) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<StartupProfile | null>(null)
  const [editedProfile, setEditedProfile] = useState<StartupProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rawError, setRawError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setFile(f)
  }

  async function handleExtract() {
    if (!file) return
    setLoading(true)
    setError(null)
    setRawError(null)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/entities/ingest', {
        method: 'POST',
        body: fd,
        headers: demoMode ? { [DEMO_MODE_HEADER]: '1' } : undefined,
      })
      const data = await res.json()
      if (data.success) {
        setProfile(data.extracted_profile)
        setEditedProfile(data.extracted_profile)
      } else {
        setError(data.error)
        setRawError(data.raw ?? null)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editedProfile) return
    setSaving(true)
    try {
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'startup',
          name: editedProfile.company_name,
          profile: editedProfile,
          tags: editedProfile.tags,
          geography: editedProfile.geography,
          stage: editedProfile.stage,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/entities')
      else setError(data.error)
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Gemini is reading your deck..." />

  if (profile && editedProfile) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 mb-2">Review and edit the extracted profile before saving.</p>
        {(['company_name', 'industry', 'problem', 'solution', 'geography', 'revenue_model'] as (keyof StartupProfile)[]).map((field) => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{field.replace('_', ' ')}</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
              value={editedProfile[field] as string}
              onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Stage</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
            value={editedProfile.stage}
            onChange={(e) => setEditedProfile({ ...editedProfile, stage: e.target.value as StartupProfile['stage'] })}
          >
            {['idea', 'pre-seed', 'seed', 'series-a'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-[#1A56DB] text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Entity'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          dragging ? 'border-[#1A56DB] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <p className="text-4xl mb-3">📄</p>
        <p className="text-sm font-medium text-gray-700">
          {file ? file.name : 'Drop a PDF pitch deck here, or click to browse'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only · max 10MB</p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
          {rawError && <pre className="text-xs text-red-500 mt-2 overflow-auto">{rawError}</pre>}
        </div>
      )}
      <button
        onClick={handleExtract}
        disabled={!file}
        className="w-full py-2.5 bg-[#1A56DB] text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        Extract Profile
      </button>
    </div>
  )
}

function MentorTab() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', bio: '', expertise: '', past_exits: '', industries: '', geography: '', availability: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const profile = {
        name: form.name,
        bio: form.bio,
        expertise: form.expertise.split(',').map(s => s.trim()).filter(Boolean),
        past_exits: parseInt(form.past_exits) || 0,
        industries: form.industries.split(',').map(s => s.trim()).filter(Boolean),
        geography: form.geography,
        availability: form.availability,
      }
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'mentor',
          name: form.name,
          profile,
          tags: profile.expertise,
          geography: form.geography,
        }),
      })
      const data = await res.json()
      if (data.success) router.push('/entities')
      else setError(data.error)
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { key: 'name', label: 'Full Name', placeholder: 'Dr. Ahmad Razif' },
        { key: 'bio', label: 'Bio', placeholder: 'Serial entrepreneur with 3 exits in B2B SaaS...' },
        { key: 'expertise', label: 'Expertise (comma-separated)', placeholder: 'B2B SaaS, Enterprise Sales, Fundraising' },
        { key: 'past_exits', label: 'Past Exits (number)', placeholder: '2', type: 'number' },
        { key: 'industries', label: 'Industries (comma-separated)', placeholder: 'FinTech, SaaS' },
        { key: 'geography', label: 'Geography', placeholder: 'Malaysia' },
        { key: 'availability', label: 'Availability', placeholder: '4 hours/month' },
      ].map(({ key, label, placeholder, type }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
          <input
            type={type || 'text'}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
            placeholder={placeholder}
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
      <button
        type="submit"
        disabled={saving || !form.name}
        className="w-full py-2.5 bg-[#0E9F6E] text-white rounded-lg font-medium text-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Add Mentor'}
      </button>
    </form>
  )
}
