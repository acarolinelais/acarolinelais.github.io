import { cn } from '@/lib/utils'

interface IntroCardProps {
  className?: string
}

export function IntroCard({ className }: IntroCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-center gap-3 overflow-hidden rounded-card border border-white/20 bg-white/10 p-6 shadow-card backdrop-blur-xl',
        className,
      )}
    >
      <span className="text-lg font-regular text-cream">Hi, I'm Caroline</span>
      <p className="text-sm leading-relaxed text-cream/85">
        A software developer and designer blending technology and
        creativity.
      </p>
    </div>
  )
}
