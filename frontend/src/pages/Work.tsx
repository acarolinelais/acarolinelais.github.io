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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="max-w-xl space-y-3 text-[#17151b] [text-shadow:0_1px_16px_rgba(255,255,255,0.5)]"
      >
        <h1 className="text-3xl font-medium">Work</h1>
        <p className="text-[#4a4750]">
          A mix of developer tools, automation and interfaces — built with
          Python and React. New projects land here as they ship.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.45,
                delay: 0.1 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          >
            <WorkProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
