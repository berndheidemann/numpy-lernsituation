import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface ShapeTransformerProps {
  /** Flat array values */
  values: number[]
  /** Available reshape options as [rows, cols] tuples */
  shapes: [number, number][]
  label?: string
}

const CELL = 40
const GAP = 3
const HEADER = 24

export default function ShapeTransformer({ values, shapes, label }: ShapeTransformerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const shape = shapes[selectedIdx]
  const [rows, cols] = shape

  const grid = useMemo(() => {
    const result: number[][] = []
    for (let r = 0; r < rows; r++) {
      const row: number[] = []
      for (let c = 0; c < cols; c++) {
        const flatIdx = r * cols + c
        row.push(values[flatIdx] ?? 0)
      }
      result.push(row)
    }
    return result
  }, [values, rows, cols])

  const svgWidth = HEADER + cols * (CELL + GAP)
  const svgHeight = HEADER + rows * (CELL + GAP)

  // Flat memory view
  const memWidth = values.length * (CELL + GAP) + HEADER

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="shape-transformer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-slate-600">Reshape zu:</span>
        {shapes.map(([r, c], idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className={`px-3 py-1 text-sm font-mono rounded-md transition-colors ${
              idx === selectedIdx
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid={`shape-option-${r}x${c}`}
          >
            ({r}, {c})
          </button>
        ))}
      </div>

      {/* Logical array view */}
      <p className="text-xs text-slate-500 mb-1 font-medium">
        Logische Darstellung — Shape ({rows}, {cols}):
      </p>
      <div className="overflow-x-auto mb-4">
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {Array.from({ length: cols }, (_, c) => (
            <text key={`ch-${c}`} x={HEADER + c * (CELL + GAP) + CELL / 2} y={HEADER - 6}
              textAnchor="middle" fontSize={9} fontFamily="monospace" className="fill-slate-400">{c}</text>
          ))}
          {grid.map((row, r) => (
            <g key={r}>
              <text x={HEADER - 6} y={HEADER + r * (CELL + GAP) + CELL / 2 + 4}
                textAnchor="end" fontSize={9} fontFamily="monospace" className="fill-slate-400">{r}</text>
              {row.map((val, c) => {
                const flatIdx = r * cols + c
                // Color by position in flat array
                const hue = (flatIdx / values.length) * 280
                return (
                  <motion.g
                    key={`${r}-${c}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: flatIdx * 0.03, duration: 0.3 }}
                  >
                    <rect
                      x={HEADER + c * (CELL + GAP)}
                      y={HEADER + r * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={3}
                      fill={`hsl(${hue}, 70%, 85%)`}
                      stroke={`hsl(${hue}, 50%, 65%)`}
                      strokeWidth={1}
                    />
                    <text
                      x={HEADER + c * (CELL + GAP) + CELL / 2}
                      y={HEADER + r * (CELL + GAP) + CELL / 2 + 4}
                      textAnchor="middle"
                      fontSize={12}
                      fontFamily="monospace"
                      className="fill-slate-800"
                    >
                      {val}
                    </text>
                  </motion.g>
                )
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Flat memory view */}
      <p className="text-xs text-slate-500 mb-1 font-medium">
        Speicher (flach) — gleiche Reihenfolge:
      </p>
      <div className="overflow-x-auto">
        <svg width={memWidth} height={CELL + 16} viewBox={`0 0 ${memWidth} ${CELL + 16}`}>
          {values.map((val, i) => {
            const hue = (i / values.length) * 280
            return (
              <g key={i}>
                <rect
                  x={HEADER + i * (CELL + GAP)}
                  y={4}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={`hsl(${hue}, 70%, 85%)`}
                  stroke={`hsl(${hue}, 50%, 65%)`}
                  strokeWidth={1}
                />
                <text
                  x={HEADER + i * (CELL + GAP) + CELL / 2}
                  y={4 + CELL / 2 + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily="monospace"
                  className="fill-slate-800"
                >
                  {val}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
