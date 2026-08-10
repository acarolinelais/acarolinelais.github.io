import { icons } from '@/assets/icons'
import { ContactDialog } from '@/components/ContactDialog'
import { cn } from '@/lib/utils'
import type { SocialLink } from '@/types/content'

interface SocialGridCardProps {
  socials: SocialLink[]
  className?: string
}

const tileClass =
  'flex items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25'

export function SocialGridCard({ socials, className }: SocialGridCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-card border border-white/20 bg-black/5 backdrop-blur-lg',
        className,
      )}
    >
      <div className="grid size-full grid-cols-2 grid-rows-2 gap-4 p-6">
        {socials.map((social) =>
          social.icon === 'mail' ? (
            <ContactDialog key={social.id}>
              <button
                type="button"
                aria-label={social.label}
                className={tileClass}
              >
                <img src={icons.mail} alt="" className="size-8 invert" />
              </button>
            </ContactDialog>
          ) : (
            <a
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className={tileClass}
            >
              <img src={icons[social.icon]} alt="" className="size-8 invert" />
            </a>
          ),
        )}
      </div>
    </div>
  )
}
