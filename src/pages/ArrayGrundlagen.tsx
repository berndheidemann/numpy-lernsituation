import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import Lueckentext from '../components/common/Lueckentext'
import MultipleChoice from '../components/exercises/MultipleChoice'
import DragDropExercise from '../components/exercises/DragDropExercise'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import ShapePredictor from '../components/exercises/ShapePredictor'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'

export default function ArrayGrundlagen() {
  useChapterTracking('array-grundlagen')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Kapitel 2: Array-Grundlagen
        </h1>
        <p className="text-slate-600 mb-6">
          NumPy-Arrays sind das Fundament für effiziente Datenverarbeitung. In diesem Kapitel
          lernst du, wie du Arrays erstellst und ihre wichtigsten Eigenschaften &mdash;
          Shape (Form), Dtype (Datentyp), Ndim (Dimensionen) und Size (Größe) &mdash; verstehst.
        </p>

        {/* --- Theorie-Sektion --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Arrays erstellen</h2>
          <p className="text-slate-600 mb-3">
            Ein Array wird mit <code className="text-sm bg-slate-100 px-1 rounded">np.array()</code> aus
            einer Python-Liste erstellt. Für typische Muster gibt es Hilfsfunktionen:
          </p>
          <CodeBlock
            title="Array-Erstellung"
            code={`import numpy as np

# Aus einer Liste
a = np.array([1, 2, 3, 4, 5])

# Spezielle Arrays
nullen = np.zeros((3, 4))       # 3x4 Matrix mit Nullen
einsen = np.ones((2, 3))        # 2x3 Matrix mit Einsen
bereich = np.arange(0, 10, 2)   # [0, 2, 4, 6, 8]
gleich = np.linspace(0, 1, 5)   # [0.0, 0.25, 0.5, 0.75, 1.0]`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Array-Attribute</h2>
          <p className="text-slate-600 mb-3">
            Jedes Array hat vier zentrale Attribute. Am Beispiel der SmartEnergy-Verbrauchsdaten
            (5 Haushalte, 24 Stunden):
          </p>
          <CodeBlock
            code={`verbrauch = np.random.uniform(5, 25, size=(5, 24))
print(verbrauch.shape)   # (5, 24) — 5 Zeilen, 24 Spalten
print(verbrauch.ndim)    # 2 — zweidimensional
print(verbrauch.size)    # 120 — 5 × 24 Elemente
print(verbrauch.dtype)   # float64`}
          />
        </section>

        {/* --- Übung 1: Multiple Choice --- */}
        <MultipleChoice
          id="dtype-quiz"
          question="Welchen Dtype hat np.array([1, 2.5, 3])?"
          options={[
            { text: 'int64', explanation: 'Falsch — ein Float-Wert (2.5) erzwingt float64 für das gesamte Array.' },
            { text: 'float64', explanation: 'Richtig! Sobald ein Wert ein Float ist, wird das gesamte Array zu float64.' },
            { text: 'object', explanation: 'Falsch — object entsteht nur bei gemischten Typen wie Strings und Zahlen.' },
            { text: 'float32', explanation: 'Falsch — NumPy verwendet standardmäßig float64, nicht float32.' },
          ]}
          correctIndex={1}
        />

        {/* --- Übung 2: Lückentext --- */}
        <Lueckentext
          id="array-creation"
          segments={[
            'import numpy as np\n\n# Erstelle ein 3x4 Array mit Nullen\nnullen = np.',
            { id: 'func', answer: 'zeros', hint: 'Welche Funktion erstellt ein Array voller Nullen?' },
            '((',
            { id: 'rows', answer: '3', hint: 'Wie viele Zeilen?' },
            ', ',
            { id: 'cols', answer: '4', hint: 'Wie viele Spalten?' },
            '))',
          ]}
        />

        {/* --- Übung 3: Drag & Drop --- */}
        <DragDropExercise
          id="array-functions"
          title="Array-Baukasten"
          description="Ordne jede Beschreibung der passenden NumPy-Funktion zu."
          pairs={[
            { itemId: 'np-zeros', itemLabel: 'np.zeros()', zoneId: 'zone-nullen', zoneLabel: 'Array mit Nullen erstellen' },
            { itemId: 'np-arange', itemLabel: 'np.arange()', zoneId: 'zone-bereich', zoneLabel: 'Zahlenbereich erzeugen (wie range)' },
            { itemId: 'np-linspace', itemLabel: 'np.linspace()', zoneId: 'zone-gleich', zoneLabel: 'Gleichmäßig verteilte Werte' },
            { itemId: 'np-ones', itemLabel: 'np.ones()', zoneId: 'zone-einsen', zoneLabel: 'Array mit Einsen erstellen' },
          ]}
        />

        {/* --- Übung 4: Array Fill --- */}
        <ArrayFillExercise
          id="array-result"
          title="Array-Ergebnis vorhersagen"
          description="Welche Werte erzeugt np.arange(2, 12, 3)? Fülle das 1D-Array aus."
          expected={[[2, 5, 8, 11]]}
          prefilled={[[null, null, null, null]]}
        />

        {/* --- Übung 5: Shape Predictor --- */}
        <ShapePredictor
          id="shape-1"
          title="Shape vorhersagen"
          operation="ergebnis = np.zeros((5, 24))"
          expectedShape={[5, 24]}
          explanation="np.zeros((5, 24)) erstellt eine 5×24 Matrix — die Shape entspricht dem Tupel-Argument."
        />

        <ShapePredictor
          id="shape-2"
          title="Shape vorhersagen"
          context="a = np.array([[1, 2, 3], [4, 5, 6]])"
          operation="ergebnis = a"
          expectedShape={[2, 3]}
          explanation="Das Array hat 2 Zeilen und 3 Spalten, also Shape (2, 3)."
        />

        {/* --- Übung 6: Live-Coding --- */}
        <CodingExercise
          id="array-grundlagen-coding"
          title="Erstes Array erstellen"
          description="Erstelle ein NumPy-Array 'verbrauch' mit Shape (4, 7) — die täglichen Verbräuche von 4 Haushalten über eine Woche. Verwende np.random.uniform(5, 25, size=(4, 7))."
          starterCode={`import numpy as np

# Erstelle das Array mit Zufallswerten zwischen 5 und 25 kWh
verbrauch = # Dein Code hier

# Gib die Attribute aus
print("Shape:", verbrauch.shape)
print("Ndim:", verbrauch.ndim)
print("Size:", verbrauch.size)
print("Dtype:", verbrauch.dtype)`}
          solution={`import numpy as np

verbrauch = np.random.uniform(5, 25, size=(4, 7))

print("Shape:", verbrauch.shape)
print("Ndim:", verbrauch.ndim)
print("Size:", verbrauch.size)
print("Dtype:", verbrauch.dtype)`}
          validationCode={`assert 'verbrauch' in dir(), "Variable 'verbrauch' nicht gefunden"
assert hasattr(verbrauch, 'shape'), "verbrauch muss ein NumPy-Array sein"
assert verbrauch.shape == (4, 7), f"Shape sollte (4, 7) sein, ist aber {verbrauch.shape}"
assert verbrauch.dtype == np.float64, f"Dtype sollte float64 sein, ist aber {verbrauch.dtype}"
print("Korrekt! Dein Array hat die richtige Shape und den richtigen Dtype.")`}
          hints={[
            'Nutze np.random.uniform(low, high, size=(zeilen, spalten)).',
            'low=5, high=25, size=(4, 7) für 4 Haushalte × 7 Tage.',
          ]}
        />
      </main>
    </div>
  )
}
