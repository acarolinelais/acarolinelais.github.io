import { icons } from '@/assets/icons'
import { cn } from '@/lib/utils'

interface DateCardProps {
  className?: string
}

export function DateCard({ className }: DateCardProps) {
  const now = new Date()
  const dayMonth = now.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  })
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-card border border-white/20 bg-black/5 p-6 backdrop-blur-lg',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-md font-regular text-white">{dayMonth}</span>
        <span className="flex items-center justify-center">
          <img src={icons.clock} alt="" aria-hidden className="size-5" />
        </span>
      </div>
      <div>
        <span className="block text-3xl font-regular text-white">
          {weekday}
        </span>
        <span className="text-4xl font-regular text-white">{time}</span>
      </div>
    </div>
  )
}
