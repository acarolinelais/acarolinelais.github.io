import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { ContributionsCard } from '@/components/bento/ContributionsCard'
import { IntroCard } from '@/components/bento/IntroCard'
import type { CardSlot } from '@/components/bento/ReorderableGrid'
import { ReorderableGrid } from '@/components/bento/ReorderableGrid'
import { SkillCard } from '@/components/bento/SkillCard'
import { SocialGridCard } from '@/components/bento/SocialGridCard'
import { fallbackSkillGroups, fallbackSocials } from '@/data/fallback'
import { getSkillGroups, getSocials } from '@/lib/api'
import { gridVariants } from '@/lib/pageTransitions'

export function Skills() {
  const [groups, setGroups] = useState(fallbackSkillGroups)
  const [socials, setSocials] = useState(fallbackSocials)

  useEffect(() => {
    getSkillGroups().then(setGroups)
    getSocials().then(setSocials)
  }, [])

  const [frontend, backend] = groups

  // Same masonry columns as Home (see ReorderableGrid).
  const columns = useMemo(() => {
    const col1: CardSlot[] = [
      { id: 'intro', aspectRatio: 0.85, render: () => <IntroCard className="size-full" /> },
    ]
    const col2: CardSlot[] = [
      { id: 'contributions', aspectRatio: 1, render: () => <ContributionsCard className="size-full" /> },
    ]
    const col3: CardSlot[] = []
    const col4: CardSlot[] = [
      { id: 'circle-badge', aspectRatio: 1, render: () => <CircleImageBadge className="size-full" /> },
      {
        id: 'social-grid',
        aspectRatio: 1,
        render: () => <SocialGridCard socials={socials} className="size-full" />,
      },
    ]

    if (backend) {
      col3.push({
        id: 'skill-backend',
        aspectRatio: 0.85,
        render: () => <SkillCard group={backend} className="size-full" />,
      })
    }
    if (frontend) {
      col3.push({
        id: 'skill-frontend',
        aspectRatio: 0.85,
        render: () => <SkillCard group={frontend} className="size-full" />,
      })
    }

    return [col1, col2, col3, col4]
  }, [backend, frontend, socials])

  return (
    <motion.div
      className="[grid-area:1/1]"
      variants={gridVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ReorderableGrid columns={columns} />
    </motion.div>
  )
}
