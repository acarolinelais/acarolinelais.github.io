import { cn } from '@/lib/utils'

interface ContributionsCardProps {
  className?: string
}

const COLUMNS = 11

// Decorative pattern, not real GitHub data.
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

// Shared by the dot rows and the axis labels so they stay aligned.
const gridColumns = { gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }

// Container queries rather than viewport breakpoints: card width doesn't
// track the viewport, since fewer grid columns make each card wider again.
export function ContributionsCard({ className }: ContributionsCardProps) {
  return (
    <div
      className={cn(
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-card bg-cream p-4 @[10rem]:p-5 @[13rem]:p-6 @[16rem]:p-8">
        <div className="flex shrink-0 items-center justify-between gap-1.5 @[13rem]:gap-2">
          <span className="min-w-0 truncate text-[10px] font-regular leading-tight text-ink @[10rem]:text-xs @[13rem]:text-sm @[16rem]:text-lg">
            Contributions
          </span>
          <div className="flex shrink-0 items-center gap-0.5 @[13rem]:gap-1">
            {LEVEL_COLORS.slice(1).map((color) => (
              <span
                key={color}
                className="size-1.5 rounded-full @[10rem]:size-2 @[13rem]:size-2.5 @[16rem]:size-3"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Clips instead of pushing the axis labels out of the card. */}
        <div className="mt-2 flex min-h-0 flex-1 items-center overflow-hidden @[13rem]:mt-3 @[16rem]:mt-4">
          <div
            className="grid w-full gap-[3px] @[10rem]:gap-1 @[13rem]:gap-1.5 @[16rem]:gap-x-1.5 @[16rem]:gap-y-2"
            style={gridColumns}
          >
            {LEVELS.map((row, i) =>
              row.map((level, j) => (
                <span
                  key={`${i}-${j}`}
                  className="aspect-square rounded-full"
                  style={{ backgroundColor: LEVEL_COLORS[level] }}
                />
              )),
            )}
          </div>
        </div>

        <div
          className="mt-1 grid shrink-0 gap-[3px] @[10rem]:mt-1.5 @[10rem]:gap-1 @[13rem]:mt-2 @[13rem]:gap-1.5"
          style={gridColumns}
        >
          {Array.from({ length: COLUMNS }, (_, i) => (
            <span
              key={i}
              className="text-center text-[6px] leading-none text-muted @[10rem]:text-[7px] @[13rem]:text-[9px] @[16rem]:text-[10px]"
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
