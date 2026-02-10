import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Preset {
  label: string
  a: number[][]
  b: number[][]
  description: string
}

const PRESETS: Preset[] = [
  {
    label: '(3,) + Skalar',
    a: [[1, 2, 3]],
    b: [[10]],
    description: '1D-Array + Skalar — einfachster Broadcasting-Fall',
  },
  {
    label: '(3,1) × (1,4)',
    a: [[2], [3], [4]],
    b: [[10, 20, 30, 40]],
    description: 'Spaltenvektor × Zeilenvektor = Matrix (äußeres Produkt)',
  },
  {
    label: '(4,3) + (3,)',
    a: [
      [10, 20, 30],
      [40, 50, 60],
      [70, 80, 90],
      [100, 110, 120],
    ],
    b: [[1, 2, 3]],
    description: 'Zeilenvektor wird auf jede Zeile addiert — häufigster Fall',
  },
]

type Op = '+' | '×'

function applyOp(a: number, b: number, op: Op): number {
  return op === '+' ? a + b : a * b
}

/** Broadcast two 2D arrays and return [broadcastedA, broadcastedB, result, resultRows, resultCols] */
function broadcast(
  a: number[][],
  b: number[][],
  op: Op,
): { broadA: number[][]; broadB: number[][]; result: number[][]; rows: number; cols: number } {
  const aRows = a.length
  const aCols = a[0].length
  const bRows = b.length
  const bCols = b[0].length

  const rows = Math.max(aRows, bRows)
  const cols = Math.max(aCols, bCols)

  const broadA: number[][] = []
  const broadB: number[][] = []
  const result: number[][] = []

  for (let r = 0; r < rows; r++) {
    const rowA: number[] = []
    const rowB: number[] = []
    const rowR: number[] = []
    for (let c = 0; c < cols; c++) {
      const va = a[r % aRows][c % aCols]
      const vb = b[r % bRows][c % bCols]
      rowA.push(va)
      rowB.push(vb)
      rowR.push(applyOp(va, vb, op))
    }
    broadA.push(rowA)
    broadB.push(rowB)
    result.push(rowR)
  }

  return { broadA, broadB, result, rows, cols }
}

function isGhostCell(
  r: number,
  c: number,
  originalRows: number,
  originalCols: number,
): boolean {
  return r >= originalRows || c >= originalCols
}

const CELL_SIZE = 48
const CELL_GAP = 2

function CellGrid({
  data,
  originalRows,
  originalCols,
  highlightR,
  highlightC,
  onHover,
  isResult,
  label,
}: {
  data: number[][]
  originalRows: number
  originalCols: number
  highlightR: number | null
  highlightC: number | null
  onHover?: (r: number, c: number) => void
  isResult?: boolean
  label: string
}) {
  const rows = data.length
  const cols = data[0]?.length ?? 0
  const width = cols * (CELL_SIZE + CELL_GAP) + CELL_GAP
  const height = rows * (CELL_SIZE + CELL_GAP) + CELL_GAP

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="select-none"
        role="img"
        aria-label={`${label} — ${rows} Zeilen, ${cols} Spalten`}
      >
        {data.map((row, r) =>
          row.map((val, c) => {
            const ghost = isGhostCell(r, c, originalRows, originalCols)
            const highlighted = highlightR === r && highlightC === c
            const x = CELL_GAP + c * (CELL_SIZE + CELL_GAP)
            const y = CELL_GAP + r * (CELL_SIZE + CELL_GAP)

            let fill = '#e2e8f0'
            if (highlighted) fill = '#fbbf24'
            else if (isResult) fill = ghost ? '#dbeafe' : '#bfdbfe'
            else fill = ghost ? '#e2e8f0' : '#bfdbfe'

            return (
              <g
                key={`${r}-${c}`}
                onMouseEnter={() => onHover?.(r, c)}
                onMouseLeave={() => onHover?.(-1, -1)}
                style={{ cursor: isResult ? 'pointer' : 'default' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={4}
                  fill={fill}
                  opacity={ghost && !highlighted ? 0.5 : 1}
                  stroke={highlighted ? '#f59e0b' : ghost ? '#94a3b8' : '#64748b'}
                  strokeWidth={highlighted ? 2 : 1}
                  strokeDasharray={ghost ? '4 2' : undefined}
                />
                <text
                  x={x + CELL_SIZE / 2}
                  y={y + CELL_SIZE / 2 + 4}
                  textAnchor="middle"
                  fontSize={val >= 1000 ? 10 : 12}
                  fontFamily="monospace"
                  className="fill-slate-800"
                  opacity={ghost && !highlighted ? 0.6 : 1}
                >
                  {val}
                </text>
              </g>
            )
          }),
        )}
      </svg>
    </div>
  )
}

export default function BroadcastingValueVisualizer() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [op, setOp] = useState<Op>('+')
  const [hoverR, setHoverR] = useState<number | null>(null)
  const [hoverC, setHoverC] = useState<number | null>(null)

  const preset = PRESETS[presetIdx]

  const { broadA, broadB, result, rows, cols } = useMemo(
    () => broadcast(preset.a, preset.b, op),
    [preset, op],
  )

  const aRows = preset.a.length
  const aCols = preset.a[0].length
  const bRows = preset.b.length
  const bCols = preset.b[0].length

  const handleHover = (r: number, c: number) => {
    if (r < 0) {
      setHoverR(null)
      setHoverC(null)
    } else {
      setHoverR(r)
      setHoverC(c)
    }
  }

  const infoLine = useMemo(() => {
    if (hoverR === null || hoverC === null) return null
    const va = broadA[hoverR]?.[hoverC]
    const vb = broadB[hoverR]?.[hoverC]
    const vr = result[hoverR]?.[hoverC]
    if (va === undefined || vb === undefined || vr === undefined) return null
    const opSymbol = op === '+' ? '+' : '×'
    return `a[${hoverR},${hoverC}] ${opSymbol} b[${hoverR},${hoverC}] = ${va} ${opSymbol} ${vb} = ${vr}`
  }, [hoverR, hoverC, broadA, broadB, result, op])

  const shapeA =
    aRows === 1 && aCols === 1
      ? 'Skalar'
      : aRows === 1
        ? `(${aCols},)`
        : `(${aRows},${aCols})`
  const shapeB =
    bRows === 1 && bCols === 1
      ? 'Skalar'
      : bRows === 1
        ? `(${bCols},)`
        : `(${bRows},${bCols})`

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid="broadcasting-value-visualizer"
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-3">Broadcasting mit Werten</h3>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setPresetIdx(i)}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              i === presetIdx
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid={`preset-${i}`}
          >
            {p.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setOp('+')}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              op === '+'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid="op-add"
            aria-label="Addition"
          >
            +
          </button>
          <button
            onClick={() => setOp('×')}
            className={`px-3 py-1.5 rounded-md text-sm font-mono transition-colors ${
              op === '×'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid="op-mul"
            aria-label="Multiplikation"
          >
            ×
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${presetIdx}-${op}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-slate-600 mb-4">{preset.description}</p>

          {/* Grid layout */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CellGrid
              data={broadA}
              originalRows={aRows}
              originalCols={aCols}
              highlightR={hoverR}
              highlightC={hoverC}
              label={`Array A ${shapeA}`}
            />

            <span className="text-2xl font-bold text-slate-400">{op}</span>

            <CellGrid
              data={broadB}
              originalRows={bRows}
              originalCols={bCols}
              highlightR={hoverR}
              highlightC={hoverC}
              label={`Array B ${shapeB}`}
            />

            <span className="text-2xl font-bold text-slate-400">=</span>

            <CellGrid
              data={result}
              originalRows={rows}
              originalCols={cols}
              highlightR={hoverR}
              highlightC={hoverC}
              onHover={handleHover}
              isResult
              label={`Ergebnis (${rows},${cols})`}
            />
          </div>

          {/* Ghost cell legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg width={16} height={16}>
                <rect
                  x={1}
                  y={1}
                  width={14}
                  height={14}
                  rx={2}
                  fill="#bfdbfe"
                  stroke="#64748b"
                  strokeWidth={1}
                />
              </svg>
              Original-Zelle
            </span>
            <span className="flex items-center gap-1">
              <svg width={16} height={16}>
                <rect
                  x={1}
                  y={1}
                  width={14}
                  height={14}
                  rx={2}
                  fill="#e2e8f0"
                  opacity={0.5}
                  stroke="#94a3b8"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
              </svg>
              Ghost-Zelle (gestreckt)
            </span>
            <span className="flex items-center gap-1">
              <svg width={16} height={16}>
                <rect
                  x={1}
                  y={1}
                  width={14}
                  height={14}
                  rx={2}
                  fill="#fbbf24"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </svg>
              Hover-Hervorhebung
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Info line */}
      <div className="mt-3 h-8 flex items-center">
        {infoLine ? (
          <p className="text-sm font-mono text-blue-700 bg-blue-50 px-3 py-1 rounded" data-testid="info-line">
            {infoLine}
          </p>
        ) : (
          <p className="text-sm text-slate-400 italic">
            Bewege die Maus über eine Ergebnis-Zelle, um die Berechnung zu sehen.
          </p>
        )}
      </div>
    </div>
  )
}
