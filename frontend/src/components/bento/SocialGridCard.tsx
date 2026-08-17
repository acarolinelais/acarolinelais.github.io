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
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden rounded-card bg-white/5 backdrop-blur-xl dark:bg-black/5">
        <div className="grid size-full grid-cols-2 grid-rows-2 gap-2 p-3 @[10rem]:gap-3 @[10rem]:p-4 @[16rem]:gap-4 @[16rem]:p-6">
          {socials.map((social) =>
            social.icon === 'mail' ? (
              <ContactDialog key={social.id}>
                <button
                  type="button"
                  aria-label={social.label}
                  className={tileClass}
                >
                  <img src={icons.mail} alt="" className="size-5 invert @[10rem]:size-6 @[16rem]:size-8" />
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
                <img src={icons[social.icon]} alt="" className="size-5 invert @[10rem]:size-6 @[16rem]:size-8" />
              </a>
            ),
          )}
        </div>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
