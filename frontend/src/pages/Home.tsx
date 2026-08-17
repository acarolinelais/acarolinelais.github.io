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

  // Masonry columns (see ReorderableGrid), each its own independent stack —
  // this is what gives the page its organic, not-quite-aligned feel: a
  // column's height is just whatever its own cards add up to, with no shared
  // row grid forcing alignment across columns.
  //
  // Each breakpoint gets its own arrangement rather than being folded down
  // from the 4-column one, because the designs genuinely differ in *which*
  // cards sit together, not just how many fit — at 3 columns the map moves
  // in under the intro card and the avatar moves up beside the date, neither
  // of which merging whole columns end-to-end could produce.
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
      // A banner spanning two columns on desktop, and a small single-column
      // strip below that. It can stay small because the bleed in MapCard
      // crops the embed's chrome *outward* — the card's own face is covered
      // edge to edge by map tiles at any size.
      aspectRatio: (columnCount) => (columnCount >= 4 ? 1.7 : columnCount === 3 ? 2.4 : 1.9),
      // Listing the same slot object in two columns is what makes a span
      // work (see CardSlot.colSpan); it's only listed twice in the 4-column
      // arrangement below, so the span is scoped to match.
      colSpan: (columnCount) => (columnCount >= 4 ? 2 : 1),
      render: () => <MapCard className="size-full" />,
    }

    const byteriseSlot = byterise
      ? {
          id: 'project-byterise',
          // Height is always derived from a single column's width (see
          // CardSlot.colSpan), so 1 keeps it tall enough for its content
          // whether or not it's spanning.
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
