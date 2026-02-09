import { useState, useCallback } from 'react'

interface ShapePredictorProps {
  id: string
  title: string
  /** The NumPy operation shown to the student */
  operation: string
  /** Context code shown above the operation (e.g. array definitions) */
  context?: string
  /** Expected shape as tuple, e.g. [3, 4] for (3, 4) */
  expectedShape: number[]
  /** Optional explanation shown after answering */
  explanation?: string
  onComplete?: () => void
}

export default function ShapePredictor({
  id,
  title,
  operation,
  context,
  expectedShape,
  explanation,
  onComplete,
}: ShapePredictorProps) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = useCallback(() => {
    // Parse input like "(3, 4)" or "3, 4" or "3,4"
    const cleaned = input.replace(/[()[\]\s]/g, '')
    const parts = cleaned.split(',').map((s) => parseInt(s.trim(), 10))

    const correct =
      parts.length === expectedShape.length &&
      parts.every((v, i) => !isNaN(v) && v === expectedShape[i])

    setIsCorrect(correct)
    setSubmitted(true)
    if (correct) onComplete?.()
  }, [input, expectedShape, onComplete])

  const handleRetry = useCallback(() => {
    setInput('')
    setSubmitted(false)
    setIsCorrect(false)
  }, [])

  const shapeStr = `(${expectedShape.join(', ')})`

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid={`shape-predictor-${id}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-3">{title}</h3>

      <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm mb-4">
        {context && (
          <div className="text-slate-500 mb-2">{context}</div>
        )}
        <div className="text-slate-900 font-medium">{operation}</div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-700">Resultierende Shape:</label>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono">(</span>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (submitted) {
                setSubmitted(false)
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
            }}
            placeholder="z.B. 3, 4"
            className={`w-32 px-2 py-1.5 text-sm font-mono border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              submitted
                ? isCorrect
                  ? 'border-green-400 bg-green-50'
                  : 'border-red-400 bg-red-50'
                : 'border-slate-300'
            }`}
            disabled={isCorrect}
            aria-label="Shape-Eingabe"
            data-testid="shape-input"
          />
          <span className="text-slate-400 font-mono">)</span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isCorrect}
          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Prüfen
        </button>
      </div>

      {submitted && (
        <div className="mt-3" data-testid="shape-result">
          {isCorrect ? (
            <p className="text-sm text-green-700 font-medium">
              Richtig! Die Shape ist {shapeStr}.
            </p>
          ) : (
            <div>
              <p className="text-sm text-red-700 font-medium">
                Nicht ganz. Die korrekte Shape ist {shapeStr}.
              </p>
              <button
                onClick={handleRetry}
                className="mt-2 px-3 py-1 text-xs text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
              >
                Nochmal versuchen
              </button>
            </div>
          )}
          {explanation && (
            <p className="text-xs text-slate-500 mt-2">{explanation}</p>
          )}
        </div>
      )}
    </div>
  )
}
