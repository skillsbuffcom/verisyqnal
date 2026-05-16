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
        
        if (veoData.success) {
          if (veoData.status === 'processing') {
            // Start polling
            const poll = async () => {
              const statusRes = await fetch(`/api/veo/status?id=${data.relationship.id}`)
              const statusData = await statusRes.json()
              if (statusData.success && statusData.status === 'completed') {
                setVeoResult({ 
                  type: statusData.type, 
                  url: statusData.url,
                  briefing: statusData.briefing 
                })
                setVeoLoading(false)
              } else if (statusData.success && statusData.status === 'failed') {
                setPanelError('Briefing generation failed.')
                setVeoLoading(false)
              } else {
                // Poll again in 2 seconds
                setTimeout(poll, 2000)
              }
            }
            setVeoResult(veoData) // Show text briefing immediately if available
            setTimeout(poll, 2000)
          } else {
            setVeoResult(veoData)
            setVeoLoading(false)
          }
        } else {
          setPanelError(typeof veoData.error === 'string' ? veoData.error : 'Briefing generation failed.')
          setVeoLoading(false)
        }
      } else {
        setPanelError(typeof data.error === 'string' ? data.error : 'Approval failed.')
      }
    } catch (err) {
      console.error('Match Approval Error:', err)
      setPanelError('Approval or briefing generation failed. Switch on Demo Mode for a deterministic fallback.')
      setVeoLoading(false)
    }
  }

  function handleReject(idx: number) {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, state: 'rejected' } : c))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={programme?.name ?? 'Programme'}
        subtitle={programme?.cohort ?? undefined}
        action={<DemoModeToggle onChange={setDemoMode} />}
      />

      {toast && (
        <div className="fixed right-4 top-20 z-50 rounded-full bg-(--teal) px-4 py-2 text-sm font-semibold text-(--accent-foreground) shadow-2xl lg:top-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left: Assigned Startups */}
        <div className="w-full shrink-0 lg:w-72">
          <div className="app-panel mb-6 rounded-4xl p-5">
            <p className="mono text-[10px] uppercase tracking-[0.28em] text-(--teal-strong) font-bold">Programme assignment</p>
            <p className="app-muted mt-2 text-xs leading-5">Assign a startup before running relationship formation.</p>
            <select
              value={assignTarget}
              onChange={(e) => setAssignTarget(e.target.value)}
              className="mt-4 w-full rounded-xl border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--teal-soft) transition-all"
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
              className="mt-3 w-full rounded-xl bg-foreground py-2.5 text-sm font-bold text-background disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {assigning ? 'Assigning...' : 'Assign Startup'}
            </button>
          </div>

          <h2 className="mono mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-(--text-muted) ml-2">Assigned Startups</h2>
          {assignedStartups.length === 0 ? (
            <EmptyState title="No startups assigned" description="Assign a startup to this programme to begin matching." />
          ) : (
            <div className="space-y-2">
              {assignedStartups.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelected(s); setCandidates([]); setVeoResult(null); setApprovedRelationship(null) }}
                  className={`cursor-pointer rounded-[1.75rem] border-2 transition-all duration-300 ${
                    selected?.id === s.id 
                      ? 'border-(--teal) shadow-[0_0_0_4px_var(--teal-soft)] scale-[1.02]' 
                      : 'border-transparent hover:border-(--border)'
                  }`}
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
              <div className="mb-6">
                <EntityCard {...selected} />
              </div>
              <div className="app-panel mb-6 rounded-4xl p-8 border border-(--border-strong) relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-(--teal-soft) rounded-full blur-3xl opacity-20 pointer-events-none" />
                
                <p className="mono text-[10px] uppercase tracking-[0.28em] text-(--teal-strong) font-bold">Relationship formation engine</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tighter">Find mentors with rationale and confidence.</h2>
                <p className="app-muted mt-3 max-w-lg text-sm leading-7">
                  The strongest match should feel explainable, governable, and ready for institutional review. 
                  Gemini will analyze mentor expertise against startup gaps.
                </p>
                <button
                  onClick={handleMatch}
                  disabled={matching}
                  className="mt-6 w-full rounded-2xl bg-(--teal) py-4 text-sm font-bold text-(--accent-foreground) disabled:opacity-50 shadow-(--teal-soft) hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {matching ? 'Gemini is analysing compatibility across all mentors...' : 'Find Mentor Matches'}
                </button>
              </div>
            </>
          )}

          {!selected && (
            <EmptyState title="Select a startup" description="Choose a startup on the left to find mentor matches." />
          )}

          {candidates.length > 0 && (
            <div className="space-y-4 mb-6">
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
            <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500 font-medium backdrop-blur-sm">
              {panelError}
            </div>
          )}

          {candidates.some(c => c.state === 'approved') && !veoLoading && !veoResult && (
            <div className="mb-6 rounded-2xl border border-(--teal-strong)/20 bg-(--teal-soft) p-4 text-sm text-(--teal-strong) font-medium">
              Veo Match Briefing will be generated automatically
            </div>
          )}

          {veoLoading && <LoadingSpinner label={veoResult ? "Creating professional video briefing..." : "Generating Veo Match Briefing..."} />}

          {veoResult && (
            <div className="mt-6">
              <BriefingCard
                type={veoResult.type}
                videoUrl={veoResult.url}
                briefing={veoResult.briefing}
              />
            </div>
          )}


        </div>
      </div>

      {/* Active Relationships */}
      {relationships.length > 0 && (
        <div className="mt-8">
          <h2 className="mono mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-(--text-muted)">Active Relationships</h2>
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
