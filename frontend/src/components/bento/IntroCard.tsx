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
      <div className="absolute inset-0 flex flex-col justify-center gap-1 overflow-hidden rounded-card bg-white/5 p-4 backdrop-blur-xl dark:bg-black/5 lg:gap-1.5 lg:p-5 2xl:gap-2 2xl:p-11">
        <span className="text-sm font-regular text-white lg:text-sm 2xl:text-xl">
          Hi, I'm Caroline
        </span>
        <p className="text-sm font-regular leading-4 text-white lg:text-sm lg:leading-4 2xl:text-xl 2xl:leading-6">
          A software developer and designer blending technology and creativity.
        </p>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
