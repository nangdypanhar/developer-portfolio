import { beforeEach, describe, expect, it } from 'vitest'
import { enqueueHabit, isNetworkError, isQueuedId, readQueue, removeFromQueue } from './offlineQueue'

describe('offlineQueue', () => {
  beforeEach(() => localStorage.clear())

  it('queues habits per user and survives a reload (localStorage)', () => {
    const a = enqueueHabit('user-a', 'Stretch')
    enqueueHabit('user-b', 'Journal')

    expect(readQueue('user-a').map((q) => q.name)).toEqual(['Stretch'])
    expect(readQueue('user-b').map((q) => q.name)).toEqual(['Journal'])
    expect(isQueuedId(a.tempId)).toBe(true)
  })

  it('removes an item and clears the key when empty', () => {
    const a = enqueueHabit('user-a', 'Stretch')
    removeFromQueue('user-a', a.tempId)

    expect(readQueue('user-a')).toEqual([])
    expect(localStorage.getItem('habit-queue:user-a')).toBeNull()
  })

  it('treats fetch failures as network errors but not server errors', () => {
    expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true)
    expect(isNetworkError(new Error('new row violates row-level security policy'))).toBe(false)
  })
})
