
### 1. Technischer Skill: React & TypeScript

- **Komponentenarchitektur:** Funktionale Komponenten mit Hooks, keine Klassenkomponenten. Keine großen Komponenten/Pages sondern Aufteilung in kleine, wiederverwendbare Komponenten.
- **TypeScript:** Strikte Typisierung für Props, State und Daten. Interfaces für alle Datenstrukturen.
- **State Management:**
  - Lokaler State mit `useState` für Komponenten-spezifische Daten
  - Zustand (Store) für globalen Lernfortschritt und Übungsergebnisse
  - Custom Hooks für wiederverwendbare Logik
- **Styling:** Tailwind CSS mit konsistentem Design-System.
- **Performance:** React.memo, useMemo, useCallback wo sinnvoll. Lazy Loading für Seiten.
- **Error Handling:** React Error Boundaries um Seiten und um Pyodide-Komponenten, damit einzelne Komponentenfehler oder Pyodide-Probleme nicht die gesamte App crashen.

---

### 2. Technischer Skill: Pyodide-Integration (In-Browser Python)

Die Plattform ermöglicht **echtes Python/NumPy-Coding** direkt im Browser via Pyodide (CPython als WebAssembly).

#### Architektur

- **PyodideProvider (React Context):**
  - Wird einmalig am App-Root eingebunden
  - Lazy-Loading: Pyodide wird erst geladen, wenn die erste Coding-Übung geöffnet wird
  - Stellt `runPython(code: string): Promise<PythonResult>` bereit
  - Verwaltet den Ladezustand (`loading`, `ready`, `error`)

- **Web Worker (`pyodide.worker.ts`):**
  - Python-Code wird **immer** in einem Web Worker ausgeführt (nie im Main Thread)
  - Kommunikation über `postMessage` / `onmessage`
  - Timeout: 10 Sekunden pro Ausführung, danach Worker-Terminierung und Neustart
  - NumPy ist nach dem ersten Laden sofort verfügbar

- **PythonEditor-Komponente:**
  - CodeMirror 6 mit `@codemirror/lang-python`
  - Buttons: ▶ Ausführen, ↺ Zurücksetzen, 💡 Lösung anzeigen (optional, nach erstem Versuch)
  - Starter-Code wird als `defaultValue` übergeben
  - Output-Panel zeigt `stdout`, `stderr` und ggf. Fehlermeldungen mit Syntax-Highlighting

- **Validierung von Coding-Aufgaben:**
  - Nach der Ausführung des Schüler-Codes wird ein versteckter Validierungs-Code ausgeführt
  - Validierung prüft z.B.: `assert result.shape == (3, 4)`, `assert np.allclose(result, expected)`
  - Ergebnis: ✅ Bestanden / ❌ Nicht bestanden mit Hinweis
  - Schüler sehen den Validierungs-Code nicht, nur das Ergebnis

#### Einschränkungen & Sicherheit

- Kein Dateisystem-Zugriff (`open()` ist deaktiviert)
- Kein Netzwerk-Zugriff (`urllib`, `requests` nicht verfügbar)
- Kein `input()` — interaktive Eingaben sind nicht möglich
- Nur `numpy` ist vorgeladen, weitere Pakete werden nicht unterstützt
- Maximale Ausgabe: 10.000 Zeichen (längere Ausgaben werden gekürzt mit Hinweis)

---

### 3. Technischer Skill: Interaktive Komponenten

Die Plattform nutzt eine **breite Palette an Übungsformaten** (siehe `uebungsideen.md` für kapitelspezifische Details). Die folgenden Komponentenarten werden benötigt:

#### Basis-Komponenten

- **Drag & Drop:**
  - Verwendung von `@dnd-kit/core` für moderne, accessible Drag & Drop Funktionalität
  - Klare visuelle Feedback-Zustände (dragging, drop-zone active, success, error)
  - Touch-Support für Tablet-Nutzung
  - Einsatz: Array-Element-Zuordnung, Shape-Matching, Achsen-Identifikation, Code-Puzzle

- **Lückentext-Komponenten:**
  - Eingabefelder mit sofortiger Validierung
  - Optionale Hinweise bei falschen Antworten
  - Visuelle Hervorhebung korrekter/falscher Eingaben
  - Einsatz: Fehlende NumPy-Funktionen/Parameter ergänzen

- **Quiz-Komponenten:**
  - Multiple-Choice mit Radio-Buttons oder Checkboxen
  - Erklärungen nach Beantwortung (warum richtig/falsch)
  - Punktesystem und Feedback
  - Variante: Wahr/Falsch mit Erklärung

#### Erweiterte interaktive Formate

- **Array-Fill-Komponenten:**
  - Tabellarische Eingabe: Schüler füllen ein Array-Gitter mit den erwarteten Werten aus
  - Zellen sind editierbar, Validierung erfolgt zeilenweise oder komplett
  - Einsatz: Ergebnis von Slicing, Broadcasting, Operationen vorhersagen

- **Shape-Predictor:**
  - Anzeige einer NumPy-Operation (z.B. `a.reshape(2, -1)` oder `a + b`)
  - Schüler geben die resultierende Shape als Tupel ein
  - Sofortiges visuelles Feedback mit Array-Visualisierung der korrekten Shape
  - Einsatz: Shape-Vorhersage, Broadcasting-Kompatibilität

- **Timed Challenges:**
  - Countdown-Timer mit visuellem Feedback
  - Schnelle Entscheidungsaufgaben unter Zeitdruck
  - Einsatz: Dtype-Erkennung, Achsen-Identifikation, Broadcasting-Kompatibilität

- **Fehlersuche-Komponenten:**
  - Code-Snippets mit eingebauten Fehlern
  - Schüler klicken auf die fehlerhafte Zeile oder wählen den Fehler aus
  - Einsatz: TypeError, Shape-Mismatch, Off-by-one bei Slicing

- **Code-Puzzle (Drag & Drop):**
  - Code-Zeilen in die richtige Reihenfolge bringen
  - Oder: Fehlende Code-Fragmente in Lücken ziehen
  - Einsatz: Schrittweise Array-Transformationen, Analyse-Pipelines

- **Vergleichs-Ansichten:**
  - Zwei Code-Varianten nebeneinander (z.B. Python-Listen vs. NumPy)
  - Schüler identifizieren Unterschiede oder bewerten Effizienz
  - Einsatz: Performance-Vergleich, Idiomatischer vs. unidiomatischer Code

#### Visualisierungs-Komponenten (SVG-basiert)

- **ArrayVisualizer:**
  - 1D-Array: Horizontale Reihe farbcodierter Zellen mit Werten
  - 2D-Array: Gitter/Matrix mit Zeilen- und Spaltenindizes
  - 3D-Array: Geschichtete 2D-Gitter (isometrische Darstellung oder Tabs pro "Schicht")
  - Farbcodierung nach Wert (Heatmap-Stil) oder nach Auswahl (Indexing-Hervorhebung)
  - Hover zeigt Index und Wert an

- **BroadcastingAnimator:**
  - Schritt-für-Schritt-Animation der Broadcasting-Regeln
  - Phase 1: Shapes vergleichen (von rechts nach links)
  - Phase 2: Dimensionen mit Größe 1 werden "gestreckt" (visuell animiert)
  - Phase 3: Elementweise Operation wird durchgeführt
  - Fehlerfall: Inkompatible Shapes werden rot markiert mit Erklärung

- **ShapeTransformer:**
  - Zeigt ein Array vor und nach einer Transformation (reshape, transpose, flatten)
  - Animierter Übergang: Elemente "fliegen" von alter zu neuer Position
  - Zeigt die Speicherreihenfolge (flaches Array) parallel zur logischen Darstellung

- **MemoryLayoutViewer:**
  - Linearer Speicher als horizontale Reihe von Zellen
  - Logische Array-Darstellung darüber
  - Verbindungslinien zeigen, wie logische Positionen auf Speicherpositionen abgebildet werden
  - Toggle zwischen C-Order (Row-Major) und Fortran-Order (Column-Major)

- **IndexingHighlighter:**
  - 2D-Array-Gitter, bei dem der Schüler eine Slicing-Expression eingibt
  - Die ausgewählten Elemente werden farblich hervorgehoben
  - Live-Update bei Änderung der Expression
  - Unterstützt: Basic Indexing, Slicing, Fancy Indexing, Boolean Masken

- **PerformanceChart:**
  - Balkendiagramm: Python-Listen vs. NumPy für dieselbe Operation
  - Interaktiver Slider für Array-Größe (100, 1.000, 10.000, 100.000, 1.000.000)
  - Zeigt Speedup-Faktor an
  - Optional: Live-Benchmark via Pyodide (misst echte Ausführungszeit im Browser)

---

### 4. Didaktischer Skill: Interaktives Content-Design

- **Bilingualer Ansatz:** Fachbegriffe werden bei der ersten Erwähnung mit der deutschen Erklärung versehen, z.B. „Broadcasting (automatische Dimensionserweiterung)" oder „Slicing (Teilbereich-Zugriff)". Da NumPy-Begriffe fast ausschließlich englisch sind, steht der englische Begriff zuerst.

- **Strukturvorgabe für jede Lerneinheit:**
  1. **Theorie-Sektion:** Systematische Einführung des Konzepts:
     - Motivation: Warum braucht man dieses Konzept? (Bezug zum SmartEnergy-Szenario)
     - Erklärung mit visuellen Beispielen (SVG-Array-Darstellungen)
     - Code-Beispiele (read-only, syntax-highlighted) mit erklärenden Kommentaren
     - Häufige Fehler und Fallstricke
     - Interaktive Elemente: aufklappbare Details, Hover-Erklärungen, schrittweise Animationen
     - Die Theorie-Sektion ist der zentrale Lerninhalt — nicht nur ein kurzer Vorspann vor den Übungen.
  2. **Interaktives Beispiel:** Schrittweiser Aufbau eines Konzepts, das der Schüler durch Klicken/Interaktion nachvollzieht. Kombiniert Visualisierung mit Live-Code.
  3. **Übungen:** Mindestens 2-3 interaktive Aufgaben pro Thema, davon mindestens eine Live-Coding-Aufgabe (siehe `uebungsideen.md` für kapitelspezifische Formate)

- **Feedback-Prinzipien:**
  - **Sofortiges Feedback:** Bei jeder Interaktion direkte Rückmeldung
  - **Konstruktives Feedback:** Bei Fehlern Hinweise statt nur "Falsch" — z.B. "Dein Shape ist (3, 4), erwartet wird (4, 3). Tipp: Prüfe die Reihenfolge der Dimensionen."
  - **Positive Verstärkung:** Visuelle Belohnungen bei korrekten Lösungen (Animationen, Häkchen)
  - **Bei Coding-Aufgaben:** Python-Fehlermeldungen werden angezeigt und mit einem verständlichen Hinweis ergänzt (z.B. "ValueError: shapes not aligned → Die Arrays haben inkompatible Dimensionen für diese Operation")

- **Zielgruppen-Fokus (DPA):**
  - Fokus auf **Datenanalyse-Perspektive**: Daten laden, transformieren, aggregieren, auswerten
  - Praxisbezug: Reale Datensätze (Sensor-Daten, Zeitreihen, Tabellendaten)
  - Weniger Fokus auf lineare Algebra / wissenschaftliches Rechnen, mehr auf **deskriptive Statistik und Datenmanipulation**
  - Brücke zu Pandas: An geeigneten Stellen wird erwähnt, dass Pandas auf NumPy aufbaut

---

### 5. Skill: Aufgaben-Design (KMK-Konformität, interaktiv umgesetzt)

Aufgaben werden in drei Schwierigkeitsstufen interaktiv gestaltet. **Innovative, abwechslungsreiche Formate sind bevorzugt** — konkrete kapitelspezifische Übungsideen sind in `uebungsideen.md` dokumentiert.

- **Level 1 (Reproduktion):**
  - Multiple-Choice: Begriffe, Dtypes, Funktionsnamen erkennen
  - Lückentext: Fehlende NumPy-Funktionen oder Parameter einsetzen
  - Drag & Drop: Array-Elemente Shapes zuordnen, Funktionen kategorisieren
  - Array-Fill: Einfache Ergebnisse von Operationen manuell eintragen
  - Timed Challenges: Schnelltrainer für Dtype-Erkennung, Shape-Vorhersage
  - Hotspot-Klick: Bestimmte Elemente in einer Array-Visualisierung identifizieren

- **Level 2 (Transfer):**
  - Live-Coding: Geführte Aufgaben mit Starter-Code und automatischer Validierung
  - Shape-Predictor: Resultierende Shape einer Operation vorhersagen
  - Code-Puzzle: Code-Zeilen in die richtige Reihenfolge bringen
  - Broadcasting-Puzzle: Entscheiden, welche Array-Kombinationen kompatibel sind
  - Indexing-Explorer: Slicing-Expression formulieren, um bestimmte Daten zu extrahieren
  - Fehlersuche: Fehlerhaften Code finden und Fehlertyp benennen

- **Level 3 (Bewertung):**
  - Freie Coding-Challenges: Aufgabe mit Tests, aber ohne Starter-Code
  - Performance-Optimierung: Langsamen Code mit NumPy-Idiomen beschleunigen
  - Datenanalyse-Projekte: Mehrstufige Analyse des SmartEnergy-Datensatzes
  - Code-Review: Zwei Lösungen vergleichen und die bessere begründen
  - Konzept-Transfer: Gelerntes auf neue, unbekannte NumPy-Funktionen anwenden

---

### 6. Skill: Accessibility & UX

- **Tastaturnavigation:** Alle interaktiven Elemente mit Tab erreichbar, Drag & Drop auch per Tastatur steuerbar
- **Screenreader:** ARIA-Labels für alle Visualisierungen und interaktiven Elemente. Array-Inhalte werden als tabellarische Daten ausgezeichnet.
- **Farbkontrast:** WCAG AA-konform, keine reine Farbkodierung für Feedback. Array-Visualisierungen nutzen zusätzlich Muster/Rahmen.
- **Responsive:** Desktop-first, aber Tablet-Unterstützung Pflicht. Code-Editor und Output stapeln sich auf schmalen Bildschirmen vertikal.
- **Ladezeiten:** Lazy Loading für Pyodide und schwere Komponenten, optimierte Assets. Pyodide wird nur geladen, wenn tatsächlich gebraucht.
- **Code-Editor UX:** Angemessene Schriftgröße (min. 14px), Zeilennummern, Tab-Einrückung (4 Spaces), Auto-Indent.

---

### 7. Skill: Fortschritt & Gamification

- **LocalStorage-Persistenz:** Lernfortschritt wird browserlokal gespeichert
- **Progress-Tracking:**
  - Welche Kapitel wurden bearbeitet
  - Welche Übungen wurden abgeschlossen (interaktiv + Coding)
  - Erzielte Punktzahlen
  - Anzahl gelöster Coding-Challenges
- **Optionale Gamification:**
  - Fortschrittsbalken pro Kapitel
  - Abzeichen für abgeschlossene Module (z.B. "Array-Meister", "Broadcasting-Profi", "Shape-Shifter")
  - Streak-Counter für tägliches Lernen
  - "Speedup-Highscore": Höchster erreichter Speedup bei Performance-Optimierungs-Aufgaben

---

### 8. NumPy-spezifische Fachregeln

Diese Regeln haben **Vorrang** vor allgemeinem Training-Wissen und müssen in allen Inhalten, Beispielen und Übungen strikt eingehalten werden.

#### 8.1 Array-Grundlagen

**Array-Erstellung:**
```python
import numpy as np

# Aus Python-Liste
a = np.array([1, 2, 3])                    # 1D-Array
b = np.array([[1, 2], [3, 4]])              # 2D-Array

# Erzeugungs-Funktionen
np.zeros((3, 4))          # 3×4 Matrix mit Nullen
np.ones((2, 3))           # 2×3 Matrix mit Einsen
np.arange(0, 10, 2)       # [0, 2, 4, 6, 8] — wie range(), aber als Array
np.linspace(0, 1, 5)      # [0.0, 0.25, 0.5, 0.75, 1.0] — gleichmäßig verteilt
np.random.rand(3, 3)      # 3×3 mit Zufallswerten [0, 1)
np.eye(3)                 # 3×3 Einheitsmatrix
np.full((2, 3), 7)        # 2×3 gefüllt mit 7
```

**Array-Attribute — immer mit korrekten Typen erklären:**

| Attribut | Typ | Bedeutung | Beispiel für `np.array([[1,2,3],[4,5,6]])` |
|----------|-----|-----------|---------------------------------------------|
| `shape` | `tuple[int, ...]` | Dimensionen als Tupel | `(2, 3)` |
| `ndim` | `int` | Anzahl der Dimensionen | `2` |
| `size` | `int` | Gesamtanzahl Elemente | `6` |
| `dtype` | `np.dtype` | Datentyp der Elemente | `int64` |

**Wichtige Dtypes:**

| Dtype | Beschreibung | Beispiel |
|-------|-------------|---------|
| `int64` | 64-Bit Ganzzahl (Standard für int) | `np.array([1, 2, 3])` |
| `float64` | 64-Bit Gleitkomma (Standard für float) | `np.array([1.0, 2.0])` |
| `bool` | Boolean | `np.array([True, False])` |
| `int32` | 32-Bit Ganzzahl | `np.array([1, 2], dtype=np.int32)` |
| `float32` | 32-Bit Gleitkomma | `np.array([1.0], dtype=np.float32)` |

**Konvention:** In Beispielen wird immer `import numpy as np` verwendet. Nie `from numpy import *`.

---

#### 8.2 Indexing & Slicing

**Basic Indexing (gibt View zurück, keine Kopie!):**
```python
a = np.array([10, 20, 30, 40, 50])
a[0]       # 10 — erstes Element
a[-1]      # 50 — letztes Element
a[1:4]     # array([20, 30, 40]) — Index 1 bis 3 (exklusiv 4!)
a[::2]     # array([10, 30, 50]) — jedes zweite Element
```

**2D-Indexing:**
```python
b = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
b[0, 1]      # 2 — Zeile 0, Spalte 1
b[1, :]      # array([4, 5, 6]) — ganze Zeile 1
b[:, 2]      # array([3, 6, 9]) — ganze Spalte 2
b[0:2, 1:]   # array([[2, 3], [5, 6]]) — Teilmatrix
```

**Fancy Indexing (gibt Kopie zurück!):**
```python
a = np.array([10, 20, 30, 40, 50])
indices = np.array([0, 2, 4])
a[indices]   # array([10, 30, 50])
```

**Boolean Indexing (Masken — gibt Kopie zurück!):**
```python
a = np.array([10, 20, 30, 40, 50])
mask = a > 25
# mask = array([False, False, True, True, True])
a[mask]      # array([30, 40, 50])
a[a > 25]    # Kurzform — identisch
```

**Wichtige Regel — View vs. Kopie:**
> Basic Slicing erzeugt einen **View** (Ansicht) — Änderungen am View ändern das Original!
> Fancy Indexing und Boolean Indexing erzeugen eine **Kopie** — Änderungen wirken sich nicht auf das Original aus.

```python
a = np.array([1, 2, 3, 4, 5])
view = a[1:4]       # View
view[0] = 99        # a ist jetzt [1, 99, 3, 4, 5]!

copy = a[[0, 2, 4]] # Kopie
copy[0] = 88        # a bleibt unverändert
```

---

#### 8.3 Array-Operationen

**Elementweise Operationen (Vektorisierung):**
```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

a + b     # array([5, 7, 9])
a * b     # array([4, 10, 18])  — elementweise, NICHT Matrixmultiplikation!
a ** 2    # array([1, 4, 9])
a + 10    # array([11, 12, 13]) — Skalar wird auf alle Elemente angewandt (Broadcasting)
```

**Vergleichsoperationen (erzeugen Boolean-Arrays):**
```python
a = np.array([1, 2, 3, 4, 5])
a > 3          # array([False, False, False, True, True])
a == 3         # array([False, False, True, False, False])
(a > 2) & (a < 5)  # array([False, False, True, True, False]) — NICHT 'and'!
```

**Wichtige Regel — Logische Operatoren:**
> Bei Boolean-Arrays IMMER `&` (und), `|` (oder), `~` (nicht) verwenden.
> NIEMALS `and`, `or`, `not` — diese funktionieren nicht elementweise und erzeugen einen ValueError!
> Klammern um Vergleiche sind Pflicht: `(a > 2) & (a < 5)`, nicht `a > 2 & a < 5`.

**Aggregationsfunktionen:**
```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])

np.sum(a)         # 21 — Summe aller Elemente
np.sum(a, axis=0) # array([5, 7, 9]) — Summe pro Spalte (entlang der Zeilen)
np.sum(a, axis=1) # array([6, 15]) — Summe pro Zeile (entlang der Spalten)
np.mean(a)        # 3.5
np.min(a)         # 1
np.max(a)         # 6
np.argmax(a)      # 5 — Index des Maximum im flachen Array
```

**Achsen-Konvention (kritisch für Verständnis):**
> `axis=0` bedeutet: „entlang der Zeilen" = jede Spalte wird zusammengefasst → Ergebnis hat so viele Elemente wie Spalten.
> `axis=1` bedeutet: „entlang der Spalten" = jede Zeile wird zusammengefasst → Ergebnis hat so viele Elemente wie Zeilen.
> Merksatz: Die Achse, die im `axis`-Parameter angegeben wird, **verschwindet** aus der Shape.

---

#### 8.4 Broadcasting

**Broadcasting-Regeln (von rechts nach links prüfen):**

1. Arrays werden ab der **hintersten** (rechtesten) Dimension verglichen
2. Dimensionen sind kompatibel, wenn sie **gleich** sind oder eine davon **1** ist
3. Fehlt eine Dimension (weniger `ndim`), wird sie links mit 1 aufgefüllt
4. Eine Dimension der Größe 1 wird auf die Größe der anderen "gestreckt"

**Beispiele:**
```python
# Shape (3,) + Shape (1,) → Shape (3,)
np.array([1, 2, 3]) + np.array([10])  # array([11, 12, 13])

# Shape (3, 1) + Shape (1, 4) → Shape (3, 4)
a = np.array([[1], [2], [3]])     # Shape (3, 1)
b = np.array([[10, 20, 30, 40]])  # Shape (1, 4)
a + b
# array([[11, 21, 31, 41],
#        [12, 22, 32, 42],
#        [13, 23, 33, 43]])

# Shape (3,) + Shape (4,) → FEHLER! 3 ≠ 4 und keine ist 1
```

**Shape-Kompatibilitätstabelle:**

| Shape A | Shape B | Kompatibel? | Ergebnis-Shape |
|---------|---------|-------------|----------------|
| `(3,)` | `(3,)` | Ja | `(3,)` |
| `(3,)` | `(1,)` | Ja | `(3,)` |
| `(3, 4)` | `(4,)` | Ja | `(3, 4)` |
| `(3, 4)` | `(3, 1)` | Ja | `(3, 4)` |
| `(3, 4)` | `(3,)` | **Nein** | ValueError |
| `(2, 3, 4)` | `(3, 4)` | Ja | `(2, 3, 4)` |
| `(2, 3, 4)` | `(2, 1, 4)` | Ja | `(2, 3, 4)` |

---

#### 8.5 Reshape & Manipulation

**Reshape:**
```python
a = np.arange(12)          # array([0, 1, 2, ..., 11])
a.reshape(3, 4)            # 3 Zeilen, 4 Spalten
a.reshape(4, -1)           # -1 wird automatisch berechnet → (4, 3)
a.reshape(2, 2, 3)         # 3D-Array
```

**Wichtige Regel:** `reshape` ändert nur die logische Anordnung, nicht die Speicherreihenfolge. Die Gesamtanzahl der Elemente muss gleich bleiben: `product(alte_shape) == product(neue_shape)`.

**Flatten & Ravel:**
```python
b = np.array([[1, 2], [3, 4]])
b.flatten()   # array([1, 2, 3, 4]) — Kopie
b.ravel()     # array([1, 2, 3, 4]) — View (wenn möglich)
```

**Transpose:**
```python
b = np.array([[1, 2, 3],
              [4, 5, 6]])     # Shape (2, 3)
b.T                            # Shape (3, 2) — Zeilen und Spalten getauscht
```

**Concatenate & Stack:**
```python
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
np.concatenate([a, b])         # array([1, 2, 3, 4, 5, 6])
np.stack([a, b])               # array([[1, 2, 3], [4, 5, 6]]) — neue Dimension
np.vstack([a, b])              # vertikal stapeln
np.hstack([a, b])              # horizontal verbinden
```

**Achsen-Konzept — erweitert:**
> Bei Reshape und Concatenate ist das `axis`-Verständnis entscheidend:
> - `np.concatenate([a, b], axis=0)` — entlang der ersten Achse verbinden (Zeilen anfügen)
> - `np.concatenate([a, b], axis=1)` — entlang der zweiten Achse verbinden (Spalten anfügen)
> - `np.expand_dims(a, axis=0)` — neue Achse an Position 0 einfügen
> - `np.squeeze(a)` — Achsen der Größe 1 entfernen

---

#### 8.6 Statistische Auswertung

**Deskriptive Statistik:**
```python
data = np.array([23.5, 18.2, 31.7, 25.0, 19.8, 28.3, 22.1])

np.mean(data)       # Mittelwert: 24.09
np.median(data)     # Median: 23.5
np.std(data)        # Standardabweichung: 4.54
np.var(data)        # Varianz: 20.63
np.percentile(data, [25, 50, 75])  # Quartile
np.min(data)        # Minimum
np.max(data)        # Maximum
np.ptp(data)        # Spannweite (peak-to-peak): max - min
```

**Achsen-basierte Aggregation (für 2D-Daten):**
```python
# Verbrauchsdaten: 4 Haushalte × 3 Tage
verbrauch = np.array([[12.5, 14.2, 11.8],
                       [18.3, 16.7, 19.1],
                       [9.4, 10.2, 8.9],
                       [15.6, 14.8, 16.2]])

np.mean(verbrauch, axis=0)   # Durchschnitt pro Tag: [13.95, 13.975, 14.0]
np.mean(verbrauch, axis=1)   # Durchschnitt pro Haushalt: [12.83, 18.03, 9.5, 15.53]
np.max(verbrauch, axis=1)    # Maximum pro Haushalt: [14.2, 19.1, 10.2, 16.2]
```

**Korrelation:**
```python
temperatur = np.array([5, 10, 15, 20, 25, 30])
verbrauch = np.array([45, 38, 30, 25, 28, 35])
np.corrcoef(temperatur, verbrauch)
# Korrelationsmatrix 2×2:
# [[1.0, -0.82],
#  [-0.82, 1.0]]
```

**Ausreißer-Erkennung (Z-Score-Methode):**
```python
data = np.array([...])
z_scores = (data - np.mean(data)) / np.std(data)
outliers = np.abs(z_scores) > 2  # Boolean-Maske für Ausreißer
```

---

#### 8.7 Häufige Fehler & Anti-Patterns (Referenz für Fehlersuche-Übungen)

Diese Liste dient als Grundlage für die Erstellung von Fehlersuche-Aufgaben. Jeder Fehler ist ein typischer Anfängerfehler.

**Array-Erstellung:**
- `np.array(1, 2, 3)` statt `np.array([1, 2, 3])` — vergessene eckige Klammern
- `np.zeros(3, 4)` statt `np.zeros((3, 4))` — fehlende Klammer um Shape-Tupel
- Typ-Mismatch: `np.array([1, 2, "drei"])` — erzeugt String-Array statt int

**Indexing:**
- `a[1, 2, 3]` bei 1D-Array statt `a[[1, 2, 3]]` — Verwechslung von Dimensionen und Fancy Indexing
- Off-by-one: `a[0:3]` enthält Index 0, 1, 2 — nicht 3! (exklusives Ende)
- View-Falle: Änderung an einem Slice ändert unbeabsichtigt das Original

**Operationen:**
- `a * b` für Matrixmultiplikation statt `a @ b` oder `np.dot(a, b)` — `*` ist elementweise!
- `a > 2 and a < 5` statt `(a > 2) & (a < 5)` — `and` funktioniert nicht mit Arrays
- Fehlende Klammern bei logischen Operationen: `a > 2 & a < 5` → Operator-Priorität falsch

**Broadcasting:**
- Shape `(3,)` + Shape `(3, 1)` erwartet, aber Shape `(3,)` + Shape `(1, 3)` ergibt `(3, 3)` — unerwartete Dimensionserweiterung
- `a.reshape(3) + b.reshape(4)` → ValueError, da 3 ≠ 4

**Reshape:**
- `a.reshape(3, 5)` wenn `a.size != 15` → ValueError
- Vergessen, dass `reshape` ein neues Array zurückgibt: `a.reshape(3, 4)` ohne Zuweisung ändert `a` nicht
- `-1` mehrfach verwenden: `a.reshape(-1, -1)` → nur ein `-1` erlaubt

**Achsen:**
- `axis=0` und `axis=1` verwechseln (häufigster konzeptioneller Fehler!)
- `np.sum(a, axis=2)` bei 2D-Array → AxisError
- Vergessen, dass `axis` die Achse **eliminiert**, nicht behält

**Statistik:**
- `np.std(data)` berechnet die Populations-Standardabweichung (ddof=0), nicht die Stichproben-Standardabweichung (ddof=1)
- `np.corrcoef` gibt eine Matrix zurück, nicht einen einzelnen Wert



### 9. Skill: Visuelle Darstellung & Content-Design der Theorie-Seiten

Die Theorie-Seiten sind der zentrale Lerninhalt der Plattform. Sie müssen **visuell ansprechend, gut strukturiert und didaktisch aufbereitet** sein — nicht nur inhaltlich korrekt, sondern auch optisch einladend und übersichtlich. Eine bloße Aneinanderreihung von Textabsätzen und Diagrammen ist nicht ausreichend.

#### 9.1 Strukturierte Inhaltsblöcke (Content Blocks)

Theorie-Inhalte bestehen **nicht aus rohem HTML**, sondern aus typisierten Content-Blöcken. Jeder Block-Typ hat ein eigenes visuelles Design. Die Datenstruktur in den Content-Dateien (`src/data/content/*.ts`) verwendet ein Array von `ContentBlock`-Objekten statt eines einzelnen HTML-Strings.

**Block-Typen und ihre visuelle Gestaltung:**

| Block-Typ | Zweck | Visuelles Design |
|-----------|-------|------------------|
| `text` | Fließtext, Aufzählungen, normaler Inhalt | Standard-Prosa mit Tailwind `prose`-Klasse |
| `info` | Hintergrundinformationen, Kontext, weiterführendes Wissen | Blaue Akzentfarbe, Icon (Info-Kreis), leichter blauer Hintergrund, linker Farbbalken |
| `tip` | Praxistipps, Best Practices, Merkregeln | Grüne Akzentfarbe, Icon (Glühbirne), leichter grüner Hintergrund, linker Farbbalken |
| `warning` | Häufige Fehler, typische Stolperfallen | Gelb/Orange-Akzentfarbe, Icon (Warndreieck), leichter gelber Hintergrund, linker Farbbalken |
| `important` | Kritische Regeln, die unbedingt beachtet werden müssen | Rote Akzentfarbe, Icon (Ausrufezeichen), leichter roter Hintergrund, linker Farbbalken |
| `comparison` | Gegenüberstellung zweier Konzepte (z.B. Python-Listen vs. NumPy-Arrays, View vs. Kopie) | Zwei nebeneinanderliegende Karten (Side-by-Side), jeweils mit Titel, Inhalt und optional unterschiedlichen Akzentfarben |
| `table` | Strukturierte Daten, Übersichtstabellen (z.B. Dtypes, Shape-Kompatibilität, Array-Attribute) | Gestylte Tabelle mit farbigem Header, alternierenden Zeilenfarben (Zebra-Striping), klarer Typografie |
| `code` | Python/NumPy-Codebeispiele, Syntax-Beispiele | Dunkler Hintergrund (Code-Block-Stil), mit Label/Titel über dem Block (z.B. „Python-Code"), optional mit Copy-Button |
| `visualization` | SVG-Visualisierung mit Bildunterschrift (Array-Darstellung, Broadcasting-Animation, Memory-Layout etc.) | Zentrierte SVG-Komponente in einer `<figure>` mit `<figcaption>`, leichter Hintergrund, abgerundete Ecken, dezenter Schatten |
| `summary` | Zusammenfassung der Kernpunkte am Ende einer Sektion | Karte mit Aufzählung der Kernpunkte, visuell abgesetzt (z.B. mit Hintergrundfarbe und Rahmen), Icon (Haken-Liste) |

#### 9.2 Seitenlayout und visuelle Hierarchie

**Kapitel-Einstieg (Hero-Bereich):**
- Jede Kapitel-Seite beginnt mit einem visuell hervorgehobenen Einleitungsbereich
- Enthält: Kapitel-Titel, kurze Beschreibung (2–3 Sätze), Bezug zum SmartEnergy-Szenario, und ein kleines dekoratives Icon oder eine Vorschau-Visualisierung (z.B. ein stilisiertes Array-Gitter)
- Farblich abgesetzt vom restlichen Inhalt (z.B. leichter Gradient oder Hintergrundfarbe)

**Sektions-Gliederung:**
- Jede Hauptsektion (h2) erhält eine **Karte** (Card) als visuellen Container: weißer Hintergrund, dezenter Schatten (`shadow-sm`), abgerundete Ecken, leichter Rand
- Zwischen den Sektions-Karten ist genügend vertikaler Abstand (`gap-8` oder `mb-8`)
- Unterabschnitte (h3, h4) liegen innerhalb der Karte, abgetrennt durch leichte Trennlinien oder Einrückung
- Sektionen sind einklappbar (Accordion-Stil), standardmäßig aber **ausgeklappt**

**Inhaltsverzeichnis (optional, empfohlen für längere Seiten):**
- Am Anfang der Theorie-Sektion eine kompakte Übersicht der Sektionen als klickbare Sprungmarken
- Alternativ: Sticky-Sidebar auf Desktop mit Hervorhebung der aktuell sichtbaren Sektion (Scroll-Spy)

#### 9.3 Typografie und Textgestaltung

- **Überschriften:** Klare Größenabstufung (h2 > h3 > h4) mit farblichen Akzenten. H2-Überschriften erhalten eine farbige Akzentlinie (links oder unten) oder ein kleines Icon
- **Fachbegriffe:** Beim ersten Auftreten visuell hervorgehoben — z.B. als `<dfn>` mit leicht farbigem Hintergrund und Tooltip mit deutscher Erklärung (da NumPy-Begriffe englisch sind, steht der englische Begriff zuerst, z.B. „Broadcasting" mit Tooltip „automatische Dimensionserweiterung"). Nicht nur Fettschrift, sondern erkennbar als „definierter Begriff"
- **Inline-Code:** Deutlich abgesetzt mit Hintergrundfarbe (z.B. `bg-slate-100`), monospace-Schrift, abgerundete Ecken
- **Aufzählungen:** Mit Custom-Icons statt Standard-Bullets wo sinnvoll (z.B. Haken für Regeln, Kreuz für Verbote)
- **Hervorhebungen:** `<strong>` im Fließtext erhält eine leicht abweichende Farbe (z.B. `text-primary-dark`), damit Schlüsselbegriffe beim Überfliegen ins Auge fallen

#### 9.4 Visualisierungen-Darstellung (SVG-Komponenten)

- Visualisierungen (Array-Darstellungen, Broadcasting-Animationen, Memory-Layout, Shape-Transformationen) werden immer als **Figur** dargestellt: `<figure>` mit `<figcaption>` darunter
- Zentriert, mit leichtem Hintergrund (`bg-white` oder `bg-slate-50`), abgerundeten Ecken und dezent angedeutetem Schatten
- Bildunterschrift beschreibt die Visualisierung in einem Satz (z.B. „2D-Array mit Shape (3, 4): Zeilen- und Spaltenindizes" oder „Broadcasting: Shape (3, 1) + Shape (1, 4) → Shape (3, 4)")
- Maximale Breite begrenzen, bei Bedarf horizontal scrollbar (für breite Array-Darstellungen)
- Optional: Aufklappbarer Python-Code unterhalb (`<details>/<summary>` Element), der den dargestellten Array-Zustand erzeugt
- Bei mehreren Visualisierungen in einer Sektion: einheitliche Darstellung, konsistente Farbcodierung und Zellgrößen
- **Interaktivität:** Wo sinnvoll, sind Visualisierungen interaktiv — z.B. Hover über Array-Zellen zeigt Index und Wert, Slider ändern Array-Größen, Klick auf Achsen-Buttons wechselt die Aggregationsachse

#### 9.5 Tabellen-Darstellung

- **Header:** Farbiger Hintergrund (Primary-Farbe oder dunkleres Grau), weiße oder helle Schrift, fett
- **Zeilen:** Alternating Row Colors (Zebra-Striping) für bessere Lesbarkeit
- **Zellen:** Angemessenes Padding, linksbündig für Text, zentriert für Symbole/Codes
- **Responsive:** Tabellen werden bei engem Viewport horizontal scrollbar (nicht umbrechen)
- **Code in Tabellen:** `<code>`-Elemente in Tabellenzellen erhalten denselben Stil wie im Fließtext

#### 9.6 Vergleichsdarstellungen

Für häufig vorkommende Gegenüberstellungen (z.B. Python-Listen vs. NumPy-Arrays, View vs. Kopie, `flatten` vs. `ravel`, `axis=0` vs. `axis=1`):

- **Side-by-Side-Karten:** Zwei gleichgroße Karten nebeneinander (auf Desktop), untereinander auf kleinen Screens
- Jede Karte hat: Titel mit Farbakzent, Inhaltsliste, optional eine kleine Array-Visualisierung oder ein Code-Snippet
- Unterschiedliche Akzentfarben zur visuellen Unterscheidung (z.B. links blau, rechts grün)
- Optional: gemeinsamer Bereich darunter für „Gemeinsamkeiten" oder eine Vergleichstabelle

#### 9.7 Animationen und Übergänge

- **Sektionen aufklappen/zuklappen:** Sanfte Höhen-Animation (Framer Motion `AnimatePresence`)
- **Seiten-/Tab-Wechsel:** Kurze Fade-In-Animation beim Wechsel zwischen Theorie/Beispiel/Übungen
- **Visualisierungen:** Fade-In beim Laden (nicht abrupt einblenden). Array-Animationen (z.B. Broadcasting-Stretching, Reshape-Übergänge) verwenden Framer Motion für flüssige Übergänge
- **Keine überflüssigen Animationen:** Animationen dienen der Orientierung, nicht der Dekoration. Kein Bouncing, kein übertriebenes Slide-In

#### 9.8 Farbsystem für Content-Blöcke

Die Farben für die Content-Block-Typen sollen im Tailwind-Farbsystem konsistent definiert sein:

| Block-Typ | Hintergrund | Linker Rand / Akzent | Icon-Farbe | Text-Farbe |
|-----------|-------------|----------------------|------------|------------|
| `info` | `bg-blue-50` | `border-l-4 border-blue-400` | `text-blue-500` | `text-blue-900` |
| `tip` | `bg-emerald-50` | `border-l-4 border-emerald-400` | `text-emerald-500` | `text-emerald-900` |
| `warning` | `bg-amber-50` | `border-l-4 border-amber-400` | `text-amber-500` | `text-amber-900` |
| `important` | `bg-red-50` | `border-l-4 border-red-400` | `text-red-500` | `text-red-900` |
| `summary` | `bg-slate-50` | `border border-slate-200` | `text-slate-500` | `text-slate-900` |

Diese Farben sind ausreichend kontrastreich für WCAG AA und funktionieren auch im Light-Modus.

#### 9.9 Datenstruktur-Vorgabe

Die `TheorySection` und zugehörige Typen in `src/types/index.ts` müssen die strukturierten Content-Blöcke unterstützen:

```typescript
type ContentBlock =
  | { type: 'text'; html: string }
  | { type: 'info'; title?: string; html: string }
  | { type: 'tip'; title?: string; html: string }
  | { type: 'warning'; title?: string; html: string }
  | { type: 'important'; title?: string; html: string }
  | { type: 'comparison'; title?: string; left: ComparisonSide; right: ComparisonSide }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'code'; language: string; code: string; label?: string }
  | { type: 'visualization'; component: string; props?: Record<string, unknown>; alt: string; caption?: string }
  | { type: 'summary'; title?: string; points: string[] }

interface ComparisonSide {
  title: string
  color?: 'blue' | 'green' | 'orange' | 'purple'
  points: string[]
  codeSnippet?: string            // optionaler Code-Schnipsel zur Veranschaulichung
}

interface TheorySection {
  id: string
  title: string
  content: ContentBlock[]   // strukturierte Blöcke statt rohem HTML
  subsections?: TheorySection[]
}
```

**Hinweis zum `visualization`-Block:** Das `component`-Feld referenziert eine der SVG-Visualisierungskomponenten aus `src/components/visualizations/` (z.B. `"ArrayVisualizer"`, `"BroadcastingAnimator"`, `"ShapeTransformer"`, `"MemoryLayoutViewer"`). Die `props` werden direkt an die Komponente weitergegeben (z.B. `{ data: [[1,2],[3,4]], highlightCells: [[0,1]] }`).

Die `TheorySection`-Komponente rendert jeden Block-Typ mit der entsprechenden visuellen Gestaltung. Neue Block-Typen können später ergänzt werden, ohne bestehende Inhalte zu brechen.
