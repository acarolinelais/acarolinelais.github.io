import { Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { Skills } from '@/pages/Skills'
import { Work } from '@/pages/Work'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell page="Home">
            <Home />
          </AppShell>
        }
      />
      <Route
        path="/work"
        element={
          <AppShell page="Work">
            <Work />
          </AppShell>
        }
      />
      <Route
        path="/skills"
        element={
          <AppShell page="Skills">
            <Skills />
          </AppShell>
        }
      />
    </Routes>
  )
}

export default App
