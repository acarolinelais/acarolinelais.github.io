import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { nowPlayingTracks } from '@/data/nowPlaying'
import { cn } from '@/lib/utils'

interface NowPlayingCardProps {
  className?: string
}

const ROTATE_MS = 3 * 60 * 1000

export function NowPlayingCard({ className }: NowPlayingCardProps) {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * nowPlayingTracks.length),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % nowPlayingTracks.length)
    }, ROTATE_MS)
    return () => clearInterval(id)
  }, [])

  const track = nowPlayingTracks[index]

  return (
    <div
      className={cn(
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-card bg-white/5 p-2 backdrop-blur-xl @[13rem]:p-3 dark:bg-black/5">
        {/* The top corners have to stay concentric with the card's own
            radius, so the inset tracks whatever padding is in play. */}
        <div className="relative flex-1 overflow-hidden rounded-t-[calc(var(--radius-card)-0.5rem)] rounded-b-2xl @[13rem]:rounded-t-[calc(var(--radius-card)-0.75rem)] @[13rem]:rounded-b-4xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={track.title}
              src={track.cover}
              alt={`${track.title} cover art`}
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              // The card itself is drag-reorderable — without these, a
              // press-and-hold on the cover art starts the browser's own
              // native image drag (or, on touch, the save-image callout)
              // instead of the grid's drag gesture.
              className="absolute inset-0 size-full touch-none object-cover select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]"
            />
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="px-2 pb-2 pt-2 @[13rem]:px-4 @[13rem]:pb-3 @[13rem]:pt-3 @[16rem]:px-5"
          >
            {/* `text-md` isn't a Tailwind size — it was silently a no-op. */}
            <p className="truncate text-center text-[11px] font-regular text-white @[13rem]:text-sm @[16rem]:text-base">
              {track.title}
            </p>
            <p className="truncate text-center text-[9px] text-white/60 @[13rem]:text-xs @[16rem]:text-sm">
              {track.artist}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
