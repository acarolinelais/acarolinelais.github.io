import { AnimatePresence, MotionConfig } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { Skills } from '@/pages/Skills'
import { preloadWorkImages, Work } from '@/pages/Work'

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/skills': 'Skills',
}

function App() {
  const location = useLocation()
  const page = PAGE_LABELS[location.pathname] ?? 'Home'

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadWorkImages, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(preloadWorkImages, 1500)
    return () => clearTimeout(id)
  }, [])

  return (
    <AppShell page={page}>
      <div className="grid">
        <MotionConfig reducedMotion="user">
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
