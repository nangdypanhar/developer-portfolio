import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('a', 500))
    expect(result.current).toBe('a')
  })

  it('updates to the new value once the delay has fully elapsed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('ab')
  })

  it('does not show stale intermediate values while typing rapidly', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(100))
    rerender({ value: 'abcd' })

    // 550ms since the very first change: the (cancelled) timer scheduled for
    // "ab" would already have fired here if the effect's cleanup hadn't
    // cancelled it when "value" changed again.
    act(() => vi.advanceTimersByTime(350))
    expect(result.current).toBe('a')

    act(() => vi.advanceTimersByTime(150))
    expect(result.current).toBe('abcd')
  })
})
