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

// Opacity-only, no y movement, and kept short (0.15s): every
// WorkProjectCard is covered in backdrop-blur surfaces (the card itself,
// plus every tech-icon/action circle), and backdrop-filter has to be
// recomputed by the browser on every frame it's part of an active
// transition, regardless of which property is animating — 4 of these
// appearing/moving at once measured at ~25-30fps instead of 60fps.
// There's no way to animate that many blurred regions at once without
// some frame cost, so the fix is to keep the animated window short
// (~150ms) rather than eliminate the stutter outright — a few dropped
// frames over 150ms reads as a quick pop-in; the same drop rate stretched
// over 400-500ms reads as the "buggy" stutter this used to have.
const cardVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
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
          <motion.div key={project.slug} variants={cardVariants}>
            <WorkProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
