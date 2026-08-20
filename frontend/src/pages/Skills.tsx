import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { CircleImageBadge } from '@/components/bento/CircleImageBadge'
import { ContributionsCard } from '@/components/bento/ContributionsCard'
import { IntroCard } from '@/components/bento/IntroCard'
import { MapCard } from '@/components/bento/MapCard'
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

  // Same masonry columns as Home (see ReorderableGrid) — each breakpoint
  // gets its own arrangement rather than folding down from the 4-column one,
  // for the same reason Home does: Frontend/Backend read as prominent,
  // full-width-ish banners on a 2-column phone and a 4-column desktop, but
  // sit one-per-column at 3, and no amount of column-merging produces that
  // from a single base layout.
  const columns = useMemo(() => {
    const compact = (...slots: (CardSlot | null)[]) => slots.filter((s): s is CardSlot => s !== null)

    const introSlot: CardSlot = {
      id: 'intro',
      aspectRatio: 1,
      render: () => <IntroCard className="size-full" />,
    }
    const contributionsSlot: CardSlot = {
      id: 'contributions',
      aspectRatio: 1,
      render: () => <ContributionsCard className="size-full" />,
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
      // Same figures as Home's map slot — the embed crops identically
      // regardless of which page it's on.
      aspectRatio: (columnCount) => (columnCount >= 4 ? 1.7 : columnCount === 3 ? 2.4 : 1.9),
      colSpan: (columnCount) => (columnCount >= 4 ? 2 : 1),
      render: () => <MapCard className="size-full" />,
    }

    // A skill card carries a title, a full sentence of description and a
    // wrapping icon row. Spanning two columns at 4 and 2 (where it reads as
    // a headline banner) gives that content room to breathe, so the aspect
    // ratio there can go wide and short; at 3 columns it stays one column
    // wide, so the ratio comes back down to leave height for the same
    // content in a narrower box.
    const skillColSpan = (columnCount: number) => (columnCount === 3 ? 1 : 2)
    const skillAspectRatio = (columnCount: number) =>
      columnCount >= 4 ? 1.3 : columnCount === 3 ? 0.85 : 0.75

    const frontendSlot: CardSlot | null = frontend
      ? {
          id: 'skill-frontend',
          aspectRatio: skillAspectRatio,
          colSpan: skillColSpan,
          render: () => <SkillCard group={frontend} className="size-full" />,
        }
      : null
    const backendSlot: CardSlot | null = backend
      ? {
          id: 'skill-backend',
          aspectRatio: skillAspectRatio,
          colSpan: skillColSpan,
          render: () => <SkillCard group={backend} className="size-full" />,
        }
      : null

    return (columnCount: number): CardSlot[][] => {
      if (columnCount >= 4) {
        return [
          compact(frontendSlot, introSlot, mapSlot),
          compact(frontendSlot, contributionsSlot, mapSlot),
          compact(backendSlot, circleSlot),
          compact(backendSlot, socialSlot),
        ]
      }

      if (columnCount === 3) {
        return [
          compact(frontendSlot, circleSlot),
          compact(introSlot, contributionsSlot),
          compact(backendSlot, socialSlot, mapSlot),
        ]
      }

      return [
        compact(introSlot, frontendSlot, backendSlot, mapSlot, socialSlot),
        compact(contributionsSlot, frontendSlot, backendSlot, circleSlot),
      ]
    }
  }, [frontend, backend, socials])

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
