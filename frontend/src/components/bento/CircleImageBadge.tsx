import { icons } from '@/assets/icons'
import { images } from '@/assets/images'
import { cn } from '@/lib/utils'

interface CircleImageBadgeProps {
  className?: string
}

export function CircleImageBadge({ className }: CircleImageBadgeProps) {
  return (
    <div
      className={cn(
        '@container relative flex aspect-square items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-white/5 backdrop-blur-xl dark:bg-black/5">
        {/* Proportional, not a fixed size-40: this circle is only ~130px
            across on a phone, so a 160px avatar overflowed it entirely.
            draggable=false + the drag/callout resets below: this card is
            drag-reorderable, and without them a press-and-hold on the
            avatar starts the browser's own native image drag (or, on
            touch, the save-image callout) instead of the grid's gesture. */}
        <img
          src={images.avatar}
          alt="Caroline Lais"
          draggable={false}
          className="size-[62%] select-none object-scale-down [-webkit-touch-callout:none] [-webkit-user-drag:none]"
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-full" />
      {/* Offset in percentages so the badge keeps the same visual
          relationship to the circle's edge at every card size. */}
      <span className="absolute left-[3%] top-[7%] flex size-7 items-center justify-center rounded-full bg-white shadow-float @[13rem]:size-9 @[16rem]:size-10">
        <img
          src={icons.starRing}
          alt=""
          aria-hidden
          draggable={false}
          className="size-3.5 select-none @[13rem]:size-4.5 @[16rem]:size-5 [-webkit-touch-callout:none] [-webkit-user-drag:none]"
        />
      </span>
    </div>
  )
}
