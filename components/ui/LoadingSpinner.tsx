export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 select-none cursor-default">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-(--teal-soft) border-t-(--teal)" />
      {label && <p className="text-(--teal-strong) text-xs font-mono font-bold uppercase tracking-widest">{label}</p>}
    </div>
  )
}
