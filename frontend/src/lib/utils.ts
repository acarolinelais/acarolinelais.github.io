import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// With draggable={false}, stops native drag/callout from hijacking the
// grid's drag gesture on images and links inside cards.
export const noNativeDrag = 'select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]'

export function preloadImage(src: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  return img
}
