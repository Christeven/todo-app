import { useState } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  done: boolean
}

type MenuView = 'all' | 'pending' | 'completed'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setValue] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [view, setView] = useState<MenuView>('all')

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input.trim(), done: false }])
    setValue('')
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return
    setTodos(todos.filter(t => t.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (!editText.trim()) return
    setTodos(todos.map(t => t.id === editId ? { ...t, text: editText.trim() } : t))
    setEditId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }

  const filteredTodos = todos.filter(t => {
    if (view === 'pending') return !t.done
    if (view === 'completed') return t.done
    return true
  })

  const counts = {
    all: todos.length,
    pending: todos.filter(t => !t.done).length,
    completed: todos.filter(t => t.done).length,
  }

  return (
    <div className="layout">
      {/* Menu latéral */}
      <nav className="sidebar">
        <h2>Tâches</h2>
        <ul>
          <li className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>
            Toutes <span className="badge">{counts.all}</span>
          </li>
          <li className={view === 'pending' ? 'active' : ''} onClick={() => setView('pending')}>
            En cours <span className="badge">{counts.pending}</span>
          </li>
          <li className={view === 'completed' ? 'active' : ''} onClick={() => setView('completed')}>
            Complétées <span className="badge">{counts.completed}</span>
          </li>
        </ul>
      </nav>

      {/* Contenu principal */}
      <main className="main">
        <h1>
          {view === 'all' && 'Toutes les tâches'}
          {view === 'pending' && 'Tâches en cours'}
          {view === 'completed' && 'Tâches complétées'}
        </h1>

        {view !== 'completed' && (
          <div className="input-row">
            <input
              type="text"
              value={input}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTodo()}
              placeholder="Nouvelle tâche..."
            />
            <button onClick={addTodo}>Ajouter</button>
          </div>
        )}

        {filteredTodos.length === 0 && (
          <p className="empty">Aucune tâche ici.</p>
        )}

        <ul>
          {filteredTodos.map(todo => (
            <li key={todo.id} className={todo.done ? 'done' : ''}>
              {editId === todo.id ? (
                <div className="edit-row">
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <button className="save" onClick={saveEdit}>✓</button>
                  <button className="cancel" onClick={cancelEdit}>✕</button>
                </div>
              ) : (
                <>
                  <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                  <div className="actions">
                    <button className="edit" onClick={() => startEdit(todo)} title="Modifier">✏️</button>
                    <button className="delete" onClick={() => deleteTodo(todo.id)} title="Supprimer">🗑️</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {todos.length > 0 && (
          <p className="counter">
            {counts.completed} / {counts.all} tâches complétées
          </p>
        )}
      </main>
    </div>
  )
}

export default App
