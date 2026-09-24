// Habits added while offline wait here (per user, in localStorage) until the
// connection comes back. Only "add" is queued; other actions need the network.

export interface QueuedHabit {
  tempId: string
  name: string
  queuedAt: string
}

function key(userId: string) {
  return `habit-queue:${userId}`
}

export function readQueue(userId: string): QueuedHabit[] {
  try {
    const raw = localStorage.getItem(key(userId))
    return raw ? (JSON.parse(raw) as QueuedHabit[]) : []
  } catch {
    return []
  }
}

function writeQueue(userId: string, queue: QueuedHabit[]) {
  try {
    if (queue.length) localStorage.setItem(key(userId), JSON.stringify(queue))
    else localStorage.removeItem(key(userId))
  } catch {
    // Storage full or blocked: the item stays in memory for this session only.
  }
}

export function enqueueHabit(userId: string, name: string): QueuedHabit {
  const item: QueuedHabit = { tempId: `queued-${crypto.randomUUID()}`, name, queuedAt: new Date().toISOString() }
  writeQueue(userId, [...readQueue(userId), item])
  return item
}

export function removeFromQueue(userId: string, tempId: string) {
  writeQueue(
    userId,
    readQueue(userId).filter((item) => item.tempId !== tempId),
  )
}

export function isQueuedId(id: string) {
  return id.startsWith('queued-')
}

/** A fetch that never reached the server (offline, DNS, CORS) rather than a server-side rejection. */
export function isNetworkError(error: unknown) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true
  const message = error instanceof Error ? error.message : String(error)
  return /failed to fetch|networkerror|load failed|network request failed/i.test(message)
}
