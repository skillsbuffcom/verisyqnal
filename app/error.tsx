'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
        <p className="text-2xl mb-2">⚠️</p>
        <h2 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h2>
        <p className="text-sm text-red-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
