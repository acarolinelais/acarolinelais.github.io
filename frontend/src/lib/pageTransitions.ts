// Shared page entrance/exit choreography. Pages don't overlap (AnimatePresence
// runs in "wait" mode), so exits must finish quickly or the swap feels stalled.

// Kept tight since it runs after the previous page's exit.
// ReorderableGrid's `hasEntered` timer mirrors these values.
export const gridVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.035, delayChildren: 0.05 },
  },
  // Needed so the root's exit resolves and AnimatePresence can unmount.
  exit: {},
}

// The fade animates `--card-fade`, not `opacity`: an ancestor with opacity < 1
// becomes a backdrop root and the glass cards stop blurring mid-fade.
// `.card-fade` (index.css) applies it to each card's own layers instead.
export const scrollDownVariants = {
  initial: { y: -24, '--card-fade': 0 },
  animate: {
    y: 0,
    '--card-fade': 1,
    transition: {
      y: { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.6 },
      '--card-fade': { duration: 0.2, ease: 'easeOut' as const },
    },
  },
  // A tween, not a spring: a spring reports completion well after it looks
  // settled, which delays the next page.
  exit: {
    y: 32,
    '--card-fade': 0,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as const },
  },
}

// Work's project cards: fade-only and short, since their many backdrop-blur
// surfaces drop frames while animating.
export const fadeOnlyVariants = {
  initial: { '--card-fade': 0 },
  animate: {
    '--card-fade': 1,
    transition: { duration: 0.15, ease: 'easeOut' as const },
  },
  exit: {
    '--card-fade': 0,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
}
