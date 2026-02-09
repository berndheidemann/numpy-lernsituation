import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface VectorizationAnimatorProps {
  label?: string
}

const CELL = 36
const GAP = 4
const VALUES = [3, 7, 2, 9, 5, 1, 8, 4]
const RESULT = VALUES.map((v) => v * 2)

export default function VectorizationAnimator({ label }: VectorizationAnimatorProps) {
  const [mode, setMode] = useState<'idle' | 'loop' | 'vector'>('idle')
  const [loopIndex, setLoopIndex] = useState(-1)
  const [vectorActive, setVectorActive] = useState(false)
  const [done, setDone] = useState(false)

  const reset = useCallback(() => {
    setMode('idle')
    setLoopIndex(-1)
    setVectorActive(false)
    setDone(false)
  }, [])

  // Loop animation
  useEffect(() => {
    if (mode !== 'loop') return
    if (loopIndex >= VALUES.length) {
      setDone(true)
      return
    }
    const timer = setTimeout(() => setLoopIndex((i) => i + 1), 400)
    return () => clearTimeout(timer)
  }, [mode, loopIndex])

  // Vector animation
  useEffect(() => {
    if (mode !== 'vector') return
    const timer = setTimeout(() => {
      setVectorActive(true)
      setTimeout(() => setDone(true), 600)
    }, 300)
    return () => clearTimeout(timer)
  }, [mode])

  const startLoop = () => {
    reset()
    setTimeout(() => {
      setMode('loop')
      setLoopIndex(0)
    }, 50)
  }

  const startVector = () => {
    reset()
    setTimeout(() => setMode('vector'), 50)
  }

  const totalWidth = VALUES.length * (CELL + GAP) + GAP
  const svgHeight = CELL + 8

  const renderCells = (active: (i: number) => boolean, showResult: boolean) => (
    <svg width={totalWidth} height={svgHeight} viewBox={`0 0 ${totalWidth} ${svgHeight}`}>
      {VALUES.map((val, i) => {
        const x = GAP + i * (CELL + GAP)
        const isActive = active(i)
        return (
          <motion.g key={i}>
            <motion.rect
              x={x} y={4} width={CELL} height={CELL} rx={4}
              fill={isActive ? '#86efac' : '#e2e8f0'}
              stroke={isActive ? '#16a34a' : '#cbd5e1'}
              strokeWidth={isActive ? 2 : 1}
              animate={{ fill: isActive ? '#86efac' : '#e2e8f0' }}
              transition={{ duration: 0.15 }}
            />
            <text x={x + CELL / 2} y={4 + CELL / 2 + 4} textAnchor="middle"
              fontSize={12} fontFamily="monospace" className="fill-slate-800">
              {showResult && isActive ? RESULT[i] : val}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="vectorization-animator">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <p className="text-sm text-slate-500 mb-4">
        Vergleiche: Eine Python-Schleife verarbeitet Elemente <strong>nacheinander</strong>,
        NumPy-Vektorisierung verarbeitet <strong>alle gleichzeitig</strong>.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Python Loop side */}
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-red-700">Python-Schleife</span>
            <span className="text-xs font-mono text-red-500">for x in liste:</span>
          </div>
          <div className="mb-2 text-xs text-slate-500">arr * 2 =</div>
          <div className="overflow-x-auto">
            {renderCells(
              (i) => mode === 'loop' && i < loopIndex,
              mode === 'loop'
            )}
          </div>
          {mode === 'loop' && !done && (
            <div className="mt-2 text-xs text-red-600 font-mono">
              Verarbeite Element {Math.min(loopIndex, VALUES.length - 1)}...
            </div>
          )}
          {mode === 'loop' && done && (
            <div className="mt-2 text-xs text-green-600 font-medium">Fertig! ({VALUES.length} Schritte)</div>
          )}
        </div>

        {/* NumPy Vector side */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-700">NumPy-Vektorisierung</span>
            <span className="text-xs font-mono text-green-500">arr * 2</span>
          </div>
          <div className="mb-2 text-xs text-slate-500">arr * 2 =</div>
          <div className="overflow-x-auto">
            {renderCells(
              () => mode === 'vector' && vectorActive,
              mode === 'vector' && vectorActive
            )}
          </div>
          {mode === 'vector' && vectorActive && (
            <div className="mt-2 text-xs text-green-600 font-medium">Fertig! (1 Schritt)</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={startLoop}
          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
        >
          Schleife starten
        </button>
        <button
          onClick={startVector}
          className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors font-medium"
        >
          Vektorisierung starten
        </button>
        <button
          onClick={reset}
          className="px-3 py-2 text-sm bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  )
}
