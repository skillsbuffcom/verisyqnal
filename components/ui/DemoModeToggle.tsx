'use client'

import { useEffect, useState } from 'react'
import { DEMO_MODE_STORAGE_KEY } from '@/lib/demo-mode'

interface DemoModeToggleProps {
  onChange?: (value: boolean) => void
}

export function DemoModeToggle({ onChange }: DemoModeToggleProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY) === '1'
    setEnabled(stored)
    onChange?.(stored)
  }, [onChange])

  function update(next: boolean) {
    setEnabled(next)
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, next ? '1' : '0')
    onChange?.(next)
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span className="app-muted">Demo Mode</span>
      <div
        onClick={() => update(!enabled)}
        className={`relative h-6 w-10 rounded-full transition-colors ${enabled ? 'bg-[var(--teal)]' : 'bg-[var(--surface-muted)]'}`}
      >
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
    </label>
  )
}
