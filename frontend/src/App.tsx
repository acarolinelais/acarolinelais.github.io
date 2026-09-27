import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { fallbackProjects } from '@/data/fallback'
import { Home } from '@/pages/Home'
import { Skills } from '@/pages/Skills'
import { Work } from '@/pages/Work'

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/skills': 'Skills',
}

// Warms the cache with Work's project previews once the current page has
// settled, so navigating to Work shows them immediately instead of starting
// the download (and decode) mid-transition. Idle-scheduled so it never
// competes with the background image or the first page's own assets.
function preloadProjectImages() {
  for (const project of fallbackProjects) {
    if (!project.image) continue
    const img = new Image()
    img.decoding = 'async'
    img.src = project.image
  }
}

function App() {
  const location = useLocation()
  const page = PAGE_LABELS[location.pathname] ?? 'Home'

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadProjectImages, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preloadProjectImages, 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <AppShell page={page}>
      <div className="grid">
        {/* "wait" ensures the outgoing page's exit animation fully
            finishes — and unmounts — before the incoming page mounts, so
            the two grids (Home's small bento cards, Work's much larger
            project cards) never render on screen at the same time. */}
        {/* reducedMotion="user": honours the OS "reduce motion" setting by
            skipping transform animations (fades still play). */}
        <MotionConfig reducedMotion="user">
          {/* Scroll resets only once the old page is gone, so the incoming
              page always enters from the top instead of mounting wherever
              the previous page happened to be scrolled to. */}
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/skills" element={<Skills />} />
            </Routes>
          </AnimatePresence>
        </MotionConfig>
      </div>
    </AppShell>
  )
}

export default App
