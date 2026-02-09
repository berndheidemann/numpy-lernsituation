import { useState, useMemo } from 'react'

interface MemoryLayoutViewerProps {
  /** 2D array data */
  data: number[][]
  label?: string
}

const CELL = 40
const GAP = 3
const HEADER = 28

export default function MemoryLayoutViewer({ data, label }: MemoryLayoutViewerProps) {
  const [order, setOrder] = useState<'C' | 'F'>('C')

  const rows = data.length
  const cols = data[0]?.length ?? 0

  const flatOrder = useMemo(() => {
    const result: { value: number; row: number; col: number }[] = []
    if (order === 'C') {
      // Row-major: row by row
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          result.push({ value: data[r][c], row: r, col: c })
        }
      }
    } else {
      // Column-major: column by column
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          result.push({ value: data[r][c], row: r, col: c })
        }
      }
    }
    return result
  }, [data, order, rows, cols])

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const hoveredCell = hoveredIdx !== null ? flatOrder[hoveredIdx] : null

  const gridWidth = HEADER + cols * (CELL + GAP)
  const gridHeight = HEADER + rows * (CELL + GAP)
  const flatWidth = HEADER + flatOrder.length * (CELL + GAP)

  // Map: (row,col) -> flat index in current order
  const cellToFlat = useMemo(() => {
    const map = new Map<string, number>()
    flatOrder.forEach((item, i) => map.set(`${item.row},${item.col}`, i))
    return map
  }, [flatOrder])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="memory-layout-viewer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-600">Speicherordnung:</span>
        <button
          onClick={() => setOrder('C')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            order === 'C' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          data-testid="order-c"
        >
          C-Order (Row-Major)
        </button>
        <button
          onClick={() => setOrder('F')}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            order === 'F' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          data-testid="order-f"
        >
          F-Order (Column-Major)
        </button>
      </div>

      {/* Logical grid */}
      <p className="text-xs text-slate-500 mb-1 font-medium">Logisches Array ({rows}x{cols}):</p>
      <div className="overflow-x-auto mb-4">
        <svg width={gridWidth} height={gridHeight} viewBox={`0 0 ${gridWidth} ${gridHeight}`}>
          {Array.from({ length: cols }, (_, c) => (
            <text key={`ch-${c}`} x={HEADER + c * (CELL + GAP) + CELL / 2} y={HEADER - 8}
              textAnchor="middle" fontSize={9} fontFamily="monospace" className="fill-slate-400">{c}</text>
          ))}
          {data.map((row, r) => (
            <g key={r}>
              <text x={HEADER - 6} y={HEADER + r * (CELL + GAP) + CELL / 2 + 4}
                textAnchor="end" fontSize={9} fontFamily="monospace" className="fill-slate-400">{r}</text>
              {row.map((val, c) => {
                const flatIdx = cellToFlat.get(`${r},${c}`) ?? 0
                const hue = (flatIdx / flatOrder.length) * 280
                const isHovered = hoveredCell?.row === r && hoveredCell?.col === c

                return (
                  <g
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHoveredIdx(flatIdx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ cursor: 'default' }}
                  >
                    <rect
                      x={HEADER + c * (CELL + GAP)}
                      y={HEADER + r * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={3}
                      fill={`hsl(${hue}, 70%, ${isHovered ? '75%' : '85%'})`}
                      stroke={isHovered ? '#1e40af' : `hsl(${hue}, 50%, 65%)`}
                      strokeWidth={isHovered ? 2 : 1}
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
                  </g>
                )
              })}
            </g>
          ))}
        </svg>
      </div>

      {/* Flat memory strip */}
      <p className="text-xs text-slate-500 mb-1 font-medium">
        Speicher ({order === 'C' ? 'Row-Major: Zeile für Zeile' : 'Column-Major: Spalte für Spalte'}):
      </p>
      <div className="overflow-x-auto">
        <svg width={flatWidth} height={CELL + 20} viewBox={`0 0 ${flatWidth} ${CELL + 20}`}>
          {flatOrder.map((item, i) => {
            const hue = (i / flatOrder.length) * 280
            const isHovered = hoveredIdx === i

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'default' }}
              >
                <rect
                  x={HEADER + i * (CELL + GAP)}
                  y={4}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={`hsl(${hue}, 70%, ${isHovered ? '75%' : '85%'})`}
                  stroke={isHovered ? '#1e40af' : `hsl(${hue}, 50%, 65%)`}
                  strokeWidth={isHovered ? 2 : 1}
                />
                <text
                  x={HEADER + i * (CELL + GAP) + CELL / 2}
                  y={4 + CELL / 2 + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontFamily="monospace"
                  className="fill-slate-800"
                >
                  {item.value}
                </text>
                <text
                  x={HEADER + i * (CELL + GAP) + CELL / 2}
                  y={CELL + 16}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="monospace"
                  className="fill-slate-400"
                >
                  [{item.row},{item.col}]
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
