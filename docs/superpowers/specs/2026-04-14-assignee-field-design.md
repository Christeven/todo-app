# Design : Champ "Assigné à" avec autocomplétion

**Date :** 2026-04-14
**Statut :** Approuvé

## Contexte

L'application todo-app permet de gérer des tâches avec texte, dates de début/fin et statut. L'utilisateur souhaite pouvoir assigner chaque tâche à une personne.

## Besoins

- Champ texte libre pour saisir le nom de la personne responsable de la tâche
- Champ **obligatoire** : on ne peut pas créer ou modifier une tâche sans renseigner ce champ
- **Autocomplétion** : les noms déjà utilisés dans les tâches existantes sont proposés

## Design retenu : Option B — Champ texte avec autocomplétion

### Données

- Ajout de `assignee: string` à l'interface `Todo`
- Ajout de `assignee: string` à l'interface `EditState`
- Ajout d'un state `const [assignee, setAssignee] = useState('')` pour le formulaire d'ajout (indépendant de `EditState`)
- La liste des suggestions pour l'autocomplétion est extraite dynamiquement depuis le tableau `todos`, **dédupliquée** via `Array.from(new Set(todos.map(t => t.assignee).filter(Boolean)))`
- Les suggestions sont **sensibles à la casse** (pas de normalisation)

### UI

- Formulaire d'ajout : champ "Assigné à" avec `<datalist>` HTML natif, obligatoire
- Affichage sur chaque tâche : `{todo.assignee && <span>👤 {todo.assignee}</span>}` dans `todo-dates`
- Formulaire d'édition : même champ avec autocomplétion, obligatoire

### Validation

- Le bouton "Ajouter" est désactivé si `assignee.trim()` est vide
- Le handler `onKeyDown` (Enter) dans le formulaire d'ajout doit aussi vérifier que `assignee.trim()` n'est pas vide avant d'appeler `addTodo()`
- La sauvegarde d'une édition est bloquée si `editState.assignee.trim()` est vide

### Réinitialisation après ajout

- Après un ajout réussi, `assignee` est réinitialisé à `''` (comme `input`, `startDate`, `endDate`)

## Fichiers impactés

- `src/App.tsx` : interfaces, state, logique, JSX
- `src/App.css` : style éventuel pour l'affichage du champ assigné
