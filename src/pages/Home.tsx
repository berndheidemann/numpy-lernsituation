import Navigation from '../components/common/Navigation'

const chapters = [
  { path: '/warum-numpy', title: '1. Warum NumPy?', description: 'Motivation: Python-Listen vs. NumPy-Arrays, Performance, Vektorisierung' },
  { path: '/array-grundlagen', title: '2. Array-Grundlagen', description: 'Arrays erstellen, Dimensionen, Shape, Dtype' },
  { path: '/indexing-slicing', title: '3. Indexing & Slicing', description: 'Elemente auswählen, Teilbereiche, Masken' },
  { path: '/array-operationen', title: '4. Array-Operationen', description: 'Elementweise Operationen, Aggregationen, Vergleiche' },
  { path: '/broadcasting', title: '5. Broadcasting', description: 'Automatische Dimensionserweiterung, Shape-Kompatibilität' },
  { path: '/reshape-manipulation', title: '6. Reshape & Manipulation', description: 'Form verändern, Transponieren, Verketten' },
  { path: '/statistische-auswertung', title: '7. Statistische Auswertung', description: 'Mittelwert, Standardabweichung, Korrelation, Ausreißer' },
  { path: '/praxisprojekt', title: '8. Praxisprojekt', description: 'Vollständige Datenanalyse: Tarifvergleich bei SmartEnergy' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            NumPy Lernplattform
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Lerne Array-basierte Datenverarbeitung mit NumPy — interaktiv, mit Live-Coding im Browser.
            Alle Beispiele basieren auf dem Szenario der <strong>SmartEnergy GmbH</strong>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((chapter) => (
            <a
              key={chapter.path}
              href={`#${chapter.path}`}
              className="block p-6 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {chapter.title}
              </h2>
              <p className="text-sm text-slate-500">{chapter.description}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
