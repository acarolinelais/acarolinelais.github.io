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

export function Home() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [socials, setSocials] = useState(fallbackSocials)

  useEffect(() => {
    getProjects().then(setProjects)
    getSocials().then(setSocials)
  }, [])

  const [maestro, byterise, thirdProject] = projects

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-12">
      {/* Column 1 */}
      <div className="flex flex-col items-start gap-6">
        {maestro && <ProjectCard project={maestro} className={CARD} />}
        <DateCard className={cardClass('mt-6 lg:mt-20')} />
      </div>

      {/* Column 2 */}
      <div className="flex flex-col items-start gap-6 lg:mt-14">
        <IntroCard className={CARD} />
        {byterise && (
          <ProjectCard project={byterise} className={cardClass('mt-6 lg:mt-8')} />
        )}
      </div>

      {/* Column 3 */}
      <div className="flex flex-col items-start gap-4 lg:-mt-10">
        <IconShowcaseCard icon={icons.cube} className={CARD} />
        <BentoCard surface="glass" className={cardClass('mt-4 lg:mt-3')} />
        {thirdProject && (
          <ProjectCard
            project={thirdProject}
            className={cardClass('mt-4 lg:mt-3')}
          />
        )}
      </div>

      {/* Column 4 */}
      <div className="flex flex-col items-start gap-6 lg:mt-6">
        <CircleImageBadge className={CARD} />
        <SocialGridCard socials={socials} className={cardClass('mt-6 lg:mt-8')} />
      </div>
    </div>
  )
}

function cardClass(extra: string) {
  return `${CARD} ${extra}`
}
