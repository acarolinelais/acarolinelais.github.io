import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { WorkProjectCard } from '@/components/work/WorkProjectCard'
import { fallbackProjects } from '@/data/fallback'
import { getProjects } from '@/lib/api'
import { gridVariants, scrollDownVariants } from '@/lib/pageTransitions'

export function Work() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

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
          <motion.div key={project.slug} variants={scrollDownVariants}>
            <WorkProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
