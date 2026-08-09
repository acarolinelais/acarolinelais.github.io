import { ThemeToggle } from '@/components/ThemeToggle'

interface TopBarProps {
  page: string
}

const dayOfMonth = new Date().getDate().toString().padStart(2, '0')

export function TopBar({ page }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/35 via-ink/10 to-transparent sm:h-32"
        aria-hidden
      />
      <div className="relative flex items-start justify-between px-5 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        <p className="text-sm text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.25)]">
          <span className="font-regular text-white/75">Caroline /</span>{' '}
          <span className="font-medium">{page}</span>
        </p>

        <div className="flex flex-col items-center gap-2">
          <ThemeToggle />
          <span className="flex size-8 items-center justify-center rounded-full bg-white/85 text-xs font-semibold text-ink/70 shadow-card backdrop-blur-md">
            {dayOfMonth}
          </span>
        </div>
      </div>
    </header>
  )
}
