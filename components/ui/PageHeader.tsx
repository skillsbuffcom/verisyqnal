import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="mono text-xs uppercase tracking-[0.28em] text-(--teal-strong)">Verisyqnal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tighter text-foreground">{title}</h1>
        {subtitle && <p className="app-muted mt-2 text-sm">{subtitle}</p>}
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  )
}
