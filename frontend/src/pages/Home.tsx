import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { icons } from '@/assets/icons'
import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { DateCard } from '@/components/bento/DateCard'
import { IconShowcaseCard } from '@/components/bento/IconShowcaseCard'
import { IntroCard } from '@/components/bento/IntroCard'
import { NowPlayingCard } from '@/components/bento/NowPlayingCard'
import { ProjectCard } from '@/components/bento/ProjectCard'
import { SocialGridCard } from '@/components/bento/SocialGridCard'
import { getProjects, getSocials } from '@/lib/api'
import { fallbackProjects, fallbackSocials } from '@/data/fallback'
import type { Project } from '@/types/content'

const CARD = 'aspect-square w-full'

const layoutTransition = {
  layout: { type: 'spring' as const, stiffness: 110, damping: 16, mass: 0.9 },
}

// Orchestrates the organic, staggered entrance for every card when Home
// mounts, whichever page you're arriving from.
const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
}

// Cards that aren't the destination's subject just get shuffled out of the
// way — a physical, reorder-style push rather than a fade. They stay fully
// opaque throughout; the movement itself reads as "leaving".
const scrollDownVariants = {
  initial: { y: -48 },
  animate: {
    y: 0,
    transition: { type: 'spring' as const, stiffness: 180, damping: 20 },
  },
  exit: {
    y: 240,
    transition: { type: 'spring' as const, stiffness: 140, damping: 18 },
  },
}

interface HomeProps {
  destination?: string
}

export function Home({ destination }: HomeProps) {
  const [projects, setProjects] = useState(fallbackProjects)
  const [socials, setSocials] = useState(fallbackSocials)

  useEffect(() => {
    getProjects().then(setProjects)
    getSocials().then(setSocials)
  }, [])

  const [maestro, byterise, thirdProject] = projects

  // Only the /work destination has a matching card to fuse into; anywhere
  // else (including /skills) every card falls away the same quiet way.
  const fuseIntoWork = destination === '/work'

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
          <ProjectSlot project={maestro} fuse={fuseIntoWork} className={CARD}>
            <ProjectCard project={maestro} className="size-full" />
          </ProjectSlot>
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
          <ProjectSlot
            project={byterise}
            fuse={fuseIntoWork}
            className={cardClass('mt-6 lg:mt-8')}
          >
            <ProjectCard project={byterise} className="size-full" />
          </ProjectSlot>
        )}
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-start gap-4 lg:-mt-10">
        <motion.div variants={scrollDownVariants} className={CARD}>
          <IconShowcaseCard icon={icons.cube} className="size-full" />
        </motion.div>
        <motion.div
          variants={scrollDownVariants}
          className="aspect-[3/4] w-full mt-4 lg:mt-3"
        >
          <NowPlayingCard className="size-full" />
        </motion.div>
        {thirdProject && (
          <ProjectSlot
            project={thirdProject}
            fuse={fuseIntoWork}
            className={cardClass('mt-4 lg:mt-3')}
          >
            <ProjectCard project={thirdProject} className="size-full" />
          </ProjectSlot>
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

interface ProjectSlotProps {
  project: Project
  fuse: boolean
  className: string
  children: ReactNode
}

// When heading to /work, this card carries the same layoutId as its
// Work-page counterpart, so Framer Motion morphs one into the other
// instead of crossfading two unrelated elements. Everywhere else it
// just falls away like the rest of the bento grid.
function ProjectSlot({ project, fuse, className, children }: ProjectSlotProps) {
  if (fuse) {
    return (
      <motion.div
        layoutId={`project-card-${project.slug}`}
        transition={layoutTransition}
        className={className}
        style={{ zIndex: 1 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div variants={scrollDownVariants} className={className}>
      {children}
    </motion.div>
  )
}

function cardClass(extra: string) {
  return `${CARD} ${extra}`
}
