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
    <div className="space-y-10">
      <div className="max-w-xl space-y-3 text-[#17151b] [text-shadow:0_1px_16px_rgba(255,255,255,0.5)]">
        <h1 className="text-3xl font-medium">Skills</h1>
        <p className="text-[#4a4750]">
          Frontend interfaces and backend automation, held together by clean,
          well-tested code.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.id}
            className="rounded-card bg-cream p-7 shadow-card"
          >
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
          </article>
        ))}
      </div>
    </div>
  )
}
