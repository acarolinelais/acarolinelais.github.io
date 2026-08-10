import type { Project, SkillGroup, SocialLink } from '@/types/content'

/**
 * Local fallback content, used whenever the FastAPI backend is unreachable
 * (e.g. static hosting with no API deployed yet). Mirrors the shape the
 * backend returns so pages render identically either way.
 */
export const fallbackProjects: Project[] = [
  {
    slug: 'maestro',
    title: 'Maestro',
    subtitle: 'Developer Tool',
    description:
      'A developer tool built with Python and React. More details coming soon.',
    tech: ['python', 'react'],
    link: null,
    status: 'in-progress',
  },
  {
    slug: 'byterise',
    title: 'ByteRise',
    subtitle: 'Crypto Extend',
    description:
      'A crypto-focused extension built with Python and React. More details coming soon.',
    tech: ['python', 'react'],
    link: null,
    status: 'in-progress',
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
    icons: ['react', 'tailwind'],
  },
  {
    id: 'backend',
    title: 'Backend & Automation',
    description:
      'APIs, automation scripts and tests written in Python.',
    icons: ['python', 'codeMerge'],
  },
]

export const fallbackSocials: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/carolinelais', icon: 'linkedin' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/acarolinelais', icon: 'instagram' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/acarolinelais', icon: 'github' },
  { id: 'mail', label: 'Email', href: 'mailto:carolinelaisgs@gmail.com', icon: 'mail' },
]
