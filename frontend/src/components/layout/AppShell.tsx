import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { abstractBackgrounds } from '@/assets/images'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { cn } from '@/lib/utils'

interface AppShellProps {
  page: string
  children: ReactNode
}

// Picked once per real page load, at module evaluation rather than inside
// the component, so the full-size download starts as soon as the bundle
// runs instead of waiting for React's first commit to reach this element.
// AppShell doesn't remount on client-side navigation, so it stays the same
// background while clicking between Home/Work/Skills.
const background =
  abstractBackgrounds[Math.floor(Math.random() * abstractBackgrounds.length)]
const backgroundImage = new Image()
backgroundImage.decoding = 'async'
backgroundImage.src = background.src

export function AppShell({ page, children }: AppShellProps) {
  // `complete` covers a cache hit that finished before first render.
  const [isLoaded, setIsLoaded] = useState(
    () => backgroundImage.complete && backgroundImage.naturalWidth > 0,
  )

  useEffect(() => {
    if (isLoaded) return
    // decode() resolves once the image is ready to paint, so the fade
    // below never starts on a half-decoded frame.
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
        {/* Tiny inlined copy, painted immediately. Blurred (and scaled up so
            the blur's soft edges fall outside the viewport) so its 32px
            source reads as a soft wash rather than visible pixels. */}
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

      {/* pb-28 below sm: the nav is a floating pill at the bottom of the
          viewport there (it's a left rail from sm up), so the last card needs
          clearance to scroll clear of it rather than ending underneath. */}
      <main className="mx-auto w-full max-w-[1400px] px-5 pb-28 pt-28 sm:pb-16 sm:pl-36 sm:pr-8 sm:pt-32 lg:pl-40 lg:pr-24 lg:pt-36">
        {children}
      </main>
    </div>
  )
}
