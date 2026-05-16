import { RelationshipStatus } from '@/lib/types'

const styles: Record<RelationshipStatus, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  completed: 'bg-blue-100 text-blue-800',
  dissolved: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: RelationshipStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}
