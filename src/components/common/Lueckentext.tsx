import { useState, useCallback } from 'react'

interface Gap {
  id: string
  answer: string
  hint?: string
}

interface LueckentextProps {
  id: string
  /** Array of segments — strings are static text, Gap objects are fill-in blanks */
  segments: (string | Gap)[]
  onComplete?: () => void
}

export default function Lueckentext({ id, segments, onComplete }: LueckentextProps) {
  const gaps = segments.filter((s): s is Gap => typeof s !== 'string')
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(gaps.map((g) => [g.id, '']))
  )
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Record<string, boolean>>({})

  const handleChange = useCallback((gapId: string, value: string) => {
    setValues((prev) => ({ ...prev, [gapId]: value }))
    if (submitted) {
      setSubmitted(false)
      setResults({})
    }
  }, [submitted])

  const handleSubmit = useCallback(() => {
    const newResults: Record<string, boolean> = {}
    let allCorrect = true
    for (const gap of gaps) {
      const correct = values[gap.id].trim().toLowerCase() === gap.answer.trim().toLowerCase()
      newResults[gap.id] = correct
      if (!correct) allCorrect = false
    }
    setResults(newResults)
    setSubmitted(true)
    if (allCorrect) {
      onComplete?.()
    }
  }, [gaps, values, onComplete])

  const allFilled = gaps.every((g) => values[g.id].trim().length > 0)
  const allCorrect = submitted && gaps.every((g) => results[g.id])

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid={`lueckentext-${id}`}
    >
      <div className="font-mono text-sm leading-relaxed bg-slate-50 rounded-lg p-4 whitespace-pre-wrap">
        {segments.map((segment, i) => {
          if (typeof segment === 'string') {
            return <span key={i}>{segment}</span>
          }

          const gap = segment
          const isCorrect = results[gap.id]
          let inputClass = 'border-slate-300 bg-white'
          if (submitted && isCorrect) {
            inputClass = 'border-green-400 bg-green-50 text-green-800'
          } else if (submitted && !isCorrect) {
            inputClass = 'border-red-400 bg-red-50 text-red-800'
          }

          return (
            <span key={i} className="inline-block mx-1 align-middle">
              <input
                type="text"
                value={values[gap.id]}
                onChange={(e) => handleChange(gap.id, e.target.value)}
                placeholder="..."
                className={`inline-block w-auto min-w-[80px] px-2 py-0.5 text-sm font-mono border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${inputClass}`}
                style={{ width: `${Math.max(gap.answer.length, 6) * 9 + 20}px` }}
                aria-label={`Lücke ${gap.id}`}
                data-testid={`gap-${gap.id}`}
                disabled={allCorrect}
              />
              {submitted && !isCorrect && gap.hint && (
                <span className="text-xs text-red-600 block mt-0.5">{gap.hint}</span>
              )}
            </span>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={!allFilled || allCorrect}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Überprüfen
        </button>
        {submitted && (
          <span
            className={`text-sm font-medium ${allCorrect ? 'text-green-700' : 'text-red-700'}`}
            role="status"
            data-testid="lueckentext-result"
          >
            {allCorrect ? 'Alle Lücken korrekt!' : 'Nicht alle Lücken sind richtig.'}
          </span>
        )}
      </div>
    </div>
  )
}
