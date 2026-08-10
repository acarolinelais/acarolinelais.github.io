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
    <article className="flex flex-col justify-between rounded-card bg-cream p-7 shadow-card transition-transform duration-300 ease-out hover:-translate-y-1">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-medium text-ink">{project.title}</h3>
            <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
          </div>
          <Badge variant="soft">{STATUS_LABEL[project.status]}</Badge>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          {project.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center -space-x-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="flex size-9 items-center justify-center rounded-full bg-surface ring-4 ring-white"
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
            className="flex size-10 items-center justify-center rounded-full bg-surface transition-colors hover:bg-ink"
          >
            <img src={icons.arrow} alt="" className="size-4" />
          </a>
        ) : (
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-full bg-surface opacity-50"
          >
            <img src={icons.arrow} alt="" className="size-4" />
          </span>
        )}
      </div>
    </article>
  )
}
