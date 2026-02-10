import { useState } from 'react'
import { motion } from 'framer-motion'

interface BooleanMaskCombinerProps {
  values: number[]
  label?: string
}

type Operator = '&' | '|' | '~A'

const CELL = 44
const GAP = 3

export default function BooleanMaskCombiner({ values, label }: BooleanMaskCombinerProps) {
  const [thresholdA, setThresholdA] = useState(15)
  const [thresholdB, setThresholdB] = useState(40)
  const [operator, setOperator] = useState<Operator>('&')

  const maskA = values.map((v) => v > thresholdA)
  const maskB = values.map((v) => v < thresholdB)

  const combined = values.map((_, i) => {
    if (operator === '&') return maskA[i] && maskB[i]
    if (operator === '|') return maskA[i] || maskB[i]
    return !maskA[i] // ~A
  })

  const filteredValues = values.filter((_, i) => combined[i])

  const cols = values.length
  const svgWidth = cols * (CELL + GAP) + 10

  const operatorLabels: Record<Operator, string> = {
    '&': `(arr > ${thresholdA}) & (arr < ${thresholdB})`,
    '|': `(arr > ${thresholdA}) | (arr < ${thresholdB})`,
    '~A': `~(arr > ${thresholdA})`,
  }

  const renderRow = (
    mask: boolean[],
    rowLabel: string,
    trueColor: string,
    _falseColor: string,
    showValues: boolean,
    testId: string,
  ) => (
    <div data-testid={testId}>
      <p className="text-xs font-mono text-slate-500 mb-1">{rowLabel}</p>
      <svg width={svgWidth} height={CELL + 6} viewBox={`0 0 ${svgWidth} ${CELL + 6}`}>
        {values.map((v, i) => {
          const x = i * (CELL + GAP) + 5
          const active = mask[i]
          return (
            <g key={i}>
              <motion.rect
                x={x} y={3} width={CELL} height={CELL} rx={4}
                stroke={active ? trueColor : '#e2e8f0'}
                strokeWidth={active ? 2 : 1}
                animate={{ fill: active ? trueColor + '33' : '#f8fafc' }}
                transition={{ duration: 0.25 }}
              />
              <text
                x={x + CELL / 2} y={3 + CELL / 2 + 5}
                textAnchor="middle" fontSize={showValues ? 12 : 11} fontFamily="monospace"
                className={active ? 'fill-slate-800' : 'fill-slate-300'}
              >
                {showValues ? v : (active ? 'T' : 'F')}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="boolean-mask-combiner">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">arr &gt;</label>
          <input
            type="range" min={0} max={50} value={thresholdA}
            onChange={(e) => setThresholdA(Number(e.target.value))}
            className="w-24"
            data-testid="threshold-a"
          />
          <span className="text-sm font-mono text-slate-700 w-6">{thresholdA}</span>
        </div>
        {operator !== '~A' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">arr &lt;</label>
            <input
              type="range" min={0} max={60} value={thresholdB}
              onChange={(e) => setThresholdB(Number(e.target.value))}
              className="w-24"
              data-testid="threshold-b"
            />
            <span className="text-sm font-mono text-slate-700 w-6">{thresholdB}</span>
          </div>
        )}
      </div>

      {/* Operator toggle */}
      <div className="flex items-center gap-2 mb-4">
        {(['&', '|', '~A'] as Operator[]).map((op) => (
          <button
            key={op}
            onClick={() => setOperator(op)}
            className={`px-3 py-1.5 text-sm font-mono rounded-md transition-colors ${
              operator === op ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            data-testid={`op-${op}`}
          >
            {op === '&' ? 'UND (&)' : op === '|' ? 'ODER (|)' : 'NICHT (~)'}
          </button>
        ))}
      </div>

      {/* Data row */}
      {renderRow(values.map(() => true), 'arr', '#64748b', '#e2e8f0', true, 'row-values')}

      <div className="my-2" />

      {/* Mask A */}
      {renderRow(maskA, `Maske A: arr > ${thresholdA}`, '#3b82f6', '#e2e8f0', false, 'row-mask-a')}

      {/* Mask B (only for & and |) */}
      {operator !== '~A' && (
        <>
          <div className="my-2" />
          {renderRow(maskB, `Maske B: arr < ${thresholdB}`, '#16a34a', '#e2e8f0', false, 'row-mask-b')}
        </>
      )}

      <div className="my-3 border-t border-dashed border-slate-300" />

      {/* Combined result */}
      {renderRow(combined, operatorLabels[operator], '#d946ef', '#e2e8f0', false, 'row-combined')}

      <div className="my-2" />

      {/* Filtered values */}
      <div data-testid="filtered-result">
        <p className="text-xs font-mono text-slate-500 mb-1">arr[{operatorLabels[operator]}]</p>
        <svg width={svgWidth} height={CELL + 6} viewBox={`0 0 ${svgWidth} ${CELL + 6}`}>
          {values.map((v, i) => {
            const x = i * (CELL + GAP) + 5
            const active = combined[i]
            return (
              <g key={i}>
                <motion.rect
                  x={x} y={3} width={CELL} height={CELL} rx={4}
                  stroke={active ? '#d946ef' : '#f1f5f9'}
                  strokeWidth={active ? 2 : 1}
                  animate={{
                    fill: active ? '#fae8ff' : '#f8fafc',
                    opacity: active ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.25 }}
                />
                <motion.text
                  x={x + CELL / 2} y={3 + CELL / 2 + 5}
                  textAnchor="middle" fontSize={12} fontFamily="monospace"
                  animate={{ opacity: active ? 1 : 0.15 }}
                >
                  {v}
                </motion.text>
              </g>
            )
          })}
        </svg>
        <p className="text-xs text-slate-500 mt-1">
          Ergebnis: [{filteredValues.join(', ')}] — {filteredValues.length} von {values.length} Werten
        </p>
      </div>
    </div>
  )
}
