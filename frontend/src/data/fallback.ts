import { images } from '@/assets/images'
import type { Project, SkillGroup, SocialLink } from '@/types/content'

/**
 * Local fallback content, used whenever the FastAPI backend is unreachable
 * (e.g. static hosting with no API deployed yet). Mirrors the shape the
 * backend returns so pages render identically either way.
 */
export const fallbackProjects: Project[] = [
  {
    slug: 'maestro',
    title: 'Architech',
    subtitle: 'Tech Blog',
    description:
      'Architech is a personal blog where I share posts explaining programming concepts and lessons learned in a simple, practical way. The front-end was built with React, the back-end with Python, and the data is stored in a PostgreSQL database. Besides helping people who are learning, the project is also my space to put what I study into practice.',
    tech: ['react', 'python', 'postgresql'],
    link: null,
    status: 'in-progress',
    image: images.architechProject,
  },
  {
    slug: 'byterise',
    title: 'Lendora',
    subtitle: 'Mortgage Dashboard',
    description:
      'Lendora is a modern dashboard UI for mortgage advisors that combines rate analytics, client tracking, and performance insights. Designed to help users streamline loan workflows, manage leads, and collaborate through a built-in community space.',
    tech: ['react', 'python'],
    link: null,
    status: 'in-progress',
    image: images.lendoraProject,
  },
  {
    slug: 'coming-soon',
    title: 'Maestro',
    subtitle: 'Developer Tool',
    description: 'Another project slot, reserved for what comes next.',
    tech: ['python', 'react'],
    link: null,
    status: 'coming-soon',
  },
  {
    slug: 'careops',
    title: 'CareOps',
    subtitle: 'ERP Platform',
    description:
      'CareOps is built to help medical centers take full control over their administrative and operational processes - from finances and staffing to scheduling and inventory. Instead of juggling multiple tools, teams get a unified system designed specifically for healthcare workflows.',
    tech: ['python', 'react', 'postgresql', 'tailwind'],
    link: null,
    status: 'coming-soon',
  },
]

export const fallbackSkillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description:
      'Interfaces, design systems and interactions built with React and Tailwind CSS.',
    icons: ['react', 'typescript', 'javascript', 'css3', 'html5', 'figma', 'tailwind'],
  },
  {
    id: 'backend',
    title: 'Backend & Automation',
    description:
      'APIs, automation scripts and tests written in Python.',
    icons: ['python', 'git', 'postgresql', 'docker', 'nodeJs'],
  },
]

export const fallbackSocials: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/carolinelais', icon: 'linkedin' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/acarolinelais', icon: 'instagram' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/acarolinelais', icon: 'github' },
  { id: 'mail', label: 'Email', href: 'mailto:carolinelaisgs@gmail.com', icon: 'mail' },
]
