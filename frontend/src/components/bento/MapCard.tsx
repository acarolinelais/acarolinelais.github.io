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
        // The bleed is what the iframe is oversized by; it's a variable so
        // the crop can shrink on a small card without the two `calc()`s
        // below drifting apart. Trimming ~90px off a card that's only ~115px
        // tall on a phone would crop away the map itself, not just the
        // chrome — and the chrome is smaller at that width anyway.
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        '[--map-bleed-x:36px] [--map-bleed-y:56px] @[32rem]:[--map-bleed-x:60px] @[32rem]:[--map-bleed-y:100px]',
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-card">
        {/* Oversized and anchored top-left, so the embed's own zoom control
            (~40x70px, top-right) and attribution banner (bottom, up to ~90px
            when it wraps) land outside the visible frame — this card is a
            decorative snapshot, not an interactive map. The invert/hue-rotate
            combo is the standard trick for turning the light-only OSM tile
            embed into a dark map in dark mode, since the embed itself has no
            dark tile layer option. */}
        <iframe
          src={MAP_EMBED_SRC}
          title="Manaus, Brazil"
          loading="lazy"
          className="pointer-events-none absolute left-0 top-0 h-[calc(100%+var(--map-bleed-y))] w-[calc(100%+var(--map-bleed-x))] grayscale-[15%] dark:invert-[88%] dark:hue-rotate-180 dark:brightness-95 dark:contrast-[1.1]"
        />
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
      {/* Centred rather than pinned at a fixed inset. The old `right-55
          top-20` was ~220px in from the right, which on a phone-width card is
          past its left edge entirely — the avatar simply disappeared. */}
      <span className="absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white shadow-float @[20rem]:size-11">
        <img
          src={images.avatar2}
          alt=""
          aria-hidden
          className="size-6 object-cover @[20rem]:size-9"
        />
      </span>
    </div>
  )
}
