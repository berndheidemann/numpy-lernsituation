import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BroadcastingAnimatorProps {
  shapeA: number[]
  shapeB: number[]
  label?: string
}

interface BroadcastStep {
  type: 'compare' | 'pad' | 'stretch' | 'result' | 'error'
  description: string
  shapeA: (number | string)[]
  shapeB: (number | string)[]
}

function computeBroadcasting(shapeA: number[], shapeB: number[]): {
  steps: BroadcastStep[]
  compatible: boolean
  resultShape: number[]
} {
  const steps: BroadcastStep[] = []
  const maxLen = Math.max(shapeA.length, shapeB.length)

  // Step 1: Pad shorter shape with 1s
  let padA = [...shapeA]
  let padB = [...shapeB]
  const needsPad = padA.length !== padB.length

  while (padA.length < maxLen) padA = [1, ...padA]
  while (padB.length < maxLen) padB = [1, ...padB]

  if (needsPad) {
    steps.push({
      type: 'pad',
      description: `Kürzere Shape wird links mit 1 aufgefüllt`,
      shapeA: padA.map((v, i) => i < maxLen - shapeA.length ? '1*' : v),
      shapeB: padB.map((v, i) => i < maxLen - shapeB.length ? '1*' : v),
    })
  }

  // Step 2: Compare dimensions right to left
  steps.push({
    type: 'compare',
    description: 'Dimensionen werden von rechts nach links verglichen',
    shapeA: padA,
    shapeB: padB,
  })

  // Step 3: Check compatibility and stretch
  const result: number[] = []
  let compatible = true

  for (let i = 0; i < maxLen; i++) {
    const a = padA[i]
    const b = padB[i]
    if (a === b) {
      result.push(a)
    } else if (a === 1) {
      result.push(b)
    } else if (b === 1) {
      result.push(a)
    } else {
      compatible = false
      steps.push({
        type: 'error',
        description: `Dimension ${i}: ${a} ≠ ${b} und keine davon ist 1 → Inkompatibel!`,
        shapeA: padA,
        shapeB: padB,
      })
      break
    }
  }

  if (compatible) {
    steps.push({
      type: 'stretch',
      description: 'Dimensionen der Größe 1 werden gestreckt',
      shapeA: padA.map((v, i) => v === 1 && padB[i] !== 1 ? `1→${padB[i]}` : v),
      shapeB: padB.map((v, i) => v === 1 && padA[i] !== 1 ? `1→${padA[i]}` : v),
    })

    steps.push({
      type: 'result',
      description: `Ergebnis-Shape: (${result.join(', ')})`,
      shapeA: result,
      shapeB: result,
    })
  }

  return { steps, compatible, resultShape: result }
}

function ShapeDisplay({ shape, color }: { shape: (number | string)[]; color: string }) {
  return (
    <div className="flex items-center gap-1 font-mono text-sm">
      <span className="text-slate-400">(</span>
      {shape.map((dim, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <span className="text-slate-400 mx-0.5">,</span>}
          <motion.span
            className={`inline-block px-1.5 py-0.5 rounded ${
              String(dim).includes('→') || String(dim).includes('*')
                ? 'bg-amber-100 text-amber-800 font-bold'
                : `${color}`
            }`}
            initial={{ scale: 1 }}
            animate={{ scale: String(dim).includes('→') ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            {dim}
          </motion.span>
        </span>
      ))}
      <span className="text-slate-400">)</span>
    </div>
  )
}

export default function BroadcastingAnimator({ shapeA, shapeB, label }: BroadcastingAnimatorProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const { steps, compatible, resultShape } = useMemo(
    () => computeBroadcasting(shapeA, shapeB),
    [shapeA, shapeB],
  )

  const step = steps[currentStep] ?? steps[0]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="broadcasting-animator">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="mb-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 w-16">Shape A:</span>
            <ShapeDisplay shape={step?.shapeA ?? shapeA} color="bg-blue-100 text-blue-800" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 w-16">Shape B:</span>
            <ShapeDisplay shape={step?.shapeB ?? shapeB} color="bg-purple-100 text-purple-800" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`p-3 rounded-lg text-sm mb-4 ${
            step?.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : step?.type === 'result'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <span className="font-medium">Schritt {currentStep + 1}/{steps.length}:</span>{' '}
          {step?.description}
        </motion.div>
      </AnimatePresence>

      {compatible && step?.type === 'result' && (
        <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800 mb-4">
          <span className="font-medium">Kompatibel!</span> Ergebnis-Shape:{' '}
          <span className="font-mono font-bold">({resultShape.join(', ')})</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1.5 text-sm bg-slate-100 rounded-md hover:bg-slate-200 disabled:opacity-50 transition-colors"
          data-testid="step-back"
        >
          Zurück
        </button>
        <button
          onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep >= steps.length - 1}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          data-testid="step-forward"
        >
          Weiter
        </button>
        <span className="text-xs text-slate-400 ml-2">
          {currentStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  )
}
