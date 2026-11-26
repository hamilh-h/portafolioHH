import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IdiomaProvider } from './lib/i18n'
import Inicio from './pages/Inicio'
import Proyecto from './pages/Proyecto'
const Admin = lazy(() => import('./pages/Admin'))
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IdiomaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/proyecto/:slug" element={<Proyecto />} />
          <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </BrowserRouter>
    </IdiomaProvider>
  </StrictMode>,
)
