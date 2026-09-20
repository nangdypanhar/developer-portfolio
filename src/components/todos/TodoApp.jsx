import { useState } from 'react'
import AddTodo from './AddTodo'
import FilterBar from './FilterBar'
import TodoList from './TodoList'

const initialTodos = [
  { id: 't1', text: 'Lift the todo state into one owner', completed: true },
  { id: 't2', text: 'Wire up React Router', completed: false },
  { id: 't3', text: 'Handle fetch race conditions', completed: false },
]

function TodoApp() {
  const [todos, setTodos] = useState(initialTodos)
  const [filter, setFilter] = useState('all')

  function handleAddTodo(text) {
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text, completed: false }])
  }

  function handleToggleTodo(id) {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  function handleDeleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  function handleClearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Todos</h2>

      <AddTodo onAdd={handleAddTodo} />

      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={handleClearCompleted}
      />

      <TodoList todos={visibleTodos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />
    </section>
  )
}

export default TodoApp
