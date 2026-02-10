import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import Lueckentext from '../components/common/Lueckentext'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import AxisAggregationVisualizer from '../components/visualizations/AxisAggregationVisualizer'
import BooleanMaskCombiner from '../components/visualizations/BooleanMaskCombiner'
import MultipleChoice from '../components/exercises/MultipleChoice'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import ShapePredictor from '../components/exercises/ShapePredictor'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

export default function ArrayOperationen() {
  useChapterTracking('array-operationen')
  const { createOnComplete } = useExerciseTracking('array-operationen', 7)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 4: Array-Operationen</h1>
        <p className="text-slate-600 mb-6">
          NumPy-Arrays ermöglichen <strong>elementweise Operationen</strong> — jede Berechnung wird
          automatisch auf alle Elemente angewendet. Im SmartEnergy-Szenario: Verbrauch × Preis =
          Kosten, und zwar für alle Haushalte und Stunden gleichzeitig.
        </p>

        {/* --- Theorie 1: Elementweise Operationen --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Elementweise Operationen</h2>
          <p className="text-slate-600 mb-3">
            Arithmetische Operatoren (<code className="text-sm bg-slate-100 px-1 rounded">+</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">-</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">*</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">/</code>) arbeiten elementweise —
            jedes Element des einen Arrays wird mit dem entsprechenden Element des anderen verrechnet.
            Das nennt man <em>Vektorisierung</em> (vectorization): eine Operation, alle Elemente, kein Loop nötig.
          </p>
          <CodeBlock
            title="Elementweise Multiplikation: Verbrauch × Preis"
            code={`import numpy as np

verbrauch = np.array([12.5, 8.3, 15.7, 9.1])  # kWh pro Stunde
preis = np.array([0.28, 0.35, 0.30, 0.25])     # Euro/kWh

# Elementweise Multiplikation
kosten = verbrauch * preis
print(kosten)  # [3.5  2.905 4.71  2.275]

# Weitere elementweise Operationen
print(verbrauch + 5)    # Jeder Wert + 5
print(verbrauch ** 2)   # Quadrieren
print(verbrauch > 10)   # Boolean-Array: [True, False, True, False]`}
          />
        </section>

        {/* --- Visualisierung: Elementweise Multiplikation --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Visualisierung: Elementweise Multiplikation</h2>
          <p className="text-slate-600 mb-3">
            Jedes Element wird einzeln multipliziert — Position für Position:
          </p>
          <div className="grid gap-4 md:grid-cols-3 items-start">
            <div>
              <ArrayVisualizer data={[12, 8, 16, 9]} label="verbrauch (kWh)" colorMode="heatmap" />
            </div>
            <div className="flex items-center justify-center text-2xl text-slate-400 font-bold pt-8">×</div>
            <div>
              <ArrayVisualizer data={[0.28, 0.35, 0.30, 0.25]} label="preis (€/kWh)" colorMode="heatmap" />
            </div>
          </div>
          <div className="mt-4">
            <ArrayVisualizer data={[3.36, 2.80, 4.80, 2.25]} label="= kosten (€)" colorMode="heatmap" />
          </div>
        </section>

        {/* --- Theorie 2: Logische Operatoren --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Logische Operatoren bei Arrays</h2>
          <p className="text-slate-600 mb-3">
            Achtung: Für Arrays müssen <code className="text-sm bg-slate-100 px-1 rounded">&</code> (und),{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">|</code> (oder) und{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">~</code> (nicht) verwendet werden — nicht{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">and</code>/{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">or</code>! Klammern um die Bedingungen
            sind Pflicht.
          </p>
          <CodeBlock
            title="Boolean-Filterung mit logischen Operatoren"
            code={`import numpy as np

verbrauch = np.array([8, 22, 15, 30, 5, 18])

# Falsch: and/or funktionieren NICHT mit Arrays!
# verbrauch > 10 and verbrauch < 25  → ValueError!

# Richtig: & und | mit Klammern
mittel = (verbrauch > 10) & (verbrauch < 25)
print(mittel)  # [False True True False False True]
print(verbrauch[mittel])  # [22 15 18]

# Negation mit ~
niedrig = ~(verbrauch > 15)
print(verbrauch[niedrig])  # [8 15 5]`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Boolean-Masken interaktiv kombinieren</h2>
          <p className="text-slate-600 mb-3">
            Probiere aus, wie <code className="text-sm bg-slate-100 px-1 rounded">&</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">|</code> und{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">~</code> auf Boolean-Masken wirken.
            Verschiebe die Schwellenwerte und beobachte, welche Werte übrig bleiben:
          </p>
          <BooleanMaskCombiner
            values={[8, 22, 15, 30, 5, 18, 42, 12]}
            label="Masken-Kombinator"
          />
        </section>

        {/* --- Theorie 3: Aggregation mit axis --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Aggregation mit axis</h2>
          <p className="text-slate-600 mb-3">
            Aggregationsfunktionen wie <code className="text-sm bg-slate-100 px-1 rounded">sum</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">mean</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">min</code>,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">max</code> können auf das gesamte
            Array oder entlang einer bestimmten Achse (<code className="text-sm bg-slate-100 px-1 rounded">axis</code>)
            angewendet werden. <strong>axis=0</strong>: über die Zeilen (pro Spalte),{' '}
            <strong>axis=1</strong>: über die Spalten (pro Zeile).
          </p>
          <CodeBlock
            title="Aggregation am SmartEnergy-Beispiel"
            code={`import numpy as np

# 3 Haushalte × 4 Stunden
verbrauch = np.array([
    [10, 15, 12, 8],
    [22, 18, 25, 20],
    [7,  9,  6, 11],
])

print(np.sum(verbrauch))           # 163 (alles)
print(np.sum(verbrauch, axis=0))   # [39 42 43 39] — pro Stunde
print(np.sum(verbrauch, axis=1))   # [45 85 33] — pro Haushalt
print(np.mean(verbrauch, axis=1))  # [11.25 21.25  8.25] — Durchschnitt pro HH`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Achsen-Aggregation interaktiv</h2>
          <p className="text-slate-600 mb-3">
            Klicke auf die Buttons, um zu sehen, wie <code className="text-sm bg-slate-100 px-1 rounded">axis=0</code> und{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">axis=1</code> die Aggregation beeinflussen:
          </p>
          <AxisAggregationVisualizer
            data={[[10, 15, 12, 8], [22, 18, 25, 20], [7, 9, 6, 11]]}
            label="Achsen-Trainer: 3 Haushalte × 4 Stunden"
            fn="sum"
          />
        </section>

        {/* --- Übung 1: MultipleChoice — Logische Operatoren --- */}
        <MultipleChoice
          id="logische-operatoren"
          question="Wie filtert man in NumPy alle Werte, die zwischen 10 und 25 liegen?"
          onComplete={createOnComplete('logische-operatoren')}
          options={[
            { text: 'verbrauch > 10 and verbrauch < 25', explanation: 'Falsch — `and` funktioniert nicht mit Arrays! Es gibt einen ValueError.' },
            { text: '(verbrauch > 10) & (verbrauch < 25)', explanation: 'Richtig! Der bitweise &-Operator mit Klammern ist die korrekte Syntax.' },
            { text: 'verbrauch > 10 & verbrauch < 25', explanation: 'Falsch — ohne Klammern bindet & stärker als > und <, was zu einem Fehler führt.' },
            { text: 'np.filter(verbrauch, 10, 25)', explanation: 'Falsch — np.filter existiert nicht. Boolean Indexing ist der Weg!' },
          ]}
          correctIndex={1}
        />

        {/* --- Übung 2: ArrayFill — Logische Verknüpfung + Filterung --- */}
        <ArrayFillExercise
          id="logische-verknuepfung-fill"
          title="Logische Verknüpfung und Filterung"
          description="verbrauch = [8, 22, 15, 30, 5, 18]. Was ergibt verbrauch[(verbrauch > 10) & (verbrauch < 25)]? Trage die gefilterten Werte ein."
          onComplete={createOnComplete('logische-verknuepfung-fill')}
          expected={[[22, 15, 18]]}
          prefilled={[[null, null, null]]}
        />

        {/* --- Übung 3: ArrayFill — axis=0 Ergebnis --- */}
        <ArrayFillExercise
          id="axis-result"
          title="Aggregation mit axis=0 vorhersagen"
          description="Gegeben: verbrauch = [[10, 15, 12], [22, 18, 25], [7, 9, 6]]. Was ergibt np.sum(verbrauch, axis=0)? (Summe pro Spalte)"
          onComplete={createOnComplete('axis-result')}
          expected={[[39, 42, 43]]}
          prefilled={[[null, null, null]]}
        />

        {/* --- Übung 4: ShapePredictor — Aggregation Shape --- */}
        <ShapePredictor
          id="aggregation-shape"
          title="Shape nach Aggregation vorhersagen"
          onComplete={createOnComplete('aggregation-shape')}
          context="data = np.ones((5, 24))  # 5 Haushalte × 24 Stunden"
          operation="ergebnis = np.mean(data, axis=1)"
          expectedShape={[5]}
          explanation="axis=1 aggregiert über die Spalten (24 Stunden) → ein Wert pro Zeile → Shape (5,)."
        />

        {/* --- Übung 5: Lückentext — Kosten berechnen --- */}
        <Lueckentext
          id="operationen-lueckentext"
          onComplete={createOnComplete('operationen-lueckentext')}
          segments={[
            'import numpy as np\n\nverbrauch = np.array([[10, 15], [22, 18]])\npreise = np.array([0.28, 0.35])\n\n# Kosten = Verbrauch × Preise (Broadcasting)\nkosten = verbrauch ',
            { id: 'op', answer: '*', hint: 'Welcher Operator multipliziert elementweise?' },
            ' preise\n\n# Gesamtkosten pro Haushalt\ngesamt = np.',
            { id: 'func', answer: 'sum', hint: 'Welche Funktion berechnet die Summe?' },
            '(kosten, axis=',
            { id: 'axis', answer: '1', hint: 'Über welche Achse summieren für „pro Haushalt"?' },
            ')',
          ]}
        />

        {/* --- Theorie-Hinweis: np.argmax / np.argmin --- */}
        <p className="text-slate-600 mb-6 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
          <strong>Tipp:</strong>{' '}
          <code className="text-sm bg-slate-100 px-1 rounded">np.argmax()</code> und{' '}
          <code className="text-sm bg-slate-100 px-1 rounded">np.argmin()</code> geben den <em>Index</em> des
          größten bzw. kleinsten Wertes zurück — nicht den Wert selbst. Nützlich, um z.B. die Stunde mit dem
          höchsten Verbrauch zu finden.
        </p>

        {/* --- Übung 6: CodingExercise — Filter + Aggregation --- */}
        <CodingExercise
          id="filter-aggregation-coding"
          title="Filtern und Aggregieren"
          description="Kombiniere Boolean Indexing mit Aggregation: (1) Filtere Spitzenwerte > 20, (2) berechne deren Durchschnitt, (3) finde Werte im mittleren Bereich (10–20) mit logischem &-Operator."
          onComplete={createOnComplete('filter-aggregation-coding')}
          fallbackOutput={"Spitzenwerte: [22 30 25]\nDurchschnitt Spitze: 25.67\nMittlerer Bereich: [12 15 18 14 11 20]"}
          starterCode={`import numpy as np

verbrauch = np.array([12, 8, 15, 22, 30, 5, 18, 25, 14, 11, 7, 20])

# 1. Spitzenwerte: alle Werte > 20
hoher_verbrauch = # Dein Code hier
print("Spitzenwerte:", hoher_verbrauch)

# 2. Durchschnitt der Spitzenwerte
durchschnitt_spitze = # Dein Code hier
print("Durchschnitt Spitze:", round(durchschnitt_spitze, 2))

# 3. Mittlerer Bereich: 10 <= Wert <= 20 (logisches UND)
mittlerer_bereich = # Dein Code hier
print("Mittlerer Bereich:", mittlerer_bereich)`}
          solution={`import numpy as np

verbrauch = np.array([12, 8, 15, 22, 30, 5, 18, 25, 14, 11, 7, 20])

hoher_verbrauch = verbrauch[verbrauch > 20]
print("Spitzenwerte:", hoher_verbrauch)

durchschnitt_spitze = np.mean(hoher_verbrauch)
print("Durchschnitt Spitze:", round(durchschnitt_spitze, 2))

mittlerer_bereich = verbrauch[(verbrauch >= 10) & (verbrauch <= 20)]
print("Mittlerer Bereich:", mittlerer_bereich)`}
          validationCode={`expected_hoch = np.array([22, 30, 25])
assert np.array_equal(hoher_verbrauch, expected_hoch), f"hoher_verbrauch sollte [22, 30, 25] sein, ist aber {hoher_verbrauch}"
assert abs(durchschnitt_spitze - np.mean(expected_hoch)) < 0.01, f"durchschnitt_spitze sollte {np.mean(expected_hoch):.2f} sein"
expected_mittel = np.array([12, 15, 18, 14, 11, 20])
assert np.array_equal(mittlerer_bereich, expected_mittel), f"mittlerer_bereich sollte {expected_mittel} sein"
print("Filter und Aggregation korrekt!")`}
          hints={[
            'Schau dir den CodeBlock zu „Boolean-Filterung" oben an: Wie filtert man Werte mit einer Bedingung direkt als Index?',
            'Du hast bereits ein gefiltertes Array — welche NumPy-Funktion berechnet den Mittelwert?',
            'Für den mittleren Bereich brauchst du ZWEI Bedingungen. Welchen Operator nutzt man bei Arrays statt „and"? Denk an die Klammern!',
          ]}
        />

        {/* --- Übung 7: CodingExercise — Stromkosten-Rechner --- */}
        <CodingExercise
          id="stromkosten-coding"
          title="Stromkosten-Rechner"
          description="Berechne für 4 Haushalte über 7 Tage: (1) die täglichen Kosten (Verbrauch × Preis), (2) die Gesamtkosten pro Haushalt, und (3) den Tag mit den höchsten Kosten (über alle Haushalte)."
          onComplete={createOnComplete('stromkosten-coding')}
          fallbackOutput={"Kosten-Shape: (4, 7)\nKosten pro HH: [27.38 31.42 22.15 28.06]\nTeuerster Tag: Index 4"}
          starterCode={`import numpy as np

np.random.seed(42)
# 4 Haushalte × 7 Tage Verbrauch (kWh)
verbrauch = np.random.uniform(5, 25, size=(4, 7))
# Tagespreise (Euro/kWh)
preise = np.array([0.28, 0.30, 0.25, 0.32, 0.35, 0.22, 0.20])

# 1. Tägliche Kosten berechnen (elementweise Multiplikation)
kosten = # Dein Code hier
print("Kosten-Shape:", kosten.shape)

# 2. Gesamtkosten pro Haushalt (Summe über axis=1)
kosten_pro_haushalt = # Dein Code hier
print("Kosten pro HH:", np.round(kosten_pro_haushalt, 2))

# 3. Tag mit den höchsten Gesamtkosten (über alle Haushalte summiert)
kosten_pro_tag = np.sum(kosten, axis=0)
teuerster_tag = # Dein Code hier (Index des teuersten Tages)
print("Teuerster Tag: Index", teuerster_tag)`}
          solution={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(5, 25, size=(4, 7))
preise = np.array([0.28, 0.30, 0.25, 0.32, 0.35, 0.22, 0.20])

kosten = verbrauch * preise
print("Kosten-Shape:", kosten.shape)

kosten_pro_haushalt = np.sum(kosten, axis=1)
print("Kosten pro HH:", np.round(kosten_pro_haushalt, 2))

kosten_pro_tag = np.sum(kosten, axis=0)
teuerster_tag = np.argmax(kosten_pro_tag)
print("Teuerster Tag: Index", teuerster_tag)`}
          validationCode={`assert kosten.shape == (4, 7), f"kosten.shape sollte (4, 7) sein, ist aber {kosten.shape}"
assert kosten_pro_haushalt.shape == (4,), f"kosten_pro_haushalt.shape sollte (4,) sein, ist aber {kosten_pro_haushalt.shape}"
expected_kosten = verbrauch * preise
assert np.allclose(kosten, expected_kosten), "kosten sollte verbrauch * preise sein"
assert np.allclose(kosten_pro_haushalt, np.sum(kosten, axis=1)), "kosten_pro_haushalt sollte Summe über axis=1 sein"
expected_tag = np.argmax(np.sum(kosten, axis=0))
assert teuerster_tag == expected_tag, f"teuerster_tag sollte {expected_tag} sein, ist aber {teuerster_tag}"
print("Stromkosten korrekt berechnet!")`}
          hints={[
            'Kosten = Verbrauch × Preis. Welcher Operator multipliziert zwei Arrays elementweise? NumPy kümmert sich um die Shape-Anpassung.',
            'Um pro Haushalt (Zeile) zu summieren, brauchst du np.sum mit dem richtigen axis-Parameter. Welche Achse steht für die Spalten?',
            'Den Tipp „argmax" findest du im blauen Hinweis-Kasten weiter oben. Was gibt diese Funktion zurück?',
          ]}
        />
      </main>
    </div>
  )
}
