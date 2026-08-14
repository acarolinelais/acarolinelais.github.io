import { icons } from '@/assets/icons'
import { BentoCard } from '@/components/bento/BentoCard'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <BentoCard className={className}>
      <div className="flex flex-1 flex-col justify-between p-8">
        <div>
          <h3 className="text-xl font-regular text-ink">{project.title}</h3>
          <p className="text-sm text-muted">{project.subtitle}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="flex size-12 items-center justify-center rounded-full bg-surface ring-4 ring-cream transition-colors duration-300 hover:bg-ink/10 dark:hover:bg-white/10"
              >
                <img src={icons[tech]} alt="" className="size-6" />
              </span>
            ))}
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
              className="group/arrow flex size-10 items-center justify-center rounded-full bg-surface transition-colors hover:bg-ink dark:hover:bg-white"
            >
              <img
                src={icons.arrow}
                alt=""
                className="size-4 transition-[filter] group-hover/arrow:invert dark:invert dark:group-hover/arrow:invert-0"
              />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-label="No link available"
              className="group/arrow flex size-12 items-center justify-center rounded-full bg-surface transition-colors hover:bg-ink dark:hover:bg-white"
            >
              <img
                src={icons.arrow}
                alt=""
                className="size-4 transition-[filter] group-hover/arrow:invert dark:invert dark:group-hover/arrow:invert-0"
              />
            </button>
          )}
        </div>
      </div>
    </BentoCard>
  )
}
