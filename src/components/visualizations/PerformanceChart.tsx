import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

interface PerformanceChartProps {
  label?: string
  /** Pre-computed benchmark data: array size -> { listMs, numpyMs } */
  benchmarks: { size: number; listMs: number; numpyMs: number }[]
}

const BAR_HEIGHT = 36
const CHART_WIDTH = 400
const LABEL_WIDTH = 100
const VALUE_WIDTH = 80

export default function PerformanceChart({ label, benchmarks }: PerformanceChartProps) {
  const sizes = benchmarks.map((b) => b.size)
  const [selectedIdx, setSelectedIdx] = useState(Math.floor(sizes.length / 2))
  const benchmark = benchmarks[selectedIdx]

  const maxMs = useMemo(
    () => Math.max(...benchmarks.map((b) => Math.max(b.listMs, b.numpyMs))),
    [benchmarks],
  )

  const speedup = benchmark.listMs / benchmark.numpyMs

  const barScale = (ms: number) => (ms / maxMs) * CHART_WIDTH

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="performance-chart">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      {/* Size slider */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-slate-600" htmlFor="size-slider">Array-Größe:</label>
        <input
          id="size-slider"
          type="range"
          min={0}
          max={sizes.length - 1}
          value={selectedIdx}
          onChange={(e) => setSelectedIdx(parseInt(e.target.value, 10))}
          className="flex-1 max-w-xs accent-blue-600"
          data-testid="size-slider"
        />
        <span className="text-sm font-mono font-medium text-slate-800 min-w-[80px]">
          {benchmark.size.toLocaleString('de-DE')}
        </span>
      </div>

      {/* Bar chart */}
      <div className="overflow-x-auto">
        <svg
          width={LABEL_WIDTH + CHART_WIDTH + VALUE_WIDTH + 20}
          height={BAR_HEIGHT * 2 + 24}
          viewBox={`0 0 ${LABEL_WIDTH + CHART_WIDTH + VALUE_WIDTH + 20} ${BAR_HEIGHT * 2 + 24}`}
        >
          {/* Python list bar */}
          <text x={LABEL_WIDTH - 8} y={BAR_HEIGHT / 2 + 5} textAnchor="end"
            fontSize={12} className="fill-slate-700">Python-Liste</text>
          <motion.rect
            x={LABEL_WIDTH}
            y={4}
            height={BAR_HEIGHT - 8}
            rx={4}
            fill="#f87171"
            initial={{ width: 0 }}
            animate={{ width: barScale(benchmark.listMs) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.text
            x={LABEL_WIDTH + barScale(benchmark.listMs) + 8}
            y={BAR_HEIGHT / 2 + 5}
            fontSize={12}
            fontFamily="monospace"
            className="fill-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {benchmark.listMs.toFixed(1)} ms
          </motion.text>

          {/* NumPy bar */}
          <text x={LABEL_WIDTH - 8} y={BAR_HEIGHT + BAR_HEIGHT / 2 + 5} textAnchor="end"
            fontSize={12} className="fill-slate-700">NumPy</text>
          <motion.rect
            x={LABEL_WIDTH}
            y={BAR_HEIGHT + 4}
            height={BAR_HEIGHT - 8}
            rx={4}
            fill="#34d399"
            initial={{ width: 0 }}
            animate={{ width: Math.max(barScale(benchmark.numpyMs), 4) }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.text
            x={LABEL_WIDTH + Math.max(barScale(benchmark.numpyMs), 4) + 8}
            y={BAR_HEIGHT + BAR_HEIGHT / 2 + 5}
            fontSize={12}
            fontFamily="monospace"
            className="fill-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {benchmark.numpyMs.toFixed(1)} ms
          </motion.text>
        </svg>
      </div>

      {/* Speedup badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-slate-600">Speedup:</span>
        <motion.span
          key={selectedIdx}
          className="inline-block px-3 py-1 text-lg font-bold text-green-700 bg-green-100 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          data-testid="speedup-badge"
        >
          {speedup.toFixed(0)}x schneller
        </motion.span>
      </div>
    </div>
  )
}
