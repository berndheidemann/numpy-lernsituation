import Navigation from '../components/common/Navigation'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import IndexingHighlighter from '../components/visualizations/IndexingHighlighter'
import { useChapterTracking } from '../hooks/useChapterTracking'

const sampleData = [
  [10, 20, 30, 40, 50],
  [11, 22, 33, 44, 55],
  [12, 24, 36, 48, 60],
  [13, 26, 39, 52, 65],
]

export default function IndexingSlicing() {
  useChapterTracking('indexing-slicing')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 3: Indexing & Slicing</h1>
        <p className="text-slate-600 mb-6">
          Mit Indexing (Elementzugriff) und Slicing (Teilbereich-Zugriff) greifst du gezielt
          auf einzelne Werte oder ganze Bereiche eines Arrays zu. Im SmartEnergy-Szenario
          bedeutet das: den Verbrauch eines bestimmten Haushalts zu einer bestimmten Stunde extrahieren.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Array-Übersicht</h2>
          <p className="text-slate-600 mb-3">
            Unser Beispiel-Array — Verbrauchsdaten von 4 Haushalten über 5 Stunden (kWh):
          </p>
          <ArrayVisualizer data={sampleData} label="verbrauch — Shape (4, 5)" />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Interaktiver Slicing-Explorer</h2>
          <p className="text-slate-600 mb-3">
            Gib eine Slicing-Expression ein und beobachte, welche Elemente ausgewählt werden.
            Probiere z.B. <code className="text-sm bg-slate-100 px-1 rounded">1:3, 2:4</code> oder{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">:, 0</code>.
          </p>
          <IndexingHighlighter data={sampleData} label="Indexing-Highlighter" />
        </section>
      </main>
    </div>
  )
}
