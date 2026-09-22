# Ma Collection — Frontend (React + TypeScript)

Interface web du projet « Ma Collection ». Cette application utilise l'API REST FastAPI (dossier `api/`) pour permettre à un utilisateur de parcourir un catalogue, de gérer sa collection personnelle et de consulter ses statistiques.

## Prérequis

### Langages & Framework

- React
- TypeScript
- Python

### Librairies

- react-router-dom

## Comment lancer le projet ?

L'API backend (FastAPI) doit être démarrée au préalable sur `http://localhost:8000` (voir le README du dossier `api/`).

```bash
npm run dev
```

## Architecture du projet

```
web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   │   └── api.ts
│   ├── router/
│   └── App.tsx
├── .env.example
├── tsconfig.json
└── package.json
```

## Fonctionnalités

### Comptes

- Inscription (email + mot de passe), connexion, déconnexion.
- Token JWT stocké côté client et transmis via l'en-tête `Authorization: Bearer <token>`

### Catalogue (public)

- Recherche par mot-clé avec debounce (~400 ms).
- Filtre par catégorie et pagination.
- Fiche détaillée d'un élément.

### Collection personnelle (authentifié)

- Ajout, modification et suppression d'une entrée (statut, note de 1 à 5, commentaire optionnel).
- Routes `/collection` et `/stats` protégées : redirection vers `/login` si aucun token valide.

### Filtres et statistiques

- Filtre par statut, tri par date d'ajout ou par note.
- Page de statistiques : total, répartition par statut, note moyenne.

## Auteurs

- *(à compléter)*
