import { useState, useMemo } from 'react'

interface ScatterPlotProps {
  xData: number[]
  yData: number[]
  xLabel: string
  yLabel: string
  label?: string
  showTrendLine?: boolean
  showOutlierBounds?: boolean
  outliersStdFactor?: number
}

const PADDING = { top: 20, right: 20, bottom: 40, left: 50 }
const WIDTH = 460
const HEIGHT = 300
const PLOT_W = WIDTH - PADDING.left - PADDING.right
const PLOT_H = HEIGHT - PADDING.top - PADDING.bottom

function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r: number } {
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((a, xi, i) => a + xi * y[i], 0)
  const sumX2 = x.reduce((a, xi) => a + xi * xi, 0)
  const sumY2 = y.reduce((a, yi) => a + yi * yi, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const denom = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  const r = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom

  return { slope, intercept, r }
}

export default function ScatterPlot({
  xData,
  yData,
  xLabel,
  yLabel,
  label,
  showTrendLine = true,
  showOutlierBounds = false,
  outliersStdFactor = 2,
}: ScatterPlotProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const stats = useMemo(() => {
    const xMin = Math.min(...xData)
    const xMax = Math.max(...xData)
    const yMin = Math.min(...yData)
    const yMax = Math.max(...yData)
    const xRange = xMax - xMin || 1
    const yRange = yMax - yMin || 1
    const xPad = xRange * 0.08
    const yPad = yRange * 0.08

    const reg = linearRegression(xData, yData)
    const yMean = yData.reduce((a, b) => a + b, 0) / yData.length
    const yStd = Math.sqrt(yData.reduce((a, yi) => a + (yi - yMean) ** 2, 0) / yData.length)

    return {
      xMin: xMin - xPad, xMax: xMax + xPad,
      yMin: yMin - yPad, yMax: yMax + yPad,
      reg, yMean, yStd,
    }
  }, [xData, yData])

  const scaleX = (v: number) => PADDING.left + ((v - stats.xMin) / (stats.xMax - stats.xMin)) * PLOT_W
  const scaleY = (v: number) => PADDING.top + (1 - (v - stats.yMin) / (stats.yMax - stats.yMin)) * PLOT_H

  // Grid lines
  const xTicks = 5
  const yTicks = 5
  const xTickValues = Array.from({ length: xTicks }, (_, i) => stats.xMin + (i / (xTicks - 1)) * (stats.xMax - stats.xMin))
  const yTickValues = Array.from({ length: yTicks }, (_, i) => stats.yMin + (i / (yTicks - 1)) * (stats.yMax - stats.yMin))

  // Outlier bounds
  const upperBound = stats.yMean + outliersStdFactor * stats.yStd
  const lowerBound = stats.yMean - outliersStdFactor * stats.yStd

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="scatter-plot">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      {showTrendLine && (
        <div className="flex items-center gap-4 mb-3 text-sm">
          <span className="text-slate-600">Korrelation:</span>
          <span className={`font-mono font-bold ${stats.reg.r < -0.5 ? 'text-red-600' : stats.reg.r > 0.5 ? 'text-green-600' : 'text-amber-600'}`}>
            r = {stats.reg.r.toFixed(3)}
          </span>
          <span className="text-slate-400">
            {Math.abs(stats.reg.r) > 0.7 ? '(stark)' : Math.abs(stats.reg.r) > 0.3 ? '(moderat)' : '(schwach)'}
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="select-none">
          {/* Grid */}
          {yTickValues.map((v, i) => (
            <g key={`yg-${i}`}>
              <line x1={PADDING.left} y1={scaleY(v)} x2={WIDTH - PADDING.right} y2={scaleY(v)}
                stroke="#e2e8f0" strokeWidth={1} />
              <text x={PADDING.left - 8} y={scaleY(v) + 4} textAnchor="end"
                fontSize={10} fontFamily="monospace" className="fill-slate-400">{Math.round(v)}</text>
            </g>
          ))}
          {xTickValues.map((v, i) => (
            <g key={`xg-${i}`}>
              <line x1={scaleX(v)} y1={PADDING.top} x2={scaleX(v)} y2={HEIGHT - PADDING.bottom}
                stroke="#e2e8f0" strokeWidth={1} />
              <text x={scaleX(v)} y={HEIGHT - PADDING.bottom + 16} textAnchor="middle"
                fontSize={10} fontFamily="monospace" className="fill-slate-400">{Math.round(v)}</text>
            </g>
          ))}

          {/* Axes */}
          <line x1={PADDING.left} y1={HEIGHT - PADDING.bottom} x2={WIDTH - PADDING.right} y2={HEIGHT - PADDING.bottom} stroke="#94a3b8" strokeWidth={1} />
          <line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={HEIGHT - PADDING.bottom} stroke="#94a3b8" strokeWidth={1} />

          {/* Axis labels */}
          <text x={WIDTH / 2} y={HEIGHT - 4} textAnchor="middle" fontSize={12} className="fill-slate-600">{xLabel}</text>
          <text x={14} y={HEIGHT / 2} textAnchor="middle" fontSize={12} className="fill-slate-600"
            transform={`rotate(-90, 14, ${HEIGHT / 2})`}>{yLabel}</text>

          {/* Outlier bounds */}
          {showOutlierBounds && (
            <>
              <rect x={PADDING.left} y={scaleY(upperBound)} width={PLOT_W}
                height={scaleY(lowerBound) - scaleY(upperBound)}
                fill="#dcfce7" opacity={0.4} />
              <line x1={PADDING.left} y1={scaleY(upperBound)} x2={WIDTH - PADDING.right} y2={scaleY(upperBound)}
                stroke="#16a34a" strokeWidth={1} strokeDasharray="6 3" />
              <line x1={PADDING.left} y1={scaleY(lowerBound)} x2={WIDTH - PADDING.right} y2={scaleY(lowerBound)}
                stroke="#16a34a" strokeWidth={1} strokeDasharray="6 3" />
              <line x1={PADDING.left} y1={scaleY(stats.yMean)} x2={WIDTH - PADDING.right} y2={scaleY(stats.yMean)}
                stroke="#2563eb" strokeWidth={1} strokeDasharray="4 4" />
              <text x={WIDTH - PADDING.right - 4} y={scaleY(upperBound) - 4} textAnchor="end"
                fontSize={9} className="fill-green-600">+{outliersStdFactor}σ</text>
              <text x={WIDTH - PADDING.right - 4} y={scaleY(lowerBound) + 12} textAnchor="end"
                fontSize={9} className="fill-green-600">-{outliersStdFactor}σ</text>
              <text x={WIDTH - PADDING.right - 4} y={scaleY(stats.yMean) - 4} textAnchor="end"
                fontSize={9} className="fill-blue-600">μ</text>
            </>
          )}

          {/* Trend line */}
          {showTrendLine && (
            <line
              x1={scaleX(stats.xMin)} y1={scaleY(stats.reg.intercept + stats.reg.slope * stats.xMin)}
              x2={scaleX(stats.xMax)} y2={scaleY(stats.reg.intercept + stats.reg.slope * stats.xMax)}
              stroke="#ef4444" strokeWidth={2} strokeDasharray="8 4" opacity={0.7}
            />
          )}

          {/* Data points */}
          {xData.map((x, i) => {
            const y = yData[i]
            const isOutlier = showOutlierBounds && (y > upperBound || y < lowerBound)
            const isHovered = hoveredIdx === i
            return (
              <g key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'default' }}
              >
                <circle
                  cx={scaleX(x)} cy={scaleY(y)}
                  r={isHovered ? 7 : 5}
                  fill={isOutlier ? '#ef4444' : '#3b82f6'}
                  stroke={isHovered ? '#1e40af' : 'white'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  opacity={0.85}
                />
                {isHovered && (
                  <text x={scaleX(x) + 10} y={scaleY(y) - 8} fontSize={11} fontFamily="monospace" className="fill-slate-700">
                    ({x}, {y})
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {showOutlierBounds && (
        <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-500" /> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Ausreißer
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 border border-green-500 border-dashed" /> ±{outliersStdFactor}σ Grenzen
          </span>
        </div>
      )}
    </div>
  )
}
