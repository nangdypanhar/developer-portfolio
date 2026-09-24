import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  /** Shown in the default fallback and in the console log, e.g. "Habit list". */
  name: string
  children: ReactNode
  /** Custom fallback UI. Call `reset` to re-render the children. */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

// Catches errors thrown while RENDERING its children (not in event handlers or
// async code), so one broken section shows a fallback instead of unmounting
// the whole app.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary: ${this.props.name}]`, error, info.componentStack)
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) {
      return this.props.children
    }

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset)
    }

    return (
      <div role="alert" className="flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p className="font-semibold">{this.props.name} failed to load.</p>
        <p className="text-xs text-red-600">{error.message}</p>
        <button type="button" onClick={this.reset} className="w-fit font-medium underline">
          Try again
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
