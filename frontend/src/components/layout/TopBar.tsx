import { ThemeToggle } from '@/components/ThemeToggle'

interface TopBarProps {
  page: string
}

export function TopBar({ page }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-32"
        aria-hidden
      />
      <div className="relative flex items-start justify-between px-5 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        <p className="text-lg text-white tracking-wide">
          <span className="font-light text-white/75">Caroline /</span>{' '}
          <span className="font-regular">{page}</span>
        </p>

        <div className="flex flex-col items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
