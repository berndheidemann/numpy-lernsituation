import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BroadcastingPlaygroundProps {
  label?: string
}

interface StepResult {
  dimA: number | null
  dimB: number | null
  paddedA: number | null
  paddedB: number | null
  result: number | null
  status: 'match' | 'stretch' | 'error'
  note: string
}

function parseDims(input: string): number[] | null {
  const trimmed = input.replace(/[()[\]\s]/g, '')
  if (!trimmed) return null
  const parts = trimmed.split(',').filter(Boolean)
  const nums = parts.map(Number)
  if (nums.some(isNaN) || nums.some((n) => n < 1)) return null
  return nums
}

function broadcastSteps(dimsA: number[], dimsB: number[]): { steps: StepResult[]; resultShape: number[] | null } {
  const maxLen = Math.max(dimsA.length, dimsB.length)
  const padA = Array(maxLen - dimsA.length).fill(1).concat(dimsA)
  const padB = Array(maxLen - dimsB.length).fill(1).concat(dimsB)

  const steps: StepResult[] = []
  const resultShape: number[] = []
  let compatible = true

  for (let i = 0; i < maxLen; i++) {
    const a = padA[i]
    const b = padB[i]
    const origA = i < maxLen - dimsA.length ? null : dimsA[i - (maxLen - dimsA.length)]
    const origB = i < maxLen - dimsB.length ? null : dimsB[i - (maxLen - dimsB.length)]

    if (a === b) {
      steps.push({ dimA: origA, dimB: origB, paddedA: a, paddedB: b, result: a, status: 'match', note: `${a} = ${b}` })
      resultShape.push(a)
    } else if (a === 1) {
      steps.push({ dimA: origA, dimB: origB, paddedA: a, paddedB: b, result: b, status: 'stretch', note: `1 → ${b}` })
      resultShape.push(b)
    } else if (b === 1) {
      steps.push({ dimA: origA, dimB: origB, paddedA: a, paddedB: b, result: a, status: 'stretch', note: `1 → ${a}` })
      resultShape.push(a)
    } else {
      steps.push({ dimA: origA, dimB: origB, paddedA: a, paddedB: b, result: null, status: 'error', note: `${a} ≠ ${b}` })
      compatible = false
    }
  }

  return { steps, resultShape: compatible ? resultShape : null }
}

export default function BroadcastingPlayground({ label }: BroadcastingPlaygroundProps) {
  const [inputA, setInputA] = useState('4, 1')
  const [inputB, setInputB] = useState('1, 5')

  const analysis = useMemo(() => {
    const dimsA = parseDims(inputA)
    const dimsB = parseDims(inputB)
    if (!dimsA || !dimsB) return null
    return { dimsA, dimsB, ...broadcastSteps(dimsA, dimsB) }
  }, [inputA, inputB])

  const statusColors: Record<string, { bg: string; border: string; text: string }> = {
    match: { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
    stretch: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
    error: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' },
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 my-6" data-testid="broadcasting-playground">
      {label && <h3 className="text-lg font-semibold text-slate-900 mb-3">{label}</h3>}

      <p className="text-sm text-slate-500 mb-4">
        Gib zwei Shapes ein und sieh Schritt für Schritt, ob sie Broadcasting-kompatibel sind:
      </p>

      {/* Input fields */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Shape A</label>
          <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="z.B. 3, 1"
            data-testid="input-shape-a"
          />
        </div>
        <span className="text-slate-400 font-mono mt-5">+</span>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Shape B</label>
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="z.B. 1, 5"
            data-testid="input-shape-b"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {analysis && (
          <motion.div
            key={`${inputA}-${inputB}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Step-by-step table */}
            <div className="overflow-x-auto">
              <table className="text-sm w-full" data-testid="broadcast-steps">
                <thead>
                  <tr className="text-xs text-slate-500">
                    <th className="text-left py-1 pr-3">Dim</th>
                    <th className="text-center py-1 px-3">Shape A</th>
                    <th className="text-center py-1 px-3">Shape B</th>
                    <th className="text-center py-1 px-3">Ergebnis</th>
                    <th className="text-left py-1 pl-3">Regel</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.steps.map((step, i) => {
                    const colors = statusColors[step.status]
                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="border-t border-slate-100"
                      >
                        <td className="py-2 pr-3 font-mono text-slate-400">{i}</td>
                        <td className="py-2 px-3 text-center font-mono">
                          {step.paddedA}
                          {step.dimA === null && <span className="text-[9px] text-slate-400 ml-1">(pad)</span>}
                        </td>
                        <td className="py-2 px-3 text-center font-mono">
                          {step.paddedB}
                          {step.dimB === null && <span className="text-[9px] text-slate-400 ml-1">(pad)</span>}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className="inline-block px-2 py-0.5 rounded font-mono font-medium text-xs"
                            style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                          >
                            {step.result ?? '✗'}
                          </span>
                        </td>
                        <td className="py-2 pl-3 text-xs text-slate-500">
                          {step.status === 'match' && 'Gleich'}
                          {step.status === 'stretch' && `Stretch: ${step.note}`}
                          {step.status === 'error' && `Inkompatibel: ${step.note}`}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Result */}
            <motion.div
              className={`mt-4 p-3 rounded-lg border text-sm font-medium ${
                analysis.resultShape
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: analysis.steps.length * 0.1 }}
              data-testid="broadcast-result"
            >
              {analysis.resultShape ? (
                <>
                  Kompatibel! Ergebnis-Shape:{' '}
                  <code className="font-mono">({analysis.resultShape.join(', ')})</code>
                </>
              ) : (
                'Nicht kompatibel — Broadcasting nicht möglich.'
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!analysis && (
        <p className="text-xs text-slate-400 italic">Bitte gültige Shapes eingeben (z.B. &quot;3, 4&quot; oder &quot;1, 5&quot;).</p>
      )}
    </div>
  )
}
