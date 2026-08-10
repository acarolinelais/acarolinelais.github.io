import { cn } from '@/lib/utils'

interface IntroCardProps {
  className?: string
}

export function IntroCard({ className }: IntroCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-center gap-3 overflow-hidden rounded-card border border-white/20 bg-black/5 p-9 backdrop-blur-lg',
        className,
      )}
    >
      <span className="text-xl font-regular text-white">Hi, I'm Caroline</span>
      <p className="text-xl font-light leading-6 text-white">
        A software <br /> developer and designer blending technology and
        creativity.
      </p>
    </div>
  )
}
