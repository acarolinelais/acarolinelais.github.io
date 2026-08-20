import { cn } from '@/lib/utils'

interface IntroCardProps {
  className?: string
}

export function IntroCard({ className }: IntroCardProps) {
  return (
    <div
      className={cn(
        '@container relative transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      {/* Was on lg:/2xl: viewport breakpoints, which sized this card by the
          window rather than by the card — see the note in ContributionsCard. */}
      <div className="absolute inset-0 flex flex-col justify-center gap-1.5 overflow-hidden rounded-card bg-white/5 p-6 backdrop-blur-xl @[9.5rem]:gap-2 @[13rem]:gap-2.5 @[13rem]:p-7 @[16.25rem]:gap-2.5 @[16.25rem]:p-8 @[20rem]:gap-2.5 @[20rem]:p-10 dark:bg-black/5">
        <span className="text-[10px] font-regular text-white @[9.5rem]:text-[11px] @[13rem]:text-base @[16.25rem]:text-xl @[20rem]:text-2xl">
          Hi, I'm Caroline
        </span>
        {/*
         * `max-w` in `em` — not px, not a breakpoint ladder — is what fixes
         * the paragraph at four lines. Where the text wraps depends on how
         * many *characters* fit per line, and an em-based measure scales with
         * the font, so the same 10.5em cap produces the same four-line break
         * at every card size:
         *   A software developer / and designer blending /
         *   technology and / creativity.
         * The font sizes below are then the largest each tier can take while
         * still leaving room for that cap to apply — above them the cap stops
         * binding, the lines get shorter, and the paragraph spills to five.
         * The first step is at 9.5rem rather than the 10rem the other cards
         * use because a 375px phone lands on a 159.5px card, just under
         * 10rem, which would otherwise drop it a whole tier.
         */}
        <p className="max-w-[10.5em] text-[10px] font-regular leading-[1.20] text-white @[9.5rem]:text-[13px] @[13rem]:text-base @[16.25rem]:text-xl @[20rem]:text-2xl">
          A software developer and designer blending technology and creativity.
        </p>
      </div>
      <div className="border-ring pointer-events-none absolute inset-0 rounded-card" />
    </div>
  )
}
