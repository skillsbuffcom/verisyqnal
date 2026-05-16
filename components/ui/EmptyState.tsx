import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="app-panel flex flex-col items-center justify-center rounded-[2rem] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--teal-soft)]">
        <span className="text-2xl">📭</span>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="app-muted mb-4 max-w-xs text-sm">{description}</p>
      {action}
    </div>
  )
}
