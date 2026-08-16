import { cn } from '@/lib/utils'

interface ContributionsCardProps {
  className?: string
}

const COLUMNS = 11

// Decorative, not real GitHub data — a fixed pattern rather than random so
// it reads as an intentional graph instead of noise.
const LEVELS = [
  [2, 3, 0, 1, 4, 2, 0, 1, 3, 0, 1],
  [1, 4, 2, 0, 3, 4, 1, 0, 2, 4, 0],
  [3, 2, 1, 4, 2, 1, 3, 2, 0, 1, 2],
  [0, 1, 3, 2, 0, 3, 4, 1, 2, 0, 3],
  [2, 4, 1, 0, 2, 1, 0, 3, 4, 1, 0],
  [1, 0, 2, 3, 1, 0, 2, 1, 0, 2, 4],
  [0, 2, 1, 0, 4, 2, 1, 0, 1, 3, 1],
]

const LEVEL_COLORS = ['#d7d7d7a8', '#0e4429f0', '#006d33f0', '#26a642ef', '#39d353eb']

export function ContributionsCard({ className }: ContributionsCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-card bg-cream p-8 transition-transform duration-300 ease-out hover:-translate-y-1 lg:p-5 2xl:p-8',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-lg font-regular text-ink lg:text-base 2xl:text-lg">
          Contributions
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {LEVEL_COLORS.slice(1).map((color) => (
            <span
              key={color}
              className="size-2.5 rounded-[2px]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center gap-1.5">
        {LEVELS.map((row, i) => (
          <div key={i} className="flex gap-1.5">
            {row.map((level, j) => (
              <span
                key={j}
                className="aspect-square flex-1 rounded-[3px]"
                style={{ backgroundColor: LEVEL_COLORS[level] }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-1.5">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <span
            key={i}
            className="flex-1 text-center text-[10px] text-muted"
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  )
}
