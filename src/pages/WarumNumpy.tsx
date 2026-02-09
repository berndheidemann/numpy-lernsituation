import Navigation from '../components/common/Navigation'
import CodingExercise from '../components/exercises/CodingExercise'
import PerformanceChart from '../components/visualizations/PerformanceChart'
import { useChapterTracking } from '../hooks/useChapterTracking'

const benchmarks = [
  { size: 1_000, listMs: 0.3, numpyMs: 0.02 },
  { size: 10_000, listMs: 3, numpyMs: 0.03 },
  { size: 100_000, listMs: 30, numpyMs: 0.1 },
  { size: 1_000_000, listMs: 300, numpyMs: 0.8 },
  { size: 10_000_000, listMs: 3200, numpyMs: 8 },
]

export default function WarumNumpy() {
  useChapterTracking('warum-numpy')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
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

        <CodingExercise
          id="warum-numpy-1"
          title="Erste Schritte mit NumPy"
          description="Erstelle ein NumPy-Array und berechne die Summe aller Elemente. Nutze die Funktion np.sum()."
          starterCode={`import numpy as np

# Erstelle ein Array mit den Werten 1 bis 10
zahlen = np.arange(1, 11)
print("Array:", zahlen)

# Berechne die Summe
summe = np.sum(zahlen)
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
