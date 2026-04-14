import { useState } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  done: boolean
  startDate: string
  endDate: string
  assignee: string
}

interface EditState {
  text: string
  startDate: string
  endDate: string
  assignee: string
}

type MenuView = 'all' | 'pending' | 'completed'

function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function isOverdue(todo: Todo) {
  if (todo.done || !todo.endDate) return false
  return new Date(todo.endDate) < new Date()
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setValue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editState, setEditState] = useState<EditState>({ text: '', startDate: '', endDate: '', assignee: '' })
  const [view, setView] = useState<MenuView>('all')

  const addTodo = () => {
    if (!input.trim() || !assignee.trim()) return
    setTodos([...todos, {
      id: Date.now(),
      text: input.trim(),
      done: false,
      startDate,
      endDate,
      assignee: assignee.trim(),
    }])
    setValue('')
    setStartDate('')
    setEndDate('')
    setAssignee('')
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
    setEditState({ text: todo.text, startDate: todo.startDate, endDate: todo.endDate, assignee: todo.assignee })
  }

  const saveEdit = () => {
    if (!editState.text.trim() || !editState.assignee.trim()) return
    setTodos(todos.map(t => t.id === editId ? { ...t, ...editState, text: editState.text.trim(), assignee: editState.assignee.trim() } : t))
    setEditId(null)
  }

  const cancelEdit = () => setEditId(null)

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

  const assigneeSuggestions = Array.from(new Set(todos.map(t => t.assignee).filter(Boolean)))

  return (
    <div className="layout">
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

      <main className="main">
        <h1>
          {view === 'all' && 'Toutes les tâches'}
          {view === 'pending' && 'Tâches en cours'}
          {view === 'completed' && 'Tâches complétées'}
        </h1>

        <datalist id="assignee-list">
          {assigneeSuggestions.map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>

        {view !== 'completed' && (
          <div className="form-add">
            <input
              type="text"
              value={input}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input.trim() && assignee.trim() && addTodo()}
              placeholder="Nouvelle tâche..."
              className="input-text"
            />
            <input
              type="text"
              list="assignee-list"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input.trim() && assignee.trim() && addTodo()}
              placeholder="Assigné à..."
              className="input-text"
            />
            <div className="date-row">
              <label>
                Début
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </label>
              <label>
                Fin
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </label>
              <button onClick={addTodo} disabled={!input.trim() || !assignee.trim()}>Ajouter</button>
            </div>
          </div>
        )}

        {filteredTodos.length === 0 && (
          <p className="empty">Aucune tâche ici.</p>
        )}

        <ul>
          {filteredTodos.map(todo => (
            <li key={todo.id} className={[
              todo.done ? 'done' : '',
              isOverdue(todo) ? 'overdue' : ''
            ].join(' ')}>
              {editId === todo.id ? (
                <div className="edit-block">
                  <input
                    type="text"
                    value={editState.text}
                    onChange={e => setEditState({ ...editState, text: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter' && editState.assignee.trim()) saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                    autoFocus
                    className="input-text"
                  />
                  <div className="date-row">
                    <label>
                      Début
                      <input type="date" value={editState.startDate} onChange={e => setEditState({ ...editState, startDate: e.target.value })} />
                    </label>
                    <label>
                      Fin
                      <input type="date" value={editState.endDate} onChange={e => setEditState({ ...editState, endDate: e.target.value })} />
                    </label>
                    <label>
                      Assigné à
                      <input
                        type="text"
                        list="assignee-list"
                        value={editState.assignee}
                        onChange={e => setEditState({ ...editState, assignee: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                        className="input-text assignee-edit-input"
                      />
                    </label>
                    <button className="save" onClick={saveEdit} disabled={!editState.text.trim() || !editState.assignee.trim()}>✓ Enregistrer</button>
                    <button className="cancel" onClick={cancelEdit}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="todo-info">
                    <span className="todo-text" onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
                    <div className="todo-dates">
                      {todo.startDate && <span>📅 Début : {formatDate(todo.startDate)}</span>}
                      {todo.endDate && (
                        <span className={isOverdue(todo) ? 'date-overdue' : ''}>
                          🏁 Fin : {formatDate(todo.endDate)}
                          {isOverdue(todo) && ' — En retard'}
                        </span>
                      )}
                      {todo.assignee && <span>👤 {todo.assignee}</span>}
                    </div>
                  </div>
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
          <p className="counter">{counts.completed} / {counts.all} tâches complétées</p>
        )}
      </main>
    </div>
  )
}

export default App
