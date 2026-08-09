import type { ReactNode } from 'react'

import { images } from '@/assets/images'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

interface AppShellProps {
  page: string
  children: ReactNode
}

export function AppShell({ page, children }: AppShellProps) {
  return (
    <div className="relative min-h-svh w-full overflow-x-hidden">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${images.abstractBg})` }}
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
