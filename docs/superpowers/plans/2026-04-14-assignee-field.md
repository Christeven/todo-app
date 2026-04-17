# Assignee Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a mandatory "Assigné à" text field with autocomplete to each todo task.

**Architecture:** All changes are contained in two files: `src/App.tsx` (data model, state, logic, JSX) and `src/App.css` (styling for the assignee display). The autocomplete uses the native HTML `<datalist>` element, with suggestions derived from existing todos.

**Tech Stack:** React 18, TypeScript, Vite, CSS (no new dependencies)

---

### Task 1: Mettre à jour le modèle de données et le state

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Ajouter `assignee` aux interfaces `Todo` et `EditState`**

Dans `src/App.tsx`, modifier les interfaces :

```typescript
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
```

- [ ] **Step 2: Ajouter le state `assignee` pour le formulaire d'ajout**

Dans la fonction `App()`, après la ligne `const [endDate, setEndDate] = useState('')` :

```typescript
const [assignee, setAssignee] = useState('')
```

- [ ] **Step 3: Mettre à jour `addTodo` pour inclure `assignee` et le valider**

Remplacer la fonction `addTodo` :

```typescript
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
```

- [ ] **Step 4: Mettre à jour `startEdit` pour inclure `assignee`**

Remplacer la fonction `startEdit` :

```typescript
const startEdit = (todo: Todo) => {
  setEditId(todo.id)
  setEditState({ text: todo.text, startDate: todo.startDate, endDate: todo.endDate, assignee: todo.assignee })
}
```

- [ ] **Step 5: Mettre à jour `saveEdit` pour valider `assignee`**

Remplacer la fonction `saveEdit` :

```typescript
const saveEdit = () => {
  if (!editState.text.trim() || !editState.assignee.trim()) return
  setTodos(todos.map(t => t.id === editId ? { ...t, ...editState, text: editState.text.trim(), assignee: editState.assignee.trim() } : t))
  setEditId(null)
}
```

- [ ] **Step 6: Calculer la liste dédupliquée des suggestions**

Dans la fonction `App()`, avant le `return`, ajouter :

```typescript
const assigneeSuggestions = Array.from(new Set(todos.map(t => t.assignee).filter(Boolean)))
```

- [ ] **Step 7: Vérifier que TypeScript compile sans erreurs**

```bash
cd todo-app && npx tsc --noEmit
```

Expected: aucune erreur

- [ ] **Step 8: Commit**

```bash
cd todo-app && git add src/App.tsx && git commit -m "feat: add assignee field to Todo and EditState data model"
```

---

### Task 2: Mettre à jour le JSX — formulaire d'ajout

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Ajouter le `<datalist>` global et le champ "Assigné à" dans le formulaire d'ajout**

Le `<datalist>` doit être rendu **hors** du bloc conditionnel `view !== 'completed'` pour que l'autocomplétion fonctionne aussi lors de l'édition dans la vue "complétées".

Ajouter le `<datalist>` juste avant `{view !== 'completed' && (` :

```tsx
<datalist id="assignee-list">
  {assigneeSuggestions.map(name => (
    <option key={name} value={name} />
  ))}
</datalist>
```

Puis, dans `<div className="form-add">`, ajouter le champ après `<input className="input-text" ... />` et avant `<div className="date-row">` :

```tsx
<input
  type="text"
  list="assignee-list"
  value={assignee}
  onChange={e => setAssignee(e.target.value)}
  placeholder="Assigné à..."
  className="input-text"
/>
```

- [ ] **Step 2: Bloquer le bouton "Ajouter" si `assignee` est vide**

Modifier le bouton dans `<div className="date-row">` :

```tsx
<button onClick={addTodo} disabled={!input.trim() || !assignee.trim()}>Ajouter</button>
```

- [ ] **Step 3: Mettre à jour le handler `onKeyDown` du champ texte principal**

Modifier l'attribut `onKeyDown` de l'input principal (texte de la tâche) :

```tsx
onKeyDown={e => e.key === 'Enter' && input.trim() && assignee.trim() && addTodo()}
```

- [ ] **Step 4: Vérifier dans le navigateur**

Ouvrir `http://localhost:5174/`. Vérifier :
- Le champ "Assigné à" apparaît sous le champ texte
- Le bouton "Ajouter" est grisé si le champ est vide
- Après ajout d'une tâche, le champ se vide

- [ ] **Step 5: Commit**

```bash
cd todo-app && git add src/App.tsx && git commit -m "feat: add assignee input with datalist autocomplete to add form"
```

---

### Task 3: Mettre à jour le JSX — affichage et formulaire d'édition

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Afficher l'assigné sur chaque tâche**

Dans `<div className="todo-dates">`, ajouter après les spans de dates :

```tsx
{todo.assignee && <span>👤 {todo.assignee}</span>}
```

- [ ] **Step 2: Ajouter le champ "Assigné à" dans le formulaire d'édition**

Dans `<div className="edit-block">`, dans `<div className="date-row">`, ajouter un champ assignee avant le bouton save :

```tsx
<label>
  Assigné à
  <input
    type="text"
    list="assignee-list"
    value={editState.assignee}
    onChange={e => setEditState({ ...editState, assignee: e.target.value })}
    className="input-text"
    style={{ marginBottom: 0, width: 'auto' }}
  />
</label>
```

- [ ] **Step 3: Bloquer le bouton "Enregistrer" si `assignee` est vide**

Modifier le bouton save dans `edit-block` :

```tsx
<button className="save" onClick={saveEdit} disabled={!editState.text.trim() || !editState.assignee.trim()}>✓ Enregistrer</button>
```

- [ ] **Step 4: Vérifier dans le navigateur**

Ouvrir `http://localhost:5174/`. Vérifier :
- L'assigné apparaît avec 👤 sous le texte de chaque tâche
- En mode édition, le champ "Assigné à" est pré-rempli
- L'autocomplétion propose les noms existants
- Le bouton "Enregistrer" est bloqué si le champ est vide

- [ ] **Step 5: Commit**

```bash
cd todo-app && git add src/App.tsx && git commit -m "feat: display assignee on tasks and add assignee field to edit form"
```

---

### Task 4: Ajouter le style CSS pour le bouton désactivé

**Files:**
- Modify: `src/App.css`

- [ ] **Step 1: Ajouter le style pour les boutons désactivés**

À la fin de `src/App.css`, ajouter :

```css
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

- [ ] **Step 2: Vérifier dans le navigateur**

Vérifier que le bouton "Ajouter" apparaît bien grisé quand le champ est vide.

- [ ] **Step 3: Commit**

```bash
cd todo-app && git add src/App.css && git commit -m "style: add disabled state for buttons"
```
