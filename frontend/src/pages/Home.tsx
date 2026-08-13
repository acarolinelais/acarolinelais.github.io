import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { ContributionsCard } from '@/components/bento/ContributionsCard'
import { DateCard } from '@/components/bento/DateCard'
import { IntroCard } from '@/components/bento/IntroCard'
import { NowPlayingCard } from '@/components/bento/NowPlayingCard'
import { ProjectCard } from '@/components/bento/ProjectCard'
import { SocialGridCard } from '@/components/bento/SocialGridCard'
import { getProjects, getSocials } from '@/lib/api'
import { fallbackProjects, fallbackSocials } from '@/data/fallback'

const CARD = 'aspect-square w-full'

// Orchestrates the organic, staggered entrance for every card when Home
// mounts, whichever page you're arriving from.
const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
  // Framer Motion only resolves an exit as "complete" — letting
  // AnimatePresence unmount the tree — once every motion component that
  // declares `exit` reaches its target. Without this key, the root's own
  // `exit="exit"` pointed at nothing, so its own exit lingered, keeping the
  // full outgoing grid mounted (and visually stacked on the incoming page)
  // well past the point its children had actually finished animating out.
  exit: {},
}

// Every card, including the project cards, falls away the same quiet way —
// a physical, reorder-style push rather than a fade. They stay fully
// opaque throughout; the movement itself reads as "leaving". Project cards
// used to instead "fuse" into their Work-page counterpart via a shared
// layoutId, morphing in place — but WorkProjectCard is now a much bigger,
// differently-shaped card (cover image, taller layout), so the two ends of
// that morph no longer match closely enough for Framer Motion to bridge
// them smoothly: the small Home card and the large Work card would both
// render fully visible, overlapping, for a beat before settling. Plain
// fade/slide avoids that mismatch entirely.
const scrollDownVariants = {
  initial: { y: -48 },
  animate: {
    y: 0,
    transition: { type: 'spring' as const, stiffness: 180, damping: 20 },
  },
  // A large-displacement spring like the old one (stiffness 140, damping
  // 18, default mass 1) doesn't fire onComplete until it crosses Framer
  // Motion's rest thresholds, which for a 240px throw took ~800ms+ even
  // though it looked visually settled well before that — long enough that
  // the outgoing Home grid stayed stacked on top of the incoming Work page
  // for the whole stretch. Tightened (higher stiffness, added mass < 1) so
  // it actually finishes fast without losing the spring character.
  exit: {
    y: 240,
    transition: { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.6 },
  },
}

export function Home() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [socials, setSocials] = useState(fallbackSocials)

  useEffect(() => {
    getProjects().then(setProjects)
    getSocials().then(setSocials)
  }, [])

  const [maestro, byterise, thirdProject] = projects

  return (
    <motion.div
      className="[grid-area:1/1] grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-12"
      variants={gridVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Column 1 */}
      <div className="flex flex-col items-start gap-6">
        {maestro && (
          <motion.div variants={scrollDownVariants} className={CARD}>
            <ProjectCard project={maestro} className="size-full" />
          </motion.div>
        )}
        <motion.div
          variants={scrollDownVariants}
          className={cardClass('mt-6 lg:mt-20')}
        >
          <DateCard className="size-full" />
        </motion.div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-start gap-6 lg:mt-14">
        <motion.div variants={scrollDownVariants} className={CARD}>
          <IntroCard className="size-full" />
        </motion.div>
        {byterise && (
          <motion.div
            variants={scrollDownVariants}
            className={cardClass('mt-6 lg:mt-8')}
          >
            <ProjectCard project={byterise} className="size-full" />
          </motion.div>
        )}
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-start gap-4 lg:-mt-10">
        <motion.div variants={scrollDownVariants} className={CARD}>
          <ContributionsCard className="size-full" />
        </motion.div>
        <motion.div
          variants={scrollDownVariants}
          className="aspect-[3/4] w-full mt-4 lg:mt-3"
        >
          <NowPlayingCard className="size-full" />
        </motion.div>
        {thirdProject && (
          <motion.div
            variants={scrollDownVariants}
            className={cardClass('mt-4 lg:mt-3')}
          >
            <ProjectCard project={thirdProject} className="size-full" />
          </motion.div>
        )}
      </div>

      {/* Column 4 */}
      <div className="flex flex-col items-start gap-6 lg:mt-6">
        <motion.div variants={scrollDownVariants} className={CARD}>
          <CircleImageBadge className="size-full" />
        </motion.div>
        <motion.div
          variants={scrollDownVariants}
          className={cardClass('mt-6 lg:mt-8')}
        >
          <SocialGridCard socials={socials} className="size-full" />
        </motion.div>
      </div>
    </motion.div>
  )
}

function cardClass(extra: string) {
  return `${CARD} ${extra}`
}
