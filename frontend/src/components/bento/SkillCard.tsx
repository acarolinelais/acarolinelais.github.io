import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import { cn } from '@/lib/utils'
import type { SkillGroup } from '@/types/content'

interface SkillCardProps {
  group: SkillGroup
  className?: string
}

// Container-queried rather than viewport-queried — see the note in
// ContributionsCard for why card width doesn't track the viewport.
export function SkillCard({ group, className }: SkillCardProps) {
  return (
    <BentoCard className={cn('@container', className)}>
      <div className="flex flex-1 flex-col justify-between p-4 @[10rem]:p-5 @[13rem]:p-6 @[16rem]:p-8">
        <div>
          <h3 className="text-sm font-regular text-ink @[10rem]:text-base @[13rem]:text-lg @[16rem]:text-xl">
            {group.title}
          </h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted @[13rem]:mt-2 @[13rem]:text-xs @[16rem]:text-sm">
            {group.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 @[13rem]:mt-5 @[13rem]:gap-2 @[16rem]:gap-3">
          {group.icons.map((icon) => (
            <span
              key={icon}
              className="flex size-7 items-center justify-center rounded-full bg-surface @[10rem]:size-8 @[13rem]:size-9 @[16rem]:size-11"
            >
              <img src={icons[icon]} alt="" className="size-3.5 @[13rem]:size-4 @[16rem]:size-5" />
            </span>
          ))}
        </div>
      </div>
    </BentoCard>
  )
}
