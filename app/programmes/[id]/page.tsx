'use client'

import { useEffect, useState, use } from 'react'
import { EntityCard } from '@/components/ui/EntityCard'
import { MatchCandidateCard } from '@/components/ui/MatchCandidateCard'
import { RelationshipCard } from '@/components/ui/RelationshipCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { MatchCandidate, EntityType, RelationshipType, RelationshipStatus } from '@/lib/types'

type Entity = { id: string; type: EntityType; name: string; tags: string[]; geography: string | null; stage: string | null }
type Relationship = { id: string; entityA: Entity; entityB: Entity; type: RelationshipType; status: RelationshipStatus; formation: string; confidence: number | null; rationale: string | null; alignmentFactors: string[] }
type Programme = { id: string; name: string; cohort: string | null }
type CandidateState = { candidate: MatchCandidate; state: 'default' | 'approved' | 'rejected'; approvedRelId?: string }

export default function ProgrammeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [programme, setProgramme] = useState<Programme | null>(null)
  const [startups, setStartups] = useState<Entity[]>([])
  const [selected, setSelected] = useState<Entity | null>(null)
  const [matching, setMatching] = useState(false)
  const [candidates, setCandidates] = useState<CandidateState[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
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
    fetch('/api/entities?type=startup').then(r => r.json()).then(d => setStartups(d.entities ?? []))
    fetchRelationships()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchRelationships() {
    const res = await fetch(`/api/relationships?programme_id=${id}&status=active`)
    const data = await res.json()
    if (data.success) setRelationships(data.relationships)
  }

  async function handleMatch() {
    if (!selected) return
    setMatching(true)
    setCandidates([])
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startup_id: selected.id, programme_id: id, top_k: 3 }),
      })
      const data = await res.json()
      if (data.success) {
        setCandidates(data.matches.map((m: MatchCandidate) => ({ candidate: m, state: 'default' as const })))
      }
    } catch { /* ignore */ }
    finally { setMatching(false) }
  }

  async function handleApprove(idx: number) {
    const { candidate } = candidates[idx]
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
        setToast('Match approved!')
        setTimeout(() => setToast(null), 3000)
        fetchRelationships()
        // Trigger Veo
        setVeoLoading(true)
        setVeoResult(null)
        const veoRes = await fetch('/api/veo/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ relationship_id: data.relationship.id }),
        })
        const veoData = await veoRes.json()
        if (veoData.success) setVeoResult(veoData)
        setVeoLoading(false)
      }
    } catch { /* ignore */ }
  }

  function handleReject(idx: number) {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, state: 'rejected' } : c))
  }

  return (
    <div className="p-8">
      <PageHeader
        title={programme?.name ?? 'Programme'}
        subtitle={programme?.cohort ?? undefined}
        action={
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <span className="text-gray-500">Demo Mode</span>
            <div
              onClick={() => setDemoMode(v => !v)}
              className={`w-10 h-6 rounded-full transition-colors ${demoMode ? 'bg-[#1A56DB]' : 'bg-gray-300'} relative cursor-pointer`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${demoMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
          </label>
        }
      />

      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{toast}</div>
      )}

      <div className="flex gap-6">
        {/* Left: Assigned Startups */}
        <div className="w-72 shrink-0">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Assigned Startups</h2>
          {startups.length === 0 ? (
            <EmptyState title="No startups" description="Assign startups to this programme via the API." />
          ) : (
            <div className="space-y-2">
              {startups.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setSelected(s); setCandidates([]); setVeoResult(null) }}
                  className={`cursor-pointer rounded-xl border-2 transition-all ${selected?.id === s.id ? 'border-[#1A56DB]' : 'border-transparent'}`}
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
              <button
                onClick={handleMatch}
                disabled={matching}
                className="w-full py-2.5 bg-[#1A56DB] text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors mb-4"
              >
                {matching ? 'Gemini is analysing compatibility across all mentors...' : 'Find Mentor Matches'}
              </button>
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

          {candidates.some(c => c.state === 'approved') && !veoLoading && !veoResult && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-4">
              Veo Match Briefing will be generated automatically
            </div>
          )}

          {veoLoading && <LoadingSpinner label="Generating Veo Match Briefing..." />}

          {veoResult && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              {veoResult.type === 'video' ? (
                <div>
                  <p className="text-xs text-gray-400 px-4 pt-3 pb-1">Mentor Match Briefing — Auto-generated by Veo</p>
                  <video src={veoResult.url} controls className="w-full rounded-b-xl" />
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1">Mentor Match Briefing</p>
                  <p className="text-xs text-amber-600 mb-3">Video briefing unavailable — showing text summary</p>
                  <div className="space-y-2">
                    {Object.entries(veoResult.briefing ?? {}).map(([k, v]) => (
                      <div key={k}>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">{k.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-900">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Relationships */}
      {relationships.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Active Relationships</h2>
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
