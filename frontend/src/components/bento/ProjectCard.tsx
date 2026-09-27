import { Link } from 'react-router-dom'

import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import { cn, noNativeDrag } from '@/lib/utils'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <BentoCard className={cn('@container', className)}>
      <div className="flex flex-1 flex-col justify-between p-4 @[10rem]:p-5 @[13rem]:p-6 @[16rem]:p-8">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-regular text-ink @[10rem]:text-base @[13rem]:text-lg @[16rem]:text-xl">
            {project.title}
          </h3>
          <p className="truncate text-[11px] text-muted @[13rem]:text-xs @[16rem]:text-sm">
            {project.subtitle}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 @[13rem]:mt-5 @[16rem]:mt-6">
          {/* Clips instead of pushing the arrow out when the icons don't fit. */}
          <div className="flex min-w-0 items-center overflow-hidden -space-x-1.5 @[16rem]:-space-x-2">
            {project.tech.map((tech) => (
              // A real border, not `ring`: a box-shadow ring on this composited
              // card flashes square corners mid-transition in Chromium. No local
              // transition utilities, so it keeps the global 400ms color fade.
              <span
                key={tech}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-cream bg-surface hover:bg-ink/10 @[10rem]:size-8 @[13rem]:size-10 @[13rem]:border-[3px] @[16rem]:size-12 @[16rem]:border-4 dark:hover:bg-white/10"
              >
                <img src={icons[tech]} alt="" className="size-3.5 @[10rem]:size-4 @[13rem]:size-5 @[16rem]:size-6" />
              </span>
            ))}
          </div>

          <Link
            to="/work"
            state={{ project: project.slug }}
            aria-label={`See ${project.title} on Work`}
            draggable={false}
            className={cn(
              'group/arrow flex size-7 shrink-0 items-center justify-center rounded-full bg-surface transition-colors hover:bg-ink @[10rem]:size-8 @[13rem]:size-10 @[16rem]:size-12 dark:hover:bg-white',
              noNativeDrag,
            )}
          >
            <img
              src={icons.arrow}
              alt=""
              draggable={false}
              className="size-3 transition-[filter] group-hover/arrow:invert @[13rem]:size-3.5 @[16rem]:size-4 dark:invert dark:group-hover/arrow:invert-0"
            />
          </Link>
        </div>
      </div>
    </BentoCard>
  )
}
