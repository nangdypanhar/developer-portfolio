import { useState } from 'react'
import type { Habit } from '../../types/habit'

interface HabitItemProps {
  habit: Habit
  today: string
  onRename: (id: string, name: string) => Promise<void>
  onToggleActive: (id: string, isActive: boolean) => Promise<void>
  onToggleDone: (id: string, done: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function HabitItem({ habit, today, onRename, onToggleActive, onToggleDone, onDelete }: HabitItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(habit.name)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const doneToday = habit.logDates.includes(today)

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  function handleSave() {
    const trimmed = draft.trim()
    if (!trimmed) {
      setError('Name is required.')
      return
    }
    run(async () => {
      await onRename(habit.id, trimmed)
      setEditing(false)
    })
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${habit.name}" and all of its logs?`)) return
    run(() => onDelete(habit.id))
  }

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="checkbox"
          aria-label={`Done today: ${habit.name}`}
          checked={doneToday}
          disabled={busy || !habit.isActive}
          onChange={(e) => run(() => onToggleDone(habit.id, e.target.checked))}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />

        {editing ? (
          <input
            type="text"
            aria-label="Habit name"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setDraft(habit.name)
                setEditing(false)
              }
            }}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          />
        ) : (
          <span
            className={`flex-1 text-sm ${habit.isActive ? 'text-gray-900' : 'text-gray-400 line-through'} ${
              doneToday ? 'font-semibold' : ''
            }`}
          >
            {habit.name}
          </span>
        )}

        <span className="text-xs text-gray-500">
          {habit.logDates.length} {habit.logDates.length === 1 ? 'day' : 'days'} logged
        </span>

        <div className="flex items-center gap-2 text-xs font-medium">
          {editing ? (
            <>
              <button type="button" disabled={busy} onClick={handleSave} className="text-indigo-600 hover:text-indigo-700">
                Save
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setDraft(habit.name)
                  setEditing(false)
                }}
                className="text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </>
          ) : (
            <button type="button" disabled={busy} onClick={() => setEditing(true)} className="text-gray-500 hover:text-gray-900">
              Edit
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => onToggleActive(habit.id, !habit.isActive))}
            className="text-gray-500 hover:text-gray-900"
          >
            {habit.isActive ? 'Pause' : 'Resume'}
          </button>
          <button type="button" disabled={busy} onClick={handleDelete} className="text-gray-500 hover:text-red-600">
            Delete
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  )
}

export default HabitItem
