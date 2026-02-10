import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ViewCopyVisualizerProps {
  label?: string
}

const CELL = 44
const GAP = 3

type Mode = 'view' | 'copy'

const originalData = [10, 20, 30, 40, 50, 60]
const sliceRange = [1, 4] // indices 1..3

export default function ViewCopyVisualizer({ label }: ViewCopyVisualizerProps) {
  const [mode, setMode] = useState<Mode>('view')
  const [mutated, setMutated] = useState(false)

  const isSliced = (i: number) => i >= sliceRange[0] && i < sliceRange[1]

  // After mutation: index 2 (third element of slice) changes to 99
  const mutationIndex = 2
  const mutationValue = 99

  const getOriginalValue = (i: number) => {
    if (mutated && mode === 'view' && i === mutationIndex) return mutationValue
    return originalData[i]
  }

  const getSliceValue = (si: number) => {
    const origIdx = sliceRange[0] + si
    if (mutated && origIdx === mutationIndex) return mutationValue
    return originalData[origIdx]
  }

  const sliceLen = sliceRange[1] - sliceRange[0]
  const origWidth = originalData.length * (CELL + GAP)
  const sliceWidth = sliceLen * (CELL + GAP)

  const handleReset = () => setMutated(false)
  const handleMutate = () => setMutated(true)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="view-copy-visualizer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="flex items-center gap-2 mb-4">
        {(['view', 'copy'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setMutated(false) }}
            className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
              mode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid={`mode-${m}`}
          >
            {m === 'view' ? 'View (Slicing)' : 'Copy (Fancy Indexing)'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800"
        >
          {mode === 'view' ? (
            <>
              <strong>View (Slicing):</strong>{' '}
              <code className="text-xs bg-blue-100 px-1 rounded">b = a[1:4]</code> — Gleicher Speicher.
              Änderungen an <code className="text-xs bg-blue-100 px-1 rounded">b</code> wirken sich auf{' '}
              <code className="text-xs bg-blue-100 px-1 rounded">a</code> aus.
            </>
          ) : (
            <>
              <strong>Copy (Fancy Indexing):</strong>{' '}
              <code className="text-xs bg-blue-100 px-1 rounded">b = a[[1, 2, 3]]</code> — Eigener Speicher.
              Änderungen an <code className="text-xs bg-blue-100 px-1 rounded">b</code> lassen{' '}
              <code className="text-xs bg-blue-100 px-1 rounded">a</code> unverändert.
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Original array */}
      <div className="mb-2">
        <p className="text-xs font-medium text-slate-500 mb-1 font-mono">a = np.array([10, 20, 30, 40, 50, 60])</p>
        <svg width={origWidth + 10} height={CELL + 20} viewBox={`0 0 ${origWidth + 10} ${CELL + 20}`}>
          {originalData.map((_, i) => {
            const x = i * (CELL + GAP) + 5
            const val = getOriginalValue(i)
            const highlighted = isSliced(i)
            const changed = mutated && mode === 'view' && i === mutationIndex
            return (
              <g key={i}>
                <motion.rect
                  x={x} y={14} width={CELL} height={CELL} rx={4}
                  stroke={highlighted ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth={highlighted ? 2 : 1}
                  animate={{
                    fill: changed ? '#fca5a5' : highlighted ? '#dbeafe' : '#f1f5f9',
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.text
                  x={x + CELL / 2} y={14 + CELL / 2 + 5}
                  textAnchor="middle" fontSize={13} fontFamily="monospace"
                  className="fill-slate-800"
                  animate={{ scale: changed ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {val}
                </motion.text>
                <text x={x + CELL / 2} y={10} textAnchor="middle" fontSize={9} fontFamily="monospace" className="fill-slate-400">
                  [{i}]
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Memory connection lines */}
      <div className="my-1 flex justify-center">
        <svg width={origWidth + 10} height={30} viewBox={`0 0 ${origWidth + 10} 30`}>
          {Array.from({ length: sliceLen }, (_, si) => {
            const origIdx = sliceRange[0] + si
            const origX = origIdx * (CELL + GAP) + 5 + CELL / 2
            const sliceX = si * (CELL + GAP) + 5 + CELL / 2 + (sliceRange[0] * (CELL + GAP))
            if (mode === 'view') {
              return (
                <motion.line
                  key={si}
                  x1={origX} y1={0} x2={sliceX} y2={30}
                  stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                />
              )
            }
            return null
          })}
          {mode === 'copy' && (
            <motion.text
              x={origWidth / 2} y={18}
              textAnchor="middle" fontSize={10} className="fill-slate-400"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              (separater Speicher)
            </motion.text>
          )}
        </svg>
      </div>

      {/* Slice/copy array */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-500 mb-1 font-mono">
          b = a[1:4]{mode === 'copy' ? '  # .copy() / Fancy Indexing' : '  # View (gleicher Speicher)'}
        </p>
        <svg
          width={sliceWidth + 10 + sliceRange[0] * (CELL + GAP)}
          height={CELL + 10}
          viewBox={`0 0 ${sliceWidth + 10 + sliceRange[0] * (CELL + GAP)} ${CELL + 10}`}
        >
          {Array.from({ length: sliceLen }, (_, si) => {
            const x = si * (CELL + GAP) + 5 + sliceRange[0] * (CELL + GAP)
            const val = getSliceValue(si)
            const origIdx = sliceRange[0] + si
            const changed = mutated && origIdx === mutationIndex
            return (
              <g key={si}>
                <motion.rect
                  x={x} y={4} width={CELL} height={CELL} rx={4}
                  stroke={mode === 'view' ? '#3b82f6' : '#16a34a'}
                  strokeWidth={2}
                  animate={{
                    fill: changed ? '#fca5a5' : mode === 'view' ? '#dbeafe' : '#dcfce7',
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.text
                  x={x + CELL / 2} y={4 + CELL / 2 + 5}
                  textAnchor="middle" fontSize={13} fontFamily="monospace"
                  className="fill-slate-800"
                  animate={{ scale: changed ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {val}
                </motion.text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Mutate button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleMutate}
          disabled={mutated}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="mutate-btn"
        >
          b[1] = 99 ausführen
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
        >
          Zurücksetzen
        </button>
        <AnimatePresence>
          {mutated && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-medium ${mode === 'view' ? 'text-red-700' : 'text-green-700'}`}
              data-testid="mutation-result"
            >
              {mode === 'view'
                ? 'a[2] hat sich auch geändert! (gleicher Speicher)'
                : 'a bleibt unverändert. (eigener Speicher)'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
