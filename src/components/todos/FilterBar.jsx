const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

function FilterBar({ filter, onFilterChange, activeCount, completedCount, onClearCompleted }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFilterChange(f.key)}
            className={
              filter === f.key
                ? 'rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white'
                : 'rounded-md px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900'
            }
          >
            {f.label}
          </button>
        ))}
        <span className="text-xs text-gray-500">{activeCount} left</span>
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-xs font-medium text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Clear completed
      </button>
    </div>
  )
}

export default FilterBar
