import { icons } from '@/assets/icons'
import { cn } from '@/lib/utils'

interface CircleImageBadgeProps {
  className?: string
}

export function CircleImageBadge({ className }: CircleImageBadgeProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex aspect-square w-full items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-card backdrop-blur-xl">
        <img
          src={icons.starRing}
          alt=""
          aria-hidden
          className="size-10 opacity-80 invert"
        />
      </div>
    </div>
  )
}
