import { useState, useMemo } from 'react'
import ArrayVisualizer from './ArrayVisualizer'

interface IndexingHighlighterProps {
  /** 2D array data */
  data: number[][]
  label?: string
}

function parseSlice(expr: string, length: number): number[] {
  const trimmed = expr.trim()
  if (trimmed === '' || trimmed === ':') {
    return Array.from({ length }, (_, i) => i)
  }
  // Single index like "2" or "-1"
  if (/^-?\d+$/.test(trimmed)) {
    let idx = parseInt(trimmed, 10)
    if (idx < 0) idx = length + idx
    if (idx >= 0 && idx < length) return [idx]
    return []
  }
  // Slice like "1:3" or "::2" or "1:5:2"
  const parts = trimmed.split(':')
  let start = 0
  let stop = length
  let step = 1
  if (parts[0]?.trim()) start = parseInt(parts[0], 10)
  if (parts[1]?.trim()) stop = parseInt(parts[1], 10)
  if (parts.length > 2 && parts[2]?.trim()) step = parseInt(parts[2], 10)
  if (start < 0) start = Math.max(0, length + start)
  if (stop < 0) stop = Math.max(0, length + stop)
  start = Math.max(0, Math.min(start, length))
  stop = Math.max(0, Math.min(stop, length))

  const indices: number[] = []
  if (step > 0) {
    for (let i = start; i < stop; i += step) indices.push(i)
  } else if (step < 0) {
    if (!parts[0]?.trim()) start = length - 1
    if (!parts[1]?.trim()) stop = -1
    for (let i = start; i > stop; i += step) indices.push(i)
  }
  return indices
}

function parseExpression(expr: string, numRows: number, numCols: number): Set<string> {
  const highlighted = new Set<string>()

  // Remove array name prefix like "arr[" or "data["
  let inner = expr.trim()
  const bracketMatch = inner.match(/\[(.+)\]/)
  if (bracketMatch) {
    inner = bracketMatch[1]
  }

  // Split by comma, respecting that slices also use colons
  const parts = inner.split(',').map((s) => s.trim())

  let rowIndices: number[]
  let colIndices: number[]

  if (parts.length === 1) {
    // 1D indexing: select rows
    rowIndices = parseSlice(parts[0], numRows)
    colIndices = Array.from({ length: numCols }, (_, i) => i)
  } else {
    rowIndices = parseSlice(parts[0], numRows)
    colIndices = parseSlice(parts[1], numCols)
  }

  for (const r of rowIndices) {
    for (const c of colIndices) {
      highlighted.add(`${r},${c}`)
    }
  }

  return highlighted
}

export default function IndexingHighlighter({ data, label }: IndexingHighlighterProps) {
  const [expression, setExpression] = useState('')
  const numRows = data.length
  const numCols = data[0]?.length ?? 0

  const highlighted = useMemo(() => {
    if (!expression.trim()) return new Set<string>()
    try {
      return parseExpression(expression, numRows, numCols)
    } catch {
      return new Set<string>()
    }
  }, [expression, numRows, numCols])

  const selectedValues = useMemo(() => {
    const vals: number[] = []
    for (const key of highlighted) {
      const [r, c] = key.split(',').map(Number)
      if (data[r]?.[c] !== undefined) vals.push(data[r][c])
    }
    return vals
  }, [highlighted, data])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="indexing-highlighter">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-slate-700 font-medium">Slicing-Expression:</label>
        <div className="flex items-center font-mono text-sm">
          <span className="text-slate-400">arr[</span>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="z.B. 1:3, 0:2"
            className="w-40 px-2 py-1 border border-slate-300 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Slicing-Ausdruck"
            data-testid="slicing-input"
          />
          <span className="text-slate-400">]</span>
        </div>
        <span className="text-xs text-slate-400">
          {highlighted.size} Elemente ausgewählt
        </span>
      </div>

      <ArrayVisualizer
        data={data}
        highlighted={highlighted}
        colorMode="highlight"
      />

      {selectedValues.length > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs font-medium text-green-700 mb-1">Ergebnis:</p>
          <p className="text-sm font-mono text-green-800">
            [{selectedValues.join(', ')}]
          </p>
        </div>
      )}
    </div>
  )
}
