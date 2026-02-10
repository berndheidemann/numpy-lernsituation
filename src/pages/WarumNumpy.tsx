import Navigation from '../components/common/Navigation'
import Lueckentext from '../components/common/Lueckentext'
import MultipleChoice from '../components/exercises/MultipleChoice'
import CodingExercise from '../components/exercises/CodingExercise'
import PerformanceChart from '../components/visualizations/PerformanceChart'
import VectorizationAnimator from '../components/visualizations/VectorizationAnimator'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

const benchmarks = [
  { size: 1_000, listMs: 0.3, numpyMs: 0.02 },
  { size: 10_000, listMs: 3, numpyMs: 0.03 },
  { size: 100_000, listMs: 30, numpyMs: 0.1 },
  { size: 1_000_000, listMs: 300, numpyMs: 0.8 },
  { size: 10_000_000, listMs: 3200, numpyMs: 8 },
]

export default function WarumNumpy() {
  useChapterTracking('warum-numpy')
  const { createOnComplete } = useExerciseTracking('warum-numpy', 3)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 1: Warum NumPy?</h1>
        <p className="text-slate-600 mb-6">
          NumPy ist die Grundlage für numerische Berechnungen in Python. In diesem Kapitel lernst du,
          warum NumPy-Arrays so viel schneller sind als Python-Listen und was
          Vektorisierung (gleichzeitige Verarbeitung aller Elemente) bedeutet.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Performance-Vergleich</h2>
          <p className="text-slate-600 mb-3">
            Bewege den Slider, um zu sehen, wie sich der Geschwindigkeitsunterschied
            zwischen Python-Listen und NumPy mit wachsender Datenmenge verändert:
          </p>
          <PerformanceChart
            label="Listen vs. NumPy: Summe berechnen"
            benchmarks={benchmarks}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Vektorisierung verstehen</h2>
          <p className="text-slate-600 mb-3">
            Der Schlüssel zur Performance: Eine Python-Schleife verarbeitet jedes Element einzeln.
            NumPy wendet die Operation <strong>gleichzeitig</strong> auf alle Elemente an — das nennt man
            Vektorisierung.
          </p>
          <VectorizationAnimator label="Schleife vs. Vektorisierung: arr * 2" />
        </section>

        {/* --- Übung 1: MultipleChoice — Listen vs. Arrays --- */}
        <MultipleChoice
          id="listen-vs-arrays-quiz"
          question="Was ist der Hauptgrund, warum NumPy-Arrays schneller sind als Python-Listen?"
          onComplete={createOnComplete('listen-vs-arrays-quiz')}
          options={[
            { text: 'NumPy ist in Java geschrieben', explanation: 'Falsch — NumPy nutzt C und Fortran, nicht Java.' },
            { text: 'Homogener Datentyp + zusammenhängender Speicher ermöglicht Vektorisierung', explanation: 'Richtig! Alle Elemente haben denselben Typ und liegen direkt hintereinander im Speicher — so kann die CPU ganze Blöcke gleichzeitig verarbeiten.' },
            { text: 'Python-Listen unterstützen keine Zahlen', explanation: 'Falsch — Python-Listen können sehr wohl Zahlen speichern, nur nicht so effizient.' },
            { text: 'NumPy nutzt mehrere Prozessorkerne automatisch', explanation: 'Falsch — Standard-NumPy nutzt in der Regel einen Kern. Der Vorteil kommt von Vektorisierung und C-optimiertem Code.' },
          ]}
          correctIndex={1}
        />

        {/* --- Übung 2: Lückentext — Vektorisierung --- */}
        <Lueckentext
          id="vektorisierung-lueckentext"
          onComplete={createOnComplete('vektorisierung-lueckentext')}
          segments={[
            '# Mit Python-Listen: explizite Schleife\nergebnis = []\nfor x in liste:\n    ergebnis.append(x * 2)\n\n# Mit NumPy: ',
            { id: 'konzept', answer: 'Vektorisierung', hint: 'Wie heißt das Konzept, bei dem eine Operation auf alle Elemente gleichzeitig angewendet wird?' },
            '\nimport numpy as np\narr = np.',
            { id: 'func', answer: 'array', hint: 'Welche Funktion erstellt ein NumPy-Array aus einer Liste?' },
            '(liste)\nergebnis = arr ',
            { id: 'op', answer: '*', hint: 'Welcher Operator multipliziert elementweise?' },
            ' 2',
          ]}
        />

        {/* --- Übung 3: CodingExercise — Erste Schritte --- */}
        <CodingExercise
          id="warum-numpy-1"
          title="Erste Schritte mit NumPy"
          description="Erstelle ein NumPy-Array und berechne die Summe aller Elemente. Nutze die Funktion np.sum()."
          onComplete={createOnComplete('warum-numpy-1')}
          fallbackOutput={"Array: [ 1  2  3  4  5  6  7  8  9 10]\nSumme: 55"}
          starterCode={`import numpy as np

# Erstelle ein Array mit den Werten 1 bis 10
zahlen = # Nutze np.arange() mit passenden Parametern
print("Array:", zahlen)

# Berechne die Summe aller Elemente
summe = # Nutze np.sum()
print("Summe:", summe)`}
          solution={`import numpy as np

zahlen = np.arange(1, 11)
print("Array:", zahlen)

summe = np.sum(zahlen)
print("Summe:", summe)`}
          validationCode={`assert 'zahlen' in dir(), "Variable 'zahlen' nicht gefunden"
assert hasattr(zahlen, 'shape'), "zahlen muss ein NumPy-Array sein"
assert zahlen.shape == (10,), f"Shape sollte (10,) sein, ist aber {zahlen.shape}"
assert summe == 55, f"Summe sollte 55 sein, ist aber {summe}"
print("Alles korrekt!")`}
          hints={[
            "np.arange(start, stop) erstellt ein Array von start bis stop-1.",
            "np.sum(array) berechnet die Summe aller Elemente.",
          ]}
        />
      </main>
    </div>
  )
}
