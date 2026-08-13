import { icons } from '@/assets/icons'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/content'

const STATUS_LABEL: Record<Project['status'], string> = {
  live: 'Live',
  'in-progress': 'In progress',
  'coming-soon': 'Coming soon',
}

export function WorkProjectCard({ project }: { project: Project }) {
  return (
    <article className="relative rounded-card shadow-card transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="flex flex-col rounded-card bg-white/5 p-10 backdrop-blur-xl dark:bg-black/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-medium text-white">{project.title}</h3>
            <p className="mt-1 text-sm text-white/60">{project.subtitle}</p>
          </div>
          {!project.image && (
            <Badge variant="soft" className="bg-white/10 text-white">
              {STATUS_LABEL[project.status]}
            </Badge>
          )}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-white/80">
          {project.description}
        </p>

        {project.image && (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            className="mt-6 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center -space-x-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="flex size-9 items-center justify-center rounded-full bg-surface ring-4 ring-cream"
              >
                <img src={icons[tech]} alt="" className="size-4" />
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
              className="group/arrow flex size-10 items-center justify-center rounded-full bg-surface opacity-50 transition-colors hover:bg-ink hover:opacity-100 dark:hover:bg-white"
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
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </article>
  )
}
