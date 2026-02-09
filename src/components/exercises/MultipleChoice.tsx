import { useState, useCallback } from 'react'

interface Option {
  text: string
  explanation?: string
}

interface MultipleChoiceProps {
  id: string
  question: string
  options: Option[]
  correctIndex: number
  onComplete?: () => void
}

export default function MultipleChoice({
  id,
  question,
  options,
  correctIndex,
  onComplete,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = useCallback(() => {
    if (selected === null) return
    setSubmitted(true)
    if (selected === correctIndex) {
      onComplete?.()
    }
  }, [selected, correctIndex, onComplete])

  const handleRetry = useCallback(() => {
    setSelected(null)
    setSubmitted(false)
  }, [])

  const isCorrect = submitted && selected === correctIndex

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-6 my-6"
      data-testid={`mc-exercise-${id}`}
    >
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{question}</h3>

      <fieldset disabled={submitted}>
        <legend className="sr-only">{question}</legend>
        <div className="flex flex-col gap-2" role="radiogroup">
          {options.map((option, index) => {
            let borderClass = 'border-slate-200'
            if (submitted && index === correctIndex) {
              borderClass = 'border-green-400 bg-green-50'
            } else if (submitted && index === selected && index !== correctIndex) {
              borderClass = 'border-red-400 bg-red-50'
            } else if (!submitted && index === selected) {
              borderClass = 'border-blue-400 bg-blue-50'
            }

            return (
              <label
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${borderClass} ${
                  submitted ? 'cursor-default' : 'hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name={`mc-${id}`}
                  value={index}
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                  className="mt-0.5 accent-blue-600"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-800">{option.text}</span>
                  {submitted && option.explanation && (
                    <p className="text-xs text-slate-500 mt-1">{option.explanation}</p>
                  )}
                </div>
                {submitted && index === correctIndex && (
                  <span className="text-green-600 text-sm font-medium" aria-label="Korrekt">&#10003;</span>
                )}
                {submitted && index === selected && index !== correctIndex && (
                  <span className="text-red-600 text-sm font-medium" aria-label="Falsch">&#10007;</span>
                )}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex items-center gap-3 mt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Antwort prüfen
          </button>
        ) : (
          <>
            <div
              className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
              role="status"
              data-testid="mc-result"
            >
              {isCorrect ? 'Richtig!' : 'Leider falsch.'}
            </div>
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
              >
                Nochmal versuchen
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
