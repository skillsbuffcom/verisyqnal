import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-xl font-bold text-[#0F172A]">Verisyqnal</p>
      <LoadingSpinner label="Loading ecosystem data..." />
    </div>
  )
}
