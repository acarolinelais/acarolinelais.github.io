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
            across on a phone, so a 160px avatar overflowed it entirely. */}
        <img
          src={images.avatar}
          alt="Caroline Lais"
          className="size-[62%] object-scale-down"
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
          className="size-3.5 @[13rem]:size-4.5 @[16rem]:size-5"
        />
      </span>
    </div>
  )
}
