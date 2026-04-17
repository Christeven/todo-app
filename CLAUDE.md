# Todo App — CLAUDE.md

## Description
Application de gestion de tâches déployée sur un tenant Microsoft. Interface en français.

## Stack technique
- **React 19** + **TypeScript** (strict)
- **Vite 8** (bundler)
- **CSS** natif (pas de framework UI)
- Pas de base de données — état géré en mémoire React (`useState`)

## Structure du projet
```
src/
├── App.tsx       ← composant unique (toute la logique et le JSX)
├── App.css       ← styles
├── main.tsx      ← point d'entrée
docs/
└── superpowers/
    ├── specs/    ← designs validés
    └── plans/    ← plans d'implémentation
```

## Commandes
```bash
npm run dev       # démarrer le serveur de développement (http://localhost:5173)
npm run build     # build de production
npm run lint      # vérifier le code
npx tsc --noEmit  # vérifier TypeScript sans compiler
```

## Conventions
- Langue de l'interface : **français**
- Un seul composant `App.tsx` — ne pas éclater en sous-composants sans raison
- Pas de bibliothèques externes sauf si absolument nécessaire
- CSS en classes dédiées, pas de styles inline
- Toujours valider avec `npx tsc --noEmit` avant de committer

## Fonctionnalités actuelles
- Ajout / édition / suppression de tâches
- Dates de début et de fin (avec indicateur de retard)
- Assignation obligatoire à une personne (champ "Assigné à" avec autocomplétion via `<datalist>`)
- Filtres : Toutes / En cours / Complétées
- Interface en sidebar + zone principale

## Historique des sessions

### Session 2026-04-14
**Fonctionnalité ajoutée :** Champ "Assigné à" obligatoire avec autocomplétion
- Champ texte libre, obligatoire à la création et à l'édition
- Autocomplétion via `<datalist>` HTML natif — noms dédupliqués extraits des tâches existantes
- Affichage sur chaque tâche avec icône 👤
- Boutons "Ajouter" et "Enregistrer" désactivés si champ vide
- Même validation via le clavier (Enter bloqué si champ vide)
- CSS : `.assignee-edit-input` + `button:disabled`

**Commits :** b6ee0b8 → df3cde5

**État du projet :** Stable, toutes les fonctionnalités testées et validées.

**Prochaines idées potentielles :** (aucune décidée pour l'instant)

## Déploiement
- Hébergé sur tenant Microsoft (fonctionne en production)
- Développement local sur `http://localhost:5173` ou `5174` si le port est occupé
