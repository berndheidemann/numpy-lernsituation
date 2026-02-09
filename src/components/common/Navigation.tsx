import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Start' },
  { path: '/warum-numpy', label: '1. Warum NumPy?' },
  { path: '/array-grundlagen', label: '2. Grundlagen' },
  { path: '/indexing-slicing', label: '3. Indexing' },
  { path: '/array-operationen', label: '4. Operationen' },
  { path: '/broadcasting', label: '5. Broadcasting' },
  { path: '/reshape-manipulation', label: '6. Reshape' },
  { path: '/statistische-auswertung', label: '7. Statistik' },
  { path: '/praxisprojekt', label: '8. Praxis' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50" aria-label="Hauptnavigation">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-6 overflow-x-auto">
          <Link to="/" className="font-bold text-blue-600 whitespace-nowrap shrink-0">
            NumPy Lernplattform
          </Link>
          <div className="flex gap-1 overflow-x-auto">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
