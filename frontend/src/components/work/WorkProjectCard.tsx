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
            <h3 className="text-xl font-regular text-white">{project.title}</h3>
            <p className="mt-0.5 text-sm text-white/60">{project.subtitle}</p>
          </div>
          {!project.image && (
            <Badge variant="soft" className="bg-white/10 text-white dark:bg-black/10">
              {STATUS_LABEL[project.status]}
            </Badge>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/80">
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
          <div className="flex items-center gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="group/tech relative flex size-10 items-center justify-center rounded-full"
              >
                <span className="absolute inset-0 rounded-full bg-white/15 backdrop-blur-xl transition-colors duration-300 group-hover/tech:bg-white/20 dark:bg-black/10 dark:group-hover/tech:bg-black/20" />
                <img src={icons[tech]} alt="" className="relative size-5" />
              </span>
            ))}
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
              className="group/arrow relative flex size-10 items-center justify-center rounded-full"
            >
              <span className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-xl transition-colors duration-300 group-hover/arrow:bg-white/15 dark:bg-black/10 dark:group-hover/arrow:bg-black/20" />
              <span className="border-ring pointer-events-none absolute inset-0 rounded-full" />
              <img src={icons.arrow} alt="" className="relative size-4 invert" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-label="No link available"
              className="group/arrow relative flex size-10 items-center justify-center rounded-full"
            >
              <span className="absolute inset-0 rounded-full bg-white/15 backdrop-blur-xl transition-colors duration-300 group-hover/arrow:bg-white/50 dark:bg-black/10 dark:group-hover/arrow:bg-black/30" />
              <img src={icons.arrow} alt="" className="relative size-3.5 invert" />
            </button>
          )}
        </div>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </article>
  )
}
