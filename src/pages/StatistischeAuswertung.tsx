import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import Lueckentext from '../components/common/Lueckentext'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import ScatterPlot from '../components/visualizations/ScatterPlot'
import BoxPlotVisualizer from '../components/visualizations/BoxPlotVisualizer'
import DragDropExercise from '../components/exercises/DragDropExercise'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import MultipleChoice from '../components/exercises/MultipleChoice'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

const verbrauchsDaten = [
  [12, 8, 15, 22, 18],
  [9, 14, 11, 7, 20],
  [25, 19, 16, 13, 10],
]

export default function StatistischeAuswertung() {
  useChapterTracking('statistische-auswertung')
  const { createOnComplete } = useExerciseTracking('statistische-auswertung', 7)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 7: Statistische Auswertung</h1>
        <p className="text-slate-600 mb-6">
          NumPy bietet umfangreiche statistische Funktionen — von einfachen Kennzahlen wie Mittelwert
          und Standardabweichung bis hin zur Korrelationsanalyse. Im SmartEnergy-Szenario:
          Durchschnittsverbrauch pro Tarif, Korrelation Temperatur–Verbrauch, Ausreißer-Erkennung.
        </p>

        {/* --- Visualisierung --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Beispieldaten: 3 Haushalte × 5 Stunden</h2>
          <ArrayVisualizer data={verbrauchsDaten} label="verbrauch (kWh)" colorMode="heatmap" />
        </section>

        {/* --- Theorie 1: Deskriptive Statistik --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Deskriptive Statistik</h2>
          <p className="text-slate-600 mb-3">
            Die wichtigsten statistischen Kennzahlen in NumPy:
            <code className="text-sm bg-slate-100 px-1 rounded">mean</code> (Mittelwert),{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">median</code> (Median),{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">std</code> (Standardabweichung) und{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">var</code> (Varianz).
            Der Median ist robuster gegen Ausreißer als der Mittelwert.
          </p>
          <CodeBlock
            title="Statistische Kennzahlen"
            code={`import numpy as np

verbrauch = np.array([12, 8, 15, 22, 18, 9, 14, 11, 7, 20])

print("Mittelwert:", np.mean(verbrauch))       # 13.6
print("Median:", np.median(verbrauch))          # 13.0
print("Std:", np.round(np.std(verbrauch), 2))   # 4.84
print("Min:", np.min(verbrauch))                # 7
print("Max:", np.max(verbrauch))                # 22
print("Perzentil 25%:", np.percentile(verbrauch, 25))  # 9.25
print("Perzentil 75%:", np.percentile(verbrauch, 75))  # 17.25`}
          />
        </section>

        {/* --- Theorie 2: Achsen-basierte Aggregation --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Achsen-basierte Aggregation</h2>
          <p className="text-slate-600 mb-3">
            Bei 2D-Daten (Haushalte × Stunden) kann die Statistik pro Haushalt (<code className="text-sm bg-slate-100 px-1 rounded">axis=1</code>)
            oder pro Stunde (<code className="text-sm bg-slate-100 px-1 rounded">axis=0</code>) berechnet werden:
          </p>
          <CodeBlock
            title="Statistik pro Achse"
            code={`import numpy as np

verbrauch = np.array([
    [12, 8, 15, 22, 18],   # Haushalt 0
    [9, 14, 11, 7, 20],    # Haushalt 1
    [25, 19, 16, 13, 10],  # Haushalt 2
])

# Pro Haushalt (über die Stunden, axis=1)
print("Mittel/HH:", np.mean(verbrauch, axis=1))  # [15. 12.2 16.6]

# Pro Stunde (über die Haushalte, axis=0)
print("Mittel/Std:", np.round(np.mean(verbrauch, axis=0), 1))

# Index des Maximalverbrauchs pro Haushalt
print("Spitzenstunde:", np.argmax(verbrauch, axis=1))  # [3 4 0]`}
          />
        </section>

        {/* --- Theorie 3: Korrelation & Ausreißer --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Korrelation & Ausreißer</h2>
          <p className="text-slate-600 mb-3">
            <code className="text-sm bg-slate-100 px-1 rounded">np.corrcoef</code> berechnet die
            Korrelationsmatrix. Ein Wert nahe -1 bedeutet starke negative Korrelation (z.B.: je kälter,
            desto höher der Verbrauch). Ausreißer lassen sich über die Standardabweichung identifizieren.
          </p>
          <CodeBlock
            title="Korrelation und Ausreißer"
            code={`import numpy as np

temperatur = np.array([22, 18, 5, -2, 8, 15, 25])
verbrauch = np.array([10, 14, 28, 35, 24, 16, 8])

# Korrelationsmatrix
korr_matrix = np.corrcoef(temperatur, verbrauch)
r = korr_matrix[0, 1]
print(f"Korrelation: {r:.2f}")  # ≈ -0.98 (stark negativ)

# Ausreißer: Werte > 2 Standardabweichungen vom Mittel
mittel = np.mean(verbrauch)
std = np.std(verbrauch)
ausreisser = np.abs(verbrauch - mittel) > 2 * std
print("Ausreißer:", verbrauch[ausreisser])`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Korrelation visualisiert</h2>
          <p className="text-slate-600 mb-3">
            Das Streudiagramm zeigt den Zusammenhang zwischen Temperatur und Stromverbrauch.
            Die Trendlinie und der Korrelationskoeffizient r zeigen: Je kälter, desto höher der Verbrauch.
          </p>
          <ScatterPlot
            xData={[22, 18, 5, -2, 8, 15, 25, 30, 12, 3]}
            yData={[10, 14, 28, 35, 24, 16, 8, 5, 20, 30]}
            xLabel="Temperatur (°C)"
            yLabel="Verbrauch (kWh)"
            label="Temperatur vs. Stromverbrauch"
            showTrendLine
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Ausreißer erkennen</h2>
          <p className="text-slate-600 mb-3">
            Ausreißer liegen außerhalb der ±2σ-Grenzen (Mittelwert ± 2 Standardabweichungen).
            Rote Punkte zeigen ungewöhnliche Werte:
          </p>
          <ScatterPlot
            xData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            yData={[12, 18, 15, 35, 14, 2, 16, 13, 28, 17]}
            xLabel="Tag"
            yLabel="Verbrauch (kWh)"
            label="Tagesverbrauch mit Ausreißer-Erkennung"
            showTrendLine={false}
            showOutlierBounds
            outliersStdFactor={2}
          />
        </section>

        {/* --- Übung 1: DragDrop — Statistik-Zuordner --- */}
        <DragDropExercise
          id="statistik-zuordner"
          title="Statistik-Funktionen zuordnen"
          description="Ordne jede Fragestellung der passenden NumPy-Funktion zu."
          onComplete={createOnComplete('statistik-zuordner')}
          pairs={[
            { itemId: 'fn-mean', itemLabel: 'np.mean()', zoneId: 'zone-durchschnitt', zoneLabel: 'Durchschnittlicher Verbrauch' },
            { itemId: 'fn-std', itemLabel: 'np.std()', zoneId: 'zone-streuung', zoneLabel: 'Streuung der Werte messen' },
            { itemId: 'fn-median', itemLabel: 'np.median()', zoneId: 'zone-robust', zoneLabel: 'Robuster Mittelwert (gegen Ausreißer)' },
            { itemId: 'fn-corrcoef', itemLabel: 'np.corrcoef()', zoneId: 'zone-zusammenhang', zoneLabel: 'Zusammenhang zweier Größen' },
          ]}
        />

        {/* --- Übung 2: ArrayFill — Achsen-Aggregation --- */}
        <ArrayFillExercise
          id="achsen-aggregation"
          title="Achsen-Aggregation vorhersagen"
          description="Gegeben: data = [[12, 8, 15], [9, 14, 11], [25, 19, 16]]. Was ergibt np.mean(data, axis=0)? (Mittelwert pro Spalte, auf ganze Zahlen gerundet)"
          onComplete={createOnComplete('achsen-aggregation')}
          expected={[[15, 14, 14]]}
          prefilled={[[null, null, null]]}
        />

        {/* --- Übung 3: MultipleChoice — Korrelation interpretieren --- */}
        <MultipleChoice
          id="korrelation-quiz"
          question="Der Korrelationskoeffizient zwischen Temperatur und Stromverbrauch beträgt -0.82. Was bedeutet das?"
          onComplete={createOnComplete('korrelation-quiz')}
          options={[
            { text: 'Kein Zusammenhang', explanation: 'Falsch — ein Wert von -0.82 zeigt einen deutlichen Zusammenhang.' },
            { text: 'Je höher die Temperatur, desto höher der Verbrauch', explanation: 'Falsch — das negative Vorzeichen bedeutet einen gegenläufigen Zusammenhang.' },
            { text: 'Je höher die Temperatur, desto niedriger der Verbrauch', explanation: 'Richtig! Negatives Vorzeichen = gegenläufig. |0.82| > 0.7 = starker Zusammenhang.' },
            { text: 'Die Daten sind fehlerhaft', explanation: 'Falsch — -0.82 ist ein plausibles Ergebnis für Temperatur vs. Heizverbrauch.' },
          ]}
          correctIndex={2}
        />

        {/* --- Übung 4: Lückentext — Perzentile --- */}
        <Lueckentext
          id="percentile-lueckentext"
          onComplete={createOnComplete('percentile-lueckentext')}
          segments={[
            'import numpy as np\n\nverbrauch = np.array([12, 8, 15, 22, 18, 9, 14, 11, 7, 20])\n\n# Robuster Lageparameter (unempfindlich gegen Ausreißer)\nprint(np.',
            { id: 'median', answer: 'median', hint: 'Welche Funktion berechnet den Median?' },
            '(verbrauch))\n\n# Unteres Quartil (Q1)\nq1 = np.percentile(verbrauch, ',
            { id: 'q1', answer: '25', hint: 'Welches Perzentil markiert das untere Quartil?' },
            ')\n\n# Oberes Quartil (Q3)\nq3 = np.percentile(verbrauch, ',
            { id: 'q3', answer: '75', hint: 'Welches Perzentil markiert das obere Quartil?' },
            ')\n\n# Interquartilsabstand\niqr = q3 - q1',
          ]}
        />

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Verteilung verstehen: Boxplot & Histogramm</h2>
          <p className="text-slate-600 mb-3">
            Ein <strong>Boxplot</strong> zeigt Median, Quartile und Ausreißer auf einen Blick.
            Das <strong>Histogramm</strong> darüber zeigt die Häufigkeitsverteilung derselben Daten.
            Bewege die Maus über die Kennzahlen, um sie im Diagramm hervorzuheben:
          </p>
          <BoxPlotVisualizer
            data={[12, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 27, 28, 30, 35, 55, 8, 10, 17, 19, 22, 26, 31, 9, 11, 16, 20, 23, 29]}
            label="Tagesverbrauch (kWh) — 30 Messwerte"
            unit="kWh"
          />
        </section>

        {/* --- Übung 5: CodingExercise — Ausreißer-Erkennung --- */}
        <CodingExercise
          id="ausreisser-coding"
          title="Ausreißer mit Z-Score erkennen"
          description="Verwende die Z-Score-Methode, um Ausreißer im Verbrauch zu finden: Ein Wert ist ein Ausreißer, wenn er mehr als 2 Standardabweichungen vom Mittelwert entfernt ist. Nutze Boolean Indexing!"
          onComplete={createOnComplete('ausreisser-coding')}
          fallbackOutput={"Mittelwert: 15.0\nStd: 5.29\nObergrenze: 25.58\nUntergrenze: 4.42\nAusreißer: [35  2 28]"}
          starterCode={`import numpy as np

verbrauch = np.array([12, 18, 15, 35, 14, 2, 16, 13, 28, 17])

# 1. Mittelwert und Standardabweichung
mittel = # Dein Code hier
std = # Dein Code hier
print(f"Mittelwert: {mittel}")
print(f"Std: {round(std, 2)}")

# 2. Ober- und Untergrenze (Mittel ± 2 × Std)
obergrenze = # Dein Code hier
untergrenze = # Dein Code hier
print(f"Obergrenze: {round(obergrenze, 2)}")
print(f"Untergrenze: {round(untergrenze, 2)}")

# 3. Ausreißer finden: Werte außerhalb der Grenzen (Boolean Indexing)
ausreisser = # Dein Code hier
print("Ausreißer:", ausreisser)`}
          solution={`import numpy as np

verbrauch = np.array([12, 18, 15, 35, 14, 2, 16, 13, 28, 17])

mittel = np.mean(verbrauch)
std = np.std(verbrauch)
print(f"Mittelwert: {mittel}")
print(f"Std: {round(std, 2)}")

obergrenze = mittel + 2 * std
untergrenze = mittel - 2 * std
print(f"Obergrenze: {round(obergrenze, 2)}")
print(f"Untergrenze: {round(untergrenze, 2)}")

ausreisser = verbrauch[(verbrauch > obergrenze) | (verbrauch < untergrenze)]
print("Ausreißer:", ausreisser)`}
          validationCode={`expected_mittel = np.mean(verbrauch)
expected_std = np.std(verbrauch)
assert abs(mittel - expected_mittel) < 0.01, f"mittel sollte {expected_mittel} sein"
assert abs(std - expected_std) < 0.01, f"std sollte {expected_std:.2f} sein"
assert abs(obergrenze - (expected_mittel + 2 * expected_std)) < 0.01, "obergrenze = mittel + 2*std"
assert abs(untergrenze - (expected_mittel - 2 * expected_std)) < 0.01, "untergrenze = mittel - 2*std"
expected_out = verbrauch[(verbrauch > obergrenze) | (verbrauch < untergrenze)]
assert np.array_equal(ausreisser, expected_out), f"ausreisser sollte {expected_out} sein"
print("Ausreißer-Erkennung korrekt!")`}
          hints={[
            'Schau in den CodeBlock „Statistische Kennzahlen" oben — welche zwei Funktionen brauchst du für Mittelwert und Streuung?',
            'Die Grenzen liegen symmetrisch um den Mittelwert: Mittel plus/minus ein Vielfaches der Standardabweichung.',
            'Ausreißer sind Werte, die OBERHALB der Obergrenze ODER UNTERHALB der Untergrenze liegen. Welchen logischen Operator nutzt du bei Arrays statt „or"?',
          ]}
        />

        {/* --- Übung 6: CodingExercise — Statistik-Dashboard --- */}
        <CodingExercise
          id="statistik-dashboard"
          title="Statistik-Dashboard für Haushalte"
          description="Berechne für 4 Haushalte über 7 Tage: Mittelwert, Median und Standardabweichung pro Haushalt, und finde den Haushalt mit dem höchsten Durchschnittsverbrauch."
          onComplete={createOnComplete('statistik-dashboard')}
          fallbackOutput={"Verbrauch-Shape: (4, 7)\nMittelwert: [17.52 14.83 16.21 18.95]\nMedian: [18.03 14.25 16.78 19.12]\nStd: [5.42 4.81 6.13 4.95]\nTop-Verbraucher: Haushalt 3"}
          starterCode={`import numpy as np

np.random.seed(42)
# 4 Haushalte × 7 Tage
verbrauch = np.random.uniform(5, 30, size=(4, 7))
print("Verbrauch-Shape:", verbrauch.shape)

# 1. Mittelwert pro Haushalt (axis=1)
mittel = # Dein Code hier
print("Mittelwert:", np.round(mittel, 2))

# 2. Median pro Haushalt
med = # Dein Code hier
print("Median:", np.round(med, 2))

# 3. Standardabweichung pro Haushalt
std = # Dein Code hier
print("Std:", np.round(std, 2))

# 4. Index des Haushalts mit dem höchsten Durchschnitt
top_haushalt = # Dein Code hier
print("Top-Verbraucher: Haushalt", top_haushalt)`}
          solution={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(5, 30, size=(4, 7))
print("Verbrauch-Shape:", verbrauch.shape)

mittel = np.mean(verbrauch, axis=1)
print("Mittelwert:", np.round(mittel, 2))

med = np.median(verbrauch, axis=1)
print("Median:", np.round(med, 2))

std = np.std(verbrauch, axis=1)
print("Std:", np.round(std, 2))

top_haushalt = np.argmax(mittel)
print("Top-Verbraucher: Haushalt", top_haushalt)`}
          validationCode={`assert mittel.shape == (4,), f"mittel.shape sollte (4,) sein, ist aber {mittel.shape}"
assert med.shape == (4,), f"med.shape sollte (4,) sein, ist aber {med.shape}"
assert std.shape == (4,), f"std.shape sollte (4,) sein, ist aber {std.shape}"
assert np.allclose(mittel, np.mean(verbrauch, axis=1)), "mittel sollte np.mean(verbrauch, axis=1) sein"
assert np.allclose(med, np.median(verbrauch, axis=1)), "med sollte np.median(verbrauch, axis=1) sein"
assert np.allclose(std, np.std(verbrauch, axis=1)), "std sollte np.std(verbrauch, axis=1) sein"
assert top_haushalt == np.argmax(np.mean(verbrauch, axis=1)), f"top_haushalt ist nicht korrekt"
print("Statistik-Dashboard korrekt!")`}
          hints={[
            'Alle Funktionen brauchen axis=1, um pro Haushalt (Zeile) zu aggregieren.',
            'np.argmax(mittel) gibt den Index des größten Mittelwerts zurück.',
          ]}
        />

        {/* --- Übung 7: CodingExercise — Korrelation --- */}
        <CodingExercise
          id="korrelation-coding"
          title="Korrelation berechnen"
          description="Berechne den Korrelationskoeffizienten zwischen Temperatur und Stromverbrauch. Extrahiere den r-Wert aus der Korrelationsmatrix."
          onComplete={createOnComplete('korrelation-coding')}
          fallbackOutput={"Korrelationsmatrix:\n [[ 1.    -0.983]\n [-0.983  1.   ]]\nr-Wert: -0.983\nStarke negative Korrelation: Heizen bei Kälte!"}
          starterCode={`import numpy as np

# Tagestemperaturen (°C) und Tagesverbrauch (kWh) für 10 Tage
temperatur = np.array([22, 18, 5, -2, 8, 15, 25, 30, 12, 3])
verbrauch = np.array([10, 14, 28, 35, 24, 16, 8, 5, 20, 30])

# 1. Korrelationsmatrix berechnen
korr_matrix = # Dein Code hier
print("Korrelationsmatrix:\\n", np.round(korr_matrix, 3))

# 2. r-Wert extrahieren (Zeile 0, Spalte 1)
r = # Dein Code hier
print(f"r-Wert: {r:.3f}")

# 3. Interpretation
if r < -0.7:
    print("Starke negative Korrelation: Heizen bei Kälte!")
elif r < -0.3:
    print("Moderate negative Korrelation")
else:
    print("Schwache oder keine Korrelation")`}
          solution={`import numpy as np

temperatur = np.array([22, 18, 5, -2, 8, 15, 25, 30, 12, 3])
verbrauch = np.array([10, 14, 28, 35, 24, 16, 8, 5, 20, 30])

korr_matrix = np.corrcoef(temperatur, verbrauch)
print("Korrelationsmatrix:\\n", np.round(korr_matrix, 3))

r = korr_matrix[0, 1]
print(f"r-Wert: {r:.3f}")

if r < -0.7:
    print("Starke negative Korrelation: Heizen bei Kälte!")
elif r < -0.3:
    print("Moderate negative Korrelation")
else:
    print("Schwache oder keine Korrelation")`}
          validationCode={`assert korr_matrix.shape == (2, 2), f"korr_matrix.shape sollte (2, 2) sein, ist aber {korr_matrix.shape}"
expected_r = np.corrcoef(temperatur, verbrauch)[0, 1]
assert abs(r - expected_r) < 0.001, f"r sollte {expected_r:.3f} sein, ist aber {r:.3f}"
assert r < -0.9, "Der r-Wert sollte stark negativ sein (< -0.9)"
print("Korrelation korrekt berechnet!")`}
          hints={[
            'Schau im CodeBlock „Korrelation und Ausreißer" oben nach: Welche Funktion berechnet die Korrelationsmatrix?',
            'Die Korrelationsmatrix ist 2×2. Die Diagonale enthält immer 1.0 (Korrelation mit sich selbst). Wo steht der interessante Wert?',
          ]}
        />
      </main>
    </div>
  )
}
