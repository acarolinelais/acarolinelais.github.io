import { useEffect, useState } from 'react'

import { icons } from '@/assets/icons'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'theme'
type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'dark' ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className={cn(
        'flex size-11 items-center justify-center rounded-full shadow-float transition-all hover:scale-105',
        isDark ? 'bg-black' : 'bg-white',
      )}
    >
      <img
        src={isDark ? icons.sun : icons.moonStars}
        alt=""
        aria-hidden
        className={cn('size-5', isDark && 'invert')}
      />
    </button>
  )
}
