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
import { gridVariants, scrollDownVariants } from '@/lib/pageTransitions'
import { fallbackProjects, fallbackSocials } from '@/data/fallback'

const CARD = 'aspect-square w-full'

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
