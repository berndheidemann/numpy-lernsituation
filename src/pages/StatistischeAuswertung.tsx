import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import DragDropExercise from '../components/exercises/DragDropExercise'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import MultipleChoice from '../components/exercises/MultipleChoice'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'

const verbrauchsDaten = [
  [12, 8, 15, 22, 18],
  [9, 14, 11, 7, 20],
  [25, 19, 16, 13, 10],
]

export default function StatistischeAuswertung() {
  useChapterTracking('statistische-auswertung')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
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

        {/* --- Übung 1: DragDrop — Statistik-Zuordner --- */}
        <DragDropExercise
          id="statistik-zuordner"
          title="Statistik-Funktionen zuordnen"
          description="Ordne jede Fragestellung der passenden NumPy-Funktion zu."
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
          expected={[[15, 14, 14]]}
          prefilled={[[null, null, null]]}
        />

        {/* --- Übung 3: MultipleChoice — Korrelation interpretieren --- */}
        <MultipleChoice
          id="korrelation-quiz"
          question="Der Korrelationskoeffizient zwischen Temperatur und Stromverbrauch beträgt -0.82. Was bedeutet das?"
          options={[
            { text: 'Kein Zusammenhang', explanation: 'Falsch — ein Wert von -0.82 zeigt einen deutlichen Zusammenhang.' },
            { text: 'Je höher die Temperatur, desto höher der Verbrauch', explanation: 'Falsch — das negative Vorzeichen bedeutet einen gegenläufigen Zusammenhang.' },
            { text: 'Je höher die Temperatur, desto niedriger der Verbrauch', explanation: 'Richtig! Negatives Vorzeichen = gegenläufig. |0.82| > 0.7 = starker Zusammenhang.' },
            { text: 'Die Daten sind fehlerhaft', explanation: 'Falsch — -0.82 ist ein plausibles Ergebnis für Temperatur vs. Heizverbrauch.' },
          ]}
          correctIndex={2}
        />

        {/* --- Übung 4: CodingExercise — Statistik-Dashboard --- */}
        <CodingExercise
          id="statistik-dashboard"
          title="Statistik-Dashboard für Haushalte"
          description="Berechne für 4 Haushalte über 7 Tage: Mittelwert, Median und Standardabweichung pro Haushalt, und finde den Haushalt mit dem höchsten Durchschnittsverbrauch."
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

        {/* --- Übung 5: CodingExercise — Korrelation --- */}
        <CodingExercise
          id="korrelation-coding"
          title="Korrelation berechnen"
          description="Berechne den Korrelationskoeffizienten zwischen Temperatur und Stromverbrauch. Extrahiere den r-Wert aus der Korrelationsmatrix."
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
            'np.corrcoef(x, y) gibt eine 2×2 Matrix zurück.',
            'Der r-Wert steht in korr_matrix[0, 1] (oder korr_matrix[1, 0]).',
          ]}
        />
      </main>
    </div>
  )
}
