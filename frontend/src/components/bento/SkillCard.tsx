import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import type { SkillGroup } from '@/types/content'

interface SkillCardProps {
  group: SkillGroup
  className?: string
}

export function SkillCard({ group, className }: SkillCardProps) {
  return (
    <BentoCard className={className}>
      <div className="flex flex-1 flex-col justify-between p-8">
        <div>
          <h3 className="text-xl font-regular text-ink">{group.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {group.description}
          </p>
        </div>
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
    </BentoCard>
  )
}
