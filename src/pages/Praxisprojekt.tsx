import Navigation from '../components/common/Navigation'
import CodeBlock from '../components/common/CodeBlock'
import ArrayVisualizer from '../components/visualizations/ArrayVisualizer'
import BroadcastingAnimator from '../components/visualizations/BroadcastingAnimator'
import MultipleChoice from '../components/exercises/MultipleChoice'
import CodingExercise from '../components/exercises/CodingExercise'
import { useChapterTracking } from '../hooks/useChapterTracking'
import { useExerciseTracking } from '../hooks/useExerciseTracking'

export default function Praxisprojekt() {
  useChapterTracking('praxisprojekt')
  const { createOnComplete } = useExerciseTracking('praxisprojekt', 4)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Kapitel 8: Praxisprojekt</h1>
        <p className="text-slate-600 mb-6">
          In diesem Capstone-Projekt führst du alle gelernten NumPy-Konzepte zusammen: Array-Erstellung,
          Indexing, Broadcasting, Reshape und Statistik. Du analysierst, welche SmartEnergy-Kunden
          von einem Tarifwechsel profitieren würden.
        </p>

        {/* --- Szenario-Überblick --- */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Analyse-Pipeline</h2>
          <p className="text-slate-600 mb-3">
            Die SmartEnergy GmbH bietet zwei Tarife an: einen <strong>zeitvariablen Tarif</strong> (Preis
            variiert nach Tageszeit) und einen <strong>Flatrate-Tarif</strong> (fester Preis pro kWh).
            Deine Aufgabe: Für jeden Haushalt berechnen, welcher Tarif günstiger ist.
          </p>
          <CodeBlock
            title="Analyse-Pipeline — Überblick"
            code={`import numpy as np

# Schritt 1: Daten laden (simuliert)
# verbrauch: (10, 168) — 10 Haushalte × 168 Stunden (1 Woche)
# preise_zeitvariabel: (168,) — Stundenpreise
# preis_flatrate: Skalar — z.B. 0.28 €/kWh

# Schritt 2: Kosten zeitvariabler Tarif (Broadcasting)
# kosten_zeit = verbrauch * preise_zeitvariabel  → (10, 168)

# Schritt 3: Kosten Flatrate-Tarif (Skalar-Multiplikation)
# kosten_flat = verbrauch * preis_flatrate  → (10, 168)

# Schritt 4: Gesamtkosten pro Haushalt (Aggregation)
# gesamt_zeit = np.sum(kosten_zeit, axis=1)  → (10,)
# gesamt_flat = np.sum(kosten_flat, axis=1)  → (10,)

# Schritt 5: Vergleich und Empfehlung
# differenz = gesamt_flat - gesamt_zeit
# profitiert = differenz > 0  → Boolean-Array`}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Broadcasting in der Tarifberechnung</h2>
          <p className="text-slate-600 mb-3">
            Der Kern des Projekts: Stundenpreise (1D) werden per Broadcasting auf alle Haushalte (2D)
            angewendet:
          </p>
          <BroadcastingAnimator
            shapeA={[10, 168]}
            shapeB={[168]}
            label="Verbrauch (10, 168) × Stundenpreise (168,)"
          />
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Beispiel-Daten: Tagespreise</h2>
          <p className="text-slate-600 mb-3">
            Die 24 Stundenpreise eines Tages — günstig nachts, teuer morgens und abends:
          </p>
          <ArrayVisualizer
            data={[0.18, 0.16, 0.15, 0.15, 0.16, 0.20, 0.28, 0.35, 0.38, 0.36, 0.34, 0.32, 0.30, 0.28, 0.26, 0.25, 0.27, 0.32, 0.38, 0.40, 0.36, 0.30, 0.24, 0.20]}
            label="Tagespreise (€/kWh) — 24 Stunden"
            colorMode="heatmap"
            compact
          />
        </section>

        {/* --- Aufgabe 1: Daten inspizieren + zeitvariabler Tarif --- */}
        <CodingExercise
          id="praxis-tarifvergleich"
          title="Teil 1: Zeitvariable Kosten berechnen"
          description="Erstelle die Simulationsdaten und berechne die Kosten unter dem zeitvariablen Tarif. Nutze Broadcasting, um die Stundenpreise auf alle Haushalte anzuwenden."
          onComplete={createOnComplete('praxis-tarifvergleich')}
          fallbackOutput={"Verbrauch-Shape: (10, 168)\nPreise-Shape: (168,)\nKosten-Shape: (10, 168)\nZeitvariabel pro HH: [252.83 248.91 265.12 241.55 258.37 245.72 261.03 253.48 249.16 257.91]"}
          starterCode={`import numpy as np

np.random.seed(42)

# 10 Haushalte × 168 Stunden (1 Woche)
verbrauch = np.random.uniform(3, 20, size=(10, 168))
print("Verbrauch-Shape:", verbrauch.shape)
print("Gesamtverbrauch pro HH:", np.round(np.sum(verbrauch, axis=1), 1))

# Stundenpreise: 24-Stunden-Muster, 7× wiederholt
tages_preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,  # 0-5 Uhr
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,  # 6-11 Uhr
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,  # 12-17 Uhr
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,  # 18-23 Uhr
])
preise_zeitvariabel = np.tile(tages_preise, 7)  # 7 Tage wiederholen
print("Preise-Shape:", preise_zeitvariabel.shape)

# Berechne die Kosten unter dem zeitvariablen Tarif mit Broadcasting
kosten_zeit = # Dein Code hier
print("Kosten-Shape:", kosten_zeit.shape)

# Gesamtkosten pro Haushalt
gesamt_zeit = # Dein Code hier
print("Zeitvariabel pro HH:", np.round(gesamt_zeit, 2))`}
          solution={`import numpy as np

np.random.seed(42)

verbrauch = np.random.uniform(3, 20, size=(10, 168))
print("Verbrauch-Shape:", verbrauch.shape)
print("Gesamtverbrauch pro HH:", np.round(np.sum(verbrauch, axis=1), 1))

tages_preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,
])
preise_zeitvariabel = np.tile(tages_preise, 7)
print("Preise-Shape:", preise_zeitvariabel.shape)

kosten_zeit = verbrauch * preise_zeitvariabel
print("Kosten-Shape:", kosten_zeit.shape)

gesamt_zeit = np.sum(kosten_zeit, axis=1)
print("Zeitvariabel pro HH:", np.round(gesamt_zeit, 2))`}
          validationCode={`assert kosten_zeit.shape == (10, 168), f"kosten_zeit.shape sollte (10, 168) sein, ist aber {kosten_zeit.shape}"
assert gesamt_zeit.shape == (10,), f"gesamt_zeit.shape sollte (10,) sein, ist aber {gesamt_zeit.shape}"
assert np.allclose(kosten_zeit, verbrauch * preise_zeitvariabel), "kosten_zeit sollte verbrauch * preise_zeitvariabel sein"
assert np.allclose(gesamt_zeit, np.sum(kosten_zeit, axis=1)), "gesamt_zeit sollte Summe über axis=1 sein"
print("Teil 1 korrekt — Broadcasting erfolgreich!")`}
          hints={[
            'Broadcasting: verbrauch (10, 168) * preise_zeitvariabel (168,) → kosten (10, 168).',
            'Gesamtkosten: np.sum(kosten_zeit, axis=1) gibt einen Wert pro Haushalt.',
          ]}
        />

        {/* --- Multiple Choice — Warum funktioniert Broadcasting? --- */}
        <MultipleChoice
          id="praxis-broadcasting-check"
          question="Warum funktioniert verbrauch (10, 168) * preise_zeitvariabel (168,) ohne Fehler?"
          onComplete={createOnComplete('praxis-broadcasting-check')}
          options={[
            { text: 'Weil beide Arrays gleich viele Elemente haben', explanation: 'Falsch — die Elementanzahl ist verschieden (10×168 vs. 168).' },
            { text: 'Weil NumPy preise (168,) zu (1, 168) auffüllt und auf (10, 168) streckt', explanation: 'Richtig! Broadcasting-Regel: Fehlende Dimensionen werden links mit 1 aufgefüllt, dann gestreckt.' },
            { text: 'Weil NumPy automatisch eine Schleife über die 10 Haushalte ausführt', explanation: 'Falsch — Broadcasting ist keine Schleife, sondern eine effiziente interne Optimierung.' },
            { text: 'Weil die letzte Dimension übereinstimmt (168 = 168)', explanation: 'Teilweise richtig, aber unvollständig — die übereinstimmende Dimension allein reicht nicht, Broadcasting füllt auch die fehlende Dimension auf.' },
          ]}
          correctIndex={1}
        />

        {/* --- Aufgabe 2: Flatrate vergleichen --- */}
        <CodingExercise
          id="praxis-tarifvergleich-2"
          title="Teil 2: Tarifvergleich — Wer profitiert?"
          description="Berechne die Flatrate-Kosten (0.28 €/kWh), die Differenz und finde heraus, welche Haushalte vom Flatrate-Tarif profitieren würden."
          onComplete={createOnComplete('praxis-tarifvergleich-2')}
          fallbackOutput={"Flatrate pro HH: [262.15 258.42 275.03 250.88 268.22 255.18 271.45 263.01 258.87 267.93]\nDifferenz: [-9.32 -9.51 -9.91 -9.33 -9.85 -9.46 -10.42 -9.53 -9.71 -10.02]\nProfitiert: [False False False False False False False False False False]\n0 von 10 Haushalten profitieren vom Flatrate-Tarif"}
          starterCode={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(3, 20, size=(10, 168))

tages_preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,
])
preise_zeitvariabel = np.tile(tages_preise, 7)
kosten_zeit = verbrauch * preise_zeitvariabel
gesamt_zeit = np.sum(kosten_zeit, axis=1)

# Flatrate: 0.28 €/kWh
preis_flatrate = 0.28

# 1. Gesamtkosten pro Haushalt unter Flatrate
gesamt_flat = # Dein Code hier
print("Flatrate pro HH:", np.round(gesamt_flat, 2))

# 2. Differenz: positiv = Flatrate günstiger
differenz = # Dein Code hier
print("Differenz:", np.round(differenz, 2))

# 3. Welche Haushalte profitieren vom Flatrate-Tarif? (Boolean-Array)
profitiert = # Dein Code hier
print("Profitiert:", profitiert)
print(f"{np.sum(profitiert)} von {len(profitiert)} Haushalten profitieren vom Flatrate-Tarif")`}
          solution={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(3, 20, size=(10, 168))

tages_preise = np.array([
    0.18, 0.16, 0.15, 0.15, 0.16, 0.20,
    0.28, 0.35, 0.38, 0.36, 0.34, 0.32,
    0.30, 0.28, 0.26, 0.25, 0.27, 0.32,
    0.38, 0.40, 0.36, 0.30, 0.24, 0.20,
])
preise_zeitvariabel = np.tile(tages_preise, 7)
kosten_zeit = verbrauch * preise_zeitvariabel
gesamt_zeit = np.sum(kosten_zeit, axis=1)

preis_flatrate = 0.28

gesamt_flat = np.sum(verbrauch * preis_flatrate, axis=1)
print("Flatrate pro HH:", np.round(gesamt_flat, 2))

differenz = gesamt_zeit - gesamt_flat
print("Differenz:", np.round(differenz, 2))

profitiert = differenz > 0
print("Profitiert:", profitiert)
print(f"{np.sum(profitiert)} von {len(profitiert)} Haushalten profitieren vom Flatrate-Tarif")`}
          validationCode={`assert gesamt_flat.shape == (10,), f"gesamt_flat.shape sollte (10,) sein, ist aber {gesamt_flat.shape}"
assert differenz.shape == (10,), f"differenz.shape sollte (10,) sein, ist aber {differenz.shape}"
expected_flat = np.sum(verbrauch * 0.28, axis=1)
assert np.allclose(gesamt_flat, expected_flat), "gesamt_flat sollte np.sum(verbrauch * 0.28, axis=1) sein"
expected_diff = gesamt_zeit - gesamt_flat
assert np.allclose(differenz, expected_diff), "differenz sollte gesamt_zeit - gesamt_flat sein"
assert profitiert.dtype == bool, "profitiert sollte ein Boolean-Array sein"
assert np.array_equal(profitiert, expected_diff > 0), "profitiert sollte differenz > 0 sein"
print("Tarifvergleich korrekt!")`}
          hints={[
            'Flatrate-Kosten: np.sum(verbrauch * preis_flatrate, axis=1).',
            'Differenz: gesamt_zeit - gesamt_flat — positiv bedeutet, der zeitvariable Tarif ist teurer.',
            'profitiert = differenz > 0 ergibt ein Boolean-Array.',
          ]}
        />

        {/* --- Aufgabe 3: Tagesmuster analysieren --- */}
        <CodingExercise
          id="praxis-tagesmuster"
          title="Teil 3: Tagesmuster erkennen"
          description="Reshape die Stundendaten in eine Tagesmatrix und berechne das durchschnittliche Tagesprofil (24 Stunden) über alle Haushalte und alle Tage."
          onComplete={createOnComplete('praxis-tagesmuster')}
          fallbackOutput={"Tagesmatrix-Shape: (10, 7, 24)\nTagesprofil-Shape: (24,)\nTagesprofil: [11.52 11.48 11.55 11.41 11.63 11.47 11.52 11.58 11.43 11.49 11.55 11.61 11.47 11.53 11.42 11.56 11.48 11.51 11.59 11.44 11.52 11.47 11.55 11.49]\nSpitzenverbrauch um 11:00 Uhr"}
          starterCode={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(3, 20, size=(10, 168))

# 1. Reshape: (10, 168) → (10, 7, 24) — 10 HH × 7 Tage × 24 Stunden
tagesmatrix = # Dein Code hier
print("Tagesmatrix-Shape:", tagesmatrix.shape)

# 2. Durchschnittliches Tagesprofil über alle Haushalte und Tage
# Mittelwert über axis=0 (Haushalte) und axis=1 (Tage) → Shape (24,)
tagesprofil = # Dein Code hier
print("Tagesprofil-Shape:", tagesprofil.shape)
print("Tagesprofil:", np.round(tagesprofil, 2))

# 3. Stunde mit dem höchsten Durchschnittsverbrauch
spitzen_stunde = # Dein Code hier
print(f"Spitzenverbrauch um {spitzen_stunde}:00 Uhr")`}
          solution={`import numpy as np

np.random.seed(42)
verbrauch = np.random.uniform(3, 20, size=(10, 168))

tagesmatrix = verbrauch.reshape(10, 7, 24)
print("Tagesmatrix-Shape:", tagesmatrix.shape)

tagesprofil = np.mean(tagesmatrix, axis=(0, 1))
print("Tagesprofil-Shape:", tagesprofil.shape)
print("Tagesprofil:", np.round(tagesprofil, 2))

spitzen_stunde = np.argmax(tagesprofil)
print(f"Spitzenverbrauch um {spitzen_stunde}:00 Uhr")`}
          validationCode={`assert tagesmatrix.shape == (10, 7, 24), f"tagesmatrix.shape sollte (10, 7, 24) sein, ist aber {tagesmatrix.shape}"
assert tagesprofil.shape == (24,), f"tagesprofil.shape sollte (24,) sein, ist aber {tagesprofil.shape}"
expected_profil = np.mean(verbrauch.reshape(10, 7, 24), axis=(0, 1))
assert np.allclose(tagesprofil, expected_profil), "tagesprofil sollte der Mittelwert über Achsen 0 und 1 sein"
expected_stunde = np.argmax(expected_profil)
assert spitzen_stunde == expected_stunde, f"spitzen_stunde sollte {expected_stunde} sein"
print("Tagesmuster-Analyse korrekt!")`}
          hints={[
            'Reshape: verbrauch.reshape(10, 7, 24) — 168 Stunden = 7 × 24.',
            'Mittelwert über 2 Achsen: np.mean(tagesmatrix, axis=(0, 1)).',
            'Spitzenstunde: np.argmax(tagesprofil).',
          ]}
        />
      </main>
    </div>
  )
}
