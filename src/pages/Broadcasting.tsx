import Navigation from '../components/common/Navigation'
import BroadcastingAnimator from '../components/visualizations/BroadcastingAnimator'
import { useChapterTracking } from '../hooks/useChapterTracking'

export default function Broadcasting() {
  useChapterTracking('broadcasting')

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
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
      </main>
    </div>
  )
}
