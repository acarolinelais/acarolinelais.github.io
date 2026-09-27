import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { WorkProjectCard } from '@/components/work/WorkProjectCard'
import { fallbackProjects } from '@/data/fallback'
import { getProjects } from '@/lib/api'
import { fadeOnlyVariants } from '@/lib/pageTransitions'
import { preloadImage } from '@/lib/utils'

const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.03 },
  },
  exit: {},
}

export function preloadWorkImages() {
  for (const project of fallbackProjects) {
    if (project.image) preloadImage(project.image)
  }
}

export function Work() {
  const [projects, setProjects] = useState(fallbackProjects)
  const location = useLocation()
  const navigate = useNavigate()
  // Set by the arrow on Home's project cards.
  const [highlighted] = useState<string | null>(
    () => (location.state as { project?: string } | null)?.project ?? null,
  )

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  useEffect(() => {
    if (!highlighted) return
    // Cleared so a reload doesn't highlight it again.
    navigate(location.pathname, { replace: true, state: null })
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document
      .getElementById(`project-${highlighted}`)
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }, [highlighted])

  return (
    <motion.div
      className="[grid-area:1/1] space-y-10"
      variants={gridVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <motion.div key={project.slug} variants={fadeOnlyVariants} className="card-fade">
            <WorkProjectCard project={project} highlighted={project.slug === highlighted} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
