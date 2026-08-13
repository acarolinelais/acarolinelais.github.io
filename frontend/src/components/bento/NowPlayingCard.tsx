import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { nowPlayingTracks } from '@/data/nowPlaying'
import { cn } from '@/lib/utils'

interface NowPlayingCardProps {
  className?: string
}

const ROTATE_MS = 3 * 60 * 1000

export function NowPlayingCard({ className }: NowPlayingCardProps) {
  const [index, setIndex] = useState(0)

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
        'relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-card bg-white/5 p-3 backdrop-blur-xl dark:bg-black/5">
        <div className="relative flex-1 overflow-hidden rounded-t-[calc(var(--radius-card)-0.75rem)] rounded-b-4xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={track.title}
              src={track.cover}
              alt={`${track.title} cover art`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 size-full object-cover"
            />
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.title}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="px-5 pb-3 pt-3"
          >
            <p className="truncate text-md font-regular text-white">{track.title}</p>
            <p className="truncate text-sm text-white/70">{track.artist}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
