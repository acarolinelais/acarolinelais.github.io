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
    <div className="space-y-10">
      <div className="max-w-xl space-y-3 text-[#17151b] [text-shadow:0_1px_16px_rgba(255,255,255,0.5)]">
        <h1 className="text-3xl font-medium">Work</h1>
        <p className="text-[#4a4750]">
          A mix of developer tools, automation and interfaces — built with
          Python and React. New projects land here as they ship.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <WorkProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  )
}
