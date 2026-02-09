import { useState } from 'react'

interface ArrayVisualizerProps {
  /** 1D, 2D, or 3D array data */
  data: number[] | number[][] | number[][][]
  /** Optional label above the visualization */
  label?: string
  /** Cell indices to highlight (for indexing demos) */
  highlighted?: Set<string>
  /** Color mode */
  colorMode?: 'heatmap' | 'uniform' | 'highlight'
  /** Compact mode with smaller cells */
  compact?: boolean
}

const CELL_SIZE = 48
const CELL_SIZE_COMPACT = 36
const CELL_GAP = 2
const HEADER_SIZE = 28

function valueToColor(value: number, min: number, max: number): string {
  if (min === max) return '#93c5fd'
  const t = (value - min) / (max - min)
  // Blue (cold) → Yellow (warm) → Red (hot)
  if (t < 0.5) {
    const s = t * 2
    const r = Math.round(59 + s * 194)
    const g = Math.round(130 + s * 101)
    const b = Math.round(246 - s * 196)
    return `rgb(${r},${g},${b})`
  }
  const s = (t - 0.5) * 2
  const r = Math.round(253 - s * 34)
  const g = Math.round(231 - s * 173)
  const b = Math.round(50 - s * 12)
  return `rgb(${r},${g},${b})`
}

function is3D(data: number[] | number[][] | number[][][]): data is number[][][] {
  return Array.isArray(data[0]) && Array.isArray((data[0] as number[][])[0])
}

function ArrayVisualizer2D({
  rows,
  minVal,
  maxVal,
  colorMode,
  compact,
  highlighted,
  hoveredCell,
  setHoveredCell,
  layerPrefix = '',
}: {
  rows: number[][]
  minVal: number
  maxVal: number
  colorMode: 'heatmap' | 'uniform' | 'highlight'
  compact: boolean
  highlighted?: Set<string>
  hoveredCell: string | null
  setHoveredCell: (v: string | null) => void
  layerPrefix?: string
}) {
  const numRows = rows.length
  const numCols = rows[0]?.length ?? 0
  const cs = compact ? CELL_SIZE_COMPACT : CELL_SIZE
  const fontSize = compact ? 11 : 13
  const svgWidth = HEADER_SIZE + numCols * (cs + CELL_GAP)
  const svgHeight = HEADER_SIZE + numRows * (cs + CELL_GAP)

  return (
    <div className="overflow-x-auto">
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="select-none"
        role="img"
        aria-label={`Array mit ${numRows} Zeilen und ${numCols} Spalten`}
      >
        {Array.from({ length: numCols }, (_, c) => (
          <text
            key={`ch-${c}`}
            x={HEADER_SIZE + c * (cs + CELL_GAP) + cs / 2}
            y={HEADER_SIZE - 8}
            textAnchor="middle"
            className="fill-slate-400"
            fontSize={10}
            fontFamily="monospace"
          >
            {c}
          </text>
        ))}
        {rows.map((row, r) => (
          <g key={`row-${r}`}>
            <text
              x={HEADER_SIZE - 8}
              y={HEADER_SIZE + r * (cs + CELL_GAP) + cs / 2 + 4}
              textAnchor="end"
              className="fill-slate-400"
              fontSize={10}
              fontFamily="monospace"
            >
              {r}
            </text>
            {row.map((value, c) => {
              const cellKey = `${layerPrefix}${r},${c}`
              const x = HEADER_SIZE + c * (cs + CELL_GAP)
              const y = HEADER_SIZE + r * (cs + CELL_GAP)
              const isHovered = hoveredCell === cellKey
              const isHighlighted = highlighted?.has(cellKey)

              let fill = '#e2e8f0'
              if (colorMode === 'heatmap') {
                fill = valueToColor(value, minVal, maxVal)
              } else if (colorMode === 'uniform') {
                fill = '#bfdbfe'
              }
              if (isHighlighted) fill = '#86efac'

              const stroke = isHovered ? '#1e40af' : isHighlighted ? '#16a34a' : '#cbd5e1'
              const strokeWidth = isHovered || isHighlighted ? 2 : 1

              return (
                <g
                  key={cellKey}
                  onMouseEnter={() => setHoveredCell(cellKey)}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{ cursor: 'default' }}
                >
                  <rect x={x} y={y} width={cs} height={cs} rx={4} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                  <text x={x + cs / 2} y={y + cs / 2 + 4} textAnchor="middle" fontSize={fontSize} fontFamily="monospace" className="fill-slate-800">
                    {Number.isInteger(value) ? value : value.toFixed(1)}
                  </text>
                </g>
              )
            })}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function ArrayVisualizer({
  data,
  label,
  highlighted,
  colorMode = 'heatmap',
  compact = false,
}: ArrayVisualizerProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  // 3D rendering: show stacked layers
  if (is3D(data)) {
    const layers = data as number[][][]
    const allValues = layers.flat(2)
    const minVal = Math.min(...allValues)
    const maxVal = Math.max(...allValues)

    return (
      <div className="my-4" data-testid="array-visualizer">
        {label && (
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
        )}
        <div className="flex flex-col gap-4">
          {layers.map((layer, k) => (
            <div key={k}>
              <p className="text-xs font-medium text-slate-500 mb-1">Schicht {k}</p>
              <ArrayVisualizer2D
                rows={layer}
                minVal={minVal}
                maxVal={maxVal}
                colorMode={colorMode}
                compact={compact}
                highlighted={highlighted}
                hoveredCell={hoveredCell}
                setHoveredCell={setHoveredCell}
                layerPrefix={`${k},`}
              />
            </div>
          ))}
        </div>
        {hoveredCell && (
          <p className="text-xs text-slate-500 mt-1 font-mono">
            [{hoveredCell}] = {(() => {
              const parts = hoveredCell.split(',').map(Number)
              if (parts.length === 3) return layers[parts[0]]?.[parts[1]]?.[parts[2]]
              return undefined
            })()}
          </p>
        )}
      </div>
    )
  }

  const is2DArr = Array.isArray(data[0])
  const rows: number[][] = is2DArr ? (data as number[][]) : [data as number[]]
  const numRows = rows.length
  const numCols = rows[0]?.length ?? 0

  const cs = compact ? CELL_SIZE_COMPACT : CELL_SIZE
  const fontSize = compact ? 11 : 13

  // Compute min/max for heatmap
  const allValues = rows.flat()
  const minVal = Math.min(...allValues)
  const maxVal = Math.max(...allValues)

  const svgWidth = HEADER_SIZE + numCols * (cs + CELL_GAP)
  const svgHeight = HEADER_SIZE + numRows * (cs + CELL_GAP)

  return (
    <div className="my-4" data-testid="array-visualizer">
      {label && (
        <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
      )}
      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="select-none"
          role="img"
          aria-label={`Array mit ${numRows} Zeilen und ${numCols} Spalten`}
        >
          {/* Column headers */}
          {Array.from({ length: numCols }, (_, c) => (
            <text
              key={`ch-${c}`}
              x={HEADER_SIZE + c * (cs + CELL_GAP) + cs / 2}
              y={HEADER_SIZE - 8}
              textAnchor="middle"
              className="fill-slate-400"
              fontSize={10}
              fontFamily="monospace"
            >
              {c}
            </text>
          ))}

          {rows.map((row, r) => (
            <g key={`row-${r}`}>
              {/* Row header */}
              <text
                x={HEADER_SIZE - 8}
                y={HEADER_SIZE + r * (cs + CELL_GAP) + cs / 2 + 4}
                textAnchor="end"
                className="fill-slate-400"
                fontSize={10}
                fontFamily="monospace"
              >
                {r}
              </text>

              {row.map((value, c) => {
                const cellKey = `${r},${c}`
                const x = HEADER_SIZE + c * (cs + CELL_GAP)
                const y = HEADER_SIZE + r * (cs + CELL_GAP)
                const isHovered = hoveredCell === cellKey
                const isHighlighted = highlighted?.has(cellKey)

                let fill = '#e2e8f0'
                if (colorMode === 'heatmap') {
                  fill = valueToColor(value, minVal, maxVal)
                } else if (colorMode === 'uniform') {
                  fill = '#bfdbfe'
                }

                if (isHighlighted) {
                  fill = '#86efac'
                }

                const stroke = isHovered ? '#1e40af' : isHighlighted ? '#16a34a' : '#cbd5e1'
                const strokeWidth = isHovered || isHighlighted ? 2 : 1

                return (
                  <g
                    key={cellKey}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{ cursor: 'default' }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={cs}
                      height={cs}
                      rx={4}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={x + cs / 2}
                      y={y + cs / 2 + 4}
                      textAnchor="middle"
                      fontSize={fontSize}
                      fontFamily="monospace"
                      className="fill-slate-800"
                    >
                      {Number.isInteger(value) ? value : value.toFixed(1)}
                    </text>
                  </g>
                )
              })}
            </g>
          ))}
        </svg>
      </div>

      {hoveredCell && (
        <p className="text-xs text-slate-500 mt-1 font-mono">
          [{hoveredCell}] = {(() => {
            const [r, c] = hoveredCell.split(',').map(Number)
            return rows[r]?.[c]
          })()}
        </p>
      )}
    </div>
  )
}
