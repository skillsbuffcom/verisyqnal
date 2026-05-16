import { EntityType } from '@/lib/types'

const typeColors: Record<EntityType, string> = {
  startup: 'bg-[rgba(45,212,191,0.12)] text-[var(--teal-strong)]',
  mentor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
  partner: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200',
  programme: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
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
      className="app-panel app-ring cursor-pointer rounded-[1.5rem] p-4"
      onClick={onClick}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${typeColors[type]}`}>
          {type}
        </span>
        {stage && (
          <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]">{stage}</span>
        )}
      </div>
      <h3 className="mb-1 truncate text-lg font-semibold text-[var(--foreground)]">{name}</h3>
      {geography && <p className="app-muted mb-3 text-xs">{geography}</p>}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-[var(--text-muted)]">+{tags.length - 4}</span>
          )}
        </div>
      )}
    </div>
  )
}
