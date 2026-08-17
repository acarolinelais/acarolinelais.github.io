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
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-card bg-white/5 p-4 backdrop-blur-xl @[10rem]:p-5 @[13rem]:p-6 @[16rem]:p-8 dark:bg-black/5">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-regular text-white @[13rem]:text-sm @[16rem]:text-base">
            {dayMonth}
          </span>
        </div>
        <div className="min-w-0">
          {/* The longest weekday ("Wednesday") is ~9 characters, which at the
              desktop 3xl would run past the edge of a phone-width card. */}
          <span className="block truncate text-base font-regular text-white @[10rem]:text-lg @[13rem]:text-2xl @[16rem]:text-3xl">
            {weekday}
          </span>
          <span className="text-xl font-regular text-white @[10rem]:text-2xl @[13rem]:text-3xl @[16rem]:text-4xl">
            {time}
          </span>
        </div>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
