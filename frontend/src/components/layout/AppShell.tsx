import { useState } from 'react'
import type { ReactNode } from 'react'

import { abstractBackgrounds } from '@/assets/images'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

interface AppShellProps {
  page: string
  children: ReactNode
}

function pickBackground() {
  return abstractBackgrounds[
    Math.floor(Math.random() * abstractBackgrounds.length)
  ]
}

export function AppShell({ page, children }: AppShellProps) {
  // Picked once per mount (i.e. once per real page load) rather than per
  // route — AppShell itself doesn't remount on client-side navigation, so
  // it stays the same background while clicking between Home/Work/Skills.
  const [background] = useState(pickBackground)

  return (
    <div className="relative min-h-svh w-full overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-[filter] duration-500 ease-out dark:brightness-75"
        style={{ backgroundImage: `url(${background})` }}
        aria-hidden
      />

      <TopBar page={page} />
      <Sidebar />

      <main className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-28 sm:pb-16 sm:pl-36 sm:pr-8 sm:pt-32 lg:pl-40 lg:pr-24 lg:pt-36">
        {children}
      </main>
    </div>
  )
}
