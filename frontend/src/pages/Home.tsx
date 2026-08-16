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

  // Four masonry columns (see ReorderableGrid), each its own independent
  // stack — this is what gives the page its organic, not-quite-aligned
  // feel: a column's height is just whatever its own cards add up to, with
  // no shared row grid forcing alignment across columns. Two cards break
  // out of that per-column independence and span two columns wide (desktop
  // only — see CardSlot.colSpan): the MapCard under DateCard/NowPlaying,
  // and the ByteRise project card under Intro/CircleBadge.
  //   Col 1: a vertically-stretched (taller-than-wide) project card, then
  //          DateCard, then the Manaus MapCard (spans into col 2).
  //   Col 2: Contributions, then NowPlaying, then the MapCard's other half.
  //   Col 3: IntroCard, then the ByteRise project card (spans into col 4),
  //          then a standard-size project card.
  //   Col 4: the circle avatar, then the ByteRise card's other half, then
  //          the social grid.
  const columns = useMemo(() => {
    const col1: CardSlot[] = []
    const col2: CardSlot[] = []
    const col3: CardSlot[] = []
    const col4: CardSlot[] = []

    if (maestro) {
      col1.push({
        id: 'project-maestro',
        aspectRatio: 0.72,
        render: () => <ProjectCard project={maestro} className="size-full" />,
      })
    }
    col1.push({
      id: 'date',
      aspectRatio: 1,
      render: () => <DateCard className="size-full" />,
    })

    col2.push({
      id: 'contributions',
      aspectRatio: 1,
      render: () => <ContributionsCard className="size-full" />,
    })
    col2.push({
      id: 'now-playing',
      aspectRatio: 0.75,
      render: () => <NowPlayingCard className="size-full" />,
    })

    // Same CardSlot object listed in both col1 and col2 — that's what tells
    // the grid these two columns share this row (see CardSlot.colSpan).
    const mapSlot: CardSlot = {
      id: 'map',
      aspectRatio: 1.7,
      colSpan: 2,
      render: () => <MapCard className="size-full" />,
    }
    col1.push(mapSlot)
    col2.push(mapSlot)

    col3.push({
      id: 'intro',
      aspectRatio: 1,
      render: () => <IntroCard className="size-full" />,
    })
    col4.push({
      id: 'circle-badge',
      aspectRatio: 1,
      render: () => <CircleImageBadge className="size-full" />,
    })

    if (byterise) {
      // Same pattern as mapSlot — shared between col3 and col4.
      const byteriseSlot: CardSlot = {
        id: 'project-byterise',
        // Height is always derived from a single column's width (see
        // CardSlot.colSpan) — 1 keeps it comfortably tall enough for its
        // content even when it falls back to a non-spanning single column
        // below the 4-column breakpoint, while still reading as a wide
        // banner once it spans two columns on desktop.
        aspectRatio: 1,
        colSpan: 2,
        render: () => <ProjectCard project={byterise} className="size-full" />,
      }
      col3.push(byteriseSlot)
      col4.push(byteriseSlot)
    }

    if (thirdProject) {
      col3.push({
        id: 'project-third',
        aspectRatio: 1,
        render: () => <ProjectCard project={thirdProject} className="size-full" />,
      })
    }
    col4.push({
      id: 'social-grid',
      aspectRatio: 1,
      render: () => <SocialGridCard socials={socials} className="size-full" />,
    })

    return [col1, col2, col3, col4]
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
