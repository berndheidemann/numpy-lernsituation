import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import BroadcastingAnimator from '../components/visualizations/BroadcastingAnimator'
import ShapePredictor from '../components/exercises/ShapePredictor'
import MultipleChoice from '../components/exercises/MultipleChoice'
import DragDropExercise from '../components/exercises/DragDropExercise'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

export default function Broadcasting() {
  useChapterTracking('broadcasting')
  const { createOnComplete } = useExerciseTracking('broadcasting', 5)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 5: Broadcasting</h1>
        <p className="text-slate-600 mb-6">
          Broadcasting (automatische Formanpassung) erlaubt es, Arrays mit unterschiedlichen Shapes zu
          kombinieren — ohne die Daten manuell zu duplizieren. Im SmartEnergy-Szenario:
          Stundenpreise (1D) auf alle Haushalte (2D) anwenden.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Broadcasting-Regeln</h2>
          <p className="text-slate-600 mb-3">
            NumPy vergleicht die Shapes von rechts nach links. Zwei Dimensionen sind kompatibel, wenn
            sie gleich sind oder eine davon 1 ist. Beobachte Schritt für Schritt, wie Broadcasting funktioniert:
          </p>

          <BroadcastingAnimator
            shapeA={[4, 5]}
            shapeB={[5]}
            label="Beispiel 1: Verbrauch (4,5) + Stundenpreise (5,)"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Kompatible Shapes</h2>
          <p className="text-slate-600 mb-3">
            Ein Skalar (einzelner Wert) kann mit jedem Array verrechnet werden:
          </p>
          <BroadcastingAnimator
            shapeA={[3, 4]}
            shapeB={[1]}
            label="Beispiel 2: Matrix (3,4) + Skalar (1,)"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Inkompatible Shapes</h2>
          <p className="text-slate-600 mb-3">
            Nicht alle Shape-Kombinationen sind kompatibel. Wenn weder die Dimensionen gleich sind
            noch eine davon 1, schlägt Broadcasting fehl:
          </p>
          <BroadcastingAnimator
            shapeA={[3, 4]}
            shapeB={[3]}
            label="Beispiel 3: (3,4) + (3,) — Inkompatibel!"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Broadcasting mit Werten</h2>
          <p className="text-slate-600 mb-3">
            So sieht Broadcasting auf Daten-Ebene aus: Die Stundenpreise (1D) werden auf alle
            Haushalte (2D) angewendet — jede Zeile wird mit denselben Preisen multipliziert:
          </p>
          <div className="grid gap-4 md:grid-cols-3 items-start">
            <div>
              <ArrayVisualizer
                data={[[12, 8, 16], [22, 18, 10], [9, 14, 20], [15, 11, 7]]}
                label="Verbrauch (4×3)"
                colorMode="heatmap"
                compact
              />
            </div>
            <div className="flex flex-col items-center justify-center pt-8">
              <span className="text-2xl text-slate-400 font-bold">×</span>
              <ArrayVisualizer
                data={[0.28, 0.35, 0.30]}
                label="Preise (3,) → wird gestreckt"
                colorMode="uniform"
                compact
              />
            </div>
            <div>
              <ArrayVisualizer
                data={[
                  [3.36, 2.80, 4.80],
                  [6.16, 6.30, 3.00],
                  [2.52, 4.90, 6.00],
                  [4.20, 3.85, 2.10],
                ]}
                label="= Kosten (4×3)"
                colorMode="heatmap"
                compact
              />
            </div>
          </div>
        </section>

        {/* --- Theorie: Broadcasting-Regeln im Code --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Broadcasting-Regeln im Code</h2>
          <p className="text-slate-600 mb-3">
            Die drei Broadcasting-Regeln: (1) Arrays mit weniger Dimensionen werden links mit 1en aufgefüllt.
            (2) Dimensionen der Größe 1 werden auf die größere Dimension gestreckt.
            (3) Sind zwei Dimensionen weder gleich noch 1, gibt es einen Fehler.
          </p>
          <CodeBlock
            title="Broadcasting am SmartEnergy-Beispiel"
            code={`import numpy as np

# Verbrauch: 100 Haushalte × 8760 Stunden
verbrauch = np.random.uniform(5, 25, size=(100, 8760))

# Stundenpreise: 8760 Werte (1D)
preise = np.random.uniform(0.15, 0.45, size=(8760,))

# Broadcasting: (100, 8760) * (8760,)
# Schritt 1: preise wird zu (1, 8760)
# Schritt 2: preise wird zu (100, 8760) gestreckt
kosten = verbrauch * preise   # Shape: (100, 8760)

# Spalten-Broadcasting mit reshape
rabatt = np.array([0.9, 0.85, 0.95]).reshape(3, 1)
# (3, 1) * (3, 4) → jede Zeile wird multipliziert
matrix = np.ones((3, 4))
print((rabatt * matrix).shape)  # (3, 4)`}
          />
        </section>

        {/* --- Übung 1: ShapePredictor — Spalten-Broadcasting --- */}
        <ShapePredictor
          id="broadcast-shape-1"
          title="Shape vorhersagen: Spalten-Broadcasting"
          onComplete={createOnComplete('broadcast-shape-1')}
          context="a = np.ones((3, 1))\nb = np.ones((1, 4))"
          operation="ergebnis = a + b"
          expectedShape={[3, 4]}
          explanation="(3,1) + (1,4): Die 1er-Dimensionen werden jeweils gestreckt → Ergebnis (3,4)."
        />

        {/* --- Übung 2: ShapePredictor — SmartEnergy-Broadcasting --- */}
        <ShapePredictor
          id="broadcast-shape-2"
          title="Shape vorhersagen: Preisberechnung"
          onComplete={createOnComplete('broadcast-shape-2')}
          context="verbrauch = np.ones((100, 8760))  # 100 Haushalte × 8760 Stunden\npreise = np.ones((8760,))           # Stundenpreise"
          operation="kosten = verbrauch * preise"
          expectedShape={[100, 8760]}
          explanation="(100, 8760) * (8760,): preise wird zu (1, 8760) aufgefüllt, dann auf (100, 8760) gestreckt."
        />

        {/* --- Übung 3: Multiple Choice — Inkompatible Shapes --- */}
        <MultipleChoice
          id="broadcast-rules"
          question="Welche Shape-Kombination ist NICHT kompatibel für Broadcasting?"
          onComplete={createOnComplete('broadcast-rules')}
          options={[
            { text: '(3, 4) + (4,)', explanation: 'Kompatibel — (4,) wird zu (1, 4), dann auf (3, 4) gestreckt.' },
            { text: '(3, 4) + (3, 1)', explanation: 'Kompatibel — die 1 in Spalte wird auf 4 gestreckt.' },
            { text: '(3, 4) + (3,)', explanation: 'Richtig! (3,) wird zu (1, 3). Dann: 4 ≠ 3 und keins ist 1 → Fehler!' },
            { text: '(5, 1) + (1, 3)', explanation: 'Kompatibel — beide 1er werden gestreckt → (5, 3).' },
          ]}
          correctIndex={2}
        />

        {/* --- Übung 4: DragDrop — Broadcasting-Kompatibilität --- */}
        <DragDropExercise
          id="broadcast-compatibility-dd"
          title="Broadcasting-Ergebnis zuordnen"
          description="Ordne jede Shape-Kombination dem korrekten Ergebnis-Shape zu."
          onComplete={createOnComplete('broadcast-compatibility-dd')}
          pairs={[
            { itemId: 'pair-1', itemLabel: '(3,4) + (4,)', zoneId: 'result-1', zoneLabel: 'Ergebnis: (3, 4)' },
            { itemId: 'pair-2', itemLabel: '(5,1) + (1,3)', zoneId: 'result-2', zoneLabel: 'Ergebnis: (5, 3)' },
            { itemId: 'pair-3', itemLabel: '(2,3,4) + (4,)', zoneId: 'result-3', zoneLabel: 'Ergebnis: (2, 3, 4)' },
            { itemId: 'pair-4', itemLabel: '(6,1) + (6,)', zoneId: 'result-4', zoneLabel: 'Ergebnis: Fehler!' },
          ]}
        />

        {/* --- Übung 5: CodingExercise — Preisberechnung --- */}
        <CodingExercise
          id="broadcasting-coding"
          title="Stromkosten mit Broadcasting berechnen"
          description="Berechne die Stromkosten für 5 Haushalte über 24 Stunden. Nutze Broadcasting, um die Stundenpreise (1D) auf alle Haushalte (2D) anzuwenden."
          onComplete={createOnComplete('broadcasting-coding')}
          fallbackOutput={"Kosten-Shape: (5, 24)\nKosten pro Haushalt: [88.42 85.19 91.03 78.56 82.11]"}
          starterCode={`import numpy as np

# 5 Haushalte × 24 Stunden Verbrauch (kWh)
np.random.seed(42)
verbrauch = np.random.uniform(5, 25, size=(5, 24))

# Stundenpreise (Euro/kWh) — variiert über den Tag
preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,  # 0-5 Uhr (günstig)
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,  # 6-11 Uhr (teuer)
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,  # 12-17 Uhr (mittel)
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,  # 18-23 Uhr (Spitze)
])

# Berechne die Kosten pro Haushalt und Stunde mit Broadcasting
kosten = # Dein Code hier
print("Kosten-Shape:", kosten.shape)

# Gesamtkosten pro Haushalt (Summe über axis=1)
kosten_pro_haushalt = # Dein Code hier
print("Kosten pro Haushalt:", np.round(kosten_pro_haushalt, 2))`}
          solution={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(5, 25, size=(5, 24))

preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,
])

kosten = verbrauch * preise
print("Kosten-Shape:", kosten.shape)

kosten_pro_haushalt = np.sum(kosten, axis=1)
print("Kosten pro Haushalt:", np.round(kosten_pro_haushalt, 2))`}
          validationCode={`assert kosten.shape == (5, 24), f"kosten.shape sollte (5, 24) sein, ist aber {kosten.shape}"
assert kosten_pro_haushalt.shape == (5,), f"kosten_pro_haushalt.shape sollte (5,) sein, ist aber {kosten_pro_haushalt.shape}"
# Check that broadcasting was used (not a loop)
expected = verbrauch * preise
assert np.allclose(kosten, expected), "kosten sollte verbrauch * preise sein (Broadcasting)"
assert np.allclose(kosten_pro_haushalt, np.sum(kosten, axis=1)), "kosten_pro_haushalt sollte die Summe über axis=1 sein"
print("Broadcasting korrekt angewendet!")`}
          hints={[
            'Broadcasting: verbrauch * preise — NumPy erkennt automatisch, dass preise (24,) zu (1, 24) und dann zu (5, 24) gestreckt werden muss.',
            'Summe über Spalten: np.sum(kosten, axis=1) summiert jede Zeile → ein Wert pro Haushalt.',
          ]}
        />
      </main>
    </div>
  )
}
