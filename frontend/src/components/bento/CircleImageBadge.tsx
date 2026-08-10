import { icons } from '@/assets/icons'
import { images } from '@/assets/images'
import { cn } from '@/lib/utils'

interface CircleImageBadgeProps {
  className?: string
}

export function CircleImageBadge({ className }: CircleImageBadgeProps) {
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/5 backdrop-blur-xl">
        <img
          src={images.avatar}
          alt="Caroline Lais"
          className="size-45 object-scale-down"
        />
      </div>
      <span className="absolute left-2 top-4 flex size-10 items-center justify-center rounded-full bg-white shadow-float">
        <img src={icons.starRing} alt="" aria-hidden className="size-4" />
      </span>
    </div>
  )
}
