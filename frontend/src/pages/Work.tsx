import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { WorkProjectCard } from '@/components/work/WorkProjectCard'
import { fallbackProjects } from '@/data/fallback'
import { getProjects } from '@/lib/api'

export function Work() {
  const [projects, setProjects] = useState(fallbackProjects)

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <div className="[grid-area:1/1] space-y-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.25, delay: 0.05 + i * 0.05 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <WorkProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
