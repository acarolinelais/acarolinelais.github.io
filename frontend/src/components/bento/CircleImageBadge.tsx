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
        'relative flex aspect-square items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-white/5 backdrop-blur-xl">
        <img
          src={images.avatar}
          alt="Caroline Lais"
          className="size-40 object-scale-down"
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-full" />
      <span className="absolute left-2 top-4 flex size-10 items-center justify-center rounded-full bg-white shadow-float">
        <img src={icons.starRing} alt="" aria-hidden className="size-5" />
      </span>
    </div>
  )
}
