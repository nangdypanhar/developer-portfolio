import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CrashButton from './CrashButton'
import ErrorBoundary from './ErrorBoundary'

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // React logs caught render errors; keep test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('shows the fallback for the crashed section while siblings keep rendering', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ErrorBoundary name="Stats">
          <p>Stats content</p>
          <CrashButton label="Stats" />
        </ErrorBoundary>
        <ErrorBoundary name="Habit list">
          <p>Habit list content</p>
        </ErrorBoundary>
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Crash' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Stats failed to load.')
    expect(screen.queryByText('Stats content')).not.toBeInTheDocument()
    expect(screen.getByText('Habit list content')).toBeInTheDocument()
  })

  it('re-renders the children after "Try again"', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary name="Stats">
        <p>Stats content</p>
        <CrashButton label="Stats" />
      </ErrorBoundary>,
    )

    await user.click(screen.getByRole('button', { name: 'Crash' }))
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByText('Stats content')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('uses a custom fallback when given one', async () => {
    const user = userEvent.setup()
    render(
      <ErrorBoundary name="Nav" fallback={(error, reset) => <button onClick={reset}>Custom: {error.message}</button>}>
        <CrashButton label="Nav" />
      </ErrorBoundary>,
    )

    await user.click(screen.getByRole('button', { name: 'Crash' }))

    expect(screen.getByRole('button', { name: 'Custom: Deliberate crash in Nav' })).toBeInTheDocument()
  })
})
