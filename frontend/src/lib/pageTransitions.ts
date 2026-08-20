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
// a physical, reorder-style push rather than a fade. They stay fully
// opaque throughout; the movement itself reads as "leaving".
export const scrollDownVariants = {
  initial: { y: -48 },
  // Same tightened spring as exit below, not the old stiffness 180 / damping
  // 20 / default mass 1 this used to have — those are essentially the same
  // numbers the exit spring had *before* the fix noted below, and had the
  // identical problem: floaty enough that, stacked behind the entrance
  // stagger above, the later cards in an 11-12 card page were still visibly
  // settling the better part of a second after the page mounted, reading as
  // a stuck/janky transition rather than a snappy one.
  animate: {
    y: 0,
    transition: { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.6 },
  },
  // A large-displacement spring like the old one (stiffness 140, damping
  // 18, default mass 1) doesn't fire onComplete until it crosses Framer
  // Motion's rest thresholds, which for a 240px throw took ~800ms+ even
  // though it looked visually settled well before that — long enough to
  // read as a stall before the next page appears. Tightened (higher
  // stiffness, added mass < 1) so it actually finishes fast without
  // losing the spring character.
  exit: {
    y: 240,
    transition: { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.6 },
  },
}
