'use client'

import { useEffect, useState, use } from 'react'
import { EntityCard } from '@/components/ui/EntityCard'
import { MatchCandidateCard } from '@/components/ui/MatchCandidateCard'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { BriefingCard } from '@/components/ui/BriefingCard'
import { DemoModeToggle } from '@/components/ui/DemoModeToggle'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { DEMO_MODE_HEADER } from '@/lib/demo-mode'
import { MatchCandidate, EntityType, RelationshipType, RelationshipStatus } from '@/lib/types'

type Entity = { id: string; type: EntityType; name: string; tags: string[]; geography: string | null; stage: string | null }
type Relationship = { id: string; entityA: Entity; entityB: Entity; type: RelationshipType; status: RelationshipStatus; formation: string; confidence: number | null; rationale: string | null; alignmentFactors: string[]; governance?: unknown; memory?: unknown }
type Programme = { id: string; name: string; cohort: string | null }
type CandidateState = { candidate: MatchCandidate; state: 'default' | 'approved' | 'rejected'; approvedRelId?: string }

export default function ProgrammeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [programme, setProgramme] = useState<Programme | null>(null)
  const [allStartups, setAllStartups] = useState<Entity[]>([])
  const [assignedStartups, setAssignedStartups] = useState<Entity[]>([])
  const [selected, setSelected] = useState<Entity | null>(null)
  const [assignTarget, setAssignTarget] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [matching, setMatching] = useState(false)
  const [candidates, setCandidates] = useState<CandidateState[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [approvedRelationship, setApprovedRelationship] = useState<Relationship | null>(null)
  const [panelError, setPanelError] = useState<string | null>(null)
  const [veoLoading, setVeoLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [veoResult, setVeoResult] = useState<any>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    fetch(`/api/programmes`).then(r => r.json()).then(d => {
      const prog = d.programmes?.find((p: Programme) => p.id === id)
      if (prog) setProgramme(prog)
    })
    fetch('/api/entities?type=startup').then(r => r.json()).then(d => setAllStartups(d.entities ?? []))
    fetchAssignments()
    fetchRelationships()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!selected && assignedStartups.length > 0) {
      setSelected(assignedStartups[0])
    }

    if (selected && !assignedStartups.some((startup) => startup.id === selected.id)) {
      setSelected(assignedStartups[0] ?? null)
    }
  }, [assignedStartups, selected])

  async function fetchRelationships() {
    const res = await fetch(`/api/relationships?programme_id=${id}&status=active&type=mentor_startup`)
    const data = await res.json()
    if (data.success) setRelationships(data.relationships)
  }

  async function fetchAssignments() {
    const res = await fetch(`/api/relationships?programme_id=${id}&status=active&type=startup_programme`)
    const data = await res.json()
    if (data.success) {
      setAssignedStartups(
        (data.relationships as Relationship[])
          .map((relationship) => relationship.entityA)
          .filter((entity): entity is Entity => entity?.type === 'startup')
      )
    }
  }

  async function handleAssignStartup() {
    if (!assignTarget) return
    setAssigning(true)
    setPanelError(null)
    try {
      const res = await fetch(`/api/programmes/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup_id: assignTarget }),
      })
      const data = await res.json()
      if (data.success) {
        await fetchAssignments()
        setSelected(allStartups.find((startup) => startup.id === assignTarget) ?? null)
        setAssignTarget('')
        setToast(data.duplicate ? 'Startup already assigned' : 'Startup assigned to programme')
        setTimeout(() => setToast(null), 3000)
      } else {
        setPanelError(typeof data.error === 'string' ? data.error : 'Programme assignment failed.')
      }
    } catch {
      setPanelError('Programme assignment failed.')
    } finally {
      setAssigning(false)
    }
  }

  async function handleMatch() {
    if (!selected) return
    setMatching(true)
    setCandidates([])
    setPanelError(null)
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: demoMode ? { 'Content-Type': 'application/json', [DEMO_MODE_HEADER]: '1' } : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup_id: selected.id, programme_id: id, top_k: 3 }),
      })
      const data = await res.json()
      if (data.success) {
        setCandidates(data.matches.map((m: MatchCandidate) => ({ candidate: m, state: 'default' as const })))
        if ((data.matches ?? []).length === 0) {
          setPanelError('No mentor matches were returned for this startup.')
        }
      } else {
        setPanelError(typeof data.error === 'string' ? data.error : 'Matching failed.')
      }
    } catch {
      setPanelError('Matching failed. Switch on Demo Mode for a deterministic rehearsal path.')
    }
    finally { setMatching(false) }
  }

  async function handleApprove(idx: number) {
    const { candidate } = candidates[idx]
    setPanelError(null)
    try {
      const res = await fetch('/api/match/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startup_id: selected!.id,
          mentor_id: candidate.mentor_id,
          programme_id: id,
          confidence: candidate.confidence,
          rationale: candidate.rationale,
          alignment_factors: candidate.alignment_factors,
          risk_flags: candidate.risk_flags,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, state: 'approved', approvedRelId: data.relationship.id } : c))
        setApprovedRelationship(data.relationship)
        setToast(data.duplicate ? 'Match already approved' : 'Match approved!')
        setTimeout(() => setToast(null), 3000)
        fetchRelationships()
        // Trigger Veo
        setVeoLoading(true)
        setVeoResult(null)
        const veoRes = await fetch('/api/veo/generate', {
          method: 'POST',
          headers: demoMode ? { 'Content-Type': 'application/json', [DEMO_MODE_HEADER]: '1' } : { 'Content-Type': 'application/json' },
          body: JSON.stringify({ relationship_id: data.relationship.id }),
        })
        const veoData = await veoRes.json()
        if (veoData.success) setVeoResult(veoData)
        else setPanelError(typeof veoData.error === 'string' ? veoData.error : 'Briefing generation failed.')
        setVeoLoading(false)
      } else {
        setPanelError(typeof data.error === 'string' ? data.error : 'Approval failed.')
      }
    } catch {
      setPanelError('Approval or briefing generation failed. Switch on Demo Mode for a deterministic fallback.')
      setVeoLoading(false)
    }
  }

  function handleReject(idx: number) {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, state: 'rejected' } : c))
  }

  return (
    <div className="p-8">
      <PageHeader
        title={programme?.name ?? 'Programme'}
        subtitle={programme?.cohort ?? undefined}
        action={<DemoModeToggle onChange={setDemoMode} />}
      />

      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-full bg-[var(--teal)] px-4 py-2 text-sm font-medium text-slate-950 shadow-lg">{toast}</div>
      )}

      <div className="flex gap-6">
        {/* Left: Assigned Startups */}
        <div className="w-72 shrink-0">
          <div className="app-panel mb-4 rounded-[1.75rem] p-4">
            <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal-strong)]">Programme assignment</p>
            <p className="app-muted mt-2 text-sm leading-6">Assign a startup before running relationship formation.</p>
            <select
              value={assignTarget}
              onChange={(e) => setAssignTarget(e.target.value)}
              className="mt-4 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-sm"
            >
              <option value="">Select startup to assign</option>
              {allStartups
                .filter((startup) => !assignedStartups.some((assigned) => assigned.id === startup.id))
                .map((startup) => (
                  <option key={startup.id} value={startup.id}>{startup.name}</option>
                ))}
            </select>
            <button
              onClick={handleAssignStartup}
              disabled={!assignTarget || assigning}
              className="mt-3 w-full rounded-xl bg-[var(--foreground)] py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-50"
            >
              {assigning ? 'Assigning...' : 'Assign Startup'}
            </button>
          </div>

          <h2 className="mono mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Assigned Startups</h2>
          {assignedStartups.length === 0 ? (
            <EmptyState title="No startups assigned" description="Assign a startup to this programme to begin matching." />
          ) : (
            <div className="space-y-2">
              {assignedStartups.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelected(s); setCandidates([]); setVeoResult(null); setApprovedRelationship(null) }}
                  className={`cursor-pointer rounded-[1.75rem] border-2 transition-all ${selected?.id === s.id ? 'border-[var(--teal)] shadow-[0_0_0_4px_var(--teal-soft)]' : 'border-transparent'}`}
                >
                  <EntityCard {...s} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Match panel */}
        <div className="flex-1">
          {selected && (
            <>
              <div className="mb-4">
                <EntityCard {...selected} />
              </div>
              <div className="app-panel mb-4 rounded-[1.75rem] p-4 py-3">
                <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal-strong)]">Relationship formation engine</p>
                <div className="flex items-center justify-between gap-4 mt-1">
                  <h2 className="text-xl font-semibold tracking-[-0.04em]">Find mentor matches</h2>
                  <button
                    onClick={handleMatch}
                    disabled={matching}
                    className="px-6 py-2 rounded-xl bg-[var(--teal)] text-sm font-semibold text-slate-950 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {matching ? 'Matching...' : 'Find Matches'}
                  </button>
                </div>
              </div>
            </>
          )}

          {!selected && (
            <EmptyState title="Select a startup" description="Choose a startup on the left to find mentor matches." />
          )}

          {candidates.length > 0 && (
            <div className="space-y-3 mb-4">
              {candidates.map(({ candidate, state }, idx) => (
                <MatchCandidateCard
                  key={candidate.mentor_id}
                  candidate={candidate}
                  state={state}
                  onApprove={() => handleApprove(idx)}
                  onReject={() => handleReject(idx)}
                />
              ))}
            </div>
          )}

          {panelError && (
            <div className="mb-4 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-100">
              {panelError}
            </div>
          )}

          {candidates.some(c => c.state === 'approved') && !veoLoading && !veoResult && (
            <div className="mb-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-100">
              Veo Match Briefing will be generated automatically
            </div>
          )}

          {veoLoading && <LoadingSpinner label="Generating Veo Match Briefing..." />}

          {veoResult && (
            <div className="mt-4">
              <BriefingCard
                type={veoResult.type}
                videoUrl={veoResult.url}
                briefing={veoResult.briefing}
              />
            </div>
          )}

          {approvedRelationship && (
            <div className="app-panel mt-4 rounded-[1.75rem] p-4 bg-[#081513]">
              <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal)] opacity-70">Relationship Object</p>
              <pre className="mono mt-2 max-h-40 overflow-auto text-[10px] leading-5 text-[#c6fff6]">
                {JSON.stringify(approvedRelationship, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Active Relationships */}
      {relationships.length > 0 && (
        <div className="mt-8">
          <h2 className="mono mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-muted)]">Active Relationships</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relationships.map(r => (
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
    </div>
  )
}
