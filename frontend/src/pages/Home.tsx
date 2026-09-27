import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { ContributionsCard } from '@/components/bento/ContributionsCard'
import { DateCard } from '@/components/bento/DateCard'
import { IntroCard } from '@/components/bento/IntroCard'
import { MapCard } from '@/components/bento/MapCard'
import { NowPlayingCard } from '@/components/bento/NowPlayingCard'
import { ProjectCard } from '@/components/bento/ProjectCard'
import type { CardSlot } from '@/components/bento/ReorderableGrid'
import { ReorderableGrid } from '@/components/bento/ReorderableGrid'
import { SocialGridCard } from '@/components/bento/SocialGridCard'
import { getProjects, getSocials } from '@/lib/api'
import { gridVariants } from '@/lib/pageTransitions'
import { fallbackProjects, fallbackSocials } from '@/data/fallback'

export function Home() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [socials, setSocials] = useState(fallbackSocials)

  useEffect(() => {
    getProjects().then(setProjects)
    getSocials().then(setSocials)
  }, [])

  const [maestro, byterise, thirdProject] = projects

  // One arrangement per breakpoint, since the designs differ in which cards
  // sit together, not just in how many columns fit.
  const columns = useMemo(() => {
    const compact = (...slots: (CardSlot | null)[]) => slots.filter((s): s is CardSlot => s !== null)

    const maestroSlot = maestro
      ? {
          id: 'project-maestro',
          aspectRatio: 0.72,
          render: () => <ProjectCard project={maestro} className="size-full" />,
        }
      : null

    const dateSlot: CardSlot = {
      id: 'date',
      aspectRatio: 1,
      render: () => <DateCard className="size-full" />,
    }
    const contributionsSlot: CardSlot = {
      id: 'contributions',
      aspectRatio: 1,
      render: () => <ContributionsCard className="size-full" />,
    }
    const nowPlayingSlot: CardSlot = {
      id: 'now-playing',
      aspectRatio: 0.75,
      render: () => <NowPlayingCard className="size-full" />,
    }
    const introSlot: CardSlot = {
      id: 'intro',
      aspectRatio: 1,
      render: () => <IntroCard className="size-full" />,
    }
    const circleSlot: CardSlot = {
      id: 'circle-badge',
      aspectRatio: 1,
      render: () => <CircleImageBadge className="size-full" />,
    }
    const socialSlot: CardSlot = {
      id: 'social-grid',
      aspectRatio: 1,
      render: () => <SocialGridCard socials={socials} className="size-full" />,
    }

    const mapSlot: CardSlot = {
      id: 'map',
      aspectRatio: (columnCount) => (columnCount >= 4 ? 1.7 : columnCount === 3 ? 2.4 : 1.9),
      // Only listed in two columns in the 4-column arrangement.
      colSpan: (columnCount) => (columnCount >= 4 ? 2 : 1),
      render: () => <MapCard className="size-full" />,
    }

    const byteriseSlot = byterise
      ? {
          id: 'project-byterise',
          aspectRatio: 1,
          colSpan: (columnCount: number) => (columnCount >= 4 ? 2 : 1),
          render: () => <ProjectCard project={byterise} className="size-full" />,
        }
      : null

    const thirdSlot = thirdProject
      ? {
          id: 'project-third',
          aspectRatio: 1,
          render: () => <ProjectCard project={thirdProject} className="size-full" />,
        }
      : null

    return (columnCount: number): CardSlot[][] => {
      if (columnCount >= 4) {
        return [
          compact(maestroSlot, dateSlot, mapSlot),
          compact(contributionsSlot, nowPlayingSlot, mapSlot),
          compact(introSlot, byteriseSlot, thirdSlot),
          compact(circleSlot, byteriseSlot, socialSlot),
        ]
      }

      if (columnCount === 3) {
        return [
          compact(maestroSlot, dateSlot, circleSlot),
          compact(contributionsSlot, nowPlayingSlot, thirdSlot),
          compact(introSlot, mapSlot, byteriseSlot, socialSlot),
        ]
      }

      return [
        compact(maestroSlot, dateSlot, mapSlot, introSlot, byteriseSlot),
        compact(contributionsSlot, nowPlayingSlot, circleSlot, socialSlot, thirdSlot),
      ]
    }
  }, [maestro, byterise, thirdProject, socials])

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
