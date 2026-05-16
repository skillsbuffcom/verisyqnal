export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 select-none cursor-default">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-[var(--teal)] border-t-transparent" />
      {label && <p className="app-muted text-sm">{label}</p>}
    </div>
  )
}
