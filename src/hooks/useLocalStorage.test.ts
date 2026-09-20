import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('returns the initial value when nothing is stored yet', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))
    expect(result.current[0]).toBe(0)
  })

  it('persists updates to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0))

    act(() => {
      result.current[1](5)
    })

    expect(result.current[0]).toBe(5)
    expect(window.localStorage.getItem('count')).toBe('5')
  })

  it('reads a previously stored value on mount', () => {
    window.localStorage.setItem('count', JSON.stringify(42))
    const { result } = renderHook(() => useLocalStorage('count', 0))
    expect(result.current[0]).toBe(42)
  })
})
