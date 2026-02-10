import { Link, useLocation } from 'react-router-dom'
import { useProgressStore } from '../../store/progressStore'

const navItems = [
  { path: '/', label: 'Start', chapterId: '' },
  { path: '/warum-numpy', label: '1. Warum NumPy?', chapterId: 'warum-numpy' },
  { path: '/array-grundlagen', label: '2. Grundlagen', chapterId: 'array-grundlagen' },
  { path: '/indexing-slicing', label: '3. Indexing', chapterId: 'indexing-slicing' },
  { path: '/array-operationen', label: '4. Operationen', chapterId: 'array-operationen' },
  { path: '/reshape-manipulation', label: '5. Reshape', chapterId: 'reshape-manipulation' },
  { path: '/broadcasting', label: '6. Broadcasting', chapterId: 'broadcasting' },
  { path: '/statistische-auswertung', label: '7. Statistik', chapterId: 'statistische-auswertung' },
  { path: '/praxisprojekt', label: '8. Praxis', chapterId: 'praxisprojekt' },
]

export default function Navigation() {
  const location = useLocation()
  const chapters = useProgressStore((s) => s.chapters)

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" aria-label="Hauptnavigation">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Zum Inhalt springen
      </a>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-6 overflow-x-auto">
          <Link to="/" className="font-bold text-blue-600 whitespace-nowrap shrink-0">
            NumPy Lernplattform
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {navItems.slice(1).map((item) => {
              const ch = item.chapterId ? chapters[item.chapterId] : undefined
              const isComplete = ch && ch.exercisesTotal > 0 && ch.exercisesCompleted >= ch.exercisesTotal

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {isComplete && (
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-green-500 shrink-0"
                      aria-label="Kapitel abgeschlossen"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
