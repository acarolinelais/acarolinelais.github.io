import { BentoCard } from '@/components/bento/BentoCard'

interface IconShowcaseCardProps {
  icon: string
  className?: string
}

export function IconShowcaseCard({ icon, className }: IconShowcaseCardProps) {
  return (
    <BentoCard className={className}>
      <div className="flex flex-1 items-center justify-center p-6">
        <img src={icon} alt="" aria-hidden className="size-12 object-contain" />
      </div>
    </BentoCard>
  )
}
