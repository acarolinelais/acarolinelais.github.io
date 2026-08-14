import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

interface DateCardProps {
  className?: string
}

export function DateCard({ className }: DateCardProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

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
        'relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card bg-white/5 p-8 backdrop-blur-xl dark:bg-black/5">
        <div className="flex items-start justify-between">
          <span className="text-x font-regular text-white">{dayMonth}</span>
        </div>
        <div>
          <span className="block text-3xl font-regular text-white">
            {weekday}
          </span>
          <span className="text-4xl font-regular text-white">{time}</span>
        </div>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
