import { useEffect, useState } from 'react'

import { icons } from '@/assets/icons'
import { cn } from '@/lib/utils'

// Only set while the chosen theme differs from the system's, so picking the
// system's theme again goes back to following it. Keep in sync with the
// inline script in index.html.
const STORAGE_KEY = 'theme-override'
type Theme = 'light' | 'dark'

const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

function getSystemTheme(): Theme {
  return systemDark.matches ? 'dark' : 'light'
}

function getOverride(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : null
  } catch {
    return null
  }
}

function setOverride(theme: Theme | null) {
  try {
    if (theme) localStorage.setItem(STORAGE_KEY, theme)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the choice just lasts for this visit.
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getOverride() ?? getSystemTheme())

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const onSystemChange = () => {
      if (!getOverride()) setTheme(getSystemTheme())
    }
    systemDark.addEventListener('change', onSystemChange)
    return () => systemDark.removeEventListener('change', onSystemChange)
  }, [])

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setOverride(next === getSystemTheme() ? null : next)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={toggle}
      className="relative flex size-11 items-center justify-center rounded-full transition-all hover:scale-105"
    >
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-xl',
          isDark ? 'bg-black/5' : 'bg-white/5',
        )}
      >
        <img
          src={isDark ? icons.sun : icons.moonStars}
          alt=""
          aria-hidden
          className="size-5 brightness-0 invert"
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-full" />
    </button>
  )
}
