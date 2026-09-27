import { icons } from '@/assets/icons'
import { ContactDialog } from '@/components/ContactDialog'
import { cn } from '@/lib/utils'
import type { SocialLink } from '@/types/content'

interface SocialGridCardProps {
  socials: SocialLink[]
  className?: string
}

// select-none + no native drag/callout on the tiles *and* their icons: this
// card is drag-reorderable, and a press-and-hold that starts on a tile
// otherwise begins the browser's own link/image drag (or text selection,
// or the touch save/open callout) instead of the grid's gesture — see the
// same treatment on CircleImageBadge's avatar.
const noNativeDrag = 'select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]'

const tileClass = cn(
  'flex items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25',
  noNativeDrag,
)

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
                  <img src={icons.mail} alt="" draggable={false} className={cn('size-5 invert @[10rem]:size-6 @[16rem]:size-8', noNativeDrag)} />
                </button>
              </ContactDialog>
            ) : (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                draggable={false}
                className={tileClass}
              >
                <img src={icons[social.icon]} alt="" draggable={false} className={cn('size-5 invert @[10rem]:size-6 @[16rem]:size-8', noNativeDrag)} />
              </a>
            ),
          )}
        </div>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
