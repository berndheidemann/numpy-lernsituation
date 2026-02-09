import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import IndexingHighlighter from '../components/visualizations/IndexingHighlighter'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import MultipleChoice from '../components/exercises/MultipleChoice'
import CodingExercise from '../components/exercises/CodingExercise'
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

        {/* --- Theorie: Indexing-Arten --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Indexing-Arten im Überblick</h2>
          <p className="text-slate-600 mb-3">
            NumPy bietet drei Arten des Zugriffs: <strong>Basic Indexing</strong> (einzelne Elemente
            und Slices), <strong>Fancy Indexing</strong> (Zugriff über Integer-Arrays) und{' '}
            <strong>Boolean Indexing</strong> (Zugriff über Masken). Wichtig: Basic Indexing liefert
            einen <em>View</em> (Verweis auf dieselben Daten), Fancy Indexing eine <em>Kopie</em>.
          </p>
          <CodeBlock
            title="Indexing-Arten mit SmartEnergy-Daten"
            code={`import numpy as np

verbrauch = np.array([
    [10, 20, 30, 40, 50],
    [11, 22, 33, 44, 55],
    [12, 24, 36, 48, 60],
    [13, 26, 39, 52, 65],
])

# Basic Indexing — Einzelwert
print(verbrauch[1, 2])        # 33 (Haushalt 1, Stunde 2)

# Slicing — Teilbereich (View!)
teil = verbrauch[1:3, 2:4]    # [[33, 44], [36, 48]]
print(teil)

# Fancy Indexing — Bestimmte Zeilen (Kopie!)
auswahl = verbrauch[[0, 3]]   # Haushalt 0 und 3

# Boolean Indexing — Filtern (Kopie!)
maske = verbrauch > 40
hohe_werte = verbrauch[maske]  # Alle Werte über 40 kWh
print(hohe_werte)`}
          />
        </section>

        {/* --- Übung 1: ArrayFill — Slicing-Ergebnis vorhersagen --- */}
        <ArrayFillExercise
          id="slicing-result-1"
          title="Slicing-Ergebnis vorhersagen"
          description="Was ergibt verbrauch[1:3, 2:4]? Fülle die fehlenden Werte aus. (Zeilen 1–2, Spalten 2–3 des obigen Arrays)"
          expected={[[33, 44], [36, 48]]}
          prefilled={[[null, null], [null, null]]}
        />

        {/* --- Übung 2: Multiple Choice — View oder Kopie? --- */}
        <MultipleChoice
          id="view-or-copy"
          question="Welche Indexing-Operation erzeugt eine Kopie (statt eines Views)?"
          options={[
            { text: 'verbrauch[1:3, 2:4]', explanation: 'Falsch — Slicing erzeugt einen View. Änderungen am Slice ändern das Original!' },
            { text: 'verbrauch[[0, 2]]', explanation: 'Richtig! Fancy Indexing mit Integer-Arrays erzeugt immer eine Kopie.' },
            { text: 'verbrauch[:, 0]', explanation: 'Falsch — auch einfaches Spalten-Slicing erzeugt einen View.' },
            { text: 'verbrauch[0]', explanation: 'Falsch — einfaches Zeilen-Indexing erzeugt einen View auf die erste Zeile.' },
          ]}
          correctIndex={1}
        />

        {/* --- Übung 3: CodingExercise — Haushalt-Daten extrahieren --- */}
        <CodingExercise
          id="indexing-coding"
          title="Haushalt-Daten extrahieren"
          description="Gegeben ist ein Verbrauchsarray von 4 Haushalten über 5 Stunden. Extrahiere: (1) den Verbrauch von Haushalt 2 in Stunde 3, (2) alle Werte von Haushalt 0, (3) alle Werte über 40 kWh mit Boolean Indexing."
          starterCode={`import numpy as np

verbrauch = np.array([
    [10, 20, 30, 40, 50],
    [11, 22, 33, 44, 55],
    [12, 24, 36, 48, 60],
    [13, 26, 39, 52, 65],
])

# 1. Einzelwert: Haushalt 2, Stunde 3
einzelwert = # Dein Code hier
print("Einzelwert:", einzelwert)

# 2. Alle Stunden von Haushalt 0
haushalt_0 = # Dein Code hier
print("Haushalt 0:", haushalt_0)

# 3. Alle Werte über 40 kWh (Boolean Indexing)
hohe_werte = # Dein Code hier
print("Hohe Werte:", hohe_werte)`}
          solution={`import numpy as np

verbrauch = np.array([
    [10, 20, 30, 40, 50],
    [11, 22, 33, 44, 55],
    [12, 24, 36, 48, 60],
    [13, 26, 39, 52, 65],
])

einzelwert = verbrauch[2, 3]
print("Einzelwert:", einzelwert)

haushalt_0 = verbrauch[0]
print("Haushalt 0:", haushalt_0)

hohe_werte = verbrauch[verbrauch > 40]
print("Hohe Werte:", hohe_werte)`}
          validationCode={`assert einzelwert == 48, f"einzelwert sollte 48 sein, ist aber {einzelwert}"
assert np.array_equal(haushalt_0, np.array([10, 20, 30, 40, 50])), f"haushalt_0 sollte [10, 20, 30, 40, 50] sein"
expected_hohe = np.array([40, 50, 44, 55, 48, 60, 52, 65])
assert np.array_equal(np.sort(hohe_werte), np.sort(expected_hohe)), "hohe_werte sollte alle Werte > 40 enthalten"
print("Alle Extraktionen korrekt!")`}
          hints={[
            'Einzelwert: verbrauch[zeile, spalte] — Haushalt 2 = Zeile 2, Stunde 3 = Spalte 3.',
            'Eine ganze Zeile: verbrauch[zeile] oder verbrauch[zeile, :].',
            'Boolean Indexing: verbrauch[verbrauch > 40] filtert alle Werte, die die Bedingung erfüllen.',
          ]}
        />
      </main>
    </div>
  )
}
