import { useCallback, useState } from 'react'
import { usePyodide } from '../../hooks/usePyodide'
import PythonEditor from '../pyodide/PythonEditor'
import PythonOutput from '../pyodide/PythonOutput'
import ErrorBoundary from '../common/ErrorBoundary'

interface CodingExerciseProps {
  id: string
  title: string
  description: string
  starterCode: string
  solution?: string
  validationCode?: string
  hints?: string[]
  onComplete?: () => void
}

export default function CodingExercise({
  id,
  title,
  description,
  starterCode,
  solution,
  validationCode,
  hints,
  onComplete,
}: CodingExerciseProps) {
  const { status, runPython, runWithValidation } = usePyodide()
  const [running, setRunning] = useState(false)
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [executionTime, setExecutionTime] = useState<number | undefined>()
  const [passed, setPassed] = useState<boolean | null>(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  const handleRun = useCallback(async (code: string) => {
    setRunning(true)
    setError(undefined)
    setPassed(null)
    setValidationMessage('')
    setAttempts((a) => a + 1)

    try {
      if (validationCode) {
        const result = await runWithValidation(code, validationCode)
        setStdout(result.stdout)
        setStderr(result.stderr)
        setError(result.error)
        setExecutionTime(result.executionTime)
        setPassed(result.passed)
        setValidationMessage(result.validationMessage)
        if (result.passed) {
          onComplete?.()
        }
      } else {
        const result = await runPython(code)
        setStdout(result.stdout)
        setStderr(result.stderr)
        setError(result.error)
        setExecutionTime(result.executionTime)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setRunning(false)
    }
  }, [validationCode, runPython, runWithValidation, onComplete])

  const handleReset = useCallback(() => {
    setStdout('')
    setStderr('')
    setError(undefined)
    setExecutionTime(undefined)
    setPassed(null)
    setValidationMessage('')
    setEditorKey((k) => k + 1)
  }, [])

  return (
    <ErrorBoundary context={`Coding-Übung: ${title}`}>
      <section
        className="rounded-xl border border-slate-200 bg-white p-6 my-6"
        aria-labelledby={`exercise-${id}`}
        data-testid={`coding-exercise-${id}`}
      >
        <h3 id={`exercise-${id}`} className="text-lg font-semibold text-slate-900 mb-2">
          {title}
        </h3>
        <p className="text-slate-600 mb-4">{description}</p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <PythonEditor
              key={editorKey}
              defaultCode={starterCode}
              onRun={handleRun}
              onReset={handleReset}
              running={running}
            />
          </div>
          <div className="flex flex-col gap-3">
            <PythonOutput
              stdout={stdout}
              stderr={stderr}
              error={error}
              executionTime={executionTime}
              status={status}
            />

            {passed !== null && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  passed
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
                role="status"
                data-testid="validation-result"
              >
                <span className="font-medium">
                  {passed ? 'Bestanden!' : 'Noch nicht korrekt.'}
                </span>
                {validationMessage && (
                  <p className="mt-1">{validationMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {hints && hints.length > 0 && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition-colors"
            >
              {showHint ? 'Hinweis ausblenden' : 'Hinweis anzeigen'}
            </button>
          )}
          {solution && attempts >= 1 && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              {showSolution ? 'Lösung ausblenden' : 'Lösung anzeigen'}
            </button>
          )}
        </div>

        {showHint && hints && (
          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            {hints.map((hint, i) => (
              <p key={i} className="mt-1 first:mt-0">{hint}</p>
            ))}
          </div>
        )}

        {showSolution && solution && (
          <div className="mt-3">
            <p className="text-sm font-medium text-slate-500 mb-1">Musterlösung:</p>
            <pre className="p-4 rounded-lg bg-slate-800 text-green-400 text-sm font-mono overflow-x-auto">
              {solution}
            </pre>
          </div>
        )}
      </section>
    </ErrorBoundary>
  )
}
