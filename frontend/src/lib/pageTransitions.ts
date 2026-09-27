// Shared entrance/exit choreography for the Home and Work grids, so both
// pages read as the same physical motion language. AnimatePresence runs in
// "wait" mode (see App.tsx), so the outgoing page always fully unmounts
// before the incoming one mounts — these variants never actually overlap
// on screen, but the exit still needs to resolve quickly or the wait would
// be felt as a stall between pages.

// Orchestrates the organic, staggered entrance for every card when a page
// mounts, whichever page you're arriving from. Kept tight (small delay, small
// per-card step) because it's fully sequential with the previous page's exit
// (see AnimatePresence's "wait" mode in App.tsx) — on an 11-12 card page like
// Home or Skills, the old 0.08s delay + 0.06s/card step alone pushed the last
// card's animation past 600ms before it had even *started*, on top of the
// exit and the spring settle after it. That's what read as a delay before
// cards showed up.
export const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.035, delayChildren: 0.05 },
  },
  // Framer Motion only resolves an exit as "complete" — letting
  // AnimatePresence unmount the tree — once every motion component that
  // declares `exit` reaches its target. Without this key, the root's own
  // `exit="exit"` pointed at nothing, so its own exit lingered, delaying
  // the next page's mount well past the point its children had actually
  // finished animating out.
  exit: {},
}

// Every card, including the project cards, falls away the same quiet way —
// a short downward push that fades as it goes, so the page "sinks" out
// instead of sliding 240px fully opaque and then vanishing in one frame at
// unmount (that hard cut was the harshest part of the old transition).
//
// The fade animates `--card-fade`, not `opacity`: an ancestor with
// opacity < 1 becomes a "backdrop root", so every backdrop-blur-xl surface
// inside it stops blurring the page background for the whole fade and the
// glass cards visibly flicker. The variable is inherited and applied (see
// `card-fade` in index.css) to each card's own layers — the blurred surface
// itself, its border-ring sibling, badges — where opacity is safe.
export const scrollDownVariants = {
  initial: { y: -24, '--card-fade': 0 },
  // Same tightened spring as exit below, not the old stiffness 180 / damping
  // 20 / default mass 1 this used to have — those are essentially the same
  // numbers the exit spring had *before* the fix noted below, and had the
  // identical problem: floaty enough that, stacked behind the entrance
  // stagger above, the later cards in an 11-12 card page were still visibly
  // settling the better part of a second after the page mounted, reading as
  // a stuck/janky transition rather than a snappy one.
  // The fade rides a short tween alongside the spring so each card is fully
  // visible within ~200ms of its turn in the stagger, while `y` keeps its
  // physical settle.
  animate: {
    y: 0,
    '--card-fade': 1,
    transition: {
      y: { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.6 },
      '--card-fade': { duration: 0.2, ease: 'easeOut' as const },
    },
  },
  // A tween rather than a spring: AnimatePresence's "wait" mode holds the
  // next page until this completes, and a spring only reports completion
  // once it crosses Framer Motion's rest thresholds — well after it looks
  // settled, which read as a stall between pages. A fixed 180ms ease-in
  // ends exactly when it looks like it ends. Short distance + fade so
  // nothing is still visibly on screen when the tree unmounts.
  exit: {
    y: 32,
    '--card-fade': 0,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  },
}
