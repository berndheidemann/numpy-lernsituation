import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import ErrorBoundary from './components/common/ErrorBoundary'
import BadgeNotification from './components/common/BadgeNotification'

const Home = lazy(() => import('./pages/Home'))
const WarumNumpy = lazy(() => import('./pages/WarumNumpy'))
const ArrayGrundlagen = lazy(() => import('./pages/ArrayGrundlagen'))
const IndexingSlicing = lazy(() => import('./pages/IndexingSlicing'))
const ArrayOperationen = lazy(() => import('./pages/ArrayOperationen'))
const Broadcasting = lazy(() => import('./pages/Broadcasting'))
const ReshapeManipulation = lazy(() => import('./pages/ReshapeManipulation'))
const StatistischeAuswertung = lazy(() => import('./pages/StatistischeAuswertung'))
const Praxisprojekt = lazy(() => import('./pages/Praxisprojekt'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-slate-500">Seite wird geladen...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary context="App">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/warum-numpy" element={<WarumNumpy />} />
          <Route path="/array-grundlagen" element={<ArrayGrundlagen />} />
          <Route path="/indexing-slicing" element={<IndexingSlicing />} />
          <Route path="/array-operationen" element={<ArrayOperationen />} />
          <Route path="/broadcasting" element={<Broadcasting />} />
          <Route path="/reshape-manipulation" element={<ReshapeManipulation />} />
          <Route path="/statistische-auswertung" element={<StatistischeAuswertung />} />
          <Route path="/praxisprojekt" element={<Praxisprojekt />} />
        </Routes>
      </Suspense>
      <BadgeNotification />
      <footer className="border-t border-slate-200 bg-slate-50 mt-12 py-6 px-4 text-center text-xs text-slate-500">
        <p>
          Diese Seite ist Teil einer schulischen Lernsituation im Bildungsgang
          Fachinformatiker/in &ndash; Anwendungsentwicklung am Schulzentrum Utbremen, Bremen.
        </p>
        <p className="mt-1">
          Verantwortlich im Sinne des &sect;&nbsp;5 DDG ist das Schulzentrum Utbremen.
          Vollständiges Impressum:{' '}
          <a
            href="https://www.szut.de/impressum.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.szut.de/impressum.html
          </a>
        </p>
        <p className="mt-1">
          Diese Seite dient ausschließlich der schulischen Ausbildung und verfolgt keine kommerziellen Zwecke.
        </p>
      </footer>
    </ErrorBoundary>
  )
}
