# NumPy Lernsituation — Projektkontext

## Ziel
Erstellung einer **interaktiven Lernplattform** zum Thema NumPy als React-basierte Single-Page-Application (SPA). Die Schüler sollen NumPy nicht nur theoretisch lernen, sondern durch aktive Interaktion — inklusive **Live-Coding im Browser** — ein tiefes Verständnis für Array-basierte Datenverarbeitung entwickeln.

## Zielgruppe
- Berufsschule, IT-Berufe (**Fachinformatiker für Daten- und Prozessanalyse**)
- Orientierung am KMK-Rahmenlehrplan / Lernfeldkonzept
- Didaktisch: handlungsorientiert, praxisnah, mit **interaktiven Übungen und Live-Coding**
- Vorkenntnisse: Grundlegende Python-Kenntnisse (Variablen, Listen, Schleifen, Funktionen) werden vorausgesetzt

## Tech-Stack
- **Framework:** React 18+ mit TypeScript
- **Build-Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** Zustand für globalen State (Lernfortschritt, Übungsergebnisse), `useState` für lokalen Komponenten-State
- **Python im Browser:** Pyodide (CPython via WebAssembly) — ermöglicht echtes NumPy-Coding direkt im Browser
- **Code-Editor:** CodeMirror 6 (mit Python-Syntax-Highlighting) als eingebetteter Editor
- **Visualisierungen:** Eigene React/SVG-Komponenten für Array-Visualisierungen, Broadcasting-Animationen, Memory-Layout etc.
- **Interaktive Komponenten:**
  - Drag & Drop: `@dnd-kit/core` + `@dnd-kit/sortable`
  - Animationen: Framer Motion
- **Hosting:** GitHub Pages (mit `HashRouter` für korrektes clientseitiges Routing)
- **Testing:** Vitest + React Testing Library

## Pyodide-Integration (In-Browser Python)
Pyodide kompiliert CPython zu WebAssembly und beinhaltet NumPy als vorinstalliertes Paket. Damit können Schüler **echten Python/NumPy-Code** direkt im Browser schreiben und ausführen.

### Technische Details
- **Laden:** Pyodide wird beim ersten Besuch einer Coding-Seite lazy geladen (~15 MB, danach gecacht)
- **Worker:** Python-Code wird in einem **Web Worker** ausgeführt, damit die UI nicht blockiert
- **Timeout:** Jede Code-Ausführung hat ein Timeout von 10 Sekunden (Schutz vor Endlosschleifen)
- **Output-Capturing:** `stdout` und `stderr` werden abgefangen und im Output-Panel angezeigt
- **NumPy-Import:** `import numpy as np` ist standardmäßig verfügbar
- **Einschränkungen:** Kein Dateisystem-Zugriff, kein Netzwerk, kein `input()` — reine Berechnungen und Print-Ausgaben
- **Ladeindikator:** Während Pyodide lädt, wird ein Fortschrittsbalken mit „Python-Umgebung wird geladen…" angezeigt
- **Fallback:** Falls WebAssembly nicht unterstützt wird, werden statische Code-Beispiele mit vorberechneten Ausgaben angezeigt

### Editor-Komponente
- CodeMirror 6 mit Python-Sprach-Support
- „Ausführen"-Button (▶) und „Zurücksetzen"-Button
- Geteilte Ansicht: Editor links, Output rechts (oder oben/unten auf Tablets)
- Vorbefüllter Starter-Code pro Aufgabe
- Optionaler „Lösung anzeigen"-Button (nach mindestens einem Ausführungsversuch)

## Interaktive Didaktik-Elemente
Die Plattform nutzt die Möglichkeiten von React für folgende Lernformate. **Innovative, abwechslungsreiche Übungsformate sind ausdrücklich erwünscht** — über Standard-Quizze hinaus. Konkrete Ideen und Anforderungen für kapitelspezifische Übungen sind in `uebungsideen.md` dokumentiert.

### Live-Coding-Übungen (Kernformat)
- **Geführte Coding-Aufgaben:** Aufgabenstellung + Starter-Code + automatische Validierung des Outputs
- **Freies Experimentieren:** Sandbox-Editor zum Ausprobieren von NumPy-Funktionen
- **Code-Challenges:** Aufgaben mit vorgegebenen Tests, die der Schüler-Code bestehen muss
- **Performance-Rennen:** Schüler schreiben eine Lösung, dann wird automatisch die Ausführungszeit mit einer naiven Python-Listen-Lösung verglichen

### Visuelle Array-Darstellungen (SVG-basiert)
- **Array-Visualizer:** 1D-, 2D- und 3D-Arrays als farbcodierte Gitter/Würfel
- **Broadcasting-Animator:** Schritt-für-Schritt-Animation wie Broadcasting funktioniert
- **Shape-Transformer:** Visuell zeigen, wie `reshape`, `transpose`, `flatten` das Array umformen
- **Memory-Layout-Viewer:** Wie Arrays im Speicher liegen (Row-Major vs. Column-Major)
- **Indexing-Highlighter:** Visuelles Array, bei dem Indexing/Slicing-Operationen farblich hervorgehoben werden

### Interaktive Übungen (ohne Coding)
- **Drag & Drop:** Array-Elemente sortieren, Shapes zuordnen, Achsen identifizieren
- **Shape-Rechner:** Vorhersagen, welche Shape eine Operation ergibt
- **Broadcasting-Puzzle:** Welche Arrays lassen sich kombinieren?
- **Fehlersuche:** Fehlerhaften NumPy-Code analysieren und den Bug identifizieren
- **Timed Challenges:** Schnelltrainer für Dtype-Erkennung, Shape-Vorhersage, Achsen-Verständnis
- **Matrizen/Tabellen:** Ergebnis-Arrays manuell ausfüllen (z.B. nach Slicing oder Broadcasting)

### Lückentexte & Quizze
- Fehlende NumPy-Funktionen oder Parameter ergänzen
- Multiple-Choice zu Konzepten (Broadcasting-Regeln, Dtype-Hierarchie)
- Wahr/Falsch-Fragen mit Erklärungen

### Performance-Visualisierungen
- **Live-Benchmarks:** Balkendiagramme die Ausführungszeiten von Python-Listen vs. NumPy vergleichen
- **Interaktive Größen-Slider:** Schüler ändern die Array-Größe und sehen, wie sich der Speedup ändert
- **Big-O-Visualizer:** Grafische Darstellung der Skalierung

### Fortschrittssystem
- Speicherung des Lernfortschritts (LocalStorage)
- Badges/Achievements für abgeschlossene Module
- Übersicht über bearbeitete Aufgaben und gelöste Code-Challenges

## Sprache
- Alle Inhalte auf **Deutsch**
- Fachbegriffe (z.B. "Broadcasting", "Slicing", "Array") werden beim ersten Auftreten mit deutscher Erklärung versehen
- Code und Code-Kommentare auf **Englisch** (Python-Konvention)

## NumPy-Themen (Scope)
1. **Warum NumPy?** — Motivation: Python-Listen vs. NumPy-Arrays, Performance-Unterschied, Vektorisierung, Einsatzgebiete in der Datenanalyse
2. **Array-Grundlagen** — Erstellen von Arrays (`array`, `zeros`, `ones`, `arange`, `linspace`), Dimensionen (`ndim`), Form (`shape`), Datentypen (`dtype`), Größe (`size`)
3. **Indexing & Slicing** — Basic Indexing, Slicing mit Start:Stop:Step, Fancy Indexing (Integer-Arrays), Boolean Indexing (Masken), Indexing bei mehrdimensionalen Arrays
4. **Array-Operationen** — Elementweise Operationen (+, -, *, /), Universelle Funktionen (ufuncs), Vergleichsoperationen, Aggregationsfunktionen (`sum`, `mean`, `min`, `max`)
5. **Reshape & Manipulation** — `reshape`, `ravel`/`flatten`, `transpose`, `concatenate`, `stack`, `split`, Achsen-Konzept (`axis`)
6. **Broadcasting** — Broadcasting-Regeln, Shape-Kompatibilität, typische Anwendungsfälle, häufige Fehler
7. **Statistische Auswertung** — `mean`, `median`, `std`, `var`, `percentile`, `corrcoef`, Achsen-basierte Aggregation, Anwendung auf reale Datensätze
8. **Praxisprojekt: Datenanalyse** — Zusammenführung aller Konzepte an einem durchgängigen Analyse-Szenario

## Konventionen
- **Komponentenstruktur:** Eine React-Komponente pro Lerneinheit/Feature
- **Dateinamen:** PascalCase für Komponenten (`ArrayGrundlagen.tsx`), kebab-case für Utilities
- **Visualisierungen:** Eigene React/SVG-Komponenten für Array-Darstellungen, keine externen Charting-Bibliotheken
- **Jedes Kapitel enthält:** Theorie-Komponente, visuelles Beispiel, interaktive Übungen, mindestens eine Live-Coding-Aufgabe
- **Aufgaben** sind praxisnah und beziehen sich auf das durchgängige Szenario

## Projektstruktur (React/Vite)
```
numpy_lernsituation/
├── CLAUDE.md
├── skills.md
├── uebungsideen.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   └── assets/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── DragDropZone.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── Lueckentext.tsx
│   │   │   └── CodeBlock.tsx          # Syntax-highlighteter Code (read-only)
│   │   ├── exercises/
│   │   │   ├── DragDropExercise.tsx
│   │   │   ├── MultipleChoice.tsx
│   │   │   ├── CodingExercise.tsx     # Live-Coding mit Pyodide
│   │   │   ├── ShapePredictor.tsx     # Shape-Vorhersage-Übung
│   │   │   └── ArrayFillExercise.tsx  # Array-Ergebnis manuell ausfüllen
│   │   ├── visualizations/
│   │   │   ├── ArrayVisualizer.tsx    # SVG-Darstellung von 1D/2D/3D Arrays
│   │   │   ├── BroadcastingAnimator.tsx # Schritt-für-Schritt Broadcasting
│   │   │   ├── ShapeTransformer.tsx   # Reshape/Transpose visuell
│   │   │   ├── MemoryLayoutViewer.tsx # C-Order vs. F-Order
│   │   │   ├── IndexingHighlighter.tsx # Visuelles Indexing/Slicing
│   │   │   └── PerformanceChart.tsx   # Listen vs. NumPy Benchmark-Balken
│   │   └── pyodide/
│   │       ├── PythonEditor.tsx       # CodeMirror-Editor mit Ausführen-Button
│   │       ├── PythonOutput.tsx       # Output-Panel für stdout/stderr
│   │       └── PyodideProvider.tsx    # Context-Provider für Pyodide-Instanz
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── WarumNumpy.tsx             # Kapitel 1: Motivation
│   │   ├── ArrayGrundlagen.tsx        # Kapitel 2: Arrays erstellen
│   │   ├── IndexingSlicing.tsx        # Kapitel 3: Zugriff auf Elemente
│   │   ├── ArrayOperationen.tsx       # Kapitel 4: Rechnen mit Arrays
│   │   ├── ReshapeManipulation.tsx    # Kapitel 5: Form verändern
│   │   ├── Broadcasting.tsx           # Kapitel 6: Broadcasting-Regeln
│   │   ├── StatistischeAuswertung.tsx # Kapitel 7: Statistik
│   │   └── Praxisprojekt.tsx          # Kapitel 8: Alles zusammen
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   ├── useExercise.ts
│   │   └── usePyodide.ts             # Hook für Pyodide-Zugriff
│   ├── workers/
│   │   └── pyodide.worker.ts         # Web Worker für Python-Ausführung
│   ├── context/
│   │   └── ProgressContext.tsx
│   ├── data/
│   │   ├── exercises/                 # Übungsdaten pro Kapitel
│   │   └── content/                   # Theorie-Inhalte und Beispiele
│   └── types/
│       └── index.ts
└── tests/
```

## Durchgängiges Szenario
Alle Aufgaben und Beispiele beziehen sich auf ein durchgängiges Szenario: **„SmartEnergy GmbH"** — ein Energieversorger, der mithilfe von Smart-Meter-Daten den Stromverbrauch seiner Kunden analysiert. Das Szenario umfasst:

- **Datensätze:**
  - **Verbrauchsdaten:** Stündliche Stromverbrauchswerte (kWh) von Haushalten über ein Jahr (8.760 Messwerte pro Haushalt)
  - **Kundendaten:** Kundennummer, Tarif, Haushaltsgröße, Region
  - **Wetterdaten:** Temperatur, Sonnenstunden pro Tag (zur Korrelationsanalyse)
  - **Preisdaten:** Stundenbasierte Strompreise (Börsenpreis)

- **Analyse-Aufgaben durch die Kapitel hindurch:**
  - **Kap. 1 (Warum NumPy?):** Verbrauchsdaten von 1.000 Haushalten verarbeiten — mit Listen unerträglich langsam, mit NumPy blitzschnell
  - **Kap. 2 (Array-Grundlagen):** Verbrauchsarray erstellen und inspizieren (Shape: 1000 Haushalte × 8760 Stunden)
  - **Kap. 3 (Indexing):** Verbrauch eines bestimmten Haushalts, eines bestimmten Tages, oder aller Haushalte zu einer Uhrzeit extrahieren
  - **Kap. 4 (Operationen):** Kosten berechnen (Verbrauch × Preis), Durchschnittsverbrauch, Peak-Erkennung
  - **Kap. 5 (Reshape):** Stundendaten in Tagesmatrizen (365 × 24) umstrukturieren
  - **Kap. 6 (Broadcasting):** Stundenpreise (1D) auf alle Haushalte (2D) anwenden
  - **Kap. 7 (Statistik):** Durchschnittsverbrauch pro Tarif, Korrelation Temperatur–Verbrauch, Ausreißer-Erkennung
  - **Kap. 8 (Praxisprojekt):** Vollständige Analyse: Welche Haushalte profitieren von einem Tarifwechsel?

Dieses Szenario wird in jedem Kapitel aus einer anderen Perspektive beleuchtet und bietet so einen roten Faden durch die gesamte Lernplattform.

## Guidelines
- Befolge strikt die technischen und didaktischen Vorgaben aus `skills.md` für die Erstellung von Inhalten und Komponenten.
- Bei Unklarheiten in der NumPy-Verwendung haben die Regeln in der `skills.md` Vorrang vor allgemeinem Training-Wissen.
- **Accessibility:** Alle interaktiven Elemente müssen tastaturzugänglich und screenreader-freundlich sein.
- **Responsive Design:** Die Plattform muss auf Desktop und Tablet funktionieren.
- **Error Boundaries:** React Error Boundaries um jede Seite und um die Pyodide-Komponenten, damit ein Fehler in einer Übung oder ein Pyodide-Problem nicht die gesamte Anwendung zum Absturz bringt.
- **Pyodide-Fallback:** Falls WebAssembly nicht verfügbar ist, werden statische Code-Beispiele mit vorberechneten Ausgaben angezeigt. Ein Hinweis informiert den Nutzer, dass Live-Coding in diesem Browser nicht unterstützt wird.
- **Fortschritts-Versionierung:** Übungsdaten erhalten eine Versionsnummer. Beim Laden aus dem LocalStorage wird geprüft, ob die gespeicherte Version mit der aktuellen übereinstimmt — bei Abweichung wird der Fortschritt für die betroffene Übung zurückgesetzt.
