import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div>
        <p className="mono text-xs uppercase tracking-[0.28em] text-[var(--teal-strong)]">Verisyqnal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">{title}</h1>
        {subtitle && <p className="app-muted mt-2 text-sm">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
