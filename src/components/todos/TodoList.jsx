function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="text-sm text-gray-500">No todos here.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
        >
          <label className="flex flex-1 items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'}>{todo.text}</span>
          </label>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="text-xs font-medium text-gray-400 transition-colors hover:text-red-600"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}

export default TodoList
