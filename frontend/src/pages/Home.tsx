import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { DateCard } from '@/components/bento/DateCard'
import { IconShowcaseCard } from '@/components/bento/IconShowcaseCard'
import { IntroCard } from '@/components/bento/IntroCard'
import { ProjectCard } from '@/components/bento/ProjectCard'
import { SocialGridCard } from '@/components/bento/SocialGridCard'
import { getProjects, getSocials } from '@/lib/api'
import { fallbackProjects, fallbackSocials } from '@/data/fallback'

const CARD = 'aspect-square w-full'

const popVariants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const } },
}

// Project cards "expand" away instead of shrinking, so they read as the
// thing leading into the next page while everything else falls back.
const expandVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  exit: {
    opacity: 0,
    scale: 1.4,
    transition: { duration: 0.4, ease: [0.4, 0, 1, 1] as const },
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
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Column 1 */}
      <div className="flex flex-col items-start gap-6">
        {maestro && (
          <motion.div variants={expandVariants} className={CARD} style={{ zIndex: 1 }}>
            <ProjectCard project={maestro} className="size-full" />
          </motion.div>
        )}
        <motion.div
          variants={popVariants}
          className={cardClass('mt-6 lg:mt-20')}
        >
          <DateCard className="size-full" />
        </motion.div>
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-start gap-6 lg:mt-14">
        <motion.div variants={popVariants} className={CARD}>
          <IntroCard className="size-full" />
        </motion.div>
        {byterise && (
          <motion.div
            variants={expandVariants}
            className={cardClass('mt-6 lg:mt-8')}
            style={{ zIndex: 1 }}
          >
            <ProjectCard project={byterise} className="size-full" />
          </motion.div>
        )}
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-start gap-4 lg:-mt-10">
        <motion.div variants={popVariants} className={CARD}>
          <IconShowcaseCard icon={icons.cube} className="size-full" />
        </motion.div>
        <motion.div
          variants={popVariants}
          className={cardClass('mt-4 lg:mt-3')}
        >
          <BentoCard surface="glass" className="size-full" />
        </motion.div>
        {thirdProject && (
          <motion.div
            variants={expandVariants}
            className={cardClass('mt-4 lg:mt-3')}
            style={{ zIndex: 1 }}
          >
            <ProjectCard project={thirdProject} className="size-full" />
          </motion.div>
        )}
      </div>

      {/* Column 4 */}
      <div className="flex flex-col items-start gap-6 lg:mt-6">
        <motion.div variants={popVariants} className={CARD}>
          <CircleImageBadge className="size-full" />
        </motion.div>
        <motion.div
          variants={popVariants}
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
