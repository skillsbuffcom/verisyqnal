export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
