import type { PyodideStatus } from '../../types'

interface PythonOutputProps {
  stdout: string
  stderr: string
  error?: string
  executionTime?: number
  status: PyodideStatus
}

export default function PythonOutput({
  stdout,
  stderr,
  error,
  executionTime,
  status,
}: PythonOutputProps) {
  if (status === 'loading') {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-900 p-4">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
          <span className="text-sm">Python-Umgebung wird geladen...</span>
        </div>
        <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse w-2/3" />
        </div>
      </div>
    )
  }

  const hasOutput = stdout || stderr || error

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-900 text-sm font-mono" data-testid="python-output">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
        <span className="text-slate-400 text-xs font-sans">Ausgabe</span>
        {executionTime !== undefined && (
          <span className="text-slate-500 text-xs font-sans">
            {executionTime.toFixed(0)} ms
          </span>
        )}
      </div>
      <div className="p-4 min-h-[80px] max-h-[400px] overflow-auto">
        {!hasOutput && (
          <p className="text-slate-500 italic font-sans text-sm">
            Klicke auf &quot;Ausführen&quot;, um den Code zu starten.
          </p>
        )}
        {stdout && (
          <pre className="text-green-400 whitespace-pre-wrap break-words">{stdout}</pre>
        )}
        {stderr && (
          <pre className="text-yellow-400 whitespace-pre-wrap break-words mt-2">{stderr}</pre>
        )}
        {error && (
          <pre className="text-red-400 whitespace-pre-wrap break-words mt-2">{error}</pre>
        )}
      </div>
    </div>
  )
}
