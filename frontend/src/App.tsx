import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { Skills } from '@/pages/Skills'
import { Work } from '@/pages/Work'

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Work',
  '/skills': 'Skills',
}

function App() {
  const location = useLocation()
  const page = PAGE_LABELS[location.pathname] ?? 'Home'

  return (
    <AppShell page={page}>
      <div className="grid">
        {/* "wait" ensures the outgoing page's exit animation fully
            finishes — and unmounts — before the incoming page mounts, so
            the two grids (Home's small bento cards, Work's much larger
            project cards) never render on screen at the same time. */}
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/skills" element={<Skills />} />
          </Routes>
        </AnimatePresence>
      </div>
    </AppShell>
  )
}

export default App
