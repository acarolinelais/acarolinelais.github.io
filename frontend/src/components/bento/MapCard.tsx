import { images } from '@/assets/images'
import { cn, noNativeDrag } from '@/lib/utils'

interface MapCardProps {
  className?: string
}

export function MapCard({ className }: MapCardProps) {
  return (
    <div
      className={cn(
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-card bg-[#f2efe9] dark:bg-[#1d1f24]">
        {/* Static OpenStreetMap snapshot of Manaus; invert + hue-rotate makes it dark. */}
        <img
          src={images.mapManaus}
          alt="Map of Manaus, Brazil"
          draggable={false}
          className={cn(
            'size-full object-cover grayscale-[15%] dark:invert-[88%] dark:hue-rotate-180 dark:brightness-95 dark:contrast-[1.1]',
            noNativeDrag,
          )}
        />
        {/* Attribution required by the OpenStreetMap licence (ODbL). */}
        <span className="pointer-events-none absolute bottom-1.5 right-3 text-[8px] text-black/40 @[20rem]:text-[9px] dark:text-white/40">
          © OpenStreetMap
        </span>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
      <span className="absolute left-1/2 top-1/2 flex size-8 select-none -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white shadow-float @[20rem]:size-11">
        <img
          src={images.avatar2}
          alt=""
          aria-hidden
          draggable={false}
          className={cn('size-6 object-cover @[20rem]:size-9', noNativeDrag)}
        />
      </span>
    </div>
  )
}
