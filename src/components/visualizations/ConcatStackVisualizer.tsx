import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConcatStackVisualizerProps {
  label?: string
}

type Mode = 'concat0' | 'concat1' | 'stack0'

const CELL = 36
const GAP = 2

const arrayA = [
  [1, 2, 3],
  [4, 5, 6],
]
const arrayB = [
  [7, 8, 9],
  [10, 11, 12],
]

const COLORS = {
  a: { bg: '#dbeafe', border: '#3b82f6' },
  b: { bg: '#dcfce7', border: '#16a34a' },
}

function renderGrid(
  data: number[][],
  offsetX: number,
  offsetY: number,
  color: { bg: string; border: string },
  animDelay: number,
) {
  return data.map((row, r) =>
    row.map((val, c) => {
      const x = offsetX + c * (CELL + GAP)
      const y = offsetY + r * (CELL + GAP)
      return (
        <motion.g
          key={`${r}-${c}-${val}`}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: animDelay + (r * row.length + c) * 0.03 }}
        >
          <rect
            x={x} y={y} width={CELL} height={CELL} rx={3}
            fill={color.bg} stroke={color.border} strokeWidth={1.5}
          />
          <text
            x={x + CELL / 2} y={y + CELL / 2 + 4}
            textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#334155"
          >
            {val}
          </text>
        </motion.g>
      )
    }),
  )
}

export default function ConcatStackVisualizer({ label }: ConcatStackVisualizerProps) {
  const [mode, setMode] = useState<Mode>('concat0')

  const rowsA = arrayA.length
  const colsA = arrayA[0].length
  const rowsB = arrayB.length
  const colsB = arrayB[0].length

  // Compute result and layout
  const getResult = () => {
    if (mode === 'concat0') {
      // Stack vertically: rows double
      const result = [...arrayA, ...arrayB]
      const shape = `(${rowsA + rowsB}, ${colsA})`
      return { result, shape, description: 'Zeilen werden angehängt (Achse 0 verlängert)' }
    }
    if (mode === 'concat1') {
      // Stack horizontally: cols double
      const result = arrayA.map((row, i) => [...row, ...arrayB[i]])
      const shape = `(${rowsA}, ${colsA + colsB})`
      return { result, shape, description: 'Spalten werden angehängt (Achse 1 verlängert)' }
    }
    // stack0: new axis
    return {
      result: null,
      layers: [arrayA, arrayB],
      shape: `(2, ${rowsA}, ${colsA})`,
      description: 'Neue Achse 0 erzeugt — es entstehen 2 „Schichten"',
    }
  }

  const info = getResult()

  const modeLabels: Record<Mode, string> = {
    concat0: 'concatenate(axis=0)',
    concat1: 'concatenate(axis=1)',
    stack0: 'stack(axis=0)',
  }

  const PAD = 10
  const resultRows = info.result ? info.result.length : rowsA
  const resultCols = info.result ? info.result[0].length : colsA

  // Input arrays side by side
  const inputWidth = PAD + colsA * (CELL + GAP) + 20 + colsB * (CELL + GAP) + PAD
  const inputHeight = Math.max(rowsA, rowsB) * (CELL + GAP) + 20

  // Result array
  const resultWidth = PAD + resultCols * (CELL + GAP) + PAD
  const resultHeight = resultRows * (CELL + GAP) + 20

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="concat-stack-visualizer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      {/* Mode selector */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(['concat0', 'concat1', 'stack0'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid={`mode-${m}`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-3 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
            <strong>{modeLabels[mode]}:</strong> {info.description} →{' '}
            <code className="bg-blue-100 px-1 rounded">{info.shape}</code>
          </div>

          <div className="flex flex-wrap items-start gap-6">
            {/* Input arrays */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Eingabe: a (2,3) + b (2,3)</p>
              <svg width={inputWidth} height={inputHeight} viewBox={`0 0 ${inputWidth} ${inputHeight}`}>
                {renderGrid(arrayA, PAD, 10, COLORS.a, 0)}
                <text
                  x={PAD + colsA * (CELL + GAP) + 8}
                  y={inputHeight / 2 + 4}
                  fontSize={14} className="fill-slate-400"
                >+</text>
                {renderGrid(arrayB, PAD + colsA * (CELL + GAP) + 20, 10, COLORS.b, 0)}
              </svg>
            </div>

            {/* Arrow */}
            <div className="flex items-center self-center text-slate-400 text-2xl">→</div>

            {/* Result */}
            <div>
              <p className="text-xs text-slate-500 mb-1">Ergebnis: {info.shape}</p>
              {info.result ? (
                <svg width={resultWidth} height={resultHeight} viewBox={`0 0 ${resultWidth} ${resultHeight}`}>
                  {info.result.map((row, r) =>
                    row.map((val, c) => {
                      const x = PAD + c * (CELL + GAP)
                      const y = 10 + r * (CELL + GAP)
                      // Determine origin color
                      const isFromA = mode === 'concat0'
                        ? r < rowsA
                        : c < colsA
                      const color = isFromA ? COLORS.a : COLORS.b
                      return (
                        <motion.g
                          key={`r-${r}-${c}`}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 + (r * row.length + c) * 0.03 }}
                        >
                          <rect
                            x={x} y={y} width={CELL} height={CELL} rx={3}
                            fill={color.bg} stroke={color.border} strokeWidth={1.5}
                          />
                          <text
                            x={x + CELL / 2} y={y + CELL / 2 + 4}
                            textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#334155"
                          >
                            {val}
                          </text>
                        </motion.g>
                      )
                    }),
                  )}
                </svg>
              ) : (
                // Stack: show layers
                <div className="flex flex-col gap-1" data-testid="stack-layers">
                  {info.layers!.map((layer, li) => {
                    const layerW = PAD + layer[0].length * (CELL + GAP) + PAD
                    const layerH = layer.length * (CELL + GAP) + 10
                    const color = li === 0 ? COLORS.a : COLORS.b
                    return (
                      <div key={li}>
                        <p className="text-[10px] text-slate-400 font-mono">Schicht [{li}]</p>
                        <svg width={layerW} height={layerH} viewBox={`0 0 ${layerW} ${layerH}`}>
                          {renderGrid(layer, PAD, 2, color, 0.2 + li * 0.15)}
                        </svg>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
