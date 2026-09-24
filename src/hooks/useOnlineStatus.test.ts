import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useOnlineStatus } from './useOnlineStatus'

describe('useOnlineStatus', () => {
  afterEach(() => vi.restoreAllMocks())

  it('follows the online/offline events', () => {
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    onLine.mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })
    expect(result.current).toBe(false)

    onLine.mockReturnValue(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })
    expect(result.current).toBe(true)
  })
})
