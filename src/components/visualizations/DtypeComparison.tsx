import { useState } from 'react'
import { motion } from 'framer-motion'

interface DtypeComparisionProps {
  label?: string
}

interface DtypeInfo {
  name: string
  bytes: number
  color: string
  description: string
}

const DTYPES: DtypeInfo[] = [
  { name: 'int8', bytes: 1, color: '#22c55e', description: '-128 bis 127' },
  { name: 'int32', bytes: 4, color: '#3b82f6', description: '-2.1 Mrd. bis 2.1 Mrd.' },
  { name: 'int64', bytes: 8, color: '#6366f1', description: 'Sehr großer Wertebereich' },
  { name: 'float32', bytes: 4, color: '#f59e0b', description: '~7 Dezimalstellen Genauigkeit' },
  { name: 'float64', bytes: 8, color: '#ef4444', description: '~15 Dezimalstellen (Standard)' },
]

const ELEMENT_COUNT_OPTIONS = [10, 1_000, 1_000_000, 8_760_000]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000} Mio.`
  if (n >= 1_000) return `${n / 1_000}k`
  return String(n)
}

export default function DtypeComparison({ label }: DtypeComparisionProps) {
  const [elementCount, setElementCount] = useState(1_000_000)

  const maxBytes = Math.max(...DTYPES.map((d) => d.bytes)) * elementCount

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="dtype-comparison">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <p className="text-sm text-slate-500 mb-3">
        Wähle die Anzahl der Elemente, um den Speicherbedarf pro Datentyp zu vergleichen:
      </p>

      {/* Element count selector */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {ELEMENT_COUNT_OPTIONS.map((count) => (
          <button
            key={count}
            onClick={() => setElementCount(count)}
            className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
              elementCount === count
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {formatCount(count)} Elemente
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {DTYPES.map((dtype) => {
          const totalBytes = dtype.bytes * elementCount
          const widthPct = (totalBytes / maxBytes) * 100

          return (
            <div key={dtype.name} data-testid={`dtype-${dtype.name}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-medium text-slate-800">{dtype.name}</span>
                  <span className="text-xs text-slate-400">({dtype.bytes} Byte/Element)</span>
                </div>
                <span className="text-sm font-mono font-bold text-slate-700">
                  {formatBytes(totalBytes)}
                </span>
              </div>
              <div className="h-7 bg-slate-100 rounded-md overflow-hidden">
                <motion.div
                  className="h-full rounded-md flex items-center px-2"
                  style={{ backgroundColor: dtype.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  {widthPct > 20 && (
                    <span className="text-[10px] text-white font-medium truncate">
                      {dtype.description}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>

      {/* SmartEnergy context */}
      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800" data-testid="dtype-hint">
        <strong>SmartEnergy-Kontext:</strong> 1.000 Haushalte × 8.760 Stunden = 8,76 Mio. Werte.
        Mit <code className="bg-amber-100 px-1 rounded">float64</code> (Standard) belegt das Array{' '}
        <strong>{formatBytes(8_760_000 * 8)}</strong>, mit{' '}
        <code className="bg-amber-100 px-1 rounded">float32</code> nur{' '}
        <strong>{formatBytes(8_760_000 * 4)}</strong> — die Hälfte.
      </div>
    </div>
  )
}
