import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import Lueckentext from '../components/common/Lueckentext'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import IndexingHighlighter from '../components/visualizations/IndexingHighlighter'
import ArrayFillExercise from '../components/exercises/ArrayFillExercise'
import MultipleChoice from '../components/exercises/MultipleChoice'
import DragDropExercise from '../components/exercises/DragDropExercise'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

const sampleData = [
  [10, 20, 30, 40, 50],
  [11, 22, 33, 44, 55],
  [12, 24, 36, 48, 60],
  [13, 26, 39, 52, 65],
]

export default function IndexingSlicing() {
  useChapterTracking('indexing-slicing')
  const { createOnComplete } = useExerciseTracking('indexing-slicing', 9)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
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

        {/* --- Theorie: Negative Indices und Schrittweite --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Negative Indices und Schrittweite</h2>
          <p className="text-slate-600 mb-3">
            Negative Indices zählen vom Ende des Arrays. Der Index{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">-1</code> ist das letzte Element,{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">-2</code> das vorletzte usw.
            Mit der <strong>Schrittweite</strong> (step) im Slicing{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">[start:stop:step]</code> kannst du
            jedes n-te Element auswählen oder das Array umkehren.
          </p>
          <CodeBlock
            title="Negative Indices und Schrittweite"
            code={`import numpy as np

preise = np.array([0.18, 0.22, 0.30, 0.35, 0.28, 0.20])

# Negative Indices — vom Ende zählen
print(preise[-1])     # 0.20 (letztes Element)
print(preise[-3:])    # [0.35, 0.28, 0.20] (letzte 3)

# Schrittweite
print(preise[::2])    # [0.18, 0.30, 0.28] (jedes 2. Element)
print(preise[::-1])   # [0.20, 0.28, 0.35, 0.30, 0.22, 0.18] (umgekehrt)

# 2D mit Schrittweite: jede 2. Zeile und Spalte
data = np.arange(16).reshape(4, 4)
print(data[::2, ::2])  # [[0, 2], [8, 10]]`}
          />
          <div className="mt-4">
            <p className="text-sm text-slate-500 mb-2">Negative Indices — positive und negative Zählung:</p>
            <div className="overflow-x-auto">
              <svg width={420} height={80} viewBox="0 0 420 80" className="select-none">
                {[0.18, 0.22, 0.30, 0.35, 0.28, 0.20].map((v, i) => {
                  const x = 20 + i * 66
                  const isLast3 = i >= 3
                  return (
                    <g key={i}>
                      <rect x={x} y={24} width={56} height={32} rx={4}
                        fill={isLast3 ? '#bbf7d0' : '#e2e8f0'} stroke={isLast3 ? '#16a34a' : '#cbd5e1'} strokeWidth={isLast3 ? 2 : 1} />
                      <text x={x + 28} y={45} textAnchor="middle" fontSize={12} fontFamily="monospace" className="fill-slate-800">{v}</text>
                      <text x={x + 28} y={16} textAnchor="middle" fontSize={9} fontFamily="monospace" className="fill-blue-500">{i}</text>
                      <text x={x + 28} y={72} textAnchor="middle" fontSize={9} fontFamily="monospace" className="fill-red-500">{i - 6}</text>
                    </g>
                  )
                })}
                <text x={0} y={16} fontSize={9} className="fill-blue-500" fontFamily="monospace">+</text>
                <text x={0} y={72} fontSize={9} className="fill-red-500" fontFamily="monospace">−</text>
              </svg>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <span className="text-blue-500">Blau</span>: positive Indices |{' '}
              <span className="text-red-500">Rot</span>: negative Indices |{' '}
              <span className="text-green-600">Grün</span>: preise[-3:] Ergebnis
            </p>
          </div>
        </section>

        {/* --- Übung 1: ArrayFill — Slicing-Ergebnis vorhersagen --- */}
        <ArrayFillExercise
          id="slicing-result-1"
          title="Slicing-Ergebnis vorhersagen"
          description="Was ergibt verbrauch[1:3, 2:4]? Fülle die fehlenden Werte aus. (Zeilen 1–2, Spalten 2–3 des obigen Arrays)"
          onComplete={createOnComplete('slicing-result-1')}
          expected={[[33, 44], [36, 48]]}
          prefilled={[[null, null], [null, null]]}
        />

        {/* --- Übung 2: ArrayFill — Negative Indices --- */}
        <ArrayFillExercise
          id="negative-indices-fill"
          title="Negative Indices vorhersagen"
          description="preise = [0.18, 0.22, 0.30, 0.35, 0.28, 0.20]. Was ergibt preise[-3:]? (Die letzten 3 Elemente)"
          onComplete={createOnComplete('negative-indices-fill')}
          expected={[[0.35, 0.28, 0.20]]}
          prefilled={[[null, null, null]]}
        />

        {/* --- Übung 3: Lückentext — Slicing-Syntax --- */}
        <Lueckentext
          id="slicing-lueckentext"
          onComplete={createOnComplete('slicing-lueckentext')}
          segments={[
            'import numpy as np\n\ndata = np.arange(24)\n\n# Jedes 2. Element auswählen\njedes_zweite = data[::',
            { id: 'step', answer: '2', hint: 'Welche Schrittweite wählt jedes zweite Element?' },
            ']\n\n# Array umkehren\numgekehrt = data[::',
            { id: 'reverse', answer: '-1', hint: 'Welche Schrittweite kehrt die Reihenfolge um?' },
            ']\n\n# Letzte 6 Elemente (mit negativem Index)\nletzte_6 = data[',
            { id: 'neg', answer: '-6', hint: 'Ab welchem negativen Index beginnen die letzten 6 Elemente?' },
            ':]',
          ]}
        />

        {/* --- Übung 4: Multiple Choice — View oder Kopie? --- */}
        <MultipleChoice
          id="view-or-copy"
          question="Welche Indexing-Operation erzeugt eine Kopie (statt eines Views)?"
          onComplete={createOnComplete('view-or-copy')}
          options={[
            { text: 'verbrauch[1:3, 2:4]', explanation: 'Falsch — Slicing erzeugt einen View. Änderungen am Slice ändern das Original!' },
            { text: 'verbrauch[[0, 2]]', explanation: 'Richtig! Fancy Indexing mit Integer-Arrays erzeugt immer eine Kopie.' },
            { text: 'verbrauch[:, 0]', explanation: 'Falsch — auch einfaches Spalten-Slicing erzeugt einen View.' },
            { text: 'verbrauch[0]', explanation: 'Falsch — einfaches Zeilen-Indexing erzeugt einen View auf die erste Zeile.' },
          ]}
          correctIndex={1}
        />

        {/* --- Theorie: Boolean Indexing im Detail --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Boolean Indexing im Detail</h2>
          <p className="text-slate-600 mb-3">
            Boolean Indexing (Masken-basierter Zugriff) funktioniert in drei Schritten:
            (1) <strong>Vergleich</strong> erzeugt ein Boolean-Array (Maske), (2) <strong>Maske</strong> enthält{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">True</code>/<code className="text-sm bg-slate-100 px-1 rounded">False</code> für
            jedes Element, (3) <strong>Indexing</strong> mit der Maske filtert nur die{' '}
            <code className="text-sm bg-slate-100 px-1 rounded">True</code>-Elemente heraus.
          </p>
          <CodeBlock
            title="Boolean Indexing Schritt für Schritt"
            code={`import numpy as np

verbrauch = np.array([12, 8, 15, 22, 18, 9, 14, 11, 7, 20])

# Schritt 1: Vergleich erzeugt eine Boolean-Maske
maske = verbrauch >= 15
print("Maske:", maske)
# [False, False, True, True, True, False, False, False, False, True]

# Schritt 2: Maske als Index verwenden → nur True-Werte
hoher_verbrauch = verbrauch[maske]
print("Gefiltert:", hoher_verbrauch)  # [15, 22, 18, 20]

# Kurzform: Vergleich direkt in den Index
print(verbrauch[verbrauch >= 15])     # [15, 22, 18, 20]`}
          />
          <div className="mt-4">
            <p className="text-sm text-slate-600 mb-2 font-medium">Dreischritt-Visualisierung:</p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <ArrayVisualizer
                  data={[12, 8, 15, 22, 18, 9, 14, 11, 7, 20]}
                  label="1. Original-Array"
                  colorMode="heatmap"
                  compact
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">2. Boolean-Maske (≥ 15)</p>
                <div className="overflow-x-auto">
                  <svg width={370} height={46} viewBox="0 0 370 46" className="select-none">
                    {[false, false, true, true, true, false, false, false, false, true].map((v, i) => (
                      <g key={i}>
                        <rect x={4 + i * 36} y={4} width={34} height={34} rx={4}
                          fill={v ? '#bbf7d0' : '#fecaca'} stroke={v ? '#16a34a' : '#dc2626'} strokeWidth={1} />
                        <text x={4 + i * 36 + 17} y={26} textAnchor="middle" fontSize={9} fontFamily="monospace"
                          className={v ? 'fill-green-800' : 'fill-red-800'}>{v ? 'T' : 'F'}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
              <div>
                <ArrayVisualizer
                  data={[15, 22, 18, 20]}
                  label="3. Gefiltertes Ergebnis"
                  colorMode="heatmap"
                  compact
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Übung 5: MultipleChoice — Boolean-Maske --- */}
        <MultipleChoice
          id="boolean-maske-mc"
          question="Was ergibt np.array([10, 20, 30, 40]) > 25?"
          onComplete={createOnComplete('boolean-maske-mc')}
          options={[
            { text: '[True, True, True, True]', explanation: 'Falsch — 10 und 20 sind nicht größer als 25.' },
            { text: '[False, True, True, True]', explanation: 'Falsch — 20 ist nicht größer als 25.' },
            { text: '[False, False, True, True]', explanation: 'Richtig! Nur 30 und 40 sind größer als 25.' },
            { text: '[10, 20, 30, 40]', explanation: 'Falsch — ein Vergleich liefert immer ein Boolean-Array, keine Zahlen.' },
          ]}
          correctIndex={2}
        />

        {/* --- Übung 6: ArrayFill — Boolean Indexing Ergebnis --- */}
        <ArrayFillExercise
          id="boolean-mask-result"
          title="Boolean Indexing Ergebnis vorhersagen"
          description="verbrauch = [12, 8, 15, 22, 18, 9, 14, 11, 7, 20]. Was ergibt verbrauch[verbrauch >= 15]? Trage die gefilterten Werte ein."
          onComplete={createOnComplete('boolean-mask-result')}
          expected={[[15, 22, 18, 20]]}
          prefilled={[[null, null, null, null]]}
        />

        {/* --- Übung 7: DragDrop — Indexing-Arten zuordnen --- */}
        <DragDropExercise
          id="indexing-arten-zuordnen"
          title="Indexing-Arten zuordnen"
          description="Ordne jeden Code-Ausdruck der passenden Indexing-Art zu."
          onComplete={createOnComplete('indexing-arten-zuordnen')}
          pairs={[
            { itemId: 'code-basic', itemLabel: 'arr[2, 3]', zoneId: 'zone-basic', zoneLabel: 'Basic Indexing' },
            { itemId: 'code-slicing', itemLabel: 'arr[1:4, ::2]', zoneId: 'zone-slicing', zoneLabel: 'Slicing' },
            { itemId: 'code-fancy', itemLabel: 'arr[[0, 2, 4]]', zoneId: 'zone-fancy', zoneLabel: 'Fancy Indexing' },
            { itemId: 'code-boolean', itemLabel: 'arr[arr > 10]', zoneId: 'zone-boolean', zoneLabel: 'Boolean Indexing' },
          ]}
        />

        {/* --- Übung 8: Lückentext — Boolean Indexing --- */}
        <Lueckentext
          id="boolean-indexing-lueckentext"
          onComplete={createOnComplete('boolean-indexing-lueckentext')}
          segments={[
            'import numpy as np\n\nverbrauch = np.array([8, 22, 15, 30, 5, 18])\n\n# Maske: alle Werte größer als 15\nmaske = verbrauch ',
            { id: 'op', answer: '>', hint: 'Welcher Vergleichsoperator prüft „größer als"?' },
            ' ',
            { id: 'wert', answer: '15', hint: 'Über welchem Schwellwert soll gefiltert werden?' },
            '\n\n# Gefilterte Werte extrahieren\nhoher_verbrauch = verbrauch[',
            { id: 'var', answer: 'maske', hint: 'Welche Variable enthält die Boolean-Maske?' },
            ']\nprint(hoher_verbrauch)  # [22 30 18]',
          ]}
        />

        {/* --- Übung 9: CodingExercise — Haushalt-Daten extrahieren --- */}
        <CodingExercise
          id="indexing-coding"
          title="Haushalt-Daten extrahieren"
          description="Gegeben ist ein Verbrauchsarray von 4 Haushalten über 5 Stunden. Extrahiere: (1) den Verbrauch von Haushalt 2 in Stunde 3, (2) alle Werte von Haushalt 0, (3) alle Werte über 40 kWh mit Boolean Indexing."
          onComplete={createOnComplete('indexing-coding')}
          fallbackOutput={"Einzelwert: 48\nHaushalt 0: [10 20 30 40 50]\nHohe Werte: [44 50 48 55 60 52 65]"}
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
