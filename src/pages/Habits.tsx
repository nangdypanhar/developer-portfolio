import { useCallback, useEffect, useRef, useState } from 'react'
import CrashButton from '../components/CrashButton'
import ErrorBoundary from '../components/ErrorBoundary'
import ShareButton from '../components/ShareButton'
import AddHabitForm from '../components/habits/AddHabitForm'
import HabitItem from '../components/habits/HabitItem'
import HabitStats from '../components/habits/HabitStats'
import AvatarUploader from '../components/profile/AvatarUploader'
import { useAuth } from '../context/AuthContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { createHabit, deleteHabit, fetchHabits, setDoneOn, today, updateHabit } from '../lib/habits'
import {
  enqueueHabit,
  isNetworkError,
  isQueuedId,
  readQueue,
  removeFromQueue,
  type QueuedHabit,
} from '../lib/offlineQueue'
import type { Habit } from '../types/habit'

function queuedToHabit(item: QueuedHabit): Habit {
  return { id: item.tempId, name: item.name, isActive: true, createdAt: item.queuedAt, logDates: [], pending: true }
}

function Habits() {
  const { user } = useAuth()
  // ProtectedRoute guarantees a user here.
  const userId = user!.id
  const online = useOnlineStatus()
  const [habits, setHabits] = useState<Habit[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const syncing = useRef(false)
  const todayDate = today()

  // Push queued (offline) habits to Supabase one by one, swapping each
  // placeholder for the real row as it lands.
  const syncQueue = useCallback(async () => {
    if (syncing.current) return
    syncing.current = true
    try {
      for (const item of readQueue(userId)) {
        try {
          const saved = await createHabit(userId, item.name)
          removeFromQueue(userId, item.tempId)
          setHabits((prev) => {
            const list = prev ?? []
            return list.some((h) => h.id === item.tempId)
              ? list.map((h) => (h.id === item.tempId ? saved : h))
              : [...list, saved]
          })
        } catch (error) {
          if (isNetworkError(error)) break // still offline; try again on the next "online" event
          // The server refused it (e.g. validation): drop it so it doesn't retry forever.
          removeFromQueue(userId, item.tempId)
          setHabits((prev) => prev?.filter((h) => h.id !== item.tempId) ?? null)
          setSyncError(`Could not sync "${item.name}": ${error instanceof Error ? error.message : 'unknown error'}`)
        }
      }
    } finally {
      syncing.current = false
    }
  }, [userId])

  const load = useCallback(() => {
    setLoadError(null)
    setHabits(null)
    fetchHabits(userId)
      .then((rows) => {
        setHabits([...rows, ...readQueue(userId).map(queuedToHabit)])
        if (navigator.onLine) syncQueue()
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Failed to load habits.')
      })
  }, [userId, syncQueue])

  useEffect(load, [load])

  // Reconnected → flush the queue.
  const loaded = habits !== null
  useEffect(() => {
    if (online && loaded) syncQueue()
  }, [online, loaded, syncQueue])

  function replace(updated: Habit) {
    setHabits((prev) => prev?.map((h) => (h.id === updated.id ? updated : h)) ?? null)
  }

  function queue(name: string) {
    const item = enqueueHabit(userId, name)
    setHabits((prev) => [...(prev ?? []), queuedToHabit(item)])
  }

  async function handleAdd(name: string) {
    if (!navigator.onLine) {
      queue(name)
      return
    }
    try {
      const habit = await createHabit(userId, name)
      setHabits((prev) => [...(prev ?? []), habit])
    } catch (error) {
      // Connection dropped mid-request: queue it instead of losing it.
      if (isNetworkError(error)) queue(name)
      else throw error
    }
  }

  async function handleRename(id: string, name: string) {
    replace(await updateHabit(userId, id, { name }))
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    replace(await updateHabit(userId, id, { isActive }))
  }

  async function handleToggleDone(id: string, done: boolean) {
    await setDoneOn(userId, id, todayDate, done)
    setHabits(
      (prev) =>
        prev?.map((h) =>
          h.id !== id
            ? h
            : {
                ...h,
                logDates: done ? [...h.logDates, todayDate].sort() : h.logDates.filter((d) => d !== todayDate),
              },
        ) ?? null,
    )
  }

  async function handleDelete(id: string) {
    if (isQueuedId(id)) removeFromQueue(userId, id)
    else await deleteHabit(userId, id)
    setHabits((prev) => prev?.filter((h) => h.id !== id) ?? null)
  }

  const synced = habits?.filter((h) => !h.pending) ?? []
  const activeCount = synced.filter((h) => h.isActive).length
  const doneCount = synced.filter((h) => h.isActive && h.logDates.includes(todayDate)).length
  const queuedCount = (habits?.length ?? 0) - synced.length

  let habitList
  if (loadError) {
    habitList = (
      <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>Could not load habits: {loadError}</p>
        <button type="button" onClick={load} className="w-fit font-medium underline">
          Try again
        </button>
      </div>
    )
  } else if (!habits) {
    habitList = <p className="text-sm text-gray-500">Loading habits…</p>
  } else {
    habitList = (
      <>
        <AddHabitForm onAdd={handleAdd} />
        {habits.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            No habits yet. Add your first one above.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                today={todayDate}
                onRename={handleRename}
                onToggleActive={handleToggleActive}
                onToggleDone={handleToggleDone}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </>
    )
  }

  // Each section has its own boundary: a crash in one leaves the others working.
  return (
    <div className="flex flex-col gap-8">
      <ErrorBoundary name="Profile">
        <AvatarUploader userId={userId} email={user!.email ?? ''} />
      </ErrorBoundary>

      {habits && habits.length > 0 && (
        <ErrorBoundary name="Stats">
          <HabitStats habits={synced} today={todayDate} />
        </ErrorBoundary>
      )}

      <ErrorBoundary name="Habit list">
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">Habit Tracker</h1>
              <CrashButton label="Habit list" />
            </div>
            <ShareButton
              title="Habit Tracker"
              text={`I've done ${doneCount}/${activeCount} of my habits today on Habit Tracker!`}
              url={window.location.origin}
            />
          </div>
          {queuedCount > 0 && (
            <p role="status" className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {queuedCount} {queuedCount === 1 ? 'habit is' : 'habits are'} queued and will sync{' '}
              {online ? 'now…' : 'when you reconnect.'}
            </p>
          )}
          {syncError && <p className="text-xs text-red-600">{syncError}</p>}
          {habitList}
        </section>
      </ErrorBoundary>
    </div>
  )
}

export default Habits
