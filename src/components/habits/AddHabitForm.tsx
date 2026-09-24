import { useState, type SubmitEvent } from 'react'

interface AddHabitFormProps {
  onAdd: (name: string) => Promise<void>
}

function AddHabitForm({ onAdd }: AddHabitFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name is required.')
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      await onAdd(trimmed)
      setName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add habit.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <label htmlFor="habit-name" className="text-sm font-semibold text-gray-900">
        New habit
      </label>
      <div className="flex gap-2">
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Meditate 10 minutes"
          className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add habit'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  )
}

export default AddHabitForm
