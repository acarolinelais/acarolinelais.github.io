import { useEffect, useState } from 'react'

import { icons } from '@/assets/icons'

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

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={theme === 'dark'}
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="flex size-11 items-center justify-center rounded-full bg-accent shadow-float transition-transform hover:scale-105"
    >
      <img
        src={icons.moonStars}
        alt=""
        aria-hidden
        className="size-5 invert"
      />
    </button>
  )
}
