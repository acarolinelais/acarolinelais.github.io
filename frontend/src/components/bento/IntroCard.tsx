import { cn } from '@/lib/utils'

interface IntroCardProps {
  className?: string
}

export function IntroCard({ className }: IntroCardProps) {
  return (
    <div
      className={cn(
        'relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden rounded-card bg-white/5 p-11 backdrop-blur-xl">
        <span className="text-xl font-regular text-white">Hi, I'm Caroline</span>
        <p className="text-xl font-regular leading-6 text-white">
          A software developer and designer blending technology and
          creativity.
        </p>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
