'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppTheme, THEME_STORAGE_KEY } from '@/lib/theme'

function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<AppTheme>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    const nextTheme: AppTheme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

    setTheme(nextTheme)
    applyTheme(nextTheme)
  }, [])

  function toggleTheme() {
    const nextTheme: AppTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border) text-foreground hover:border-(--teal) hover:text-(--teal-strong) transition-colors"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
