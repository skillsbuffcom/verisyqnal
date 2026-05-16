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
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500'
  return (
    <div className={`flex items-center gap-1 ${color} font-bold text-lg`}>
      {score}
      <span className="text-xs font-normal text-gray-500">/ 100</span>
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
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {entityAName} ↔ {entityBName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{type.replace('_', ' ')} · {formation.replace('_', ' ')}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={status} />
          {confidence != null && <ConfidenceArc score={confidence} />}
        </div>
      </div>
      {rationale && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{rationale}</p>}
      {alignmentFactors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {alignmentFactors.map((f) => (
            <span key={f} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
