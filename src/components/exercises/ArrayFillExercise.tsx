import { useState, useCallback } from 'react'

interface ArrayFillExerciseProps {
  id: string
  title: string
  description: string
  /** Expected array values as 2D grid (rows x cols). Use null for pre-filled cells. */
  expected: (number | null)[][]
  /** Pre-filled values shown to the student (same shape). null = editable cell. */
  prefilled?: (number | null)[][]
  onComplete?: () => void
}

export default function ArrayFillExercise({
  id,
  title,
  description,
  expected,
  prefilled,
  onComplete,
}: ArrayFillExerciseProps) {
  const rows = expected.length
  const cols = expected[0]?.length ?? 0

  const [values, setValues] = useState<string[][]>(
    Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const pf = prefilled?.[r]?.[c]
        return pf !== null && pf !== undefined ? String(pf) : ''
      })
    )
  )
  const [submitted, setSubmitted] = useState(false)
  const [cellResults, setCellResults] = useState<boolean[][]>(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => false))
  )

  const isEditable = (r: number, c: number) => {
    if (!prefilled) return expected[r][c] !== null
    return prefilled[r][c] === null
  }

  const handleChange = useCallback((r: number, c: number, value: string) => {
    setValues((prev) => {
      const next = prev.map((row) => [...row])
      next[r][c] = value
      return next
    })
    if (submitted) {
      setSubmitted(false)
    }
  }, [submitted])

  const handleSubmit = useCallback(() => {
    const results = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        if (!isEditable(r, c)) return true
        const exp = expected[r][c]
        if (exp === null) return true
        const val = parseFloat(values[r][c])
        return !isNaN(val) && Math.abs(val - exp) < 0.01
      })
    )
    setCellResults(results)
    setSubmitted(true)
    const allCorrect = results.every((row) => row.every(Boolean))
    if (allCorrect) onComplete?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols, expected, values, onComplete])

  const allCorrect = submitted && cellResults.every((row) => row.every(Boolean))

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid={`arrayfill-exercise-${id}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{description}</p>

      <div className="overflow-x-auto">
        <table className="border-collapse" role="grid" aria-label="Array-Gitter">
          <thead>
            <tr>
              <th className="w-10" />
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="px-2 py-1 text-xs text-slate-400 font-mono text-center">
                  [{c}]
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <td className="px-2 py-1 text-xs text-slate-400 font-mono text-right">
                  [{r}]
                </td>
                {Array.from({ length: cols }, (_, c) => {
                  const editable = isEditable(r, c)
                  let cellClass = 'border-slate-200 bg-white'
                  if (submitted && editable) {
                    cellClass = cellResults[r][c]
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                  }
                  if (!editable) {
                    cellClass = 'border-slate-200 bg-slate-50'
                  }

                  return (
                    <td key={c} className={`border ${cellClass}`}>
                      <input
                        type="text"
                        value={values[r][c]}
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        disabled={!editable || allCorrect}
                        className="w-14 h-9 text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-transparent"
                        aria-label={`Zelle [${r}][${c}]`}
                        data-testid={`cell-${r}-${c}`}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={allCorrect}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Überprüfen
        </button>
        {submitted && (
          <span
            className={`text-sm font-medium ${allCorrect ? 'text-green-700' : 'text-red-700'}`}
            role="status"
            data-testid="arrayfill-result"
          >
            {allCorrect ? 'Alle Werte korrekt!' : 'Einige Werte sind noch falsch.'}
          </span>
        )}
      </div>
    </div>
  )
}
