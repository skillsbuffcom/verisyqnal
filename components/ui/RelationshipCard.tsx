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
  const color = score >= 75 ? 'text-(--teal-strong)' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className={`flex items-center gap-1 ${color} text-lg font-bold`}>
      {score}
      <span className="text-xs font-normal text-(--text-muted)">/ 100</span>
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
      className="app-panel app-ring cursor-pointer rounded-4xl p-6 group transition-all duration-300 hover:shadow-2xl border border-(--border)"
      onClick={onClick}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-foreground truncate">
              {entityAName}
            </span>
            <span className="text-(--text-muted) opacity-50 font-bold">↔</span>
            <span className="text-sm font-bold text-foreground truncate">
              {entityBName}
            </span>
          </div>
          <p className="mono text-[10px] font-bold text-(--text-muted) uppercase tracking-widest opacity-60">
            {type.replace(/_/g, ' ')} · {formation.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={status} />
          {confidence != null && <ConfidenceArc score={confidence} />}
        </div>
      </div>
      
      {rationale && (
        <div className="relative">
          <p className="app-muted mt-4 text-sm leading-7 line-clamp-3 italic opacity-80">
            "{rationale}"
          </p>
        </div>
      )}
      
      {alignmentFactors.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {alignmentFactors.map((f) => (
            <span key={f} className="rounded-lg bg-(--teal-soft) px-2.5 py-1 text-[10px] font-bold text-(--teal-strong) border border-(--teal-soft) group-hover:border-(--teal)/20 transition-colors">
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
