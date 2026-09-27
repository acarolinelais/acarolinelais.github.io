import { images } from '@/assets/images'
import { cn } from '@/lib/utils'

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
        {/* Manaus, Amazonas, Brazil — a static snapshot of the OpenStreetMap
            tiles (~100KB, bundled), centred on the same point the old
            <iframe> embed marked. The embed had to download OSM's whole
            page + Leaflet + tiles before anything showed, which read as the
            card loading late; this card is decorative (never interactive),
            so a plain image paints with the rest of the page. object-cover
            keeps the centre — and so the avatar pin below — on Manaus at
            every card size. The invert/hue-rotate combo is the standard
            trick for turning the light OSM tiles into a dark map. */}
        <img
          src={images.mapManaus}
          alt="Map of Manaus, Brazil"
          draggable={false}
          className="size-full select-none object-cover grayscale-[15%] [-webkit-user-drag:none] dark:invert-[88%] dark:hue-rotate-180 dark:brightness-95 dark:contrast-[1.1]"
        />
        {/* Attribution required by the OpenStreetMap licence (ODbL). */}
        <span className="pointer-events-none absolute bottom-1.5 right-3 text-[8px] text-black/40 @[20rem]:text-[9px] dark:text-white/40">
          © OpenStreetMap
        </span>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
      {/* Centred rather than pinned at a fixed inset. The old `right-55
          top-20` was ~220px in from the right, which on a phone-width card is
          past its left edge entirely — the avatar simply disappeared. */}
      <span className="absolute left-1/2 top-1/2 flex size-8 select-none -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white shadow-float @[20rem]:size-11">
        {/* No native drag/selection, same as CircleImageBadge — otherwise
            grabbing the card by its avatar drags the image, not the card. */}
        <img
          src={images.avatar2}
          alt=""
          aria-hidden
          draggable={false}
          className="size-6 select-none object-cover [-webkit-touch-callout:none] [-webkit-user-drag:none] @[20rem]:size-9"
        />
      </span>
    </div>
  )
}
