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
    <div className="max-w-2xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Add Entity"
        subtitle="Upload a pitch deck or add a mentor manually"
        action={<DemoModeToggle onChange={setDemoMode} />}
      />
      <div className="flex gap-1 mb-8 bg-(--surface-muted) rounded-xl p-1.5 w-fit border border-(--border)">
        {(['upload', 'mentor'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              tab === t 
                ? 'bg-(--surface-strong) shadow-sm text-foreground border border-(--border-strong)' 
                : 'text-(--text-muted) hover:text-foreground'
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
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-sm text-(--text-muted) mb-4 font-medium">Review and edit the extracted profile before saving to the institutional memory.</p>
        <div className="app-panel rounded-4xl p-8 space-y-5 border border-(--border-strong)">
          {(['company_name', 'industry', 'problem', 'solution', 'geography', 'revenue_model'] as (keyof StartupProfile)[]).map((field) => (
            <div key={field}>
              <label className="block text-[10px] font-bold text-(--teal-strong) mb-1.5 uppercase tracking-[0.2em] ml-1">{field.replace('_', ' ')}</label>
              <input
                className="w-full bg-(--surface-muted) border border-(--border) rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
                value={editedProfile[field] as string}
                onChange={(e) => setEditedProfile({ ...editedProfile, [field]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="block text-[10px] font-bold text-(--teal-strong) mb-1.5 uppercase tracking-[0.2em] ml-1">Stage</label>
            <select
              className="w-full bg-(--surface-muted) border border-(--border) rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
              value={editedProfile.stage}
              onChange={(e) => setEditedProfile({ ...editedProfile, stage: e.target.value as StartupProfile['stage'] })}
            >
              {['idea', 'pre-seed', 'seed', 'series-a'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {error && <p className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 p-4 rounded-xl font-medium">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-(--teal) text-(--accent-foreground) rounded-2xl font-bold text-sm hover:opacity-90 disabled:opacity-50 shadow-(--teal-soft) transition-all"
        >
          {saving ? 'Saving to Ecosystem...' : 'Finalize Entity'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-[2.5rem] p-16 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          dragging 
            ? 'border-(--teal) bg-(--teal-soft) scale-[0.99]' 
            : 'border-(--border-strong) hover:border-(--teal) hover:bg-(--surface-muted)'
        }`}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-(--teal-soft) opacity-0 group-hover:opacity-20 transition-opacity" />
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <p className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📄</p>
        <p className="text-base font-bold text-foreground">
          {file ? file.name : 'Drop a PDF pitch deck here'}
        </p>
        <p className="text-sm text-(--text-muted) mt-2 font-medium">
          {file ? 'Click to change file' : 'or click to browse institutional files'}
        </p>
        <p className="text-[10px] text-(--text-muted) mt-6 uppercase tracking-widest font-bold opacity-50">PDF only · max 10MB</p>
      </div>
      {error && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <p className="text-sm text-red-500 font-semibold">{error}</p>
          {rawError && <pre className="text-[10px] text-red-400 mt-3 p-3 bg-red-500/5 rounded-lg overflow-auto font-mono">{rawError}</pre>}
        </div>
      )}
      <button
        onClick={handleExtract}
        disabled={file === null}
        className="w-full py-4 bg-foreground text-background rounded-2xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl"
      >
        Extract Profile with Gemini
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="app-panel rounded-[2.5rem] p-8 space-y-5 border border-(--border-strong)">
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
            <label className="block text-[10px] font-bold text-(--teal-strong) mb-1.5 uppercase tracking-[0.2em] ml-1">{label}</label>
            <input
              type={type || 'text'}
              className="w-full bg-(--surface-muted) border border-(--border) rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 p-4 rounded-xl font-medium">{error}</p>}
      <button
        type="submit"
        disabled={saving || !form.name}
        className="w-full py-4 bg-(--teal) text-(--accent-foreground) rounded-2xl font-bold text-sm hover:opacity-90 disabled:opacity-50 shadow-(--teal-soft) transition-all"
      >
        {saving ? 'Registering Mentor...' : 'Complete Mentor Registration'}
      </button>
    </form>
  )
}
