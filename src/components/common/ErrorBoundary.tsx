import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  context?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.context ?? 'unknown'}]:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 my-4" role="alert">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Etwas ist schiefgelaufen
          </h2>
          <p className="text-sm text-red-700 mb-4">
            {this.props.context
              ? `Fehler im Bereich: ${this.props.context}`
              : 'Ein unerwarteter Fehler ist aufgetreten.'}
          </p>
          {this.state.error && (
            <pre className="text-xs bg-red-100 rounded p-3 overflow-x-auto text-red-900">
              {this.state.error.message}
            </pre>
          )}
          <button
            className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Erneut versuchen
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
