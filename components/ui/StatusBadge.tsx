import { RelationshipStatus } from '@/lib/types'

const styles: Record<RelationshipStatus, string> = {
  active: 'bg-[var(--teal-soft)] text-[var(--teal-strong)] border-[var(--teal-soft)]',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/10 dark:text-amber-400',
  completed: 'bg-sky-500/10 text-sky-600 border-sky-500/10 dark:text-sky-400',
  dissolved: 'bg-red-500/10 text-red-600 border-red-500/10 dark:text-red-400',
}

export function StatusBadge({ status }: { status: RelationshipStatus }) {
  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  )
}
