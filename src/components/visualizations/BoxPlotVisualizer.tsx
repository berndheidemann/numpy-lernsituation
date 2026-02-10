import { useState, useMemo } from 'react'

interface BoxPlotVisualizerProps {
  data: number[]
  label?: string
  unit?: string
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  if (base + 1 < sorted.length) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base])
  }
  return sorted[base]
}

export default function BoxPlotVisualizer({ data, label, unit = 'kWh' }: BoxPlotVisualizerProps) {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  const stats = useMemo(() => {
    const sorted = [...data].sort((a, b) => a - b)
    const mean = data.reduce((a, b) => a + b, 0) / data.length
    const median = quantile(sorted, 0.5)
    const q1 = quantile(sorted, 0.25)
    const q3 = quantile(sorted, 0.75)
    const iqr = q3 - q1
    const whiskerLow = Math.max(sorted[0], q1 - 1.5 * iqr)
    const whiskerHigh = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr)
    const outliers = sorted.filter((v) => v < whiskerLow || v > whiskerHigh)
    const std = Math.sqrt(data.reduce((s, v) => s + (v - mean) ** 2, 0) / data.length)
    return { sorted, mean, median, q1, q3, iqr, whiskerLow, whiskerHigh, outliers, std, min: sorted[0], max: sorted[sorted.length - 1] }
  }, [data])

  // Histogram bins
  const bins = useMemo(() => {
    const binCount = 10
    const binWidth = (stats.max - stats.min) / binCount
    const counts = Array(binCount).fill(0) as number[]
    for (const v of data) {
      const bin = Math.min(Math.floor((v - stats.min) / binWidth), binCount - 1)
      counts[bin]++
    }
    return { counts, binWidth, maxCount: Math.max(...counts) }
  }, [data, stats])

  const fmt = (v: number) => v.toFixed(1)

  // SVG dimensions
  const W = 500
  const H_BOX = 80
  const H_HIST = 120
  const PAD = 50
  const plotW = W - PAD * 2

  const scale = (v: number) => PAD + ((v - stats.min) / (stats.max - stats.min)) * plotW

  const statItems = [
    { key: 'min', label: 'Minimum', value: stats.min, color: '#64748b' },
    { key: 'q1', label: 'Q1 (25%)', value: stats.q1, color: '#3b82f6' },
    { key: 'median', label: 'Median', value: stats.median, color: '#dc2626' },
    { key: 'mean', label: 'Mittelwert', value: stats.mean, color: '#f59e0b' },
    { key: 'q3', label: 'Q3 (75%)', value: stats.q3, color: '#3b82f6' },
    { key: 'max', label: 'Maximum', value: stats.max, color: '#64748b' },
    { key: 'std', label: 'Std.-Abw.', value: stats.std, color: '#8b5cf6' },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="boxplot-visualizer">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <div className="overflow-x-auto">
        <svg width={W} height={H_HIST + H_BOX + 40} viewBox={`0 0 ${W} ${H_HIST + H_BOX + 40}`}>
          {/* Histogram */}
          <g transform={`translate(0, 10)`}>
            <text x={PAD - 5} y={H_HIST / 2} textAnchor="end" fontSize={9} className="fill-slate-400" transform={`rotate(-90, ${PAD - 12}, ${H_HIST / 2})`}>
              Häufigkeit
            </text>
            {bins.counts.map((count, i) => {
              const x = PAD + (i / bins.counts.length) * plotW
              const barW = plotW / bins.counts.length - 1
              const barH = bins.maxCount > 0 ? (count / bins.maxCount) * (H_HIST - 10) : 0
              const y = H_HIST - barH
              const binStart = stats.min + i * bins.binWidth
              const binEnd = binStart + bins.binWidth
              const isHighlighted =
                (hoveredStat === 'q1' && binEnd >= stats.q1 - 0.5 && binStart <= stats.q1 + 0.5) ||
                (hoveredStat === 'q3' && binEnd >= stats.q3 - 0.5 && binStart <= stats.q3 + 0.5) ||
                (hoveredStat === 'median' && binEnd >= stats.median - 0.5 && binStart <= stats.median + 0.5) ||
                (hoveredStat === 'mean' && binEnd >= stats.mean - 0.5 && binStart <= stats.mean + 0.5)
              return (
                <rect
                  key={i}
                  x={x} y={y} width={barW} height={barH}
                  rx={2}
                  fill={isHighlighted ? '#bfdbfe' : '#e2e8f0'}
                  stroke={isHighlighted ? '#3b82f6' : '#cbd5e1'}
                  strokeWidth={0.5}
                />
              )
            })}

            {/* Mean line on histogram */}
            <line x1={scale(stats.mean)} y1={0} x2={scale(stats.mean)} y2={H_HIST}
              stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" opacity={hoveredStat === 'mean' ? 1 : 0.5} />
            <line x1={scale(stats.median)} y1={0} x2={scale(stats.median)} y2={H_HIST}
              stroke="#dc2626" strokeWidth={2} opacity={hoveredStat === 'median' ? 1 : 0.5} />
          </g>

          {/* Boxplot */}
          <g transform={`translate(0, ${H_HIST + 20})`}>
            {/* Whisker lines */}
            <line x1={scale(stats.whiskerLow)} y1={H_BOX / 2} x2={scale(stats.q1)} y2={H_BOX / 2}
              stroke="#64748b" strokeWidth={1.5} />
            <line x1={scale(stats.q3)} y1={H_BOX / 2} x2={scale(stats.whiskerHigh)} y2={H_BOX / 2}
              stroke="#64748b" strokeWidth={1.5} />

            {/* Whisker caps */}
            <line x1={scale(stats.whiskerLow)} y1={H_BOX / 2 - 10} x2={scale(stats.whiskerLow)} y2={H_BOX / 2 + 10}
              stroke="#64748b" strokeWidth={1.5} />
            <line x1={scale(stats.whiskerHigh)} y1={H_BOX / 2 - 10} x2={scale(stats.whiskerHigh)} y2={H_BOX / 2 + 10}
              stroke="#64748b" strokeWidth={1.5} />

            {/* Box (Q1 to Q3) */}
            <rect
              x={scale(stats.q1)} y={H_BOX / 2 - 20}
              width={scale(stats.q3) - scale(stats.q1)} height={40}
              rx={4} fill="#dbeafe" stroke="#3b82f6" strokeWidth={2}
            />

            {/* Median line */}
            <line x1={scale(stats.median)} y1={H_BOX / 2 - 20} x2={scale(stats.median)} y2={H_BOX / 2 + 20}
              stroke="#dc2626" strokeWidth={2.5} />

            {/* Mean diamond */}
            <polygon
              points={`${scale(stats.mean)},${H_BOX / 2 - 8} ${scale(stats.mean) + 6},${H_BOX / 2} ${scale(stats.mean)},${H_BOX / 2 + 8} ${scale(stats.mean) - 6},${H_BOX / 2}`}
              fill="#f59e0b" stroke="#d97706" strokeWidth={1}
            />

            {/* Outliers */}
            {stats.outliers.map((v, i) => (
              <circle key={i} cx={scale(v)} cy={H_BOX / 2} r={4}
                fill="none" stroke="#ef4444" strokeWidth={1.5} />
            ))}

            {/* Labels */}
            <text x={scale(stats.q1)} y={H_BOX - 2} textAnchor="middle" fontSize={9} className="fill-blue-600">Q1</text>
            <text x={scale(stats.median)} y={H_BOX - 2} textAnchor="middle" fontSize={9} className="fill-red-600">Median</text>
            <text x={scale(stats.q3)} y={H_BOX - 2} textAnchor="middle" fontSize={9} className="fill-blue-600">Q3</text>
          </g>
        </svg>
      </div>

      {/* Stats table */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-3" data-testid="stats-table">
        {statItems.map(({ key, label: statLabel, value, color }) => (
          <div
            key={key}
            className={`text-center p-2 rounded-lg border transition-colors cursor-default ${
              hoveredStat === key ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-slate-50'
            }`}
            onMouseEnter={() => setHoveredStat(key)}
            onMouseLeave={() => setHoveredStat(null)}
          >
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: color }} />
            <p className="text-[10px] text-slate-500">{statLabel}</p>
            <p className="text-sm font-mono font-medium text-slate-800">{fmt(value)}</p>
            <p className="text-[9px] text-slate-400">{unit}</p>
          </div>
        ))}
      </div>

      {stats.outliers.length > 0 && (
        <p className="text-xs text-red-600 mt-2" data-testid="outlier-info">
          {stats.outliers.length} Ausreißer erkannt (außerhalb 1,5 × IQR): [{stats.outliers.map((v) => fmt(v)).join(', ')}]
        </p>
      )}
    </div>
  )
}
