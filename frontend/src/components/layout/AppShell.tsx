import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { abstractBackgrounds } from '@/assets/images'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { cn, preloadImage } from '@/lib/utils'

interface AppShellProps {
  page: string
  children: ReactNode
}

// Picked at module load so the download starts before React's first render.
const background =
  abstractBackgrounds[Math.floor(Math.random() * abstractBackgrounds.length)]
const backgroundImage = preloadImage(background.src)

export function AppShell({ page, children }: AppShellProps) {
  const [isLoaded, setIsLoaded] = useState(
    () => backgroundImage.complete && backgroundImage.naturalWidth > 0,
  )

  useEffect(() => {
    if (isLoaded) return
    let cancelled = false
    backgroundImage
      .decode()
      .catch(() => {})
      .then(() => {
        if (!cancelled) setIsLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [isLoaded])

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 overflow-hidden transition-[filter] duration-500 ease-out dark:brightness-75"
        aria-hidden
      >
        {/* Blurred tiny placeholder, shown until the full image decodes. */}
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${background.placeholder})` }}
        />
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          style={{ backgroundImage: `url(${background.src})` }}
        />
      </div>

      <TopBar page={page} />
      <Sidebar />

      {/* pb-28 below sm leaves room for the floating bottom nav. */}
      <main className="mx-auto w-full max-w-[1400px] px-5 pb-28 pt-28 sm:pb-16 sm:pl-36 sm:pr-8 sm:pt-32 lg:pl-40 lg:pr-24 lg:pt-36">
        {children}
      </main>
    </div>
  )
}
