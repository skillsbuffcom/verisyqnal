'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="app-panel max-w-md rounded-[2rem] p-8">
        <p className="text-2xl mb-2">⚠️</p>
        <h2 className="mb-2 text-lg font-bold text-[var(--foreground)]">Something went wrong</h2>
        <p className="mb-4 text-sm text-red-600 dark:text-red-200">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
