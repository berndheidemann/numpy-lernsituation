import Navigation from '../components/common/Navigation'
import BadgeDisplay from '../components/common/BadgeDisplay'
import { useProgressStore } from '../store/progressStore'

const chapters = [
  { path: '/warum-numpy', chapterId: 'warum-numpy', title: '1. Warum NumPy?', description: 'Motivation: Python-Listen vs. NumPy-Arrays, Performance, Vektorisierung' },
  { path: '/array-grundlagen', chapterId: 'array-grundlagen', title: '2. Array-Grundlagen', description: 'Arrays erstellen, Dimensionen, Shape, Dtype' },
  { path: '/indexing-slicing', chapterId: 'indexing-slicing', title: '3. Indexing & Slicing', description: 'Elemente auswählen, Teilbereiche, Masken' },
  { path: '/array-operationen', chapterId: 'array-operationen', title: '4. Array-Operationen', description: 'Elementweise Operationen, Aggregationen, Vergleiche' },
  { path: '/broadcasting', chapterId: 'broadcasting', title: '5. Broadcasting', description: 'Automatische Dimensionserweiterung, Shape-Kompatibilität' },
  { path: '/reshape-manipulation', chapterId: 'reshape-manipulation', title: '6. Reshape & Manipulation', description: 'Form verändern, Transponieren, Verketten' },
  { path: '/statistische-auswertung', chapterId: 'statistische-auswertung', title: '7. Statistische Auswertung', description: 'Mittelwert, Standardabweichung, Korrelation, Ausreißer' },
  { path: '/praxisprojekt', chapterId: 'praxisprojekt', title: '8. Praxisprojekt', description: 'Vollständige Datenanalyse: Tarifvergleich bei SmartEnergy' },
]

export default function Home() {
  const chaptersState = useProgressStore((s) => s.chapters)
  const totalExercisesCompleted = useProgressStore((s) => s.totalExercisesCompleted)
  const badges = useProgressStore((s) => s.badges)

  const visitedCount = Object.values(chaptersState).filter((c) => c.visited).length

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden mb-12">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"
            alt="Data Analytics Dashboard"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40 flex items-center">
            <div className="px-8 md:px-12 max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                NumPy Lernplattform
              </h1>
              <p className="text-base md:text-lg text-slate-200">
                Lerne Array-basierte Datenverarbeitung mit NumPy — interaktiv, mit Live-Coding im Browser.
                Alle Beispiele basieren auf dem Szenario der <strong className="text-white">SmartEnergy GmbH</strong>.
              </p>
            </div>
          </div>
          <p className="absolute bottom-2 right-3 text-[10px] text-white/50">
            Photo by Luke Chesser on Unsplash
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8" data-testid="stats-bar">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{totalExercisesCompleted}/48</p>
            <p className="text-xs text-slate-500">Übungen gelöst</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{visitedCount}/8</p>
            <p className="text-xs text-slate-500">Kapitel besucht</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{badges.length}/11</p>
            <p className="text-xs text-slate-500">Badges verdient</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((chapter) => {
            const progress = chaptersState[chapter.chapterId]
            const completed = progress?.exercisesCompleted ?? 0
            const total = progress?.exercisesTotal ?? 0
            const ratio = total > 0 ? completed / total : 0

            return (
              <a
                key={chapter.path}
                href={`#${chapter.path}`}
                className="block bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    {chapter.title}
                    {progress?.visited && (
                      <span className="ml-2 text-xs text-slate-400">besucht</span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-500">{chapter.description}</p>
                  {total > 0 && (
                    <p className="text-xs text-slate-400 mt-2">{completed}/{total} Übungen</p>
                  )}
                </div>
                {total > 0 && (
                  <div className="h-1 bg-slate-100">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                )}
              </a>
            )
          })}
        </div>

        {/* Badge section */}
        <div className="mt-12">
          <BadgeDisplay />
        </div>
      </main>
    </div>
  )
}
