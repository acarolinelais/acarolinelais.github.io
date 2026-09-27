import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { WorkProjectCard } from '@/components/work/WorkProjectCard'
import { fallbackProjects } from '@/data/fallback'
import { getProjects } from '@/lib/api'

// Work only ever shows a handful of large cards (vs. Home's dense bento
// grid), so Home's bouncy, delayChildren-first spring reads as a stall
// here instead of an organic entrance — a quick, tight-stagger tween
// reads as immediate instead.
const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.03 },
  },
  exit: {},
}

// Fade-only, no y movement, and kept short (0.15s): every WorkProjectCard
// is covered in backdrop-blur surfaces (the card itself, plus every
// tech-icon/action circle), and backdrop-filter has to be recomputed by the
// browser on every frame it's part of an active transition, regardless of
// which property is animating — 4 of these appearing/moving at once
// measured at ~25-30fps instead of 60fps. Keeping the animated window short
// (~150ms) turns those dropped frames into a quick pop-in rather than a
// drawn-out stutter.
//
// The fade animates `--card-fade` rather than `opacity`, for the same
// reason as scrollDownVariants in lib/pageTransitions.ts: opacity on this
// wrapper would make it a backdrop root, so the card's glass showed no blur
// at all until the fade finished — which read as the blur "loading late"
// every time you navigated here. `card-fade` (index.css) applies the value
// to the card's own layers instead, where the blur keeps working.
const cardVariants = {
  initial: { '--card-fade': 0 },
  animate: {
    '--card-fade': 1,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
  exit: {
    '--card-fade': 0,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
}

export function Work() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <motion.div
      className="[grid-area:1/1] space-y-10"
      variants={gridVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <motion.div key={project.slug} variants={cardVariants} className="card-fade">
            <WorkProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
