import { EntityType } from '@/lib/types'

const typeColors: Record<EntityType, string> = {
  startup: 'bg-(--teal-soft) text-(--teal-strong) border-(--teal-soft)',
  mentor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:text-emerald-400',
  partner: 'bg-violet-500/10 text-violet-600 border-violet-500/10 dark:text-violet-400',
  programme: 'bg-amber-500/10 text-amber-600 border-amber-500/10 dark:text-amber-400',
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

function getCountryFlag(geography: string) {
  const value = geography.trim().toLowerCase()
  const flags: Record<string, string> = {
    malaysia: '🇲🇾',
    my: '🇲🇾',
    singapore: '🇸🇬',
    sg: '🇸🇬',
    indonesia: '🇮🇩',
    id: '🇮🇩',
    thailand: '🇹🇭',
    th: '🇹🇭',
  }

  return flags[value]
}

export function EntityCard({ type, name, tags = [], geography, stage, onClick }: EntityCardProps) {
  const countryFlag = geography ? getCountryFlag(geography) : null

  return (
    <div
      className="app-panel app-ring cursor-pointer rounded-4xl p-6 transition-all duration-300 hover:shadow-2xl border border-(--border) group hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${typeColors[type]}`}>
          {type}
        </span>
        {stage && (
          <span className="rounded-lg border border-(--border) px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-(--text-muted) opacity-60">
            {stage}
          </span>
        )}
      </div>
      <h3 className="mb-1 truncate text-xl font-bold text-foreground tracking-tight">{name}</h3>
      {geography && (
        <p className="mono mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-(--teal-strong) opacity-70">
          {countryFlag ? `${countryFlag} ` : ''}
          {geography}
        </p>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-(--surface-muted) px-2.5 py-1 text-[10px] font-bold text-(--text-muted) border border-(--border) group-hover:border-(--teal)/10 transition-colors">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="ml-1 self-center text-[10px] font-bold text-(--teal-strong)">+{tags.length - 3} MORE</span>
          )}
        </div>
      )}
    </div>
  )
}
