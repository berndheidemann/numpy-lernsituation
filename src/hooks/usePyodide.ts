import { useContext } from 'react'
import { PyodideContext } from '../components/pyodide/PyodideProvider'

export function usePyodide() {
  const context = useContext(PyodideContext)
  if (!context) {
    throw new Error('usePyodide must be used within a PyodideProvider')
  }
  return context
}
