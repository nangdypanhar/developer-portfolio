import { useCallback, useEffect, useState } from 'react'
import AddHabitForm from '../components/habits/AddHabitForm'
import HabitItem from '../components/habits/HabitItem'
import { useAuth } from '../context/AuthContext'
import { createHabit, deleteHabit, fetchHabits, setDoneOn, today, updateHabit } from '../lib/habits'
import type { Habit } from '../types/habit'

function Habits() {
  const { user } = useAuth()
  // ProtectedRoute guarantees a user here.
  const userId = user!.id
  const [habits, setHabits] = useState<Habit[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const todayDate = today()

  const load = useCallback(() => {
    setLoadError(null)
    setHabits(null)
    fetchHabits(userId)
      .then(setHabits)
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Failed to load habits.')
      })
  }, [userId])

  useEffect(load, [load])

  function replace(updated: Habit) {
    setHabits((prev) => prev?.map((h) => (h.id === updated.id ? updated : h)) ?? null)
  }

  async function handleAdd(name: string) {
    const habit = await createHabit(userId, name)
    setHabits((prev) => [...(prev ?? []), habit])
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
    await deleteHabit(userId, id)
    setHabits((prev) => prev?.filter((h) => h.id !== id) ?? null)
  }

  if (loadError) {
    return (
      <section className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <p>Could not load habits: {loadError}</p>
        <button type="button" onClick={load} className="w-fit font-medium underline">
          Try again
        </button>
      </section>
    )
  }

  if (!habits) {
    return <p className="text-sm text-gray-500">Loading habits…</p>
  }

  const doneCount = habits.filter((h) => h.logDates.includes(todayDate)).length

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Habit Tracker</h2>
        <span className="text-sm text-gray-500">
          {doneCount} / {habits.length} done today
        </span>
      </div>

      <AddHabitForm onAdd={handleAdd} />

      {habits.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          No habits yet. Add your first one above.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
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
    </section>
  )
}

export default Habits
