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
      <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden rounded-card bg-white/5 p-10 backdrop-blur-xl dark:bg-black/5 lg:gap-2 lg:p-6 2xl:gap-3 2xl:p-10">
        <span className="text-xl font-regular text-white lg:text-base 2xl:text-xl">
          Hi, I'm Caroline
        </span>
        <p className="text-xl font-regular leading-6 text-white lg:text-base lg:leading-5 2xl:text-xl 2xl:leading-6">
          A software developer and designer blending technology and
          creativity.
        </p>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
