import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { PyodideStatus, PythonResult } from '../../types'

interface ValidationResult extends PythonResult {
  passed: boolean
  validationMessage: string
}

interface PyodideContextValue {
  status: PyodideStatus
  initPyodide: () => void
  runPython: (code: string) => Promise<PythonResult>
  runWithValidation: (code: string, validationCode: string) => Promise<ValidationResult>
}

export const PyodideContext = createContext<PyodideContextValue | null>(null)

const EXECUTION_TIMEOUT = 10_000

export default function PyodideProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PyodideStatus>('idle')
  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<Map<string, {
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
    timer: ReturnType<typeof setTimeout>
  }>>(new Map())
  const idCounterRef = useRef(0)

  const createWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current

    const worker = new Worker(
      new URL('../../workers/pyodide.worker.ts', import.meta.url),
      { type: 'module' },
    )

    worker.onmessage = (event) => {
      const msg = event.data

      if (msg.type === 'status') {
        setStatus(msg.status as PyodideStatus)
        return
      }

      if (msg.type === 'result' || msg.type === 'validation-result') {
        const pending = pendingRef.current.get(msg.id)
        if (pending) {
          clearTimeout(pending.timer)
          pendingRef.current.delete(msg.id)
          pending.resolve(msg)
        }
      }
    }

    worker.onerror = (error) => {
      console.error('Pyodide Worker error:', error)
      setStatus('error')
    }

    workerRef.current = worker
    return worker
  }, [])

  const terminateAndRestart = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    // Reject all pending operations
    for (const [, pending] of pendingRef.current) {
      clearTimeout(pending.timer)
      pending.reject(new Error('Worker wurde neu gestartet'))
    }
    pendingRef.current.clear()
    setStatus('idle')
  }, [])

  const initPyodide = useCallback(() => {
    const worker = createWorker()
    worker.postMessage({ type: 'init' })
  }, [createWorker])

  const sendMessage = useCallback((message: unknown): Promise<unknown> => {
    const worker = createWorker()
    if (status === 'idle') {
      worker.postMessage({ type: 'init' })
    }

    return new Promise((resolve, reject) => {
      const id = String(++idCounterRef.current)
      const messageWithId = { ...(message as Record<string, unknown>), id }

      const timer = setTimeout(() => {
        pendingRef.current.delete(id)
        terminateAndRestart()
        reject(new Error('Timeout: Die Ausführung hat länger als 10 Sekunden gedauert. Mögliche Endlosschleife?'))
      }, EXECUTION_TIMEOUT)

      pendingRef.current.set(id, { resolve, reject, timer })
      worker.postMessage(messageWithId)
    })
  }, [createWorker, status, terminateAndRestart])

  const runPython = useCallback(async (code: string): Promise<PythonResult> => {
    const result = await sendMessage({ type: 'run', code }) as PythonResult
    return result
  }, [sendMessage])

  const runWithValidation = useCallback(async (code: string, validationCode: string): Promise<ValidationResult> => {
    const result = await sendMessage({ type: 'run-with-validation', code, validationCode }) as ValidationResult
    return result
  }, [sendMessage])

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
      for (const [, pending] of pendingRef.current) {
        clearTimeout(pending.timer)
      }
    }
  }, [])

  return (
    <PyodideContext.Provider value={{ status, initPyodide, runPython, runWithValidation }}>
      {children}
    </PyodideContext.Provider>
  )
}
