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
    candidate.confidence >= 75 ? 'text-green-600' : candidate.confidence >= 50 ? 'text-amber-500' : 'text-red-500'

  return (
    <div
      className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${
        state === 'approved' ? 'border-green-400 bg-green-50' :
        state === 'rejected' ? 'border-gray-200 bg-gray-50 opacity-60' :
        'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900">{candidate.mentor_name}</p>
          <p className="text-xs text-gray-500">{candidate.mentor_profile.geography}</p>
        </div>
        <div className={`text-2xl font-bold ${confidenceColor}`}>
          {candidate.confidence}
          <span className="text-xs font-normal text-gray-400 ml-0.5">%</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{candidate.rationale}</p>

      {candidate.alignment_factors.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {candidate.alignment_factors.map((f) => (
            <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>
      )}

      {candidate.risk_flags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {candidate.risk_flags.map((r) => (
            <span key={r} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{r}</span>
          ))}
        </div>
      )}

      {state === 'default' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={onApprove}
            className="flex-1 py-2 rounded-lg bg-[#0E9F6E] text-white text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 py-2 rounded-lg bg-[#E02424] text-white text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      )}

      {state === 'approved' && (
        <p className="text-sm text-green-700 font-medium text-center mt-2">✓ Matched</p>
      )}
      {state === 'rejected' && (
        <p className="text-sm text-gray-400 font-medium text-center mt-2">Rejected</p>
      )}
    </div>
  )
}
