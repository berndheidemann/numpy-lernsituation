/**
 * Web Worker for Pyodide Python execution.
 * Runs Python code in isolation so the main thread stays responsive.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null
let initPromise: Promise<any> | null = null

const MAX_OUTPUT_LENGTH = 10_000

type WorkerMessage =
  | { type: 'init' }
  | { type: 'run'; id: string; code: string }
  | { type: 'run-with-validation'; id: string; code: string; validationCode: string }

function truncate(text: string): string {
  if (text.length > MAX_OUTPUT_LENGTH) {
    return text.slice(0, MAX_OUTPUT_LENGTH) + '\n... (Ausgabe gekürzt, max. 10.000 Zeichen)'
  }
  return text
}

async function initPyodide() {
  if (pyodide) return pyodide
  if (initPromise) return initPromise

  initPromise = (async () => {
    self.postMessage({ type: 'status', status: 'loading' })

    const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.mjs')
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/',
      packages: ['numpy'],
    })

    self.postMessage({ type: 'status', status: 'ready' })
    return pyodide
  })()

  return initPromise
}

async function runCode(id: string, code: string) {
  const py = await initPyodide()
  self.postMessage({ type: 'execution-started', id })

  const stdout: string[] = []
  const stderr: string[] = []

  py.setStdout({ batched: (msg: string) => stdout.push(msg) })
  py.setStderr({ batched: (msg: string) => stderr.push(msg) })

  const startTime = performance.now()

  try {
    await py.runPythonAsync(code)
    const executionTime = performance.now() - startTime

    self.postMessage({
      type: 'result',
      id,
      stdout: truncate(stdout.join('\n')),
      stderr: truncate(stderr.join('\n')),
      executionTime,
    })
  } catch (error) {
    const executionTime = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    self.postMessage({
      type: 'result',
      id,
      stdout: truncate(stdout.join('\n')),
      stderr: truncate(stderr.join('\n')),
      error: errorMessage,
      executionTime,
    })
  }
}

async function runWithValidation(id: string, code: string, validationCode: string) {
  const py = await initPyodide()
  self.postMessage({ type: 'execution-started', id })

  const stdout: string[] = []
  const stderr: string[] = []

  py.setStdout({ batched: (msg: string) => stdout.push(msg) })
  py.setStderr({ batched: (msg: string) => stderr.push(msg) })

  const startTime = performance.now()

  try {
    // Run student code first
    await py.runPythonAsync(code)
    const studentOutput = stdout.join('\n')
    const studentErrors = stderr.join('\n')

    // Run validation code (has access to variables from student code)
    const validationStdout: string[] = []
    const validationStderr: string[] = []
    py.setStdout({ batched: (msg: string) => validationStdout.push(msg) })
    py.setStderr({ batched: (msg: string) => validationStderr.push(msg) })

    let passed = false
    let validationMessage = ''
    try {
      await py.runPythonAsync(validationCode)
      passed = true
      validationMessage = validationStdout.join('\n')
    } catch (validationError) {
      passed = false
      validationMessage = validationError instanceof Error
        ? validationError.message
        : String(validationError)
    }

    const executionTime = performance.now() - startTime

    self.postMessage({
      type: 'validation-result',
      id,
      stdout: truncate(studentOutput),
      stderr: truncate(studentErrors),
      executionTime,
      passed,
      validationMessage,
    })
  } catch (error) {
    const executionTime = performance.now() - startTime
    const errorMessage = error instanceof Error ? error.message : String(error)

    self.postMessage({
      type: 'validation-result',
      id,
      stdout: truncate(stdout.join('\n')),
      stderr: truncate(stderr.join('\n')),
      error: errorMessage,
      executionTime,
      passed: false,
      validationMessage: '',
    })
  }
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data

  switch (msg.type) {
    case 'init':
      try {
        await initPyodide()
      } catch (error) {
        self.postMessage({
          type: 'status',
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        })
      }
      break

    case 'run':
      await runCode(msg.id, msg.code)
      break

    case 'run-with-validation':
      await runWithValidation(msg.id, msg.code, msg.validationCode)
      break
  }
}
