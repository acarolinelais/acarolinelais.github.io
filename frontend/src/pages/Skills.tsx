import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { icons } from '@/assets/icons'
import { fallbackSkillGroups } from '@/data/fallback'
import { getSkillGroups } from '@/lib/api'

export function Skills() {
  const [groups, setGroups] = useState(fallbackSkillGroups)

  useEffect(() => {
    getSkillGroups().then(setGroups)
  }, [])

  return (
    <div className="[grid-area:1/1] space-y-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {groups.map((group, i) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, delay: i * 0.05 },
            }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          >
            {/* Framer Motion drives this element's own transform for the
                page-entrance slide, which as an inline style would silently
                win over a `hover:` class on the same node — so the hover
                lift lives on this separate, purely-CSS wrapper instead. */}
            <div className="rounded-card bg-cream p-7 shadow-card transition-transform duration-300 ease-out hover:-translate-y-1">
              <h3 className="text-lg font-medium text-ink">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {group.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {group.icons.map((icon) => (
                  <span
                    key={icon}
                    className="flex size-11 items-center justify-center rounded-full bg-surface"
                  >
                    <img src={icons[icon]} alt="" className="size-5" />
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
