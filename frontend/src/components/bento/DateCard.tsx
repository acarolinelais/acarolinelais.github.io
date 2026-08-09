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
        'relative flex flex-col justify-between overflow-hidden rounded-card border border-white/20 bg-white/10 p-6 shadow-card backdrop-blur-xl',
        className,
      )}
    >
      <span className="text-sm font-medium text-cream/85">{dayMonth}</span>
      <div>
        <span className="block text-3xl font-medium text-cream">
          {weekday}
        </span>
        <span className="text-lg font-medium text-cream/80">{time}</span>
      </div>
    </div>
  )
}
