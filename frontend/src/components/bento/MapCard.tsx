import { images } from '@/assets/images'
import { cn } from '@/lib/utils'

interface MapCardProps {
  className?: string
}

// Manaus, Amazonas, Brazil — classic OpenStreetMap iframe embed, no API key
// required.
const MAP_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=-60.2050%2C-3.2050%2C-59.8450%2C-2.9950&layer=mapnik&marker=-3.1019%2C-60.0250'

export function MapCard({ className }: MapCardProps) {
  return (
    <div
      className={cn(
        'relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[3rem]">
        {/* Oversized by a fixed pixel margin and anchored top-left, so
            the embed's own zoom control (~40x70px, top-right) and
            attribution banner (bottom, up to ~90px when it wraps) land
            outside the visible frame regardless of card size — this
            card is a decorative snapshot, not an interactive map. The
            invert/hue-rotate combo is the standard trick for turning the
            light-only OSM tile embed into a dark map in dark mode, since
            the embed itself has no dark tile layer option. */}
        <iframe
          src={MAP_EMBED_SRC}
          title="Manaus, Brazil"
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 h-[calc(100%+100px)] w-[calc(100%+60px)] grayscale-[15%] dark:invert-[88%] dark:hue-rotate-180 dark:brightness-95 dark:contrast-[1.1]"
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-[3rem]" />
      <span className="absolute right-55 top-20 flex size-11 items-center justify-center overflow-hidden rounded-full bg-white shadow-float">
        <img
          src={images.avatar2}
          alt=""
          aria-hidden
          className="size-9 object-cover"
        />
      </span>
    </div>
  )
}
