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
        <AnimatePresence mode="sync" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home destination={location.pathname} />} />
            <Route path="/work" element={<Work />} />
            <Route path="/skills" element={<Skills />} />
          </Routes>
        </AnimatePresence>
      </div>
    </AppShell>
  )
}

export default App
