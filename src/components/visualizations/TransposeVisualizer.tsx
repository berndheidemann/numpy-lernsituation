import { useState } from 'react'
import { motion } from 'framer-motion'

interface TransposeVisualizerProps {
  data: number[][]
  label?: string
}

const CELL = 44
const GAP = 3
const HEADER = 28

export default function TransposeVisualizer({ data, label }: TransposeVisualizerProps) {
  const [transposed, setTransposed] = useState(false)

  const rows = data.length
  const cols = data[0].length
  const totalCells = rows * cols

  // Compute target positions for each cell
  const getCellPosition = (r: number, c: number) => {
    if (transposed) {
      // After transpose: row becomes col, col becomes row
      return {
        x: HEADER + r * (CELL + GAP),
        y: HEADER + c * (CELL + GAP),
      }
    }
    return {
      x: HEADER + c * (CELL + GAP),
      y: HEADER + r * (CELL + GAP),
    }
  }

  const displayRows = transposed ? cols : rows
  const displayCols = transposed ? rows : cols

  const svgWidth = HEADER + displayCols * (CELL + GAP)
  const svgHeight = HEADER + displayRows * (CELL + GAP)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="transpose-visualizer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setTransposed(false)}
          className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
            !transposed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Original ({rows}, {cols})
        </button>
        <button
          onClick={() => setTransposed(true)}
          className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
            transposed ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          .T → ({cols}, {rows})
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-3">
        {transposed
          ? 'Transponiert: Zeilen und Spalten vertauscht — Element [r, c] wird zu [c, r].'
          : 'Original: Klicke auf .T um die Transpose-Animation zu sehen.'}
        {' '}
        <span className="font-mono text-xs text-slate-400">
          Shape: ({displayRows}, {displayCols})
        </span>
      </p>

      <div className="overflow-x-auto">
        <motion.svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          animate={{ width: svgWidth, height: svgHeight }}
          transition={{ duration: 0.5 }}
          className="select-none"
        >
          {/* Column headers */}
          {Array.from({ length: displayCols }, (_, c) => (
            <motion.text
              key={`ch-${c}`}
              animate={{ x: HEADER + c * (CELL + GAP) + CELL / 2, y: HEADER - 8 }}
              transition={{ duration: 0.5 }}
              textAnchor="middle" fontSize={10} fontFamily="monospace" className="fill-slate-400"
            >
              {c}
            </motion.text>
          ))}

          {/* Row headers */}
          {Array.from({ length: displayRows }, (_, r) => (
            <motion.text
              key={`rh-${r}`}
              animate={{
                x: HEADER - 8,
                y: HEADER + r * (CELL + GAP) + CELL / 2 + 4,
              }}
              transition={{ duration: 0.5 }}
              textAnchor="end" fontSize={10} fontFamily="monospace" className="fill-slate-400"
            >
              {r}
            </motion.text>
          ))}

          {/* Cells - animated between positions */}
          {data.map((row, r) =>
            row.map((val, c) => {
              const pos = getCellPosition(r, c)
              const flatIdx = r * cols + c
              const hue = (flatIdx / totalCells) * 280

              return (
                <motion.g
                  key={`${r}-${c}`}
                  animate={{ x: pos.x, y: pos.y }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <rect
                    x={0} y={0} width={CELL} height={CELL} rx={4}
                    fill={`hsl(${hue}, 65%, 82%)`}
                    stroke={`hsl(${hue}, 50%, 65%)`}
                    strokeWidth={1.5}
                  />
                  <text
                    x={CELL / 2} y={CELL / 2 + 4}
                    textAnchor="middle" fontSize={12} fontFamily="monospace" className="fill-slate-800"
                  >
                    {val}
                  </text>
                  {/* Index label */}
                  <text
                    x={CELL / 2} y={CELL - 4}
                    textAnchor="middle" fontSize={8} className="fill-slate-400" fontFamily="monospace"
                  >
                    [{transposed ? `${c},${r}` : `${r},${c}`}]
                  </text>
                </motion.g>
              )
            })
          )}

          {/* Diagonal hint line (when transposed) */}
          {transposed && (
            <motion.line
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              x1={HEADER} y1={HEADER}
              x2={HEADER + Math.min(displayRows, displayCols) * (CELL + GAP)}
              y2={HEADER + Math.min(displayRows, displayCols) * (CELL + GAP)}
              stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="6 3"
            />
          )}
        </motion.svg>
      </div>
    </div>
  )
}
