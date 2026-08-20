import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  className?: string
}

// Shared by both branches of the link/no-link fork below so the two can't
// drift apart again (they had ended up size-10 vs size-12).
const actionClass =
  'group/arrow flex size-7 shrink-0 items-center justify-center rounded-full bg-surface transition-colors hover:bg-ink @[10rem]:size-8 @[13rem]:size-10 @[16rem]:size-12 dark:hover:bg-white'
const actionIconClass =
  'size-3 transition-[filter] group-hover/arrow:invert @[13rem]:size-3.5 @[16rem]:size-4 dark:invert dark:group-hover/arrow:invert-0'

// Container-queried rather than viewport-queried — see the note in
// ContributionsCard for why card width doesn't track the viewport.
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
          {/* min-w-0 + overflow-hidden: a project with four tech icons can't
              fit beside the action button on a phone-width card, so the
              stack clips at its own edge instead of pushing the button out. */}
          <div className="flex min-w-0 items-center overflow-hidden -space-x-1.5 @[16rem]:-space-x-2">
            {project.tech.map((tech) => (
              // A real `border`, not `ring` (box-shadow): animating a
              // box-shadow-based ring together with border-radius on a
              // composited element (this card already promotes a layer via
              // the hover -translate-y-1 on BentoCard) is a known Chromium
              // rasterization bug — the shadow briefly paints to its
              // rectangular bounds before the rounded clip catches up,
              // flashing square corners mid-transition. A real border always
              // clips to border-radius, transition or not.
              //
              // Also no local `transition-colors`/`duration-*`: those
              // utilities have higher specificity than the sitewide `*` rule
              // in index.css and would replace its transition-property
              // outright rather than extend it, putting this badge's fade on
              // a different clock (300ms) than the rest of the page (400ms).
              // Falling back to the global rule keeps the border, hover
              // fill, and every other color-mode fade in sync.
              <span
                key={tech}
                className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-cream bg-surface hover:bg-ink/10 @[10rem]:size-8 @[13rem]:size-10 @[13rem]:border-[3px] @[16rem]:size-12 @[16rem]:border-4 dark:hover:bg-white/10"
              >
                <img src={icons[tech]} alt="" className="size-3.5 @[10rem]:size-4 @[13rem]:size-5 @[16rem]:size-6" />
              </span>
            ))}
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
              className={actionClass}
            >
              <img src={icons.arrow} alt="" className={actionIconClass} />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-label="No link available"
              className={actionClass}
            >
              <img src={icons.arrow} alt="" className={actionIconClass} />
            </button>
          )}
        </div>
      </div>
    </BentoCard>
  )
}
