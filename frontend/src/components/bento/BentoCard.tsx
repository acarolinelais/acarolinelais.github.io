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
  const base = cn(
    'group relative flex flex-col overflow-hidden rounded-card transition-transform duration-300 ease-out hover:-translate-y-1',
    surface === 'white' && 'bg-cream',
    surface === 'glass' &&
      'border border-white/20 bg-black/5 backdrop-blur-lg',
    className,
  )

  if (as === 'a' && href) {
    return (
      <a href={href} className={base}>
        {children}
      </a>
    )
  }

  return <div className={base}>{children}</div>
}
