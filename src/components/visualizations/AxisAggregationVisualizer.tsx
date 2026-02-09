import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AxisAggregationVisualizerProps {
  data: number[][]
  label?: string
  fn?: 'sum' | 'mean'
}

const CELL = 44
const GAP = 3
const HEADER = 28

type AxisMode = null | 0 | 1 | 'all'

function computeResult(data: number[][], axis: AxisMode, fn: 'sum' | 'mean'): number[] | number {
  const agg = fn === 'sum' ? (arr: number[]) => arr.reduce((a, b) => a + b, 0) : (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  if (axis === 'all') return agg(data.flat())
  if (axis === 0) {
    const cols = data[0].length
    return Array.from({ length: cols }, (_, c) => agg(data.map((row) => row[c])))
  }
  if (axis === 1) {
    return data.map((row) => agg(row))
  }
  return 0
}

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

export default function AxisAggregationVisualizer({ data, label, fn = 'sum' }: AxisAggregationVisualizerProps) {
  const [axis, setAxis] = useState<AxisMode>(null)
  const rows = data.length
  const cols = data[0].length

  const result = axis !== null ? computeResult(data, axis, fn) : null

  const fnLabel = fn === 'sum' ? 'np.sum' : 'np.mean'

  // Determine which cells are "collapsing" (highlighted)
  const getCellColor = (r: number, c: number) => {
    if (axis === null) return '#e2e8f0'
    if (axis === 'all') return '#fde68a'
    if (axis === 0) {
      // Highlight the whole column — group by column
      const hue = (c / cols) * 280
      return `hsl(${hue}, 65%, 82%)`
    }
    // axis === 1: highlight the whole row — group by row
    const hue = (r / rows) * 280
    return `hsl(${hue}, 65%, 82%)`
  }

  const svgWidth = HEADER + cols * (CELL + GAP)
  const svgHeight = HEADER + rows * (CELL + GAP)

  // Result array visualization
  const renderResult = () => {
    if (result === null) return null

    if (axis === 'all') {
      return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
          <p className="text-xs text-slate-500 mb-1">Ergebnis: Skalar</p>
          <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 font-mono text-lg rounded-lg border border-amber-200 font-bold">
            {fmt(result as number)}
          </div>
        </motion.div>
      )
    }

    const arr = result as number[]
    const isRow = axis === 1
    const cellCount = arr.length

    const rWidth = HEADER + cellCount * (CELL + GAP)
    const rHeight = CELL + 8

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
        <p className="text-xs text-slate-500 mb-1">
          Ergebnis — Shape ({arr.length},) — {isRow ? 'ein Wert pro Zeile (Haushalt)' : 'ein Wert pro Spalte (Stunde)'}
        </p>
        <div className="overflow-x-auto">
          <svg width={rWidth} height={rHeight} viewBox={`0 0 ${rWidth} ${rHeight}`}>
            {arr.map((v, i) => {
              const hue = (i / cellCount) * 280
              const x = HEADER + i * (CELL + GAP)
              return (
                <motion.g key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <rect x={x} y={4} width={CELL} height={CELL} rx={4}
                    fill={`hsl(${hue}, 65%, 82%)`} stroke={`hsl(${hue}, 50%, 65%)`} strokeWidth={1.5} />
                  <text x={x + CELL / 2} y={4 + CELL / 2 + 4} textAnchor="middle"
                    fontSize={12} fontFamily="monospace" className="fill-slate-800">{fmt(v)}</text>
                </motion.g>
              )
            })}
          </svg>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="axis-aggregation-visualizer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <p className="text-sm text-slate-500 mb-3">
        Wähle eine Achse, um zu sehen, welche Elemente zusammengefasst werden:
      </p>

      <div className="flex items-center gap-2 mb-4">
        {([null, 'all', 0, 1] as AxisMode[]).map((a) => {
          const labels: Record<string, string> = {
            null: 'Keine',
            all: `${fnLabel}(data)`,
            '0': `${fnLabel}(data, axis=0)`,
            '1': `${fnLabel}(data, axis=1)`,
          }
          const isActive = axis === a
          return (
            <button
              key={String(a)}
              onClick={() => setAxis(a)}
              className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {labels[String(a)]}
            </button>
          )
        })}
      </div>

      {/* Description of what happens */}
      <AnimatePresence mode="wait">
        {axis !== null && (
          <motion.div
            key={String(axis)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800"
          >
            {axis === 'all' && 'Alle Elemente werden zu einem Wert zusammengefasst.'}
            {axis === 0 && (
              <>
                <strong>axis=0</strong>: Aggregation <em>über die Zeilen</em> — pro Spalte wird ein Wert berechnet.
                Die Zeilen-Dimension wird entfernt.{' '}
                <span className="font-mono text-xs">({rows},{cols}) → ({cols},)</span>
              </>
            )}
            {axis === 1 && (
              <>
                <strong>axis=1</strong>: Aggregation <em>über die Spalten</em> — pro Zeile wird ein Wert berechnet.
                Die Spalten-Dimension wird entfernt.{' '}
                <span className="font-mono text-xs">({rows},{cols}) → ({rows},)</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid with arrow annotations */}
      <div className="flex gap-4 items-start">
        <div className="overflow-x-auto">
          <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Column headers */}
            {Array.from({ length: cols }, (_, c) => (
              <text key={`ch-${c}`} x={HEADER + c * (CELL + GAP) + CELL / 2} y={HEADER - 8}
                textAnchor="middle" fontSize={10} fontFamily="monospace" className="fill-slate-400">{c}</text>
            ))}
            {/* Cells */}
            {data.map((row, r) => (
              <g key={r}>
                <text x={HEADER - 8} y={HEADER + r * (CELL + GAP) + CELL / 2 + 4}
                  textAnchor="end" fontSize={10} fontFamily="monospace" className="fill-slate-400">{r}</text>
                {row.map((val, c) => {
                  const x = HEADER + c * (CELL + GAP)
                  const y = HEADER + r * (CELL + GAP)
                  return (
                    <motion.g key={`${r}-${c}`}>
                      <motion.rect
                        x={x} y={y} width={CELL} height={CELL} rx={4}
                        stroke="#cbd5e1" strokeWidth={1}
                        animate={{ fill: getCellColor(r, c) }}
                        transition={{ duration: 0.3 }}
                      />
                      <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle"
                        fontSize={12} fontFamily="monospace" className="fill-slate-800">{val}</text>
                    </motion.g>
                  )
                })}
              </g>
            ))}

            {/* Arrow annotations for axis direction */}
            {axis === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Array.from({ length: cols }, (_, c) => {
                  const x = HEADER + c * (CELL + GAP) + CELL / 2
                  const y1 = HEADER
                  const y2 = HEADER + (rows - 1) * (CELL + GAP) + CELL
                  return (
                    <g key={`arrow-${c}`}>
                      <line x1={x} y1={y1 - 2} x2={x} y2={y2 + 4} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 2" opacity={0.5} />
                    </g>
                  )
                })}
              </motion.g>
            )}
            {axis === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Array.from({ length: rows }, (_, r) => {
                  const y = HEADER + r * (CELL + GAP) + CELL / 2
                  const x1 = HEADER
                  const x2 = HEADER + (cols - 1) * (CELL + GAP) + CELL
                  return (
                    <g key={`arrow-${r}`}>
                      <line x1={x1 - 2} y1={y} x2={x2 + 4} y2={y} stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 2" opacity={0.5} />
                    </g>
                  )
                })}
              </motion.g>
            )}
          </svg>
        </div>

        {/* Axis direction label */}
        {axis === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-blue-600 font-medium mt-6">
            ↓ axis=0<br /><span className="text-xs text-slate-500">Zeilen werden<br />zusammengefasst</span>
          </motion.div>
        )}
        {axis === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-blue-600 font-medium mt-6">
            → axis=1<br /><span className="text-xs text-slate-500">Spalten werden<br />zusammengefasst</span>
          </motion.div>
        )}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {axis !== null && <div key={String(axis)}>{renderResult()}</div>}
      </AnimatePresence>
    </div>
  )
}
