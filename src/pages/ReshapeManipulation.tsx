import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import Lueckentext from '../components/common/Lueckentext'
import ShapeTransformer from '../components/visualizations/ShapeTransformer'
import MemoryLayoutViewer from '../components/visualizations/MemoryLayoutViewer'
import ShapePredictor from '../components/exercises/ShapePredictor'
import CodingExercise from '../components/exercises/CodingExercise'
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

        {/* --- Theorie: reshape, flatten, transpose --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Reshape-Funktionen im Überblick</h2>
          <p className="text-slate-600 mb-3">
            <code className="text-sm bg-slate-100 px-1 rounded">reshape</code> ändert die Form,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">flatten</code>/<code className="text-sm bg-slate-100 px-1 rounded">ravel</code> machen
            ein Array 1D, und <code className="text-sm bg-slate-100 px-1 rounded">transpose</code> (oder{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">.T</code>) vertauscht Zeilen und Spalten.
            Mit <code className="text-sm bg-slate-100 px-1 rounded">-1</code> in reshape lässt du NumPy eine Dimension
            automatisch berechnen.
          </p>
          <CodeBlock
            title="Reshape-Operationen"
            code={`import numpy as np

stunden = np.arange(168)  # 7 Tage × 24 Stunden

# Reshape: 1D → 2D (Tagesmatrix)
woche = stunden.reshape(7, 24)   # Shape: (7, 24)

# -1 als Platzhalter: NumPy berechnet die fehlende Dimension
auto = stunden.reshape(-1, 24)   # Shape: (7, 24) — 168/24 = 7

# Flatten: 2D → 1D (Kopie)
flach = woche.flatten()          # Shape: (168,)

# Ravel: 2D → 1D (View, wenn möglich)
flach_view = woche.ravel()       # Shape: (168,)

# Transpose: Zeilen ↔ Spalten
transponiert = woche.T           # Shape: (24, 7)

# Concatenate und Stack
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
print(np.concatenate([a, b], axis=0).shape)  # (4, 2)
print(np.stack([a, b], axis=0).shape)        # (2, 2, 2)`}
          />
        </section>

        {/* --- Übung 1: ShapePredictor — Reshape --- */}
        <ShapePredictor
          id="reshape-shape-1"
          title="Shape vorhersagen: Tagesmatrix"
          context="stunden = np.arange(8760)  # 365 Tage × 24 Stunden"
          operation="tage = stunden.reshape(365, 24)"
          expectedShape={[365, 24]}
          explanation="8760 Stunden werden in 365 Zeilen (Tage) × 24 Spalten (Stunden) umgeformt."
        />

        {/* --- Übung 2: ShapePredictor — Reshape mit -1 --- */}
        <ShapePredictor
          id="reshape-shape-2"
          title="Shape vorhersagen: Automatische Dimension"
          context="data = np.arange(12)"
          operation="ergebnis = data.reshape(4, -1)"
          expectedShape={[4, 3]}
          explanation="12 / 4 = 3 — NumPy berechnet die fehlende Dimension automatisch → (4, 3)."
        />

        {/* --- Übung 3: Lückentext --- */}
        <Lueckentext
          id="reshape-lueckentext"
          segments={[
            'import numpy as np\n\ndata = np.arange(12)\n\n# Umformen in eine 3×4-Matrix\nmatrix = data.',
            { id: 'func', answer: 'reshape', hint: 'Welche Methode ändert die Form eines Arrays?' },
            '(',
            { id: 'rows', answer: '3', hint: 'Wie viele Zeilen hat die Matrix?' },
            ', ',
            { id: 'cols', answer: '4', hint: 'Wie viele Spalten hat die Matrix?' },
            ')\n\n# Transponieren (Zeilen ↔ Spalten)\ntransponiert = matrix.',
            { id: 'trans', answer: 'T', hint: 'Kurzes Attribut für transpose?' },
          ]}
        />

        {/* --- Übung 4: CodingExercise — Wochendaten reshapen --- */}
        <CodingExercise
          id="reshape-coding"
          title="Wochendaten umstrukturieren"
          description="Du hast 168 Stundenwerte (eine Woche). Forme sie in eine Tagesmatrix (7×24) um und berechne den Durchschnittsverbrauch pro Tag (axis=1)."
          starterCode={`import numpy as np

# 168 Stundenwerte (7 Tage × 24 Stunden)
np.random.seed(42)
stunden = np.random.uniform(5, 25, size=168)
print("Original-Shape:", stunden.shape)

# 1. Reshape zu (7, 24) — 7 Tage × 24 Stunden
woche = # Dein Code hier
print("Woche-Shape:", woche.shape)

# 2. Durchschnittsverbrauch pro Tag (Mittelwert über die 24 Stunden)
tages_mittel = # Dein Code hier
print("Tagesmittel:", np.round(tages_mittel, 2))
print("Anzahl Tage:", len(tages_mittel))`}
          solution={`import numpy as np

np.random.seed(42)
stunden = np.random.uniform(5, 25, size=168)
print("Original-Shape:", stunden.shape)

woche = stunden.reshape(7, 24)
print("Woche-Shape:", woche.shape)

tages_mittel = np.mean(woche, axis=1)
print("Tagesmittel:", np.round(tages_mittel, 2))
print("Anzahl Tage:", len(tages_mittel))`}
          validationCode={`assert woche.shape == (7, 24), f"woche.shape sollte (7, 24) sein, ist aber {woche.shape}"
assert tages_mittel.shape == (7,), f"tages_mittel.shape sollte (7,) sein, ist aber {tages_mittel.shape}"
expected_mittel = np.mean(stunden.reshape(7, 24), axis=1)
assert np.allclose(tages_mittel, expected_mittel), "tages_mittel sollte der Mittelwert pro Tag sein (axis=1)"
print("Reshape und Aggregation korrekt!")`}
          hints={[
            'Reshape: stunden.reshape(7, 24) oder stunden.reshape(-1, 24).',
            'Mittelwert pro Tag: np.mean(woche, axis=1) — axis=1 bedeutet „über die Spalten (Stunden)".',
          ]}
        />
      </main>
    </div>
  )
}
