import { RelationshipStatus } from '@/lib/types'

const styles: Record<RelationshipStatus, string> = {
  active: 'bg-[rgba(45,212,191,0.14)] text-[var(--teal-strong)]',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200',
  completed: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200',
  dissolved: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200',
}

export function StatusBadge({ status }: { status: RelationshipStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}
