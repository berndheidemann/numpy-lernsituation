import Navigation from '../components/common/Navigation'
import ShapeTransformer from '../components/visualizations/ShapeTransformer'
import MemoryLayoutViewer from '../components/visualizations/MemoryLayoutViewer'
import { useChapterTracking } from '../hooks/useChapterTracking'

const reshapeValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const reshapeShapes: [number, number][] = [
  [1, 12],
  [2, 6],
  [3, 4],
  [4, 3],
  [6, 2],
  [12, 1],
]

const memoryData = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90],
]

export default function ReshapeManipulation() {
  useChapterTracking('reshape-manipulation')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 6: Reshape & Manipulation</h1>
        <p className="text-slate-600 mb-6">
          Mit <code className="text-sm bg-slate-100 px-1 rounded">reshape</code>,{' '}
          <code className="text-sm bg-slate-100 px-1 rounded">transpose</code> und{' '}
          <code className="text-sm bg-slate-100 px-1 rounded">flatten</code> veränderst du die Form
          eines Arrays, ohne die Daten zu kopieren. Im SmartEnergy-Szenario:
          Stundendaten (8760,) in eine Tagesmatrix (365, 24) umstrukturieren.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Reshape interaktiv</h2>
          <p className="text-slate-600 mb-3">
            Ein Array mit 12 Elementen kann in verschiedene 2D-Formen gebracht werden.
            Klicke auf eine Shape, um die neue Anordnung zu sehen — die Speicherreihenfolge bleibt gleich:
          </p>
          <ShapeTransformer
            values={reshapeValues}
            shapes={reshapeShapes}
            label="np.arange(1, 13).reshape(...)"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Speicherordnung: C vs. Fortran</h2>
          <p className="text-slate-600 mb-3">
            NumPy speichert Arrays standardmäßig in <strong>C-Order</strong> (Zeile für Zeile).
            Mit <code className="text-sm bg-slate-100 px-1 rounded">order='F'</code> wird{' '}
            <strong>Fortran-Order</strong> (Spalte für Spalte) verwendet. Bewege die Maus über
            die Zellen, um die Zuordnung zwischen logischem Array und Speicher zu sehen:
          </p>
          <MemoryLayoutViewer
            data={memoryData}
            label="3×3 Array — Speicherlayout"
          />
        </section>
      </main>
    </div>
  )
}
