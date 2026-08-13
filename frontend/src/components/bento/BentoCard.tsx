import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BentoCardProps {
  children?: ReactNode
  className?: string
  as?: 'div' | 'a'
  href?: string
  surface?: 'white' | 'glass'
}

export function BentoCard({
  children,
  className,
  as = 'div',
  href,
  surface = 'white',
}: BentoCardProps) {
  const outer = cn(
    'group relative transition-transform duration-300 ease-out hover:-translate-y-1',
    className,
  )

  const content = (
    <>
      <div
        className={cn(
          'absolute inset-0 flex flex-col overflow-hidden rounded-card',
          surface === 'white' && 'bg-cream',
          surface === 'glass' && 'bg-white/5 backdrop-blur-xl dark:bg-black/5',
        )}
      >
        {children}
      </div>
      {surface === 'glass' && (
        <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
      )}
    </>
  )

  if (as === 'a' && href) {
    return (
      <a href={href} className={outer}>
        {content}
      </a>
    )
  }

  return <div className={outer}>{content}</div>
}
