import { EntityType } from '@/lib/types'

const typeColors: Record<EntityType, string> = {
  startup: 'bg-blue-100 text-blue-800',
  mentor: 'bg-green-100 text-green-800',
  partner: 'bg-purple-100 text-purple-800',
  programme: 'bg-orange-100 text-orange-800',
}

interface EntityCardProps {
  id: string
  type: EntityType
  name: string
  tags?: string[]
  geography?: string | null
  stage?: string | null
  onClick?: () => void
}

export function EntityCard({ type, name, tags = [], geography, stage, onClick }: EntityCardProps) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${typeColors[type]}`}>
          {type}
        </span>
        {stage && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{stage}</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 truncate">{name}</h3>
      {geography && <p className="text-xs text-gray-500 mb-2">{geography}</p>}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-gray-400">+{tags.length - 4}</span>
          )}
        </div>
      )}
    </div>
  )
}
