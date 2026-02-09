# Übungsideen — Interaktive NumPy-Lernplattform

> **Szenario-Kontext:** Alle Übungen basieren auf dem durchgängigen Szenario **„SmartEnergy GmbH"** (siehe CLAUDE.md). Datensätze: Stündliche Stromverbrauchsdaten von Haushalten, Kundendaten (Tarif, Haushaltsgröße, Region), Wetterdaten (Temperatur, Sonnenstunden), Preisdaten (stundenbasierte Strompreise).
>
> **Legende:**
> - `[MVP]` = Must-have für die erste Version der Plattform
> - `[Erweiterung]` = Nice-to-have, wird nach dem MVP umgesetzt

---

## Kapitelübergreifend

### 1. NumPy-Funktionen-Zuordner [Level 1 — Reproduktion] [MVP]
Verschiedene Aufgabenbeschreibungen werden angezeigt (z.B. „Array mit Nullen erstellen", „Durchschnitt berechnen", „Array umformen"). Schüler ziehen per Drag & Drop die passende NumPy-Funktion (`np.zeros`, `np.mean`, `np.reshape`) zur Beschreibung. Dient als Wiederholung und Schnellreferenz.
**SmartEnergy-Beispiel:** „Durchschnittsverbrauch aller Haushalte berechnen" → `np.mean`, „Verbrauchsdaten in Tagesmatrix umwandeln" → `reshape`, „Alle Verbrauchswerte über 50 kWh filtern" → Boolean Indexing.

### 2. Bug-Spotter [Level 2 — Transfer] [MVP]
Ein Code-Snippet mit einem typischen NumPy-Fehler wird angezeigt (aus der Fehler-Liste in skills.md Abschnitt 8.7). Schüler klicken auf die fehlerhafte Zeile und wählen den Fehlertyp aus einer Liste. Bei korrekter Antwort wird die Erklärung eingeblendet.
**SmartEnergy-Beispiel:**
```python
import numpy as np
verbrauch = np.array([12.5, 18.3, 9.4, 15.6])
hoher_verbrauch = verbrauch > 10 and verbrauch < 20  # Fehler: 'and' statt '&'
```

### 3. Cheat-Sheet-Builder [Level 1 — Reproduktion] [Erweiterung]
Interaktives Cheat-Sheet: Schüler ordnen Code-Beispiele den richtigen Kategorien zu (Erstellung, Indexing, Operationen, Statistik). Am Ende entsteht ein persönliches Nachschlagewerk, das als PDF exportiert werden kann.

---

## Kapitel 1: Warum NumPy?

### 1. Performance-Rennen (Live-Benchmark) [Level 1 — Reproduktion] [MVP]
Interaktiver Benchmark: Links Python-Listen-Code, rechts NumPy-Code für dieselbe Operation (z.B. Summe von 1.000.000 Elementen). Ein Slider ändert die Arraygröße. Per Klick auf „Start" werden beide Varianten via Pyodide ausgeführt, und ein animiertes Balkendiagramm zeigt die Ausführungszeiten. Der Speedup-Faktor wird prominent angezeigt.
**SmartEnergy-Beispiel:** „Berechne die Summe aller Stromverbrauchswerte von 1.000 Haushalten über ein Jahr (8.760.000 Werte)." Python-Liste: ~800ms, NumPy: ~5ms → Speedup: 160x.

### 2. Listen vs. Arrays — Vergleichs-Quiz [Level 1 — Reproduktion] [MVP]
Nebeneinander werden ein Python-Listen-Codeblock und ein NumPy-Codeblock gezeigt. Multiple-Choice-Fragen: Was ist der Output? Welcher Code ist schneller? Warum? Schüler lernen die konzeptuellen Unterschiede (homogener Typ, zusammenhängender Speicher, Vektorisierung).
**SmartEnergy-Beispiel:**
```python
# Python-Liste
verbrauch = [12.5, 18.3, 9.4, 15.6]
ergebnis = [v * 0.30 for v in verbrauch]

# NumPy
verbrauch = np.array([12.5, 18.3, 9.4, 15.6])
ergebnis = verbrauch * 0.30
```
Frage: „Welcher Code skaliert besser auf 1 Million Werte?"

### 3. Vektorisierung verstehen [Level 2 — Transfer] [MVP]
Animierte SVG-Visualisierung: Links eine Python-Schleife, die Element für Element verarbeitet (Elemente leuchten nacheinander auf). Rechts NumPy-Vektorisierung, bei der alle Elemente gleichzeitig verarbeitet werden (alle leuchten auf einmal). Der Schüler kann die Animationsgeschwindigkeit steuern und die Arraygröße ändern.
**SmartEnergy-Beispiel:** „Berechne die Stromkosten: Verbrauch × Preis pro kWh" — einmal als Schleife, einmal vektorisiert.

### 4. Umschreiben-Challenge [Level 2 — Transfer] [Erweiterung]
Schüler erhalten Python-Listen-Code und müssen ihn im Live-Editor in äquivalenten NumPy-Code umschreiben. Automatische Validierung prüft, ob das Ergebnis identisch ist.
**SmartEnergy-Beispiel:** Eine for-Schleife, die den Durchschnittsverbrauch pro Haushalt berechnet → mit `np.mean(data, axis=1)` in einer Zeile.

---

## Kapitel 2: Array-Grundlagen

### 1. Array-Attribut-Explorer [Level 1 — Reproduktion] [MVP]
Ein Array wird als SVG-Gitter dargestellt. Daneben stehen die Attribute `shape`, `ndim`, `size`, `dtype` als leere Felder. Schüler füllen die korrekten Werte ein. Bei jeder korrekten Eingabe wird das entsprechende Attribut im SVG visuell hervorgehoben (z.B. `shape` markiert Zeilen und Spalten, `size` zählt alle Zellen).
**SmartEnergy-Beispiel:** Array mit Verbrauchsdaten von 5 Haushalten über 24 Stunden → Shape: (5, 24), ndim: 2, size: 120, dtype: float64.

### 2. Array-Baukasten (Drag & Drop) [Level 1 — Reproduktion] [MVP]
Verschiedene NumPy-Erzeugungs-Funktionen (`np.zeros`, `np.ones`, `np.arange`, `np.linspace`, `np.full`, `np.eye`) werden als Karten angezeigt. Dazu werden Ziel-Arrays als SVG-Gitter dargestellt. Schüler ziehen die passende Funktion zum Array und geben die Parameter ein.
**SmartEnergy-Beispiele:**
- Ein 3×3-Array mit lauter Einsen → `np.ones((3, 3))`
- Ein Array [0, 5, 10, 15, 20] → `np.arange(0, 25, 5)` oder `np.linspace(0, 20, 5)`
- Ein 24er-Array für Stundenpreise → `np.zeros(24)` als Startpunkt

### 3. Dtype-Detektiv (Timed Challenge) [Level 1 — Reproduktion] [MVP]
Unter Zeitdruck (30 Sekunden, 10 Fragen): Ein `np.array(…)`-Aufruf wird gezeigt, Schüler wählen per Klick den resultierenden `dtype`. Trainiert das Verständnis der automatischen Typ-Erkennung.
**SmartEnergy-Beispiele:**
- `np.array([1, 2, 3])` → int64
- `np.array([1.0, 2, 3])` → float64 (ein Float „infiziert" alle)
- `np.array([True, False, True])` → bool
- `np.array([1, 2, "drei"])` → `<U21` (String!)

### 4. Erstes Array erstellen (Live-Coding) [Level 2 — Transfer] [MVP]
Geführte Coding-Aufgabe: Schüler erstellen ein 2D-Array mit simulierten Verbrauchsdaten und inspizieren es mit `shape`, `ndim`, `size`, `dtype`. Automatische Validierung prüft Shape und Dtype.
**SmartEnergy-Aufgabe:** „Erstelle ein NumPy-Array `verbrauch` mit Shape (4, 7), das die täglichen Stromverbräuche von 4 Haushalten über eine Woche enthält. Verwende `np.random.uniform(5, 25, size=(4, 7))` für realistische Werte zwischen 5 und 25 kWh."

### 5. Dimensions-Visualizer [Level 1 — Reproduktion] [Erweiterung]
Interaktive SVG-Komponente: Schüler klicken auf „1D", „2D" oder „3D" und sehen die entsprechende Visualisierung. Per Slider können sie die Größen der Dimensionen ändern und beobachten, wie sich Shape und Size ändern. Vertieft das Verständnis von Dimensionen als räumliches Konzept.

---

## Kapitel 3: Indexing & Slicing

### 1. Indexing-Highlighter (Interaktiv) [Level 1 — Reproduktion] [MVP]
Ein 2D-Array wird als SVG-Gitter angezeigt (mit Zeilen- und Spaltenindizes). Darunter ein Eingabefeld für eine Slicing-Expression. Bei Eingabe werden die selektierten Elemente farblich hervorgehoben. Umgekehrt: Schüler markieren Zellen per Klick und müssen die passende Slicing-Expression formulieren.
**SmartEnergy-Beispiel:** 7×24-Array (Wochentage × Stunden). „Markiere den Verbrauch von Montag 8:00 bis 17:00" → `verbrauch[0, 8:17]`. „Markiere den Verbrauch aller Tage um 12:00 Uhr" → `verbrauch[:, 12]`.

### 2. Slice-Ergebnis-Füllen [Level 1 — Reproduktion] [MVP]
Ein Quell-Array und eine Slicing-Operation werden angezeigt. Schüler füllen in ein leeres SVG-Gitter die erwarteten Ergebniswerte ein. Sofortige Validierung pro Zelle.
**SmartEnergy-Beispiel:**
```python
preise = np.array([0.28, 0.25, 0.22, 0.20, 0.22, 0.30, 0.35, 0.32])
preise[2:6]  # Schüler tragen ein: [0.22, 0.20, 0.22, 0.30]
```

### 3. Boolean-Masken-Werkstatt [Level 2 — Transfer] [MVP]
Ein Array wird mit Werten angezeigt. Schüler schreiben eine Bedingung (z.B. `data > 20`), und die resultierende Boolean-Maske wird als farbcodiertes Overlay angezeigt (True = grün, False = rot). Die gefilterten Werte werden separat dargestellt.
**SmartEnergy-Beispiel:** Tagesverbrauch `[12.5, 23.1, 8.7, 31.0, 18.4, 25.6, 9.2]`. Bedingung: `> 20` → Maske: `[F, T, F, T, F, T, F]` → Gefiltert: `[23.1, 31.0, 25.6]`.

### 4. View-oder-Kopie-Quiz [Level 2 — Transfer] [MVP]
Verschiedene Indexing-Operationen werden gezeigt. Schüler entscheiden: View oder Kopie? Bei korrekter Antwort wird visuell demonstriert, was passiert, wenn man das Ergebnis ändert (ändert sich das Original oder nicht?). SVG-Animation zeigt den Zusammenhang.
**SmartEnergy-Beispiele:**
- `verbrauch[2:5]` → View (Basic Slicing)
- `verbrauch[[0, 3, 7]]` → Kopie (Fancy Indexing)
- `verbrauch[verbrauch > 20]` → Kopie (Boolean Indexing)

### 5. Daten-Extraktor (Live-Coding) [Level 2 — Transfer] [MVP]
Schüler erhalten ein 2D-Verbrauchsarray und müssen per Indexing bestimmte Daten extrahieren. Mehrere Teilaufgaben mit steigender Komplexität.
**SmartEnergy-Aufgabe:**
1. „Extrahiere den Verbrauch von Haushalt 3 am Mittwoch." → `verbrauch[2, 2]`
2. „Extrahiere alle Nachtstunden (0-6 Uhr) für alle Haushalte." → `verbrauch[:, 0:6]`
3. „Finde alle Stunden, in denen der Verbrauch über 30 kWh lag." → `verbrauch[verbrauch > 30]`

### 6. Fancy-vs-Basic-Indexing-Duell [Level 3 — Bewertung] [Erweiterung]
Zwei Indexing-Ausdrücke werden nebeneinander gezeigt. Schüler entscheiden, ob sie dasselbe Ergebnis liefern, und begründen eventuelle Unterschiede (View vs. Kopie, Shape-Unterschied).
**SmartEnergy-Beispiel:** `verbrauch[1:4]` vs. `verbrauch[[1, 2, 3]]` — gleiches Ergebnis, aber View vs. Kopie!

---

## Kapitel 4: Array-Operationen

### 1. Vektorisierungs-Rechner [Level 1 — Reproduktion] [MVP]
Zwei SVG-Arrays werden nebeneinander dargestellt. Darunter ein Operator-Selektor (+, -, *, /, **). Schüler wählen den Operator, und das Ergebnis-Array wird elementweise animiert berechnet (jedes Zellenpaar leuchtet auf, Ergebnis erscheint). Zeigt visuell, was „elementweise" bedeutet.
**SmartEnergy-Beispiel:** `verbrauch = [12.5, 18.3, 9.4]`, `preis = [0.28, 0.30, 0.25]` → `kosten = verbrauch * preis` = `[3.50, 5.49, 2.35]`.

### 2. Achsen-Trainer (Interaktiv) [Level 1 — Reproduktion] [MVP]
Ein 2D-Array wird als SVG-Gitter angezeigt. Buttons: `axis=0`, `axis=1`, `kein axis`. Eine Aggregationsfunktion (z.B. `np.sum`) ist gewählt. Beim Klick auf eine axis-Option wird visuell animiert, wie die Aggregation funktioniert: Die zusammengefassten Elemente werden markiert, die „kollabierte" Achse verschwindet animiert.
**SmartEnergy-Beispiel:** Verbrauch 4 Haushalte × 3 Tage. `np.mean(verbrauch, axis=0)` → die Spalten leuchten nacheinander auf, Durchschnitt pro Tag entsteht. `np.mean(verbrauch, axis=1)` → die Zeilen leuchten auf, Durchschnitt pro Haushalt entsteht.

### 3. Logische-Operatoren-Falle [Level 1 — Reproduktion] [MVP]
Quiz: Verschiedene Vergleichs-/Filterausdrücke werden gezeigt. Schüler entscheiden, welche korrekt sind und welche einen Fehler werfen. Trainiert speziell `&`/`|`/`~` vs. `and`/`or`/`not` und die Klammer-Pflicht.
**SmartEnergy-Beispiele:**
- `verbrauch > 10 and verbrauch < 20` → ❌ ValueError
- `(verbrauch > 10) & (verbrauch < 20)` → ✅
- `verbrauch > 10 & verbrauch < 20` → ❌ Falsche Priorität (& bindet stärker als >)

### 4. Stromkosten-Rechner (Live-Coding) [Level 2 — Transfer] [MVP]
Schüler berechnen mit vektorisierten Operationen die Stromkosten: `kosten = verbrauch * preis_pro_kwh`. Dann: Gesamtkosten (`np.sum`), Durchschnitt pro Haushalt (`np.mean(kosten, axis=1)`), teuerster Tag (`np.argmax`).
**SmartEnergy-Aufgabe:** „Gegeben: `verbrauch` (Shape: 10×365), `preis` (Shape: 365,). Berechne die Gesamtkosten pro Haushalt für das Jahr."

### 5. Aggregations-Ergebnis-Vorhersage [Level 2 — Transfer] [Erweiterung]
Ein 2D-Array und eine Aggregationsoperation mit axis-Parameter werden angezeigt. Schüler füllen das Ergebnis-Array manuell aus UND geben die Ergebnis-Shape an. Kombiniert Array-Fill mit Shape-Predictor.
**SmartEnergy-Beispiel:**
```python
data = np.array([[10, 20, 30],
                 [40, 50, 60]])
np.max(data, axis=0)  # Schüler tragen ein: [40, 50, 60], Shape: (3,)
```

---

## Kapitel 5: Broadcasting

### 1. Broadcasting-Animator [Level 1 — Reproduktion] [MVP]
Interaktive SVG-Animation: Zwei Arrays mit unterschiedlichen Shapes werden angezeigt. Per Klick auf „Broadcasting starten" wird Schritt für Schritt gezeigt:
1. Shapes werden von rechts nach links verglichen (Dimensionen werden farblich markiert)
2. Fehlende Dimensionen werden links mit 1 aufgefüllt (neue Zellen erscheinen)
3. Dimensionen der Größe 1 werden „gestreckt" (animierte Vervielfältigung)
4. Elementweise Operation wird durchgeführt
Bei inkompatiblen Shapes wird der Konflikt rot markiert und erklärt.
**SmartEnergy-Beispiel:** `verbrauch` (Shape: 1000, 8760) + `grundgebuehr` (Shape: 1000, 1) → Broadcasting streckt die Grundgebühr auf alle 8760 Stunden.

### 2. Shape-Kompatibilitäts-Checker [Level 1 — Reproduktion] [MVP]
Timed Challenge: Zwei Shapes werden angezeigt (z.B. `(3, 4)` und `(4,)`). Schüler entscheiden per Klick: ✅ Kompatibel oder ❌ Inkompatibel. Bei „Kompatibel" müssen sie auch die Ergebnis-Shape angeben. 15 Paare in 60 Sekunden.
**SmartEnergy-Beispiele:**
- `(1000, 8760)` + `(8760,)` → ✅ Kompatibel, Ergebnis: `(1000, 8760)`
- `(1000, 8760)` + `(1000,)` → ❌ Inkompatibel (8760 ≠ 1000)
- `(1000, 1)` + `(1, 8760)` → ✅ Kompatibel, Ergebnis: `(1000, 8760)`

### 3. Broadcasting-Puzzle (Drag & Drop) [Level 2 — Transfer] [MVP]
Mehrere Arrays mit verschiedenen Shapes werden als Karten angezeigt. Ein Ziel-Shape ist vorgegeben. Schüler ziehen zwei kompatible Arrays zusammen und wählen eine Operation. Die Visualisierung zeigt, ob das Ergebnis die Ziel-Shape hat.
**SmartEnergy-Beispiel:** Ziel-Shape `(1000, 365)`. Verfügbar: `verbrauch_pro_stunde` (1000, 8760), `tagesfaktor` (365, 1), `stundenpreis` (8760,), `haushalt_rabatt` (1000, 1). Welche Kombination ergibt (1000, 365)?

### 4. Preisberechnung mit Broadcasting (Live-Coding) [Level 2 — Transfer] [MVP]
Schüler nutzen Broadcasting, um Strompreise (1D-Array, 8760 Stunden) auf Verbrauchsdaten (2D-Array, Haushalte × Stunden) anzuwenden, ohne die Shapes manuell anpassen zu müssen.
**SmartEnergy-Aufgabe:** „Gegeben: `verbrauch` Shape (100, 8760) und `stundenpreis` Shape (8760,). Berechne `kosten = verbrauch * stundenpreis` und erkläre, warum kein reshape nötig ist."

### 5. Broadcasting-Fehler-Diagnostik [Level 3 — Bewertung] [Erweiterung]
Fehlerhafte Broadcasting-Operationen werden gezeigt (die einen ValueError erzeugen). Schüler analysieren die Shapes, identifizieren die inkompatible Dimension, und schlagen eine Lösung vor (reshape, expand_dims, oder andere Anordnung).
**SmartEnergy-Beispiel:**
```python
verbrauch = np.random.rand(1000, 8760)  # (1000, 8760)
tarif = np.array([0.25, 0.30, 0.35])    # (3,) — 3 Tarife
kosten = verbrauch * tarif               # ValueError! 8760 ≠ 3
# Lösung: tarif.reshape(3, 1, 1) für Broadcasting über neue Achsen
```

---

## Kapitel 6: Reshape & Manipulation

### 1. Shape-Transformer (Interaktive Animation) [Level 1 — Reproduktion] [MVP]
Ein 1D-Array (z.B. `np.arange(12)`) wird als flache Reihe angezeigt. Schüler wählen per Dropdown verschiedene Reshape-Operationen (`reshape(3, 4)`, `reshape(4, 3)`, `reshape(2, 2, 3)`). Die Elemente „fliegen" animiert in die neue Anordnung. Parallel wird die flache Speicherreihenfolge angezeigt, um zu zeigen, dass sich am Speicher nichts ändert.
**SmartEnergy-Beispiel:** Stundendaten eines Tages (24 Werte) → `reshape(4, 6)` (6-Stunden-Blöcke) oder `reshape(8, 3)` (3-Stunden-Blöcke).

### 2. Reshape-Shape-Rechner [Level 1 — Reproduktion] [MVP]
Ein Array mit bekannter Shape wird angezeigt. Schüler geben Reshape-Parameter ein (inkl. `-1` für automatische Berechnung) und sagen die Ergebnis-Shape vorher. Bei `-1` müssen sie den automatisch berechneten Wert angeben.
**SmartEnergy-Beispiele:**
- `verbrauch.shape = (8760,)` → `reshape(365, ?)` → Schüler: 24
- `verbrauch.shape = (1000, 8760)` → `reshape(1000, 365, -1)` → Schüler: -1 = 24
- `verbrauch.shape = (12,)` → `reshape(5, -1)` → Fehler! (12 nicht durch 5 teilbar)

### 3. Transpose-Visualizer [Level 1 — Reproduktion] [MVP]
SVG-Animation: Eine Matrix wird angezeigt. Per Klick auf „Transpose" kippen Zeilen und Spalten animiert um die Diagonale. Shape-Anzeige aktualisiert sich live. Erweitert: Bei 3D-Arrays verschiedene `axes`-Permutationen ausprobieren.
**SmartEnergy-Beispiel:** `verbrauch` Shape (Haushalte, Stunden) → `verbrauch.T` Shape (Stunden, Haushalte). „Wann ist Transpose sinnvoll? Wenn man statt ‚pro Haushalt alle Stunden' → ‚pro Stunde alle Haushalte' analysieren will."

### 4. Stundendaten zu Tagesmatrix (Live-Coding) [Level 2 — Transfer] [MVP]
Schüler transformieren Stundendaten in verschiedene Strukturen mit reshape, und kombinieren Arrays mit concatenate/stack.
**SmartEnergy-Aufgabe:**
1. „Transformiere `stunden_verbrauch` (Shape: 8760,) in eine Tagesmatrix (Shape: 365, 24)."
2. „Kombiniere die Tagesmatrizen von zwei Haushalten zu einem Array (Shape: 2, 365, 24) mit `np.stack`."
3. „Füge die Daten eines 366. Tages (Schalttag) mit `np.concatenate` an."

### 5. Memory-Layout-Explorer [Level 2 — Transfer] [Erweiterung]
Interaktive Komponente: Zeigt ein 2D-Array sowohl als logisches Gitter als auch als linearen Speicher. Verbindungslinien zeigen die Zuordnung. Toggle zwischen C-Order (Row-Major) und Fortran-Order (Column-Major). Schüler können Elemente anklicken und sehen die Speicheradresse.
**SmartEnergy-Beispiel:** Verbrauch 3 Haushalte × 4 Tage. In C-Order liegen die Tage eines Haushalts hintereinander (gut für „pro Haushalt"-Zugriffe). In F-Order liegen alle Haushalte eines Tages hintereinander (gut für „pro Tag"-Zugriffe).

### 6. Flatten-Ravel-Differenzierung [Level 2 — Transfer] [Erweiterung]
Quiz mit Codebeispielen: Schüler entscheiden, ob `flatten()` oder `ravel()` verwendet werden sollte, basierend auf dem Kontext (brauche ich eine Kopie oder reicht ein View?). Visuell wird der Unterschied mit der View-Animation gezeigt.

---

## Kapitel 7: Statistische Auswertung

### 1. Statistik-Funktions-Zuordner [Level 1 — Reproduktion] [MVP]
Verschiedene statistische Fragestellungen werden angezeigt. Schüler ziehen per Drag & Drop die passende NumPy-Funktion dazu.
**SmartEnergy-Beispiele:**
- „Was ist der typische Tagesverbrauch?" → `np.mean` oder `np.median`
- „Wie stark schwankt der Verbrauch?" → `np.std`
- „In welchem Bereich liegen 50% der Werte?" → `np.percentile` (25., 75.)
- „Gibt es einen Zusammenhang zwischen Temperatur und Verbrauch?" → `np.corrcoef`

### 2. Achsen-Aggregations-Challenge [Level 2 — Transfer] [MVP]
Ein 2D-Verbrauchsarray (Haushalte × Monate) wird als Tabelle mit beschrifteten Zeilen und Spalten angezeigt. Verschiedene Fragestellungen erfordern die richtige axis-Wahl. Schüler wählen axis und Funktion, das Ergebnis wird visuell im Array hervorgehoben.
**SmartEnergy-Beispiele:**
- „Durchschnittsverbrauch pro Haushalt über alle Monate" → `np.mean(data, axis=1)`
- „Höchster Verbrauch pro Monat über alle Haushalte" → `np.max(data, axis=0)`
- „Gesamtverbrauch aller Haushalte in allen Monaten" → `np.sum(data)` (kein axis)
- „Monat mit dem höchsten Gesamtverbrauch" → `np.argmax(np.sum(data, axis=0))`

### 3. Ausreißer-Detektor (Interaktiv) [Level 2 — Transfer] [MVP]
SVG-basiertes Streudiagramm der Verbrauchsdaten. Schüler berechnen per Live-Coding den Z-Score und definieren einen Schwellwert. Ausreißer werden im Diagramm farblich hervorgehoben. Per Slider kann der Schwellwert angepasst werden, und die Anzahl der erkannten Ausreißer ändert sich live.
**SmartEnergy-Aufgabe:** „Identifiziere Haushalte mit ungewöhnlich hohem Verbrauch. Berechne den Z-Score und markiere alle Werte mit |z| > 2."

### 4. Korrelationsanalyse (Live-Coding) [Level 2 — Transfer] [MVP]
Schüler berechnen die Korrelation zwischen Temperatur und Stromverbrauch. Die Korrelationsmatrix wird als Heatmap-SVG dargestellt. Interpretation der Werte wird abgefragt.
**SmartEnergy-Aufgabe:**
1. „Berechne `np.corrcoef(temperatur, verbrauch)` und interpretiere das Ergebnis."
2. „Ist die Korrelation positiv oder negativ? Was bedeutet das im Kontext?" (Im Winter mehr Heizung → negativer Zusammenhang, im Sommer mehr Klimaanlage → positiver Zusammenhang → U-förmig!)

### 5. Deskriptive Statistik Dashboard (Live-Coding) [Level 3 — Bewertung] [MVP]
Freie Coding-Challenge: Schüler erstellen eine vollständige deskriptive Statistik für einen Datensatz. Alle Kennwerte berechnen, Ausreißer identifizieren, Ergebnisse interpretieren.
**SmartEnergy-Aufgabe:** „Analysiere den Verbrauchsdatensatz: Berechne Mean, Median, Std, Min, Max, Quartile. Identifiziere Ausreißer. Welcher Haushalt verbraucht am meisten? Welcher Monat hat den höchsten Durchschnittsverbrauch?"

### 6. ddof-Verständnis [Level 1 — Reproduktion] [Erweiterung]
Quiz: Erklärt den Unterschied zwischen `np.std(data)` (ddof=0, Populationsstandardabweichung) und `np.std(data, ddof=1)` (Stichprobenstandardabweichung). Schüler berechnen beide Werte für einen kleinen Datensatz von Hand und vergleichen mit NumPy.

---

## Kapitel 8: Praxisprojekt — Datenanalyse

### 1. Tarifvergleichs-Analyse (Mehrstufig) [Level 3 — Bewertung] [MVP]
Umfassende Live-Coding-Aufgabe in mehreren Schritten. Jeder Schritt baut auf dem vorherigen auf. Schüler analysieren, welche Haushalte von einem Tarifwechsel profitieren würden.
**SmartEnergy-Schritte:**
1. Daten laden und inspizieren (Shape, Dtype, erste Werte)
2. Verbrauchsmuster pro Haushalt berechnen (mean, std, peak hours)
3. Kosten unter aktuellem Tarif berechnen (Broadcasting: Verbrauch × Stundenpreis)
4. Kosten unter alternativem Tarif berechnen (Flatrate vs. zeitvariabel)
5. Differenz berechnen und Haushalte identifizieren, die sparen würden
6. Statistische Zusammenfassung: Wie viele profitieren? Durchschnittliche Ersparnis?

### 2. Tages-/Wochenmuster-Erkennung [Level 3 — Bewertung] [MVP]
Schüler reshapen Stundendaten zu Tagesmatrizen und Wochenmatrizen, um Verbrauchsmuster zu erkennen.
**SmartEnergy-Schritte:**
1. `stunden.reshape(365, 24)` → Tagesmatrix
2. `np.mean(tagesmatrix, axis=0)` → Durchschnittliches Tagesprofil (24 Werte)
3. `tagesmatrix[:7, :].reshape(7, 24)` → Wochenprofil
4. Wochentage vs. Wochenende vergleichen: `np.mean(woche[:5], axis=0)` vs. `np.mean(woche[5:], axis=0)`

### 3. Pipeline-Builder (Code-Puzzle) [Level 2 — Transfer] [Erweiterung]
Eine vollständige Datenanalyse-Pipeline wird als einzelne Code-Zeilen angeboten (durcheinandergewürfelt). Schüler bringen sie per Drag & Drop in die richtige Reihenfolge. Die Pipeline wird dann via Pyodide ausgeführt, um das Ergebnis zu verifizieren.
**SmartEnergy-Beispiel:**
```python
# Richtige Reihenfolge:
data = np.loadtxt(...)           # 1. Daten laden
data = data.reshape(1000, 8760)  # 2. Reshapen
mean_per_hh = np.mean(data, axis=1)  # 3. Aggregation
mask = mean_per_hh > 20         # 4. Filtern
result = data[mask]              # 5. Auswahl
```

### 4. Wetter-Korrelations-Report [Level 3 — Bewertung] [Erweiterung]
Umfassende Analyse des Zusammenhangs zwischen Wetterdaten und Stromverbrauch. Schüler nutzen alle gelernten Konzepte: Indexing, Broadcasting, Aggregation, Korrelation.
**SmartEnergy-Schritte:**
1. Temperatur-Array (365 Tage) und Verbrauch-Array (1000 Haushalte × 365 Tage) laden
2. Verbrauch pro Tag aggregieren: `np.mean(verbrauch, axis=0)` → (365,)
3. Korrelation berechnen: `np.corrcoef(temperatur, mittlerer_verbrauch)`
4. Sommer (Tag 150-240) vs. Winter (Tag 0-60, 300-365) vergleichen
5. Boolean Indexing: Tage mit Temperatur > 30°C filtern und Verbrauch analysieren
