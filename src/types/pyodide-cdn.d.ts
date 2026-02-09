declare module 'https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.mjs' {
  export function loadPyodide(options?: {
    indexURL?: string
    fullStdLib?: boolean
    packages?: string[]
    stdout?: (msg: string) => void
    stderr?: (msg: string) => void
    stdin?: () => string
    env?: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any>
}
