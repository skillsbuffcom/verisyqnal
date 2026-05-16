import { RelationshipStatus, RelationshipType } from '@/lib/types'
import { StatusBadge } from './StatusBadge'

interface RelationshipCardProps {
  entityAName: string
  entityBName: string
  type: RelationshipType
  status: RelationshipStatus
  formation: string
  confidence?: number | null
  rationale?: string | null
  alignmentFactors?: string[]
  onClick?: () => void
}

function ConfidenceArc({ score }: { score: number }) {
  const color = score >= 75 ? 'text-[var(--teal-strong)]' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className={`flex items-center gap-1 ${color} text-lg font-bold`}>
      {score}
      <span className="text-xs font-normal text-[var(--text-muted)]">/ 100</span>
    </div>
  )
}

export function RelationshipCard({
  entityAName,
  entityBName,
  type,
  status,
  formation,
  confidence,
  rationale,
  alignmentFactors = [],
  onClick,
}: RelationshipCardProps) {
  return (
    <div
      className="app-panel app-ring cursor-pointer rounded-[1.5rem] p-4"
      onClick={onClick}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            {entityAName} ↔ {entityBName}
          </p>
          <p className="app-muted mt-0.5 text-xs">{type.replace('_', ' ')} · {formation.replace('_', ' ')}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={status} />
          {confidence != null && <ConfidenceArc score={confidence} />}
        </div>
      </div>
      {rationale && <p className="app-muted mt-3 text-sm leading-6 line-clamp-3">{rationale}</p>}
      {alignmentFactors.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {alignmentFactors.map((f) => (
            <span key={f} className="rounded-full bg-[var(--teal-soft)] px-2 py-0.5 text-xs text-[var(--teal-strong)]">
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
