import { icons } from '@/assets/icons'
import { images } from '@/assets/images'
import { cn, noNativeDrag } from '@/lib/utils'

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
        <img
          src={images.avatar}
          alt="Caroline Lais"
          draggable={false}
          className={cn('size-[62%] object-scale-down', noNativeDrag)}
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-full" />
      <span className="absolute left-[3%] top-[7%] flex size-7 items-center justify-center rounded-full bg-white shadow-float dark:bg-black @[13rem]:size-9 @[16rem]:size-10">
        <img
          src={icons.starRing}
          alt=""
          aria-hidden
          draggable={false}
          className={cn('size-3.5 @[13rem]:size-4.5 @[16rem]:size-5', noNativeDrag)}
        />
      </span>
    </div>
  )
}
