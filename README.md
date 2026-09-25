Ma Collection — React, FastAPI et PostgreSQL
Application web du projet « Ma Collection ». L'interface React utilise l'API REST FastAPI pour permettre à un utilisateur de parcourir un catalogue de jeux vidéo, de gérer sa collection personnelle et de consulter ses statistiques.

Prérequis
Pour lancer tout le projet avec Docker
Docker et Docker Compose.

Python 3 sur la machine pour exécuter start.sh et générer la configuration locale. Les dépendances Python et Node.js sont installées dans les conteneurs.

Les ports 5173, 8000 et 5432 doivent être disponibles.

Technologies utilisées
Frontend : React, TypeScript, Vite et react-router-dom.

Backend : Python et FastAPI.

Base de données : PostgreSQL.

Comment lancer le projet ?
Avec Docker — application complète
Après avoir récupéré le dépôt, ouvrir un terminal à la racine du projet et lancer :

bash
sh start.sh
Au premier démarrage, le script crée api/.env à partir de api/.env.example avec un mot de passe PostgreSQL et une clé JWT générés localement. Il ne modifie pas un api/.env déjà présent. Docker Compose construit et démarre db (PostgreSQL), api (FastAPI) et web (Vite). L'API exécute seed.py au démarrage pour peupler le catalogue de 40 jeux.

Site : http://localhost:5173

Documentation de l'API : http://localhost:8000/docs

API : http://localhost:8000

Pour vérifier l'état des conteneurs :

docker compose ps -a
Pour consulter les logs de l'API en cas d'erreur :

docker compose logs --tail=50 api
Pour arrêter les conteneurs sans effacer la base :

docker compose down
Le volume postgres_data conserve les données entre les démarrages. Ne pas lancer docker compose down -v si l'on veut les garder.

Frontend seul, sans Docker
L'API backend doit déjà être disponible sur http://localhost:8000. Dans un autre terminal, depuis la racine du projet :


cd web
npm install
npm run dev
Ce mode nécessite Node.js et npm sur la machine. Il ne démarre que le frontend ; il ne remplace pas le lancement complet avec Docker.

Architecture du projet
text
projet-react-fastapi/
├── api/              API FastAPI et script seed.py
├── web/              Interface React et TypeScript
├── compose.yaml      Services Docker
└── start.sh          Lancement complet
Dans le dossier web/, les fichiers sont organisés ainsi :

text
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
Fonctionnalités
Comptes
Inscription (email + mot de passe), connexion, déconnexion.

Token JWT stocké côté client et transmis via l'en-tête Authorization: Bearer <token>.

Chaque utilisateur accède uniquement à sa propre collection.

Catalogue (public)
Recherche par mot-clé avec debounce (~400 ms).

Filtre par catégorie et pagination.

Fiche détaillée d'un élément.

Collection personnelle (authentifié)
Ajout, modification et suppression d'une entrée (statut, note de 1 à 5, commentaire optionnel).

Routes /collection et /stats protégées : redirection vers /login si aucun token valide.

Filtres et statistiques
Filtre par statut, tri par date d'ajout ou par note.

Page de statistiques : total, répartition par statut, note moyenne.

API et données
L'API est documentée dans /docs. Elle propose notamment POST /auth/register, POST /auth/login, GET /items, GET /items/{item_id}, GET /me/collection et GET /me/stats. Les routes /me/* nécessitent un token Bearer.

Une seule base PostgreSQL contient le catalogue (items), les comptes (users) et les collections personnelles (collection_entries). Le seed alimente le catalogue au démarrage de l'API.

Configuration et sécurité
api/.env.example fournit la structure de la configuration sans secret réel. start.sh génère api/.env localement s'il n'existe pas. Le vrai fichier api/.env, le mot de passe PostgreSQL et la clé JWT ne doivent jamais être versionnés ni partagés. Le mot de passe d'un utilisateur est stocké sous forme hachée dans la base et n'est pas renvoyé par l'API.

Si l'API ne démarre pas, vérifier les logs avec docker compose logs --tail=50 api. Dans api/.env, la connexion à PostgreSQL doit viser db:5432 à l'intérieur de Docker ; le port 5173 correspond au frontend.

Auteurs
Zyad Laouani

Arthur Demarcq