import { useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'

function DebounceDemo() {
  const [text, setText] = useState('')
  const debouncedText = useDebounce(text, 500)

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Debounce Demo</h2>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to see the difference…"
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4">
          <span className="text-xs font-medium text-gray-500">Raw value (every keystroke)</span>
          <span className="text-sm text-gray-900">{text || '—'}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4">
          <span className="text-xs font-medium text-gray-500">Debounced value (500ms after you stop)</span>
          <span className="text-sm text-gray-900">{debouncedText || '—'}</span>
        </div>
      </div>
    </section>
  )
}

export default DebounceDemo
