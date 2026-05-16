'use client'

import { MatchCandidate } from '@/lib/types'

interface MatchCandidateCardProps {
  candidate: MatchCandidate
  state?: 'default' | 'approved' | 'rejected'
  onApprove?: () => void
  onReject?: () => void
}

export function MatchCandidateCard({ candidate, state = 'default', onApprove, onReject }: MatchCandidateCardProps) {
  const confidenceColor =
    candidate.confidence >= 75 ? 'text-[var(--teal-strong)]' : candidate.confidence >= 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div
      className={`rounded-[1.75rem] border p-5 transition-all ${
        state === 'approved' ? 'border-[var(--teal)] bg-[var(--teal-soft)]' :
        state === 'rejected' ? 'border-[var(--border)] bg-[var(--surface-muted)] opacity-60' :
        'app-panel border-[var(--border)]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-[var(--foreground)]">{candidate.mentor_name}</p>
          <p className="app-muted text-xs">{candidate.mentor_profile.geography}</p>
        </div>
        <div className={`text-2xl font-bold ${confidenceColor}`}>
          {candidate.confidence}
          <span className="ml-0.5 text-xs font-normal text-[var(--text-muted)]">%</span>
        </div>
      </div>

      <p className="app-muted mb-4 text-sm leading-7 max-w-2xl">{candidate.rationale}</p>
      
      <div className="max-w-2xl">
        {candidate.alignment_factors.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {candidate.alignment_factors.map((f) => (
              <span key={f} className="rounded-full bg-[var(--teal-soft)] px-2.5 py-1 text-xs text-[var(--teal-strong)]">{f}</span>
            ))}
          </div>
        )}

        {candidate.risk_flags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {candidate.risk_flags.map((r) => (
              <span key={r} className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs text-red-500">{r}</span>
            ))}
          </div>
        )}
      </div>

      {state === 'default' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onApprove}
            className="flex-1 rounded-xl bg-[var(--teal)] py-2.5 text-sm font-semibold text-slate-950"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-xl border border-[var(--border-strong)] py-2.5 text-sm font-medium text-[var(--foreground)]"
          >
            Reject
          </button>
        </div>
      )}

      {state === 'approved' && (
        <p className="mt-2 text-center text-sm font-medium text-[var(--teal-strong)]">Matched</p>
      )}
      {state === 'rejected' && (
        <p className="mt-2 text-center text-sm font-medium text-[var(--text-muted)]">Rejected</p>
      )}
    </div>
  )
}
