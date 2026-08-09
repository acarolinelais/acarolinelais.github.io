import type { IconName } from '@/assets/icons'

export type TechIconName = Extract<
  IconName,
  'python' | 'react' | 'tailwind' | 'cryptoWallet' | 'codeMerge'
>

export interface Project {
  slug: string
  title: string
  subtitle: string
  description: string
  tech: TechIconName[]
  link: string | null
  status: 'live' | 'in-progress' | 'coming-soon'
}

export interface SkillGroup {
  id: string
  title: string
  description: string
  icons: IconName[]
}

export interface SocialLink {
  id: string
  label: string
  href: string
  icon: Extract<IconName, 'linkedin' | 'instagram' | 'github' | 'mail'>
}
