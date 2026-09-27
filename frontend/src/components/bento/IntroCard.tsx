import { cn } from '@/lib/utils'

interface IntroCardProps {
  className?: string
}

export function IntroCard({ className }: IntroCardProps) {
  return (
    <div
      className={cn(
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 overflow-hidden rounded-card bg-white/5 p-6 backdrop-blur-xl @[9.5rem]:gap-2 @[13rem]:gap-2.5 @[13rem]:p-7 @[16.25rem]:gap-2.5 @[16.25rem]:p-8 @[20rem]:gap-2.5 @[20rem]:p-10 dark:bg-black/5">
        <span className="text-[10px] font-regular text-white @[9.5rem]:text-[11px] @[13rem]:text-base @[16.25rem]:text-xl @[20rem]:text-2xl">
          Hi, I'm Caroline
        </span>
        {/* The em-based max-w keeps the same four-line break at every size.
            9.5rem (not 10rem) so a 375px phone's ~159px card gets that tier. */}
        <p className="max-w-[10.5em] text-[10px] font-regular leading-[1.20] text-white @[9.5rem]:text-[13px] @[13rem]:text-base @[16.25rem]:text-xl @[20rem]:text-2xl">
          A software developer and designer blending technology and creativity.
        </p>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
